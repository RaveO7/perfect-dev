import type { MetadataRoute } from 'next'
import { normalizeUrl } from '@/components/Utils'

export default function robots(): MetadataRoute.Robots {
    const siteUrl = normalizeUrl(process.env.Site_URL || '')

    return {
        rules: [
            {
                userAgent: '*',

                // ❗ Zones autorisées
                allow: [
                    '/',
                    '/videos',
                    '/categorie',
                    '/pornstar',
                    '/channel'
                ],

                // ❗ Zones à NE PAS indexer
                disallow: [
                    '/search',        // pages de recherche internes = très mauvaise idée en SEO
                    '/private/',      // si tu as une zone privée
                    '/*?*',           // empêche indexation des paramètres UTM & queries
                    '/*&*',
                ],
            },
        ],

        // Ton sitemap racine DOIT être un sitemapindex
        sitemap: normalizeUrl(siteUrl, 'sitemap.xml'),

        host: siteUrl,
    }
}
