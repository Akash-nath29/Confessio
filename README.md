# Confessio — Anonymous Confessions

[![CI](https://github.com/akash-nath29/confessio/actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red.svg)](https://github.com/akash-nath29/confessio)

> 🎭 **An open-source, fully anonymous confession app** — Share your thoughts without fear of judgment.

Confessio is a privacy-first, community-driven mobile app built with Expo (React Native) and Supabase. No login, no tracking, no data collection. Just honest, anonymous confessions.

## ✨ Features

- 📝 **Write Anonymously** - Post confessions without revealing your identity
- 📱 **Feed** - Browse all confessions in chronological order
- ⬆️ **Upvote System** - Vote on confessions you relate to
- 💬 **Anonymous Comments** - Comment on confessions with Instagram-style collapsible UI
- 😊 **Emoji Reactions** - React with any emoji (👍❤️😂 and 100+ more)
- 🎨 **Clean UI** - Modern interface with expandable reaction panels
- 🔒 **Privacy by Design** - No authentication, no analytics, no tracking
- 📖 **About Page** - Transparent privacy policy and terms of service

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo SDK ~54.0.16
- **Backend**: Supabase (PostgreSQL + Row Level Security)
- **Navigation**: Expo Router (file-based)
- **Storage**: expo-secure-store (iOS Keychain / Android Keystore)
- **Build**: EAS Build (Android APK + iOS)
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

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

### Comments Table

```sql
create table if not exists public.comments (
  id bigserial primary key,
  confession_id bigint not null references public.confessions(id) on delete cascade,
  device_id text not null,
  content text not null,
  created_at timestamptz not null default now(),
  constraint comment_length_check check (length(content) <= 500)
);

-- Create indexes for faster lookups
create index if not exists idx_comments_confession_id on public.comments(confession_id);
create index if not exists idx_comments_device_id on public.comments(device_id);
create index if not exists idx_comments_created_at on public.comments(created_at desc);

-- Enable Row Level Security
alter table public.comments enable row level security;

-- Allow anonymous comment inserts
create policy "Allow anonymous comment inserts" on public.comments
  for insert to anon with check (true);

-- Allow anonymous comment reads
create policy "Allow anonymous comment reads" on public.comments
  for select to anon using (true);

-- Allow users to delete their own comments (optional)
create policy "Allow anonymous comment deletes" on public.comments
  for delete to anon using (true);

-- Add comment_count column to confessions table
alter table public.confessions add column if not exists comment_count bigint not null default 0;

-- Create triggers to auto-update comment_count
create or replace function increment_comment_count()
returns trigger as $$
begin
  update public.confessions
  set comment_count = comment_count + 1
  where id = new.confession_id;
  return new;
end;
$$ language plpgsql security definer;

create or replace function decrement_comment_count()
returns trigger as $$
begin
  update public.confessions
  set comment_count = comment_count - 1
  where id = old.confession_id;
  return old;
end;
$$ language plpgsql security definer;

drop trigger if exists on_comment_insert on public.comments;
create trigger on_comment_insert
  after insert on public.comments
  for each row
  execute function increment_comment_count();

drop trigger if exists on_comment_delete on public.comments;
create trigger on_comment_delete
  after delete on public.comments
  for each row
  execute function decrement_comment_count();
```

**Important Notes**:
- **For new setups**: Run all SQL scripts above in your Supabase SQL Editor
- **For existing projects**: Use the migration file `migrations/comments-migration.sql`
- **Safety**: The migration is 100% non-destructive - it only adds new structures
- **Supabase Warning**: You'll see a warning about "destructive code" - this is normal for ALTER TABLE statements. See `migrations/MIGRATION_SAFETY.md` for details.
- **Quick Reference**: See `migrations/QUICK_REFERENCE.md` for a visual guide

## Privacy by design

- The app never asks for your name, email, or login.
- A local, random codename is generated and stored securely on your device (e.g., `anon-brave-fox-1a2b`).
- No analytics SDKs or third‑party trackers are included.
- Only the confession text, timestamp, and the non‑identifiable codename are sent to Supabase.

## Where things live

- `app/write.tsx` → Write a confession (500 char limit)
- `app/feed.tsx` → Confession feed with upvotes, reactions, and comments
- `app/about.tsx` → About + Privacy + T&C
- `lib/supabase.js` → Supabase client (set your URL and anon key)
- `lib/deviceName.js` → Generates and persists a random, non‑identifiable codename
- `migrations/comments-migration.sql` → SQL migration for comments feature

## Future ideas

- Filters (funny / emotional / dark)
- AI moderation
- Hashtags / topics
- Anonymous chat replies
- Comment threading (reply to comments)

## Notes

- This project intentionally avoids analytics. To measure high‑level metrics (e.g., confessions posted), prefer aggregate counts from your Supabase database instead of on‑device tracking.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Security

If you discover a security vulnerability, please follow our [Security Policy](SECURITY.md).

## License

MIT © Akash Nath

