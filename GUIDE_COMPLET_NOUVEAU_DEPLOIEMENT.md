# 🚀 Guide Complet : Nouveau Déploiement Vercel + Supabase

Ce guide vous accompagne étape par étape pour créer un nouveau projet Vercel et un nouveau projet Supabase, puis déployer votre site avec l'interface admin.

---

## 📋 Table des matières

1. [Création du nouveau projet Supabase](#1-création-du-nouveau-projet-supabase)
2. [Configuration de la base de données](#2-configuration-de-la-base-de-données)
3. [Configuration du Storage Supabase](#3-configuration-du-storage-supabase)
4. [Création du nouveau projet Vercel](#4-création-du-nouveau-projet-vercel)
5. [Configuration des variables d'environnement](#5-configuration-des-variables-denvironnement)
6. [Configuration du Deploy Hook Vercel](#6-configuration-du-deploy-hook-vercel)
7. [Mise à jour du code local](#7-mise-à-jour-du-code-local)
8. [Déploiement et test](#8-déploiement-et-test)
9. [Configuration de l'interface admin](#9-configuration-de-linterface-admin)

---

## 1. Création du nouveau projet Supabase

### Étape 1.1 : Créer un compte/compte Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"** ou **"Sign in"** si vous avez déjà un compte
3. Connectez-vous avec GitHub, Google, ou créez un compte

### Étape 1.2 : Créer un nouveau projet

1. Une fois connecté, cliquez sur **"New Project"** (ou le bouton **"+"**)
2. Remplissez le formulaire :
   - **Name** : `le-savore` (ou le nom de votre choix)
   - **Database Password** : Créez un mot de passe fort (⚠️ **SAVEZ-LE BIEN**, vous en aurez besoin)
   - **Region** : Choisissez la région la plus proche (ex: `West EU (Paris)` pour la Suisse)
   - **Pricing Plan** : Sélectionnez **Free** (gratuit) pour commencer
3. Cliquez sur **"Create new project"**
4. ⏳ Attendez 2-3 minutes que le projet soit créé

### Étape 1.3 : Récupérer les clés API

1. Une fois le projet créé, allez dans **Settings** (⚙️) > **API**
2. Vous verrez deux informations importantes :
   - **Project URL** : `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public** key : Une longue chaîne de caractères commençant par `eyJ...`
3. **📝 COPIEZ CES DEUX INFORMATIONS** dans un fichier texte temporaire, vous en aurez besoin plus tard

---

## 2. Configuration de la base de données

### Étape 2.1 : Exécuter le schéma SQL

1. Dans Supabase, allez dans **SQL Editor** (dans le menu de gauche)
2. Cliquez sur **"New query"**
3. Ouvrez le fichier `supabase-schema.sql` de votre projet local
4. **Copiez tout le contenu** du fichier
5. **Collez-le** dans l'éditeur SQL de Supabase
6. Cliquez sur **"Run"** (ou appuyez sur `Ctrl+Enter`)
7. ✅ Vous devriez voir "Success. No rows returned"

### Étape 2.2 : Vérifier les tables

1. Allez dans **Table Editor** (dans le menu de gauche)
2. Vous devriez voir 4 tables :
   - `menu_items`
   - `drink_items`
   - `gallery_images`
   - `restaurant_info`
3. ✅ Si vous voyez ces tables, c'est bon !

---

## 3. Configuration du Storage Supabase

### Étape 3.1 : Créer un bucket pour les images

1. Dans Supabase, allez dans **Storage** (dans le menu de gauche)
2. Cliquez sur **"Create a new bucket"**
3. Remplissez :
   - **Name** : `gallery`
   - **Public bucket** : ✅ **Cochez cette case** (important pour que les images soient accessibles publiquement)
4. Cliquez sur **"Create bucket"**

### Étape 3.2 : Configurer les politiques de sécurité

1. Toujours dans **Storage**, cliquez sur le bucket `gallery`
2. Allez dans l'onglet **"Policies"**
3. Cliquez sur **"New Policy"** ou **"Add policy"**
4. Créez une politique pour la lecture publique :
   - **Policy name** : `Public read access`
   - **Allowed operation** : `SELECT`
   - **Policy definition** : Utilisez ce code :
   ```sql
   (bucket_id = 'gallery'::text)
   ```
   - **Target roles** : `anon`, `authenticated`
5. Cliquez sur **"Save policy"**

6. Créez une deuxième politique pour l'upload (authentifié uniquement) :
   - **Policy name** : `Authenticated upload access`
   - **Allowed operation** : `INSERT`
   - **Policy definition** :
   ```sql
   (bucket_id = 'gallery'::text)
   ```
   - **Target roles** : `authenticated`
7. Cliquez sur **"Save policy"**

---

## 4. Création du nouveau projet Vercel

### Étape 4.1 : Préparer votre code (si pas déjà sur GitHub)

1. Si votre code n'est pas encore sur GitHub :
   - Créez un nouveau repository sur GitHub
   - Poussez votre code local vers GitHub
2. Si votre code est déjà sur GitHub, vous pouvez continuer

### Étape 4.2 : Créer un nouveau projet Vercel

1. Allez sur [https://vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub (ou votre méthode préférée)
3. Cliquez sur **"Add New..."** > **"Project"**
4. Si vous voyez votre repository GitHub, sélectionnez-le
   - Sinon, cliquez sur **"Import Git Repository"** et connectez votre compte GitHub
5. Configurez le projet :
   - **Project Name** : `le-savore` (ou le nom de votre choix)
   - **Framework Preset** : Vercel devrait détecter automatiquement **Next.js**
   - **Root Directory** : Laissez vide (ou `./` si nécessaire)
   - **Build Command** : Laissez par défaut (`npm run build`)
   - **Output Directory** : Laissez par défaut
6. **⚠️ NE CLIQUEZ PAS ENCORE SUR "Deploy"** - On va d'abord configurer les variables d'environnement

---

## 5. Configuration des variables d'environnement

### Étape 5.1 : Ajouter les variables dans Vercel

1. Dans la page de configuration du projet Vercel, trouvez la section **"Environment Variables"**
2. Cliquez sur **"Add"** ou **"Add Environment Variable"**
3. Ajoutez les variables suivantes **UNE PAR UNE** :

   **Variable 1 :**
   - **Key** : `NEXT_PUBLIC_SUPABASE_URL`
   - **Value** : Collez le **Project URL** que vous avez copié à l'étape 1.3 (ex: `https://xxxxxxxxxxxxx.supabase.co`)
   - **Environments** : Cochez **Production**, **Preview**, et **Development**
   - Cliquez sur **"Add"**

   **Variable 2 :**
   - **Key** : `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value** : Collez la clé **anon public** que vous avez copiée à l'étape 1.3
   - **Environments** : Cochez **Production**, **Preview**, et **Development**
   - Cliquez sur **"Add"**

   **Variable 3 (optionnelle mais recommandée) :**
   - **Key** : `NEXT_PUBLIC_ADMIN_PASSWORD`
   - **Value** : Choisissez un mot de passe fort pour l'interface admin (ex: `MonMotDePasseSecret2025!`)
   - **Environments** : Cochez **Production** (et **Preview** si vous voulez tester)
   - **Sensitive** : ✅ Cochez cette case
   - Cliquez sur **"Add"**

4. ✅ Vérifiez que vous avez bien 3 variables (ou 2 si vous avez sauté la variable admin)

### Étape 5.2 : Déployer le projet

1. Maintenant, cliquez sur **"Deploy"**
2. ⏳ Attendez 2-5 minutes que le déploiement se termine
3. ✅ Une fois terminé, vous verrez l'URL de votre site (ex: `https://le-savore.vercel.app`)

---

## 6. Configuration du Deploy Hook Vercel

### Étape 6.1 : Créer le Deploy Hook

1. Dans Vercel, allez sur votre projet déployé
2. Allez dans **Settings** > **Git** > **Deploy Hooks**
3. Cliquez sur **"Create Hook"**
4. Remplissez :
   - **Name** : `Rebuild from Admin`
   - **Branch** : Sélectionnez `main` (ou `master` selon votre branche principale)
5. Cliquez sur **"Create Hook"**
6. **📝 COPIEZ L'URL du webhook** (elle ressemble à : `https://api.vercel.com/v1/integrations/deploy/...`)

### Étape 6.2 : Ajouter l'URL du webhook comme variable d'environnement

1. Toujours dans Vercel, allez dans **Settings** > **Environment Variables**
2. Cliquez sur **"Add"**
3. Remplissez :
   - **Key** : `NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL`
   - **Value** : Collez l'URL du webhook que vous venez de copier
   - **Environments** : Cochez **Production**, **Preview**, et **Development**
4. Cliquez sur **"Add"**
5. ⚠️ **Important** : Vous devez redéployer pour que cette variable soit prise en compte
   - Allez dans **Deployments**
   - Cliquez sur les **3 points** (⋯) du dernier déploiement
   - Cliquez sur **"Redeploy"**

---

## 7. Mise à jour du code local

### Étape 7.1 : Mettre à jour les fichiers de configuration

1. Ouvrez le fichier `lib/supabase.ts` dans votre éditeur
2. Remplacez les valeurs par défaut par vos nouvelles valeurs Supabase (ou laissez-les vides pour utiliser les variables d'environnement) :

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
```

3. Ouvrez le fichier `app/admin/page.tsx`
4. Si vous avez configuré `NEXT_PUBLIC_ADMIN_PASSWORD`, modifiez la ligne 23 :

```typescript
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Papaz123123";
```

### Étape 7.2 : Mettre à jour next.config.ts (si nécessaire)

1. Ouvrez `next.config.ts`
2. Si vous avez un nouveau domaine Supabase, mettez à jour la section `remotePatterns` :

```typescript
remotePatterns: [
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "plus.unsplash.com" },
  { protocol: "https", hostname: "images.pexels.com" },
  { protocol: "https", hostname: "xxxxxxxxxxxxx.supabase.co" } // Remplacez par votre nouveau domaine
]
```

### Étape 7.3 : Créer un fichier .env.local (pour le développement local)

1. À la racine de votre projet, créez un fichier `.env.local`
2. Ajoutez-y :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-ici
NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
NEXT_PUBLIC_ADMIN_PASSWORD=votre-mot-de-passe-admin
```

3. ⚠️ **Important** : Ajoutez `.env.local` à votre `.gitignore` si ce n'est pas déjà fait (pour ne pas partager vos clés)

### Étape 7.4 : Pousser les changements vers GitHub

1. Commitez vos changements :
   ```bash
   git add .
   git commit -m "Mise à jour configuration pour nouveau Supabase/Vercel"
   git push
   ```
2. Vercel devrait automatiquement redéployer votre site

---

## 8. Déploiement et test

### Étape 8.1 : Vérifier le déploiement

1. Allez sur l'URL de votre site Vercel (ex: `https://le-savore.vercel.app`)
2. Vérifiez que le site s'affiche correctement
3. Testez quelques pages (Home, Menu, Gallery, etc.)

### Étape 8.2 : Tester la connexion à Supabase

1. Allez sur `https://votre-site.vercel.app/admin`
2. Connectez-vous avec le mot de passe admin
3. Si vous voyez l'interface admin, c'est que la connexion à Supabase fonctionne ✅

### Étape 8.3 : Tester l'ajout de contenu

1. Dans l'interface admin, allez dans l'onglet **"Menu"**
2. Cliquez sur **"+ Ajouter"**
3. Remplissez un élément de test :
   - Nom : `Test Plat`
   - Description : `Description de test`
   - Prix : `25.00`
   - Catégorie : `Plats principaux`
4. Cliquez sur **"Sauvegarder"**
5. Vous devriez voir une notification : "Le site est en cours de mise à jour..."
6. ⏳ Attendez 2-3 minutes
7. Allez sur la page Menu de votre site
8. ✅ Vérifiez que votre élément apparaît

---

## 9. Configuration de l'interface admin

### Étape 9.1 : Ajouter du contenu initial

1. Connectez-vous à l'interface admin (`/admin`)
2. Ajoutez quelques éléments de menu
3. Ajoutez quelques boissons
4. Upload quelques images dans la galerie

### Étape 9.2 : Vérifier le rebuild automatique

1. Modifiez un élément existant
2. Sauvegardez
3. Vérifiez dans Vercel > **Deployments** qu'un nouveau déploiement a été déclenché
4. ⏳ Attendez 2-3 minutes
5. ✅ Vérifiez que les changements sont visibles sur le site

---

## ✅ Checklist finale

Avant de considérer que tout est terminé, vérifiez :

- [ ] Le site est accessible sur Vercel
- [ ] L'interface admin est accessible (`/admin`)
- [ ] La connexion à Supabase fonctionne (vous pouvez voir/ajouter du contenu)
- [ ] Les images peuvent être uploadées dans la galerie
- [ ] Le rebuild automatique fonctionne (un nouveau déploiement se déclenche après chaque modification)
- [ ] Les changements apparaissent sur le site après le rebuild

---

## 🐛 Dépannage

### Le site ne se connecte pas à Supabase

1. Vérifiez que les variables d'environnement sont bien configurées dans Vercel
2. Vérifiez que vous avez bien exécuté le schéma SQL dans Supabase
3. Vérifiez les logs dans Vercel > **Deployments** > Cliquez sur le dernier déploiement > **Functions** > Regardez les logs

### L'upload d'images ne fonctionne pas

1. Vérifiez que le bucket `gallery` existe dans Supabase Storage
2. Vérifiez que le bucket est public
3. Vérifiez les politiques de sécurité du bucket

### Le rebuild ne se déclenche pas

1. Vérifiez que `NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL` est bien configurée
2. Vérifiez que vous avez bien redéployé après avoir ajouté cette variable
3. Ouvrez la console du navigateur (F12) et regardez s'il y a des erreurs

### Erreur "Row Level Security" dans Supabase

1. Allez dans Supabase > **Authentication** > **Policies**
2. Vérifiez que les politiques "Public read access" existent pour toutes les tables
3. Si nécessaire, réexécutez la partie RLS du schéma SQL

---

## 📚 Ressources utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)

---

## 🎉 Félicitations !

Votre site est maintenant déployé avec :
- ✅ Un nouveau projet Supabase
- ✅ Un nouveau projet Vercel
- ✅ Une interface admin fonctionnelle
- ✅ Un système de rebuild automatique

Vous pouvez maintenant gérer votre contenu depuis l'interface admin sans toucher au code !

---

**Besoin d'aide ?** N'hésitez pas à consulter les logs dans Vercel ou Supabase pour identifier les problèmes.
