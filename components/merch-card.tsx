import { Disc3, ShoppingBag } from 'lucide-react'
import { MerchItem } from '@/types/artist'

export function MerchCard({ merch }: { merch?: MerchItem }) {
  if (!merch) return null

  return (
    <div className="mt-7">
      <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#737c85]">Shop</h2>
      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#20242a] p-3">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#756b62] shadow-inner">
          <Disc3 className="size-9 text-[#d9d0c4]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{merch.title}</p>
          <p className="mt-1 text-xs text-[#8d969e]">{merch.subtitle}</p>
          <p className="mt-2 text-sm text-[#e2d9cc]">{merch.price}</p>
        </div>
        <a
          href={merch.buyUrl || '#'}
          className="flex items-center gap-1.5 rounded-lg bg-[#e2d9cc] px-3 py-2 text-[11px] font-medium text-[#24201d] transition hover:bg-white"
        >
          <ShoppingBag className="size-3.5" /> Buy
        </a>
      </div>
    </div>
  )
}
