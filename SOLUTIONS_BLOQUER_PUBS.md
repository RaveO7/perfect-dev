# 🚫 Solutions pour Bloquer les Publicités des Services Externes

## ⚠️ Limitation Technique Importante

**Problème fondamental :** Les publicités viennent des iframes externes (dood.pm, streamtape.com). Pour des raisons de sécurité (Same-Origin Policy), vous **ne pouvez pas** accéder ou modifier le contenu d'une iframe externe depuis votre JavaScript.

---

## 🔍 Pourquoi c'est difficile ?

### Same-Origin Policy (Politique de même origine)

Les navigateurs empêchent le JavaScript d'accéder au contenu d'une iframe si elle vient d'un domaine différent. C'est une mesure de sécurité.

**Exemple :**
- Votre site : `perfect-dev.vercel.app`
- Iframe externe : `dood.pm`
- ❌ Vous ne pouvez pas accéder au DOM de `dood.pm` depuis votre code

---

## 💡 Solutions Possibles (avec limitations)

### Solution 1 : Service Proxy pour Filtrer le Contenu ⚠️ Complexe

**Principe :** Créer un proxy qui charge le contenu de l'iframe, filtre les pubs, puis le renvoie.

**Avantages :**
- Contrôle total sur le contenu
- Peut filtrer les pubs

**Inconvénients :**
- Très complexe à mettre en place
- Nécessite un serveur proxy
- Peut violer les ToS des services
- Performance dégradée
- Coût d'hébergement

**Code exemple (conceptuel) :**
```tsx
// ❌ Ceci ne fonctionne PAS directement
// Mais vous pourriez créer une route API qui fait le proxy

// pages/api/proxy-video.ts
export default async function handler(req, res) {
  const videoUrl = req.query.url;
  // Charger le contenu depuis dood.pm
  // Filtrer les scripts de pub
  // Renvoyer le HTML nettoyé
}
```

---

### Solution 2 : Blocage au Niveau du Réseau (Côté Client) ⚠️ Limité

**Principe :** Utiliser Service Workers pour intercepter et bloquer les requêtes de publicité.

**Avantages :**
- Fonctionne côté client
- Peut bloquer certaines requêtes

**Inconvénients :**
- Ne fonctionne que pour les requêtes réseau, pas le contenu déjà dans l'iframe
- Les pubs peuvent être chargées depuis le même domaine que la vidéo
- Complexe à maintenir
- Peut casser le lecteur vidéo

**Code exemple :**
```javascript
// public/sw.js (Service Worker)
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Bloquer les domaines de pub connus
  if (url.includes('ads.') || url.includes('advertising.')) {
    event.respondWith(new Response('', { status: 204 }));
    return;
  }
  
  event.respondWith(fetch(event.request));
});
```

**Limitation :** Cela ne bloquera que les requêtes externes, pas les pubs déjà intégrées dans le HTML de l'iframe.

---

### Solution 3 : Utiliser un Lecteur Vidéo Direct (Si vous avez les URLs directes) ✅ Meilleure option

**Principe :** Si vous pouvez obtenir les URLs directes des fichiers vidéo (`.mp4`), utiliser un lecteur HTML5 au lieu d'iframe.

**Avantages :**
- Pas de publicités
- Contrôle total
- Meilleure performance

**Inconvénients :**
- Nécessite des URLs directes (pas toujours disponibles)
- Les services peuvent protéger leurs URLs

**Code exemple :**
```tsx
// Remplacer l'iframe par un lecteur vidéo HTML5
<video 
  controls 
  className='w-full h-full'
  src={videoDirectUrl}  // URL directe du fichier .mp4
  preload="metadata"
>
  Votre navigateur ne supporte pas la lecture vidéo.
</video>
```

---

### Solution 4 : Filtrer les Services avec Moins de Pubs ⚠️ Partiel

**Principe :** Tester différents services et ne garder que ceux avec le moins de pubs.

**Avantages :**
- Simple à mettre en place
- Réduit les pubs (mais ne les élimine pas)

**Inconvénients :**
- Ne supprime pas complètement les pubs
- Peut limiter les sources disponibles

