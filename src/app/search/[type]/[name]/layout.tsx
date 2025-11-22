import type { Metadata } from 'next'
import { upperFirstLetter } from '@/components/Utils'

type Props = { params: { name: string, type: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const decodedName = decodeURI(params.name);
    const typeLabel = params.type === 'videos' ? 'videos' : 
                     params.type === 'pornstars' ? 'pornstars' :
                     params.type === 'channels' ? 'channels' : 'categories';
    const title = `Search: ${decodedName} - ${upperFirstLetter(typeLabel)} | Perfect Porn`;
    const description = `Search results for "${decodedName}" in ${typeLabel} on Perfect Porn. Browse premium HD adult content.`;
    const url = `${process.env.Site_URL}/search/${params.type}/${params.name}`;

    return {
        title: title,
        description: description,
        alternates: {
            canonical: url,
        },
        // ✅ NOUVEAU : OPENGRAPH amélioré avec dimensions, locale, et métadonnées complètes
        openGraph: {
            title: `Search: ${decodedName} - ${upperFirstLetter(typeLabel)}`,
            description: description,
            url: url,
            siteName: "Perfect Porn",
            locale: "en_US", // ✅ NOUVEAU : Indique la langue/zone géographique
            type: "website",
            images: [{
                url: '/opengraph-image.png', // Utilise l'image par défaut du site
                alt: `Perfect Porn - Search: ${decodedName}`,
                width: 1200, // ✅ NOUVEAU : Dimensions explicites pour un rendu optimal
                height: 630, // ✅ NOUVEAU : Ratio 1.91:1 recommandé
                type: "image/png"
            }],
        },
        // ✅ NOUVEAU : TWITTER CARDS - Optimise le partage sur Twitter/X
        twitter: {
            card: "summary_large_image", // ✅ Type de carte avec grande image
            title: `Search: ${decodedName} - ${upperFirstLetter(typeLabel)}`, // ✅ Titre optimisé
            description: description, // ✅ Description
            images: ['/opengraph-image.png'], // ✅ Image principale
        }
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }