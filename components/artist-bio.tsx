'use client'

import { useState } from 'react'
import {
  Apple,
  ArrowUpRight,
  Check,
  ChevronDown,
  Disc3,
  Camera,
  Mail,
  MapPin,
  Music2,
  Play,
  Plus,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Ticket,
  Video,
} from 'lucide-react'

const shows = [
  { date: '08', month: 'NOV', venue: 'Howler', city: 'Melbourne', tag: 'Tickets' },
  { date: '22', month: 'NOV', venue: 'The Lansdowne', city: 'Sydney', tag: 'Tickets' },
  { date: '06', month: 'DEC', venue: 'The Evelyn', city: 'Melbourne', tag: 'Sold out' },
]

function Waveform() {
  const bars = [12, 20, 28, 16, 34, 24, 39, 20, 30, 44, 26, 17, 32, 24, 38, 18, 27, 42, 24, 14, 29, 36, 21, 31, 17, 25, 40, 20, 30, 18, 34, 22, 28, 16, 38, 26, 19, 30, 22, 15]
  return <div className="flex h-10 items-center gap-[3px]" aria-label="Audio waveform visualization">{bars.map((height, index) => <span key={index} className={`w-[3px] rounded-full ${index < 13 ? 'bg-[#e2d9cc]' : 'bg-[#6c737b]'}`} style={{ height }} />)}</div>
}

function SocialButton({ label, children }: { label: string; children: React.ReactNode }) {
  return <button aria-label={label} className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#9ca4ad] transition hover:border-[#e2d9cc]/50 hover:text-[#e2d9cc]">{children}</button>
}

