'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import { ProfileHeader } from './profile-header'
import { SocialLinks } from './social-links'
import { ReleasePlayer } from './release-player'
import { ShowsList } from './shows-list'
import { MerchCard } from './merch-card'
import { CustomLinks } from './custom-links'

type Profile = Database['public']['Tables']['profiles']['Row']
type Release = Database['public']['Tables']['releases']['Row']
type CustomLink = Database['public']['Tables']['custom_links']['Row']

export function ArtistBio() {
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)

  // Estados reales de Supabase
  const [profile, setProfile] = useState<Profile | null>(null)
  const [releases, setReleases] = useState<Release[]>([])
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([])

  useEffect(() => {
    async function fetchPublicData() {
      try {
        setLoading(true)

        // 1. Cargar el perfil principal (@moli)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('handle', 'moli')
          .single()

        if (profileError) throw profileError

        if (profileData) {
          setProfile(profileData)

          // 2. Cargar releases activos de la DB
          const { data: releasesData } = await supabase
            .from('releases')
            .select('*')
            .eq('profile_id', profileData.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

          if (releasesData) setReleases(releasesData)

          // 3. Cargar custom links activos de la DB
          const { data: linksData } = await supabase
            .from('custom_links')
            .select('*')
            .eq('profile_id', profileData.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

          if (linksData) setCustomLinks(linksData)
        }
      } catch (err) {
        console.error('Error fetching artist bio data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPublicData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121316] text-[#e9e5df] flex items-center justify-center font-mono text-sm">
        Loading...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#121316] text-[#e9e5df] flex items-center justify-center font-mono text-sm">
        Profile not found.
      </div>
    )
  }

  // Tomamos el primer release cargado como el latestRelease para el player
  const latestRelease = releases[0] || null

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-[#121316] text-[#e9e5df] antialiased selection:bg-[#e2d9cc] selection:text-[#121316]">
      {/* Capa de textura / grano de fondo */}
      <div className="grain pointer-events-none fixed inset-0 z-50 opacity-60" />

      {/* Luz tenue ambiental de fondo */}
      <div className="pointer-events-none fixed left-1/2 top-0 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b from-[#b8a38c]/10 via-[#20242a]/5 to-transparent blur-3xl opacity-50" />

      {/* Contenedor Principal */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-12 lg:max-w-3xl">
        <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#181b20]/90 backdrop-blur-xl shadow-2xl shadow-black/50">
          
          <ProfileHeader
            name={profile.name}
            tagline={profile.tagline || ''}
            location={profile.location || ''}
            isVerified={true}
            coverUrl={''}
            avatarInitials="MO"
            onToggleCustomizer={() => setShowCustomizer(!showCustomizer)}
          />

          <div className="relative px-5 pb-10 sm:px-8">
            <SocialLinks socials={[]} />
            
            <div className="mt-8 space-y-8">
              {/* Le pasamos el release real traído de Supabase */}
              {latestRelease && <ReleasePlayer release={latestRelease} />}
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <ShowsList shows={[]} />
                <MerchCard merch={undefined} />
              </div>

              {/* Le pasamos el array de links reales traídos de Supabase */}
              <CustomLinks links={customLinks} />
            </div>

            <footer className="mt-12 border-t border-white/[0.06] pt-6 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[#606871]">
              artist-bio · crafted for independent music
            </footer>
          </div>
        </section>
      </div>
    </main>
  )
}