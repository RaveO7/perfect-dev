import type { Metadata } from 'next'
import type { Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'
import AdBlock from '@/components/AdBlock'
import MoreEighteen from '@/components/MoreEighteen'
import ModalPub from '@/components/ModalPub'
import PageDontLeave from '@/components/PageDontLeave'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    absolute: '',
    default: 'Perfect Porn | Best Porn Site',
    template: '%s | Perfect Porn'
  },
  description: 'Explore diverse and high-quality content at Perfect Porn. Your ultimate destination for fulfilling fantasies.',
  applicationName: 'Perfectporn',
  authors: [{ name: "Phoenix", url: `${process.env.Site_URL}` }],
  publisher: 'Phoenix',
  alternates: { canonical: `${process.env.Site_URL}` },
  openGraph: {
    title: "Perefect Porn Best porn site",
    description: "Perfect Porn the porn site with all you dreams videos",
    url: `${process.env.Site_URL}`,
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
    <html lang="en" >
      <body className={inter.className} suppressHydrationWarning={true}>
        {/* <MoreEighteen /> */}
        {/* <AdBlock /> */}
        {/* <ModalPub /> */}
        {/* <PageDontLeave /> */}
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