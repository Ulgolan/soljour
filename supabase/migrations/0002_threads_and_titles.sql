-- Lap 3 — threads (loose ends tracked per campaign) + optional entry titles.
-- Same RLS pattern as 0001: authenticated-only, no DELETE policy on either
-- table or column — resolution is a status flip, never a delete (Data law).

create table threads (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns (id) on delete cascade,
  text text not null check (length(trim(text)) > 0),
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table threads enable row level security;

create policy "authenticated can select threads"
  on threads for select
  to authenticated
  using (true);

create policy "authenticated can insert threads"
  on threads for insert
  to authenticated
  with check (true);

create policy "authenticated can update threads"
  on threads for update
  to authenticated
  using (true)
  with check (true);

alter table entries add column title text;
