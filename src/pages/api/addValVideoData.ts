import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = JSON.parse(req.body)
        const id = parseInt(body.id)
        const cookie = body.cookie
        
        // Validation : s'assurer que l'ID est un nombre valide
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid video ID' })
        }
        
        // Validation : s'assurer que cookie est une valeur autorisée
        if (!['l', 'd', 'r'].includes(cookie)) {
            return res.status(400).json({ error: 'Invalid cookie value' })
        }

        // ✅ SÉCURISÉ : Utilisation de Prisma.sql avec paramètres préparés
        if (cookie === 'l') {
            await prisma.$executeRaw`
                UPDATE Videos 
                SET \`like\` = \`like\` + 1 
                WHERE id = ${id}
            `
        } else if (cookie === 'd') {
            await prisma.$executeRaw`
                UPDATE Videos 
                SET dislike = dislike + 1 
                WHERE id = ${id}
            `
        } else {
            await prisma.$executeRaw`
                UPDATE Videos 
                SET repport = repport + 1 
                WHERE id = ${id}
            `
        }
        
        res.json({ success: true })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}