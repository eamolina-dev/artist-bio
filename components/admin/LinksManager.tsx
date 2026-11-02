'use client'

import React from 'react'
import { Database } from '@/types/supabase'

type CustomLink = Database['public']['Tables']['custom_links']['Row']

interface LinksManagerProps {
  linkTitle: string
  setLinkTitle: (val: string) => void
  linkUrl: string
  setLinkUrl: (val: string) => void
  customLinks: CustomLink[]
  onSubmit: (e: React.FormEvent) => void
  onDelete: (id: string) => void
}

export function LinksManager({
  linkTitle,
  setLinkTitle,
  linkUrl,
  setLinkUrl,
  customLinks,
  onSubmit,
  onDelete,
}: LinksManagerProps) {
  return (
    <div className="space-y-8 font-mono text-sm">
      <form onSubmit={onSubmit} className="space-y-4 border-b border-[#2a2d34] pb-6">
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
          className="w-full bg-white text-black font-bold py-2.5 rounded mt-2 hover:bg-[#d0d0d0] transition"
        >
          Agregar Link
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-xs text-[#a0a0a0] font-bold uppercase tracking-wider">Links Existentes</h2>
        {customLinks.length === 0 ? (
          <p className="text-xs text-[#666]">No hay links cargados.</p>
        ) : (
          customLinks.map((link) => (
            <div key={link.id} className="flex items-center justify-between bg-[#1a1b1f] border border-[#2a2d34] p-3 rounded">
              <div className="overflow-hidden pr-2">
                <p className="font-bold text-white text-xs truncate">{link.label}</p>
                <a href={link.url} target="_blank" className="text-[10px] text-[#a0a0a0] hover:underline truncate block">
                  {link.url}
                </a>
              </div>
              <button
                onClick={() => onDelete(link.id)}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-900/40 rounded bg-red-950/20 shrink-0"
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
