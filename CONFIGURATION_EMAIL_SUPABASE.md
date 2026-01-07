# 📧 Configuration des Emails dans Supabase

Pour que la vérification par code fonctionne, vous devez configurer l'envoi d'emails dans Supabase.

## ⚠️ Important

Par défaut, Supabase utilise un service d'email de test qui affiche les codes dans les logs. Pour la production, vous devez configurer un service d'email réel.

## 🚀 Configuration Rapide (Pour tester)

### Option 1 : Voir les codes dans les logs Supabase (Développement)

1. Allez dans Supabase > **Authentication** > **Templates**
2. Les emails de test sont automatiquement activés
3. Allez dans **Logs** > **Auth Logs** pour voir les codes envoyés
4. ⚠️ **Limitation** : Les codes expirent rapidement (environ 1 heure)

### Option 2 : Configurer un service d'email réel (Production)

#### A. Utiliser SendGrid (Recommandé - Gratuit jusqu'à 100 emails/jour)

1. Créez un compte sur [SendGrid](https://sendgrid.com)
2. Créez une API Key dans SendGrid
3. Dans Supabase, allez dans **Settings** > **Auth** > **SMTP Settings**
4. Configurez :
   - **SMTP Host** : `smtp.sendgrid.net`
   - **SMTP Port** : `587`
   - **SMTP User** : `apikey`
   - **SMTP Password** : Votre API Key SendGrid
   - **Sender Email** : Votre email vérifié dans SendGrid
   - **Sender Name** : `Le Savoré`
5. Cliquez sur **"Save"**

#### B. Utiliser Gmail (Simple mais limité)

1. Dans Supabase, allez dans **Settings** > **Auth** > **SMTP Settings**
2. Configurez :
   - **SMTP Host** : `smtp.gmail.com`
   - **SMTP Port** : `587`
   - **SMTP User** : Votre email Gmail
   - **SMTP Password** : Un "Mot de passe d'application" Gmail (pas votre mot de passe normal)
   - **Sender Email** : Votre email Gmail
   - **Sender Name** : `Le Savoré`
3. ⚠️ **Important** : Vous devez créer un "Mot de passe d'application" dans votre compte Google
4. Cliquez sur **"Save"**

## 📝 Créer un Mot de passe d'application Gmail

1. Allez sur [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Activez la "Validation en deux étapes" si ce n'est pas déjà fait
3. Allez dans **Mots de passe des applications**
4. Créez un nouveau mot de passe d'application
5. Copiez le mot de passe généré (16 caractères)
6. Utilisez-le dans Supabase SMTP Settings

## ✅ Vérification

Une fois configuré :

1. Allez sur `https://vraisavore.vercel.app/admin`
2. Entrez votre email
3. Cliquez sur "Envoyer le code"
4. Vérifiez votre boîte email (et les spams si nécessaire)
5. Entrez le code reçu

## 🔧 Personnaliser le template d'email

1. Dans Supabase, allez dans **Authentication** > **Templates**
2. Sélectionnez **"Magic Link"** ou **"OTP"**
3. Personnalisez le sujet et le contenu de l'email
4. Cliquez sur **"Save"**

## 🐛 Dépannage

### Le code n'arrive pas

1. Vérifiez les **Logs** > **Auth Logs** dans Supabase pour voir les erreurs
2. Vérifiez votre dossier spam
3. Vérifiez que l'email est correct
4. Vérifiez que l'utilisateur existe dans Supabase > Authentication > Users

### Erreur "Email rate limit exceeded"

- Vous avez envoyé trop de codes rapidement
- Attendez quelques minutes avant de réessayer

### Erreur "Invalid email"

- Vérifiez que l'email existe dans Supabase > Authentication > Users
- L'email doit être exactement celui créé dans Supabase

---

**Note** : Pour le développement/test, vous pouvez voir les codes dans les logs Supabase sans configurer SMTP.
