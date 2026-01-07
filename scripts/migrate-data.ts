// Script pour migrer les données existantes de lib/data.ts vers Supabase
// Exécutez avec: npx tsx scripts/migrate-data.ts

import { menuItems, drinkItems, galleryImages, restaurantInfo } from '../lib/data';
import { supabase } from '../lib/supabase';

async function migrateData() {
  console.log('🚀 Début de la migration des données...\n');

  // Migrer les éléments du menu
  console.log('📋 Migration des éléments du menu...');
  for (const item of menuItems) {
    const { error } = await supabase
      .from('menu_items')
      .insert({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        tags: item.tags || []
      });

    if (error) {
      console.error(`❌ Erreur pour ${item.name}:`, error);
    } else {
      console.log(`✅ ${item.name}`);
    }
  }

  // Migrer les boissons
  console.log('\n🍷 Migration des boissons...');
  for (const item of drinkItems) {
    const { error } = await supabase
      .from('drink_items')
      .insert({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category
      });

    if (error) {
      console.error(`❌ Erreur pour ${item.name}:`, error);
    } else {
      console.log(`✅ ${item.name}`);
    }
  }

  // Migrer les images de la galerie
  console.log('\n🖼️  Migration des images de la galerie...');
  for (const image of galleryImages) {
    const { error } = await supabase
      .from('gallery_images')
      .insert({
        src: image.src,
        alt: image.alt
      });

    if (error) {
      console.error(`❌ Erreur pour ${image.alt}:`, error);
    } else {
      console.log(`✅ ${image.alt}`);
    }
  }

  // Migrer les informations du restaurant
  console.log('\n🏢 Mise à jour des informations du restaurant...');
  const { error: infoError } = await supabase
    .from('restaurant_info')
    .upsert({
      id: '00000000-0000-0000-0000-000000000000',
      name: restaurantInfo.name,
      tagline: restaurantInfo.tagline,
      description: restaurantInfo.description,
      address: restaurantInfo.address,
      phone: restaurantInfo.phone,
      email: restaurantInfo.email,
      hours: restaurantInfo.hours
    }, {
      onConflict: 'id'
    });

  if (infoError) {
    console.error('❌ Erreur pour les informations du restaurant:', infoError);
  } else {
    console.log('✅ Informations du restaurant mises à jour');
  }

  console.log('\n✨ Migration terminée !');
}

migrateData().catch(console.error);
