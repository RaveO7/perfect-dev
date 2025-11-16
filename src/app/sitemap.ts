import { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

type SitemapEntry = MetadataRoute.Sitemap[number]

// Keep well below the 50,000 URLs hard limit to leave headroom
const MAX_URLS_PER_SITEMAP = 45000

type CollectionConfig = {
    table: 'Channel' | 'Actor' | 'Categorie'
    urlPrefix: 'channel' | 'pornstar' | 'categorie'
    changeFrequency: NonNullable<SitemapEntry['changeFrequency']>
    priority: number
}

const collectionConfigs: CollectionConfig[] = [
    { table: 'Channel', urlPrefix: 'channel', changeFrequency: 'weekly', priority: 0.7 },
    { table: 'Actor', urlPrefix: 'pornstar', changeFrequency: 'weekly', priority: 0.7 },
    { table: 'Categorie', urlPrefix: 'categorie', changeFrequency: 'weekly', priority: 0.6 },
]

// For large sites, Next.js can generate multiple sitemaps.
// This function tells Next how many sitemap "segments" exist.
export async function generateSitemaps(): Promise<{ id: number }[]> {
	const prisma = new PrismaClient()
	try {
		const totalVideos = await prisma.videos.count()
		const videoSitemapCount = Math.ceil(totalVideos / MAX_URLS_PER_SITEMAP)

		// Counts for collections (distinct names)
		const [channelsCount, actorsCount, categoriesCount] = await Promise.all([
			getDistinctNameCount(prisma, 'Channel'),
			getDistinctNameCount(prisma, 'Actor'),
			getDistinctNameCount(prisma, 'Categorie'),
		])
		const channelPages = Math.ceil(channelsCount / MAX_URLS_PER_SITEMAP)
		const actorPages = Math.ceil(actorsCount / MAX_URLS_PER_SITEMAP)
		const categoriePages = Math.ceil(categoriesCount / MAX_URLS_PER_SITEMAP)

		// Segment layout:
		// 0: main static URLs only
		// 1..videoSitemapCount: video pages
		// next channelPages: channels
		// next actorPages: actors
		// next categoriePages: categories
		const totalSegments =
			1 +
			videoSitemapCount +
			channelPages +
			actorPages +
			categoriePages

		return Array.from({ length: totalSegments }, (_, id) => ({ id }))
	} finally {
		await prisma.$disconnect()
	}
}

// id maps as follows:
// - 0..videoSitemapCount-1: paginated video sitemaps
// - videoSitemapCount: static pages + collections
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const baseUrl = normalizeBaseUrl(process.env.Site_URL)
    const prisma = new PrismaClient()

    try {
		// Layout calc
		const totalVideos = await prisma.videos.count()
		const videoSitemapCount = Math.ceil(totalVideos / MAX_URLS_PER_SITEMAP)

		const [channelsCount, actorsCount, categoriesCount] = await Promise.all([
			getDistinctNameCount(prisma, 'Channel'),
			getDistinctNameCount(prisma, 'Actor'),
			getDistinctNameCount(prisma, 'Categorie'),
		])
		const channelPages = Math.ceil(channelsCount / MAX_URLS_PER_SITEMAP)
		const actorPages = Math.ceil(actorsCount / MAX_URLS_PER_SITEMAP)
		const categoriePages = Math.ceil(categoriesCount / MAX_URLS_PER_SITEMAP)

		// Segment 0: main static URLs only
		if (id === 0) {
			return getMainStaticEntries(baseUrl)
		}

		// Videos pages
		const videoStart = 1
		const videoEndExclusive = videoStart + videoSitemapCount
		if (id >= videoStart && id < videoEndExclusive) {
			const pageIndex = id - videoStart
			return getVideoEntriesPage(prisma, baseUrl, pageIndex, MAX_URLS_PER_SITEMAP)
		}

		// Channels pages
		const channelStart = videoEndExclusive
		const channelEndExclusive = channelStart + channelPages
		if (id >= channelStart && id < channelEndExclusive) {
			const pageIndex = id - channelStart
			return getCollectionEntriesPage(prisma, baseUrl, collectionConfigs[0], pageIndex, MAX_URLS_PER_SITEMAP)
		}

		// Actors pages
		const actorStart = channelEndExclusive
		const actorEndExclusive = actorStart + actorPages
		if (id >= actorStart && id < actorEndExclusive) {
			const pageIndex = id - actorStart
			return getCollectionEntriesPage(prisma, baseUrl, collectionConfigs[1], pageIndex, MAX_URLS_PER_SITEMAP)
		}

		// Categories pages
		const categorieStart = actorEndExclusive
		const categorieEndExclusive = categorieStart + categoriePages
		if (id >= categorieStart && id < categorieEndExclusive) {
			const pageIndex = id - categorieStart
			return getCollectionEntriesPage(prisma, baseUrl, collectionConfigs[2], pageIndex, MAX_URLS_PER_SITEMAP)
		}

		// Fallback to main static
		return getMainStaticEntries(baseUrl)
    } finally {
        await prisma.$disconnect()
    }
}

