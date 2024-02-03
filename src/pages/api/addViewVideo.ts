import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const id = parseInt(JSON.parse(req.body).id)
        await prisma.$queryRawUnsafe(`UPDATE Videos SET view = view + 1 WHERE id = ${id}`)
        await prisma.$disconnect()
        res.json(true)

        return "test";
    }
    catch (error) {
        await prisma.$disconnect()
        res.json("")
    }
}