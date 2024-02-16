import type { Metadata, Viewport } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google'

import { Inter } from 'next/font/google'

import './globals.css'

import Header from '../components/Header'
import MoreEighteen from '@/components/MoreEighteen'
import ModalPub from '@/components/ModalPub';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
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
  openGraph: {
    title: "Perefect Porn Best porn site",
    description: "Perfect Porn the porn site with all you dreams videos",
    url: `${process.env.Site_URL}`,
    siteName: "PerefectPorn",
    images: [{
      url: '/opengraph-image.png',
      alt: 'Image of Perfect Porn the site for fulfilling your Fantasies.'
    }],
    type: "website",
  }
}

export const viewport: Viewport = {
  themeColor: 'black',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      {/* <GoogleAnalytics gaId="G-BCSQYEJTZZ" />
      <SpeedInsights />
      <Analytics /> */}
      <body className={inter.className} suppressHydrationWarning={true}>
        <MoreEighteen />
        {/* <ModalPub /> */}
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