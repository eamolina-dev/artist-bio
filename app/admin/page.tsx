'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'
import { ProfileForm } from '@/components/admin/ProfileForm'
import { ReleasesManager } from '@/components/admin/ReleasesManager'
import { LinksManager } from '@/components/admin/LinksManager'
import { SocialsManager } from '@/components/admin/SocialsManager'
import { useRouter } from 'next/navigation'
import { sortReleases } from '@/lib/utils'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'releases' | 'links' | 'socials'>('profile')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)

  // Estados Releases
  const [releaseTitle, setReleaseTitle] = useState('')
  const [releaseType, setReleaseType] = useState('single')
  const [releaseYear, setReleaseYear] = useState('2026')
  const [releaseDate, setReleaseDate] = useState('')
  const [spotifyUrl, setSpotifyUrl] = useState('')
  const [appleUrl, setAppleUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [releases, setReleases] = useState<Database['public']['Tables']['releases']['Row'][]>([])

  // Estados Links
  const [linkTitle, setLinkTitle] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [customLinks, setCustomLinks] = useState<Database['public']['Tables']['custom_links']['Row'][]>([])

  // Estados Socials
  const [platform, setPlatform] = useState('spotify')
  const [socialUrl, setSocialUrl] = useState('')
  const [socials, setSocials] = useState<Database['public']['Tables']['socials']['Row'][]>([])

  const router = useRouter()

  const loadAdminData = useCallback(async (currentUserId: string) => {
    setLoading(true)

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUserId)
      .maybeSingle()

    if (profileData) {
      setProfile(profileData)

      // Load releases
      const { data: releasesData } = await supabase
        .from('releases')
        .select('*')
        .eq('profile_id', profileData.id)
        .order('created_at', { ascending: false })

      if (releasesData) setReleases(sortReleases(releasesData))

      // Load custom links
      const { data: linksData } = await supabase
        .from('custom_links')
        .select('*')
        .eq('profile_id', profileData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (linksData) setCustomLinks(linksData)

      // Load social profiles
      const { data: socialsData } = await supabase
        .from('socials')
        .select('*')
        .eq('profile_id', profileData.id)
        .order('order_index', { ascending: true })

      if (socialsData) setSocials(socialsData)
    } else {
      setProfile(null)
    }
    setLoading(false)
  }, [])

  const refreshAdminData = useCallback(() => {
    if (userId) {
      void loadAdminData(userId)
    }
  }, [loadAdminData, userId])

  useEffect(() => {
    let cancelled = false

    async function checkAuthAndLoad() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/admin/login')
        return
      }
      if (cancelled) return

      setUserId(session.user.id)
      void loadAdminData(session.user.id)
    }

    void checkAuthAndLoad()
    return () => {
      cancelled = true
    }
  }, [loadAdminData, router])

  async function handleCopyLink() {
    if (!profile) return

    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${profile.slug}`)
      setLinkCopied(true)
      window.setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      window.alert('Could not copy the link.')
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUserId(null)
    setProfile(null)
    router.push('/admin/login')
    router.refresh()
  }

  // --- Handlers Releases ---
  async function handleAddRelease(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    if (!releaseTitle) return alert('A release title is required.')

    try {
      const { error } = await supabase.from('releases').insert([
        {
          profile_id: profile.id,
          title: releaseTitle,
          type: releaseType,
          year: releaseYear,
          release_date: releaseDate || null,
          spotify_url: spotifyUrl,
          apple_url: appleUrl,
          cover_url: coverUrl,
          is_featured: false,
        },
      ])
      if (error) throw error
      alert('Release added.')
      setReleaseTitle('')
      setReleaseDate('')
      setSpotifyUrl('')
      setAppleUrl('')
      setCoverUrl('')
      refreshAdminData()
    } catch (err) {
      console.error(err)
      alert('Could not add release.')
    }
  }

  async function handleToggleFeaturedRelease(id: string, isFeatured: boolean) {
    if (!profile) return

    try {
      if (isFeatured) {
        const { error: clearError } = await supabase
          .from('releases')
          .update({ is_featured: false })
          .eq('profile_id', profile.id)
          .neq('id', id)

        if (clearError) throw clearError
      }

      const { error } = await supabase
        .from('releases')
        .update({ is_featured: isFeatured })
        .eq('profile_id', profile.id)
        .eq('id', id)

      if (error) throw error

      setReleases((currentReleases) =>
        currentReleases.map((release) => ({
          ...release,
          is_featured:
            release.id === id
              ? isFeatured
              : isFeatured
                ? false
                : release.is_featured,
        })),
      )
    } catch (err) {
      console.error(err)
      alert('Could not update the featured release.')
    }
  }

  async function handleToggleReleaseActive(id: string, isActive: boolean) {
    if (!profile) return
    if (!isActive && !confirm('Hide this release?')) return

    const { error } = await supabase
      .from('releases')
      .update({ is_active: isActive })
      .eq('profile_id', profile.id)
      .eq('id', id)

    if (error) {
      console.error(error)
      alert(isActive ? 'Could not show the release.' : 'Could not hide the release.')
    } else {
      setReleases((currentReleases) =>
        currentReleases.map((release) =>
          release.id === id ? { ...release, is_active: isActive } : release,
        ),
      )
    }
  }

  // --- Handlers Links ---
  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    if (!linkTitle || !linkUrl) return alert('A title and URL are required.')

    try {
      const { error } = await supabase.from('custom_links').insert([
        {
          profile_id: profile.id,
          label: linkTitle,
          url: linkUrl,
        },
      ])
      if (error) throw error
      alert('Link created.')
      setLinkTitle('')
      setLinkUrl('')
      refreshAdminData()
    } catch (err) {
      console.error(err)
      alert('Could not add link.')
    }
  }

  async function handleDeleteLink(id: string) {
    if (!confirm('Delete this link?')) return

    const { error } = await supabase
      .from('custom_links')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      alert('Could not delete the link.')
    } else {
      setCustomLinks(customLinks.filter((l) => l.id !== id))
    }
  }

  // --- Handlers Socials ---
  async function handleAddSocial(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    if (!socialUrl) return alert('A social profile URL is required.')

    try {
      const { error } = await supabase.from('socials').insert([
        {
          profile_id: profile.id,
          platform: platform,
          url: socialUrl,
          order_index: socials.length + 1,
        },
      ])
      if (error) throw error
      alert('Social profile added.')
      setSocialUrl('')
      refreshAdminData()
    } catch (err) {
      console.error(err)
      alert('Could not add the social profile.')
    }
  }

  async function handleDeleteSocial(id: string) {
    if (!confirm('Delete this social profile?')) return

    const { error } = await supabase
      .from('socials')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      alert('Could not delete the social profile.')
    } else {
      setSocials(socials.filter((s) => s.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121316] text-[#e9e5df] flex items-center justify-center font-mono text-sm">
        Loading admin dashboard...
      </div>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#121316] text-[#e9e5df] flex flex-col items-center justify-center gap-4 p-4 font-mono text-sm">
        <p>Profile not found. Please try again or sign out.</p>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-red-400 hover:text-red-300 border border-red-900/40 px-3 py-1.5 rounded bg-red-950/20 transition cursor-pointer"
        >
          Sign out
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#121316] text-[#e9e5df] p-6 max-w-2xl mx-auto font-sans">
      <header className="flex items-center justify-between border-b border-[#2a2d34] pb-4 mb-8">
        <div>
          <h1 className="text-xl font-bold font-mono">ADMIN PANEL</h1>
          <p className="text-xs text-[#a0a0a0] font-mono">Managing content for @{profile.slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[#a0a0a0] hover:text-white border border-[#2a2d34] px-3 py-1.5 rounded transition"
          >
            ← View bio
          </a>
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-xs font-mono text-[#a0a0a0] hover:text-white border border-[#2a2d34] px-3 py-1.5 rounded transition cursor-pointer"
          >
            {linkCopied ? 'Copied' : 'Copy link'}
          </button>
          <button
            onClick={handleLogout}
            className="text-xs font-mono text-red-400 hover:text-red-300 border border-red-900/40 px-3 py-1.5 rounded bg-red-950/20 transition cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 font-mono text-xs border-b border-[#2a2d34] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-1.5 rounded cursor-pointer ${activeTab === 'profile' ? 'bg-white text-black font-bold' : 'text-[#a0a0a0] hover:text-white'}`}
        >
          [ Profile ]
        </button>
        <button
          onClick={() => setActiveTab('releases')}
          className={`px-3 py-1.5 rounded cursor-pointer ${activeTab === 'releases' ? 'bg-white text-black font-bold' : 'text-[#a0a0a0] hover:text-white'}`}
        >
          [ Releases ({releases.length}) ]
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`px-3 py-1.5 rounded cursor-pointer ${activeTab === 'links' ? 'bg-white text-black font-bold' : 'text-[#a0a0a0] hover:text-white'}`}
        >
          [ Links ({customLinks.length}) ]
        </button>
        <button
          onClick={() => setActiveTab('socials')}
          className={`px-3 py-1.5 rounded cursor-pointer ${activeTab === 'socials' ? 'bg-white text-black font-bold' : 'text-[#a0a0a0] hover:text-white'}`}
        >
          [ Socials ({socials.length}) ]
        </button>
      </div>

      {activeTab === 'profile' && (
        <ProfileForm
          key={profile.id}
          profile={profile}
          onSave={async (updatedFields) => {
            if (!profile) return

            try {
              const { error } = await supabase
                .from('profiles')
                .update(updatedFields)
                .eq('id', profile.id)
              if (error) throw error
              alert('Profile updated.')
              refreshAdminData()
            } catch (err) {
              console.error(err)
              alert('Could not save changes.')
            }
          }}
        />
      )}

      {activeTab === 'releases' && (
        <ReleasesManager
          releaseTitle={releaseTitle}
          setReleaseTitle={setReleaseTitle}
          releaseType={releaseType}
          setReleaseType={setReleaseType}
          releaseYear={releaseYear}
          setReleaseYear={setReleaseYear}
          releaseDate={releaseDate}
          setReleaseDate={setReleaseDate}
          spotifyUrl={spotifyUrl}
          setSpotifyUrl={setSpotifyUrl}
          appleUrl={appleUrl}
          setAppleUrl={setAppleUrl}
          setCoverUrl={setCoverUrl}
          releases={releases}
          onSubmit={handleAddRelease}
          onToggleActive={handleToggleReleaseActive}
          onToggleFeatured={handleToggleFeaturedRelease}
        />
      )}

      {activeTab === 'links' && (
        <LinksManager
          linkTitle={linkTitle}
          setLinkTitle={setLinkTitle}
          linkUrl={linkUrl}
          setLinkUrl={setLinkUrl}
          customLinks={customLinks}
          onSubmit={handleAddLink}
          onDelete={handleDeleteLink}
        />
      )}

      {activeTab === 'socials' && (
        <SocialsManager
          platform={platform}
          setPlatform={setPlatform}
          socialUrl={socialUrl}
          setSocialUrl={setSocialUrl}
          socials={socials}
          onSubmit={handleAddSocial}
          onDelete={handleDeleteSocial}
        />
      )}
    </main>
  )
}