function normalizeBaseUrl(url: string | undefined): string {
    if (!url) {
        throw new Error('Site_URL env variable must be defined to generate the sitemap.')
    }
    return url.endsWith('/') ? url.slice(0, -1) : url
}

function getStaticEntries(baseUrl: string): MetadataRoute.Sitemap {
    const now = new Date()
    return [
        {
			url: `${baseUrl}`,
			lastModified: now,
			changeFrequency: 'daily',
			priority: 1,
        },
        {
			url: `${baseUrl}/channels`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
			url: `${baseUrl}/pornstars`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
			url: `${baseUrl}/categories`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
			url: `${baseUrl}/search`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
			url: `${baseUrl}/contact`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
			url: `${baseUrl}/dmca`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
    ]
}

// Main sitemap root segment per user request:
// /, /channel, /actor, /categorie, /search
function getMainStaticEntries(baseUrl: string): MetadataRoute.Sitemap {
	const now = new Date()
	return [
		{
			url: `${baseUrl}`,
			lastModified: now,
			changeFrequency: 'yearly',
			priority: 1,
		},
		{
			url: `${baseUrl}/channel`,
			lastModified: now,
			changeFrequency: 'yearly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/actor`,
			lastModified: now,
			changeFrequency: 'yearly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/categorie`,
			lastModified: now,
			changeFrequency: 'yearly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/search`,
			lastModified: now,
			changeFrequency: 'yearly',
			priority: 0.6,
		},
	]
}

type VideoRow = { id: number; createdAt: Date }

async function getVideoEntriesPage(
	prisma: PrismaClient,
	baseUrl: string,
	pageIndex: number,
	pageSize: number,
): Promise<MetadataRoute.Sitemap> {
	const videos: VideoRow[] = await prisma.videos.findMany({
		select: { id: true, createdAt: true },
		orderBy: { id: 'desc' },
		skip: pageIndex * pageSize,
		take: pageSize,
	})

    return videos.map((video: VideoRow) => ({
        url: `${baseUrl}/videos/${video.id}`,
        lastModified: video.createdAt,
        changeFrequency: 'weekly',
        priority: 0.7,
    }))
}

async function getDistinctNameCount(prisma: PrismaClient, table: CollectionConfig['table']): Promise<number> {
	// Safe because table name comes from a fixed union type
	const rows: Array<{ count: number }> = await prisma.$queryRawUnsafe(`
		SELECT COUNT(DISTINCT t.name) AS count
		FROM ${table} t
	`)
	return Number(rows?.[0]?.count ?? 0)
}

async function getCollectionEntries(
    prisma: PrismaClient,
    baseUrl: string,
    config: CollectionConfig,
): Promise<MetadataRoute.Sitemap> {
    type ResultRow = { name: string; lastModified: Date | null }

    const rows: ResultRow[] = await prisma.$queryRawUnsafe<ResultRow[]>(`
        SELECT t.name as name, MAX(v.createdAt) as lastModified
        FROM ${config.table} t
        INNER JOIN Videos v ON t.idVideo = v.id
        GROUP BY t.name
    `)

    const now = new Date()

    return rows
        .filter((row: ResultRow) => !!row?.name)
        .map((row: ResultRow) => ({
            url: `${baseUrl}/${config.urlPrefix}/${encodeURIComponent(row.name)}`,
            lastModified: row.lastModified ?? now,
            changeFrequency: config.changeFrequency,
            priority: config.priority,
        }))
}

async function getCollectionEntriesPage(
	prisma: PrismaClient,
	baseUrl: string,
	config: CollectionConfig,
	pageIndex: number,
	pageSize: number,
): Promise<MetadataRoute.Sitemap> {
	type ResultRow = { name: string; lastModified: Date | null }
	const offset = pageIndex * pageSize

	// Paginate distinct names deterministically by name ASC
	const rows: ResultRow[] = await prisma.$queryRawUnsafe<ResultRow[]>(`
		SELECT q.name, q.lastModified FROM (
			SELECT t.name as name, MAX(v.createdAt) as lastModified
			FROM ${config.table} t
			INNER JOIN Videos v ON t.idVideo = v.id
			GROUP BY t.name
		) q
		ORDER BY q.name ASC
		LIMIT ${pageSize} OFFSET ${offset}
	`)

	const now = new Date()
	return rows
		.filter((row: ResultRow) => !!row?.name)
		.map((row: ResultRow) => ({
			url: `${baseUrl}/${config.urlPrefix}/${encodeURIComponent(row.name)}`,
			lastModified: row.lastModified ?? now,
			changeFrequency: config.changeFrequency,
			priority: config.priority,
		}))
}