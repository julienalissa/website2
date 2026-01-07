// Fonctions pour gérer le contenu depuis Supabase
import { supabase } from './supabase';
import type { MenuItem, DrinkItem, GalleryImage } from './data';

// Récupérer tous les éléments du menu
export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    price: parseFloat(item.price),
    category: item.category,
    tags: item.tags || []
  }));
}

// Récupérer toutes les boissons
export async function getDrinkItems(): Promise<DrinkItem[]> {
  const { data, error } = await supabase
    .from('drink_items')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching drink items:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    price: parseFloat(item.price),
    category: item.category as 'cocktail' | 'wine' | 'beer' | 'non-alcoholic'
  }));
}

// Récupérer toutes les images de la galerie
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    src: item.src,
    alt: item.alt
  }));
}

// Récupérer les informations du restaurant
export async function getRestaurantInfo() {
  const { data, error } = await supabase
    .from('restaurant_info')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000000')
    .single();

  if (error) {
    console.error('Error fetching restaurant info:', error);
    return null;
  }

  return data;
}

// Fonctions d'administration (nécessitent authentification)
export async function createMenuItem(item: Omit<MenuItem, 'id'>) {
  const { data, error } = await supabase
    .from('menu_items')
    .insert({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      tags: item.tags || []
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMenuItem(id: string, item: Partial<MenuItem>) {
  const { data, error } = await supabase
    .from('menu_items')
    .update({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      tags: item.tags
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMenuItem(id: string) {
  const { error } = await supabase
    .from('menu_items')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
}

export async function createDrinkItem(item: Omit<DrinkItem, 'id'>) {
  const { data, error } = await supabase
    .from('drink_items')
    .insert({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDrinkItem(id: string, item: Partial<DrinkItem>) {
  const { data, error } = await supabase
    .from('drink_items')
    .update({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDrinkItem(id: string) {
  const { error } = await supabase
    .from('drink_items')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
}

export async function createGalleryImage(item: Omit<GalleryImage, 'id'>) {
  const { data, error } = await supabase
    .from('gallery_images')
    .insert({
      src: item.src,
      alt: item.alt
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGalleryImage(id: string, item: Partial<GalleryImage>) {
  const { data, error } = await supabase
    .from('gallery_images')
    .update({
      src: item.src,
      alt: item.alt
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGalleryImage(id: string) {
  const { error } = await supabase
    .from('gallery_images')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
}

// Upload d'image vers Supabase Storage
export async function uploadImage(file: File, path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('gallery')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Erreur upload:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Aucune donnée retournée lors de l\'upload');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('gallery')
    .getPublicUrl(data.path);

  return publicUrl;
}
