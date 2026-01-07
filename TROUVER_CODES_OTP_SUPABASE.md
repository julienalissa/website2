# 🔍 Comment Trouver les Codes OTP dans Supabase

## 📍 Où Trouver les Codes

### Méthode 1 : Via l'Interface Logs & Analytics (Nouvelle Interface)

1. Dans Supabase, allez dans **Logs** (menu de gauche)
2. Vous verrez **"Logs & Analytics"**
3. Dans la section **"Collections"**, cherchez **"Auth"**
4. Cliquez sur **"Auth"**
5. Vous verrez tous les événements d'authentification
6. Cherchez les événements récents (les plus récents en haut)
7. Cliquez sur un événement pour voir les détails
8. Le code OTP sera visible dans les détails de l'événement

### Méthode 2 : Via la Table audit_log_entries (Plus Fiable)

1. Allez dans **Table Editor** (menu de gauche)
2. Cherchez la table **`audit_log_entries`**
   - Si vous ne la voyez pas, c'est que les audit logs ne sont pas encore activés
   - Activez-les dans **Authentication** > **Settings** > **Audit Logs** > Cochez "Write audit logs to the database"
3. Cliquez sur la table **`audit_log_entries`**
4. Vous verrez tous les logs d'authentification
5. Cherchez les entrées récentes avec :
   - `event_type` contenant `'otp'` ou `'token'`
   - `payload` contenant le code
6. Le code sera dans la colonne `payload` (format JSON)

### Méthode 3 : Via SQL Editor (Le Plus Direct)

1. Allez dans **SQL Editor** (menu de gauche)
2. Cliquez sur **"New query"**
3. Exécutez cette requête :

```sql
SELECT 
  id,
  created_at,
  payload->>'email' as email,
  payload->>'token' as code_otp,
  event_type
FROM audit_log_entries
WHERE event_type LIKE '%otp%' OR event_type LIKE '%token%'
ORDER BY created_at DESC
LIMIT 10;
```

4. Vous verrez les 10 derniers codes OTP envoyés
5. Le code sera dans la colonne `code_otp`

## 🎯 Méthode Recommandée : SQL Editor

C'est la méthode la plus simple et la plus fiable :

1. **SQL Editor** > **New query**
2. Copiez-collez la requête ci-dessus
3. Cliquez sur **"Run"**
4. Vous verrez tous les codes OTP récents avec les emails

## 📝 Format du Code

Le code OTP est un **code à 6 chiffres** (ex: `123456`)

## ⚠️ Important

- Les codes expirent après **1 heure**
- Chaque code ne peut être utilisé **qu'une seule fois**
- Les codes les plus récents sont en haut de la liste

## 🔄 Test Complet

1. **Activez les audit logs** : Authentication > Settings > Audit Logs > Cochez "Write audit logs to the database" > Save
2. **Allez sur votre site** : `https://vraisavore.vercel.app/admin`
3. **Entrez votre email** : `Lesavorech@gmail.com`
4. **Cliquez sur "Envoyer le code"**
5. **Attendez 2-3 secondes**
6. **Dans Supabase** : SQL Editor > Exécutez la requête ci-dessus
7. **Vous verrez le code** dans la colonne `code_otp`

---

**Astuce** : Gardez la requête SQL sauvegardée pour y accéder rapidement !
