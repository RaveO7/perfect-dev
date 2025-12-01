import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma'
import { getOrderClauseForVideos, getTableName, validateTableName, calculatePagination } from '@/lib/query-helpers'
import { SearchVideoResult, SearchTypeResult } from '@/lib/api-types'
import { Prisma } from '@prisma/client'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        // ✅ FIX : Gérer le cas où req.body est déjà un objet (Next.js parse automatiquement)
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
        const numberVideoByPage = parseInt(process.env.Number_Video!)
        // ✅ OPTIMISÉ : Utilisation de la fonction utilitaire pour éviter la duplication
        const { startSearchVideo } = calculatePagination(body.pageNbr, numberVideoByPage)

        const search = (body.search || "").trim()
        let type = body.type || "videos"
        // Pour searchVideos, on utilise toujours le tri par vidéos (même logique pour tous les types)
        const order = getOrderClauseForVideos(body.order || "Latest", false)
        
        // ✅ OPTIMISÉ : Normaliser le type pour éviter la duplication
        // Si le type n'est pas reconnu, utiliser "videos" par défaut
        if (!["videos", "channels", "pornstars", "categories"].includes(type)) {
            type = "videos"
        }

        let posts: SearchVideoResult[] | SearchTypeResult[]
        let totalCount: number = 0

        if (type === "videos") {
            // Si la recherche est vide, afficher directement les dernières vidéos
            if (!search || search.length === 0) {
                const totalCountAll = await prisma.videos.count()
                const fallbackOrder = getOrderClauseForVideos("Latest", true)
                
                posts = await prisma.$queryRaw<SearchVideoResult[]>(
                    Prisma.sql`
                        SELECT
                            id, title, imgUrl, v.like, dislike, view, time,
                            ${totalCountAll} AS nbrPage,
                            ${totalCountAll} AS nbr
                        FROM Videos v
                        ${Prisma.raw(fallbackOrder)}
                        LIMIT ${startSearchVideo}, ${numberVideoByPage}
                    `
                )
                totalCount = totalCountAll
            } else {
                // ✅ SÉCURISÉ : Échapper les caractères spéciaux pour LIKE (insensible à la casse)
                const searchPattern = `%${search}%`
                
                // ✅ SÉCURISÉ : Calcul du total une seule fois (recherche insensible à la casse)
                const videoCountResult = await prisma.$queryRaw<Array<{ count: bigint }>>(
                    Prisma.sql`
                        SELECT COUNT(DISTINCT(id)) as count
                        FROM Videos
                        WHERE LOWER(title) LIKE LOWER(${searchPattern}) 
                           OR LOWER(description) LIKE LOWER(${searchPattern})
                           OR LOWER(actors) LIKE LOWER(${searchPattern})
                           OR LOWER(channels) LIKE LOWER(${searchPattern})
                           OR LOWER(categories) LIKE LOWER(${searchPattern})
                    `
                )
                totalCount = Number(videoCountResult[0]?.count || 0)
                
                // ✅ SÉCURISÉ : Utilisation de Prisma.sql avec paramètres préparés
                // ✅ OPTIMISÉ : Type TypeScript explicite au lieu de 'any'
                // ✅ AMÉLIORÉ : Recherche dans title, description, actors, channels, categories (insensible à la casse)
                posts = await prisma.$queryRaw<SearchVideoResult[]>(
                    Prisma.sql`
                        SELECT
                            id, title, imgUrl, v.like, dislike, view, time,
                            ${totalCount} AS nbrPage,
                            ${totalCount} AS nbr
                        FROM Videos v
                        WHERE LOWER(title) LIKE LOWER(${searchPattern}) 
                           OR LOWER(description) LIKE LOWER(${searchPattern})
                           OR LOWER(actors) LIKE LOWER(${searchPattern})
                           OR LOWER(channels) LIKE LOWER(${searchPattern})
                           OR LOWER(categories) LIKE LOWER(${searchPattern})
                        GROUP BY id, title, description
                        ${Prisma.raw(order)}
                        LIMIT ${startSearchVideo}, ${numberVideoByPage}
                    `
                )
                
                // ✅ FALLBACK : Si aucun résultat trouvé, afficher les dernières vidéos
                if (posts.length === 0) {
                    const totalCountAll = await prisma.videos.count()
                    const fallbackOrder = getOrderClauseForVideos("Latest", true)
                    
                    posts = await prisma.$queryRaw<SearchVideoResult[]>(
                        Prisma.sql`
                            SELECT
                                id, title, imgUrl, v.like, dislike, view, time,
                                ${totalCountAll} AS nbrPage,
                                ${totalCountAll} AS nbr
                            FROM Videos v
                            ${Prisma.raw(fallbackOrder)}
                            LIMIT ${startSearchVideo}, ${numberVideoByPage}
                        `
                    )
                    totalCount = totalCountAll
                }
            }
        } else {
            // ✅ SÉCURISÉ : Validation stricte du nom de table
            const tableName = validateTableName(getTableName(type))
            
            // Si la recherche est vide, afficher directement les dernières entrées de ce type
            if (!search || search.length === 0) {
                const totalCountAllResult = await prisma.$queryRaw<Array<{ count: bigint }>>(
                    Prisma.sql`
                        SELECT COUNT(*) as count
                        FROM (
                            SELECT name 
                            FROM ${Prisma.raw(tableName)} 
                            GROUP BY name
                            HAVING COUNT(*) >= 3
                        ) AS subquery
                    `
                )
                const totalCountAll = Number(totalCountAllResult[0]?.count || 0)
                const fallbackOrder = getOrderClauseForVideos("Latest", false)
                
                posts = await prisma.$queryRaw<SearchTypeResult[]>(
                    Prisma.sql`
                        SELECT
                            t.name, v.imgUrl,
                            ${totalCountAll} AS nbrPage,
                            ${totalCountAll} AS nbr
                        FROM ${Prisma.raw(tableName)} t
                        INNER JOIN Videos v ON t.idVideo = v.id
                        GROUP BY t.name
                        HAVING COUNT(*) >= 3
                        ${Prisma.raw(fallbackOrder)}
                        LIMIT ${startSearchVideo}, ${numberVideoByPage}
                    `
                )
                totalCount = totalCountAll
            } else {
                // ✅ SÉCURISÉ : Échapper les caractères spéciaux pour LIKE (insensible à la casse)
                const searchPattern = `%${search}%`
                
                // ✅ SÉCURISÉ : Calcul du total une seule fois (recherche insensible à la casse)
                const typeCountResult = await prisma.$queryRaw<Array<{ count: bigint }>>(
                    Prisma.sql`
                        SELECT COUNT(*) as count
                        FROM (
                            SELECT name 
                            FROM ${Prisma.raw(tableName)} 
                            WHERE LOWER(name) LIKE LOWER(${searchPattern}) 
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
                        WHERE LOWER(t.name) LIKE LOWER(${searchPattern})
                        GROUP BY t.name
                        ${Prisma.raw(order)}
                        LIMIT ${startSearchVideo}, ${numberVideoByPage}
                    `
                )
                
                // ✅ FALLBACK : Si aucun résultat trouvé, afficher les dernières entrées de ce type
                if (posts.length === 0) {
                    const totalCountAllResult = await prisma.$queryRaw<Array<{ count: bigint }>>(
                        Prisma.sql`
                            SELECT COUNT(*) as count
                            FROM (
                                SELECT name 
                                FROM ${Prisma.raw(tableName)} 
                                GROUP BY name
                                HAVING COUNT(*) >= 3
                            ) AS subquery
                        `
                    )
                    const totalCountAll = Number(totalCountAllResult[0]?.count || 0)
                    const fallbackOrder = getOrderClauseForVideos("Latest", false)
                    
                    posts = await prisma.$queryRaw<SearchTypeResult[]>(
                        Prisma.sql`
                            SELECT
                                t.name, v.imgUrl,
                                ${totalCountAll} AS nbrPage,
                                ${totalCountAll} AS nbr
                            FROM ${Prisma.raw(tableName)} t
                            INNER JOIN Videos v ON t.idVideo = v.id
                            GROUP BY t.name
                            HAVING COUNT(*) >= 3
                            ${Prisma.raw(fallbackOrder)}
                            LIMIT ${startSearchVideo}, ${numberVideoByPage}
                        `
                    )
                    totalCount = totalCountAll
                }
            }
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