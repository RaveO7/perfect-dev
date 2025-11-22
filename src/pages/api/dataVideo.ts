import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        // ✅ SÉCURISÉ : Validation de l'ID (cohérent avec les autres fichiers API)
        const dataId = parseInt(req.query.value as string);
        if (isNaN(dataId) || dataId <= 0) {
            return res.status(400).json({ error: 'Invalid video ID' });
        }

        const posts = await prisma.videos.findUniqueOrThrow({
            where: { id: dataId },
            select: {
                title: true,
                description: true,
                imgUrl: true,
                createdAt: true,
                videoUrl: true
            }
        })

        res.json(posts)
    }
    catch (error) {
        // ✅ OPTIMISÉ : Gestion d'erreurs cohérente (retourne un objet JSON au lieu d'une chaîne vide)
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}