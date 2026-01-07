# 📧 Comment Voir les Codes OTP dans Supabase

## 🎯 Objectif

Voir les codes de vérification envoyés par email directement dans Supabase (utile pour le développement et les tests).

## ✅ Étapes à Suivre

### Étape 1 : Activer les Audit Logs

1. Dans Supabase, allez dans **Authentication** > **Settings**
2. Trouvez la section **"Audit Logs"**
3. **Cochez** la case **"Write audit logs to the database"**
4. Cliquez sur **"Save changes"**
5. ✅ Les logs seront maintenant enregistrés dans la base de données

### Étape 2 : Voir les Codes OTP

Il y a **deux endroits** où vous pouvez voir les codes :

#### Option A : Dans les Auth Logs (Recommandé)

1. Allez dans **Logs** (dans le menu de gauche)
2. Cliquez sur **"Auth Logs"**
3. Vous verrez tous les événements d'authentification
4. Cherchez les événements de type **"OTP sent"** ou **"OTP verification"**
5. Le code sera visible dans les détails de l'événement

#### Option B : Dans la Table audit_log_entries (Avancé)

1. Allez dans **Table Editor**
2. Cherchez la table **`audit_log_entries`** (elle apparaîtra après avoir activé les audit logs)
3. Cliquez dessus
4. Vous verrez tous les logs d'authentification
5. Cherchez les entrées avec `event_type` = `'otp'` ou similaire
6. Le code sera dans les détails JSON

### Étape 3 : Tester

1. Allez sur `https://vraisavore.vercel.app/admin`
2. Entrez votre email : `Lesavorech@gmail.com`
3. Cliquez sur "Envoyer le code"
4. **Immédiatement après**, allez dans **Logs** > **Auth Logs**
5. Vous devriez voir un nouvel événement avec le code OTP

## 📝 Format du Code

Le code OTP est un **code à 6 chiffres** (ex: `123456`)

## ⚠️ Important

- Les codes expirent après **1 heure** environ
- Chaque code ne peut être utilisé **qu'une seule fois**
- Si vous ne voyez pas le code, vérifiez que les audit logs sont bien activés

## 🔍 Exemple de ce que vous verrez

Dans les Auth Logs, vous verrez quelque chose comme :
```
Event: OTP sent
Email: Lesavorech@gmail.com
Token: 123456
Timestamp: 2026-01-06 12:34:56
```

## 🐛 Si vous ne voyez pas les codes

1. Vérifiez que **"Write audit logs to the database"** est bien coché
2. Attendez quelques secondes après avoir envoyé le code
3. Rafraîchissez la page des logs
4. Vérifiez que vous cherchez dans **Auth Logs** et non dans d'autres types de logs

---

**Note** : Pour la production, configurez un service SMTP réel pour recevoir les codes par email (voir `CONFIGURATION_EMAIL_SUPABASE.md`).
