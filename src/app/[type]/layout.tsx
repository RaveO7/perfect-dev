import { upperFirstLetter, normalizeUrl } from '@/components/Utils'

export const dynamicParams = false
export async function generateStaticParams() {
	return [
		{ type: 'channels' },
		{ type: 'pornstars' },
		{ type: 'categories' },
	]
}

export async function generateMetadata({ params, }: { params: { id: string, type: string }; }) {
    const { type } = params;
    const typeLabel = upperFirstLetter(type);
    const url = normalizeUrl(process.env.Site_URL || '', type);

    return {
        title: `${typeLabel}s | Perfect Porn`,
        description: `Discover all the ${type}s on Perfect Porn, the best porn website. Browse premium HD adult content featuring ${type}s.`,
        alternates: {
            canonical: url,
        },
        // ✅ NOUVEAU : OPENGRAPH amélioré avec dimensions, locale, et métadonnées complètes
        openGraph: {
            title: `${typeLabel}s - Perfect Porn`,
            description: `Discover all the ${type}s on Perfect Porn, the best porn website.`,
            url: url,
            siteName: "Perfect Porn",
            locale: "en_US", // ✅ NOUVEAU : Indique la langue/zone géographique
            type: "website",
            images: [{
                url: '/opengraph-image.png', // Utilise l'image par défaut du site
                alt: `Perfect Porn - ${typeLabel}s`,
                width: 1200, // ✅ NOUVEAU : Dimensions explicites pour un rendu optimal
                height: 630, // ✅ NOUVEAU : Ratio 1.91:1 recommandé
                type: "image/png"
            }],
        },
        // ✅ NOUVEAU : TWITTER CARDS - Optimise le partage sur Twitter/X
        twitter: {
            card: "summary_large_image", // ✅ Type de carte avec grande image
            title: `${typeLabel}s - Perfect Porn`, // ✅ Titre optimisé
            description: `Discover all the ${type}s on Perfect Porn, the best porn website.`, // ✅ Description
            images: ['/opengraph-image.png'], // ✅ Image principale
        }
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }