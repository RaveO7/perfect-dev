'use client'

import Script from 'next/script'

export default function PopupAdScript() {
  return (
    <Script
      id="popup-ad-script"
      data-cfasync="false"
      src="//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1238383"
      strategy="afterInteractive"
    />
  )
}
