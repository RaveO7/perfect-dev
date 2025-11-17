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

        // Récupérer les videos avec pagination
        const videos = await prisma.videos.findMany({
            select: {
                id: true,
                createdAt: true,
            },
            orderBy: {
                id: 'desc'
            },
            skip: skip,
            take: maxUrlsPerSitemap
        })

        // Générer le XML du sitemap
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${videos.map(video => {
    const lastmod = video.createdAt ? new Date(video.createdAt).toISOString() : new Date().toISOString()
    return `  <url>
    <loc>${urlSite}videos/${video.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
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
        console.error('Error generating videos sitemap:', error)
        return new NextResponse('Error generating sitemap', { status: 500 })
    }
}

