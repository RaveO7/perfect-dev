'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    AdProvider?: any[]
  }
}

export default function AdBannerVideos() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Le script est déjà chargé dans le layout, donc on peut directement utiliser AdProvider
    if (typeof window !== 'undefined') {
      window.AdProvider = window.AdProvider || []
      
      // Fonction pour servir les pubs après un délai pour s'assurer que le script est chargé
      const initAds = () => {
        if (window.AdProvider && typeof window.AdProvider.push === 'function') {
          window.AdProvider.push({ serve: {} })
        } else {
          // Si AdProvider n'est pas encore disponible, réessayer après un court délai
          setTimeout(initAds, 100)
        }
      }
      
      // Attendre un peu que le script se charge si ce n'est pas déjà fait
      setTimeout(initAds, 500)
    }
  }, [])

  // Ne pas rendre le contenu côté serveur pour éviter les problèmes d'hydration
  if (!isMounted) {
    return null
  }
  
  return (
    <ins 
      className="eas6a97888e2" 
      data-zoneid="5824414"
      style={{ display: 'block', textAlign: 'center' }}
      suppressHydrationWarning
    />
  )
}
