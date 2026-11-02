import { Apple, Camera, Disc3, Music2, Video } from 'lucide-react'
import { SocialLink } from '@/types/artist'

const iconMap = {
  spotify: Music2,
  apple: Apple,
  youtube: Video,
  instagram: Camera,
  soundcloud: Disc3,
}

export function SocialLinks({ socials }: { socials: SocialLink[] }) {
  if (!socials || socials.length === 0) return null;
  
  return (
    <div className="mt-5 flex gap-2">
      {socials.map((social) => {
        const IconComponent = iconMap[social.platform] || Music2
        return (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#9ca4ad] transition hover:border-[#e2d9cc]/50 hover:text-[#e2d9cc]"
          >
            <IconComponent className="size-4" />
          </a>
        )
      })}
    </div>
  )
}
