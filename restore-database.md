# 🔄 Guide pour Restaurer la Base de Données

## Problème : Trop de connexions MySQL

Le serveur Next.js garde beaucoup de connexions MySQL ouvertes, ce qui empêche de se connecter directement.

## Solution 1 : Via phpMyAdmin (Recommandé)

1. **Ouvrez phpMyAdmin** : `http://localhost/phpmyadmin`
2. **Sélectionnez la base** `perfect_bdd` dans le menu de gauche
3. **Cliquez sur "Importer"** dans le menu du haut
4. **Choisissez le fichier** `perfect_bdd.sql`
5. **Cliquez sur "Exécuter"**

## Solution 2 : Arrêter le serveur Next.js puis réimporter

1. **Arrêtez le serveur Next.js** (Ctrl+C dans le terminal)
2. **Attendez 10 secondes** pour que les connexions se ferment
3. **Exécutez cette commande** :
   ```powershell
   D:\xampp\mysql\bin\mysql.exe -u root perfect_bdd < perfect_bdd.sql
   ```

## Solution 3 : Via le script PowerShell

1. **Arrêtez le serveur Next.js**
2. **Exécutez** : `.\import-database.ps1`

## Vérification

Après l'import, vérifiez avec :
```sql
SELECT COUNT(*) FROM Videos;
```

Vous devriez voir environ **38879 vidéos**.

