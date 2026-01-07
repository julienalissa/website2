# 🔑 Variables d'Environnement Requises

Ce fichier liste toutes les variables d'environnement nécessaires pour faire fonctionner le site.

## 📋 Variables Obligatoires

### 1. `NEXT_PUBLIC_SUPABASE_URL`
- **Description** : L'URL de votre projet Supabase
- **Où la trouver** : Supabase > Settings > API > Project URL
- **Format** : `https://xxxxxxxxxxxxx.supabase.co`
- **Exemple** : `https://abcdefghijklmnop.supabase.co`

### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Description** : La clé publique anonyme de votre projet Supabase
- **Où la trouver** : Supabase > Settings > API > anon public key
- **Format** : Longue chaîne commençant par `eyJ...`
- **Exemple** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📋 Variables Optionnelles (mais recommandées)

### 3. `NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL`
- **Description** : URL du webhook Vercel pour déclencher les rebuilds automatiques
- **Où la trouver** : Vercel > Settings > Git > Deploy Hooks > Créer un hook > Copier l'URL
- **Format** : `https://api.vercel.com/v1/integrations/deploy/...`
- **Exemple** : `https://api.vercel.com/v1/integrations/deploy/prj_abc123/hook_xyz789`

### 4. `NEXT_PUBLIC_ADMIN_PASSWORD`
- **Description** : Mot de passe pour accéder à l'interface admin (`/admin`)
- **Par défaut** : `Papaz123123` (si non défini)
- **Recommandation** : Utilisez un mot de passe fort (minimum 12 caractères)
- **Exemple** : `MonMotDePasseSecret2025!`

## 🔧 Configuration

### Pour le développement local

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-ici
NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
NEXT_PUBLIC_ADMIN_PASSWORD=votre-mot-de-passe-securise
```

⚠️ **Important** : Le fichier `.env.local` est déjà dans `.gitignore` et ne sera pas commité sur GitHub.

### Pour Vercel (Production)

1. Allez dans Vercel > Votre projet > **Settings** > **Environment Variables**
2. Ajoutez chaque variable une par une
3. Cochez les environnements appropriés (Production, Preview, Development)
4. Redéployez le projet pour que les changements prennent effet

## ✅ Vérification

Pour vérifier que vos variables sont bien configurées :

1. **En local** : Vérifiez que le fichier `.env.local` existe et contient toutes les variables
2. **Sur Vercel** : Allez dans Settings > Environment Variables et vérifiez la liste
3. **Dans le code** : Les variables commençant par `NEXT_PUBLIC_` sont accessibles via `process.env.NEXT_PUBLIC_...`

## 🐛 Dépannage

### "Variables Supabase non configurées"
- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont bien définies
- Redémarrez le serveur de développement après avoir créé/modifié `.env.local`

### Le rebuild ne fonctionne pas
- Vérifiez que `NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL` est bien configurée
- Vérifiez que vous avez redéployé après avoir ajouté cette variable

### Erreur d'authentification admin
- Vérifiez que `NEXT_PUBLIC_ADMIN_PASSWORD` est bien configurée (ou utilisez le mot de passe par défaut)
- Videz le cache du navigateur et réessayez

---

📚 **Voir aussi** : `GUIDE_COMPLET_NOUVEAU_DEPLOIEMENT.md` pour un guide étape par étape complet.
