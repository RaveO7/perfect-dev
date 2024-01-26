import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const numberVideoByPage = 48
        const page = JSON.parse(req.body).pageNbr - 1 <= 0 ? 0 : JSON.parse(req.body).pageNbr - 1;
        const startSearchVideo = page * numberVideoByPage

        const name = JSON.parse(req.body).name

        let posts = []
        switch (JSON.parse(req.body).type) {
            case "channel":
                posts[0] = await prisma.videos.count({ where: { channels: { contains: name } } })
                posts[1] = await prisma.videos.findMany({ skip: startSearchVideo, take: numberVideoByPage, where: { channels: { contains: name } }, })
                break;
            case "pornstar":
                posts[0] = await prisma.videos.count({ where: { actors: { contains: name } } })
                posts[1] = await prisma.videos.findMany({ skip: startSearchVideo, take: numberVideoByPage, where: { actors: { contains: name } } })
                break;
            case "categorie":
                posts[0] = await prisma.videos.count({ where: { categories: { contains: name } } })
                posts[1] = await prisma.videos.findMany({ skip: startSearchVideo, take: numberVideoByPage, where: { categories: { contains: name } } })
                break;
            default:
                posts[0] = await prisma.videos.count({ where: { channels: { contains: name } } })
                posts[1] = await prisma.videos.findMany({ skip: startSearchVideo, take: numberVideoByPage, where: { channels: { contains: name } } })
                break;
        }

        await prisma.$disconnect()
        res.json(posts)
    }
    catch (error) {
        console.log(error)
        await prisma.$disconnect()
    }
}