create table if not exists public.visited_prefectures (
  user_id uuid not null references auth.users(id) on delete cascade,
  prefecture text not null,
  visited boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, prefecture)
);

alter table public.visited_prefectures enable row level security;

create policy "Users can read their own prefectures"
on public.visited_prefectures
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own prefectures"
on public.visited_prefectures
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own prefectures"
on public.visited_prefectures
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
