-- Politiques RLS sécurisées pour l'interface admin
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- Ce script gère les cas où les politiques existent déjà

-- ÉTAPE 1 : Créer la table admin_users (si elle n'existe pas déjà)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer votre email admin (ne fera rien si déjà présent)
INSERT INTO admin_users (email)
VALUES ('Lesavorech@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Activer RLS sur admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Supprimer l'ancienne politique si elle existe
DROP POLICY IF EXISTS "Admins can read admin_users" ON admin_users;

-- Créer la politique pour que les admins puissent lire la liste des admins
CREATE POLICY "Admins can read admin_users" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- ÉTAPE 2 : Créer ou remplacer la fonction pour vérifier si l'utilisateur est admin
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

-- Supprimer les anciennes politiques publiques SELECT si elles existent
DROP POLICY IF EXISTS "Public can read active menu_items" ON menu_items;
DROP POLICY IF EXISTS "Public can read active drink_items" ON drink_items;

-- Supprimer les nouvelles politiques si elles existent déjà (pour éviter les erreurs)
DROP POLICY IF EXISTS "Admins can select menu_items" ON menu_items;
DROP POLICY IF EXISTS "Admins can insert menu_items" ON menu_items;
DROP POLICY IF EXISTS "Admins can update menu_items" ON menu_items;
DROP POLICY IF EXISTS "Admins can select drink_items" ON drink_items;
DROP POLICY IF EXISTS "Admins can insert drink_items" ON drink_items;
DROP POLICY IF EXISTS "Admins can update drink_items" ON drink_items;

-- ÉTAPE 4 : Créer les nouvelles politiques sécurisées pour menu_items
-- Politique SELECT publique : Tout le monde peut lire les éléments actifs (pour afficher le menu)
CREATE POLICY "Public can read active menu_items" ON menu_items
  FOR SELECT USING (is_active = true);

-- Politique SELECT admin : Les admins peuvent lire tous les éléments (actifs et inactifs)
CREATE POLICY "Admins can select menu_items" ON menu_items
  FOR SELECT USING (is_admin());

-- Politique INSERT : Les admins peuvent créer de nouveaux éléments
CREATE POLICY "Admins can insert menu_items" ON menu_items
  FOR INSERT WITH CHECK (is_admin());

-- Politique UPDATE : Les admins peuvent modifier les éléments
CREATE POLICY "Admins can update menu_items" ON menu_items
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- ÉTAPE 5 : Créer les nouvelles politiques sécurisées pour drink_items
-- Politique SELECT publique : Tout le monde peut lire les éléments actifs (pour afficher les boissons)
CREATE POLICY "Public can read active drink_items" ON drink_items
  FOR SELECT USING (is_active = true);

-- Politique SELECT admin : Les admins peuvent lire tous les éléments (actifs et inactifs)
CREATE POLICY "Admins can select drink_items" ON drink_items
  FOR SELECT USING (is_admin());

-- Politique INSERT : Les admins peuvent créer de nouveaux éléments
CREATE POLICY "Admins can insert drink_items" ON drink_items
  FOR INSERT WITH CHECK (is_admin());

-- Politique UPDATE : Les admins peuvent modifier les éléments
CREATE POLICY "Admins can update drink_items" ON drink_items
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- ✅ Vérification
-- Pour vérifier que tout fonctionne, exécutez :
-- SELECT * FROM admin_users;
-- Vous devriez voir votre email admin dans la liste
