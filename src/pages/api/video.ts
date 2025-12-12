import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        // ✅ FIX : Gérer le cas où req.body est déjà un objet (Next.js parse automatiquement)
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
        const id = parseInt(body.id)
        
        // ✅ Validation : s'assurer que l'ID est un nombre valide
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid video ID' })
        }

        // ✅ OPTIMISÉ : Requête 1 - Récupérer la vidéo principale
        const video = await prisma.Videos.findUniqueOrThrow({
            where: { id: id }, 
            select: {
                title: true,
                imgUrl: true,
                videoUrl: true,
                actors: true,
                channels: true,
                categories: true,
                like: true,
                dislike: true,
                view: true,
                createdAt: true
            },
        })

        // Extraire le premier channel
        const channel: string = video.channels?.replace(/,.*$/, '') || ''
        
        const limit = 9

        // ✅ OPTIMISÉ : Requêtes 2 et 3 en parallèle (elles sont indépendantes)
        const [channelVideoCount, relatedVideos] = await Promise.all([
            // Requête 2 : Compter les vidéos du même channel
            prisma.Videos.count({
                where: { channels: { contains: channel } }
            }),
            // Requête 3 : Récupérer les vidéos similaires du même channel
            prisma.Videos.findMany({
                take: limit,
                where: {
                    NOT: { id: id },
                    channels: { contains: channel }
                },
                orderBy: { id: 'desc' },
                select: {
                    id: true,
                    title: true,
                    imgUrl: true,
                    view: true,
                    like: true,
                    dislike: true,
                    time: true
                }
            })
        ])

        // ✅ OPTIMISÉ : Compléter avec d'autres vidéos si nécessaire (une seule requête conditionnelle)
        let finalRelatedVideos = relatedVideos
        if (relatedVideos.length < limit) {
            const remainingLimit = limit - relatedVideos.length
            const additionalVideos = await prisma.Videos.findMany({
                take: remainingLimit,
                where: {
                    NOT: { id: id }
                },
                orderBy: { id: 'desc' },
                select: {
                    id: true,
                    title: true,
                    imgUrl: true,
                    view: true,
                    like: true,
                    dislike: true,
                    time: true
                }
            })
            finalRelatedVideos = [...relatedVideos, ...additionalVideos]
        }

        // Structure de réponse : [count, video, relatedVideos]
        const posts = [
            channelVideoCount,  // posts[0]
            video,              // posts[1]
            finalRelatedVideos  // posts[2]
        ]

        res.json(posts)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}