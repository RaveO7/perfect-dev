# 🎥 Guide du Lecteur Vidéo - Comment fonctionne-t-il et comment enlever les pubs ?

## 📋 Comment fonctionne le lecteur actuel ?

### Architecture du lecteur

Le lecteur vidéo utilise un **iframe** qui charge des vidéos depuis des services d'hébergement externes :

```tsx
<iframe 
  src={videos[player]}  // URL du service d'hébergement
  allowFullScreen 
  allow="autoplay"
/>
```

### Services d'hébergement utilisés

D'après votre base de données, les vidéos sont hébergées sur :

1. **dood.pm** : `https://dood.pm/e/xxxxx` (format embed)
2. **streamtape.com** : `https://streamtape.com/e/xxxxx` (format embed)

### Fonctionnement détaillé

1. **Récupération des URLs** : Le code récupère `videoUrl` depuis la base de données
2. **Traitement des URLs** : La fonction `modifierLiens()` convertit les URLs streamtape de `/v/` vers `/e/` (embed)
3. **Affichage** : Un iframe charge l'URL du service externe
4. **Sélection de source** : Si plusieurs sources existent, un menu déroulant permet de choisir

**Code actuel** (lignes 174-179 de `src/app/videos/[id]/page.tsx`) :
```tsx
<iframe 
  id="monIframe" 
  className='w-full h-full'
  title={'Video ' + title}
  allowFullScreen 
  allow="autoplay" 
  scrolling="no" 
  frameBorder="0"
  src={videos[player]}  // ← URL du service externe
/>
```

---

## 🎯 D'où viennent les publicités ?

### ⚠️ Les publicités viennent des services externes

Les publicités **ne viennent PAS de votre code**, mais des services d'hébergement vidéo eux-mêmes :

- **dood.pm** : Affiche des publicités dans son lecteur embed
- **streamtape.com** : Affiche des publicités dans son lecteur embed

Ces services gagnent de l'argent en affichant des pubs sur leurs lecteurs. C'est leur modèle économique.

### Publicités dans votre code (déjà désactivées)

Il y a un composant `ModalPub.tsx` dans votre code, mais il est **déjà commenté/désactivé** dans `src/app/layout.tsx` :

```tsx
{/* <ModalPub /> */}  // ← Déjà commenté, donc pas de pub de votre côté
```

---

## 🛠️ Solutions pour enlever les publicités

### Option 1 : Utiliser un service sans publicités (Recommandé)

**Services d'hébergement vidéo sans pubs :**
- **Vimeo** (avec compte payant)
- **YouTube** (mais restrictions de contenu)
- **Votre propre serveur** (hébergement direct)

**Avantages :**
- Pas de publicités
- Contrôle total
- Meilleure qualité

**Inconvénients :**
- Coût (hébergement + bande passante)
- Plus complexe à mettre en place

### Option 2 : Filtrer les services avec pubs

Modifier le code pour ne garder que les services sans pubs :

```tsx
function modifierLiens(liens: Array<string>) {
  // Filtrer pour enlever les services avec pubs
  return liens.filter(lien => {
    // Exemple : ne garder que les liens directs (sans service externe)
    return !lien.includes('dood.pm') && !lien.includes('streamtape.com');
  });
}
```

**Problème :** Si toutes vos vidéos sont sur ces services, elles ne s'afficheront plus.

### Option 3 : Utiliser un lecteur vidéo direct (si vous avez les URLs directes)

Si vous avez accès aux URLs directes des fichiers vidéo (`.mp4`, `.webm`, etc.), vous pouvez utiliser un lecteur HTML5 :

```tsx
<video 
  controls 
  className='w-full h-full'
  src={videos[player]}
>
  Votre navigateur ne supporte pas la lecture vidéo.
</video>
```

**Avantages :**
- Pas de publicités
- Contrôle total du lecteur
- Meilleure performance

**Inconvénients :**
- Nécessite des URLs directes (pas d'embed)
- Coût d'hébergement vidéo

### Option 4 : Accepter les pubs (mais les minimiser)

Si vous devez garder les services actuels, vous pouvez :
- Choisir le service avec le moins de pubs
- Ajouter un message informatif pour les utilisateurs
- Utiliser un bloqueur de pubs côté client (mais ça ne fonctionne pas toujours avec les iframes)

---

## 🔍 Vérification : D'où viennent exactement les pubs ?

### Test rapide

1. Ouvrez une vidéo sur votre site
2. Ouvrez les outils de développement (F12)
3. Allez dans l'onglet **Network** (Réseau)
4. Rechargez la page
5. Regardez les requêtes vers `dood.pm` ou `streamtape.com`

Vous verrez que ces services chargent leurs propres scripts de publicité.

### Vérification dans le code

Le code actuel ne contient **aucune publicité** :
- `ModalPub.tsx` est commenté
- Aucun script de pub dans le code
- Les pubs viennent uniquement des iframes externes

---

## 💡 Recommandation

**Pour enlever complètement les pubs, vous avez 2 options principales :**

### Solution A : Héberger vos propres vidéos

1. **Héberger les vidéos sur votre serveur** ou un CDN
2. **Modifier le code** pour utiliser un lecteur HTML5 direct
3. **Avantage** : Contrôle total, pas de pubs
4. **Inconvénient** : Coût d'hébergement et bande passante

### Solution B : Changer de service d'hébergement

1. **Trouver un service sans pubs** (ou avec moins de pubs)
2. **Migrer les URLs** dans votre base de données
3. **Avantage** : Pas de changement de code majeur
4. **Inconvénient** : Peut être coûteux ou difficile à trouver

---

## 📝 Code actuel du lecteur

**Fichier** : `src/app/videos/[id]/page.tsx`

**Lignes clés** :
- **92** : Récupération des URLs vidéo depuis la base
- **104-117** : Fonction `modifierLiens()` qui convertit les URLs
- **174-179** : Iframe qui affiche la vidéo

**Fonction `modifierLiens()`** :
```tsx
function modifierLiens(liens: Array<string>) {
  for (let i = 0; i < liens.length; i++) {
    // Convertit streamtape /v/ en /e/ (embed)
    if (liens[i].startsWith("https://streamtape")) {
      liens[i] = liens[i].replace("/v/", "/e/");
    }
  }
  return liens;
}
```

---

## ❓ Questions fréquentes

**Q : Pourquoi les pubs apparaissent-elles ?**
R : Les services dood.pm et streamtape.com affichent des pubs dans leurs lecteurs embed. C'est leur modèle économique.

**Q : Puis-je bloquer les pubs avec du code ?**
R : Non, car les pubs sont chargées depuis les serveurs externes dans l'iframe. Vous ne pouvez pas contrôler le contenu d'une iframe externe pour des raisons de sécurité.

**Q : Y a-t-il des pubs dans mon code ?**
R : Non, le composant `ModalPub` est déjà commenté et désactivé.

**Q : Comment savoir quel service a le moins de pubs ?**
R : Testez manuellement les différents services et comparez. Généralement, les services gratuits ont plus de pubs que les payants.

---

**💡 Pour enlever les pubs, il faudra soit héberger vos propres vidéos, soit trouver un service d'hébergement sans publicités.**



