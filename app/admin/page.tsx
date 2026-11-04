'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import { ProfileForm } from '@/components/admin/ProfileForm'
import { ReleasesManager } from '@/components/admin/ReleasesManager'
import { LinksManager } from '@/components/admin/LinksManager'
import { SocialsManager } from '@/components/admin/SocialsManager'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'releases' | 'links' | 'socials'>('profile')
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

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

  async function loadAdminData() {
    setLoading(true)
    const { data: profileData } = await supabase.from('profiles').select('*').single()
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
    }
    setLoading(false)
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  // --- Handlers Releases ---
  async function handleAddRelease(e: React.FormEvent) {
    e.preventDefault()
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

  return (
    <main className="min-h-screen bg-[#121316] text-[#e9e5df] p-6 max-w-2xl mx-auto font-sans">
      <header className="flex items-center justify-between border-b border-[#2a2d34] pb-4 mb-8">
        <div>
          <h1 className="text-xl font-bold font-mono">ADMIN PANEL</h1>
          <p className="text-xs text-[#a0a0a0] font-mono">Gestión de contenido para @{profile?.slug}</p>
        </div>
        <a
          href="/"
          className="text-xs font-mono text-[#a0a0a0] hover:text-white border border-[#2a2d34] px-3 py-1.5 rounded transition"
        >
          ← Ver Bio Pública
        </a>
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
