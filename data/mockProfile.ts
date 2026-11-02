import { ArtistProfile } from '@/types/custom-types';

export const mockArtistProfile: ArtistProfile = {
  id: 'artist-1',
  handle: 'moli',
  name: 'MOLI',
  tagline: 'Melodic & Progressive House Producer',
  location: 'Melbourne, AU',
  isVerified: true,
  avatarUrl: '/moli-avatar.jpg', // O tus iniciales MO
  coverUrl: '/moli-cover.png',
  socials: [
    { platform: 'spotify', url: '#' },
    { platform: 'apple', url: '#' },
    { platform: 'youtube', url: '#' },
    { platform: 'instagram', url: '#' },
    { platform: 'soundcloud', url: '#' },
  ],
  latestRelease: {
    title: 'Deep Waters',
    type: 'Single',
    year: '2024',
    duration: '04:18',
    spotifyUrl: '#',
    appleUrl: '#',
  },
  shows: [
    { id: '1', date: '08', month: 'NOV', venue: 'Howler', city: 'Melbourne', status: 'Tickets' },
    { id: '2', date: '22', month: 'NOV', venue: 'The Lansdowne', city: 'Sydney', status: 'Tickets' },
    { id: '3', date: '06', month: 'DEC', venue: 'The Evelyn', city: 'Melbourne', status: 'Sold out' },
  ],
  merch: {
    title: 'Limited Edition Vinyl',
    subtitle: '180g · Hand-numbered',
    price: '$38.00',
  },
  links: [
    { id: 'l1', label: 'Press Kit (EPK)', url: '#', type: 'email' },
    { id: 'l2', label: 'Booking Enquiries', url: '#', type: 'external' },
    { id: 'l3', label: 'YouTube Music Video', url: '#', type: 'video' },
  ],
};
