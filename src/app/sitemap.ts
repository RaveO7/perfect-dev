import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { CHUNK } from '@/lib/sitemap-config'
import { normalizeUrl } from '@/components/Utils'

export const revalidate = 3600 * 24 // 1 day

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const urlSite = normalizeUrl(process.env.Site_URL || '')
    const now = new Date()

    /** ─────────── VIDEO COUNTS ─────────── */
    const totalVideos = await prisma.videos.count()
    const numberOfVideoSitemaps = Math.max(1, Math.ceil(totalVideos / CHUNK))

    /** ─────────── ACTORS COUNT ─────────── */
    const actorsCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM (
            SELECT name FROM Actor GROUP BY name HAVING COUNT(*) >= 3
        ) AS sub
    `
    const numberOfActorSitemaps = Math.max(
        1,
        Math.ceil(Number(actorsCount[0]?.count ?? 0) / CHUNK)
    )

    /** ─────────── CATEGORIES COUNT ─────────── */
    const categoriesCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM (
            SELECT name FROM Categorie GROUP BY name HAVING COUNT(*) >= 3
        ) AS sub
    `
    const numberOfCategorySitemaps = Math.max(
        1,
        Math.ceil(Number(categoriesCount[0]?.count ?? 0) / CHUNK)
    )

    /** ─────────── CHANNELS COUNT ─────────── */
    const channelsCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM (
            SELECT name FROM Channel GROUP BY name HAVING COUNT(*) >= 3
        ) AS sub
    `
    const numberOfChannelSitemaps = Math.max(
        1,
        Math.ceil(Number(channelsCount[0]?.count ?? 0) / CHUNK)
    )

    /** ─────────── XML SITEMAP INDEX LIST ─────────── */
    const items: MetadataRoute.Sitemap = []

    // Fresh video sitemap
    items.push({
        url: normalizeUrl(urlSite, 'sitemaps/video-fresh/sitemap.xml'),
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.6
    })

    // Video sitemaps
    for (let i = 0; i < numberOfVideoSitemaps; i++) {
        items.push({
            url: normalizeUrl(urlSite, `sitemaps/video/sitemap/${i}.xml`),
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.5
        })
    }

    // Actor sitemaps
    for (let i = 0; i < numberOfActorSitemaps; i++) {
        items.push({
            url: normalizeUrl(urlSite, `sitemaps/actor/sitemap/${i}.xml`),
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.4
        })
    }

    // Category sitemaps
    for (let i = 0; i < numberOfCategorySitemaps; i++) {
        items.push({
            url: normalizeUrl(urlSite, `sitemaps/categorie/sitemap/${i}.xml`),
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.4
        })
    }

    // Channel sitemaps
    for (let i = 0; i < numberOfChannelSitemaps; i++) {
        items.push({
            url: normalizeUrl(urlSite, `sitemaps/channel/sitemap/${i}.xml`),
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.4
        })
    }

    return items
}
