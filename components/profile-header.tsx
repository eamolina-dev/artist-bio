import { Check, Disc3, MapPin, SlidersHorizontal } from 'lucide-react'

interface ProfileHeaderProps {
  name: string
  tagline: string
  location: string
  isVerified: boolean
  coverUrl?: string | null
  avatarUrl?: string | null     // <-- Agregamos la URL del avatar
  avatarInitials: string       // <-- Mantenemos las iniciales como fallback
  onToggleCustomizer?: () => void
}

export function ProfileHeader({
  name,
  tagline,
  location,
  isVerified,
  coverUrl,
  avatarUrl,
  avatarInitials,
  onToggleCustomizer,
}: ProfileHeaderProps) {
  return (
    <>
      <div className="relative h-[205px] overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`${name} cover`}
            className="h-full w-full object-cover object-center opacity-85"
          />
        ) : (
          <div className="h-full w-full bg-neutral-900" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#121316]/15 via-transparent to-[#181b20]" />
        
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-[#121316]/35 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#d5d0c8] backdrop-blur-md">
          <Disc3 className="size-3" /> Artist page
        </div>

        {onToggleCustomizer && (
          <button
            onClick={onToggleCustomizer}
            className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full border border-white/15 bg-[#121316]/35 text-[#d5d0c8] backdrop-blur-md"
            aria-label="Open theme controls"
          >
            <SlidersHorizontal className="size-4" />
          </button>
        )}
      </div>

      <div className="px-5">
        <div className="flex items-end justify-between">
          {/* Avatar con fallback dinámico a iniciales */}
          <div className="flex size-[76px] items-center justify-center rounded-full border-4 border-[#181b20] bg-[#b8a38c] text-2xl font-semibold tracking-[-0.08em] text-[#27211c] overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span>{avatarInitials}</span>
            )}
          </div>

          {isVerified && (
            <span className="mb-2 flex items-center gap-1.5 rounded-full border border-[#e2d9cc]/20 bg-[#e2d9cc]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#e2d9cc]">
              <Check className="size-3" /> Verified
            </span>
          )}
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-[30px] font-semibold leading-none tracking-[-0.06em]">
              {name}
            </h1>
            <p className="mt-2 text-sm text-[#9299a1]">{tagline}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#9299a1]">
            <MapPin className="size-3.5" /> {location}
          </div>
        </div>
      </div>
    </>
  )
}
