import { upperFirstLetter } from '@/components/Utils'

export async function generateMetadata({ params, }: { params: { id: string, test: string }; }) {
    const { test } = params;

    return {
        title: `${upperFirstLetter(test)}s`,
        description: `Discover all the ${test}s, on Perfect Porn the best porn website`,
        alternates: {
            canonical: `${process.env.Site_URL}/${test}`,
        },
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }