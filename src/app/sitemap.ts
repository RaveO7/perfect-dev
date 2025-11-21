import { MetadataRoute } from 'next'
import { PrismaClient } from "@prisma/client";

const CHUNK = 49000;
export const revalidate = 3600*24; // 1 day

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const prisma = new PrismaClient()
    // Base URL du site utilisé pour préfixer toutes les routes
    const urlSite: string = process.env.Site_URL!
    // Date courante réutilisée pour les routes statiques
    const now = new Date()

    // Récupère le nombre total de vidéos pour construire l'index des sitemaps
    const totalVideos = await prisma.videos.count()
    const numberOfVideoSitemaps = Math.max(1, Math.ceil(totalVideos / CHUNK))

    const actorsCountResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count
        FROM (
            SELECT name
            FROM Actor
            GROUP BY name
            HAVING COUNT(*) >= 3
        ) as actors_with_3_videos
    `
    const totalActors = Number(actorsCountResult[0]?.count ?? 0)
    const numberOfActorSitemaps = Math.max(1, Math.ceil(totalActors / CHUNK))

    const categoriesCountResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count
        FROM (
            SELECT name
            FROM Categorie
            GROUP BY name
            HAVING COUNT(*) >= 3
        ) as categories_with_3_videos
    `
    const totalCategories = Number(categoriesCountResult[0]?.count ?? 0)
    const numberOfCategorySitemaps = Math.max(1, Math.ceil(totalCategories / CHUNK))

    const channelsCountResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count
        FROM (
            SELECT name
            FROM Channel
            GROUP BY name
            HAVING COUNT(*) >= 3
        ) as channels_with_3_videos
    `
    const totalChannels = Number(channelsCountResult[0]?.count ?? 0)
    const numberOfChannelSitemaps = Math.max(1, Math.ceil(totalChannels / CHUNK))

    // Routes statiques principales du site
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${urlSite}`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${urlSite}channel`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        {
            url: `${urlSite}actor`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        {
            url: `${urlSite}categorie`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        {
            url: `${urlSite}search`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.6,
        },
    ]

    const videoSitemaps: MetadataRoute.Sitemap = Array.from(
        { length: numberOfVideoSitemaps },
        (_, i) => ({
            url: `${urlSite}sitemaps/video/${i}`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.5,
        })
    )

    const actorSitemaps: MetadataRoute.Sitemap = Array.from(
        { length: numberOfActorSitemaps },
        (_, i) => ({
            url: `${urlSite}sitemaps/actor/${i}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.5,
        })
    )

    const categorySitemaps: MetadataRoute.Sitemap = Array.from(
        { length: numberOfCategorySitemaps },
        (_, i) => ({
            url: `${urlSite}sitemaps/categorie/${i}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.5,
        })
    )

    const channelSitemaps: MetadataRoute.Sitemap = Array.from(
        { length: numberOfChannelSitemaps },
        (_, i) => ({
            url: `${urlSite}sitemaps/channel/${i}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.5,
        })
    )

    await prisma.$disconnect()

    return [
        ...staticRoutes,
        ...videoSitemaps,
        ...actorSitemaps,
        ...categorySitemaps,
        ...channelSitemaps,
    ]
}