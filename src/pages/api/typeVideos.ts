import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const numberVideoByPage = parseInt(process.env.Number_Video!)
        const page = JSON.parse(req.body).pageNbr - 1 <= 0 ? 0 : JSON.parse(req.body).pageNbr - 1;
        const startSearchVideo = page * numberVideoByPage

        const name = JSON.parse(req.body).name

        let tab
        let col
        switch (JSON.parse(req.body).type) {
            case "channel":
                tab = "Channel"
                col = "channels"

                break;
            case "pornstar":
                tab = "Actor"
                col = "actors"
                break;
            case "categorie":
                tab = "Categorie"
                col = "categories"
                break;
            default:
                tab = "Channel"
                col = "channels"
                break;
        }

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

        let posts: any = await prisma.$queryRawUnsafe(`
            SELECT
                id, title, imgUrl, time, 'like', dislike, view,
                (SELECT COUNT(name) FROM ${tab} WHERE name LIKE '${name}') AS nbr,
                (SELECT COUNT(name) FROM ${tab} WHERE name LIKE '${name}') AS page
            FROM Videos
            WHERE ${col} LIKE '${name}'
            ${order}
            LIMIT ${startSearchVideo}, ${numberVideoByPage}
        `)

        posts.forEach((element: { nbr: number, page: number },) => {
            element.nbr = Number(element.nbr)
            element.page = Number(element.page)
            element.page = Math.ceil(element.page / numberVideoByPage)
        });

        await prisma.$disconnect()
        res.json(posts)
    }
    catch (error) {
        console.log(error)
        await prisma.$disconnect()
    }
}