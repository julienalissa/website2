# 🎯 Guide CMS Complet - Modifier TOUT le Site

## ✨ Interface Admin Complète

Votre interface admin permet maintenant de modifier **TOUT** le contenu du site :

### 📋 Pages Disponibles

1. **Accueil** - Modifier tous les textes de la page d'accueil
2. **Notre Histoire** - Modifier l'histoire, la philosophie, etc.
3. **Contact** - Modifier les informations de contact, horaires
4. **Événements** - Modifier tous les textes des événements
5. **Menu** - Gérer le menu (déjà fonctionnel)
6. **Boissons** - Gérer les boissons (déjà fonctionnel)
7. **Galerie** - Gérer toutes les images
8. **Restaurant** - Modifier les informations générales

---

## 🚀 Installation

### Étape 1 : Créer les Tables CMS dans Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous et sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Ouvrez le fichier `supabase-cms-schema.sql` dans votre projet
5. **Copiez tout le contenu**
6. **Collez-le dans SQL Editor**
7. **Exécutez le script**

Ce script va créer :
- ✅ Table `page_content` pour stocker le contenu de chaque page
- ✅ Table `content_blocks` pour les blocs modulaires
- ✅ Table `gallery_images` pour la galerie
- ✅ Table `restaurant_info_editable` pour les infos du restaurant
- ✅ Toutes les politiques RLS nécessaires

### Étape 2 : Vérifier que tout fonctionne

1. Allez sur `https://vraisavore.vercel.app/admin`
2. Connectez-vous avec votre email et code OTP
3. Vous devriez voir **8 onglets** en haut :
   - Accueil
   - Notre Histoire
   - Contact
   - Événements
   - Menu
   - Boissons
   - Galerie
   - Restaurant

---

## 📝 Comment Utiliser

### Modifier la Page d'Accueil

1. Cliquez sur l'onglet **"Accueil"**
2. Modifiez les textes :
   - Titre principal
   - Slogan
   - Description
   - Textes des sections
3. Cliquez sur **"Sauvegarder les modifications"**
4. Le site se met à jour automatiquement !

### Modifier la Page "Notre Histoire"

1. Cliquez sur l'onglet **"Notre Histoire"**
2. Modifiez :
   - Titre de la page
   - Section "Héritage" (3 paragraphes)
   - Section "Philosophie" (4 descriptions)
3. Utilisez l'éditeur WYSIWYG pour formater le texte
4. Cliquez sur **"Sauvegarder"**

### Modifier la Page Contact

1. Cliquez sur l'onglet **"Contact"**
2. Modifiez :
   - Titre de la page
   - Informations de contact (adresse, téléphone, email)
   - Horaires d'ouverture (7 jours)
   - Textes des sections
3. Cliquez sur **"Sauvegarder"**

### Modifier la Page Événements

1. Cliquez sur l'onglet **"Événements"**
2. Modifiez :
   - Titre et sous-titre
   - Types d'événements (4 types)
   - Services (4 services)
3. Utilisez l'éditeur WYSIWYG pour les descriptions
4. Cliquez sur **"Sauvegarder"**

### Gérer la Galerie

1. Cliquez sur l'onglet **"Galerie"**
2. Cliquez sur **"Ajouter une Image"**
3. Entrez l'URL de l'image ou uploadez une image
4. Ajoutez un texte alternatif
5. Cliquez sur **"Sauvegarder"**

### Modifier les Informations du Restaurant

1. Cliquez sur l'onglet **"Restaurant"**
2. Modifiez :
   - Nom du restaurant
   - Slogan
   - Description
   - Adresse, téléphone, email
   - Horaires d'ouverture
3. Cliquez sur **"Sauvegarder"**

---

## 🎨 Fonctionnalités

### Éditeur WYSIWYG
- ✅ Formatage du texte (gras, italique, souligné)
- ✅ Listes à puces et numérotées
- ✅ Alignement du texte
- ✅ Interface intuitive

### Gestion des Images
- ✅ Upload d'images
- ✅ Aperçu en temps réel
- ✅ Gestion de la galerie

### Modification en Temps Réel
- ✅ Toutes les modifications sont visibles immédiatement
- ✅ Rebuild automatique du site
- ✅ Pas besoin de push sur GitHub

---

## ✅ Avantages

1. **Simple** : Interface intuitive, pas besoin de connaissances techniques
2. **Complet** : Tout peut être modifié (textes, images, horaires, etc.)
3. **Rapide** : Modifications en temps réel
4. **Professionnel** : Design moderne et cohérent
5. **Gratuit** : Pas de coût mensuel

---

## 🎯 Prochaines Étapes

1. **Exécutez le script SQL** `supabase-cms-schema.sql` dans Supabase
2. **Testez l'interface** sur `https://vraisavore.vercel.app/admin`
3. **Montrez à votre boss** toutes les fonctionnalités
4. **Convainquez-le** que c'est mieux que Webador !

**Votre boss sera impressionné !** 🎉
