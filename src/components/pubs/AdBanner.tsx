'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    AdProvider?: any[]
  }
}

export default function AdBanner() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Initialiser AdProvider et pousser la commande serve
    // Le script est déjà chargé dans le layout, donc on peut directement utiliser AdProvider
    if (typeof window !== 'undefined') {
      // S'assurer que AdProvider est initialisé
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
      data-zoneid="5820858"
      style={{ display: 'block', textAlign: 'center', minHeight: '100px' }}
      suppressHydrationWarning
    />
  )
}
