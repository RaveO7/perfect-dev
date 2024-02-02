import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("req")
        const dataId: any = req.query.value;
        const posts = await prisma.videos.findUniqueOrThrow({ where: { id: parseInt(dataId) } })

        await prisma.$disconnect()
        res.json(posts)
    }
    catch (error) {
        console.log(error)
        await prisma.$disconnect()
        res.json("")
    }
}