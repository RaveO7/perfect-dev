import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { CHUNK } from '@/lib/sitemap-config'
import { normalizeUrl } from '@/components/Utils'

// Revalidation quotidienne
export const revalidate = 3600 * 24

export default async function sitemap(): Promise<MetadataRoute.SitemapIndex> {
    const urlSite = normalizeUrl(process.env.Site_URL || '')
    const now = new Date()

    // ---- Récupération des counts ----
    const totalVideos = await prisma.videos.count()
    const numberOfVideoSitemaps = Math.max(1, Math.ceil(totalVideos / CHUNK))

    const actorsCountResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count
        FROM (
            SELECT name FROM Actor
            GROUP BY name
            HAVING COUNT(*) >= 3
        ) as a`
    const totalActors = Number(actorsCountResult[0]?.count ?? 0)
    const numberOfActorSitemaps = Math.max(1, Math.ceil(totalActors / CHUNK))

    const categoriesCountResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count
        FROM (
            SELECT name FROM Categorie
            GROUP BY name
            HAVING COUNT(*) >= 3
        ) as c`
    const totalCategories = Number(categoriesCountResult[0]?.count ?? 0)
    const numberOfCategorySitemaps = Math.max(1, Math.ceil(totalCategories / CHUNK))

    const channelsCountResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count
        FROM (
            SELECT name FROM Channel
            GROUP BY name
            HAVING COUNT(*) >= 3
        ) as ch`
    const totalChannels = Number(channelsCountResult[0]?.count ?? 0)
    const numberOfChannelSitemaps = Math.max(1, Math.ceil(totalChannels / CHUNK))

    // ---- Construction du sitemap index ----
    const sitemapIndex: MetadataRoute.SitemapIndex = []

    // Fresh Videos Sitemap
    sitemapIndex.push({
        url: normalizeUrl(urlSite, 'sitemaps/video-fresh/sitemap.xml'),
        lastModified: now,
    })

    // Video sitemaps paginés
    for (let i = 0; i < numberOfVideoSitemaps; i++) {
        sitemapIndex.push({
            url: normalizeUrl(urlSite, `sitemaps/video/sitemap/${i}.xml`),
            lastModified: now,
        })
    }

    // Actor sitemaps paginés
    for (let i = 0; i < numberOfActorSitemaps; i++) {
        sitemapIndex.push({
            url: normalizeUrl(urlSite, `sitemaps/actor/sitemap/${i}.xml`),
            lastModified: now,
        })
    }

    // Category sitemaps paginés
    for (let i = 0; i < numberOfCategorySitemaps; i++) {
        sitemapIndex.push({
            url: normalizeUrl(urlSite, `sitemaps/categorie/sitemap/${i}.xml`),
            lastModified: now,
        })
    }

    // Channel sitemaps paginés
    for (let i = 0; i < numberOfChannelSitemaps; i++) {
        sitemapIndex.push({
            url: normalizeUrl(urlSite, `sitemaps/channel/sitemap/${i}.xml`),
            lastModified: now,
        })
    }

    return sitemapIndex
}
