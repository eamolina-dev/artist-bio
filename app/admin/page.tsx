'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import { ProfileForm } from '@/components/admin/ProfileForm'
import { ReleasesManager } from '@/components/admin/ReleasesManager'
import { LinksManager } from '@/components/admin/LinksManager'
import { SocialsManager } from '@/components/admin/SocialsManager'
import { useRouter } from 'next/navigation'
import type { OwnedProfile } from '@/types/app-database'

function OnboardingSetup({
  userId,
  onCreated,
  onLogout,
}: {
  userId: string
  onCreated: () => void
  onLogout: () => void
}) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEditedManually, setSlugEditedManually] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function sanitizeSlug(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  async function handleCreateProfile(e: React.FormEvent) {
    e.preventDefault()
    const cleanName = name.trim()
    const cleanSlug = sanitizeSlug(slug)

    if (!cleanName || !cleanSlug) {
      setError('Completá tu nombre artístico y una URL válida.')
      return
    }

    setSaving(true)
    setError(null)

    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('slug', cleanSlug)
      .maybeSingle()

    if (existing) {
      setError('Ese link ya está ocupado por otro artista. Probá con otro.')
      setSaving(false)
      return
    }

    const { error: insertError } = await supabase.from('profiles').insert({
      user_id: userId,
      name: cleanName,
      slug: cleanSlug,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    onCreated()
  }

  return (
    <main className="min-h-screen bg-[#121316] text-[#e9e5df] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md border border-[#2a2d34] bg-[#18191c] p-6 sm:p-8 rounded-lg space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#a0a0a0]">
              ARTIST-BIO
            </p>
            <h1 className="text-lg font-mono font-bold mt-1">CREÁ TU PERFIL</h1>
            <p className="text-xs font-mono text-[#a0a0a0] mt-1">
              Elegí tu nombre artístico y el link que vas a compartir en tus redes.
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="text-xs font-mono text-red-400 hover:text-red-300 border border-red-900/40 px-2.5 py-1 rounded bg-red-950/20 transition cursor-pointer"
          >
            Salir
          </button>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-300 text-xs font-mono p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateProfile} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-[#a0a0a0] mb-1">NOMBRE ARTÍSTICO / PROYECTO</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                const val = e.target.value
                setName(val)
                if (!slugEditedManually) {
                  setSlug(sanitizeSlug(val))
                }
              }}
              placeholder="Ej: Moli"
              className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-[#a0a0a0] mb-1">TU LINK PERSONALIZADO</label>
            <div className="flex items-center bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 focus-within:border-white">
              <span className="text-[#606871] select-none">artist-bio/</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setSlugEditedManually(true)
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                }}
                placeholder="tu-nombre"
                className="flex-1 bg-transparent text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-white text-black font-bold py-2.5 rounded hover:bg-gray-200 transition cursor-pointer disabled:opacity-50 mt-2"
          >
            {saving ? 'Creando perfil...' : 'Reclamar mi página'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'releases' | 'links' | 'socials'>('profile')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<OwnedProfile | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)

  // Estados Releases
  const [releaseTitle, setReleaseTitle] = useState('')
  const [releaseType, setReleaseType] = useState('single')
  const [releaseYear, setReleaseYear] = useState('2026')
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

  async function loadAdminData(currentUserId?: string) {
    setLoading(true)
    const uid = currentUserId || userId
    if (!uid) {
      setLoading(false)
      return
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle()

    if (profileData) {
      setProfile(profileData)

      // Cargar Releases
      const { data: releasesData } = await supabase
        .from('releases')
        .select('*')
        .eq('profile_id', profileData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (releasesData) setReleases(releasesData)

      // Cargar Custom Links
      const { data: linksData } = await supabase
        .from('custom_links')
        .select('*')
        .eq('profile_id', profileData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (linksData) setCustomLinks(linksData)

      // Cargar Socials
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
  }

  useEffect(() => {
    async function checkAuthAndLoad() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/admin/login')
        return
      }
      setUserId(session.user.id)
      loadAdminData(session.user.id)
    }

    checkAuthAndLoad()
  }, [])

  async function handleCopyLink() {
    if (!profile) return

    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${profile.slug}`)
      setLinkCopied(true)
      window.setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      window.alert('No se pudo copiar el link.')
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
    if (!releaseTitle) return alert('El título es obligatorio')

    try {
      const { error } = await supabase.from('releases').insert([
        {
          profile_id: profile.id,
          title: releaseTitle,
          type: releaseType,
          year: releaseYear,
          spotify_url: spotifyUrl,
          apple_url: appleUrl,
          cover_url: coverUrl,
          is_featured: true,
        },
      ])
      if (error) throw error
      alert('¡Release agregado!')
      setReleaseTitle('')
      setSpotifyUrl('')
      setAppleUrl('')
      setCoverUrl('')
      loadAdminData()
    } catch (err) {
      console.error(err)
      alert('Error al agregar release')
    }
  }

  async function handleDeleteRelease(id: string) {
    if (!confirm('¿Ocultar este release?')) return

    const { error } = await supabase
      .from('releases')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      console.error(error)
      alert('Error al ocultar el release')
    } else {
      setReleases(releases.filter((r) => r.id !== id))
    }
  }

  // --- Handlers Links ---
  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    if (!linkTitle || !linkUrl) return alert('Título y URL requeridos')

    try {
      const { error } = await supabase.from('custom_links').insert([
        {
          profile_id: profile.id,
          label: linkTitle,
          url: linkUrl,
        },
      ])
      if (error) throw error
      alert('¡Link creado!')
      setLinkTitle('')
      setLinkUrl('')
      loadAdminData()
    } catch (err) {
      console.error(err)
      alert('Error al agregar link')
    }
  }

  async function handleDeleteLink(id: string) {
    if (!confirm('¿Eliminar este link?')) return

    const { error } = await supabase
      .from('custom_links')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      alert('Error al eliminar el link')
    } else {
      setCustomLinks(customLinks.filter((l) => l.id !== id))
    }
  }

  // --- Handlers Socials ---
  async function handleAddSocial(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    if (!socialUrl) return alert('La URL de la red social es requerida')

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
      alert('¡Red social agregada!')
      setSocialUrl('')
      loadAdminData()
    } catch (err) {
      console.error(err)
      alert('Error al agregar red social')
    }
  }

  async function handleDeleteSocial(id: string) {
    if (!confirm('¿Eliminar esta red social?')) return

    const { error } = await supabase
      .from('socials')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      alert('Error al eliminar la red social')
    } else {
      setSocials(socials.filter((s) => s.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121316] text-[#e9e5df] flex items-center justify-center font-mono text-sm">
        Cargando Panel Admin...
      </div>
    )
  }

  if (!profile && userId) {
    return (
      <OnboardingSetup
        userId={userId}
        onCreated={() => loadAdminData(userId)}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <main className="min-h-screen bg-[#121316] text-[#e9e5df] p-6 max-w-2xl mx-auto font-sans">
      <header className="flex items-center justify-between border-b border-[#2a2d34] pb-4 mb-8">
        <div>
          <h1 className="text-xl font-bold font-mono">ADMIN PANEL</h1>
          <p className="text-xs text-[#a0a0a0] font-mono">Gestión de contenido para @{profile?.slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/${profile?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[#a0a0a0] hover:text-white border border-[#2a2d34] px-3 py-1.5 rounded transition"
          >
            ← Ver Bio
          </a>
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-xs font-mono text-[#a0a0a0] hover:text-white border border-[#2a2d34] px-3 py-1.5 rounded transition cursor-pointer"
          >
            {linkCopied ? 'Copiado' : 'Copiar link'}
          </button>
          <button
            onClick={handleLogout}
            className="text-xs font-mono text-red-400 hover:text-red-300 border border-red-900/40 px-3 py-1.5 rounded bg-red-950/20 transition cursor-pointer"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 font-mono text-xs border-b border-[#2a2d34] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-1.5 rounded cursor-pointer ${activeTab === 'profile' ? 'bg-white text-black font-bold' : 'text-[#a0a0a0] hover:text-white'}`}
        >
          [ Perfil ]
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
          [ Redes ({socials.length}) ]
        </button>
      </div>

      {activeTab === 'profile' && (
        <ProfileForm
          profile={profile}
          onSave={async (updatedFields) => {
            if (!profile) return

            try {
              const { error } = await supabase
                .from('profiles')
                .update(updatedFields)
                .eq('id', profile.id)
              if (error) throw error
              alert('¡Perfil actualizado!')
              loadAdminData()
            } catch (err) {
              console.error(err)
              alert('Error guardando cambios')
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
          spotifyUrl={spotifyUrl}
          setSpotifyUrl={setSpotifyUrl}
          appleUrl={appleUrl}
          setAppleUrl={setAppleUrl}
          coverUrl={coverUrl}
          setCoverUrl={setCoverUrl}
          releases={releases}
          onSubmit={handleAddRelease}
          onDelete={handleDeleteRelease}
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
