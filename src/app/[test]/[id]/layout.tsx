import type { Metadata } from 'next'
import { upperFirstLetter } from '@/components/Utils'

type Props = { params: { test: string, id: string } }

export async function generateMetadata({ params }: (Props)): Promise<Metadata> {
    return { title: upperFirstLetter(params.id + ' | PerfectPorn') }
}

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }