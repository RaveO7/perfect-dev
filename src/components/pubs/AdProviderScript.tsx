'use client'

import Script from 'next/script'

declare global {
  interface Window {
    AdProvider?: any[]
  }
}

export default function AdProviderScript() {
  const handleScriptLoad = () => {
    if (typeof window !== 'undefined') {
      window.AdProvider = window.AdProvider || []
      window.AdProvider.push({ serve: {} })
    }
  }

  return (
    <Script
      id="ad-provider-script-global"
      src="https://a.magsrv.com/ad-provider.js"
      strategy="afterInteractive"
      onLoad={handleScriptLoad}
      onError={() => console.error('Failed to load ad-provider.js')}
    />
  )
}

