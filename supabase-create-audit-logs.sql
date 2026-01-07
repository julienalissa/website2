-- Créer la table audit_log_entries pour les logs d'authentification
-- Exécutez ce script si la table n'existe pas

-- Créer la table audit_log_entries
CREATE TABLE IF NOT EXISTS audit_log_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  event_type TEXT
);

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_audit_log_entries_event_type ON audit_log_entries(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_entries_created_at ON audit_log_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_entries_payload_email ON audit_log_entries((payload->>'email'));

-- Permettre la lecture publique (pour voir les logs)
ALTER TABLE audit_log_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read audit_log_entries" ON audit_log_entries
  FOR SELECT USING (true);

-- ✅ Vérification
-- Après avoir exécuté ce script, vous pouvez utiliser la requête suivante pour voir les codes OTP :
-- 
-- SELECT 
--   created_at,
--   payload->>'email' as email,
--   payload->>'token' as code_otp,
--   event_type
-- FROM audit_log_entries
-- WHERE event_type LIKE '%otp%' OR event_type LIKE '%token%'
-- ORDER BY created_at DESC
-- LIMIT 10;