**Code exemple :**
```tsx
function modifierLiens(liens: Array<string>) {
  // Prioriser les services avec moins de pubs
  const preferredServices = ['service-sans-pub.com'];
  
  // Trier pour mettre les services préférés en premier
  return liens.sort((a, b) => {
    const aPreferred = preferredServices.some(s => a.includes(s));
    const bPreferred = preferredServices.some(s => b.includes(s));
    return bPreferred ? 1 : -1;
  });
}
```

---

### Solution 5 : Utiliser une Extension de Navigateur (Côté Utilisateur) ℹ️

**Principe :** Recommander aux utilisateurs d'installer un bloqueur de pubs (uBlock Origin, AdBlock Plus).

**Avantages :**
- Fonctionne bien
- Pas de code à maintenir

**Inconvénients :**
- Dépend de l'utilisateur
- Pas de contrôle de votre côté
- Peut casser certains lecteurs

---

## 🎯 Recommandation : Solution Hybride

### Option A : Chercher les URLs Directes

1. **Analyser les URLs** des services pour extraire les URLs directes
2. **Utiliser un lecteur HTML5** au lieu d'iframe
3. **Avantage** : Pas de pubs, contrôle total

**Exemple de code pour extraire l'URL directe :**
```tsx
// Fonction pour obtenir l'URL directe depuis dood.pm
async function getDirectVideoUrl(embedUrl: string) {
  // Faire une requête pour obtenir l'URL directe
  // (nécessite de reverse-engineer l'API du service)
  const response = await fetch(`/api/get-direct-url?url=${embedUrl}`);
  return response.json().directUrl;
}
```

### Option B : Service Proxy Simple

Créer une route API Next.js qui :
1. Charge le contenu de l'iframe
2. Filtre les scripts de pub
3. Renvoie le HTML nettoyé

**⚠️ Attention :** Cela peut violer les ToS des services et être légalement problématique.

---

## 🔧 Implémentation : Blocage Basique des Requêtes Pub

Voici un exemple de Service Worker qui bloque certaines requêtes :

```javascript
// public/sw.js
const AD_DOMAINS = [
  'doubleclick.net',
  'googleadservices.com',
  'googlesyndication.com',
  'advertising.com',
  // Ajoutez d'autres domaines de pub
];

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Bloquer les domaines de pub
  if (AD_DOMAINS.some(domain => url.hostname.includes(domain))) {
    event.respondWith(new Response('', { status: 204 }));
    return;
  }
  
  // Laisser passer les autres requêtes
  event.respondWith(fetch(event.request));
});
```

**Enregistrer le Service Worker :**
```tsx
// Dans votre layout.tsx ou _app.tsx
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}, []);
```

---

## ⚠️ Limitations et Avertissements

1. **Same-Origin Policy** : Vous ne pouvez pas modifier le contenu d'une iframe externe
2. **ToS des Services** : Bloquer les pubs peut violer les conditions d'utilisation
3. **Maintenance** : Les services changent souvent, nécessite une maintenance constante
4. **Performance** : Les solutions de proxy peuvent ralentir le chargement

---

## 💡 Solution la Plus Réaliste

**Pour vraiment enlever les pubs sans complications :**

1. **Héberger vos propres vidéos** sur un CDN (Cloudflare, AWS S3, etc.)
2. **Utiliser un lecteur HTML5** direct
3. **Avantage** : Contrôle total, pas de pubs, meilleure qualité
4. **Inconvénient** : Coût d'hébergement

**Alternative :** Trouver un service d'hébergement vidéo qui offre un plan sans pubs (généralement payant).

---

## 📝 Conclusion

**Réponse courte :** Non, vous ne pouvez pas facilement bloquer les pubs des iframes externes pour des raisons de sécurité du navigateur.

**Options réalistes :**
1. ✅ Accepter les pubs (solution actuelle)
2. ✅ Héberger vos propres vidéos (solution idéale mais coûteuse)
3. ⚠️ Utiliser un proxy (complexe et peut violer les ToS)
4. ⚠️ Service Worker (limité, ne bloque que certaines requêtes)

**La meilleure solution à long terme est d'héberger vos propres vidéos.**



