import type { Metadata, Viewport } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google'

import { Inter } from 'next/font/google'

import './globals.css'

import Header from '../components/Header'
import MoreEighteen from '@/components/MoreEighteen'
import Footer from '@/components/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

import { normalizeUrl, getSiteUrl } from '@/components/Utils'
import AdBanner from '@/components/pubs/AdBanner';
import AdProviderScript from '@/components/pubs/AdProviderScript';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Obtenir l'URL du site de manière sécurisée
const siteUrl = getSiteUrl('https://perfectpornsite.com');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    absolute: '',
    default: 'Perfect Porn | The site for fulfilling your Fantasies.',
    template: '%s | Perfect Porn'
  },
  keywords: ['PerfectPorn', 'Perfect Porn', 'Watch Porn', 'Watch Free Porn', 'free porn', 'Free Porn Videos', 'free', 'more eighteen', 'sexe', 'videos sexe', 'porno videos', 'porno video', 'porno', 'pornographie', 'pornographique', 'xxx', 'perfectporn', 'perfect porn'],
  description: 'Explore diverse and high-quality content at Perfect Porn. Your ultimate destination for fulfilling fantasies.',
  applicationName: 'Perfectporn',
  authors: [{ name: "Phoenix", url: normalizeUrl(siteUrl) }],
  publisher: 'Phoenix',
  alternates: { canonical: normalizeUrl(siteUrl) },
  robots: 'max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  verification: {google: "iEbYUqh_jKgVnifPqHYfD2o2pFxUBhWVHjyFuwtl864",},
  // ✅ AMÉLIORATION OPENGRAPH : Ajout de dimensions, locale, et métadonnées complètes
  openGraph: {
    title: "Perfect Porn - Best Free HD Porn Videos",
    description: "Perfect Porn - The best porn site with all your dream videos. Watch free HD adult content including channels, pornstars, and categories.",
    url: normalizeUrl(siteUrl),
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
  },
  other: {
    "6a97888e-site-verification": "07bc72bd8d75f7e97c8be4156fee565a",
  }
}

export const viewport: Viewport = {
  themeColor: 'black',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <GoogleAnalytics gaId="G-BCSQYEJTZZ" />
      <SpeedInsights />
      <Analytics />
      {/* Charger le script ad-provider une seule fois globalement */}
      <AdProviderScript />
      <body className={inter.className} suppressHydrationWarning={true}>
        <ErrorBoundary>
          <MoreEighteen />
          <main className="flex min-h-screen flex-col items-center">
            <Header />
            <section className="w-full mt-[72px] py-6 lg:px-12 min-h-[calc(100vh-92px)] ">
              {children}
            </section>
            <AdBanner />
            <Footer />
          </main>
        </ErrorBoundary>
      </body>
    </html>
  )
}
