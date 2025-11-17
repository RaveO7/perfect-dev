import { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MAX_URLS_PER_SITEMAP = 50000

export default async function sitemap(): Promise<MetadataRoute.Sitemap | MetadataRoute.Sitemap[]> {
    const urlSite: string = process.env.Site_URL!
    
    try {
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

        const totalDynamicUrls = videoCount + channelCount + pornstarCount + categoryCount
        const staticUrlsCount = 6 // accueil, contact, dmca, channel, pornstar, categorie
        
        // Si le total dépasse la limite, retourner seulement les pages statiques
        // Le sitemap index sera accessible via /api/sitemap-index
        if (totalDynamicUrls + staticUrlsCount > MAX_URLS_PER_SITEMAP) {
            // Retourner seulement les pages statiques dans le sitemap principal
            const staticPages: MetadataRoute.Sitemap = [
                {
                    url: `${urlSite}`,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: 1,
                },
                {
                    url: `${urlSite}contact`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.5,
                },
                {
                    url: `${urlSite}dmca`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.5,
                },
                {
                    url: `${urlSite}channel`,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: 0.9,
                },
                {
                    url: `${urlSite}pornstar`,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: 0.9,
                },
                {
                    url: `${urlSite}categorie`,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: 0.9,
                },
            ]

            await prisma.$disconnect()
            return staticPages
        } else {
            // Si on est sous la limite, retourner un sitemap normal
            const sitemapEntries: MetadataRoute.Sitemap = []

            // Page d'accueil
            sitemapEntries.push({
                url: `${urlSite}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            })

            // Pages statiques
            sitemapEntries.push({
                url: `${urlSite}contact`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
            })

            sitemapEntries.push({
                url: `${urlSite}dmca`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
            })

            // Pages de liste
            sitemapEntries.push({
                url: `${urlSite}channel`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            })

            sitemapEntries.push({
                url: `${urlSite}pornstar`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            })

            sitemapEntries.push({
                url: `${urlSite}categorie`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            })

            // Récupérer toutes les vidéos
            const videos = await prisma.videos.findMany({
                select: {
                    id: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            })

            videos.forEach((video: { id: number; createdAt: Date }) => {
                sitemapEntries.push({
                    url: `${urlSite}videos/${video.id}`,
                    lastModified: video.createdAt,
                    changeFrequency: 'weekly',
                    priority: 0.8,
                })
            })

            // Récupérer tous les channels
            const channels = await prisma.$queryRawUnsafe<Array<{ name: string }>>(`
                SELECT name 
                FROM Channel 
                GROUP BY name 
                HAVING COUNT(*) >= 3
            `)

            channels.forEach((channel: { name: string }) => {
                const encodedName = encodeURIComponent(channel.name)
                sitemapEntries.push({
                    url: `${urlSite}channel/${encodedName}`,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: 0.7,
                })
            })

            // Récupérer tous les pornstars
            const pornstars = await prisma.$queryRawUnsafe<Array<{ name: string }>>(`
                SELECT name 
                FROM Actor 
                GROUP BY name 
                HAVING COUNT(*) >= 3
            `)

            pornstars.forEach((pornstar: { name: string }) => {
                const encodedName = encodeURIComponent(pornstar.name)
                sitemapEntries.push({
                    url: `${urlSite}pornstar/${encodedName}`,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: 0.7,
                })
            })

            // Récupérer toutes les catégories
            const categories = await prisma.$queryRawUnsafe<Array<{ name: string }>>(`
                SELECT name 
                FROM Categorie 
                GROUP BY name 
                HAVING COUNT(*) >= 3
            `)

            categories.forEach((category: { name: string }) => {
                const encodedName = encodeURIComponent(category.name)
                sitemapEntries.push({
                    url: `${urlSite}categorie/${encodedName}`,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: 0.7,
                })
            })

            await prisma.$disconnect()
            return sitemapEntries
        }
    } catch (error) {
        console.error('Error generating sitemap:', error)
        await prisma.$disconnect()
        // Retourner au moins les pages statiques en cas d'erreur
        return [
            {
                url: `${urlSite}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
        ]
    }
}