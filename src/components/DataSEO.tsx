import { NextSeo } from 'next-seo';

const PageSeo = () => (
    <>
        <NextSeo
            title="Perfect Porn"
            description="Perfec tPorn the best site for the best free porn video"
            canonical="PerfectPorn the best site for the best free porn video"
            openGraph={{
                url: 'https://perfectporn.vercel.app/',
                title: 'Perfect Porn',
                description: 'Perfect Porn the best site for the best free porn video',
                images: [
                    {
                        url: 'https://www.example.ie/og-image-01.jpg',
                        width: 800,
                        height: 600,
                        alt: 'Og Image Alt',
                        type: 'image/jpeg',
                    },
                ],
                siteName: 'Perfect Porn',
            }}
            twitter={{
                handle: '@handle',
                site: '@site',
                cardType: 'summary_large_image',
            }}
        />
        <p>SEO Added to Page</p>
    </>
);

export default PageSeo;