import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const numberVideoByPage = 48
        const pageNbr = JSON.parse(req.body).pageNbr - 1 <= 0 ? 0 : JSON.parse(req.body).pageNbr - 1;
        const startSearchVideo = pageNbr * numberVideoByPage

        const search = JSON.parse(req.body).search

        let col: string
        let tab
        let idType
        switch (JSON.parse(req.body).type) {
            case "all":
                tab = "Videos"
                col = "title"
                idType = "id"
                break;
            case "video":
                tab = "Videos"
                col = "title"
                idType = "id"
                break;
            case "channel":
                tab = "Channel"
                col = "name"
                idType = "idVideo"
                break;
            case "pornstar":
                tab = "Actor"
                col = "name"
                idType = "idVideo"
                break;
            case "categorie":
                tab = "Categorie"
                col = "name"
                idType = "idVideo"
                break;
            default:
                tab = "Videos"
                col = "title"
                idType = "id"
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

        const posts: any = await prisma.$queryRawUnsafe(`
    SELECT
    (SELECT COUNT(*) FROM ${tab} WHERE ${col} LIKE '%${search}%') AS nbr, t.${col}, v.*
    FROM
    ${tab} t
    INNER JOIN 
        Videos v
            WHERE t.${idType} = v.id
            AND t.${col} LIKE '%${search}%'
    GROUP BY t.${col}
    ORDER BY t.${col} ASC
    LIMIT ${startSearchVideo}, ${numberVideoByPage}
  `)

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