import { getSiteUrl, normalizeUrl } from './Utils'

interface JsonLdProps {
  type?: 'home' | 'video' | 'category' | 'actor' | 'channel'
  data?: any
}

export default function JsonLd({ type = 'home', data }: JsonLdProps) {
  const siteUrl = getSiteUrl('https://perfectpornsite.com')
  const baseUrl = normalizeUrl(siteUrl)

  // Fonction helper pour normaliser les URLs (gère les URLs absolues et relatives)
  const getAbsoluteUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined
    // Si c'est déjà une URL absolue, la retourner telle quelle
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    // Sinon, normaliser avec l'URL de base
    return normalizeUrl(baseUrl, url)
  }

  // JSON-LD pour la page d'accueil
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "Perfect Porn",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/opengraph-image.png`,
          "width": 1200,
          "height": 630
        },
        "sameAs": [],
        "description": "Perfect Porn - The best porn site with all your dream videos. Watch free HD adult content including channels, pornstars, and categories."
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Perfect Porn",
        "description": "Explore diverse and high-quality content at Perfect Porn. Your ultimate destination for fulfilling fantasies.",
        "publisher": {
          "@id": `${baseUrl}/#organization`
        },
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/search/videos/{search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/#itemlist`,
        "name": "Latest Videos",
        "description": "Browse the latest free HD porn videos on Perfect Porn",
        "url": baseUrl,
        "numberOfItems": data?.videos?.length || 0,
        "itemListElement": data?.videos
          ?.filter((video: any) => video?.id && video?.title)
          ?.slice(0, 10)
          ?.map((video: any, index: number) => {
            const videoItem: any = {
              "@type": "VideoObject",
              "@id": `${baseUrl}/videos/${video.id}#video`,
              "name": video.title,
              "thumbnailUrl": getAbsoluteUrl(video.imgUrl),
              "isFamilyFriendly": false
            }

            if (video.time) videoItem.duration = video.time
            if (video.view) {
              videoItem.interactionStatistic = {
                "@type": "InteractionCounter",
                "interactionType": { "@type": "WatchAction" },
                "userInteractionCount": video.view
              }
            }

            // Retirer les propriétés undefined
            Object.keys(videoItem).forEach(key => {
              if (videoItem[key] === undefined) delete videoItem[key]
            })

            return {
              "@type": "ListItem",
              "position": index + 1,
              "item": videoItem
            }
          }) || []
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          }
        ]
      }
    ]
  }

  // JSON-LD simplifié si pas de données
  const simpleJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "Perfect Porn",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/opengraph-image.png`,
          "width": 1200,
          "height": 630
        },
        "description": "Perfect Porn - The best porn site with all your dream videos. Watch free HD adult content including channels, pornstars, and categories."
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Perfect Porn",
        "description": "Explore diverse and high-quality content at Perfect Porn. Your ultimate destination for fulfilling fantasies.",
        "publisher": {
          "@id": `${baseUrl}/#organization`
        },
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/search/videos/{search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/#webpage`,
        "url": baseUrl,
        "name": "Perfect Porn | The site for fulfilling your Fantasies.",
        "description": "Explore diverse and high-quality content at Perfect Porn. Your ultimate destination for fulfilling fantasies.",
        "isPartOf": {
          "@id": `${baseUrl}/#website`
        },
        "about": {
          "@id": `${baseUrl}/#organization`
        },
        "breadcrumb": {
          "@id": `${baseUrl}/#breadcrumb`
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          }
        ]
      }
    ]
  }

  const jsonLd = type === 'home' && data?.videos?.length > 0 ? homeJsonLd : simpleJsonLd

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
