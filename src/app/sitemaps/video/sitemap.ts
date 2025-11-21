import { MetadataRoute } from 'next'
import { PrismaClient } from "@prisma/client";

// Nombre de vidéos par sitemap (limite recommandée pour optimiser les performances)
const VIDEOS_PER_SITEMAP = 49000;

/**
 * Génère la liste des sitemaps nécessaires en fonction du nombre total de vidéos
 * Cette fonction est appelée automatiquement par Next.js pour créer un index de sitemaps
 */
export async function generateSitemaps() {
    const prisma = new PrismaClient();
    
    // Récupère le nombre total de vidéos dans la base de données
    const totalVideos = await prisma.videos.count();
    
    // Calcule le nombre de sitemaps nécessaires (arrondi à l'entier supérieur)
    const numberOfSitemaps = Math.ceil(totalVideos / VIDEOS_PER_SITEMAP);
    
    // Génère un tableau d'IDs de 0 à numberOfSitemaps - 1
    // Exemple: si 120 vidéos -> 3 sitemaps -> [{ id: 0 }, { id: 1 }, { id: 2 }]
    const sitemaps = Array.from({ length: numberOfSitemaps }, (_, i) => ({ id: i }));
    
    await prisma.$disconnect();
    
    return sitemaps;
}

/**
 * Génère le contenu d'un sitemap spécifique en fonction de son ID
 * @param id - L'identifiant du sitemap (0, 1, 2, etc.)
 * @returns Un tableau d'entrées de sitemap contenant les URLs des vidéos
 */
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const prisma = new PrismaClient();

    // Calcule la plage d'IDs de vidéos pour ce sitemap
    // Exemple: sitemap id=0 -> vidéos 0-49, id=1 -> vidéos 50-99, etc.
    const start = id * VIDEOS_PER_SITEMAP;
    const end = start + VIDEOS_PER_SITEMAP;

    // Récupère les vidéos dans la plage calculée
    const videos = await prisma.videos.findMany({
        select: {
            id: true,
            title: true,
            createdAt: true,
        },
        where: {
            id: {
                gte: start,  // Supérieur ou égal à start
                lte: end,    // Inférieur ou égal à end
            },
        },
    });

    // Transforme chaque vidéo en entrée de sitemap
    const sitemapEntries = videos.map(({ id, title, createdAt }) => ({
        url: `${process.env.Site_URL}videos/${id}?name=${encodeURIComponent(title)}`,
        lastModified: createdAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }));

    await prisma.$disconnect();

    return sitemapEntries;
}