# 🛡️ Guide : Utilisation de l'attribut Sandbox sur l'Iframe

## ✅ Ce qui a été fait

L'attribut `sandbox` a été ajouté à l'iframe pour restreindre certaines fonctionnalités :

```tsx
<iframe 
  sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
  ...
/>
```

---

## 🔒 Permissions accordées

### `allow-scripts`
- ✅ **Nécessaire** : Permet au lecteur vidéo d'exécuter du JavaScript
- Sans cela, le lecteur ne fonctionnera pas

### `allow-same-origin`
- ✅ **Nécessaire** : Permet à l'iframe d'accéder à son propre contenu
- Important pour que le lecteur fonctionne correctement

### `allow-presentation`
- ✅ **Utile** : Permet le plein écran (fullscreen)
- Compatible avec `allowFullScreen`

### `allow-forms`
- ⚠️ **Optionnel** : Permet les formulaires dans l'iframe
- Peut être retiré si pas nécessaire

---

## 🚫 Permissions BLOQUÉES (par défaut)

Quand vous utilisez `sandbox`, ces fonctionnalités sont **automatiquement bloquées** :

### `allow-popups` ❌ BLOQUÉ
- **Bloque les pop-ups** et nouvelles fenêtres
- **Cela peut réduire certaines publicités pop-up !**

### `allow-popups-to-escape-sandbox` ❌ BLOQUÉ
- Empêche les pop-ups d'échapper au sandbox
- **Bloque les pop-ups publicitaires**

### `allow-top-navigation` ❌ BLOQUÉ
- Empêche l'iframe de rediriger la page principale
- **Protège contre les redirects publicitaires**

### `allow-modals` ❌ BLOQUÉ
- Empêche les alertes/confirm/prompt
- **Bloque les modales publicitaires**

### `allow-downloads` ❌ BLOQUÉ
- Empêche les téléchargements automatiques
- **Protège contre les téléchargements malveillants**

---

## ⚠️ Limitation importante : CSS/JavaScript

### ❌ Vous NE POUVEZ PAS masquer les pubs avec CSS/JS

**Pourquoi ?** Same-Origin Policy (Politique de même origine)

- Votre site : `perfect-dev.vercel.app` ou `localhost:3000`
- Iframe externe : `dood.pm` ou `streamtape.com`
- ❌ **Domaine différent = accès interdit**

### Ce qui ne fonctionne PAS :

```css
/* ❌ Ne fonctionne PAS */
iframe#monIframe div.ad {
  display: none !important;
}
```

```javascript
// ❌ Ne fonctionne PAS
const iframe = document.getElementById('monIframe');
const iframeDoc = iframe.contentDocument; // ❌ Erreur : accès refusé
iframeDoc.querySelector('.ad').style.display = 'none'; // ❌ Impossible
```

---

## 💡 Solutions alternatives

### Option 1 : Overlay CSS (masquer des zones spécifiques)

Vous pouvez créer un overlay par-dessus l'iframe pour masquer certaines zones :

```css
/* Masquer une zone spécifique de l'iframe */
.iframe-container {
  position: relative;
}

.iframe-container::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100px;
  background: #000;
  pointer-events: none; /* Permet de cliquer à travers */
  z-index: 10;
}
```

**⚠️ Limitation** : Cela masque une zone fixe, pas les pubs dynamiques.

### Option 2 : Restreindre davantage le sandbox

Si vous voulez bloquer plus de fonctionnalités, vous pouvez retirer `allow-forms` :

```tsx
sandbox="allow-scripts allow-same-origin allow-presentation"
```

**⚠️ Attention** : Cela peut casser certaines fonctionnalités du lecteur.

### Option 3 : Utiliser un proxy (complexe)

Créer une route API Next.js qui :
1. Charge le contenu de l'iframe
2. Filtre les scripts de pub
3. Renvoie le HTML nettoyé

**⚠️ Très complexe** et peut violer les ToS des services.

---

## 🧪 Tester l'efficacité

### 1. Vérifier que le lecteur fonctionne toujours
- ✅ La vidéo doit se charger normalement
- ✅ Le plein écran doit fonctionner
- ✅ Les contrôles doivent être actifs

### 2. Vérifier la réduction des pubs
- Ouvrez les DevTools (F12)
- Allez dans l'onglet Console
- Regardez si des erreurs de pop-up apparaissent (c'est bon signe, ça veut dire qu'elles sont bloquées)

### 3. Tester les pop-ups
- Essayez de déclencher une pop-up (si possible)
- Elle devrait être bloquée par le sandbox

---

## 📊 Ce que le sandbox peut bloquer

### ✅ Peut bloquer :
- Pop-ups publicitaires
- Redirects vers des sites de pub
- Modales publicitaires
- Téléchargements automatiques

### ❌ Ne peut PAS bloquer :
- Publicités intégrées dans le HTML de l'iframe
- Bannières publicitaires dans le lecteur
- Publicités vidéo pré-roll/mid-roll
- Requêtes réseau faites depuis l'iframe

---

## 🔧 Ajustements possibles

### Si le lecteur ne fonctionne plus :

Retirez certaines restrictions :

```tsx
sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-popups"
```

### Si vous voulez bloquer plus :

Ajoutez des restrictions (mais testez bien) :

```tsx
// Version très restrictive (peut casser le lecteur)
sandbox="allow-scripts allow-same-origin"
```

---

## 📝 Résumé

1. ✅ **Sandbox ajouté** : Bloque les pop-ups et redirects
2. ✅ **Service Worker actif** : Bloque les domaines de pub identifiés
3. ❌ **CSS/JS ne peut pas** : Modifier le contenu de l'iframe externe
4. ⚠️ **Limitation** : Les pubs intégrées dans le HTML ne peuvent pas être bloquées

---

## 🎯 Prochaines étapes

1. **Testez** que le lecteur fonctionne toujours
2. **Observez** si les pop-ups sont réduites
3. **Identifiez** d'autres domaines de pub dans les DevTools
4. **Ajoutez-les** au Service Worker si nécessaire



