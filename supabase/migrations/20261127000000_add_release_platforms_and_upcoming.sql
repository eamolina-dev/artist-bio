alter table public.releases
  add column if not exists youtube_url text,
  add column if not exists soundcloud_url text,
  add column if not exists bandcamp_url text,
  add column if not exists beatport_url text,
  add column if not exists is_upcoming boolean not null default false;
