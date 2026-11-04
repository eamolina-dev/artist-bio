'use client'

import { useState, useEffect } from 'react'
import { uploadImage } from '@/lib/upload-image'
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

export function ProfileForm({
  profile,
  onSave,
}: {
  profile: Profile | null
  onSave: (updatedFields: Partial<Profile>) => Promise<void>
}) {
  const [name, setName] = useState(profile?.name || '')
  const [tagline, setTagline] = useState(profile?.tagline || '')
  const [location, setLocation] = useState(profile?.location || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [coverUrl, setCoverUrl] = useState(profile?.cover_url || '')

  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [saving, setSaving] = useState(false)

  // Sincronizar si el perfil cambia al cargar la página
  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setTagline(profile.tagline || '')
      setLocation(profile.location || '')
      setAvatarUrl(profile.avatar_url || '')
      setCoverUrl(profile.cover_url || '')
    }
  }, [profile])

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    const url = await uploadImage(file, 'avatars')
    if (url) setAvatarUrl(url)
    else alert('Error al subir el avatar')
    setUploadingAvatar(false)
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCover(true)
    const url = await uploadImage(file, 'covers')
    if (url) setCoverUrl(url)
    else alert('Error al subir la portada')
    setUploadingCover(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSave({
      name,
      tagline,
      location,
      avatar_url: avatarUrl,
      cover_url: coverUrl,
    })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      <div className="space-y-4 border border-[#2a2d34] p-5 rounded-lg bg-[#18191c]">
        <h2 className="text-sm font-mono text-[#a0a0a0] mb-2">[ Configuración de Identidad ]</h2>

        <div>
          <label className="block text-xs font-mono text-[#a0a0a0] mb-1">NOMBRE ARTÍSTICO</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-[#a0a0a0] mb-1">TAGLINE (Frase corta)</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-[#a0a0a0] mb-1">UBICACIÓN</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
          />
        </div>

        {/* Avatar Upload */}
        <div>
          <label className="block text-xs font-mono text-[#a0a0a0] mb-1">FOTO DE PERFIL (Avatar)</label>
          <div className="flex items-center gap-4">
            {avatarUrl && (
              <img src={avatarUrl} alt="Avatar preview" className="size-12 rounded-full object-cover border border-[#2a2d34]" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
              className="text-xs text-[#a0a0a0] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-mono file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer"
            />
          </div>
          {uploadingAvatar && <p className="text-xs font-mono text-yellow-400 mt-1">Subiendo avatar...</p>}
        </div>

        {/* Cover Upload */}
        <div>
          <label className="block text-xs font-mono text-[#a0a0a0] mb-1">IMAGEN DE PORTADA (Cover)</label>
          <div className="space-y-2">
            {coverUrl && (
              <img src={coverUrl} alt="Cover preview" className="w-full h-24 rounded object-cover border border-[#2a2d34]" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              disabled={uploadingCover}
              className="text-xs text-[#a0a0a0] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-mono file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer"
            />
          </div>
          {uploadingCover && <p className="text-xs font-mono text-yellow-400 mt-1">Subiendo portada...</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-white text-black font-mono text-xs font-bold py-2.5 rounded hover:bg-gray-200 transition cursor-pointer disabled:opacity-50"
      >
        {saving ? 'Guardando...' : 'Guardar Cambios de Perfil'}
      </button>
    </form>
  )
}
