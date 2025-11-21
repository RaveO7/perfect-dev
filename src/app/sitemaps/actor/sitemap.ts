import { MetadataRoute } from 'next'
import { PrismaClient } from "@prisma/client";

// Nombre d'acteurs par sitemap (limite recommandée pour optimiser les performances)
const ACTORS_PER_SITEMAP = 49000;

/**
 * Génère la liste des sitemaps nécessaires en fonction du nombre total d'acteurs uniques
 * Cette fonction est appelée automatiquement par Next.js pour créer un index de sitemaps
 */
export async function generateSitemaps() {
    const prisma = new PrismaClient();
    
    // Récupère le nombre total d'acteurs uniques ayant au moins 3 vidéos
    // Un acteur est unique par son nom (group by name)
    const totalActors = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM (
            SELECT name 
            FROM Actor 
            GROUP BY name 
            HAVING COUNT(*) >= 3
        ) as actors_with_3_videos
    `;
    
    const count = Number(totalActors[0]?.count || 0);
    
    // Calcule le nombre de sitemaps nécessaires (arrondi à l'entier supérieur)
    const numberOfSitemaps = Math.ceil(count / ACTORS_PER_SITEMAP);
    
    // Génère un tableau d'IDs de 0 à numberOfSitemaps - 1
    // Exemple: si 1200 acteurs -> 3 sitemaps -> [{ id: 0 }, { id: 1 }, { id: 2 }]
    const sitemaps = Array.from({ length: numberOfSitemaps }, (_, i) => ({ id: i }));
    
    await prisma.$disconnect();
    
    return sitemaps;
}

/**
 * Génère le contenu d'un sitemap spécifique en fonction de son ID
 * @param id - L'identifiant du sitemap (0, 1, 2, etc.)
 * @returns Un tableau d'entrées de sitemap contenant les URLs des acteurs
 */
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const prisma = new PrismaClient();

    // Calcule la plage d'acteurs pour ce sitemap avec pagination
    // Exemple: sitemap id=0 -> acteurs 0-48999, id=1 -> acteurs 49000-97999, etc.
    const start = id * ACTORS_PER_SITEMAP;
    const limit = ACTORS_PER_SITEMAP;

    // Récupère les acteurs uniques avec leur date de dernière modification
    // Un acteur doit avoir au moins 3 vidéos pour être inclus dans le sitemap
    const actors = await prisma.$queryRaw<Array<{
        name: string;
        lastModified: Date;
    }>>`
        SELECT 
            a.name,
            MAX(v.createdAt) as lastModified
        FROM Actor a
        INNER JOIN Videos v ON a.idVideo = v.id
        GROUP BY a.name
        HAVING COUNT(*) >= 3
        ORDER BY a.name
        LIMIT ${limit}
        OFFSET ${start}
    `;

    // Transforme chaque acteur en entrée de sitemap
    const sitemapEntries = actors.map(({ name, lastModified }) => ({
        url: `${process.env.Site_URL}pornstar/${encodeURIComponent(name)}`,
        lastModified: lastModified || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    await prisma.$disconnect();

    return sitemapEntries;
}