import { Show } from '@/types/custom-types'

export function ShowsList({ shows }: { shows: Show[] }) {
  if (!shows || shows.length === 0) return null

  return (
    <div className="mt-7">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#737c85]">
          Upcoming shows
        </h2>
        <button className="text-[11px] text-[#9299a1] transition hover:text-[#e2d9cc]">
          View all
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {shows.map((show) => (
          <div
            key={show.id}
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3"
          >
            <div className="w-9 text-center">
              <p className="font-display text-lg leading-none">{show.date}</p>
              <p className="mt-1 text-[9px] tracking-[0.16em] text-[#8b939b]">{show.month}</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{show.venue}</p>
              <p className="mt-0.5 text-[11px] text-[#8b939b]">{show.city}</p>
            </div>
            <a
              href={show.ticketUrl || '#'}
              className={`rounded-full border px-2.5 py-1 text-[10px] ${
                show.status === 'Sold out'
                  ? 'border-white/10 text-[#727b84]'
                  : 'border-[#e2d9cc]/30 text-[#e2d9cc] hover:bg-[#e2d9cc]/10'
              }`}
            >
              {show.status}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
