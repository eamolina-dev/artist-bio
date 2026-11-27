import { AtSign, Camera, MessageCircle, Users, Video } from 'lucide-react'
import { Social } from '@/types/custom-types'
import { sortSocials } from '@/lib/platforms'

const iconMap: Record<string, typeof Camera> = {
  youtube: Video,
  instagram: Camera,
  tiktok: Video,
  discord: MessageCircle,
  x: AtSign,
  facebook: Users,
}

const platformLabels: Record<string, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  discord: 'Discord',
  x: 'X',
  facebook: 'Facebook',
}

export function Socials({ socials }: { socials: Social[] }) {
  const orderedSocials = sortSocials(socials || [])
  if (orderedSocials.length === 0) return null

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {orderedSocials.map((social) => {
        const platform = social.platform.trim().toLowerCase()
        const label = platformLabels[platform]
        const IconComponent = iconMap[platform] || Camera

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
