-- VIPEX Rider data model
-- Run this once in the Supabase SQL Editor before using rider signup.
-- Anonymous sign-ins must also be enabled in Supabase Auth settings.

create table if not exists public.rider_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  region text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rider_subscriptions (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid not null unique references public.rider_profiles(id) on delete cascade,
  provider text not null check (provider in ('mtn', 'vodafone', 'airteltigo')),
  amount_ghs numeric(10, 2) not null default 20.00,
  status text not null check (status in ('active', 'pending', 'cancelled')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.rider_profiles enable row level security;
alter table public.rider_subscriptions enable row level security;

drop policy if exists "Riders can read their own profile" on public.rider_profiles;
create policy "Riders can read their own profile"
  on public.rider_profiles for select
  using (auth.uid() = id);

drop policy if exists "Riders can create their own profile" on public.rider_profiles;
create policy "Riders can create their own profile"
  on public.rider_profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Riders can update their own profile" on public.rider_profiles;
create policy "Riders can update their own profile"
  on public.rider_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Riders can read their own subscription" on public.rider_subscriptions;
create policy "Riders can read their own subscription"
  on public.rider_subscriptions for select
  using (auth.uid() = rider_id);

drop policy if exists "Riders can create their own subscription" on public.rider_subscriptions;
create policy "Riders can create their own subscription"
  on public.rider_subscriptions for insert
  with check (auth.uid() = rider_id);

drop policy if exists "Riders can update their own subscription" on public.rider_subscriptions;
create policy "Riders can update their own subscription"
  on public.rider_subscriptions for update
  using (auth.uid() = rider_id)
  with check (auth.uid() = rider_id);