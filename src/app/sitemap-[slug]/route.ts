import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const maxUrlsPerSitemap = 45000

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
    try {
        // Gérer les params qui peuvent être une Promise dans Next.js 15+
        const resolvedParams = params instanceof Promise ? await params : params
        const slug = resolvedParams.slug || ''
        
        // Parser l'URL: sitemap-videos-0 -> type: 'videos', page: 0
        // ou sitemap-channels-1 -> type: 'channels', page: 1
        const match = slug.match(/^(videos|channels|categories|pornstars)-(\d+)$/)
        
        if (!match) {
            await prisma.$disconnect()
            return new NextResponse('Invalid sitemap URL format', { status: 404 })
        }

        const type = match[1]
        const page = parseInt(match[2]) || 0
        const skip = page * maxUrlsPerSitemap
        const urlSite = process.env.Site_URL!

        let sitemap = ''

        switch (type) {
            case 'videos': {
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

                sitemap = `<?xml version="1.0" encoding="UTF-8"?>
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
                break
            }

            case 'channels': {
                // Récupérer les channels uniques avec pagination
                const channels = await prisma.$queryRawUnsafe<Array<{ name: string, lastModified: Date }>>(
                    `SELECT c.name, 
                        MAX(v.createdAt) as lastModified
                    FROM Channel c
                    INNER JOIN Videos v ON c.idVideo = v.id
                    GROUP BY c.name
                    HAVING COUNT(*) >= 3
                    ORDER BY c.name ASC
                    LIMIT ${skip}, ${maxUrlsPerSitemap}`
                )

                sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${channels.map(channel => {
    const encodedName = encodeURIComponent(channel.name)
    const lastmod = channel.lastModified ? new Date(channel.lastModified).toISOString() : new Date().toISOString()
    return `  <url>
    <loc>${urlSite}channel/${encodedName}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
}).join('\n')}
</urlset>`
                break
            }

            case 'categories': {
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

                sitemap = `<?xml version="1.0" encoding="UTF-8"?>
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
                break
            }

            case 'pornstars': {
                // Récupérer les pornstars/actors uniques avec pagination
                const pornstars = await prisma.$queryRawUnsafe<Array<{ name: string, lastModified: Date }>>(
                    `SELECT a.name, 
                        MAX(v.createdAt) as lastModified
                    FROM Actor a
                    INNER JOIN Videos v ON a.idVideo = v.id
                    GROUP BY a.name
                    HAVING COUNT(*) >= 3
                    ORDER BY a.name ASC
                    LIMIT ${skip}, ${maxUrlsPerSitemap}`
                )

                sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pornstars.map(pornstar => {
    const encodedName = encodeURIComponent(pornstar.name)
    const lastmod = pornstar.lastModified ? new Date(pornstar.lastModified).toISOString() : new Date().toISOString()
    return `  <url>
    <loc>${urlSite}pornstar/${encodedName}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
}).join('\n')}
</urlset>`
                break
            }

            default:
                await prisma.$disconnect()
                return new NextResponse('Invalid sitemap type', { status: 404 })
        }

        await prisma.$disconnect()
        return new NextResponse(sitemap, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
            }
        })
    } catch (error) {
        await prisma.$disconnect()
        console.error('Error generating sitemap:', error)
        return new NextResponse('Error generating sitemap', { status: 500 })
    }
}

