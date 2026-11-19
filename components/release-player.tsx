'use client'

import { ExternalLink, Disc3 } from 'lucide-react'
import { Database } from '@/types/supabase'

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
          <span>Latest Release · {release.type} ({release.year})</span>
        </div>
        {release.apple_url && (
          <a
            href={release.apple_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-mono text-[#9299a1] hover:text-white transition"
          >
            Apple Music <ExternalLink className="size-3" />
          </a>
        )}
      </div>

      {spotifyEmbed ? (
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
        /* Fallback visual si el link no es de Spotify o aún no está cargado */
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
          <div className="flex-1 min-w-0">
            <h3 className="truncate font-medium text-[#e9e5df]">{release.title}</h3>
            <p className="text-xs text-[#9299a1] capitalize">{release.type} · {release.year}</p>
          </div>
          {release.spotify_url && (
            <a
              href={release.spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#e2d9cc] px-4 py-2 text-xs font-medium text-[#121316] hover:bg-white transition"
            >
              Escuchar
            </a>
          )}
        </div>
      )}
    </div>
  )
}
