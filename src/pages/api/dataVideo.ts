import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const id = parseInt(JSON.parse(req.body).id)
        
        const posts = await prisma.videos.findUniqueOrThrow({ where: { id: id } })
        
        await prisma.$disconnect()
        res.json(posts)
    }
    catch (error) {
        await prisma.$disconnect()
        res.json("")
    }
}