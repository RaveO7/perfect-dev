import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MAX_URLS_PER_SITEMAP = 50000
const VIDEOS_PER_SITEMAP = Math.floor(MAX_URLS_PER_SITEMAP * 0.8)

export async function GET(
    request: NextRequest,
    { params }: { params: { page: string } }
) {
    try {
        const page = parseInt(params.page) || 0
        const skip = page * VIDEOS_PER_SITEMAP
        const urlSite: string = process.env.Site_URL!

        const videos = await prisma.videos.findMany({
            select: {
                id: true,
                createdAt: true,
            },
            skip: skip,
            take: VIDEOS_PER_SITEMAP,
            orderBy: {
                createdAt: 'desc',
            },
        })

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${videos.map((video) => `  <url>
    <loc>${urlSite}videos/${video.id}</loc>
    <lastmod>${video.createdAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

        await prisma.$disconnect()
        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml',
            },
        })
    } catch (error) {
        console.error('Error generating videos sitemap:', error)
        await prisma.$disconnect()
        return new NextResponse('Error generating sitemap', { status: 500 })
    }
}

