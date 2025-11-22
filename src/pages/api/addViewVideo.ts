import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = JSON.parse(req.body)
        const id = parseInt(body.id)
        
        // Validation : s'assurer que l'ID est un nombre valide
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid video ID' })
        }

        // ✅ SÉCURISÉ : Utilisation de Prisma.sql avec paramètres préparés
        await prisma.$executeRaw`
            UPDATE Videos 
            SET view = view + 1 
            WHERE id = ${id}
        `
        
        res.json(true)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}