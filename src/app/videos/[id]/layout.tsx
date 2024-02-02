import { Metadata, ResolvingMetadata } from 'next'

// export async function generateMetadata({ params }: { params: { id: any, test: any } }, parent: ResolvingMetadata): Promise<Metadata> {
//     const { id } = params;

    // const apiUrlEndpoint = `${process.env.Site_URL}/api/dataVideo`

    // const postData: any = {
    //     method: "POST",
    //     header: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ id: id })
    // }
    // const product = await fetch(apiUrlEndpoint, postData)
    // const res = await product.json()

    // const description = res.description.substring(0, 151) + ' ...';

    // return {
    //     title: `${res.title}`,
    //     description: `${description}`,
    //     keywords: ['bite'],
    //     alternates: {
    //         canonical: `${process.env.Site_URL}/videos/${id}?name=${encodeURI(res.title)}`,
    //     },
    //     openGraph: {
    //         title: `${res.title}`,
    //         description: `${description}`,
    //         url: `${process.env.Site_URL}/videos/${id}?name=${encodeURI(res.title)}`,
    //         siteName: "Perefect Porn",
    //         images: [{
    //             url: `${res.imgUrl}`,
    //         }],
    //         type: "website",
    //     }
    // };
// }

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }