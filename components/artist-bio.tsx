'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ChevronDown, Plus, Sparkles } from 'lucide-react'
import { mockArtistProfile } from '@/data/mockProfile'
import { ProfileHeader } from './profile-header'
import { SocialLinks } from './social-links'
import { ReleasePlayer } from './release-player'
import { ShowsList } from './shows-list'
import { MerchCard } from './merch-card'
import { CustomLinks } from './custom-links'

export function ArtistBio() {
  const [showCustomizer, setShowCustomizer] = useState(false)
  // const profile = mockArtistProfile
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Consultamos el perfil donde el handle sea 'moli'
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('handle', 'moli')
          .single()

        if (error) throw error
        if (data) setProfile(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
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

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-[#121316] text-[#e9e5df] antialiased selection:bg-[#e2d9cc] selection:text-[#121316]">
      {/* Capa de textura / grano de fondo */}
      <div className="grain pointer-events-none fixed inset-0 z-50 opacity-60" />

      {/* Luz tenue ambiental de fondo */}
      <div className="pointer-events-none fixed left-1/2 top-0 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b from-[#b8a38c]/10 via-[#20242a]/5 to-transparent blur-3xl opacity-50" />

      {/* Contenedor Principal: Centrado y ancho adaptativo para Desktop */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-12 lg:max-w-3xl">
        
        {/* Tarjeta de Perfil Fluida */}
        <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#181b20]/90 backdrop-blur-xl shadow-2xl shadow-black/50">
          
          <ProfileHeader
            name={profile.name}
            tagline={profile.tagline}
            location={profile.location}
            isVerified={profile.isVerified}
            coverUrl={profile.coverUrl}
            avatarInitials="MO"
            onToggleCustomizer={() => setShowCustomizer(!showCustomizer)}
          />

          <div className="relative px-5 pb-10 sm:px-8">
            <SocialLinks socials={profile.socials} />
            
            {/* Grid o columna adaptativa para escritorio */}
            <div className="mt-8 space-y-8">
              <ReleasePlayer release={profile.latestRelease} />
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <ShowsList shows={profile.shows} />
                <MerchCard merch={profile.merch} />
              </div>

              <CustomLinks links={profile.links} />
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
