import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const maxUrlsPerSitemap = 45000

export async function GET(
    request: NextRequest,
    { params }: { params: { page: string } }
) {
    try {
        const page = parseInt(params.page) || 0
        const skip = page * maxUrlsPerSitemap
        const urlSite = process.env.Site_URL!

        // Récupérer les categories uniques avec pagination
        const categories = await prisma.$queryRawUnsafe<Array<{ name: string, lastModified: Date }>>(
            `SELECT c.name, 
                MAX(v.createdAt) as lastModified
            FROM Categorie c
            INNER JOIN Videos v ON c.idVideo = v.id
            GROUP BY c.name
            HAVING COUNT(*) >= 3
            ORDER BY c.name ASC
            LIMIT ${skip}, ${maxUrlsPerSitemap}`
        )

        // Générer le XML du sitemap
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categories.map(category => {
    const encodedName = encodeURIComponent(category.name)
    const lastmod = category.lastModified ? new Date(category.lastModified).toISOString() : new Date().toISOString()
    return `  <url>
    <loc>${urlSite}categorie/${encodedName}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
}).join('\n')}
</urlset>`

        await prisma.$disconnect()
        return new NextResponse(sitemap, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
            }
        })
    } catch (error) {
        await prisma.$disconnect()
        console.error('Error generating categories sitemap:', error)
        return new NextResponse('Error generating sitemap', { status: 500 })
    }
}

