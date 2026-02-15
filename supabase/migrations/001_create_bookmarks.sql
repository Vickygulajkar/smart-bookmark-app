-- Create the bookmarks table
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  created_at timestamptz not null default now()
);

-- Create an index for fast lookups by user
create index bookmarks_user_id_idx on public.bookmarks (user_id);

-- Enable Row Level Security (RLS)
alter table public.bookmarks enable row level security;

-- Users can only select their own bookmarks
create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

-- Users can only insert bookmarks for themselves
create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

-- Users can only update their own bookmarks
create policy "Users can update own bookmarks"
  on public.bookmarks for update
  using (auth.uid() = user_id);

-- Users can only delete their own bookmarks
create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);
