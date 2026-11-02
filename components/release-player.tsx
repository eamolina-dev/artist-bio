'use client'

import { useState } from 'react'
import { Apple, Music2, Play } from 'lucide-react'
import { Release } from '@/types/artist'

function Waveform({ isPlaying }: { isPlaying: boolean }) {
  const bars = [12, 20, 28, 16, 34, 24, 39, 20, 30, 44, 26, 17, 32, 24, 38, 18, 27, 42, 24, 14, 29, 36, 21, 31, 17, 25, 40, 20, 30, 18, 34, 22, 28, 16, 38, 26, 19, 30, 22, 15]
  return (
    <div className="flex h-10 items-center gap-[3px]" aria-label="Audio waveform visualization">
      {bars.map((height, index) => (
        <span
          key={index}
          className={`w-[3px] rounded-full transition-colors duration-300 ${
            isPlaying && index < 13 ? 'bg-[#e2d9cc]' : 'bg-[#6c737b]'
          }`}
          style={{ height }}
        />
      ))}
    </div>
  )
}

export function ReleasePlayer({ release }: { release: Release }) {
  if (!release) return null;

  const [playing, setPlaying] = useState(false)

  return (
    <div className="mt-7">
      <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#737c85]">
        Latest release
      </h2>
      <div className="mt-3 rounded-2xl border border-white/[0.08] bg-[#20242a] p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#b9a894] via-[#656a71] to-[#272b31] shadow-inner">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#f1ebe2] text-center leading-tight">
              {release.title.replace(' ', '\n')}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.16em] text-[#737c86]">
              {release.type} · {release.year}
            </p>
            <p className="mt-1 truncate font-medium">{release.title}</p>
          </div>
          <button
            onClick={() => setPlaying(!playing)}
            className="flex size-10 items-center justify-center rounded-full bg-[#e2d9cc] text-[#24201d] transition hover:bg-white"
            aria-label={playing ? 'Pause track' : 'Play track'}
          >
            {playing ? (
              <span className="flex gap-1">
                <i className="h-4 w-1 rounded-full bg-current" />
                <i className="h-4 w-1 rounded-full bg-current" />
              </span>
            ) : (
              <Play className="ml-0.5 size-4 fill-current" />
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="font-mono text-[10px] text-[#9098a1]">
            {playing ? '01:12' : '00:00'}
          </span>
          <Waveform isPlaying={playing} />
          <span className="font-mono text-[10px] text-[#9098a1]">{release.duration}</span>
        </div>

        <div className="mt-3 flex gap-2">
          {release.spotifyUrl && (
            <a
              href={release.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-[11px] text-[#b3bac0] transition hover:border-white/25 hover:text-white"
            >
              <Music2 className="size-3.5" /> Spotify
            </a>
          )}
          {release.appleUrl && (
            <a
              href={release.appleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-[11px] text-[#b3bac0] transition hover:border-white/25 hover:text-white"
            >
              <Apple className="size-3.5" /> Apple Music
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
