# 🚀 Configuration Vercel pour le Rebuild Automatique

Ce guide explique comment configurer Vercel pour que le site se mette à jour automatiquement après chaque modification dans l'interface admin.

## 📋 Étapes de configuration

### 1. Créer un Deploy Hook dans Vercel

1. Connectez-vous à votre compte [Vercel](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **Git** > **Deploy Hooks**
4. Cliquez sur **"Create Hook"**
5. Donnez un nom au hook (ex: "Rebuild from Admin")
6. Sélectionnez la branche (généralement `main` ou `master`)
7. Cliquez sur **"Create Hook"**
8. **Copiez l'URL du webhook** (elle ressemble à : `https://api.vercel.com/v1/integrations/deploy/...`)

### 2. Configurer la variable d'environnement pour le rebuild

#### Option A : Dans Vercel (Recommandé pour la production)

1. Dans Vercel, allez dans **Settings** > **Environment Variables**
2. Cliquez sur le bouton **"Create new"** (ou **"Add"**)
3. Remplissez le formulaire :
   - **Key** : `NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL`
   - **Value** : L'URL du webhook que vous avez copiée à l'étape 1 (ex: `https://api.vercel.com/v1/integrations/deploy/prj_.../...`)
   - **Environments** : Cochez "Production", "Preview", et "Development"
4. Cliquez sur **"Save"**
5. ✅ Vous devriez maintenant voir cette variable dans la liste

#### Option B : Dans le fichier .env.local (Pour le développement local)

1. Créez un fichier `.env.local` à la racine du projet (s'il n'existe pas déjà)
2. Ajoutez la ligne :
   ```
   NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
   ```
3. Remplacez `...` par l'URL complète du webhook

### 3. (Optionnel) Configurer le mot de passe admin

Pour plus de sécurité, vous pouvez définir un mot de passe personnalisé :

1. Dans Vercel, sur la page **Environment Variables**, cliquez sur le bouton **"Create new"** (ou **"Add"**)
2. Remplissez le formulaire :
   - **Key** : `NEXT_PUBLIC_ADMIN_PASSWORD`
   - **Value** : Votre mot de passe sécurisé (ex: `MonMotDePasseSecret2025!`)
   - **Environments** : Cochez uniquement **"Production"** (ou Production + Preview si vous voulez tester)
   - **Sensitive** : Cochez cette case pour masquer la valeur après création (recommandé)
3. Cliquez sur **"Save"** ou **"Add"**
4. ⚠️ **Important** : Un nouveau déploiement sera nécessaire pour que le changement prenne effet

**Alternative pour le développement local** : Créez un fichier `.env.local` à la racine du projet :
```
NEXT_PUBLIC_ADMIN_PASSWORD=votre-mot-de-passe-securise
```

> ⚠️ **Sécurité** : 
> - Ne partagez jamais ces URLs ou mots de passe publiquement !
> - Utilisez un mot de passe fort (minimum 12 caractères, avec majuscules, minuscules, chiffres et symboles)
> - Changez le mot de passe régulièrement

## ✅ Vérification

1. Allez sur votre site : `https://votre-site.com/admin`
2. Connectez-vous avec le mot de passe
3. Modifiez un élément (menu, boisson ou photo)
4. Cliquez sur "Sauvegarder"
5. Vous devriez voir une notification : "Le site est en cours de mise à jour..."
6. Attendez 2-3 minutes
7. Vérifiez que les changements sont visibles sur le site

## 🔒 Sécurité

### Bonnes pratiques

1. **Ne partagez pas l'URL du webhook** publiquement
2. **Utilisez un mot de passe fort** pour l'interface admin
3. **Limitez l'accès** à l'interface admin aux personnes autorisées uniquement
4. **Surveillez les déploiements** dans Vercel pour détecter toute activité suspecte

### Améliorations de sécurité possibles

Pour une sécurité renforcée, vous pouvez :

1. **Utiliser Supabase Auth** au lieu d'un simple mot de passe
2. **Ajouter une authentification à deux facteurs**
3. **Limiter les IPs autorisées** à accéder à l'interface admin
4. **Utiliser Vercel's Access Control** pour protéger la route `/admin`

## 🐛 Dépannage

### Le rebuild ne se déclenche pas

1. Vérifiez que la variable `NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL` est bien configurée
2. Vérifiez que l'URL du webhook est correcte
3. Vérifiez les logs dans la console du navigateur (F12)
4. Vérifiez les déploiements dans Vercel pour voir s'il y a des erreurs

### Erreur "URL du webhook Vercel non configurée"

- Assurez-vous que la variable d'environnement est bien définie
- Redéployez le site après avoir ajouté la variable d'environnement
- Vérifiez que vous utilisez le bon nom de variable : `NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL`

### Le site ne se met pas à jour

- Vérifiez que le déploiement s'est bien terminé dans Vercel
- Attendez quelques minutes (le cache peut prendre du temps à se mettre à jour)
- Essayez de vider le cache du navigateur (Ctrl+F5)

## 📚 Ressources

- [Documentation Vercel Deploy Hooks](https://vercel.com/docs/concepts/git/deploy-hooks)
- [Documentation Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Note** : Cette configuration permet au client de modifier le contenu sans avoir besoin de push sur GitHub. Toutes les modifications sont stockées dans Supabase et le site est automatiquement reconstruit via Vercel.
