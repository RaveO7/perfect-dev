import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const maxUrlsPerSitemap = 45000

export async function GET(request: NextRequest) {
    try {
        const urlSite = process.env.Site_URL!

        // Compter le nombre total de videos
        const totalVideos = await prisma.videos.count()
        const videoSitemapCount = Math.ceil(totalVideos / maxUrlsPerSitemap)
        
        // Compter le nombre total de channels uniques (avec au moins 3 videos)
        const totalChannels = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
            `SELECT COUNT(*) as count FROM (
                SELECT c.name
                FROM Channel c
                INNER JOIN Videos v ON c.idVideo = v.id
                GROUP BY c.name
                HAVING COUNT(*) >= 3
            ) as subquery`
        )
        const channelSitemapCount = Math.ceil(Number(totalChannels[0]?.count || 0) / maxUrlsPerSitemap)
        
        // Compter le nombre total de categories uniques (avec au moins 3 videos)
        const totalCategories = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
            `SELECT COUNT(*) as count FROM (
                SELECT c.name
                FROM Categorie c
                INNER JOIN Videos v ON c.idVideo = v.id
                GROUP BY c.name
                HAVING COUNT(*) >= 3
            ) as subquery`
        )
        const categorySitemapCount = Math.ceil(Number(totalCategories[0]?.count || 0) / maxUrlsPerSitemap)
        
        // Compter le nombre total de pornstars/actors uniques (avec au moins 3 videos)
        const totalPornstars = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
            `SELECT COUNT(*) as count FROM (
                SELECT a.name
                FROM Actor a
                INNER JOIN Videos v ON a.idVideo = v.id
                GROUP BY a.name
                HAVING COUNT(*) >= 3
            ) as subquery`
        )
        const pornstarSitemapCount = Math.ceil(Number(totalPornstars[0]?.count || 0) / maxUrlsPerSitemap)

        // Générer le XML du sitemap index
        let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${urlSite}sitemap</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`

        // Ajouter les sitemaps pour videos
        for (let i = 0; i < videoSitemapCount; i++) {
            sitemapIndex += `
  <sitemap>
    <loc>${urlSite}sitemap-videos-${i}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
        }
        
        // Ajouter les sitemaps pour channels
        for (let i = 0; i < channelSitemapCount; i++) {
            sitemapIndex += `
  <sitemap>
    <loc>${urlSite}sitemap-channels-${i}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
        }
        
        // Ajouter les sitemaps pour categories
        for (let i = 0; i < categorySitemapCount; i++) {
            sitemapIndex += `
  <sitemap>
    <loc>${urlSite}sitemap-categories-${i}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
        }
        
        // Ajouter les sitemaps pour pornstars
        for (let i = 0; i < pornstarSitemapCount; i++) {
            sitemapIndex += `
  <sitemap>
    <loc>${urlSite}sitemap-pornstars-${i}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
        }

        sitemapIndex += `
</sitemapindex>`

        await prisma.$disconnect()
        return new NextResponse(sitemapIndex, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
            }
        })
    } catch (error) {
        await prisma.$disconnect()
        console.error('Error generating sitemap index:', error)
        return new NextResponse('Error generating sitemap index', { status: 500 })
    }
}

