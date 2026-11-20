'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import { ProfileHeader } from './profile-header'
import { Socials } from './socials'
import { ReleasePlayer } from './release-player'
import { ShowsList } from './shows-list'
import { MerchCard } from './merch-card'
import { CustomLinks } from './custom-links'

type Profile = Database['public']['Tables']['profiles']['Row']
type Release = Database['public']['Tables']['releases']['Row']
type CustomLink = Database['public']['Tables']['custom_links']['Row']
type Social = Database['public']['Tables']['socials']['Row']

interface ArtistBioProps {
  slug?: string
}

export function ArtistBio({ slug }: ArtistBioProps) {
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)

  // Supabase state
  const [profile, setProfile] = useState<Profile | null>(null)
  const [releases, setReleases] = useState<Release[]>([])
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([])
  const [socials, setSocials] = useState<Social[]>([])

  useEffect(() => {
    async function fetchPublicData() {
      try {
        setLoading(true)
        setProfile(null)
        setReleases([])
        setCustomLinks([])
        setSocials([])

        const targetSlug = (slug || 'moli').trim().toLowerCase()

        // 1. Load profile by slug
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('slug', targetSlug)
          .maybeSingle()

        if (profileError) throw profileError

        if (profileData) {
          setProfile(profileData)

          // 2. Load active releases
          const { data: releasesData } = await supabase
            .from('releases')
            .select('*')
            .eq('profile_id', profileData.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

          if (releasesData) setReleases(releasesData)

          // 3. Load active custom links
          const { data: linksData } = await supabase
            .from('custom_links')
            .select('*')
            .eq('profile_id', profileData.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

          if (linksData) setCustomLinks(linksData)

          // 4. Load social profiles
          const { data: socialsData } = await supabase
            .from('socials')
            .select('*')
            .eq('profile_id', profileData.id)
            .order('order_index', { ascending: true })

          if (socialsData) setSocials(socialsData)
        }
      } catch (err) {
        console.error('Error fetching artist bio data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPublicData()
  }, [slug])

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

  // Use the first release as the latest release for the player
  const latestRelease = releases[0] || null

  // Generate initials from the artist name
  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('') || 'AR'

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-[#121316] text-[#e9e5df] antialiased selection:bg-[#e2d9cc] selection:text-[#121316]">
      {/* Background grain texture */}
      <div className="grain pointer-events-none fixed inset-0 z-50 opacity-60" />

      {/* Ambient background glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b from-[#b8a38c]/10 via-[#20242a]/5 to-transparent blur-3xl opacity-50" />

      {/* Main container */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-12 lg:max-w-3xl">
        <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#181b20]/90 backdrop-blur-xl shadow-2xl shadow-black/50">
          <ProfileHeader
            name={profile.name}
            tagline={profile.tagline || ''}
            location={profile.location || ''}
            isVerified={profile.is_verified || false}
            coverUrl={profile.cover_url}
            avatarUrl={profile.avatar_url}
            avatarInitials={initials}
            onToggleCustomizer={() => setShowCustomizer(!showCustomizer)}
          />

          <div className="relative px-5 pb-10 sm:px-8">
            <Socials socials={socials} />

            <div className="mt-8 space-y-8">
              {latestRelease && <ReleasePlayer release={latestRelease} />}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <ShowsList shows={[]} />
                <MerchCard merch={undefined} />
              </div>

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
