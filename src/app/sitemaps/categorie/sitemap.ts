import { MetadataRoute } from 'next'
import { PrismaClient } from "@prisma/client";

// Nombre de catégories par sitemap (limite recommandée pour optimiser les performances)
const CATEGORIES_PER_SITEMAP = 49000;

/**
 * Génère la liste des sitemaps nécessaires en fonction du nombre total de catégories uniques
 * Cette fonction est appelée automatiquement par Next.js pour créer un index de sitemaps
 */
export async function generateSitemaps() {
    const prisma = new PrismaClient();
    
    // Récupère le nombre total de catégories uniques ayant au moins 3 vidéos
    // Une catégorie est unique par son nom (group by name)
    const totalCategories = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM (
            SELECT name 
            FROM Categorie 
            GROUP BY name 
            HAVING COUNT(*) >= 3
        ) as categories_with_3_videos
    `;
    
    const count = Number(totalCategories[0]?.count || 0);
    
    // Calcule le nombre de sitemaps nécessaires (arrondi à l'entier supérieur)
    const numberOfSitemaps = Math.ceil(count / CATEGORIES_PER_SITEMAP);
    
    // Génère un tableau d'IDs de 0 à numberOfSitemaps - 1
    // Exemple: si 1200 catégories -> 3 sitemaps -> [{ id: 0 }, { id: 1 }, { id: 2 }]
    const sitemaps = Array.from({ length: numberOfSitemaps }, (_, i) => ({ id: i }));
    
    await prisma.$disconnect();
    
    return sitemaps;
}

/**
 * Génère le contenu d'un sitemap spécifique en fonction de son ID
 * @param id - L'identifiant du sitemap (0, 1, 2, etc.)
 * @returns Un tableau d'entrées de sitemap contenant les URLs des catégories
 */
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const prisma = new PrismaClient();

    // Calcule la plage de catégories pour ce sitemap avec pagination
    // Exemple: sitemap id=0 -> catégories 0-48999, id=1 -> catégories 49000-97999, etc.
    const start = id * CATEGORIES_PER_SITEMAP;
    const limit = CATEGORIES_PER_SITEMAP;

    // Récupère les catégories uniques avec leur date de dernière modification
    // Une catégorie doit avoir au moins 3 vidéos pour être incluse dans le sitemap
    const categories = await prisma.$queryRaw<Array<{
        name: string;
        lastModified: Date;
    }>>`
        SELECT 
            c.name,
            MAX(v.createdAt) as lastModified
        FROM Categorie c
        INNER JOIN Videos v ON c.idVideo = v.id
        GROUP BY c.name
        HAVING COUNT(*) >= 3
        ORDER BY c.name
        LIMIT ${limit}
        OFFSET ${start}
    `;

    // Transforme chaque catégorie en entrée de sitemap
    const sitemapEntries = categories.map(({ name, lastModified }) => ({
        url: `${process.env.Site_URL}categorie/${encodeURIComponent(name)}`,
        lastModified: lastModified || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    await prisma.$disconnect();

    return sitemapEntries;
}