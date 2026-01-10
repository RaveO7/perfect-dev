import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        // ✅ FIX : Gérer le parsing JSON de manière plus robuste
        let body: any;
        if (typeof req.body === 'string') {
            body = JSON.parse(req.body);
        } else {
            body = req.body;
        }
        
        const id = parseInt(body.id)
        
        // ✅ Validation : s'assurer que l'ID est un nombre valide
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid video ID' })
        }

        // ✅ OPTIMISÉ : Requête 1 - Récupérer la vidéo principale (utiliser findUnique pour mieux gérer les erreurs)
        const video = await prisma.videos.findUnique({
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

        // ✅ FIX : Vérifier si la vidéo existe
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Extraire le premier channel
        const channel: string = video.channels?.replace(/,.*$/, '') || ''
        
        const limit = 9

        // ✅ OPTIMISÉ : Requêtes 2 et 3 en parallèle (elles sont indépendantes)
        // ✅ FIX : Ajouter une gestion d'erreur pour chaque requête pour éviter les problèmes de connexion
        let channelVideoCount = 0;
        let relatedVideos: any[] = [];
        
        try {
            [channelVideoCount, relatedVideos] = await Promise.all([
                // Requête 2 : Compter les vidéos du même channel
                prisma.videos.count({
                    where: { channels: { contains: channel } }
                }),
                // Requête 3 : Récupérer les vidéos similaires du même channel
                prisma.videos.findMany({
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
        } catch (queryError: any) {
            // ✅ FIX : Si les requêtes parallèles échouent, continuer avec des valeurs par défaut
            console.error('Error fetching related videos:', queryError);
            // Les valeurs par défaut sont déjà définies
        }

        // ✅ OPTIMISÉ : Compléter avec d'autres vidéos si nécessaire (une seule requête conditionnelle)
        let finalRelatedVideos = relatedVideos
        if (relatedVideos.length < limit) {
            try {
                const remainingLimit = limit - relatedVideos.length
                const additionalVideos = await prisma.videos.findMany({
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
            } catch (queryError: any) {
                // ✅ FIX : Si la requête échoue, continuer avec les vidéos déjà récupérées
                console.error('Error fetching additional videos:', queryError);
            }
        }

        // Structure de réponse : [count, video, relatedVideos]
        const posts = [
            channelVideoCount,  // posts[0]
            video,              // posts[1]
            finalRelatedVideos  // posts[2]
        ]

        res.json(posts)
    }
    catch (error: any) {
        console.error('Error in video API:', error)
        
        // ✅ FIX : Gérer spécifiquement les erreurs de connexion DB
        if (error?.code === 'P1001' || error?.message?.includes('max_user_connections')) {
            return res.status(503).json({ error: 'Database connection limit reached. Please try again later.' });
        }
        
        // ✅ FIX : Gérer les erreurs de parsing JSON
        if (error instanceof SyntaxError) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        
        res.status(500).json({ error: 'Internal server error' })
    }
}