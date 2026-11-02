import { ArrowUpRight, Mail, Video } from 'lucide-react'
import { CustomLink } from '@/types/artist'

export function CustomLinks({ links }: { links: CustomLink[] }) {
  if (!links || links.length === 0) return null;
  
  return (
    <div className="mt-7 flex flex-col gap-2">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 text-xs text-[#c4c8cb] transition hover:border-[#e2d9cc]/30 hover:bg-[#e2d9cc]/[0.06] hover:text-[#e2d9cc]"
        >
          <span className="[&>svg]:size-3.5">
            {link.type === 'email' && <Mail />}
            {link.type === 'video' && <Video />}
            {link.type === 'external' && <ArrowUpRight />}
          </span>
          {link.label}
          <ArrowUpRight className="ml-auto mr-2.5 size-3.5 text-[#6f7780]" />
        </a>
      ))}
    </div>
  )
}
