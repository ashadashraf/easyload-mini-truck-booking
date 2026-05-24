create sequence if not exists public.booking_id_seq start with 1000000;

create table if not exists public.bookings (
  id bigint primary key default nextval('public.booking_id_seq'),
  access_token text not null unique,
  pickup_location text not null,
  drop_location text not null,
  pickup_time timestamptz not null,
  drop_time timestamptz,
  phone_number text not null,
  estimated_price numeric(10, 2) not null,
  estimated_distance_km numeric(10, 1),
  estimated_duration_minutes integer,
  estimate_source text not null default 'local_fallback'
    check (estimate_source in ('google_maps', 'local_fallback', 'reused')),
  expected_price numeric(10, 2),
  final_price numeric(10, 2),
  need_helper boolean not null default false,
  helper_charge numeric(10, 2),
  status text not null default 'pending'
    check (status in ('pending', 'contacted', 'booked', 'completed', 'rejected')),
  customer_notes text,
  driver_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booked_requires_final_price check (status <> 'booked' or final_price is not null)
);

alter table public.bookings
  add column if not exists customer_notes text;

alter table public.bookings
  add column if not exists driver_notes text;

update public.bookings
set access_token = gen_random_uuid()::text || '-' || gen_random_uuid()::text
where access_token is null;
alter table public.bookings alter column access_token set not null;

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create unique index if not exists bookings_access_token_idx on public.bookings (access_token);
create index if not exists bookings_route_idx on public.bookings (
  lower(trim(pickup_location)),
  lower(trim(drop_location))
);

create table if not exists public.driver_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  driver_email text not null,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists driver_push_subscriptions_driver_email_idx
on public.driver_push_subscriptions (driver_email);

create unique index if not exists driver_push_subscriptions_endpoint_idx
on public.driver_push_subscriptions (endpoint);

alter table public.bookings enable row level security;
alter table public.driver_push_subscriptions enable row level security;

drop policy if exists "bookings_no_anon_direct_access" on public.bookings;
drop policy if exists "bookings_no_authenticated_direct_access" on public.bookings;
drop policy if exists "driver_push_subscriptions_no_anon_direct_access" on public.driver_push_subscriptions;
drop policy if exists "driver_push_subscriptions_no_authenticated_direct_access" on public.driver_push_subscriptions;

create policy "bookings_no_anon_direct_access"
on public.bookings
as restrictive
for all
to anon
using (false)
with check (false);

create policy "bookings_no_authenticated_direct_access"
on public.bookings
as restrictive
for all
to authenticated
using (false)
with check (false);

create policy "driver_push_subscriptions_no_anon_direct_access"
on public.driver_push_subscriptions
as restrictive
for all
to anon
using (false)
with check (false);

create policy "driver_push_subscriptions_no_authenticated_direct_access"
on public.driver_push_subscriptions
as restrictive
for all
to authenticated
using (false)
with check (false);

comment on table public.bookings is
  'Bookings are accessed only through Next.js API routes. Browser clients must not query this table directly. Driver APIs verify Supabase Auth, then server-side service role performs database operations. Customer access is only by private access_token through /api/bookings/token/:token.';

comment on table public.driver_push_subscriptions is
  'Driver PWA push subscriptions. Accessed only through authenticated Next.js driver API routes using the server-side service role.';
