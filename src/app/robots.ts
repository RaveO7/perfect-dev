import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {

    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/videos', '/categorie', '/pornstar', '/channel', '/search'],
                disallow: '/private/',
            }
        ],
        sitemap: `${process.env.Site_URL}sitemap.xml`,
    }
}
