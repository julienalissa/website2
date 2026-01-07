# 🔒 Sécurisation Simple de l'Interface Admin

Cette solution améliore la sécurité sans changer complètement le système d'authentification actuel.

## ✅ Ce que cette solution fait

1. ✅ Crée une table `admin_emails` pour lister les emails autorisés
2. ✅ Vérifie que l'utilisateur est dans la liste avant d'autoriser l'écriture
3. ✅ Garde le système de mot de passe actuel (simple à utiliser)
4. ✅ Ajoute une couche de sécurité supplémentaire

## 🚀 Installation (5 minutes)

### Étape 1 : Exécuter le script SQL dans Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous et sélectionnez votre projet
3. Allez dans **SQL Editor** > **New query**
4. Ouvrez le fichier `supabase-secure-simple.sql` dans votre projet
5. **⚠️ IMPORTANT** : Remplacez `'admin@lesavore.ch'` par votre email réel
6. Copiez tout le contenu et collez-le dans l'éditeur SQL
7. Cliquez sur **"Run"**
8. ✅ Vous devriez voir "Success"

### Étape 2 : Ajouter votre email dans la liste

Après avoir exécuté le script, ajoutez votre email :

1. Allez dans **Table Editor** > **admin_emails**
2. Cliquez sur **"Insert row"**
3. Ajoutez votre email dans le champ `email`
4. Cliquez sur **"Save"**

### Étape 3 : Tester

1. Allez sur votre site : `https://vraisavore.vercel.app/admin`
2. Connectez-vous avec le mot de passe
3. Essayez d'ajouter un élément du menu
4. ✅ Cela devrait fonctionner !

## 🔐 Comment ça fonctionne

- La table `admin_emails` contient la liste des emails autorisés
- Avant chaque écriture, Supabase vérifie si l'email est dans la liste
- Seuls les emails autorisés peuvent modifier le contenu
- Le mot de passe reste nécessaire pour accéder à l'interface

## 📝 Ajouter d'autres admins

Pour ajouter un autre admin :

1. Allez dans Supabase > **Table Editor** > **admin_emails**
2. Cliquez sur **"Insert row"**
3. Ajoutez l'email de la nouvelle personne
4. Cette personne pourra maintenant utiliser l'interface admin

## ⚠️ Limitations

- Cette solution est plus simple mais moins sécurisée que Supabase Auth
- Le mot de passe est toujours stocké dans le code (mais protégé par variable d'environnement)
- Pour une sécurité maximale, utilisez l'Option 1 avec Supabase Auth (voir `SECURISATION_ADMIN.md`)

## 🔄 Passer à Supabase Auth plus tard

Si vous voulez améliorer la sécurité plus tard, vous pouvez suivre le guide `SECURISATION_ADMIN.md` pour migrer vers Supabase Auth.
