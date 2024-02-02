export async function generateMetadata({ params }: { params: { id: string, test: string }; }) {
    const { id } = params;
    const { test } = params;

    return {
        title: `${id}`,
        description: `Discover the ${test}, ${id} `,
        alternates: {
            canonical: `${process.env.Site_URL}/${test}/${id}`,
        },
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }