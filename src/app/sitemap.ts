import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const urlSite: string = process.env.Site_URL!
    
    // Retourner seulement les pages statiques dans le sitemap principal
    // Les URLs dynamiques (videos, channels, pornstars, categories) sont dans 
    // les sous-sitemaps paginés référencés par /sitemap-index pour optimiser les performances
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${urlSite}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${urlSite}contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${urlSite}dmca`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${urlSite}channel`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${urlSite}pornstar`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${urlSite}categorie`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
    ]

    return staticPages
}