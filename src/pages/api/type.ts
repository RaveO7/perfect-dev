import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma'
import { getOrderClauseForTypes, getTableName, validateTableName, calculatePagination } from '@/lib/query-helpers'
import { TypeResult } from '@/lib/api-types'
import { Prisma } from '@prisma/client'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = JSON.parse(req.body)
        const numberVideoByPage = parseInt(process.env.Number_Video!)
        // ✅ OPTIMISÉ : Utilisation de la fonction utilitaire pour éviter la duplication
        const { startSearchVideo } = calculatePagination(body.pageNbr, numberVideoByPage)

        // ✅ SÉCURISÉ : Validation stricte du nom de table
        const tab = validateTableName(getTableName(body.type || "channels"))
        const order = getOrderClauseForTypes(body.order || "A->Z", true)

        // ✅ SÉCURISÉ : Calcul du total une seule fois (optimisation bonus)
        const totalCountResult = await prisma.$queryRaw<Array<{ count: bigint }>>(
            Prisma.sql`
                SELECT COUNT(*) as count
                FROM (
                    SELECT name 
                    FROM ${Prisma.raw(tab)} 
                    GROUP BY name 
                    HAVING COUNT(*) >= 3
                ) AS subquery
            `
        )
        const totalCount = Number(totalCountResult[0]?.count || 0)

        // ✅ SÉCURISÉ : Utilisation de Prisma.sql avec paramètres préparés
        // ✅ OPTIMISÉ : Type TypeScript explicite au lieu de 'any'
        const posts = await prisma.$queryRaw<TypeResult[]>(
            Prisma.sql`
                SELECT
                    t.name, v.imgUrl, COUNT(*) AS nbr,
                    ${totalCount} AS nbrPages,
                    ${totalCount} AS nbrTt
                FROM ${Prisma.raw(tab)} t
                INNER JOIN Videos v ON t.idVideo = v.id
                GROUP BY t.name
                HAVING nbr >= 3
                ${Prisma.raw(order)}
                LIMIT ${startSearchVideo}, ${numberVideoByPage}
            `
        )

        // ✅ OPTIMISÉ : Une seule boucle au lieu de 3 (performance améliorée)
        // ✅ OPTIMISÉ : Type TypeScript explicite (plus besoin de type inline)
        posts.forEach((element) => {
            if (element.nbr !== undefined) {
                element.nbr = Number(element.nbr)
            }
            if (element.nbrPages !== undefined) {
                element.nbrPages = Number(element.nbrPages)
                element.nbrPages = Math.ceil(element.nbrPages / numberVideoByPage)
            }
            if (element.nbrTt !== undefined) {
                element.nbrTt = Number(element.nbrTt)
            }
        });
        
        res.json(posts)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}