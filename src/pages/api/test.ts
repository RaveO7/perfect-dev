import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log(JSON.parse(req.body).test)
    }
    catch (error) {
        console.log(error)
        await prisma.$disconnect()
    }
}