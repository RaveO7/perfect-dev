'use client'
import { useEffect, useState } from 'react';

const AdBlockChecker = () => {
    const [isBlocked, setIsBlocked] = useState<boolean | null>(null);

    const checkAdblock = async () => {
        appendIframeAds();
        let blockedByIframe = await hasAdblockByIframe();
        if (!blockedByIframe) {
            blockedByIframe = await hasAdblockByScript();
        }

        if (blockedByIframe) {
            setIsBlocked(true);
        } else {
            setIsBlocked(false);
        }
    };

    const hasAdblockByScript = async () => {
        const urls = [
            "https://adblockanalytics.com",
        ];

        for (const url of urls) {

            const config: any = {
                method: 'HEAD',
                mode: 'no-cors',
            };
            const request = new Request(url, config);


            try {
                const t = await fetch(request);
                return false;
            } catch (error) {
                console.clear()
                // Blocked by script
            }
        }

        return true;
    };

    const hasAdblockByIframe = () => {
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                let status = false;
                const iframe = document.getElementById("ads-text-iframe") as HTMLIFrameElement | null;

                if (iframe && (
                    iframe.style.display === "none" ||
                    iframe.style.display === "hidden" ||
                    iframe.style.visibility === "hidden" ||
                    iframe.offsetHeight === 0
                )) {
                    status = true;
                }

                if (iframe) {
                    iframe.remove();
                }

                resolve(status);
            }, 100);
        });
    };

    const appendIframeAds = () => {
        const iframe = document.createElement("iframe");
        iframe.height = "1px";
        iframe.width = "1px";
        iframe.id = "ads-text-iframe";
        iframe.src = "https://domain.com/ads.html";
        document.body.appendChild(iframe);
    };

    useEffect(() => {
        checkAdblock();

        // Cleanup function
        return () => {
            const adsIframe = document.getElementById("ads-text-iframe");
            if (adsIframe) {
                document.body.removeChild(adsIframe);
            }
        };
    }, []);

    return new Promise<boolean>((resolve) => {
        const interval = setInterval(() => {
            if (isBlocked !== null) {
                clearInterval(interval);
                resolve(isBlocked);
            }
        }, 100);
    });
};

export default AdBlockChecker;