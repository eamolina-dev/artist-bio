import { Apple, Camera, Disc3, Music2, Video } from 'lucide-react'
import { Social } from '@/types/custom-types'

const iconMap: Record<string, typeof Music2> = {
  spotify: Music2,
  apple: Apple,
  'apple music': Apple,
  youtube: Video,
  instagram: Camera,
  soundcloud: Disc3,
  bandcamp: Music2,
  beatport: Disc3,
  tiktok: Video,
}

const platformLabels: Record<string, string> = {
  spotify: 'Spotify',
  apple: 'Apple Music',
  'apple music': 'Apple Music',
  youtube: 'YouTube',
  instagram: 'Instagram',
  soundcloud: 'SoundCloud',
  bandcamp: 'Bandcamp',
  beatport: 'Beatport',
  tiktok: 'TikTok',
}

export function Socials({ socials }: { socials: Social[] }) {
  if (!socials || socials.length === 0) return null

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {socials.map((social) => {
        const platform = social.platform.trim().toLowerCase()
        const label =
          platformLabels[platform] ||
          platform.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
        const IconComponent = iconMap[platform] || Music2

        return (
          <a
            key={social.id || social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${label} (opens in a new tab)`}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3 text-xs font-medium text-[#e2d9cc] transition hover:border-[#e2d9cc]/60 hover:bg-white/[0.09] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2d9cc]"
          >
            <IconComponent aria-hidden="true" className="size-4 shrink-0" />
            <span>{label}</span>
          </a>
        )
      })}
    </div>
  )
}
