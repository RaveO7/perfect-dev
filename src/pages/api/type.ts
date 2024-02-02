import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const numberVideoByPage = 48
        const pageNbr = JSON.parse(req.body).pageNbr - 1 <= 0 ? 0 : JSON.parse(req.body).pageNbr - 1;
        const startSearchVideo = pageNbr * numberVideoByPage

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

        var order: string
        switch (JSON.parse(req.body).order) {
            case "Latest":
                order = "ORDER BY t.idVideo DESC"
                break;
            case "A->Z":
                order = "ORDER BY t.name ASC"
                break;
            case "Z->A":
                order = "ORDER BY t.name DESC"
                break;
            default:
                order = "ORDER BY t.name ASC"
                break;
        }

        const posts: any = await prisma.$queryRawUnsafe(`
            SELECT
                t.name, v.imgUrl, COUNT(*) AS nbr,
            (SELECT COUNT(*) FROM (SELECT name FROM ${tab} GROUP BY name HAVING COUNT(*) >= 3) AS subquery) AS nbrTt
            FROM ${tab} t
            INNER JOIN Videos v ON t.idVideo = v.id
            GROUP BY t.name
            HAVING nbr >= 3
            ${order}
            LIMIT ${startSearchVideo}, ${numberVideoByPage}
        `)

        posts.forEach((element: { nbr: number; }) => {
            element.nbr = Number(element.nbr)
        });
        posts.forEach((element: { nbrTt: number; }) => {
            element.nbrTt = Number(element.nbrTt)
        });

        await prisma.$disconnect()
        res.json(posts)
    }
    catch (error) {
        console.log(error)
        await prisma.$disconnect()
    }
}