-- ============================================================
-- MyyCV database schema
-- Run this once in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New query → paste this → Run)
-- ============================================================

create table if not exists tokens (
  code text primary key,
  status text not null default 'unused' check (status in ('unused', 'used')),
  created_at timestamptz not null default now(),
  used_at timestamptz,
  slug text
);

create table if not exists portfolios (
  slug text primary key,
  token_code text references tokens(code),
  edit_password text not null,
  theme text not null default 'mono',
  profile jsonb not null default '{}'::jsonb,
  skills jsonb not null default '{}'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security: on by default with Supabase, so we add explicit
-- policies. NOTE (read this): these policies are intentionally permissive
-- so the app can work with no separate backend server. That means the
-- *database* does not itself enforce the edit password -- the app checks
-- it in the browser before allowing a save. This is fine for a lightweight
-- student tool, but is not bank-grade security: someone who really wanted
-- to could call the Supabase API directly and bypass the password screen.
-- If you ever handle sensitive data, this is the first thing to upgrade
-- (via a small serverless function that checks the password server-side).

alter table tokens enable row level security;
alter table portfolios enable row level security;

create policy "public can read tokens" on tokens
  for select using (true);

create policy "public can update tokens" on tokens
  for update using (true);

create policy "public can read portfolios" on portfolios
  for select using (true);

create policy "public can insert portfolios" on portfolios
  for insert with check (true);

create policy "public can update portfolios" on portfolios
  for update using (true);

-- Seed one example token so you can test the flow immediately.
-- Delete this row once you've generated your own codes from the Owner panel.
insert into tokens (code, status) values ('DEMO-0001', 'unused')
  on conflict (code) do nothing;
