export const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...', domains: ['instagram.com'] },
  { id: 'tiktok', label: 'TikTok', placeholder: 'https://www.tiktok.com/@...', domains: ['tiktok.com'] },
  { id: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@...', domains: ['youtube.com', 'youtu.be'] },
  { id: 'discord', label: 'Discord', placeholder: 'https://discord.gg/...', domains: ['discord.gg', 'discord.com'] },
  { id: 'x', label: 'X', placeholder: 'https://x.com/...', domains: ['x.com', 'twitter.com'] },
  { id: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...', domains: ['facebook.com'] },
] as const

export const RELEASE_PLATFORMS = [
  { id: 'spotify', label: 'Spotify', field: 'spotify_url', placeholder: 'https://open.spotify.com/...', domains: ['spotify.com'] },
  { id: 'youtube', label: 'YouTube', field: 'youtube_url', placeholder: 'https://youtube.com/...', domains: ['youtube.com', 'youtu.be'] },
  { id: 'apple', label: 'Apple Music', field: 'apple_url', placeholder: 'https://music.apple.com/...', domains: ['apple.com'] },
  { id: 'soundcloud', label: 'SoundCloud', field: 'soundcloud_url', placeholder: 'https://soundcloud.com/...', domains: ['soundcloud.com'] },
  { id: 'bandcamp', label: 'Bandcamp', field: 'bandcamp_url', placeholder: 'https://artist.bandcamp.com/...', domains: ['bandcamp.com'] },
  { id: 'beatport', label: 'Beatport', field: 'beatport_url', placeholder: 'https://www.beatport.com/...', domains: ['beatport.com'] },
] as const

export type ReleasePlatformField = (typeof RELEASE_PLATFORMS)[number]['field']
export type ReleaseUrls = Record<ReleasePlatformField, string>

export const EMPTY_RELEASE_URLS: ReleaseUrls = {
  spotify_url: '',
  youtube_url: '',
  apple_url: '',
  soundcloud_url: '',
  bandcamp_url: '',
  beatport_url: '',
}

export function normalizeUrl(value: string) {
  return value.trim().toLowerCase().replace(/\/+$/, '')
}

export function isUrlFromDomains(value: string, domains: readonly string[]) {
  try {
    const hostname = new URL(value).hostname.toLowerCase()
    return domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))
  } catch {
    return false
  }
}

export function sortSocials<T extends { platform: string }>(socials: T[]) {
  const priority = (platform: string) =>
    SOCIAL_PLATFORMS.findIndex((item) => item.id === platform.trim().toLowerCase())

  return socials
    .filter((social) => priority(social.platform) >= 0)
    .sort((a, b) => priority(a.platform) - priority(b.platform))
}
