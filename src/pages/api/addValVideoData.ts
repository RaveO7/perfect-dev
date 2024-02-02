import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const id = parseInt(JSON.parse(req.body).id)
        const cookie = JSON.parse(req.body).cookie
        console.log(cookie + " " + id)
        if (cookie == 'l') { await prisma.$queryRawUnsafe('UPDATE Videos SET `like` = `like` + 1 WHERE id = ' + id) }
        else if (cookie == 'd') { await prisma.$queryRawUnsafe(`UPDATE Videos SET dislike = dislike + 1 WHERE id = ${id}`) }
        else { await prisma.$queryRawUnsafe(`UPDATE Videos SET repport = repport + 1 WHERE id = ${id}`) }
        await prisma.$disconnect()
    }
    catch (error) {
        console.log(error)
        await prisma.$disconnect()
    }
}