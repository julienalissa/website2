# 🔧 Configurer les URLs dans Supabase

## ⚠️ Problème

Les liens d'authentification pointent vers `localhost` au lieu de votre site de production.

## ✅ Solution : Configurer les URLs dans Supabase

### Étape 1 : Configurer la Site URL

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous et sélectionnez votre projet
3. Allez dans **Authentication** (menu de gauche)
4. Cliquez sur **"URL Configuration"** ou **"Settings"** > **"URL Configuration"**
5. Trouvez la section **"Site URL"**
6. Remplacez `http://localhost:3000` par votre URL de production :
   - **Site URL** : `https://vraisavore.vercel.app`
7. Cliquez sur **"Save"**

### Étape 2 : Configurer les Redirect URLs

1. Toujours dans **Authentication** > **URL Configuration**
2. Trouvez la section **"Redirect URLs"**
3. Ajoutez ces URLs (une par ligne) :
   ```
   https://vraisavore.vercel.app/admin
   https://vraisavore.vercel.app/**
   http://localhost:3000/admin
   http://localhost:3000/**
   ```
4. ⚠️ **Important** : Ajoutez `/**` à la fin pour autoriser toutes les sous-pages
5. Cliquez sur **"Save"**

### Étape 3 : Vérifier la Configuration

Votre configuration devrait ressembler à :

```
Site URL: https://vraisavore.vercel.app

Redirect URLs:
- https://vraisavore.vercel.app/admin
- https://vraisavore.vercel.app/**
- http://localhost:3000/admin
- http://localhost:3000/**
```

## 🔄 Alternative : Utiliser uniquement le Code OTP (Sans Magic Link)

Si vous préférez utiliser uniquement le code OTP sans Magic Link, le code est déjà configuré pour cela. Mais il faut aussi configurer les URLs ci-dessus pour que tout fonctionne correctement.

## ✅ Après Configuration

1. Les emails contiendront des liens qui pointent vers votre site de production
2. Les codes OTP fonctionneront correctement
3. Vous pourrez vous connecter depuis n'importe où

---

**Important** : Après avoir configuré les URLs, testez à nouveau la connexion !
