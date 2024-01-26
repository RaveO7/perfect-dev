import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const id = parseInt(JSON.parse(req.body).id)

        let posts = []
        posts[1] = await prisma.videos.findUniqueOrThrow({ where: { id: id } })

        const rep: any = posts[1]
        const channel: string = rep.channels.replace(/,.*$/, '')
        posts[0] = await prisma.videos.count({ where: { channels: { contains: channel } } })

        let lim = 9
        posts[2] = await prisma.videos.findMany({
            take: lim,
            where: {
                NOT: {
                    id: id
                },
                channels: {
                    contains: channel
                },
            },
            orderBy: { id: 'desc' }
        })
        let test: any
        if (posts[2].length < lim) {
            lim = lim - posts[2].length
            test = await prisma.videos.findMany({
                take: lim,
                where: {
                    NOT: {
                        id: id
                    },
                },
            })
            posts[2] = posts[2].concat(test)
        }
        await prisma.$disconnect()
        res.json(posts)
    }
    catch (error) {
        await prisma.$disconnect()
        res.json("")
    }
}