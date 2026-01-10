'use client'

import { useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    AdProvider?: any[]
  }
}

export default function AdBannerVideos() {
  useEffect(() => {
    // Initialiser AdProvider immédiatement et pousser la commande serve
    // (comme dans le code original: (AdProvider = window.AdProvider || []).push({"serve": {}}))
    // Cela permet de stocker les commandes même si le script externe n'est pas encore chargé
    if (typeof window !== 'undefined') {
      window.AdProvider = window.AdProvider || []
      // Pousser la configuration immédiatement - sera traitée quand le script se chargera
      window.AdProvider.push({ serve: {} })
    }
  }, [])

  const handleScriptLoad = () => {
    // Si le script vient de se charger et qu'AdProvider n'a pas encore été initialisé
    // (cas rare où useEffect n'a pas encore été exécuté), initialiser maintenant
    if (typeof window !== 'undefined') {
      if (!window.AdProvider) {
        window.AdProvider = []
        window.AdProvider.push({ serve: {} })
      }
    }
  }
  
  return (
    <>
      {/* Script externe pour charger ad-provider.js */}
      <Script
        src="https://a.magsrv.com/ad-provider.js"
        strategy="afterInteractive"
        async
        onLoad={handleScriptLoad}
        onError={() => console.error('Failed to load ad-provider.js')}
      />
      
      {/* Conteneur pour la bannière publicitaire */}
      <ins 
        className="eas6a97888e2" 
        data-zoneid="5824414"
      />
    </>
  )
}
