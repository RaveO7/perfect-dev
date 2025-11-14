import { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

type SitemapEntry = MetadataRoute.Sitemap[number]

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = normalizeBaseUrl(process.env.Site_URL)
    const prisma = new PrismaClient()

    try {
        const [videoEntries, ...collectionEntries] = await Promise.all([
            getVideoEntries(prisma, baseUrl),
            ...collectionConfigs.map((config) => getCollectionEntries(prisma, baseUrl, config)),
        ])

        return [
            ...getStaticEntries(baseUrl),
            ...videoEntries,
            ...collectionEntries.flat(),
        ]
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

type VideoRow = { id: number; createdAt: Date }

async function getVideoEntries(prisma: PrismaClient, baseUrl: string): Promise<MetadataRoute.Sitemap> {
    const videos: VideoRow[] = await prisma.videos.findMany({
        select: { id: true, createdAt: true },
        orderBy: { id: 'desc' },
    })

    return videos.map((video: VideoRow) => ({
        url: `${baseUrl}/videos/${video.id}`,
        lastModified: video.createdAt,
        changeFrequency: 'weekly',
        priority: 0.7,
    }))
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