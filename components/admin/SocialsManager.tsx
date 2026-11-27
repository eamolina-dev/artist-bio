'use client'

import React from 'react'
import { Database } from '@/types/supabase'
import { isUrlFromDomains, SOCIAL_PLATFORMS, sortSocials } from '@/lib/platforms'

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
  const currentPlatform =
    SOCIAL_PLATFORMS.find((p) => p.id === platform) ?? SOCIAL_PLATFORMS[0]
  const supportedSocials = sortSocials(socials)
  const sortedSocials = [
    ...supportedSocials,
    ...socials.filter(
      (social) =>
        !SOCIAL_PLATFORMS.some((item) => item.id === social.platform.trim().toLowerCase()),
    ),
  ]
  const addedPlatforms = new Set(socials.map((social) => social.platform.trim().toLowerCase()))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (addedPlatforms.has(platform)) {
      alert(`${currentPlatform.label} has already been added.`)
      return
    }

    if (socialUrl && !isUrlFromDomains(socialUrl, currentPlatform.domains)) {
      const expectedDomains = currentPlatform.domains.join(' or ')
      alert(`${currentPlatform.label} URL must belong to ${expectedDomains}.`)
      return
    }

    onSubmit(e)
  }

  return (
    <div className="space-y-8 font-mono text-sm">
      <form onSubmit={handleSubmit} className="space-y-4 border-b border-[#2a2d34] pb-6">
        <h2 className="text-xs text-[#a0a0a0] font-bold uppercase tracking-wider mb-2">
          Add social profile
        </h2>

        <div>
          <label className="block text-xs text-[#a0a0a0] mb-1">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-[#1a1b1f] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
          >
            {SOCIAL_PLATFORMS.map((item) => {
              const isAdded = addedPlatforms.has(item.id)
              return (
                <option key={item.id} value={item.id} disabled={isAdded}>
                  {item.label}{isAdded ? ' (Added)' : ''}
                </option>
              )
            })}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[#a0a0a0] mb-1">Social profile URL</label>
          <input
            type="url"
            placeholder={currentPlatform.placeholder}
            value={socialUrl}
            onChange={(e) => setSocialUrl(e.target.value)}
            className="w-full bg-[#1a1b1f] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-white text-black font-bold py-2.5 rounded mt-2 hover:bg-[#d0d0d0] transition cursor-pointer"
        >
          Add social profile
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-xs text-[#a0a0a0] font-bold uppercase tracking-wider">
          Your social profiles
        </h2>
        {sortedSocials.length === 0 ? (
          <p className="text-xs text-[#666]">No social profiles added yet.</p>
        ) : (
          sortedSocials.map((social) => {
            const matchedPlatform = SOCIAL_PLATFORMS.find((p) => p.id === social.platform)
            return (
              <div
                key={social.id}
                className="flex items-center justify-between bg-[#1a1b1f] border border-[#2a2d34] p-3 rounded"
              >
                <div className="overflow-hidden pr-2">
                  <p className="font-bold text-white text-xs uppercase">
                    {matchedPlatform?.label ?? social.platform}
                  </p>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#a0a0a0] hover:underline truncate block"
                  >
                    {social.url}
                  </a>
                </div>
                <button
                  onClick={() => onDelete(social.id)}
                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-900/40 rounded bg-red-950/20 shrink-0 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
