import { createClient } from '@supabase/supabase-js'
import type { AppDatabase } from '@/types/app-database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<AppDatabase>(supabaseUrl, supabaseAnonKey)
