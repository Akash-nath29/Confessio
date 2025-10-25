# Confessio — Anonymous Confessions

[![CI](https://github.com/akash-nath29/confessio/actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Fully anonymous confession app built with Expo (React Native) and Supabase. No login, no tracking. Post and read confessions with a local, non‑identifiable device codename.

## Features

- Write a confession anonymously
- Feed of all confessions (latest first)
- **Upvote system** - Vote on confessions you relate to
- **Emoji reactions** - React with any emoji (👍❤️😂 and 100+ more)
- **Collapsible UI** - Clean interface with expandable reaction panel
- About page with privacy and T&C
- Privacy by design: no auth, no analytics, no tracking

## Tech Stack

- Frontend: React Native (Expo)
- Backend: Supabase (PostgreSQL)
- Architecture: Client inserts via Supabase SDK

## Quick start (Windows PowerShell)

```powershell
# 1) Install dependencies
npm install

# 2) Configure Supabase credentials (public anon key)
# Copy .env.example to .env and fill your values
cp .env.example .env

# 3) Start the app (choose iOS/Android/Web from the Expo dev menu)
npx expo start
```

The app uses Expo Router with three tabs: `Write`, `Feed`, and `About`.

Environment variables:

- `EXPO_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon key

These are public keys intended for use in client apps. Do not use service role keys.

## Supabase: Database schema

Create the following tables in your Supabase project:

### Confessions Table

```sql
create table if not exists public.confessions (
   id bigserial primary key,
   created_at timestamptz not null default now(),
   content text not null,
   device_name text not null
);

-- Enable Row Level Security
alter table public.confessions enable row level security;

create policy "Allow anonymous inserts" on public.confessions
   for insert to anon with check (true);

create policy "Allow anonymous reads" on public.confessions
   for select to anon using (true);
```

### Upvotes Table

```sql
create table if not exists public.upvotes (
   id bigserial primary key,
   confession_id bigint references public.confessions(id) on delete cascade,
   device_id text not null,
   created_at timestamptz not null default now(),
   unique(confession_id, device_id)
);

-- Enable Row Level Security
alter table public.upvotes enable row level security;

create policy "Allow anonymous upvote inserts" on public.upvotes
   for insert to anon with check (true);

create policy "Allow anonymous upvote reads" on public.upvotes
   for select to anon using (true);

create policy "Allow anonymous upvote deletes" on public.upvotes
   for delete to anon using (true);
```

### Reactions Table

```sql
create table if not exists public.reactions (
   id bigserial primary key,
   confession_id bigint references public.confessions(id) on delete cascade,
   device_id text not null,
   reaction_type text not null,
   created_at timestamptz not null default now(),
   unique(confession_id, device_id)
);

-- Enable Row Level Security
alter table public.reactions enable row level security;

-- Allow anonymous inserts
create policy "Allow anonymous reaction inserts" on public.reactions
   for insert to anon with check (true);

-- Allow anonymous reads
create policy "Allow anonymous reaction reads" on public.reactions
   for select to anon using (true);

-- Allow anonymous updates (for changing reactions)
create policy "Allow anonymous reaction updates" on public.reactions
   for update to anon using (true) with check (true);

-- Allow anonymous deletes (for removing reactions)
create policy "Allow anonymous reaction deletes" on public.reactions
   for delete to anon using (true);
```

**Note**: Run all three table creation scripts in your Supabase SQL Editor to set up the complete database schema.

## Privacy by design

- The app never asks for your name, email, or login.
- A local, random codename is generated and stored securely on your device (e.g., `anon-brave-fox-1a2b`).
- No analytics SDKs or third‑party trackers are included.
- Only the confession text, timestamp, and the non‑identifiable codename are sent to Supabase.

## Where things live

- `app/write.tsx` → Write a confession
- `app/feed.tsx` → Confession feed (latest first)
- `app/about.tsx` → About + Privacy + T&C
- `lib/supabase.js` → Supabase client (set your URL and anon key)
- `lib/deviceName.js` → Generates and persists a random, non‑identifiable codename

## Future ideas (post‑MVP)

- Voting on confessions
- Filters (funny / emotional / dark)
- AI moderation
- Hashtags / topics
- Anonymous chat replies

## Notes

- This project intentionally avoids analytics. To measure high‑level metrics (e.g., confessions posted), prefer aggregate counts from your Supabase database instead of on‑device tracking.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Security

If you discover a security vulnerability, please follow our [Security Policy](SECURITY.md).

## License

MIT © Akash Nath

