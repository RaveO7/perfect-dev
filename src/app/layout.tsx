import type { Metadata } from 'next'
import type { Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'
import AdBlock from '@/components/AdBlock'
import MoreEighteen from '@/components/MoreEighteen'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    absolute: '',
    default: 'PerfectPorn | Best Porn Site',
    template: '%s | PerfectPorn'
  },
  description: 'PerfectPorn the best site for the best free porn video',
  applicationName: 'Perfectporn',
  authors: [{ name: "Phoenix", url: "https://perfectporn.vercel.app" }],
  alternates: { canonical: "https://perfectporn.vercel.app" },
  openGraph: {
    title: "PerefectPorn Best porn site",
    description: "PerfectPorn the best site for the best free porn video",
    url: "https://perfectporn.vercel.app",
    siteName: "PerefectPorn",
    images: [{
      url: "https://hdporn92.com/wp-content/uploads/2024/01/432635947_118446_01_01.jpg",
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
    <html lang="en">
      <body className={inter.className}>
        <AdBlock />
        <MoreEighteen />
        <main className="flex min-h-screen flex-col items-center ">
          <Header />
          <section className="w-full mt-[72px] py-6 lg:px-12 ">
            {children}
          </section>
        </main>
      </body>
    </html>
  )
}