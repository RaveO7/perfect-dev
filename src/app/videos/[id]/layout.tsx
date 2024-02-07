import { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata({ params }: { params: { id: any, test: any } }, parent: ResolvingMetadata): Promise<Metadata> {
    const { id } = params;

    const apiUrlEndpoint = `${process.env.Site_URL}/api/dataVideo?value=${id}`

    const postData: any = {
        method: "GET",
        header: { "Content-Type": "application/json" },
    }
    const product = await fetch(apiUrlEndpoint, postData)
    const res = await product.json()

    const description = res.description.substring(0, 151) + ' ...';

    let tableauDeMots = res.title.split(' ');
    // Filtrer les mots pour ne garder que ceux de plus de deux lettres
    let tableauFiltre = tableauDeMots.filter((mot: string) => mot.length > 2);
    // Filtrer les valeurs pour ne garder que les chiffres et les lettres
    let tableauFinal = tableauFiltre.map((mot: string) => mot.replace(/[^a-zA-Z0-9]/g, ''));
    tableauFinal.push(res.title)

    return {
        title: `${res.title}`,
        description: `${description}`,
        keywords: tableauFinal,
        alternates: {
            canonical: `${process.env.Site_URL}/videos/${id}?name=${encodeURI(res.title)}`,
        },
        openGraph: {
            title: `${res.title}`,
            description: `${description}`,
            url: `${process.env.Site_URL}/videos/${id}?name=${encodeURI(res.title)}`,
            siteName: "Perefect Porn",
            images: [{
                url: `${res.imgUrl}`,
                alt: `${res.title}`,
            }],
            type: "website",
        }
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }