# 🔧 Correction : Erreur "Couldn't find any `pages` or `app` directory"

## 🐛 Problème

Vercel ne trouve pas le répertoire `app` lors du build. Cela signifie généralement que le **Root Directory** n'est pas correctement configuré dans Vercel.

## ✅ Solution : Configurer le Root Directory dans Vercel

### Étape 1 : Vérifier la configuration dans Vercel

1. Allez sur votre projet dans [Vercel](https://vercel.com)
2. Allez dans **Settings** (⚙️)
3. Allez dans la section **General**
4. Cherchez **"Root Directory"**

### Étape 2 : Configurer le Root Directory

**Option A : Si le Root Directory est vide ou incorrect**

1. Cliquez sur **"Edit"** à côté de "Root Directory"
2. **Laissez le champ VIDE** (ou mettez `./` si nécessaire)
3. Cliquez sur **"Save"**

**Option B : Si le Root Directory pointe vers un sous-dossier**

1. Cliquez sur **"Edit"**
2. **Effacez complètement** le contenu du champ
3. Laissez-le **vide**
4. Cliquez sur **"Save"**

### Étape 3 : Redéployer

1. Allez dans l'onglet **Deployments**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Cliquez sur **"Redeploy"**
4. ⏳ Attendez que le build se termine

## 🔍 Vérification

Le build devrait maintenant trouver le répertoire `app` et réussir. Vous devriez voir dans les logs :

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
```

## 📝 Note

Le répertoire `app` doit être à la **racine** de votre repository GitHub. Si votre structure est :

```
website2/
  ├── app/
  ├── components/
  ├── lib/
  ├── package.json
  └── next.config.ts
```

Alors le Root Directory doit être **vide** (ou `./`).

Si votre structure était :

```
website2/
  └── mon-site/
      ├── app/
      ├── package.json
      └── next.config.ts
```

Alors le Root Directory devrait être `mon-site`.

Mais dans votre cas, tout est à la racine, donc le Root Directory doit être **vide**.

---

**Besoin d'aide ?** Si le problème persiste, vérifiez que tous les fichiers sont bien commités et poussés sur GitHub.
