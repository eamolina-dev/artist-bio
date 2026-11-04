'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/upload-image'
import { Database } from '@/types/supabase'

export function ReleasesManager({
  releaseTitle,
  setReleaseTitle,
  releaseType,
  setReleaseType,
  releaseYear,
  setReleaseYear,
  spotifyUrl,
  setSpotifyUrl,
  appleUrl,
  setAppleUrl,
  coverUrl,
  setCoverUrl,
  releases,
  onSubmit,
  onDelete,
}: {
  releaseTitle: string
  setReleaseTitle: (v: string) => void
  releaseType: string
  setReleaseType: (v: string) => void
  releaseYear: string
  setReleaseYear: (v: string) => void
  spotifyUrl: string
  setSpotifyUrl: (v: string) => void
  appleUrl: string
  setAppleUrl: (v: string) => void
  coverUrl: string
  setCoverUrl: (v: string) => void
  releases: Database['public']['Tables']['releases']['Row'][]
  onSubmit: (e: React.FormEvent) => void
  onDelete: (id: string) => void
}) {
  const [uploading, setUploading] = useState(false)

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const url = await uploadImage(file, 'releases')
    if (url) setCoverUrl(url)
    else alert('Error al subir la carátula')
    setUploading(false)
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Formulario de Alta */}
      <form onSubmit={onSubmit} className="space-y-4 border border-[#2a2d34] p-5 rounded-lg bg-[#18191c]">
        <h2 className="text-sm font-mono text-[#a0a0a0] mb-2">[ Nuevo Release ]</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#a0a0a0] mb-1">TÍTULO</label>
            <input
              type="text"
              placeholder="Ej. Horizon EP"
              value={releaseTitle}
              onChange={(e) => setReleaseTitle(e.target.value)}
              className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-[#a0a0a0] mb-1">TIPO</label>
            <select
              value={releaseType}
              onChange={(e) => setReleaseType(e.target.value)}
              className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
            >
              <option value="single">Single</option>
              <option value="ep">EP</option>
              <option value="album">Álbum</option>
              <option value="remix">Remix</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#a0a0a0] mb-1">AÑO</label>
            <input
              type="text"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-[#a0a0a0] mb-1">CARÁTULA (Cover Art)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              disabled={uploading}
              className="text-xs text-[#a0a0a0] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-mono file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer"
            />
            {uploading && <span className="text-xs text-yellow-400 font-mono">Subiendo...</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#a0a0a0] mb-1">SPOTIFY URL</label>
            <input
              type="text"
              placeholder="https://spotify.com/..."
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-[#a0a0a0] mb-1">APPLE MUSIC URL</label>
            <input
              type="text"
              placeholder="https://apple.com/..."
              value={appleUrl}
              onChange={(e) => setAppleUrl(e.target.value)}
              className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-white text-black font-mono text-xs font-bold py-2.5 rounded hover:bg-gray-200 transition cursor-pointer mt-2"
        >
          Agregar Release
        </button>
      </form>

      {/* Lista de Releases Existentes */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono text-[#a0a0a0]">[ Releases Activos ]</h3>
        {releases.map((rel) => (
          <div key={rel.id} className="flex items-center justify-between border border-[#2a2d34] p-3 rounded bg-[#18191c]">
            <div className="flex items-center gap-3">
              {rel.cover_url && (
                <img src={rel.cover_url} alt={rel.title} className="size-10 rounded object-cover border border-[#2a2d34]" />
              )}
              <div>
                <p className="text-sm font-bold text-white">{rel.title} <span className="text-xs text-[#a0a0a0] font-mono font-normal">({rel.year})</span></p>
                <p className="text-xs text-[#a0a0a0] uppercase font-mono">{rel.type}</p>
              </div>
            </div>
            <button
              onClick={() => onDelete(rel.id)}
              className="text-xs font-mono text-red-400 hover:text-red-300 border border-red-900/50 px-2 py-1 rounded transition"
            >
              Ocultar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
