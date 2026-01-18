"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import PageListVideo from './PageListVideo'
import { VideoResult } from '@/lib/api-types'

interface HomeVideosClientProps {
  videos: VideoResult[]
  page: number
  numberPage: number
  order: string
}

/**
 * ✅ COMPOSANT CLIENT : Wrapper Client pour gérer l'interactivité du tri
 * 
 * RAISON D'ÊTRE :
 * - La page principale (page.tsx) est maintenant un Server Component
 * - Le tri (changement de order) nécessite de l'interactivité côté client
 * - Ce composant gère le state du tri via les searchParams de l'URL
 * 
 * AVANTAGES :
 * - Utilise les searchParams de l'URL au lieu de useState local
 * - Le changement de tri recharge les données côté serveur (SSR)
 * - Meilleur SEO : les URLs contiennent l'ordre de tri (?order=Latest)
 * - Navigation possible (retour/en avant) avec l'état du tri préservé
 */
export default function HomeVideosClient({ 
  videos, 
  page, 
  numberPage, 
  order 
}: HomeVideosClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ✅ GESTION DU TRI : Fonction pour changer l'ordre via l'URL
  const setValueMenu = (newOrder: string) => {
    // ✅ CONSTRUCTION DES PARAMÈTRES : Garde la page actuelle, change seulement l'order
    const params = new URLSearchParams(searchParams.toString())
    params.set('order', newOrder)
    
    // ✅ NAVIGATION : Garde la page 1 si on change d'ordre (comportement attendu)
    params.set('page', '1')
    
    router.push(`/?${params.toString()}`)
  }

  // ✅ VALIDATION DU TRI : Liste des ordres valides (comme dans PageListVideo)
  const validOrders = useMemo(() => {
    // Si on a des vidéos avec titres, on a plus d'options de tri
    if (videos.length > 0 && videos[0].title) {
      return ["Latest", "More View", "Most Popular", "A->Z", "Z->A"]
    }
    return ["Latest", "A->Z", "Z->A"]
  }, [videos])

  // ✅ VALIDATION : S'assure que l'order actuel est valide, sinon "Latest"
  const validatedOrder = validOrders.includes(order) ? order : "Latest"

  return (
    <PageListVideo
      valueMenu={validatedOrder}
      setValueMenu={setValueMenu}
      videos={videos}
      page={page}
      numberPage={numberPage}
      type=""
      nbrVideo={0}
      loading={false}
    />
  )
}
