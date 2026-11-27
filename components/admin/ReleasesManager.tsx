'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/upload-image'
import { Database } from '@/types/supabase'
import {
  EMPTY_RELEASE_URLS,
  isUrlFromDomains,
  normalizeUrl,
  RELEASE_PLATFORMS,
  ReleaseUrls,
  ReleasePlatformField,
} from '@/lib/platforms'

export function ReleasesManager({
  releaseTitle,
  setReleaseTitle,
  releaseType,
  setReleaseType,
  // releaseYear,
  // setReleaseYear,
  releaseDate,
  setReleaseDate,
  releaseUrls,
  setReleaseUrls,
  setReleaseUrl,
  isUpcoming,
  setIsUpcoming,
  setCoverUrl,
  releases,
  customLinks,
  onSubmit,
  onToggleActive,
  onToggleFeatured,
  onDelete,
}: {
  releaseTitle: string
  setReleaseTitle: (v: string) => void
  releaseType: string
  setReleaseType: (v: string) => void
  // releaseYear: string
  // setReleaseYear: (v: string) => void
  releaseDate: string
  setReleaseDate: (v: string) => void
  releaseUrls: ReleaseUrls
  setReleaseUrls: (v: ReleaseUrls) => void
  setReleaseUrl: (field: ReleasePlatformField, value: string) => void
  isUpcoming: boolean
  setIsUpcoming: (v: boolean) => void
  setCoverUrl: (v: string) => void
  releases: Database['public']['Tables']['releases']['Row'][]
  customLinks: Database['public']['Tables']['custom_links']['Row'][]
  onSubmit: (e: React.FormEvent) => void
  onToggleActive: (id: string, isActive: boolean) => Promise<void>
  onToggleFeatured: (id: string, isFeatured: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [uploading, setUploading] = useState(false)
  const [updatingFeaturedId, setUpdatingFeaturedId] = useState<string | null>(null)
  const [updatingActiveId, setUpdatingActiveId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const urls = isUpcoming
      ? []
      : RELEASE_PLATFORMS
          .map(({ field }) => ({ field, url: releaseUrls[field].trim() }))
          .filter(({ url }) => url)

    if (!isUpcoming && urls.length === 0) {
      alert('Add at least one platform URL or mark this as an upcoming release.')
      return
    }

    for (const { field, url } of urls) {
      const platform = RELEASE_PLATFORMS.find((item) => item.field === field)
      if (platform && !isUrlFromDomains(url, platform.domains)) {
        alert(`${platform.label} URL must belong to ${platform.domains.join(' or ')}.`)
        return
      }
    }

    const existingUrls = [
      ...customLinks.map((link) => link.url),
      ...releases.flatMap((release) =>
        RELEASE_PLATFORMS.map(({ field }) => release[field]),
      ),
    ].filter((url): url is string => Boolean(url))
    const normalizedUrls = urls.map(({ url }) => normalizeUrl(url))
    if (
      new Set(normalizedUrls).size !== normalizedUrls.length ||
      normalizedUrls.some((url) => existingUrls.some((existing) => normalizeUrl(existing) === url))
    ) {
      alert('This URL has already been added to your links or releases.')
      return
    }

    onSubmit(e)
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const url = await uploadImage(file, 'releases')
    if (url) setCoverUrl(url)
    else alert('Could not upload the release artwork.')
    setUploading(false)
  }

  async function handleToggleFeatured(id: string, isFeatured: boolean) {
    setUpdatingFeaturedId(id)
    try {
      await onToggleFeatured(id, isFeatured)
    } finally {
      setUpdatingFeaturedId(null)
    }
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    setUpdatingActiveId(id)
    try {
      await onToggleActive(id, isActive)
    } finally {
      setUpdatingActiveId(null)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 font-sans">
      {/* New release form */}
      <form onSubmit={handleSubmit} className="space-y-4 border border-[#2a2d34] p-5 rounded-lg bg-[#18191c]">
        <h2 className="text-sm font-mono text-[#a0a0a0] mb-2">[ New release ]</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#a0a0a0] mb-1">TITLE</label>
            <input
              type="text"
              placeholder="e.g. Horizon EP"
              value={releaseTitle}
              onChange={(e) => setReleaseTitle(e.target.value)}
              className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-[#a0a0a0] mb-1">TYPE</label>
            <select
              value={releaseType}
              onChange={(e) => setReleaseType(e.target.value)}
              className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
            >
              <option value="single">Single</option>
              <option value="ep">EP</option>
              <option value="album">Album</option>
              <option value="remix">Remix</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#a0a0a0] mb-1">RELEASE DATE</label>
            <input
              type="date"
              required
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-[#a0a0a0] mb-1">COVER ART</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              disabled={uploading}
              className="text-xs text-[#a0a0a0] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-mono file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer"
            />
            {uploading && <span className="text-xs text-yellow-400 font-mono">Uploading...</span>}
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs font-mono text-[#e2d9cc]">
          <input
            type="checkbox"
            checked={isUpcoming}
            onChange={(e) => {
              setIsUpcoming(e.target.checked)
              if (e.target.checked) setReleaseUrls(EMPTY_RELEASE_URLS)
            }}
            className="mt-0.5 accent-[#e2d9cc]"
          />
          <span>Upcoming release (Coming soon — no links required)</span>
        </label>

        {!isUpcoming && (
          <div className="grid grid-cols-2 gap-4">
            {RELEASE_PLATFORMS.map((platform) => (
              <div key={platform.field}>
                <label className="block text-xs font-mono text-[#a0a0a0] mb-1">
                  {platform.label.toUpperCase()} URL
                </label>
                <input
                  type="url"
                  placeholder={platform.placeholder}
                  value={releaseUrls[platform.field]}
                  onChange={(e) => setReleaseUrl(platform.field, e.target.value)}
                  className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-white text-black font-mono text-xs font-bold py-2.5 rounded hover:bg-gray-200 transition cursor-pointer mt-2"
        >
          Add release
        </button>
      </form>

      {/* Existing releases */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono text-[#a0a0a0]">[ Releases ]</h3>
        {releases.map((rel) => (
          <div key={rel.id} className={`flex flex-wrap items-center justify-between gap-3 border border-[#2a2d34] p-3 rounded bg-[#18191c] ${rel.is_active ? '' : 'opacity-60'}`}>
            <div className="flex items-center gap-3">
              {rel.cover_url && (
                <img src={rel.cover_url} alt={rel.title} className="size-10 rounded object-cover border border-[#2a2d34]" />
              )}
              <div>
                <p className="text-sm font-bold text-white">
                  {rel.title}{' '}
                  <span className="text-xs text-[#a0a0a0] font-mono font-normal">({rel.release_date || rel.year})</span>
                  {!rel.is_active && (
                    <span className="ml-2 rounded border border-[#a0a0a0]/30 px-1.5 py-0.5 text-[10px] font-mono font-normal text-[#a0a0a0]">
                      Hidden
                    </span>
                  )}
                </p>
                <p className="text-xs text-[#a0a0a0] uppercase font-mono">{rel.type}</p>
                {rel.is_upcoming ? (
                  <span className="mt-1 inline-block rounded border border-amber-200/20 px-1.5 py-0.5 text-[9px] font-mono text-amber-200/80">
                    COMING SOON
                  </span>
                ) : (
                  <div className="mt-1 flex flex-wrap gap-2 font-mono text-[10px]">
                    {RELEASE_PLATFORMS.map(({ field, label }) => {
                      const url = rel[field]
                      return url ? (
                        <a
                          key={field}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#a0a0a0] underline-offset-2 hover:text-white hover:underline"
                        >
                          {label}
                        </a>
                      ) : null
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void handleToggleFeatured(rel.id, !rel.is_featured)}
                disabled={updatingFeaturedId !== null}
                aria-pressed={rel.is_featured === true}
                className="text-xs font-mono text-[#e2d9cc] hover:text-white border border-[#e2d9cc]/30 px-2 py-1 rounded transition disabled:opacity-50"
              >
                {rel.is_featured ? '★ Featured' : '☆ Pin as featured'}
              </button>
              <button
                type="button"
                onClick={() => void handleToggleActive(rel.id, !rel.is_active)}
                disabled={updatingActiveId !== null}
                className={`text-xs font-mono border px-2 py-1 rounded transition disabled:opacity-50 ${rel.is_active ? 'text-red-400 hover:text-red-300 border-red-900/50' : 'text-green-400 hover:text-green-300 border-green-900/50'}`}
              >
                {rel.is_active ? 'Hide' : 'Show'}
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(rel.id)}
                disabled={deletingId !== null}
                className="text-xs font-mono text-red-400 hover:text-red-300 border border-red-900/50 px-2 py-1 rounded transition disabled:opacity-50"
              >
                {deletingId === rel.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
