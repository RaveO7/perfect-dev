import { MetadataRoute } from 'next'
import { ensureTrailingSlash } from '@/lib/url'

const STATIC_ROUTES: Array<{
    path: string
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
    priority: number
}> = [
    { path: '', changeFrequency: 'yearly', priority: 1 },
    { path: 'channel', changeFrequency: 'yearly', priority: 0.8 },
    { path: 'actor', changeFrequency: 'yearly', priority: 0.8 },
    { path: 'categorie', changeFrequency: 'yearly', priority: 0.8 },
    { path: 'search', changeFrequency: 'yearly', priority: 0.6 },
]

export const revalidate = 60 * 60 // 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    if (!process.env.Site_URL) {
        throw new Error('Site_URL env variable is not defined')
    }

    const baseUrl = ensureTrailingSlash(process.env.Site_URL)
    const now = new Date()

    const staticEntries = STATIC_ROUTES.map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }))

    return [
        ...staticEntries,
        {
            url: `${baseUrl}sitemaps/videos`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.7,
        },
    ]
}