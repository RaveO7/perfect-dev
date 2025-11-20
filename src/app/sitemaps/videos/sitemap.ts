import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'
import { ensureTrailingSlash } from '@/lib/url'
import { VIDEO_SITEMAP_CHUNK_SIZE } from '@/lib/sitemap'

export const revalidate = 60 * 60 // 1 hour
export const runtime = 'nodejs'

export default async function videoSitemapIndex(): Promise<MetadataRoute.Sitemap> {
    if (!process.env.Site_URL) {
        throw new Error('Site_URL env variable is not defined')
    }

    const baseUrl = ensureTrailingSlash(process.env.Site_URL)

    try {
        const [totalVideos, latestVideo] = await prisma.$transaction([
            prisma.videos.count(),
            prisma.videos.findFirst({
                orderBy: { createdAt: 'desc' },
                select: { createdAt: true },
            }),
        ])

        if (totalVideos === 0) {
            return []
        }

        const lastModified = latestVideo?.createdAt ?? new Date()
        const totalChunks = Math.ceil(totalVideos / VIDEO_SITEMAP_CHUNK_SIZE)

        return Array.from({ length: totalChunks }, (_, index) => ({
            url: `${baseUrl}sitemaps/videos/${index + 1}`,
            lastModified,
            changeFrequency: 'daily',
            priority: 0.6,
        }))
    } catch (error) {
        console.error('Failed to build video sitemap index', error)
        return []
    }
}

