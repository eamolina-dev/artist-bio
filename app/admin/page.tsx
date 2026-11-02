'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'releases' | 'links'>('profile')
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  // Estados de formularios
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [location, setLocation] = useState('')

  const [releaseTitle, setReleaseTitle] = useState('')
  const [releaseType, setReleaseType] = useState('Single')
  // const [releaseYear, setReleaseYear] = useState(new Date().getFullYear().toString())
  const [releaseYear, setReleaseYear] = useState('2026') // Valor por defecto a 2026 para evitar errores de validación
  const [spotifyUrl, setSpotifyUrl] = useState('')

  const [linkTitle, setLinkTitle] = useState('')
  const [linkUrl, setLinkUrl] = useState('')

  // Cargar datos actuales
  useEffect(() => {
    async function loadAdminData() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('handle', 'moli')
          .single()

        if (error) throw error
        if (data) {
          setProfile(data)
          setName(data.name || '')
          setTagline(data.tagline || '')
          setLocation(data.location || '')
        }
      } catch (err) {
        console.error('Error cargando perfil:', err)
      } finally {
        setLoading(false)
      }
    }
    loadAdminData()
  }, [])

  // Guardar Cambios de Perfil
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
      console.error('Error al actualizar:', err)
      alert('Error guardando cambios')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121316] text-[#e9e5df] flex items-center justify-center font-mono text-sm">
        Cargando Panel Admin...
      </div>
    )
  }

  async function handleAddRelease(e: React.FormEvent) {
    e.preventDefault()
    if (!releaseTitle) return alert('El título es obligatorio')

    try {
      const { error } = await supabase
        .from('releases')
        .insert([
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
      alert('¡Release agregado con éxito!')
      setReleaseTitle('')
      setSpotifyUrl('')
    } catch (err) {
      console.error('Error al guardar release:', err)
      alert('Error al agregar el release')
    }
  }

  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault()
    if (!linkTitle || !linkUrl) return alert('Título y URL son requeridos')

    try {
      const { error } = await supabase
        .from('custom_links')
        .insert([
          {
            profile_id: profile.id,
            title: linkTitle,
            url: linkUrl,
            is_active: true,
          },
        ])

      if (error) throw error
      alert('¡Link creado!')
      setLinkTitle('')
      setLinkUrl('')
    } catch (err) {
      console.error('Error al agregar link:', err)
      alert('Error al agregar link')
    }
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
          [ Releases ]
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`px-3 py-1.5 rounded ${activeTab === 'links' ? 'bg-white text-black font-bold' : 'text-[#a0a0a0] hover:text-white'}`}
        >
          [ Links ]
        </button>
      </div>

      {/* Formulario Perfil */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-4 font-mono text-sm">
          <div>
            <label className="block text-xs text-[#a0a0a0] mb-1">Nombre de Artista</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1a1b1f] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-xs text-[#a0a0a0] mb-1">Tagline / Subtítulo</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[#1a1b1f] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-xs text-[#a0a0a0] mb-1">Ubicación</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#1a1b1f] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-2.5 rounded mt-4 hover:bg-[#d0d0d0] transition"
          >
            Guardar Cambios
          </button>
        </form>
      )}

      {activeTab === 'releases' && (
        <form onSubmit={handleAddRelease} className="space-y-4 font-mono text-sm">
          <h2 className="text-xs text-[#a0a0a0] font-bold uppercase tracking-wider mb-2">Agregar Nuevo Release</h2>

          <div>
            <label className="block text-xs text-[#a0a0a0] mb-1">Título del Track / EP</label>
            <input
              type="text"
              placeholder="ej. Horizon Line"
              value={releaseTitle}
              onChange={(e) => setReleaseTitle(e.target.value)}
              className="w-full bg-[#1a1b1f] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#a0a0a0] mb-1">Tipo</label>
              <select
                value={releaseType}
                onChange={(e) => setReleaseType(e.target.value)}
                className="w-full bg-[#1a1b1f] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
              >
                <option value="Single">Single</option>
                <option value="EP">EP</option>
                <option value="Album">Album</option>
                <option value="Remix">Remix</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#a0a0a0] mb-1">Año</label>
              <input
                type="text"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                className="w-full bg-[#1a1b1f] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#a0a0a0] mb-1">Link de Spotify / Soundcloud</label>
            <input
              type="url"
              placeholder="https://open.spotify.com/track/..."
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              className="w-full bg-[#1a1b1f] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-2.5 rounded mt-4 hover:bg-[#d0d0d0] transition"
          >
            Agregar Release
          </button>
        </form>
      )}

      {activeTab === 'links' && (
        <form onSubmit={handleAddLink} className="space-y-4 font-mono text-sm">
          <h2 className="text-xs text-[#a0a0a0] font-bold uppercase tracking-wider mb-2">Agregar Link Personalizado</h2>

          <div>
            <label className="block text-xs text-[#a0a0a0] mb-1">Etiqueta del Botón</label>
            <input
              type="text"
              placeholder="ej. Presave Nuevo Single"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              className="w-full bg-[#1a1b1f] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-xs text-[#a0a0a0] mb-1">URL de Destino</label>
            <input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full bg-[#1a1b1f] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-2.5 rounded mt-4 hover:bg-[#d0d0d0] transition"
          >
            Agregar Link
          </button>
        </form>
      )}
    </main>
  )
}
