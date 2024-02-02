import type { Metadata } from 'next'
import { upperFirstLetter } from '@/components/Utils'

type Props = { params: { test: string, id: string } }

// export async function generateMetadata({ params }: (Props)): Promise<Metadata> {
//     return { title: upperFirstLetter(params.id + ' | PerfectPorn') }
// }


export async function generateMetadata({
    params,
}: {
    params: { id: string, test: string };
}) {
    
    const { test } = params;
    const siteURL = 'http://localhost:3000';

    return {
        title: `${upperFirstLetter(test)}s`,
        description: `Discover all the ${test}s, on Perfect Porn the best porn website`,
        alternates: {
            canonical: `${siteURL}/${test}`,
        },
    };
}


export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }