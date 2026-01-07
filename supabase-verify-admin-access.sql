-- Script de vérification et correction des politiques RLS pour l'admin
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- ÉTAPE 1 : Vérifier que votre email est bien dans admin_users
SELECT * FROM admin_users WHERE email = 'Lesavorech@gmail.com';

-- Si aucun résultat, ajoutez votre email :
INSERT INTO admin_users (email)
VALUES ('Lesavorech@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- ÉTAPE 2 : Vérifier que la fonction is_admin() existe et fonctionne
-- (Remplacez 'Lesavorech@gmail.com' par votre email si différent)
SELECT is_admin() as is_admin_check;

-- ÉTAPE 3 : Vérifier les politiques RLS sur menu_items
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'menu_items';

-- ÉTAPE 4 : Vérifier les politiques RLS sur drink_items
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'drink_items';

-- ÉTAPE 5 : S'assurer que RLS est activé sur les tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('menu_items', 'drink_items', 'admin_users');

-- ÉTAPE 6 : Si les politiques manquent, les recréer
-- (Exécutez seulement si les politiques n'existent pas)

-- Pour menu_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'menu_items' 
    AND policyname = 'Admins can insert menu_items'
  ) THEN
    CREATE POLICY "Admins can insert menu_items" ON menu_items
      FOR INSERT WITH CHECK (is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'menu_items' 
    AND policyname = 'Admins can update menu_items'
  ) THEN
    CREATE POLICY "Admins can update menu_items" ON menu_items
      FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
  END IF;
END $$;

-- Pour drink_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'drink_items' 
    AND policyname = 'Admins can insert drink_items'
  ) THEN
    CREATE POLICY "Admins can insert drink_items" ON drink_items
      FOR INSERT WITH CHECK (is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'drink_items' 
    AND policyname = 'Admins can update drink_items'
  ) THEN
    CREATE POLICY "Admins can update drink_items" ON drink_items
      FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
  END IF;
END $$;

-- ÉTAPE 7 : Vérifier que les tables ont bien RLS activé
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 8 : Test de la fonction is_admin() avec un email de test
-- (Cette requête devrait retourner true si vous êtes connecté en tant qu'admin)
-- Note: Cette requête ne fonctionnera que si vous êtes authentifié
SELECT 
  auth.jwt() ->> 'email' as current_user_email,
  is_admin() as is_admin_result;