export function ArtistBio() {
  const [playing, setPlaying] = useState(false)
  const [showCustomizer, setShowCustomizer] = useState(false)

  return (
    <main className="min-h-screen overflow-hidden bg-[#121316] px-4 py-6 text-[#e9e5df] sm:px-8 sm:py-10">
      <div className="grain pointer-events-none fixed inset-0 opacity-40" />
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 lg:flex-row lg:items-start lg:justify-center">
        <section className="w-full max-w-[430px] overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#181b20] shadow-2xl shadow-black/20">
          <div className="relative h-[205px] overflow-hidden">
            <img src="/moli-cover.png" alt="MOLI performing in Melbourne" className="h-full w-full object-cover object-center opacity-85" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#121316]/15 via-transparent to-[#181b20]" />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-[#121316]/35 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#d5d0c8] backdrop-blur-md"><Disc3 className="size-3" /> Artist page</div>
            <button onClick={() => setShowCustomizer(!showCustomizer)} className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full border border-white/15 bg-[#121316]/35 text-[#d5d0c8] backdrop-blur-md" aria-label="Open theme controls"><SlidersHorizontal className="size-4" /></button>
          </div>

          <div className="relative -mt-10 px-5 pb-8">
            <div className="flex items-end justify-between">
              <div className="flex size-[76px] items-center justify-center rounded-full border-4 border-[#181b20] bg-[#b8a38c] text-2xl font-semibold tracking-[-0.08em] text-[#27211c]">MO</div>
              <span className="mb-2 flex items-center gap-1.5 rounded-full border border-[#e2d9cc]/20 bg-[#e2d9cc]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#e2d9cc]"><Check className="size-3" /> Verified</span>
            </div>
            <div className="mt-3 flex items-start justify-between gap-4">
              <div><h1 className="font-display text-[30px] font-semibold leading-none tracking-[-0.06em]">MOLI</h1><p className="mt-2 text-sm text-[#9299a1]">Melodic &amp; Progressive House Producer</p></div>
              <div className="flex items-center gap-1.5 text-xs text-[#9299a1]"><MapPin className="size-3.5" /> Melbourne, AU</div>
            </div>
            <div className="mt-5 flex gap-2"><SocialButton label="Spotify"><Music2 className="size-4" /></SocialButton><SocialButton label="Apple Music"><Apple className="size-4" /></SocialButton><SocialButton label="YouTube"><Video className="size-4" /></SocialButton><SocialButton label="Instagram"><Camera className="size-4" /></SocialButton><SocialButton label="SoundCloud"><Disc3 className="size-4" /></SocialButton></div>

            <div className="mt-7"><SectionLabel>Latest release</SectionLabel><div className="mt-3 rounded-2xl border border-white/[0.08] bg-[#20242a] p-3.5"><div className="flex items-center gap-3"><div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#b9a894] via-[#656a71] to-[#272b31] shadow-inner"><span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#f1ebe2]">Deep<br />Waters</span></div><div className="min-w-0 flex-1"><p className="text-xs uppercase tracking-[0.16em] text-[#737c86]">Single · 2024</p><p className="mt-1 truncate font-medium">Deep Waters</p></div><button onClick={() => setPlaying(!playing)} className="flex size-10 items-center justify-center rounded-full bg-[#e2d9cc] text-[#24201d] transition hover:bg-white" aria-label={playing ? 'Pause track' : 'Play track'}>{playing ? <span className="flex gap-1"><i className="h-4 w-1 rounded-full bg-current" /><i className="h-4 w-1 rounded-full bg-current" /></span> : <Play className="ml-0.5 size-4 fill-current" />}</button></div><div className="mt-4 flex items-center gap-3"><span className="font-mono text-[10px] text-[#9098a1]">{playing ? '01:12' : '00:00'}</span><Waveform /><span className="font-mono text-[10px] text-[#9098a1]">04:18</span></div><div className="mt-3 flex gap-2"><button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-[11px] text-[#b3bac0] transition hover:border-white/25 hover:text-white"><Music2 className="size-3.5" /> Spotify</button><button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-[11px] text-[#b3bac0] transition hover:border-white/25 hover:text-white"><Apple className="size-3.5" /> Apple Music</button></div></div></div>

            <div className="mt-7"><div className="flex items-center justify-between"><SectionLabel>Upcoming shows</SectionLabel><button className="text-[11px] text-[#9299a1] transition hover:text-[#e2d9cc]">View all</button></div><div className="mt-3 flex flex-col gap-2">{shows.map((show) => <div key={show.venue} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3"><div className="w-9 text-center"><p className="font-display text-lg leading-none">{show.date}</p><p className="mt-1 text-[9px] tracking-[0.16em] text-[#8b939b]">{show.month}</p></div><div className="h-8 w-px bg-white/10" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{show.venue}</p><p className="mt-0.5 text-[11px] text-[#8b939b]">{show.city}</p></div><button className={`rounded-full border px-2.5 py-1 text-[10px] ${show.tag === 'Sold out' ? 'border-white/10 text-[#727b84]' : 'border-[#e2d9cc]/30 text-[#e2d9cc] hover:bg-[#e2d9cc]/10'}`}>{show.tag}</button></div>)}</div></div>

            <div className="mt-7"><SectionLabel>Shop</SectionLabel><div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#20242a] p-3"><div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#756b62] shadow-inner"><Disc3 className="size-9 text-[#d9d0c4]" /></div><div className="min-w-0 flex-1"><p className="text-sm font-medium">Limited Edition Vinyl</p><p className="mt-1 text-xs text-[#8d969e]">180g · Hand-numbered</p><p className="mt-2 text-sm text-[#e2d9cc]">$38.00</p></div><button className="flex items-center gap-1.5 rounded-lg bg-[#e2d9cc] px-3 py-2 text-[11px] font-medium text-[#24201d] hover:bg-white"><ShoppingBag className="size-3.5" /> Buy</button></div></div>

            <div className="mt-7 flex flex-col gap-2"><LinkButton icon={<Mail />} label="Press Kit (EPK)" /><LinkButton icon={<ArrowUpRight />} label="Booking Enquiries" /><LinkButton icon={<Video />} label="YouTube Music Video" /></div>
            <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#606871]">artist-bio · made for independent artists</p>
          </div>
        </section>

        <aside className="hidden w-[300px] pt-20 lg:block"><div className="rounded-2xl border border-white/[0.08] bg-[#181b20]/80 p-5 backdrop-blur-xl"><div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#e2d9cc]"><Sparkles className="size-3.5" /> Pro feature</div><h2 className="mt-4 font-display text-xl tracking-[-0.04em]">Your sound.<br />Your world.</h2><p className="mt-3 text-xs leading-5 text-[#848d96]">Give your page a signature look with live theme &amp; styling controls.</p><div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4"><span className="text-xs text-[#9da4ab]">Theme palette</span><div className="flex gap-1.5"><i className="size-4 rounded-full border border-white/20 bg-[#e2d9cc]" /><i className="size-4 rounded-full border border-white/20 bg-[#82959a]" /><i className="size-4 rounded-full border border-white/20 bg-[#554c49]" /><i className="flex size-4 items-center justify-center rounded-full border border-white/20 bg-[#252a31]"><Plus className="size-2.5" /></i></div></div><div className="mt-4 flex items-center justify-between"><span className="text-xs text-[#9da4ab]">Background blur</span><span className="font-mono text-[10px] text-[#737b84]">42%</span></div><div className="mt-2 h-1 rounded-full bg-white/10"><div className="h-1 w-[42%] rounded-full bg-[#e2d9cc]" /></div><div className="mt-5 flex items-center justify-between"><span className="text-xs text-[#9da4ab]">Typography</span><button className="flex items-center gap-1 text-[11px] text-[#e2d9cc]">Plus Jakarta <ChevronDown className="size-3" /></button></div></div><p className="mt-4 text-center text-[10px] leading-4 text-[#606871]">Everything your audience needs,<br />in one beautiful link.</p></aside>
        {showCustomizer && <div className="fixed bottom-5 left-5 right-5 z-10 rounded-2xl border border-white/10 bg-[#20242a]/95 p-4 shadow-2xl backdrop-blur-xl lg:hidden"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm"><Sparkles className="size-4 text-[#e2d9cc]" /> Live styling controls</span><button onClick={() => setShowCustomizer(false)} className="text-xs text-[#9ca4ad]">Close</button></div></div>}
      </div>
    </main>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) { return <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#737c85]">{children}</h2> }
function LinkButton({ icon, label }: { icon: React.ReactNode; label: string }) { return <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 text-xs text-[#c4c8cb] transition hover:border-[#e2d9cc]/30 hover:bg-[#e2d9cc]/[0.06] hover:text-[#e2d9cc]">{icon && <span className="[&>svg]:size-3.5">{icon}</span>}{label}<ArrowUpRight className="ml-auto mr-2.5 size-3.5 text-[#6f7780]" /></button> }
