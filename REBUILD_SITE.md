# 🔄 Rebuild du Site Internet pour Mettre à Jour l'Hébergeur

## ⚠️ Important

Le site en production (dossier `out` sur l'hébergeur) doit être mis à jour avec les modifications qui envoient les réservations à Supabase.

## 📋 Étapes pour Mettre à Jour le Site

### 1. Rebuild le Site Statique

Dans le dossier `aa`, exécutez :

```bash
cd C:\Users\motde\Desktop\aa
npm run build
```

Cela va :
- Rebuild le site avec toutes les modifications
- Générer un nouveau dossier `out/` avec le code mis à jour
- Inclure le code qui envoie les réservations à Supabase

### 2. Vérifier le Dossier `out/`

Après le build, vérifiez que le dossier `out/` contient :
- Les fichiers HTML mis à jour
- Le JavaScript avec le code Supabase
- Le fichier `lib/supabase.ts` compilé

### 3. Uploader sur l'Hébergeur

1. **Supprimez l'ancien dossier `out/`** sur l'hébergeur
2. **Uploadez le nouveau dossier `out/`** depuis votre ordinateur
3. **Vérifiez** que tous les fichiers sont bien uploadés

### 4. Tester

1. Allez sur votre site internet en production
2. Faites une réservation
3. Ouvrez la console du navigateur (F12)
4. Vérifiez les logs :
   - Vous devriez voir : `"Envoi de la réservation à Supabase: {...}"`
   - Puis : `"Réservation créée avec succès: [...]"`
5. Dans la caisse, vérifiez que la réservation apparaît

## ✅ Vérification

Après l'upload :
- ✅ Les réservations sont envoyées à Supabase
- ✅ Les réservations apparaissent dans la caisse
- ✅ Les événements sont envoyés comme demandes spéciales



