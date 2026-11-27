'use client'

import { ExternalLink, Disc3 } from 'lucide-react'
import { Database } from '@/types/supabase'
import { RELEASE_PLATFORMS } from '@/lib/platforms'

type Release = Database['public']['Tables']['releases']['Row']

interface ReleasePlayerProps {
  release: Release
}

function getSpotifyEmbedUrl(url: string | null): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('spotify.com')) {
      // Convierte /track/ID, /album/ID o /playlist/ID en /embed/...
      const cleanPath = parsed.pathname.replace(/^\/intl-[a-z]{2}\//, '/')
      if (cleanPath.startsWith('/embed/')) return `https://open.spotify.com${cleanPath}`
      return `https://open.spotify.com/embed${cleanPath}?utm_source=generator&theme=0`
    }
  } catch {
    return null
  }
  return null
}

export function ReleasePlayer({ release }: ReleasePlayerProps) {
  const spotifyEmbed = getSpotifyEmbedUrl(release.spotify_url)

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#121316]/60 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#9299a1]">
          <Disc3 className="size-3.5 text-[#e2d9cc]" />
          <span>Featured Release · {release.type} ({release.release_date || release.year})</span>
        </div>
      </div>

      {spotifyEmbed && !release.is_upcoming ? (
        <iframe
          src={spotifyEmbed}
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl border-0"
          title={release.title}
        />
      ) : (
        <div className="flex items-center gap-4">
          {release.cover_url ? (
            <img
              src={release.cover_url}
              alt={release.title}
              className="size-16 rounded-xl object-cover border border-white/10"
            />
          ) : (
            <div className="flex size-16 items-center justify-center rounded-xl bg-white/5 text-xs font-mono text-[#606871]">
              COVER
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-[#e9e5df]">{release.title}</h3>
            <p className="text-xs text-[#9299a1] capitalize">
              {release.type} · {release.release_date || release.year}
            </p>
          </div>
          {release.is_upcoming && (
            <span className="shrink-0 rounded border border-amber-200/20 px-2 py-1 font-mono text-[9px] tracking-wide text-amber-200/80">
              COMING SOON
            </span>
          )}
        </div>
      )}
      {!release.is_upcoming && (
        <div className="mt-3 flex flex-wrap gap-2">
          {RELEASE_PLATFORMS.map(({ field, label }) => {
            const url = release[field]
            return url ? (
              <a
                key={field}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-mono text-[#e2d9cc] transition hover:border-[#e2d9cc]/60 hover:text-white"
              >
                {label} <ExternalLink className="size-3" />
              </a>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}
