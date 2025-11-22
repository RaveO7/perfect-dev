export async function generateMetadata({ params }: { params: { id: string, type: string }; }) {
    const { id, type } = params;
    const decodedId = decodeURI(id);
    const typeLabel = type === 'pornstars' ? 'pornstar' : 
                     type === 'channels' ? 'channel' : 
                     type === 'categories' ? 'category' : type;
    const title = `${decodedId} - ${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)} | Perfect Porn`;
    const description = `Discover ${decodedId} ${typeLabel} on Perfect Porn. Watch premium HD adult content featuring ${decodedId}.`;
    const url = `${process.env.Site_URL}/${type}/${id}`;

    return {
        title: title,
        description: description,
        alternates: {
            canonical: url,
        },
        // ✅ NOUVEAU : OPENGRAPH amélioré avec dimensions, locale, et métadonnées complètes
        openGraph: {
            title: `${decodedId} - ${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)}`,
            description: description,
            url: url,
            siteName: "Perfect Porn",
            locale: "en_US", // ✅ NOUVEAU : Indique la langue/zone géographique
            type: "website",
            images: [{
                url: '/opengraph-image.png', // Utilise l'image par défaut du site
                alt: `Perfect Porn - ${decodedId}`,
                width: 1200, // ✅ NOUVEAU : Dimensions explicites pour un rendu optimal
                height: 630, // ✅ NOUVEAU : Ratio 1.91:1 recommandé
                type: "image/png"
            }],
        },
        // ✅ NOUVEAU : TWITTER CARDS - Optimise le partage sur Twitter/X
        twitter: {
            card: "summary_large_image", // ✅ Type de carte avec grande image
            title: `${decodedId} - ${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)}`, // ✅ Titre optimisé
            description: description, // ✅ Description
            images: ['/opengraph-image.png'], // ✅ Image principale
        }
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }