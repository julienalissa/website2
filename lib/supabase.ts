import { createClient } from '@supabase/supabase-js'

// Configuration Supabase - Les valeurs doivent être définies dans les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variables Supabase non configurées. Veuillez définir NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    redirectTo: typeof window !== 'undefined' ? window.location.origin + '/admin' : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types pour la base de données
export interface Reservation {
  id?: string
  customer_name: string
  customer_phone?: string
  customer_email?: string
  number_of_people: number
  reservation_date: string
  reservation_time: string
  status?: 'confirmed' | 'cancelled' | 'completed'
  table_id?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface SpecialRequest {
  id?: string
  name: string
  email: string
  message: string
  status?: 'new' | 'read' | 'responded'
  created_at?: string
}



