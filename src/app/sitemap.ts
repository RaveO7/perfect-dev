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

    /** ─────────── LAST VIDEO DATE ─────────── */
    const lastVideo = await prisma.videos.findFirst({
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
    })
    const lastVideoDate = lastVideo?.createdAt ?? now

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

    /** ─────────── CHANNEL COUNT ─────────── */
    const channelsCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM (
            SELECT name FROM Channel GROUP BY name HAVING COUNT(*) >= 3
        ) AS sub
    `
    const numberOfChannelSitemaps = Math.max(
        1,
        Math.ceil(Number(channelsCount[0]?.count ?? 0) / CHUNK)
    )

    /** ─────────── RETURN ALL SITEMAP ENTRIES ─────────── */

    const sitemapItems: MetadataRoute.Sitemap = []

    /** STATIC ROUTES — RESTORED */
    sitemapItems.push(
        {
            url: urlSite,
            lastModified: lastVideoDate,
            changeFrequency: "monthly",
            priority: 1
        },
        {
            url: normalizeUrl(urlSite, "channel"),
            lastModified: lastVideoDate,
            changeFrequency: "weekly",
            priority: 0.6
        },
        {
            url: normalizeUrl(urlSite, "actor"),
            lastModified: lastVideoDate,
            changeFrequency: "weekly",
            priority: 0.6
        },
        {
            url: normalizeUrl(urlSite, "categorie"),
            lastModified: lastVideoDate,
            changeFrequency: "weekly",
            priority: 0.6
        },
        {
            url: normalizeUrl(urlSite, "search"),
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.5
        }
    )

    /** SITEMAP: Fresh videos */
    sitemapItems.push({
        url: normalizeUrl(urlSite, 'sitemaps/video-fresh/sitemap.xml'),
        lastModified: lastVideoDate,
        changeFrequency: 'daily',
        priority: 0.6
    })

    /** VIDEO SITEMAPS */
    for (let i = 0; i < numberOfVideoSitemaps; i++) {
        sitemapItems.push({
            url: normalizeUrl(urlSite, `sitemaps/video/sitemap/${i}.xml`),
            lastModified: lastVideoDate,
            changeFrequency: 'daily',
            priority: 0.5
        })
    }

    /** ACTOR SITEMAPS */
    for (let i = 0; i < numberOfActorSitemaps; i++) {
        sitemapItems.push({
            url: normalizeUrl(urlSite, `sitemaps/actor/sitemap/${i}.xml`),
            lastModified: lastVideoDate,
            changeFrequency: 'weekly',
            priority: 0.4
        })
    }

    /** CATEGORY SITEMAPS */
    for (let i = 0; i < numberOfCategorySitemaps; i++) {
        sitemapItems.push({
            url: normalizeUrl(urlSite, `sitemaps/categorie/sitemap/${i}.xml`),
            lastModified: lastVideoDate,
            changeFrequency: 'weekly',
            priority: 0.4
        })
    }

    /** CHANNEL SITEMAPS */
    for (let i = 0; i < numberOfChannelSitemaps; i++) {
        sitemapItems.push({
            url: normalizeUrl(urlSite, `sitemaps/channel/sitemap/${i}.xml`),
            lastModified: lastVideoDate,
            changeFrequency: 'weekly',
            priority: 0.4
        })
    }

    return sitemapItems
}
