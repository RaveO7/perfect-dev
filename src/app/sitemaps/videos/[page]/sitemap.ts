import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'
import { ensureTrailingSlash } from '@/lib/url'
import { VIDEO_SITEMAP_CHUNK_SIZE } from '@/lib/sitemap'

type VideoSitemapParams = {
    params: {
        page: string
    }
}

export const revalidate = 60 * 60 // 1 hour

export default async function videoSitemap({
    params,
}: VideoSitemapParams): Promise<MetadataRoute.Sitemap> {
    if (!process.env.Site_URL) {
        throw new Error('Site_URL env variable is not defined')
    }

    const pageIndex = Number.parseInt(params.page, 10)

    if (!Number.isFinite(pageIndex) || pageIndex < 1) {
        return []
    }

    const baseUrl = ensureTrailingSlash(process.env.Site_URL)
    const skip = (pageIndex - 1) * VIDEO_SITEMAP_CHUNK_SIZE

    const videos = await prisma.videos.findMany({
        skip,
        take: VIDEO_SITEMAP_CHUNK_SIZE,
        orderBy: { id: 'asc' },
        select: {
            id: true,
            title: true,
            createdAt: true,
        },
    })

    if (videos.length === 0) {
        return []
    }

    return videos.map((video) => ({
        url: `${baseUrl}videos/${video.id}?name=${encodeURIComponent(video.title)}`,
        lastModified: video.createdAt,
        changeFrequency: 'weekly',
        priority: 0.5,
    }))
}

