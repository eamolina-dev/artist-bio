import type { Database } from '@/types/supabase'

type Tables = Database['public']['Tables']
type ProfileTable = Tables['profiles']

type OwnedProfileTable = {
  Row: ProfileTable['Row'] & { user_id: string }
  Insert: Omit<ProfileTable['Insert'], 'id'> & { id?: string; user_id: string }
  Update: ProfileTable['Update'] & { user_id?: string }
  Relationships: ProfileTable['Relationships']
}

export type AppDatabase = Omit<Database, 'public'> & {
  public: Omit<Database['public'], 'Tables'> & {
    Tables: Omit<Tables, 'profiles'> & {
      profiles: OwnedProfileTable
    }
  }
}

export type OwnedProfile = OwnedProfileTable['Row']
