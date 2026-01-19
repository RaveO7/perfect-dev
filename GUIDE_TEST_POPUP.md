# Guide de Test pour la Popup PopMagic

## 📋 Prérequis

1. Le composant `PopMagicAd` doit être importé et utilisé dans `layout.tsx` ✅
2. Le serveur de développement doit être lancé (`npm run dev`)
3. Ouvrir le site dans un navigateur

## 🧪 Méthodes de Test

### 1. Vérification dans la Console du Navigateur

#### Étape 1 : Ouvrir les Outils de Développement
- Appuyez sur `F12` ou `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
- Allez dans l'onglet **Console**

#### Étape 2 : Vérifier l'Initialisation
Tapez dans la console :
```javascript
// Vérifier si popMagic est chargé
typeof popMagic !== 'undefined'
// Devrait retourner : true

// Vérifier la configuration
popMagic.config
// Devrait afficher l'objet de configuration avec idzone: 5819994
```

#### Étape 3 : Vérifier les Variables Globales
```javascript
// Vérifier window.customTargeting
window.customTargeting

// Vérifier si le script externe est chargé
document.getElementById('popmagicldr')
// Devrait retourner l'élément script ou null
```

### 2. Test des Cookies

#### Étape 1 : Vérifier le Cookie de Capping
Dans la console :
```javascript
// Vérifier le cookie de fréquence
document.cookie.includes('zone-cap-5819994')
// Devrait retourner true après le premier clic

// Voir la valeur du cookie
document.cookie.split(';').find(c => c.includes('zone-cap-5819994'))
```

#### Étape 2 : Supprimer le Cookie pour Re-tester
```javascript
// Supprimer le cookie pour tester à nouveau
document.cookie = 'zone-cap-5819994=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
// Rechargez la page
location.reload();
```

### 3. Test des Requêtes Réseau

#### Étape 1 : Ouvrir l'Onglet Network
- Dans les DevTools, allez dans l'onglet **Network** (Réseau)
- Filtrez par **XHR** ou **Fetch**

#### Étape 2 : Vérifier les Requêtes
Vous devriez voir :
1. **Requête vers venor.php** :
   - URL : `https://s.pemsrv.com/venor.php` ou `http://s.pemsrv.com/venor.php`
   - Status : 200 (succès)
   - Response : devrait être "0" ou "1"

2. **Requête vers popunder1000.js** :
   - URL : `//a.pemsrv.com/popunder1000.js`
   - Type : script

3. **Requête vers link.php** (après un clic) :
   - URL : `https://s.pemsrv.com/v1/link.php?...`
   - Contient les paramètres : `idzone=5819994`, `type=8`, etc.

### 4. Test des Événements

#### Étape 1 : Écouter les Événements Custom
Dans la console :
```javascript
// Écouter l'événement de display
document.addEventListener('creativeDisplayed-5819994', function(e) {
  console.log('Popup affichée !', e.detail);
});
```

#### Étape 2 : Tester un Clic
1. Cliquez sur n'importe quel lien de la page
2. Vérifiez dans la console si l'événement est déclenché
3. Vérifiez si une nouvelle fenêtre/onglet s'ouvre

### 5. Test du Comportement de la Popup

#### Configuration Actuelle :
- `frequency_period`: 1 (minute)
- `frequency_count`: 1 (une fois par période)
- `trigger_method`: 3 (tous les clics)
- `capping_enabled`: true

#### Scénarios de Test :

**Test 1 : Premier Clic**
1. Supprimez tous les cookies du site
2. Rechargez la page
3. Cliquez sur un lien
4. ✅ **Attendu** : La popup devrait s'ouvrir

**Test 2 : Clic Immédiat Après**
1. Cliquez immédiatement sur un autre lien
2. ✅ **Attendu** : La popup ne devrait PAS s'ouvrir (capping activé)

**Test 3 : Après 1 Minute**
1. Attendez plus de 1 minute
2. Cliquez sur un lien
3. ✅ **Attendu** : La popup devrait s'ouvrir à nouveau

