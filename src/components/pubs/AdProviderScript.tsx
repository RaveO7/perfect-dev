'use client'

import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    AdProvider?: any[]
  }
}

export default function AdProviderScript() {
  const handleScriptLoad = () => {
    try {
      if (typeof window !== 'undefined') {
        window.AdProvider = window.AdProvider || []
        window.AdProvider.push({ serve: {} })
      }
    } catch (error) {
      // Silencieusement ignorer les erreurs de chargement du script publicitaire
      if (process.env.NODE_ENV === 'development') {
        console.warn('AdProvider script error:', error)
      }
    }
  }

  const handleScriptError = (error: Error) => {
    // Ne pas afficher d'erreur en production pour éviter de polluer la console
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to load ad-provider.js:', error)
    }
  }

  return (
    <Script
      id="ad-provider-script-global"
      src="https://a.magsrv.com/ad-provider.js"
      strategy="afterInteractive"
      onLoad={handleScriptLoad}
      onError={handleScriptError}
    />
  )
}

