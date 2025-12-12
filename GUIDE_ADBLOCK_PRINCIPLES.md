# 🛡️ Guide : Comment Fonctionne AdBlock

## 📋 Principes de Base d'AdBlock

AdBlock et uBlock Origin utilisent plusieurs techniques pour bloquer les publicités :

---

## 🔧 Techniques Principales

### 1. **Filtrage par Domaines (Domain Blocking)**

Bloquer les requêtes vers des domaines connus pour servir des publicités :

```javascript
const AD_DOMAINS = [
  'doubleclick.net',
  'googlesyndication.com',
  'googleadservices.com',
  'advertising.com',
  'adtng.com',
  'tsyndicate.com',
  // ... etc
];

// Intercepter fetch
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  if (typeof url === 'string' && AD_DOMAINS.some(domain => url.includes(domain))) {
    return Promise.reject(new Error('Blocked'));
  }
  return originalFetch.apply(this, args);
};
```

### 2. **Filtrage par Patterns d'URLs (URL Pattern Matching)**

Utiliser des expressions régulières pour identifier les URLs de pub :

```javascript
const AD_PATTERNS = [
  /\/ads?\//i,
  /\/advertising\//i,
  /\/banner/i,
  /\/popup/i,
  /\/track/i,
  /adserver/i,
  /advertisement/i,
];

function isAdUrl(url) {
  return AD_PATTERNS.some(pattern => pattern.test(url));
}
```

### 3. **Masquage d'Éléments DOM (Element Hiding)**

Masquer les éléments de pub avec CSS :

```javascript
const AD_SELECTORS = [
  '.ad',
  '.advertisement',
  '.ad-banner',
  '[class*="ad"]',
  '[id*="ad"]',
  '.ad-overlay',
  '.ad-popup',
];

function hideAds() {
  AD_SELECTORS.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = 'none';
      el.style.visibility = 'hidden';
      el.style.opacity = '0';
    });
  });
}
```

### 4. **Service Workers (Network Interception)**

Intercepter les requêtes réseau avant qu'elles n'atteignent le serveur :

```javascript
// Service Worker
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (isAdDomain(url.hostname)) {
    event.respondWith(new Response(null, { status: 204 }));
    return;
  }
  
  event.respondWith(fetch(event.request));
});
```

### 5. **Interception de Requêtes (Request Interception)**

Intercepter `fetch()` et `XMLHttpRequest` :

```javascript
// Intercepter fetch
const originalFetch = window.fetch;
window.fetch = function(...args) {
  if (isAdUrl(args[0])) {
    return Promise.reject(new Error('Blocked'));
  }
  return originalFetch.apply(this, args);
};

// Intercepter XMLHttpRequest
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
  if (isAdUrl(url)) {
    return; // Bloquer
  }
  return originalXHROpen.apply(this, arguments);
};
```

---

## 📚 Listes de Filtres (Filter Lists)

AdBlock utilise des listes de filtres comme **EasyList** :

### Format EasyList

```
! Commentaire
||example.com^$domain=example.org
##.ad-banner
#@#.ad-banner
```

**Syntaxe :**
- `||` = Domaine à bloquer
- `##` = Sélecteur CSS à masquer
- `#@#` = Exception (ne pas masquer)
- `$domain=` = Appliquer seulement sur certains domaines

### Exemple de Règles

```
||doubleclick.net^
||googlesyndication.com^
##.ad-banner
##div[id*="ad"]
#@#.ad-banner (exception)
```

---

## 🎯 Implémentation Complète (Concept)

Voici comment un AdBlock basique fonctionnerait :

```javascript
class SimpleAdBlock {
  constructor() {
    this.adDomains = [
      'doubleclick.net',
      'googlesyndication.com',
      'adtng.com',
      'tsyndicate.com',
    ];
    
    this.adSelectors = [
      '.ad', '.advertisement', '[class*="ad"]', '[id*="ad"]'
    ];
    
    this.init();
  }
  
  init() {
    this.interceptFetch();
    this.interceptXHR();
    this.hideAds();
    this.observeDOM();
  }
  
  interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      if (this.isAdUrl(args[0])) {
        return Promise.reject(new Error('Blocked'));
      }
      return originalFetch.apply(this, args);
    };
  }
  
  interceptXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      if (this.isAdUrl(url)) {
        return;
      }
      return originalOpen.apply(this, arguments);
    };
  }
  
  isAdUrl(url) {
    if (typeof url !== 'string') return false;
    return this.adDomains.some(domain => url.includes(domain));
  }
  
  hideAds() {
    this.adSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.display = 'none';
      });
    });
  }
  
  observeDOM() {
    const observer = new MutationObserver(() => {
      this.hideAds();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Utilisation
new SimpleAdBlock();
```

---

## ⚠️ Limitations

### 1. **Same-Origin Policy**
- Ne peut pas bloquer les pubs dans les iframes externes
- Ne peut pas modifier le DOM d'une iframe externe

### 2. **Détection Anti-AdBlock**
- Les sites peuvent détecter les bloqueurs
- Utilisent des techniques pour contourner le blocage

### 3. **Performance**
- Le filtrage peut ralentir le chargement
- L'observation du DOM consomme des ressources

---

## 🔍 Comment AdBlock Détecte les Pubs

### 1. **Listes de Domaines**
- Liste de milliers de domaines de pub connus
- Mise à jour régulière

### 2. **Patterns d'URLs**
- Expressions régulières pour identifier les URLs de pub
- Patterns comme `/ads/`, `/advertising/`, etc.

### 3. **Sélecteurs CSS**
- Sélecteurs pour masquer les éléments de pub
- Basés sur les classes/IDs communs

### 4. **Heuristiques**
- Détection basée sur la taille, position, contenu
- Analyse du comportement des éléments

---

## 💡 Pour Votre Cas (Iframes Externes)

**Problème :** Les pubs viennent des iframes externes (dood.pm, streamtape.com)

**Solutions possibles :**

1. **Service Worker** (limité)
   - Bloque les requêtes réseau
   - Ne peut pas modifier le contenu de l'iframe

2. **Proxy** (complexe)
   - Charge le contenu, filtre, renvoie
   - Peut violer les ToS

3. **Extension Navigateur** (utilisateur)
   - uBlock Origin avec règles personnalisées
   - Fonctionne mais dépend de l'utilisateur

4. **Hébergement Propre** (idéal)
   - Contrôle total, pas de pubs
   - Coût d'hébergement

---

## 📖 Ressources

- **uBlock Origin** : https://github.com/gorhill/uBlock
- **EasyList** : https://easylist.to/
- **Adblock Plus** : https://github.com/adblockplus/adblockplus

---

## 🎯 Conclusion

AdBlock fonctionne en :
1. ✅ Interceptant les requêtes réseau
2. ✅ Masquant les éléments DOM
3. ✅ Utilisant des listes de filtres
4. ✅ Observant les changements du DOM

**Pour votre cas spécifique** (iframes externes), les techniques classiques d'AdBlock sont limitées par la Same-Origin Policy. La meilleure solution reste l'hébergement propre des vidéos.



