import { upperFirstLetter } from '@/components/Utils'

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

    return {
        title: `${upperFirstLetter(type)}s`,
        description: `Discover all the ${type}s, on Perfect Porn the best porn website`,
        alternates: {
            canonical: `${process.env.Site_URL}/${type}`,
        },
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }