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
  const [savedValues, setSavedValues] = useState({
    name: profile.name,
    slug: profile.slug,
    tagline: profile.tagline || '',
    location: profile.location || '',
    avatar_url: profile.avatar_url || '',
    cover_url: profile.cover_url || '',
  })

  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [avatarFeedback, setAvatarFeedback] = useState('')
  const [coverFeedback, setCoverFeedback] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    setAvatarFeedback('')
    try {
      const url = await uploadImage(file, 'avatars')
      if (!url) {
        alert('Could not upload the profile photo.')
        return
      }

      setAvatarUrl(url)
      setAvatarFeedback('Avatar uploaded — save profile to apply')
      window.setTimeout(() => setAvatarFeedback(''), 2000)
    } catch (err) {
      console.error(err)
      alert('Could not update the profile photo.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCover(true)
    setCoverFeedback('')
    try {
      const url = await uploadImage(file, 'covers')
      if (!url) {
        alert('Could not upload the cover image.')
        return
      }

      setCoverUrl(url)
      setCoverFeedback('Cover uploaded — save profile to apply')
      window.setTimeout(() => setCoverFeedback(''), 2000)
    } catch (err) {
      console.error(err)
      alert('Could not update the cover image.')
    } finally {
      setUploadingCover(false)
    }
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

    const updatedFields = {
      name,
      slug: cleanSlug,
      tagline,
      location,
      avatar_url: avatarUrl,
      cover_url: coverUrl,
    }

    try {
      await onSave(updatedFields)
      setSavedValues(updatedFields)
    } catch (err) {
      console.error(err)
      alert('Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  const hasUnsavedChanges =
    name !== savedValues.name ||
    sanitizeSlug(slug) !== savedValues.slug ||
    tagline !== savedValues.tagline ||
    location !== savedValues.location ||
    avatarUrl !== savedValues.avatar_url ||
    coverUrl !== savedValues.cover_url

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
          {avatarFeedback && <p className="text-xs font-mono text-emerald-400 mt-1">{avatarFeedback}</p>}
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
          {coverFeedback && <p className="text-xs font-mono text-emerald-400 mt-1">{coverFeedback}</p>}
        </div>
      </div>

      <div className="space-y-2">
        {hasUnsavedChanges && (
          <p role="status" className="text-center text-xs font-mono text-amber-300">
            Unsaved changes — click Save profile to apply
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className={`w-full font-mono text-xs font-bold py-2.5 rounded transition cursor-pointer disabled:opacity-50 ${
            hasUnsavedChanges
              ? 'bg-amber-200 text-black ring-2 ring-amber-300/40 hover:bg-amber-100'
              : 'bg-white text-black hover:bg-gray-200'
          }`}
        >
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </div>
    </form>
  )
}
