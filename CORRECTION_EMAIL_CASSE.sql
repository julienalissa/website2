-- 🔧 Correction du Problème de Casse d'Email
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- PROBLÈME IDENTIFIÉ :
-- L'email dans la session est "lesavorech@gmail.com" (minuscules)
-- Mais dans admin_users il est peut-être "Lesavorech@gmail.com" (majuscule)
-- La comparaison exacte échoue à cause de la casse différente

-- SOLUTION 1 : Mettre à jour la fonction is_admin() pour ignorer la casse
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SOLUTION 2 : Normaliser l'email dans admin_users (tout en minuscules)
-- Mettre à jour tous les emails existants en minuscules
UPDATE admin_users 
SET email = LOWER(email)
WHERE email != LOWER(email);

-- SOLUTION 3 : S'assurer que l'email est bien présent (en minuscules)
INSERT INTO admin_users (email)
VALUES ('lesavorech@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Si vous avez l'ancien email avec majuscule, le supprimer
DELETE FROM admin_users 
WHERE email = 'Lesavorech@gmail.com' AND email != 'lesavorech@gmail.com';

-- VÉRIFICATION
SELECT 
  email,
  LOWER(email) as email_lower,
  created_at
FROM admin_users
WHERE LOWER(email) = 'lesavorech@gmail.com';

-- ✅ Après avoir exécuté ce script, reconnectez-vous et testez à nouveau !
