import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // 1 hour - plus fréquent car contenu très récent

/**
 * Sitemap dédié aux vidéos récentes (7 derniers jours)
 * Ces vidéos ont une priority plus élevée pour être indexées rapidement
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    // Date d'il y a 7 jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Récupère les vidéos des 7 derniers jours, triées par date décroissante
    const recentVideos = await prisma.videos.findMany({
        select: {
            id: true,
            title: true,
            createdAt: true,
        },
        where: {
            createdAt: {
                gte: sevenDaysAgo, // Vidéos créées dans les 7 derniers jours
            },
        },
        orderBy: {
            createdAt: 'desc', // Plus récentes en premier
        },
        take: 1000, // Limite raisonnable pour un sitemap "fresh"
    });

    // Transforme chaque vidéo en entrée de sitemap avec priority élevée
    const sitemapEntries = recentVideos.map(({ id, title, createdAt }) => ({
        url: `${process.env.Site_URL}videos/${id}?name=${encodeURIComponent(title)}`,
        lastModified: createdAt || new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9, // Priority plus élevée pour les vidéos récentes
    }));

    return sitemapEntries;
}

