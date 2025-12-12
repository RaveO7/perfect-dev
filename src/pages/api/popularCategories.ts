import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Récupérer les catégories les plus populaires (avec le plus de vidéos)
        // On prend une image de la première vidéo trouvée pour chaque catégorie
        const categories = await prisma.$queryRaw<Array<{ name: string; imgUrl: string; nbr: number }>>(
            Prisma.sql`
                SELECT
                    c.name, 
                    MIN(v.imgUrl) AS imgUrl,
                    COUNT(*) AS nbr
                FROM Categorie c
                INNER JOIN Videos v ON c.idVideo = v.id
                WHERE v.imgUrl IS NOT NULL AND v.imgUrl != ''
                GROUP BY c.name
                HAVING nbr >= 3
                ORDER BY RAND()
                LIMIT 20
            `
        )

        // Convertir nbr en nombre
        categories.forEach((element) => {
            element.nbr = Number(element.nbr)
        });

        res.json(categories)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

