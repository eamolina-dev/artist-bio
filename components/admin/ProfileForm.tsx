'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/upload-image'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

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

export function ProfileForm({
  profile,
  onSave,
}: {
  profile: Profile
  onSave: (updatedFields: ProfileUpdate) => Promise<void>
}) {
  const [name, setName] = useState(profile?.name || '')
  const [slug, setSlug] = useState(profile.slug)
  const [tagline, setTagline] = useState(profile?.tagline || '')
  const [location, setLocation] = useState(profile?.location || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [coverUrl, setCoverUrl] = useState(profile?.cover_url || '')

  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    const url = await uploadImage(file, 'avatars')
    if (url) setAvatarUrl(url)
    else alert('Could not upload the profile photo.')
    setUploadingAvatar(false)
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCover(true)
    const url = await uploadImage(file, 'covers')
    if (url) setCoverUrl(url)
    else alert('Could not upload the cover image.')
    setUploadingCover(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleanSlug = sanitizeSlug(slug)

    if (!cleanSlug) {
      alert('Enter a valid page URL.')
      return
    }

    setSaving(true)
    const { data: existingProfile, error: lookupError } = await supabase
      .from('profiles')
      .select('id')
      .eq('slug', cleanSlug)
      .neq('id', profile.id)
      .maybeSingle()

    if (lookupError) {
      console.error(lookupError)
      alert('Could not check page URL availability.')
      setSaving(false)
      return
    }

    if (existingProfile) {
      alert('That page URL is already taken. Try another one.')
      setSaving(false)
      return
    }

    await onSave({
      name,
      slug: cleanSlug,
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
        <h2 className="text-sm font-mono text-[#a0a0a0] mb-2">[ Profile details ]</h2>

        <div>
          <label className="block text-xs font-mono text-[#a0a0a0] mb-1">ARTIST NAME</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-[#a0a0a0] mb-1">YOUR PAGE URL</label>
          <div className="flex items-center bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 focus-within:border-white">
            <span className="text-[#606871] select-none">artist-bio/</span>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(sanitizeSlug(e.target.value))}
              className="flex-1 bg-transparent text-sm text-white focus:outline-none"
            />
          </div>
          <p className="mt-1 text-[10px] font-mono text-[#606871]">
            Your page: artist-bio/{slug || 'your-name'}
          </p>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#a0a0a0] mb-1">TAGLINE</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-[#a0a0a0] mb-1">LOCATION</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
          />
        </div>

        {/* Avatar Upload */}
        <div>
          <label className="block text-xs font-mono text-[#a0a0a0] mb-1">PROFILE PHOTO</label>
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
          {uploadingAvatar && <p className="text-xs font-mono text-yellow-400 mt-1">Uploading profile photo...</p>}
        </div>

        {/* Cover Upload */}
        <div>
          <label className="block text-xs font-mono text-[#a0a0a0] mb-1">COVER IMAGE</label>
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
          {uploadingCover && <p className="text-xs font-mono text-yellow-400 mt-1">Uploading cover image...</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-white text-black font-mono text-xs font-bold py-2.5 rounded hover:bg-gray-200 transition cursor-pointer disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save profile'}
      </button>
    </form>
  )
}
