'use client'

import React from 'react'
import { Database } from '@/types/supabase'

type Release = Database['public']['Tables']['releases']['Row']

interface ReleasesManagerProps {
  releaseTitle: string
  setReleaseTitle: (val: string) => void
  releaseType: string
  setReleaseType: (val: string) => void
  releaseYear: string
  setReleaseYear: (val: string) => void
  spotifyUrl: string
  setSpotifyUrl: (val: string) => void
  releases: Release[]
  onSubmit: (e: React.FormEvent) => void
  onDelete: (id: string) => void
}

export function ReleasesManager({
  releaseTitle,
  setReleaseTitle,
  releaseType,
  setReleaseType,
  releaseYear,
  setReleaseYear,
  spotifyUrl,
  setSpotifyUrl,
  releases,
  onSubmit,
  onDelete,
}: ReleasesManagerProps) {
  return (
    <div className="space-y-8 font-mono text-sm">
      <form onSubmit={onSubmit} className="space-y-4 border-b border-[#2a2d34] pb-6">
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
          className="w-full bg-white text-black font-bold py-2.5 rounded mt-2 hover:bg-[#d0d0d0] transition"
        >
          Agregar Release
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-xs text-[#a0a0a0] font-bold uppercase tracking-wider">Releases Existentes</h2>
        {releases.length === 0 ? (
          <p className="text-xs text-[#666]">No hay releases cargados.</p>
        ) : (
          releases.map((rel) => (
            <div key={rel.id} className="flex items-center justify-between bg-[#1a1b1f] border border-[#2a2d34] p-3 rounded">
              <div>
                <p className="font-bold text-white text-xs">{rel.title}</p>
                <p className="text-[10px] text-[#a0a0a0]">{rel.type} • {rel.year}</p>
              </div>
              <button
                onClick={() => onDelete(rel.id)}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-900/40 rounded bg-red-950/20"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
