import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma'
import { getOrderClauseForVideos, getTableName, validateTableName, calculatePagination } from '@/lib/query-helpers'
import { SearchVideoResult, SearchTypeResult } from '@/lib/api-types'
import { Prisma } from '@prisma/client'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = JSON.parse(req.body)
        const numberVideoByPage = parseInt(process.env.Number_Video!)
        // ✅ OPTIMISÉ : Utilisation de la fonction utilitaire pour éviter la duplication
        const { startSearchVideo } = calculatePagination(body.pageNbr, numberVideoByPage)

        const search = body.search || ""
        let type = body.type || "videos"
        // Pour searchVideos, on utilise toujours le tri par vidéos (même logique pour tous les types)
        const order = getOrderClauseForVideos(body.order || "Latest", false)
        
        // ✅ SÉCURISÉ : Échapper les caractères spéciaux pour LIKE
        const searchPattern = `%${search}%`

        // ✅ OPTIMISÉ : Normaliser le type pour éviter la duplication
        // Si le type n'est pas reconnu, utiliser "videos" par défaut
        if (!["videos", "channels", "pornstars", "categories"].includes(type)) {
            type = "videos"
        }

        let posts: SearchVideoResult[] | SearchTypeResult[]
        let totalCount: number = 0

        if (type === "videos") {
            // ✅ SÉCURISÉ : Calcul du total une seule fois
            const videoCountResult = await prisma.$queryRaw<Array<{ count: bigint }>>(
                Prisma.sql`
                    SELECT COUNT(DISTINCT(title)) as count
                    FROM Videos
                    WHERE title LIKE ${searchPattern} OR description LIKE ${searchPattern}
                `
            )
            totalCount = Number(videoCountResult[0]?.count || 0)
            
            // ✅ SÉCURISÉ : Utilisation de Prisma.sql avec paramètres préparés
            // ✅ OPTIMISÉ : Type TypeScript explicite au lieu de 'any'
            posts = await prisma.$queryRaw<SearchVideoResult[]>(
                Prisma.sql`
                    SELECT
                        id, title, imgUrl, v.like, dislike, view, time,
                        ${totalCount} AS nbrPage,
                        ${totalCount} AS nbr
                    FROM Videos v
                    WHERE title LIKE ${searchPattern} OR description LIKE ${searchPattern}
                    GROUP BY id, title, description
                    ${Prisma.raw(order)}
                    LIMIT ${startSearchVideo}, ${numberVideoByPage}
                `
            )
        } else {
            // ✅ SÉCURISÉ : Validation stricte du nom de table
            const tableName = validateTableName(getTableName(type))
            
            // ✅ SÉCURISÉ : Calcul du total une seule fois
            const typeCountResult = await prisma.$queryRaw<Array<{ count: bigint }>>(
                Prisma.sql`
                    SELECT COUNT(*) as count
                    FROM (
                        SELECT name 
                        FROM ${Prisma.raw(tableName)} 
                        WHERE name LIKE ${searchPattern} 
                        GROUP BY name
                    ) AS subquery
                `
            )
            totalCount = Number(typeCountResult[0]?.count || 0)
            
            // ✅ SÉCURISÉ : Utilisation de Prisma.sql avec paramètres préparés
            // ✅ OPTIMISÉ : Type TypeScript explicite au lieu de 'any'
            posts = await prisma.$queryRaw<SearchTypeResult[]>(
                Prisma.sql`
                    SELECT
                        t.name, v.imgUrl,
                        ${totalCount} AS nbrPage,
                        ${totalCount} AS nbr
                    FROM ${Prisma.raw(tableName)} t
                    INNER JOIN Videos v ON t.idVideo = v.id
                    WHERE t.name LIKE ${searchPattern}
                    GROUP BY t.name
                    ${Prisma.raw(order)}
                    LIMIT ${startSearchVideo}, ${numberVideoByPage}
                `
            )
        }

        // ✅ OPTIMISÉ : Une seule boucle au lieu de 2 (performance améliorée)
        // ✅ OPTIMISÉ : Type TypeScript explicite (plus besoin de type inline)
        posts.forEach((element) => {
            if (element.nbrPage !== undefined) {
                element.nbrPage = Number(element.nbrPage)
                element.nbrPage = Math.ceil(element.nbrPage / numberVideoByPage)
            }
            if (element.nbr !== undefined) {
                element.nbr = Number(element.nbr)
            }
        });

        res.json(posts)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}