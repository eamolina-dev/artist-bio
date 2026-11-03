import { Database } from '@/types/supabase'

// Aliases directos de las tablas en Supabase (SSOT)
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Release = Database['public']['Tables']['releases']['Row']
export type CustomLink = Database['public']['Tables']['custom_links']['Row']
export type Show = Database['public']['Tables']['shows']['Row']
export type Social = Database['public']['Tables']['socials']['Row']
export type Merch = Database['public']['Tables']['merch']['Row']

// Aliases opcionales para Inserts (útil para los formularios del Admin)
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type ReleaseInsert = Database['public']['Tables']['releases']['Insert']
export type CustomLinkInsert = Database['public']['Tables']['custom_links']['Insert']
export type ShowInsert = Database['public']['Tables']['shows']['Insert']
export type SocialInsert = Database['public']['Tables']['socials']['Insert']
export type MerchInsert = Database['public']['Tables']['merch']['Insert']
