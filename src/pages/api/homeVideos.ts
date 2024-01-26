import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const numberVideoByPage = 48
        const pageNbr = JSON.parse(req.body).pageNbr - 1 <= 0 ? 0 : JSON.parse(req.body).pageNbr - 1;
        const startSearchVideo = pageNbr * numberVideoByPage

        var order: string
        switch (JSON.parse(req.body).order) {
            case "Latest":
                order = "ORDER BY id DESC"
                break;
            case "More View":
                order = "ORDER BY view DESC"
                break;
            case "Most Popular":
                order = "ORDER BY 'like' DESC"
                break;
            case "A->Z":
                order = "ORDER BY title ASC"
                break;
            case "Z->A":
                order = "ORDER BY title DESC"
                break;
            default:
                order = "ORDER BY id DESC"
                break;
        }

        const posts: any = await prisma.$queryRawUnsafe(`SELECT *, (SELECT COUNT(*) FROM Videos) AS nbr
        FROM Videos
        ${order}
        LIMIT ${startSearchVideo}, ${numberVideoByPage}`)

        posts.forEach((element: { nbr: number; }) => {
            element.nbr = Number(element.nbr)
        });


        await prisma.$disconnect()
        res.json(posts)
    }
    catch (error) {
        console.log(error)
        await prisma.$disconnect()
    }
}