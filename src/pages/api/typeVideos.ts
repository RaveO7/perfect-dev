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
        switch (JSON.parse(req.body).type) {
            case "channel":
                tab = "Channel"
                break;
            case "pornstar":
                tab = "Actor"
                break;
            case "categorie":
                tab = "Categorie"
                break;
            default:
                tab = "Channel"
                break;
        }

        let order: string
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
                v.id, v.title, v.imgUrl, v.time, 'v.like', v.dislike, v.view,
                (SELECT COUNT(name) FROM ${tab} WHERE name LIKE '${name}') AS nbr,
                (SELECT COUNT(name) FROM ${tab} WHERE name LIKE '${name}') AS page
            FROM Videos v
            INNER JOIN Actor a ON v.id = a.idVideo
            WHERE a.name = '${name}'
            ${order}
            LIMIT ${startSearchVideo}, ${numberVideoByPage};
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