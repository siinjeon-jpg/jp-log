create table if not exists public.prefecture_journals (
  user_id uuid not null references auth.users(id) on delete cascade,
  prefecture_slug text not null,
  title text not null default '',
  content text not null default '',
  visit_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, prefecture_slug)
);

alter table public.prefecture_journals enable row level security;

create policy "Users can read their own prefecture journals"
on public.prefecture_journals
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own prefecture journals"
on public.prefecture_journals
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own prefecture journals"
on public.prefecture_journals
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
