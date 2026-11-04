'use client'

import React from 'react'
import { Database } from '@/types/supabase'

type Social = Database['public']['Tables']['socials']['Row']

interface SocialsManagerProps {
  platform: string
  setPlatform: (val: string) => void
  socialUrl: string
  setSocialUrl: (val: string) => void
  socials: Social[]
  onSubmit: (e: React.FormEvent) => void
  onDelete: (id: string) => void
}

export function SocialsManager({
  platform,
  setPlatform,
  socialUrl,
  setSocialUrl,
  socials,
  onSubmit,
  onDelete,
}: SocialsManagerProps) {
  return (
    <div className="space-y-8 font-mono text-sm">
      <form onSubmit={onSubmit} className="space-y-4 border-b border-[#2a2d34] pb-6">
        <h2 className="text-xs text-[#a0a0a0] font-bold uppercase tracking-wider mb-2">Agregar Red Social</h2>
        
        <div>
          <label className="block text-xs text-[#a0a0a0] mb-1">Plataforma</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-[#1a1b1f] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
          >
            <option value="spotify">Spotify</option>
            <option value="apple">Apple Music</option>
            <option value="soundcloud">SoundCloud</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-[#a0a0a0] mb-1">URL de la Red Social</label>
          <input
            type="url"
            placeholder="https://spotify.com/artist/..."
            value={socialUrl}
            onChange={(e) => setSocialUrl(e.target.value)}
            className="w-full bg-[#1a1b1f] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-white text-black font-bold py-2.5 rounded mt-2 hover:bg-[#d0d0d0] transition cursor-pointer"
        >
          Agregar Red Social
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-xs text-[#a0a0a0] font-bold uppercase tracking-wider">Redes Configuradas</h2>
        {socials.length === 0 ? (
          <p className="text-xs text-[#666]">No hay redes sociales cargadas.</p>
        ) : (
          socials.map((social) => (
            <div key={social.id} className="flex items-center justify-between bg-[#1a1b1f] border border-[#2a2d34] p-3 rounded">
              <div className="overflow-hidden pr-2">
                <p className="font-bold text-white text-xs uppercase">{social.platform}</p>
                <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#a0a0a0] hover:underline truncate block">
                  {social.url}
                </a>
              </div>
              <button
                onClick={() => onDelete(social.id)}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-900/40 rounded bg-red-950/20 shrink-0 cursor-pointer"
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
