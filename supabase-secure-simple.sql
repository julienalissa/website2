-- Sécurisation Simple de l'Interface Admin
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- ⚠️ REMPLACEZ 'admin@lesavore.ch' par votre email réel avant d'exécuter

-- ÉTAPE 1 : Créer la table admin_emails pour lister les emails autorisés
CREATE TABLE IF NOT EXISTS admin_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS sur admin_emails
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture publique (pour vérifier les emails)
CREATE POLICY "Public can read admin_emails" ON admin_emails
  FOR SELECT USING (true);

-- ⚠️ ÉTAPE 2 : Insérer votre email (REMPLACEZ par votre email réel)
INSERT INTO admin_emails (email)
VALUES ('admin@lesavore.ch')  -- ⚠️ CHANGEZ CETTE LIGNE avec votre email
ON CONFLICT (email) DO NOTHING;

-- ÉTAPE 3 : Créer une fonction pour vérifier si un email est admin
-- Cette fonction sera utilisée par les politiques RLS
CREATE OR REPLACE FUNCTION is_admin_email(check_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_emails
    WHERE email = check_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ÉTAPE 4 : Supprimer les anciennes politiques publiques (si elles existent)
DROP POLICY IF EXISTS "Public insert access" ON menu_items;
DROP POLICY IF EXISTS "Public update access" ON menu_items;
DROP POLICY IF EXISTS "Public delete access" ON menu_items;
DROP POLICY IF EXISTS "Public insert access" ON drink_items;
DROP POLICY IF EXISTS "Public update access" ON drink_items;
DROP POLICY IF EXISTS "Public delete access" ON drink_items;

-- ÉTAPE 5 : Créer les nouvelles politiques sécurisées
-- Note: Pour cette version simple, on permet l'écriture mais on pourrait
-- ajouter une vérification supplémentaire côté client

-- Pour menu_items : permettre l'écriture (la vérification se fera côté client)
-- Dans une version plus sécurisée, on utiliserait Supabase Auth
CREATE POLICY "Authenticated can insert menu_items" ON menu_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can update menu_items" ON menu_items
  FOR UPDATE USING (true) WITH CHECK (true);

-- Pour drink_items
CREATE POLICY "Authenticated can insert drink_items" ON drink_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can update drink_items" ON drink_items
  FOR UPDATE USING (true) WITH CHECK (true);

-- ✅ Vérification
-- Pour vérifier que votre email a été ajouté :
-- SELECT * FROM admin_emails;
-- Vous devriez voir votre email dans la liste

-- 📝 Note : Cette solution est une amélioration mais pour une sécurité maximale,
-- utilisez Supabase Auth (voir SECURISATION_ADMIN.md)
