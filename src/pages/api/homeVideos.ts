import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma'
import { getOrderClauseForVideos, calculatePagination } from '@/lib/query-helpers'
import { VideoResult } from '@/lib/api-types'
import { Prisma } from '@prisma/client'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        // ✅ FIX : Gérer le cas où req.body est déjà un objet (Next.js parse automatiquement)
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
        const numberVideoByPage = parseInt(process.env.Number_Video!)
        // ✅ OPTIMISÉ : Utilisation de la fonction utilitaire pour éviter la duplication
        const { startSearchVideo } = calculatePagination(body.pageNbr, numberVideoByPage)

        const order = getOrderClauseForVideos(body.order || "Latest", true)
        
        // ✅ SÉCURISÉ : Calcul du total une seule fois (optimisation bonus)
        const totalCount = await prisma.videos.count()
        
        // ✅ SÉCURISÉ : Utilisation de Prisma.sql avec paramètres préparés
        // ✅ OPTIMISÉ : Type TypeScript explicite au lieu de 'any'
        // Note: order est validé par getOrderClauseForVideos qui retourne seulement des valeurs autorisées
        const posts = await prisma.$queryRaw<VideoResult[]>(
            Prisma.sql`
                SELECT id, title, imgUrl, time, v.like, dislike, view, ${totalCount} AS nbr
                FROM Videos v
                ${Prisma.raw(order)}
                LIMIT ${startSearchVideo}, ${numberVideoByPage}
            `
        )

        // Calculer le nombre de pages une seule fois
        const totalVideos = Number(totalCount)
        const totalPages = Math.ceil(totalVideos / numberVideoByPage)
        
        // Créer de nouveaux objets avec le nombre de pages correct
        const postsWithPages = posts.map((element) => {
            return {
                id: element.id,
                title: element.title,
                imgUrl: element.imgUrl,
                time: element.time,
                like: element.like,
                dislike: element.dislike,
                view: element.view,
                nbr: totalPages
            }
        });

        res.json(postsWithPages)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}