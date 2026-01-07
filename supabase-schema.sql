-- Schéma Supabase pour le CMS du restaurant
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Table pour les éléments du menu
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les boissons
CREATE TABLE IF NOT EXISTS drink_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cocktail', 'wine', 'beer', 'non-alcoholic')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les images de la galerie
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src TEXT NOT NULL, -- URL de l'image dans Supabase Storage
  alt TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les informations du restaurant
CREATE TABLE IF NOT EXISTS restaurant_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  hours JSONB, -- {monday: "...", tuesday: "...", etc.}
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = '00000000-0000-0000-0000-000000000000'::uuid)
);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drink_items_updated_at BEFORE UPDATE ON drink_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_info_updated_at BEFORE UPDATE ON restaurant_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Politiques RLS (Row Level Security)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_info ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture publique (pour le site)
CREATE POLICY "Public read access" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON drink_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Public read access" ON restaurant_info FOR SELECT USING (true);

-- Permettre l'écriture uniquement pour les utilisateurs authentifiés (sera géré par l'interface admin)
-- Note: Vous devrez créer une politique spécifique pour les utilisateurs admin
-- CREATE POLICY "Admin write access" ON menu_items FOR ALL USING (auth.role() = 'authenticated');

-- Initialiser restaurant_info avec un ID fixe
INSERT INTO restaurant_info (id, name, tagline, description, address, phone, email, hours)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'Le Savoré',
  'Fine Dining en Suisse',
  'Découvrez une cuisine méditerranéenne de saison, élaborée avec la qualité suisse et le souci du détail dans une atmosphère élégante et accueillante.',
  'Rue Sous-le-Pré 19A, 2014 Bôle',
  '+41 76 630 73 10',
  'info@lesavore.ch',
  '{"monday": "Fermé", "tuesday": "10h00–14h00, 18h00–22h00", "wednesday": "10h00–14h00, 18h00–22h00", "thursday": "10h00–14h00, 18h00–22h00", "friday": "11h30–13h30, 18h00–21h30", "saturday": "18h00–23h00", "sunday": "Fermé"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
