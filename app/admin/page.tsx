'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import { ProfileForm } from '@/components/admin/ProfileForm'
import { ReleasesManager } from '@/components/admin/ReleasesManager'
import { LinksManager } from '@/components/admin/LinksManager'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'releases' | 'links'>('profile')
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  // Estados Perfil
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [location, setLocation] = useState('')

  // Estados Releases
  const [releaseTitle, setReleaseTitle] = useState('')
  const [releaseType, setReleaseType] = useState('Single')
  const [releaseYear, setReleaseYear] = useState('2026')
  const [spotifyUrl, setSpotifyUrl] = useState('')
  const [releases, setReleases] = useState<Database['public']['Tables']['releases']['Row'][]>([])

  // Estados Links
  const [linkTitle, setLinkTitle] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [customLinks, setCustomLinks] = useState<Database['public']['Tables']['custom_links']['Row'][]>([])

  async function loadAdminData() {
    setLoading(true)
    const { data: profileData } = await supabase.from('profiles').select('*').single()
    if (profileData) {
      setProfile(profileData)
      setName(profileData.name || '')
      setTagline(profileData.tagline || '')
      setLocation(profileData.location || '')

      const { data: releasesData } = await supabase
        .from('releases')
        .select('*')
        .eq('profile_id', profileData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (releasesData) setReleases(releasesData)

      const { data: linksData } = await supabase
        .from('custom_links')
        .select('*')
        .eq('profile_id', profileData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      console.log('Links Data:', linksData) // Agrega este log para depuración

      if (linksData) setCustomLinks(linksData)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name, tagline, location })
        .eq('handle', 'moli')
      if (error) throw error
      alert('¡Perfil actualizado!')
    } catch (err) {
      console.error(err)
      alert('Error guardando cambios')
    }
  }

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
          is_featured: true,
        },
      ])
      if (error) throw error
      alert('¡Release agregado!')
      setReleaseTitle('')
      setSpotifyUrl('')
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
    if (!confirm('¿Ocultar este link?')) return

    const { error } = await supabase
      .from('custom_links')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      console.error(error)
      alert('Error al ocultar el link')
    } else {
      setCustomLinks(customLinks.filter((l) => l.id !== id))
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
          <p className="text-xs text-[#a0a0a0] font-mono">Gestión de contenido para @{profile?.handle}</p>
        </div>
        <a
          href="/"
          className="text-xs font-mono text-[#a0a0a0] hover:text-white border border-[#2a2d34] px-3 py-1.5 rounded transition"
        >
          ← Ver Bio Pública
        </a>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 font-mono text-xs border-b border-[#2a2d34] pb-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-1.5 rounded ${activeTab === 'profile' ? 'bg-white text-black font-bold' : 'text-[#a0a0a0] hover:text-white'}`}
        >
          [ Perfil ]
        </button>
        <button
          onClick={() => setActiveTab('releases')}
          className={`px-3 py-1.5 rounded ${activeTab === 'releases' ? 'bg-white text-black font-bold' : 'text-[#a0a0a0] hover:text-white'}`}
        >
          [ Releases ({releases.length}) ]
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`px-3 py-1.5 rounded ${activeTab === 'links' ? 'bg-white text-black font-bold' : 'text-[#a0a0a0] hover:text-white'}`}
        >
          [ Links ({customLinks.length}) ]
        </button>
      </div>

      {activeTab === 'profile' && (
        <ProfileForm
          name={name}
          setName={setName}
          tagline={tagline}
          setTagline={setTagline}
          location={location}
          setLocation={setLocation}
          onSubmit={handleSaveProfile}
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
    </main>
  )
}
