import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getOrderClauseForVideos, calculatePagination } from '@/lib/query-helpers'
import { VideoResult } from '@/lib/api-types'
import { Prisma } from '@prisma/client'
import HomeVideosClient from '@/components/HomeVideosClient'
import { normalizeUrl, getSiteUrl } from '@/components/Utils'

// ✅ CONVERSION SERVER COMPONENT : Récupération des métadonnées pour le SEO
const siteUrl = getSiteUrl('https://perfectpornsite.com')

export const metadata: Metadata = {
  title: {
    default: 'Perfect Porn | The site for fulfilling your Fantasies.',
    template: '%s | Perfect Porn'
  },
  description: 'Explore diverse and high-quality content at Perfect Porn. Your ultimate destination for fulfilling fantasies. Watch free HD adult content including channels, pornstars, and categories.',
  keywords: ['PerfectPorn', 'Perfect Porn', 'Watch Porn', 'Watch Free Porn', 'free porn', 'Free Porn Videos', 'free', 'more eighteen', 'sexe', 'videos sexe', 'porno videos', 'porno video', 'porno', 'pornographie', 'pornographique', 'xxx', 'perfectporn', 'perfect porn'],
  alternates: {
    canonical: normalizeUrl(siteUrl)
  },
  openGraph: {
    title: "Perfect Porn - Best Free HD Porn Videos",
    description: "Perfect Porn - The best porn site with all your dream videos. Watch free HD adult content including channels, pornstars, and categories.",
    url: normalizeUrl(siteUrl),
    siteName: "Perfect Porn",
    locale: "en_US",
    type: "website",
    images: [{
      url: '/opengraph-image.png',
      alt: 'Image of Perfect Porn the site for fulfilling your Fantasies.',
      width: 1200,
      height: 630,
      type: "image/png"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfect Porn - Best Free HD Porn Videos",
    description: "Perfect Porn - The best porn site with all your dream videos. Watch free HD adult content.",
    images: ['/opengraph-image.png'],
  },
}

// ✅ CONVERSION SERVER COMPONENT : Interface pour les searchParams
interface HomePageProps {
  searchParams: { 
    page?: string | string[]
    order?: string 
  }
}

/**
 * ✅ CONVERSION SERVER COMPONENT : Page d'accueil convertie en Server Component
 * 
 * AVANT (Client Component) :
 * - Utilisait "use client" avec useState/useEffect
 * - Faisait un fetch vers /api/homeVideos côté client
 * - Pas de métadonnées SSR pour le SEO
 * 
 * APRÈS (Server Component) :
 * - Récupère les données directement depuis Prisma côté serveur
 * - Génère les métadonnées côté serveur pour un meilleur SEO
 * - Meilleure performance (pas de round-trip client -> serveur)
 * - Support du SSG/SSR pour un chargement initial plus rapide
 */
export default async function Home({ searchParams }: HomePageProps) {
  // ✅ EXTRACTION DES PARAMÈTRES : Gestion des searchParams (page et order)
  const pageNbr = searchParams.page 
    ? (Array.isArray(searchParams.page) 
        ? parseInt(searchParams.page[0]) 
        : parseInt(searchParams.page)) || 1
    : 1
  
  // Valeur absolue pour éviter les pages négatives
  const normalizedPageNbr = Math.abs(pageNbr) || 1
  
  // ✅ EXTRACTION DU TRI : "Latest" par défaut, validé par getOrderClauseForVideos
  const order = searchParams.order || "Latest"

  // ✅ RÉCUPÉRATION DES DONNÉES : Directement depuis Prisma (comme dans homeVideos.ts)
  const numberVideoByPage = parseInt(process.env.Number_Video || '24')
  const { startSearchVideo } = calculatePagination(normalizedPageNbr, numberVideoByPage)
  const orderClause = getOrderClauseForVideos(order, true)
  
  // ✅ OPTIMISATION : Calcul du total une seule fois
  const totalCount = await prisma.videos.count()
  
  // ✅ REQUÊTE SQL : Même logique que dans /api/homeVideos.ts
  const videos = await prisma.$queryRaw<VideoResult[]>(
    Prisma.sql`
      SELECT id, title, imgUrl, time, v.like, dislike, view, ${totalCount} AS nbr
      FROM Videos v
      ${Prisma.raw(orderClause)}
      LIMIT ${startSearchVideo}, ${numberVideoByPage}
    `
  )

  // ✅ CALCUL DU NOMBRE DE PAGES : Comme dans l'API route
  const nbrPage = videos.length > 0 
    ? Math.ceil(Number(videos[0].nbr) / numberVideoByPage)
    : 1

  // ✅ NETTOYAGE DES DONNÉES : Conversion du nbr en nombre pour chaque vidéo
  const cleanedVideos = videos.map(video => ({
    ...video,
    nbr: Math.ceil(Number(video.nbr) / numberVideoByPage)
  }))

  // ✅ COMPOSANT CLIENT : Passe les données au composant Client pour l'interactivité (tri)
  return (
    <HomeVideosClient
      videos={cleanedVideos}
      page={normalizedPageNbr}
      numberPage={nbrPage}
      order={order}
    />
  )
}
