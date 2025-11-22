import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma';
import { CHUNK } from '@/lib/sitemap-config';

export const revalidate = 3600 * 12; // 12 hours - cache pour optimiser les performances

/**
 * Génère la liste des sitemaps nécessaires en fonction du nombre total de vidéos
 * Cette fonction est appelée automatiquement par Next.js pour créer un index de sitemaps
 */
export async function generateSitemaps() {
    
    // Récupère le nombre total de vidéos dans la base de données
    const totalVideos = await prisma.videos.count();
    
    // Calcule le nombre de sitemaps nécessaires (arrondi à l'entier supérieur)
    const numberOfSitemaps = Math.ceil(totalVideos / CHUNK);
    
    // Génère un tableau d'IDs de 0 à numberOfSitemaps - 1
    // Exemple: si 120 vidéos -> 3 sitemaps -> [{ id: 0 }, { id: 1 }, { id: 2 }]
    const sitemaps = Array.from({ length: numberOfSitemaps }, (_, i) => ({ id: i }));
    
    return sitemaps;
}

/**
 * Génère le contenu d'un sitemap spécifique en fonction de son ID
 * @param id - L'identifiant du sitemap (0, 1, 2, etc.)
 * @returns Un tableau d'entrées de sitemap contenant les URLs des vidéos
 */
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {

    // Calcule la pagination pour ce sitemap
    // Exemple: sitemap id=0 -> vidéos 0-48999, id=1 -> vidéos 49000-97999, etc.
    const skip = id * CHUNK;
    const take = CHUNK;

    // Récupère les vidéos triées par date décroissante (plus récentes en premier)
    // Cela améliore le SEO car Google découvre d'abord les nouvelles vidéos
    const videos = await prisma.videos.findMany({
        select: {
            id: true,
            title: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc', // Plus récentes en premier pour meilleur SEO
        },
        skip,
        take,
    });

    // Transforme chaque vidéo en entrée de sitemap
    const sitemapEntries = videos.map(({ id, title, createdAt }) => ({
        url: `${process.env.Site_URL}videos/${id}?name=${encodeURIComponent(title)}`,
        lastModified: createdAt || new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    return sitemapEntries;
}