import { Database } from '@/types/supabase'

// 1. Alias directos de la Base de Datos (SSOT)
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Release = Database['public']['Tables']['releases']['Row']
export type CustomLink = Database['public']['Tables']['custom_links']['Row']

// 2. Interfaces exclusivas de UI (que aún no tienen tabla en Supabase)
export interface Show {
  id: string
  date: string
  month: string
  venue: string
  city: string
  status: 'Tickets' | 'Sold out' | 'Free'
  ticket_url?: string | null
}

export interface MerchItem {
  title: string
  subtitle: string
  price: string
  image_url?: string | null
  buy_url?: string | null
}

export interface SocialLink {
  platform: 'spotify' | 'apple' | 'youtube' | 'instagram' | 'soundcloud'
  url: string
}
