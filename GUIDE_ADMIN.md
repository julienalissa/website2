# 📘 Guide d'Administration - Le Savoré

## 🎯 Vue d'ensemble

Ce guide explique comment utiliser l'interface d'administration pour modifier le contenu du site web sans avoir besoin de connaissances en programmation.

## 🔐 Accès à l'interface d'administration

1. Allez sur votre site web : `https://votre-site.com/admin`
2. Entrez le mot de passe administrateur
3. Vous serez redirigé vers le tableau de bord

> ⚠️ **Important** : Gardez votre mot de passe secret et ne le partagez qu'avec les personnes autorisées.

## 📝 Modifier le Menu

### Ajouter un élément au menu

1. Cliquez sur l'onglet **"Menu"**
2. Cliquez sur le bouton **"+ Ajouter"**
3. Remplissez le formulaire :
   - **Nom** : Le nom du plat (ex: "Risotto Riviera")
   - **Description** : La description du plat
   - **Prix** : Le prix en CHF (ex: 22.50)
   - **Catégorie** : La catégorie (ex: "Entrées", "Plats", "Desserts")
4. Cliquez sur **"Sauvegarder"**
5. Le site sera automatiquement mis à jour dans 2-3 minutes

### Modifier un élément existant

1. Trouvez l'élément dans la liste
2. Cliquez sur **"Modifier"**
3. Modifiez les informations souhaitées
4. Cliquez sur **"Sauvegarder"**

### Supprimer un élément

1. Trouvez l'élément dans la liste
2. Cliquez sur **"Supprimer"**
3. Confirmez la suppression

## 🍷 Modifier les Boissons

Le processus est identique à celui du menu :

1. Cliquez sur l'onglet **"Boissons"**
2. Utilisez les boutons **"+ Ajouter"**, **"Modifier"** ou **"Supprimer"**
3. Pour la catégorie, choisissez parmi :
   - Cocktail
   - Vin
   - Bière
   - Sans alcool

## 📸 Modifier la Galerie Photos

### Ajouter une photo

1. Cliquez sur l'onglet **"Galerie"**
2. Cliquez sur **"+ Ajouter"**
3. Vous avez deux options :
   - **Option 1** : Uploader une image directement
     - Cliquez sur "Ou uploader une image"
     - Sélectionnez votre fichier image
     - L'image sera automatiquement uploadée
   - **Option 2** : Utiliser une URL
     - Entrez l'URL de l'image dans le champ "URL de l'image"
4. Ajoutez une description (alt text) pour l'accessibilité
5. Cliquez sur **"Sauvegarder"**

### Modifier ou supprimer une photo

- Utilisez les boutons **"Modifier"** ou **"Supprimer"** comme pour le menu

## 🔄 Mise à jour automatique du site

Après chaque modification (ajout, modification ou suppression), le site est automatiquement mis à jour. Vous verrez une notification confirmant que la mise à jour est en cours.

### Mise à jour manuelle

Si vous souhaitez forcer une mise à jour manuelle :

1. Cliquez sur le bouton **"Mettre à jour le site"** en haut à droite
2. Attendez 2-3 minutes pour que les changements soient visibles

## ⚙️ Configuration technique (pour le développeur)

### Variables d'environnement requises

Pour que le système de rebuild automatique fonctionne, vous devez configurer :

1. **Vercel Deploy Hook** :
   - Allez dans Vercel > Votre projet > Settings > Git > Deploy Hooks
   - Créez un nouveau Deploy Hook
   - Copiez l'URL du webhook
   - Ajoutez-la dans `.env.local` :
     ```
     NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
     ```

2. **Mot de passe admin** (optionnel, pour plus de sécurité) :
   ```
   NEXT_PUBLIC_ADMIN_PASSWORD=votre-mot-de-passe-securise
   ```

### Sécurité

- Le mot de passe est stocké côté client (dans le navigateur)
- Pour une sécurité renforcée, considérez l'utilisation de Supabase Auth
- Le webhook Vercel est protégé par l'URL secrète générée par Vercel

## 🆘 Problèmes courants

### Les modifications ne s'affichent pas

1. Vérifiez que vous avez bien cliqué sur "Sauvegarder"
2. Attendez 2-3 minutes (le rebuild prend du temps)
3. Rafraîchissez la page du site (Ctrl+F5 ou Cmd+Shift+R)
4. Si le problème persiste, cliquez sur "Mettre à jour le site" manuellement

### Erreur lors de l'upload d'image

- Vérifiez que l'image n'est pas trop grande (max 5MB recommandé)
- Vérifiez le format de l'image (JPG, PNG, WEBP sont supportés)
- Si vous utilisez une URL, vérifiez qu'elle est accessible publiquement

### Impossible de se connecter

- Vérifiez que vous utilisez le bon mot de passe
- Essayez de vider le cache du navigateur
- Contactez le développeur si le problème persiste

## 📞 Support

Pour toute question ou problème, contactez le développeur du site.

---

**Dernière mise à jour** : Janvier 2025
