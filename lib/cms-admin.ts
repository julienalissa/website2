// Fonctions CMS pour gérer TOUT le contenu du site
import { supabase } from './supabase';

// Types
export interface PageContent {
  id: string;
  page_slug: string;
  section_key: string;
  content_type: 'text' | 'html' | 'image' | 'block';
  content_value: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface ContentBlock {
  id: string;
  page_slug: string;
  block_type: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface RestaurantInfo {
  id: string;
  name: string | null;
  tagline: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  hours_monday: string | null;
  hours_tuesday: string | null;
  hours_wednesday: string | null;
  hours_thursday: string | null;
  hours_friday: string | null;
  hours_saturday: string | null;
  hours_sunday: string | null;
}

// ===== PAGE CONTENT =====

export async function getPageContent(pageSlug: string): Promise<PageContent[]> {
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page_slug', pageSlug)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching page content:', error);
    return [];
  }

  return data || [];
}

export async function upsertPageContent(content: Partial<PageContent> & { page_slug: string; section_key: string }) {
  const { data, error } = await supabase
    .from('page_content')
    .upsert({
      ...content,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'page_slug,section_key'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePageContent(id: string) {
  const { error } = await supabase
    .from('page_content')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
}

// ===== CONTENT BLOCKS =====

export async function getContentBlocks(pageSlug: string): Promise<ContentBlock[]> {
  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('page_slug', pageSlug)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching content blocks:', error);
    return [];
  }

  return data || [];
}

export async function createContentBlock(block: Omit<ContentBlock, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('content_blocks')
    .insert(block)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateContentBlock(id: string, block: Partial<ContentBlock>) {
  const { data, error } = await supabase
    .from('content_blocks')
    .update({
      ...block,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteContentBlock(id: string) {
  const { error } = await supabase
    .from('content_blocks')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
}

// ===== RESTAURANT INFO =====

export async function getRestaurantInfo(): Promise<RestaurantInfo | null> {
  const { data, error } = await supabase
    .from('restaurant_info_editable')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .single();

  if (error) {
    console.error('Error fetching restaurant info:', error);
    return null;
  }

  return data;
}

export async function updateRestaurantInfo(info: Partial<RestaurantInfo>) {
  const { data, error } = await supabase
    .from('restaurant_info_editable')
    .update({
      ...info,
      updated_at: new Date().toISOString()
    })
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ===== GALLERY IMAGES =====

export async function getAllGalleryImages() {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }

  return data || [];
}

export async function createGalleryImage(image: { image_url: string; alt_text?: string; caption?: string }) {
  const { data, error } = await supabase
    .from('gallery_images')
    .insert(image)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGalleryImage(id: string, image: Partial<{ image_url: string; alt_text: string; caption: string; display_order: number }>) {
  const { data, error } = await supabase
    .from('gallery_images')
    .update({
      ...image,
      updated_at: new Date().toISOString()
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
