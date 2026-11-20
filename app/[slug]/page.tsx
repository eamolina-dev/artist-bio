import { Suspense } from 'react'
import { ArtistBio } from '@/components/artist-bio'

interface SlugPageProps {
  params: Promise<{ slug: string }>
}

async function ArtistSlugLoader({ params }: SlugPageProps) {
  const { slug } = await params
  const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase()

  return <ArtistBio slug={normalizedSlug} />
}

export default function ArtistSlugPage({ params }: SlugPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#121316] text-[#e9e5df] flex items-center justify-center font-mono text-sm">
          Loading...
        </div>
      }
    >
      <ArtistSlugLoader params={params} />
    </Suspense>
  )
}
