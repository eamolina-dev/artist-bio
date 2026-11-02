'use client'

import React from 'react'

interface ProfileFormProps {
  name: string
  setName: (val: string) => void
  tagline: string
  setTagline: (val: string) => void
  location: string
  setLocation: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function ProfileForm({
  name,
  setName,
  tagline,
  setTagline,
  location,
  setLocation,
  onSubmit,
}: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 font-mono text-sm">
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
  )
}
