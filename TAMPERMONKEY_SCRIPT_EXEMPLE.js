// ==UserScript==
// @name         Perfect Porn - Bloqueur de pubs pour iframes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bloque les publicités dans les lecteurs dood.pm et streamtape.com
// @author       Vous
// @match        https://dood.pm/*
// @match        https://streamtape.com/*
// @match        https://perfect-dev.vercel.app/*
// @match        http://localhost:3000/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour masquer les éléments de pub
    function hideAds() {
        // Sélecteurs CSS pour les éléments de pub courants
        const adSelectors = [
            // Bannières publicitaires
            '.ad',
            '.advertisement',
            '.ad-banner',
            '.ad-container',
            '.ad-wrapper',
            '[class*="ad"]',
            '[id*="ad"]',
            
            // Overlays publicitaires
            '.ad-overlay',
            '.ad-popup',
            '.ad-modal',
            
            // Vidéos publicitaires
            '.ad-video',
            '.preroll',
            '.midroll',
            
            // Autres patterns
            '[data-ad]',
            '[data-advertisement]',
        ];

        adSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    // Vérifier si l'élément ressemble à une pub
                    const style = window.getComputedStyle(el);
                    const text = el.textContent || '';
                    
                    // Masquer si c'est probablement une pub
                    if (text.toLowerCase().includes('ad') || 
                        text.toLowerCase().includes('advertisement') ||
                        el.offsetWidth < 300 || // Petites bannières
                        el.offsetHeight < 50) {
                        el.style.display = 'none !important';
                        el.style.visibility = 'hidden !important';
                        el.style.opacity = '0 !important';
                    }
                });
            } catch (e) {
                console.log('Erreur avec le sélecteur:', selector, e);
            }
        });
    }

    // Fonction pour bloquer les requêtes de pub
    function blockAdRequests() {
        // Intercepter fetch
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string') {
                // Bloquer les domaines de pub
                const adDomains = [
                    'adtng.com',
                    'tsyndicate.com',
                    'doubleclick.net',
                    'googlesyndication.com',
                    'advertising.com',
                ];
                
                if (adDomains.some(domain => url.includes(domain))) {
                    console.log('🚫 Pub bloquée:', url);
                    return Promise.reject(new Error('Blocked by ad blocker'));
                }
            }
            return originalFetch.apply(this, args);
        };

        // Intercepter XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            const adDomains = [
                'adtng.com',
                'tsyndicate.com',
                'doubleclick.net',
                'googlesyndication.com',
            ];
            
            if (adDomains.some(domain => url.includes(domain))) {
                console.log('🚫 XHR Pub bloquée:', url);
                return;
            }
            return originalXHROpen.apply(this, arguments);
        };
    }

    // Observer pour détecter les nouveaux éléments ajoutés dynamiquement
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                hideAds();
            }
        });
    });

    // Démarrer quand la page est chargée
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            blockAdRequests();
            hideAds();
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    } else {
        blockAdRequests();
        hideAds();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Réexécuter périodiquement (pour les pubs chargées après)
    setInterval(hideAds, 2000);
})();



