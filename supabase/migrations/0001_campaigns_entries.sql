-- Lap 2 — locked pipe: campaigns + entries, RLS-gated, no delete capability.
-- Deletion is structurally impossible in this lap (Data law: every delete
-- undoable; none beats undoable) — no DELETE policy on either table, and no
-- grants to `anon` beyond what RLS already denies.

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  system_label text,
  created_at timestamptz not null default now()
);

create table entries (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns (id) on delete restrict,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table campaigns enable row level security;
alter table entries enable row level security;

create policy "authenticated can select campaigns"
  on campaigns for select
  to authenticated
  using (true);

create policy "authenticated can insert campaigns"
  on campaigns for insert
  to authenticated
  with check (true);

create policy "authenticated can update campaigns"
  on campaigns for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can select entries"
  on entries for select
  to authenticated
  using (true);

create policy "authenticated can insert entries"
  on entries for insert
  to authenticated
  with check (true);

create policy "authenticated can update entries"
  on entries for update
  to authenticated
  using (true)
  with check (true);
