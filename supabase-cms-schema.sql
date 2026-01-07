-- Schema CMS Complet pour Gérer TOUT le Contenu du Site
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Table pour stocker le contenu des pages
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL, -- 'home', 'about', 'contact', 'events', etc.
  section_key TEXT NOT NULL, -- Identifiant unique de la section (ex: 'hero-title', 'about-story-1')
  content_type TEXT NOT NULL, -- 'text', 'html', 'image', 'block'
  content_value TEXT, -- Le contenu textuel ou HTML
  image_url TEXT, -- URL de l'image si content_type = 'image'
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_slug, section_key)
);

-- Table pour les blocs modulaires
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,
  block_type TEXT NOT NULL, -- 'text', 'image', 'text-image', 'gallery', 'cta', etc.
  title TEXT,
  content TEXT, -- Contenu HTML
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les images de la galerie
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les informations du restaurant (modifiables)
CREATE TABLE IF NOT EXISTS restaurant_info_editable (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  name TEXT,
  tagline TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  hours_monday TEXT,
  hours_tuesday TEXT,
  hours_wednesday TEXT,
  hours_thursday TEXT,
  hours_friday TEXT,
  hours_saturday TEXT,
  hours_sunday TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_info_editable ENABLE ROW LEVEL SECURITY;

-- Politiques SELECT publiques (lecture pour tous)
CREATE POLICY "Public can read page_content" ON page_content
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read content_blocks" ON content_blocks
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read gallery_images" ON gallery_images
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read restaurant_info" ON restaurant_info_editable
  FOR SELECT USING (true);

-- Politiques SELECT pour admins (lecture de tout)
CREATE POLICY "Admins can read all page_content" ON page_content
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can read all content_blocks" ON content_blocks
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can read all gallery_images" ON gallery_images
  FOR SELECT USING (is_admin());

-- Politiques INSERT/UPDATE/DELETE pour admins uniquement
CREATE POLICY "Admins can manage page_content" ON page_content
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can manage content_blocks" ON content_blocks
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can manage gallery_images" ON gallery_images
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can manage restaurant_info" ON restaurant_info_editable
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Initialiser les données par défaut pour le restaurant
INSERT INTO restaurant_info_editable (id, name, tagline, description, address, phone, email, hours_monday, hours_tuesday, hours_wednesday, hours_thursday, hours_friday, hours_saturday, hours_sunday)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Le Savoré',
  'Fine Dining en Suisse',
  'Découvrez une cuisine méditerranéenne de saison, élaborée avec la qualité suisse et le souci du détail dans une atmosphère élégante et accueillante.',
  'Rue Sous-le-Pré 19A, 2014 Bôle',
  '+41 76 630 73 10',
  'info@lesavore.ch',
  'Fermé',
  '10h00–14h00, 18h00–22h00',
  '10h00–14h00, 18h00–22h00',
  '10h00–14h00, 18h00–22h00',
  '11h30–13h30, 18h00–21h30',
  '18h00–23h00',
  'Fermé'
)
ON CONFLICT (id) DO NOTHING;

-- Créer un index pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_page_content_slug ON page_content(page_slug);
CREATE INDEX IF NOT EXISTS idx_content_blocks_slug ON content_blocks(page_slug);
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON gallery_images(display_order);
