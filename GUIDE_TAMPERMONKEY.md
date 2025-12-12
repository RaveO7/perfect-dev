# 🎯 Guide : Utilisation de Tampermonkey/Greasemonkey pour Bloquer les Pubs

## ✅ Oui, ça peut fonctionner, MAIS avec des limitations importantes

---

## 🔍 Comment ça fonctionne

### Tampermonkey/Greasemonkey
- Ce sont des **extensions de navigateur**
- Elles permettent d'exécuter des scripts JavaScript sur les pages web
- Les scripts s'exécutent **dans le contexte de la page**

---

## ⚠️ Limitations importantes

### 1. **Same-Origin Policy toujours active**

**Problème :** Si votre script s'exécute sur `perfect-dev.vercel.app`, il **ne peut toujours pas** accéder au contenu de l'iframe `dood.pm` ou `streamtape.com`.

**Solution :** Le script doit s'exécuter **directement sur dood.pm ou streamtape.com**.

### 2. **Deux scripts nécessaires**

Vous devez créer **deux scripts séparés** :

1. **Script pour votre site** (`perfect-dev.vercel.app`)
   - Peut bloquer les requêtes réseau de votre page
   - Ne peut PAS modifier l'iframe externe

2. **Script pour dood.pm/streamtape.com**
   - S'exécute directement sur le site du lecteur
   - Peut masquer les pubs dans le lecteur
   - **C'est celui-ci qui est utile !**

---

## 💡 Solution : Script pour dood.pm/streamtape.com

### Avantages
- ✅ S'exécute directement sur le site du lecteur
- ✅ Peut accéder au DOM du lecteur
- ✅ Peut masquer les éléments de pub avec CSS/JS
- ✅ Peut bloquer les requêtes réseau

### Inconvénients
- ❌ Nécessite que **chaque utilisateur installe l'extension**
- ❌ Nécessite que **chaque utilisateur installe le script**
- ❌ Pas une solution pour votre site web
- ❌ Les utilisateurs doivent le faire manuellement

---

## 📋 Comment créer le script

### Étape 1 : Installer Tampermonkey

1. **Chrome/Edge** : [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
2. **Firefox** : [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) ou Greasemonkey

### Étape 2 : Créer un nouveau script

1. Cliquez sur l'icône Tampermonkey
2. Cliquez sur "Créer un nouveau script"
3. Copiez le code du fichier `TAMPERMONKEY_SCRIPT_EXEMPLE.js`

### Étape 3 : Configurer les URLs

Dans le header du script, modifiez `@match` pour cibler les sites :

```javascript
// @match        https://dood.pm/*
// @match        https://streamtape.com/*
// @match        https://doodstream.com/*
```

---

## 🎯 Ce que le script peut faire

### ✅ Peut faire :
- Masquer les éléments de pub avec `display: none`
- Bloquer les requêtes réseau vers les domaines de pub
- Observer les nouveaux éléments ajoutés dynamiquement
- Intercepter `fetch()` et `XMLHttpRequest`

### ❌ Ne peut pas faire :
- Modifier le contenu d'une iframe depuis votre site
- Garantir que tous les utilisateurs l'installent
- Fonctionner sans extension installée

---

## 🔧 Script optimisé pour dood.pm/streamtape.com

Le fichier `TAMPERMONKEY_SCRIPT_EXEMPLE.js` contient un script qui :

1. **Bloque les requêtes réseau** vers les domaines de pub
2. **Masque les éléments** avec des sélecteurs CSS
3. **Observe les mutations** pour les pubs chargées dynamiquement
4. **S'exécute automatiquement** sur les sites configurés

---

## 📊 Comparaison des solutions

| Solution | Installation | Efficacité | Maintenabilité |
|----------|-------------|------------|----------------|
| **Service Worker** | Automatique | ⭐⭐⭐ Moyenne | ⭐⭐⭐ Facile |
| **Tampermonkey** | Manuelle (utilisateur) | ⭐⭐⭐⭐⭐ Excellente | ⭐⭐ Moyenne |
| **Sandbox** | Automatique | ❌ Ne fonctionne pas | ⭐⭐⭐ Facile |

---

## 💡 Recommandation

### Pour votre site web :
- ✅ **Service Worker** (déjà en place) - Bloque les requêtes réseau
- ✅ **Continuer à identifier** les domaines de pub et les ajouter

### Pour les utilisateurs avancés :
- ✅ **Proposer un script Tampermonkey** qu'ils peuvent installer
- ✅ **Documenter** comment l'installer
- ✅ **Maintenir** le script si les sites changent

---

## 🚀 Prochaines étapes

1. **Tester le script Tampermonkey** sur dood.pm directement
2. **Identifier les sélecteurs CSS** spécifiques aux pubs
3. **Créer un guide** pour vos utilisateurs
4. **Maintenir le script** si les sites changent

---

## ⚠️ Avertissement

- Les sites peuvent **détecter** les scripts utilisateur
- Les sites peuvent **changer** leur structure (nécessite maintenance)
- Certains sites peuvent **bloquer** les utilisateurs avec des scripts

---

## 📝 Conclusion

**Tampermonkey fonctionne**, mais :
- ✅ C'est une solution **pour les utilisateurs**, pas pour votre site
- ✅ Nécessite que **chaque utilisateur installe** l'extension et le script
- ✅ **Meilleure efficacité** que le Service Worker pour masquer les pubs visuelles
- ⚠️ **Pas automatique** - les utilisateurs doivent le faire manuellement

**Recommandation :** Gardez le Service Worker pour bloquer les requêtes réseau, et proposez un script Tampermonkey optionnel pour les utilisateurs qui veulent une protection maximale.