**Test 4 : Test sur Mobile**
1. Ouvrez les DevTools
2. Activez le mode responsive (Ctrl+Shift+M)
3. Sélectionnez un appareil mobile
4. Testez un clic
5. ✅ **Attendu** : Comportement adapté pour mobile

### 6. Vérification du Code Source

#### Étape 1 : Vérifier le Script Injecté
Dans la console :
```javascript
// Trouver le script injecté
const scripts = document.querySelectorAll('script[type="application/javascript"]');
scripts.forEach((script, index) => {
  if (script.textContent.includes('popMagic')) {
    console.log('Script PopMagic trouvé à l\'index', index);
  }
});
```

#### Étape 2 : Vérifier les Méthodes Disponibles
```javascript
// Vérifier les méthodes de popMagic
Object.keys(popMagic.methods)
// Devrait retourner : ['default', 'chromeTab', 'popup']

// Vérifier le détecteur de navigateur
popMagic.browser
// Devrait afficher les infos du navigateur
```

### 7. Test de Debug Avancé

#### Activer le Mode Debug (si disponible)
```javascript
// Forcer l'affichage (pour test uniquement)
popMagic.open_count = 0;
popMagic.shouldShow(true);
// Devrait retourner true si les conditions sont remplies

// Vérifier venor
popMagic.venor
// Devrait être "0" ou "1"

// Vérifier venorShouldShow
popMagic.venorShouldShow()
// Devrait retourner true si venor === "0"
```

### 8. Checklist de Validation

- [ ] Le script `popMagic` est chargé dans la console
- [ ] La configuration `adConfig` est correcte (idzone: 5819994)
- [ ] Le script externe `popunder1000.js` est chargé
- [ ] La requête vers `venor.php` est effectuée
- [ ] Le cookie `zone-cap-5819994` est créé après le premier clic
- [ ] La popup s'ouvre au premier clic
- [ ] La popup ne s'ouvre pas immédiatement après (capping)
- [ ] La popup s'ouvre à nouveau après 1 minute
- [ ] L'événement `creativeDisplayed-5819994` est déclenché
- [ ] La requête vers `link.php` est effectuée après un clic

## 🐛 Dépannage

### La popup ne s'ouvre pas

1. **Vérifier la console pour les erreurs**
   ```javascript
   // Vérifier les erreurs
   console.error
   ```

2. **Vérifier le bloqueur de popup**
   - Désactivez temporairement le bloqueur de popup du navigateur
   - Chrome : Paramètres → Confidentialité → Bloquer les popups

3. **Vérifier les cookies**
   ```javascript
   // Vérifier si les cookies sont activés
   navigator.cookieEnabled
   // Devrait retourner true
   ```

4. **Vérifier le TCF (si activé)**
   ```javascript
   // Vérifier si TCF est chargé
   typeof window.__tcfapi !== 'undefined'
   ```

### La popup s'ouvre trop souvent

- Vérifiez que `capping_enabled` est à `true`
- Vérifiez que `frequency_period` est correct (actuellement 1 minute)
- Vérifiez le cookie de capping

### Erreurs dans la console

- Vérifiez que tous les scripts sont chargés
- Vérifiez la connexion internet (requêtes vers pemsrv.com)
- Vérifiez que le domaine est autorisé

## 📝 Notes Importantes

- ⚠️ **En développement** : Les popups peuvent être bloquées par le navigateur
- ⚠️ **HTTPS requis** : Certaines fonctionnalités nécessitent HTTPS en production
- ⚠️ **Cookies tiers** : Assurez-vous que les cookies tiers sont autorisés
- ⚠️ **Test en production** : Testez toujours en production pour un comportement réel

## 🔗 Ressources

- Configuration actuelle : `frequency_period: 1` (1 minute)
- ID Zone : `5819994`
- Hosts : `a.pemsrv.com` (ads), `s.pemsrv.com` (syndication)
