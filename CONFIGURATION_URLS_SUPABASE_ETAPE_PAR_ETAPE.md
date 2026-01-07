# 🔧 Configuration des URLs dans Supabase - Guide Étape par Étape

## ⚠️ Problème Actuel

Vous recevez un Magic Link qui pointe vers `localhost` au lieu de votre site de production.

## ✅ Solution : Configurer les URLs dans Supabase

### Étape 1 : Aller dans les Paramètres d'Authentification

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous et sélectionnez votre projet
3. Dans le menu de gauche, cliquez sur **"Authentication"**
4. Cliquez sur **"URL Configuration"** (ou allez dans **"Settings"** puis **"URL Configuration"**)

### Étape 2 : Configurer la Site URL

1. Trouvez le champ **"Site URL"**
2. Remplacez `http://localhost:3000` par :
   ```
   https://vraisavore.vercel.app
   ```
3. ⚠️ **Important** : Utilisez `https://` et non `http://`

### Étape 3 : Configurer les Redirect URLs

1. Trouvez la section **"Redirect URLs"** (ou **"Redirect URLs (Allowlist)"**)
2. Vous verrez probablement déjà `http://localhost:3000/**`
3. **Ajoutez** ces URLs (une par ligne, cliquez sur **"Add URL"** pour chaque) :
   ```
   https://vraisavore.vercel.app/admin
   https://vraisavore.vercel.app/**
   ```
4. ⚠️ **Important** : 
   - Ajoutez `/**` à la fin pour autoriser toutes les sous-pages
   - Gardez aussi `http://localhost:3000/**` pour le développement local
5. Cliquez sur **"Save"** ou **"Update"**

### Étape 4 : Vérifier la Configuration

Votre configuration finale devrait ressembler à :

**Site URL:**
```
https://vraisavore.vercel.app
```

**Redirect URLs:**
```
http://localhost:3000/**
https://vraisavore.vercel.app/admin
https://vraisavore.vercel.app/**
```

## 🔄 Note sur le Magic Link vs OTP

Le code que j'ai mis à jour utilise `signInWithOtp` qui devrait envoyer un code, mais Supabase peut aussi envoyer un Magic Link selon la configuration. 

**Pour forcer l'envoi d'un code uniquement** (sans Magic Link), le code est déjà configuré correctement. Si vous recevez encore un Magic Link, c'est que Supabase utilise le template par défaut.

## ✅ Après Configuration

1. Testez à nouveau :
   - Allez sur `https://vraisavore.vercel.app/admin`
   - Entrez votre email
   - Cliquez sur "Envoyer le code"
2. Vous devriez recevoir un **code à 6 chiffres** dans les logs Supabase (voir `TROUVER_CODES_OTP_ALTERNATIVE.md`)
3. Si vous recevez encore un Magic Link, le lien devrait maintenant pointer vers `https://vraisavore.vercel.app/admin` au lieu de `localhost`

---

**Important** : Après avoir configuré les URLs, attendez 1-2 minutes puis testez à nouveau !
