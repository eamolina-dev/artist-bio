export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ thumbnail_url: null }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('url' in body) ||
    typeof body.url !== 'string' ||
    body.url.length > 2048
  ) {
    return Response.json({ thumbnail_url: null }, { status: 400 })
  }

  let sourceUrl: URL
  try {
    sourceUrl = new URL(body.url)
  } catch {
    return Response.json({ thumbnail_url: null }, { status: 400 })
  }

  const hostname = sourceUrl.hostname.toLowerCase()
  const isSpotify = hostname === 'spotify.com' || hostname.endsWith('.spotify.com')
  const isYoutube =
    hostname === 'youtube.com' ||
    hostname.endsWith('.youtube.com') ||
    hostname === 'youtu.be'

  if (sourceUrl.protocol !== 'https:' || sourceUrl.port || (!isSpotify && !isYoutube)) {
    return Response.json({ thumbnail_url: null }, { status: 400 })
  }

  const endpoint = new URL(
    isSpotify ? 'https://open.spotify.com/oembed' : 'https://www.youtube.com/oembed',
  )
  endpoint.searchParams.set('url', sourceUrl.toString())
  if (isYoutube) endpoint.searchParams.set('format', 'json')

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return Response.json({ thumbnail_url: null })

    const data: unknown = await response.json()
    if (
      typeof data !== 'object' ||
      data === null ||
      !('thumbnail_url' in data) ||
      typeof data.thumbnail_url !== 'string'
    ) {
      return Response.json({ thumbnail_url: null })
    }

    const thumbnailUrl = new URL(data.thumbnail_url)
    if (thumbnailUrl.protocol !== 'https:') {
      return Response.json({ thumbnail_url: null })
    }

    return Response.json({ thumbnail_url: thumbnailUrl.toString() })
  } catch (error) {
    console.warn('Could not retrieve oEmbed release artwork:', error)
    return Response.json({ thumbnail_url: null })
  }
}
