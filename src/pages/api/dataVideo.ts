import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        // ✅ SÉCURISÉ : Validation de l'ID (cohérent avec les autres fichiers API)
        const dataId = parseInt(req.query.value as string);
        if (isNaN(dataId) || dataId <= 0) {
            return res.status(400).json({ error: 'Invalid video ID' });
        }

        // ✅ FIX : Utiliser findUnique au lieu de findUniqueOrThrow pour mieux gérer les cas où la vidéo n'existe pas
        const posts = await prisma.videos.findUnique({
            where: { id: dataId },
            select: {
                title: true,
                description: true,
                imgUrl: true,
                createdAt: true,
                videoUrl: true
            }
        })

        if (!posts) {
            return res.status(404).json({ error: 'Video not found' });
        }

        res.json(posts)
    }
    catch (error: any) {
        // ✅ OPTIMISÉ : Gestion d'erreurs cohérente avec détails appropriés
        console.error('Error in dataVideo API:', error)
        
        // ✅ FIX : Gérer spécifiquement les erreurs de connexion DB
        if (error?.code === 'P1001' || error?.message?.includes('max_user_connections')) {
            return res.status(503).json({ error: 'Database connection limit reached. Please try again later.' });
        }
        
        res.status(500).json({ error: 'Internal server error' })
    }
}