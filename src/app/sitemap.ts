import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const urlSite: string = process.env.Site_URL!
    return [
        {
            url: `${urlSite}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${urlSite}/channel`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        {
            url: `${urlSite}/actor`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        {
            url: `${urlSite}/categorie`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        {
            url: `${urlSite}/search`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.6,
        }
    ]
}