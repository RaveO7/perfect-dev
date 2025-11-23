import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma';
import { CHUNK } from '@/lib/sitemap-config';
import { normalizeUrl } from '@/components/Utils';

export const revalidate = 3600 * 24; // 24 hours - cache car moins fréquemment mis à jour

/**
 * Génère la liste des sitemaps nécessaires en fonction du nombre total de channels uniques
 * Cette fonction est appelée automatiquement par Next.js pour créer un index de sitemaps
 */
export async function generateSitemaps() {
    
    // Récupère le nombre total de channels uniques ayant au moins 3 vidéos
    // Un channel est unique par son nom (group by name)
    const totalChannels = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM (
            SELECT name 
            FROM Channel 
            GROUP BY name 
            HAVING COUNT(*) >= 3
        ) as channels_with_3_videos
    `;
    
    const count = Number(totalChannels[0]?.count || 0);
    
    // Calcule le nombre de sitemaps nécessaires (arrondi à l'entier supérieur)
    const numberOfSitemaps = Math.ceil(count / CHUNK);
    
    // Génère un tableau d'IDs de 0 à numberOfSitemaps - 1
    // Exemple: si 1200 channels -> 3 sitemaps -> [{ id: 0 }, { id: 1 }, { id: 2 }]
    const sitemaps = Array.from({ length: numberOfSitemaps }, (_, i) => ({ id: i }));
    
    return sitemaps;
}

/**
 * Génère le contenu d'un sitemap spécifique en fonction de son ID
 * @param id - L'identifiant du sitemap (0, 1, 2, etc.)
 * @returns Un tableau d'entrées de sitemap contenant les URLs des channels
 */
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {

    // Calcule la plage de channels pour ce sitemap avec pagination
    // Exemple: sitemap id=0 -> channels 0-48999, id=1 -> channels 49000-97999, etc.
    const start = id * CHUNK;
    const limit = CHUNK;

    // Récupère les channels uniques avec leur date de dernière modification
    // Un channel doit avoir au moins 3 vidéos pour être inclus dans le sitemap
    const channels = await prisma.$queryRaw<Array<{
        name: string;
        lastModified: Date;
    }>>`
        SELECT 
            c.name,
            MAX(v.createdAt) as lastModified
        FROM Channel c
        INNER JOIN Videos v ON c.idVideo = v.id
        GROUP BY c.name
        HAVING COUNT(*) >= 3
        ORDER BY c.name
        LIMIT ${limit}
        OFFSET ${start}
    `;

    // Transforme chaque channel en entrée de sitemap
    const sitemapEntries = channels.map(({ name, lastModified }) => ({
        url: normalizeUrl(process.env.Site_URL || '', `channel/${encodeURIComponent(name)}`),
        lastModified: lastModified || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.45,
    }));

    return sitemapEntries;
}