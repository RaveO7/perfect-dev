import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const numberVideoByPage = parseInt(process.env.Number_Video!)
        const pageNbr = JSON.parse(req.body).pageNbr - 1 <= 0 ? 0 : JSON.parse(req.body).pageNbr - 1;
        const startSearchVideo = pageNbr * numberVideoByPage

        const search = JSON.parse(req.body).search
        const type = JSON.parse(req.body).type
        let order: string
        switch (JSON.parse(req.body).order) {
            case "Latest":
                order = type == "videos" ? "ORDER BY id DESC" : "ORDER BY id DESC"
                break;
            case "A->Z":
                order = type == "videos" ? "ORDER BY title ASC" : "ORDER BY title ASC"
                break;
            case "Z->A":
                order = type == "videos" ? "ORDER BY title DESC" : "ORDER BY title DESC"
                break;
            default:
                order = type == "videos" ? "ORDER BY id DESC" : "ORDER BY id DESC"
                break;
        }

        let posts: any
        switch (type) {
            case "videos":
                posts = await prisma.$queryRawUnsafe(`
                SELECT
                id, title, imgUrl, v.like, dislike, view, time,
            (SELECT COUNT(DISTINCT(title)) FROM Videos WHERE title LIKE '%${search}%' OR description LIKE '%${search}%') AS nbrPage,
            (SELECT COUNT(DISTINCT(title)) FROM Videos WHERE title LIKE '%${search}%' OR description LIKE '%${search}%') AS nbr
            FROM Videos v
            WHERE title LIKE '%${search}%' OR description LIKE '%${search}%'
            GROUP BY id, title, description
            ${order}
            LIMIT ${startSearchVideo}, ${numberVideoByPage}
                `)
                break;
            case "channels":
                posts = await prisma.$queryRawUnsafe(`
                SELECT
                    t.name, v.imgUrl,
                    (SELECT COUNT(*) FROM (SELECT name FROM Channel WHERE name LIKE '%${search}%' GROUP BY name) AS subquery) AS nbrPage,
                    (SELECT COUNT(*) FROM (SELECT name FROM Channel WHERE name LIKE '%${search}%' GROUP BY name) AS subquery) AS nbr
                FROM Channel t
                INNER JOIN Videos v ON t.idVideo = v.id
                WHERE t.name LIKE '%${search}%'
                GROUP BY t.name
                ${order}
                LIMIT ${startSearchVideo}, ${numberVideoByPage};
                `)
                break;
            case "pornstars":
                posts = await prisma.$queryRawUnsafe(`
                SELECT
                    t.name, v.imgUrl,
                    (SELECT COUNT(*) FROM (SELECT name FROM Actor WHERE name LIKE '%${search}%' GROUP BY name) AS subquery) AS nbrPage,
                    (SELECT COUNT(*) FROM (SELECT name FROM Actor WHERE name LIKE '%${search}%' GROUP BY name) AS subquery) AS nbr
                FROM Actor t
                INNER JOIN Videos v ON t.idVideo = v.id
                WHERE t.name LIKE '%${search}%'
                GROUP BY t.name
                ${order}
                LIMIT ${startSearchVideo}, ${numberVideoByPage};
                `)
                break;
            case "categories":
                posts = await prisma.$queryRawUnsafe(`
                    SELECT
                        t.name, v.imgUrl,
                        (SELECT COUNT(*) FROM (SELECT name FROM Categorie WHERE name LIKE '%${search}%' GROUP BY name) AS subquery) AS nbrPage,
                        (SELECT COUNT(*) FROM (SELECT name FROM Categorie WHERE name LIKE '%${search}%' GROUP BY name) AS subquery) AS nbr
                    FROM Categorie t
                    INNER JOIN Videos v ON t.idVideo = v.id
                    WHERE t.name LIKE '%${search}%'
                    GROUP BY t.name
                    ${order}
                    LIMIT ${startSearchVideo}, ${numberVideoByPage};
                `)
                break;
            default:
                posts = await prisma.$queryRawUnsafe(`
                    SELECT
                        id, title, imgUrl, v.like, dislike, view, time,
                    (SELECT COUNT(DISTINCT(title)) FROM Videos WHERE title LIKE '%${search}%' OR description LIKE '%${search}%') AS nbrPage,
                    (SELECT COUNT(DISTINCT(title)) FROM Videos WHERE title LIKE '%${search}%' OR description LIKE '%${search}%') AS nbr
                    FROM Videos v
                    WHERE title LIKE '%${search}%' OR description LIKE '%${search}%'
                    GROUP BY id, title, description
                    ${order}
                    LIMIT ${startSearchVideo}, ${numberVideoByPage}
                `)
                break;
        }

        posts.forEach((element: { nbrPage: number; }) => {
            element.nbrPage = Number(element.nbrPage)
            element.nbrPage = Math.ceil(element.nbrPage / numberVideoByPage)
        });
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