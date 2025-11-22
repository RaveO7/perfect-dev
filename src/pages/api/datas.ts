import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma'
import { validateTableName } from '@/lib/query-helpers'
import { Prisma } from '@prisma/client'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const tableName = req.query.value as string;
        
        // ✅ SÉCURISÉ : Validation stricte du nom de table
        const validatedTable = validateTableName(tableName || "");
        
        // ✅ SÉCURISÉ : Utilisation de Prisma.sql (les noms de tables doivent être validés avant)
        // Note: Prisma ne permet pas de paramétrer les noms de tables, donc on valide strictement
        const posts = await prisma.$queryRaw<Array<{ name: string }>>(
            Prisma.sql`SELECT name FROM ${Prisma.raw(validatedTable)}`
        )

        res.json(posts)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}