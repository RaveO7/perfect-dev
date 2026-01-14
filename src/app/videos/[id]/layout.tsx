import { Metadata, ResolvingMetadata } from 'next'
import { createGetRequest } from '@/lib/api-helpers'
import { normalizeUrl, getSiteUrl } from '@/components/Utils'

export async function generateMetadata({ params }: { params: { id: any, test: any } }, parent: ResolvingMetadata): Promise<Metadata> {
    const { id } = params;
    const siteUrl = getSiteUrl('https://perfectpornsite.com')

    // ✅ FIX : Valeurs par défaut pour éviter les erreurs si l'API échoue
    let res: any = {
        title: 'Video',
        description: 'Watch this video',
        imgUrl: '',
        videoUrl: ''
    };

    try {
        const apiUrlEndpoint = normalizeUrl(siteUrl, `api/dataVideo?value=${id}`)
        
        // ✅ OPTIMISÉ : Utilisation de createGetRequest() au lieu de postData: any (corrige aussi le bug header → headers)
        const requestData = createGetRequest()
        const product = await fetch(apiUrlEndpoint, requestData)
        
        if (!product.ok) {
            console.error(`API error: ${product.status} ${product.statusText}`);
        } else {
            const data = await product.json();
            // ✅ FIX : Vérifier si la réponse contient une erreur ou si c'est un objet valide
            if (data && !data.error && data.title) {
                res = data;
            }
        }
    } catch (error) {
        console.error('Error fetching video data:', error);
        // res garde ses valeurs par défaut
    }

    // ✅ FIX : Vérifier que res.title existe avant d'utiliser .split()
    const title = res.title || 'Video';
    const description = res.description ? res.description.substring(0, 155) + '...' : title;

    let tableauDeMots = title.split(' ');
    // Filtrer les mots pour ne garder que ceux de plus de deux lettres
    let tableauFiltre = tableauDeMots.filter((mot: string) => mot.length > 2);
    // Filtrer les valeurs pour ne garder que les chiffres et les lettres
    let tableauFinal = tableauFiltre.map((mot: string) => mot.replace(/[^a-zA-Z0-9]/g, ''));
    tableauFinal.push(title)

    const videoUrl = normalizeUrl(siteUrl, `videos/${id}?name=${encodeURI(title)}`)

    return {
        title: title,
        description: description,
        keywords: tableauFinal,
        alternates: {
            canonical: videoUrl,
        },
        // ✅ AMÉLIORATION OPENGRAPH : Ajout de dimensions (1200x630 recommandé), locale, type vidéo, et métadonnées temporelles
        openGraph: {
            title: title,
            description: description,
            url: videoUrl,
            siteName: "Perfect Porn",
            locale: "en_US", // ✅ NOUVEAU : Indique la langue/zone géographique pour un meilleur référencement
            type: "video.movie", // ✅ AMÉLIORÉ : "video.movie" au lieu de "website" pour indiquer que c'est une vidéo (meilleur pour les réseaux sociaux)
            images: res.imgUrl ? [{
                url: res.imgUrl,
                alt: title,
                width: 1200, // ✅ NOUVEAU : Dimensions explicites pour éviter les coupures d'images sur les réseaux sociaux
                height: 630, // ✅ NOUVEAU : Ratio 1.91:1 recommandé par Facebook/LinkedIn
                type: "image/jpeg" // ✅ NOUVEAU : Type MIME de l'image
            }] : undefined,
            // ✅ NOUVEAU : Métadonnées vidéo pour OpenGraph (améliore le rendu sur Facebook/LinkedIn)
            videos: res.videoUrl ? [{
                url: res.videoUrl.split(',')[0], // Prendre la première URL de vidéo
                type: "text/html", // Type de contenu vidéo
                width: 1280, // Largeur de la vidéo
                height: 720 // Hauteur de la vidéo
            }] : undefined
        },
        // ✅ NOUVEAU : TWITTER CARDS - Optimise le partage sur Twitter/X avec de grandes images
        twitter: {
            card: "summary_large_image", // ✅ Type de carte Twitter (grande image = meilleur engagement)
            title: title, // ✅ Titre optimisé pour Twitter
            description: description, // ✅ Description pour Twitter (limite à 200 caractères)
            images: res.imgUrl ? [res.imgUrl] : undefined, // ✅ Image principale (Twitter utilise la première image)
            // creator: '@PerfectPorn', // Optionnel : votre compte Twitter si disponible
            // site: '@PerfectPorn' // Optionnel : compte Twitter du site
        }
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }