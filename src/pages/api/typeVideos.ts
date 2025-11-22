import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma'
import { getOrderClauseForVideos, getTableName, validateTableName, calculatePagination } from '@/lib/query-helpers'
import { TypeVideoResult } from '@/lib/api-types'
import { Prisma } from '@prisma/client'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = JSON.parse(req.body)
        const numberVideoByPage = parseInt(process.env.Number_Video!)
        // ✅ OPTIMISÉ : Utilisation de la fonction utilitaire pour éviter la duplication
        const { startSearchVideo } = calculatePagination(body.pageNbr, numberVideoByPage)

        const name = body.name
        // ✅ SÉCURISÉ : Validation stricte du nom de table
        const tab = validateTableName(getTableName(body.type || "channel"))
        const order = getOrderClauseForVideos(body.order || "Latest", true)

        // ✅ SÉCURISÉ : Calcul du total une seule fois (optimisation bonus)
        const totalCountResult = await prisma.$queryRaw<Array<{ count: bigint }>>(
            Prisma.sql`
                SELECT COUNT(name) as count
                FROM ${Prisma.raw(tab)}
                WHERE name = ${name}
            `
        )
        const totalCount = Number(totalCountResult[0]?.count || 0)

        // ✅ SÉCURISÉ : Utilisation de Prisma.sql avec paramètres préparés
        // ✅ OPTIMISÉ : Type TypeScript explicite au lieu de 'any'
        const posts = await prisma.$queryRaw<TypeVideoResult[]>(
            Prisma.sql`
                SELECT
                    v.id, v.title, v.imgUrl, v.time, v.like, v.dislike, v.view,
                    ${totalCount} AS nbr,
                    ${totalCount} AS page
                FROM Videos v
                INNER JOIN ${Prisma.raw(tab)} a ON v.id = a.idVideo
                WHERE a.name = ${name}
                ${Prisma.raw(order)}
                LIMIT ${startSearchVideo}, ${numberVideoByPage}
            `
        )

        // ✅ OPTIMISÉ : Type TypeScript explicite (plus besoin de type inline)
        posts.forEach((element) => {
            element.nbr = Number(element.nbr)
            element.page = Number(element.page)
            element.page = Math.ceil(element.page / numberVideoByPage)
        });

        res.json(posts)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}