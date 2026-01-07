# 🔍 Trouver les Codes OTP - Méthode Alternative

## ⚠️ Problème

La table `audit_log_entries` n'existe pas encore. Cela signifie que les audit logs ne sont pas activés ou que la table n'a pas été créée.

## ✅ Solution : Activer les Audit Logs Correctement

### Étape 1 : Vérifier l'Activation

1. Allez dans **Authentication** > **Settings**
2. Trouvez la section **"Audit Logs"**
3. Vérifiez que **"Write audit logs to the database"** est bien **coché**
4. Si ce n'est pas le cas, cochez-le et cliquez sur **"Save changes"**
5. ⏳ Attendez quelques secondes que la table soit créée

### Étape 2 : Vérifier que la Table Existe

1. Allez dans **Table Editor**
2. Cherchez la table **`audit_log_entries`** dans la liste
3. Si elle n'apparaît pas :
   - Attendez 1-2 minutes
   - Rafraîchissez la page
   - Vérifiez que vous avez bien sauvegardé les changements

### Étape 3 : Si la Table N'Existe Toujours Pas

Exécutez ce script SQL pour créer la table manuellement :

```sql
-- Créer la table audit_log_entries si elle n'existe pas
CREATE TABLE IF NOT EXISTS audit_log_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  event_type TEXT
);

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_audit_log_entries_event_type ON audit_log_entries(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_entries_created_at ON audit_log_entries(created_at DESC);
```

## 🔄 Méthode Alternative : Voir les Codes dans les Templates

Si les audit logs ne fonctionnent pas, vous pouvez voir les codes dans les templates :

1. Allez dans **Authentication** > **Templates**
2. Cliquez sur **"OTP"** ou **"Magic Link"**
3. Les codes peuvent apparaître dans les logs de test

## 🎯 Méthode la Plus Simple : Utiliser l'API Directement

Vous pouvez aussi voir les codes en vérifiant les réponses de l'API. Mais la meilleure méthode reste les audit logs.

---

**Essayez d'abord d'activer les audit logs et d'attendre 1-2 minutes, puis réessayez la requête SQL.**
