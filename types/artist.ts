export interface SocialLink {
  platform: 'spotify' | 'apple' | 'youtube' | 'instagram' | 'soundcloud';
  url: string;
}

export interface Release {
  title: string;
  type: string;
  year: string;
  coverUrl?: string;
  audioUrl?: string;
  duration: string;
  spotifyUrl?: string;
  appleUrl?: string;
}

export interface Show {
  id: string;
  date: string;
  month: string;
  venue: string;
  city: string;
  status: 'Tickets' | 'Sold out' | 'Free';
  ticketUrl?: string;
}

export interface MerchItem {
  title: string;
  subtitle: string;
  price: string;
  imageUrl?: string;
  buyUrl?: string;
}

export interface CustomLink {
  id: string;
  label: string;
  url: string;
  type?: 'email' | 'external' | 'video';
}

export interface ArtistProfile {
  id: string;
  handle: string;
  name: string;
  tagline: string;
  location: string;
  isVerified: boolean;
  avatarUrl: string;
  coverUrl: string;
  socials: SocialLink[];
  latestRelease: Release;
  shows: Show[];
  merch?: MerchItem;
  links: CustomLink[];
}
