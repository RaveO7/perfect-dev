import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MAX_URLS_PER_SITEMAP = 50000
const PORNSTARS_PER_SITEMAP = Math.floor(MAX_URLS_PER_SITEMAP * 0.05)

// Revalidation ISR : régénère toutes les heures
export const revalidate = 3600

export async function GET(
    request: NextRequest,
    { params }: { params: { page: string } }
) {
    try {
        const page = parseInt(params.page) || 0
        const skip = page * PORNSTARS_PER_SITEMAP
        const urlSite: string = process.env.Site_URL!

        const pornstars = await prisma.$queryRawUnsafe<Array<{ name: string }>>(`
            SELECT name 
            FROM Actor 
            GROUP BY name 
            HAVING COUNT(*) >= 3
            ORDER BY name ASC
            LIMIT ${PORNSTARS_PER_SITEMAP}
            OFFSET ${skip}
        `)

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pornstars.map((pornstar) => {
            const encodedName = encodeURIComponent(pornstar.name)
            return `  <url>
    <loc>${urlSite}pornstar/${encodedName}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
        }).join('\n')}
</urlset>`

        await prisma.$disconnect()
        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
            },
        })
    } catch (error) {
        console.error('Error generating pornstars sitemap:', error)
        await prisma.$disconnect()
        return new NextResponse('Error generating sitemap', { status: 500 })
    }
}

