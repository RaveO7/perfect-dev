import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MAX_URLS_PER_SITEMAP = 50000

export async function GET() {
    try {
        const urlSite: string = process.env.Site_URL!

        // Compter le nombre total d'URLs dynamiques
        const [videoCount, channelCount, pornstarCount, categoryCount] = await Promise.all([
            prisma.videos.count(),
            prisma.$queryRawUnsafe<Array<{ count: bigint }>>(`
                SELECT COUNT(*) as count 
                FROM (
                    SELECT name 
                    FROM Channel 
                    GROUP BY name 
                    HAVING COUNT(*) >= 3
                ) as subquery
            `).then((result: Array<{ count: bigint }>) => Number(result[0]?.count || 0)),
            prisma.$queryRawUnsafe<Array<{ count: bigint }>>(`
                SELECT COUNT(*) as count 
                FROM (
                    SELECT name 
                    FROM Actor 
                    GROUP BY name 
                    HAVING COUNT(*) >= 3
                ) as subquery
            `).then((result: Array<{ count: bigint }>) => Number(result[0]?.count || 0)),
            prisma.$queryRawUnsafe<Array<{ count: bigint }>>(`
                SELECT COUNT(*) as count 
                FROM (
                    SELECT name 
                    FROM Categorie 
                    GROUP BY name 
                    HAVING COUNT(*) >= 3
                ) as subquery
            `).then((result: Array<{ count: bigint }>) => Number(result[0]?.count || 0)),
        ])

        // Calculer le nombre de sitemaps nécessaires
        const videosPerSitemap = Math.floor(MAX_URLS_PER_SITEMAP * 0.8)
        const channelsPerSitemap = Math.floor(MAX_URLS_PER_SITEMAP * 0.1)
        const pornstarsPerSitemap = Math.floor(MAX_URLS_PER_SITEMAP * 0.05)
        const categoriesPerSitemap = Math.floor(MAX_URLS_PER_SITEMAP * 0.05)

        const videoSitemapsCount = Math.ceil(videoCount / videosPerSitemap)
        const channelSitemapsCount = Math.ceil(channelCount / channelsPerSitemap)
        const pornstarSitemapsCount = Math.ceil(pornstarCount / pornstarsPerSitemap)
        const categorySitemapsCount = Math.ceil(categoryCount / categoriesPerSitemap)

        // Générer le sitemap index XML
        let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${urlSite}sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`

        // Ajouter les sitemaps de vidéos
        for (let i = 0; i < videoSitemapsCount; i++) {
            sitemapIndex += `
  <sitemap>
    <loc>${urlSite}api/sitemap/videos/${i}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
        }

        // Ajouter les sitemaps de channels
        for (let i = 0; i < channelSitemapsCount; i++) {
            sitemapIndex += `
  <sitemap>
    <loc>${urlSite}api/sitemap/channels/${i}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
        }

        // Ajouter les sitemaps de pornstars
        for (let i = 0; i < pornstarSitemapsCount; i++) {
            sitemapIndex += `
  <sitemap>
    <loc>${urlSite}api/sitemap/pornstars/${i}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
        }

        // Ajouter les sitemaps de catégories
        for (let i = 0; i < categorySitemapsCount; i++) {
            sitemapIndex += `
  <sitemap>
    <loc>${urlSite}api/sitemap/categories/${i}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
        }

        sitemapIndex += `
</sitemapindex>`

        await prisma.$disconnect()
        return new NextResponse(sitemapIndex, {
            headers: {
                'Content-Type': 'application/xml',
            },
        })
    } catch (error) {
        console.error('Error generating sitemap index:', error)
        await prisma.$disconnect()
        return new NextResponse('Error generating sitemap index', { status: 500 })
    }
}

