# 🔍 Guide : Inspecter les Requêtes de l'Iframe

## ✅ Oui, vous pouvez voir les requêtes de l'iframe !

Les DevTools du navigateur vous permettent d'inspecter **toutes** les requêtes, y compris celles faites par les iframes externes.

---

## 📋 Comment inspecter les requêtes de l'iframe

### Méthode 1 : Onglet Network (Recommandé)

1. **Ouvrez votre site** avec une vidéo
2. **Ouvrez les DevTools** (F12)
3. **Allez dans l'onglet "Network"** (Réseau)
4. **Rechargez la page** (F5)
5. **Filtrez par domaine** :
   - Dans la barre de recherche du Network, tapez : `dood.pm` ou `streamtape.com`
   - Vous verrez toutes les requêtes faites par l'iframe

### Méthode 2 : Inspecter l'iframe directement

1. **Ouvrez les DevTools** (F12)
2. **Allez dans l'onglet "Elements"** (Éléments)
3. **Trouvez l'iframe** dans le HTML :
   ```html
   <iframe id="monIframe" src="https://dood.pm/e/xxxxx"></iframe>
   ```
4. **Clic droit sur l'iframe** > **"Inspecter dans le cadre"** ou **"Frame"** > **"Ouvrir dans une nouvelle fenêtre"**
5. **Une nouvelle fenêtre DevTools s'ouvre** pour l'iframe
6. **Allez dans l'onglet "Network"** de cette nouvelle fenêtre
7. **Vous verrez toutes les requêtes** faites par l'iframe, y compris les pubs !

---

## 🎯 Ce que vous pouvez voir

### Types de requêtes que vous verrez :

1. **Requêtes de vidéo** :
   - URLs des fichiers vidéo (`.mp4`, `.m3u8`, etc.)
   - Requêtes de segments vidéo

2. **Requêtes de publicité** :
   - Scripts de pub (`ads.js`, `advertising.js`, etc.)
   - Images de bannières
   - Requêtes vers des réseaux publicitaires
   - URLs de tracking

3. **Requêtes de tracking** :
   - Analytics
   - Cookies de tracking
   - Beacons

### Exemples de domaines de pub que vous pourriez voir :

- `doubleclick.net`
- `googleadservices.com`
- `googlesyndication.com`
- `advertising.com`
- `adsafeprotected.com`
- `adnxs.com`
- `criteo.com`
- Et bien d'autres...

---

## 💡 Utiliser ces informations

### Option 1 : Créer un proxy qui filtre

Si vous identifiez les domaines de pub, vous pourriez créer une route API Next.js qui :
1. Charge le contenu de l'iframe
2. Filtre les scripts/requêtes de pub
3. Renvoie le HTML nettoyé

**⚠️ Limitation** : Très complexe et peut violer les ToS des services.

### Option 2 : Bloquer au niveau du navigateur

Vous pouvez utiliser les informations pour :
1. Créer une extension de navigateur
2. Utiliser uBlock Origin avec des règles personnalisées
3. Modifier le fichier hosts pour bloquer les domaines

**⚠️ Limitation** : Cela ne fonctionne que pour l'utilisateur qui installe l'extension/modifie son système.

### Option 3 : Analyser pour comprendre

Même si vous ne pouvez pas bloquer, vous pouvez :
- Comprendre d'où viennent les pubs
- Identifier les services les moins intrusifs
- Documenter pour référence future

---

## 🔧 Exemple pratique : Capturer les requêtes

### Dans la console DevTools :

```javascript
// Intercepter toutes les requêtes (pour analyse uniquement)
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🌐 Requête:', args[0]);
  return originalFetch.apply(this, args);
};

// Pour les requêtes XMLHttpRequest
const originalXHR = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function(method, url) {
  console.log('🌐 XHR:', url);
  return originalXHR.apply(this, arguments);
};
```

**⚠️ Note** : Cela ne fonctionne que pour les requêtes de votre page, pas celles de l'iframe.

---

## 📊 Analyser les requêtes de pub

### Ce qu'il faut chercher :

1. **Domaines récurrents** : Notez les domaines qui apparaissent souvent
2. **Patterns d'URLs** : Cherchez des patterns comme `/ads/`, `/advertising/`, `/track/`
3. **Headers** : Regardez les headers des requêtes pour identifier les réseaux publicitaires
4. **Timing** : Les pubs se chargent souvent après la vidéo

### Exemple de ce que vous pourriez trouver :

```
https://dood.pm/e/xxxxx          ← URL de l'iframe
https://dood.pm/player.js        ← Script du lecteur
https://doubleclick.net/ads/...  ← PUB BLOQUÉE
https://googlesyndication.com/... ← PUB BLOQUÉE
https://dood.pm/video.mp4        ← Vidéo réelle
```

---

## ⚠️ Limitations importantes

### Ce que vous POUVEZ faire :
- ✅ Voir toutes les requêtes dans les DevTools
- ✅ Identifier les domaines de pub
- ✅ Analyser le timing et le comportement

### Ce que vous NE POUVEZ PAS faire facilement :
- ❌ Bloquer les requêtes depuis votre code JavaScript (Same-Origin Policy)
- ❌ Modifier le contenu de l'iframe (sécurité du navigateur)
- ❌ Intercepter les requêtes faites par l'iframe (elles sont dans un contexte séparé)

---

## 🎯 Prochaines étapes

1. **Inspectez les requêtes** avec les méthodes ci-dessus
2. **Listez les domaines de pub** que vous trouvez
3. **Partagez-les** et on pourra voir s'il y a des solutions créatives

---

## 💡 Astuce : Filtrer dans Network

Dans l'onglet Network des DevTools :
- Tapez `-img` pour exclure les images
- Tapez `js` pour voir seulement les scripts
- Tapez `xhr` ou `fetch` pour voir les requêtes AJAX
- Utilisez le filtre par domaine : `domain:dood.pm`

Cela vous aidera à identifier rapidement les requêtes de pub !



