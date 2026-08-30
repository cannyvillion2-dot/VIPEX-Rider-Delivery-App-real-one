-- VIPEX Rider data model
-- Run this once in the Supabase SQL Editor before using rider signup.
-- This flow intentionally does not use Supabase Auth. It inserts with the anon key.

create table if not exists public.riders (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  password text not null,
  region text not null,
  vehicle_type text not null default 'Motor Okada',
  status text not null default 'pending_verification',
  subscription_status text not null default 'inactive',
  is_online boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rider_subscriptions (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid not null unique references public.riders(id) on delete cascade,
  provider text not null check (provider in ('mtn', 'vodafone', 'airteltigo')),
  amount_ghs numeric(10, 2) not null default 20.00,
  status text not null check (status in ('active', 'pending', 'cancelled')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.riders enable row level security;
alter table public.rider_subscriptions enable row level security;

drop policy if exists "Allow anon insert riders" on public.riders;
create policy "Allow anon insert riders"
  on public.riders for insert to anon
  with check (true);

drop policy if exists "Allow anon read riders" on public.riders;
create policy "Allow anon read riders"
  on public.riders for select to anon
  using (true);

drop policy if exists "Allow anon update riders" on public.riders;
create policy "Allow anon update riders"
  on public.riders for update to anon
  using (true)
  with check (true);

drop policy if exists "Allow anon insert rider subscriptions" on public.rider_subscriptions;
create policy "Allow anon insert rider subscriptions"
  on public.rider_subscriptions for insert to anon
  with check (true);

drop policy if exists "Allow anon read rider subscriptions" on public.rider_subscriptions;
create policy "Allow anon read rider subscriptions"
  on public.rider_subscriptions for select to anon
  using (true);

drop policy if exists "Allow anon update rider subscriptions" on public.rider_subscriptions;
create policy "Allow anon update rider subscriptions"
  on public.rider_subscriptions for update to anon
  using (true)
  with check (true);