# 🔧 Configuration Vercel - Étape 5 : Variables d'Environnement

## 📍 Où trouver l'URL du projet Supabase

Avant de commencer, vous devez récupérer l'**URL du projet Supabase** :

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous et sélectionnez votre projet
3. Allez dans **Settings** (⚙️) > **API**
4. Cherchez **"Project URL"** (c'est la première ligne, en haut)
5. Elle devrait ressembler à : `https://ineeubddwtknakqmkgli.supabase.co`
6. **📝 COPIEZ cette URL**

---

## ✅ Configuration dans Vercel

### Étape 1 : Ouvrir la section Environment Variables

1. Dans Vercel, allez sur votre projet
2. Si vous êtes sur la page de configuration initiale, trouvez la section **"Environment Variables"**
3. Si le projet est déjà créé, allez dans **Settings** > **Environment Variables**

### Étape 2 : Ajouter la Variable 1 - URL Supabase

Cliquez sur **"Add"** ou **"Add Environment Variable"** et remplissez :

```
┌─────────────────────────────────────────┐
│ Key:                                     │
│ NEXT_PUBLIC_SUPABASE_URL                 │
│                                          │
│ Value:                                   │
│ https://ineeubddwtknakqmkgli.supabase.co│
│                                          │
│ Environments:                            │
│ ☑ Production                             │
│ ☑ Preview                                 │
│ ☑ Development                             │
└─────────────────────────────────────────┘
```

Puis cliquez sur **"Add"** ou **"Save"**

### Étape 3 : Ajouter la Variable 2 - Clé Anon Supabase

Cliquez à nouveau sur **"Add"** et remplissez :

```
┌─────────────────────────────────────────┐
│ Key:                                     │
│ NEXT_PUBLIC_SUPABASE_ANON_KEY            │
│                                          │
│ Value:                                   │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.   │
│ eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlu     │
│ ZWV1YmRkd3Rua2FucW1rZ2xpIiwicm9sZSI6     │
│ ImFub24iLCJpYXQiOjE3Njc3Njg1MzYsImV4     │
│ cCI6MjA4MzM0NDUzNn0.TnE2m6qeXQFTW4pm     │
│ JjWbi8ICZ--bEtE4TAN_8SzUY6Y              │
│                                          │
│ Environments:                            │
│ ☑ Production                             │
│ ☑ Preview                                 │
│ ☑ Development                             │
└─────────────────────────────────────────┘
```

**⚠️ Important** : Collez la clé complète en une seule ligne (sans espaces ni retours à la ligne)

Puis cliquez sur **"Add"** ou **"Save"**

### Étape 4 : Ajouter la Variable 3 - Mot de passe Admin (Optionnel mais recommandé)

Cliquez à nouveau sur **"Add"** et remplissez :

```
┌─────────────────────────────────────────┐
│ Key:                                     │
│ NEXT_PUBLIC_ADMIN_PASSWORD               │
│                                          │
│ Value:                                   │
│ VotreMotDePasseSecret2025!              │
│ (Choisissez un mot de passe fort)       │
│                                          │
│ Environments:                            │
│ ☑ Production                             │
│ ☐ Preview (optionnel)                    │
│ ☐ Development                            │
│                                          │
│ ☑ Sensitive (masquer la valeur)         │
└─────────────────────────────────────────┘
```

**💡 Conseil** : Utilisez un mot de passe fort (minimum 12 caractères, avec majuscules, minuscules, chiffres et symboles)

Puis cliquez sur **"Add"** ou **"Save"**

---

## ✅ Vérification

Après avoir ajouté les 3 variables, vous devriez voir dans la liste :

```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ NEXT_PUBLIC_ADMIN_PASSWORD (si vous l'avez ajoutée)
```

---

## 🚀 Prochaine étape

Une fois les variables ajoutées :

1. Si vous êtes sur la page de configuration initiale : Cliquez sur **"Deploy"**
2. Si le projet est déjà déployé : Allez dans **Deployments** > Cliquez sur les **3 points** (⋯) du dernier déploiement > **"Redeploy"**

⏳ Attendez 2-5 minutes que le déploiement se termine.

---

## ❓ Questions fréquentes

### Q: Je ne trouve pas l'URL du projet Supabase
**R:** Allez dans Supabase > Settings > API. L'URL est la première ligne, juste en dessous du titre "Project URL"

### Q: Quelle clé utiliser entre "anon public" et "publishable key" ?
**R:** Utilisez la clé **"anon public"** (celle qui commence par `eyJ...`). La "publishable key" n'est pas utilisée dans ce projet.

### Q: Dois-je utiliser la "service role" ?
**R:** Non, ne l'utilisez pas pour le site public. Elle est réservée aux opérations administratives côté serveur.

### Q: J'ai fait une erreur dans une variable
**R:** Cliquez sur la variable dans la liste, puis sur **"Edit"** ou **"Delete"** pour la modifier ou la supprimer.

---

**📚 Suite du guide** : Continuez avec l'étape 5.2 dans `GUIDE_COMPLET_NOUVEAU_DEPLOIEMENT.md`
