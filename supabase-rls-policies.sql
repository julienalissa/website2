-- Politiques RLS pour permettre l'écriture depuis l'interface admin
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Permettre l'insertion (création) pour tous
CREATE POLICY "Public insert access" ON menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON drink_items FOR INSERT WITH CHECK (true);

-- Permettre la mise à jour pour tous
CREATE POLICY "Public update access" ON menu_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public update access" ON drink_items FOR UPDATE USING (true) WITH CHECK (true);

-- Permettre la suppression pour tous (via is_active = false)
CREATE POLICY "Public delete access" ON menu_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete access" ON drink_items FOR UPDATE USING (true) WITH CHECK (true);

-- Note: Ces politiques permettent l'écriture pour tous car l'interface admin
-- est déjà protégée par un mot de passe côté client. Pour plus de sécurité,
-- vous pouvez utiliser Supabase Auth avec des politiques basées sur les rôles.
