import type { Metadata } from 'next'
import { upperFirstLetter } from '@/components/Utils'

type Props = { params: { name: string } }

export async function generateMetadata({ params }: (Props)): Promise<Metadata> {
    return { title: upperFirstLetter('Search : ' + decodeURI(params.name)) }
}

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }