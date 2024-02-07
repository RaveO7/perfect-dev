export async function generateMetadata({ params }: { params: { id: string, type: string }; }) {
    const { id } = params;
    const { type } = params;

    return {
        title: `${decodeURI(id)}`,
        description: `Discover the ${type}, ${decodeURI(id)} `,
        alternates: {
            canonical: `${process.env.Site_URL}/${type}/${id}`,
        },
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }