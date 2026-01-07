-- Politiques RLS sécurisées pour l'interface admin
-- Exécutez ce script dans l'éditeur SQL de Supabase APRÈS avoir créé un utilisateur admin

-- ÉTAPE 1 : Créer la table admin_users (si elle n'existe pas déjà)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer votre email admin (remplacez par votre email)
-- Vous pouvez ajouter plusieurs admins en répétant cette ligne
INSERT INTO admin_users (email)
VALUES ('Lesavorech@gmail.com')  -- ⚠️ REMPLACEZ par votre email admin
ON CONFLICT (email) DO NOTHING;

-- Activer RLS sur admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Politique pour que les admins puissent lire la liste des admins
CREATE POLICY "Admins can read admin_users" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- ÉTAPE 2 : Créer une fonction pour vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = auth.jwt() ->> 'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ÉTAPE 3 : Supprimer les anciennes politiques publiques (si elles existent)
DROP POLICY IF EXISTS "Public insert access" ON menu_items;
DROP POLICY IF EXISTS "Public update access" ON menu_items;
DROP POLICY IF EXISTS "Public delete access" ON menu_items;
DROP POLICY IF EXISTS "Public insert access" ON drink_items;
DROP POLICY IF EXISTS "Public update access" ON drink_items;
DROP POLICY IF EXISTS "Public delete access" ON drink_items;

-- ÉTAPE 4 : Créer les nouvelles politiques sécurisées pour menu_items
CREATE POLICY "Admins can insert menu_items" ON menu_items
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update menu_items" ON menu_items
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- Note: La "suppression" se fait via UPDATE is_active = false
-- La politique UPDATE ci-dessus couvre déjà cette fonctionnalité

-- ÉTAPE 5 : Créer les nouvelles politiques sécurisées pour drink_items
CREATE POLICY "Admins can insert drink_items" ON drink_items
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update drink_items" ON drink_items
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- ✅ Vérification
-- Pour vérifier que tout fonctionne, exécutez :
-- SELECT * FROM admin_users;
-- Vous devriez voir votre email admin dans la liste
