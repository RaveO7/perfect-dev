import { prisma } from '@/lib/prisma'
import { CHUNK } from '@/lib/sitemap-config'
import { normalizeUrl } from '@/components/Utils'

export const revalidate = 3600 * 24 // 1 day

export async function GET() {
    const urlSite = normalizeUrl(process.env.Site_URL || '')
    const now = new Date().toISOString()

    // ---- Counts ----
    const totalVideos = await prisma.videos.count()
    const numberOfVideoSitemaps = Math.max(1, Math.ceil(totalVideos / CHUNK))

    const actorsCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM (
            SELECT name FROM Actor GROUP BY name HAVING COUNT(*) >= 3
        ) as sub
    `
    const numberOfActorSitemaps = Math.max(
        1,
        Math.ceil(Number(actorsCount[0]?.count ?? 0) / CHUNK)
    )

    const categoriesCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM (
            SELECT name FROM Categorie GROUP BY name HAVING COUNT(*) >= 3
        ) as sub
    `
    const numberOfCategorySitemaps = Math.max(
        1,
        Math.ceil(Number(categoriesCount[0]?.count ?? 0) / CHUNK)
    )

    const channelsCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM (
            SELECT name FROM Channel GROUP BY name HAVING COUNT(*) >= 3
        ) as sub
    `
    const numberOfChannelSitemaps = Math.max(
        1,
        Math.ceil(Number(channelsCount[0]?.count ?? 0) / CHUNK)
    )

    // ---- Build XML ----
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

    // Fresh videos sitemap
    xml += `  <sitemap>
        <loc>${normalizeUrl(urlSite, 'sitemaps/video-fresh/sitemap.xml')}</loc>
        <lastmod>${now}</lastmod>
    </sitemap>\n`

    // Video sitemaps
    for (let i = 0; i < numberOfVideoSitemaps; i++) {
        xml += `  <sitemap>
        <loc>${normalizeUrl(urlSite, `sitemaps/video/sitemap/${i}.xml`)}</loc>
        <lastmod>${now}</lastmod>
    </sitemap>\n`
    }

    // Actor sitemaps
    for (let i = 0; i < numberOfActorSitemaps; i++) {
        xml += `  <sitemap>
        <loc>${normalizeUrl(urlSite, `sitemaps/actor/sitemap/${i}.xml`)}</loc>
        <lastmod>${now}</lastmod>
    </sitemap>\n`
    }

    // Category sitemaps
    for (let i = 0; i < numberOfCategorySitemaps; i++) {
        xml += `  <sitemap>
        <loc>${normalizeUrl(urlSite, `sitemaps/categorie/sitemap/${i}.xml`)}</loc>
        <lastmod>${now}</lastmod>
    </sitemap>\n`
    }

    // Channel sitemaps
    for (let i = 0; i < numberOfChannelSitemaps; i++) {
        xml += `  <sitemap>
        <loc>${normalizeUrl(urlSite, `sitemaps/channel/sitemap/${i}.xml`)}</loc>
        <lastmod>${now}</lastmod>
    </sitemap>\n`
    }

    xml += `</site
