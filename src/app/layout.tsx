import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Inter } from 'next/font/google'

import './globals.css'

import Header from '../components/Header'

// ✅ OPTIMISÉ : Lazy load des composants non critiques (sans ssr: false pour éviter les erreurs Suspense)
const SpeedInsights = dynamic(() => import("@vercel/speed-insights/next").then(mod => ({ default: mod.SpeedInsights })), {
  loading: () => null
})
const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => ({ default: mod.Analytics })), {
  loading: () => null
})
const MoreEighteen = dynamic(() => import('@/components/MoreEighteen'), {
  loading: () => null
})
const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => null
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.Site_URL as string),
  title: {
    absolute: '',
    default: 'Perfect Porn | The site for fulfilling your Fantasies.',
    template: '%s | Perfect Porn'
  },
  keywords: ['PerfectPorn', 'Perfect Porn', 'Watch Porn', 'Watch Free Porn', 'free porn', 'Free Porn Videos', 'free', 'more eighteen', 'sexe', 'videos sexe', 'porno videos', 'porno video', 'porno', 'pornographie', 'pornographique', 'xxx', 'perfectporn', 'perfect porn'],
  description: 'Explore diverse and high-quality content at Perfect Porn. Your ultimate destination for fulfilling fantasies.',
  applicationName: 'Perfectporn',
  authors: [{ name: "Phoenix", url: `${process.env.Site_URL}` }],
  publisher: 'Phoenix',
  alternates: { canonical: `${process.env.Site_URL}` },
  robots: 'max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  verification: {google: "iEbYUqh_jKgVnifPqHYfD2o2pFxUBhWVHjyFuwtl864",},
  // ✅ AMÉLIORATION OPENGRAPH : Ajout de dimensions, locale, et métadonnées complètes
  openGraph: {
    title: "Perfect Porn - Best Free HD Porn Videos",
    description: "Perfect Porn - The best porn site with all your dream videos. Watch free HD adult content including channels, pornstars, and categories.",
    url: `${process.env.Site_URL}`,
    siteName: "Perfect Porn",
    locale: "en_US", // ✅ NOUVEAU : Indique la langue/zone géographique
    type: "website",
    images: [{
      url: '/opengraph-image.png',
      alt: 'Image of Perfect Porn the site for fulfilling your Fantasies.',
      width: 1200, // ✅ NOUVEAU : Dimensions explicites (1200x630 recommandé par Facebook/LinkedIn)
      height: 630, // ✅ NOUVEAU : Ratio 1.91:1 pour un rendu optimal
      type: "image/png" // ✅ NOUVEAU : Type MIME de l'image
    }],
  },
  // ✅ NOUVEAU : TWITTER CARDS - Optimise le partage sur Twitter/X
  twitter: {
    card: "summary_large_image", // ✅ Type de carte avec grande image (meilleur engagement)
    title: "Perfect Porn - Best Free HD Porn Videos", // ✅ Titre optimisé pour Twitter
    description: "Perfect Porn - The best porn site with all your dream videos. Watch free HD adult content.", // ✅ Description pour Twitter
    images: ['/opengraph-image.png'], // ✅ Image principale pour Twitter
    // creator: '@PerfectPorn', // Optionnel : votre compte Twitter si disponible
    // site: '@PerfectPorn' // Optionnel : compte Twitter du site
  }
}

export const viewport: Viewport = {
  themeColor: 'black',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      {/* ✅ OPTIMISÉ : GoogleAnalytics est déjà optimisé par Next.js third-parties */}
      <GoogleAnalytics gaId="G-BCSQYEJTZZ" />
      <SpeedInsights />
      <Analytics />
      <body className={inter.className} suppressHydrationWarning={true}>
        <MoreEighteen />
{/*         <ModalPub /> */}
        <main className="flex min-h-screen flex-col items-center">
          <Header />
          <section className="w-full mt-[72px] py-6 lg:px-12 min-h-[calc(100vh-92px)] ">
            {children}
          </section>
          <Footer />
        </main>

      </body>
    </html>
  )
}
