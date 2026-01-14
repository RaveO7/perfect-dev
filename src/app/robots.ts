import type { MetadataRoute } from 'next'
import { normalizeUrl, getSiteUrl } from '@/components/Utils'

export default function robots(): MetadataRoute.Robots {
    const siteUrl = getSiteUrl('https://perfectpornsite.com')
    
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/videos', '/categorie', '/pornstar', '/channel', '/search'],
                disallow: '/private/',
            }
        ],
        sitemap: normalizeUrl(siteUrl, 'sitemap.xml'),
    }
}
