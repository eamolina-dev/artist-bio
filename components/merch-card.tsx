'use client'

import { ShoppingBag, ExternalLink } from 'lucide-react'
import { Database } from '@/types/supabase'

type MerchRow = Database['public']['Tables']['merch']['Row']

interface MerchCardProps {
  merch?: MerchRow | null
}

export function MerchCard({ merch }: MerchCardProps) {
  if (!merch) {
    return null
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#121316]/60 p-4 flex flex-col justify-between gap-4">
      <div className="flex items-center gap-3">
        {merch.image_url ? (
          <img
            src={merch.image_url}
            alt={merch.title}
            className="size-14 rounded-xl object-cover border border-white/10"
          />
        ) : (
          <div className="flex size-14 items-center justify-center rounded-xl bg-white/5 text-[#9299a1]">
            <ShoppingBag className="size-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9299a1]">
            Merch
          </p>
          <h3 className="truncate text-sm font-medium text-[#e9e5df]">
            {merch.title}
          </h3>
          <p className="text-xs font-mono text-[#e2d9cc]">{merch.price}</p>
        </div>
      </div>

      {merch.buy_url && (
        <a
          href={merch.buy_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-[#e9e5df] hover:bg-white/10 transition"
        >
          Ver producto <ExternalLink className="size-3" />
        </a>
      )}
    </div>
  )
}
