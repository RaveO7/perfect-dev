import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const tab: any = req.query.value;
        const posts = await prisma.$queryRawUnsafe(`SELECT name FROM ${tab}`)

        await prisma.$disconnect()
        res.json(posts)
    }
    catch (error) {
        await prisma.$disconnect()
        res.json("")
    }
}