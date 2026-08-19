-- Brightbox Solar Payback Calculator — consultation request feature
-- Run once in the Supabase SQL editor, in addition to schema.sql.

create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending', -- pending | paid | cancelled
  stripe_checkout_session_id text,
  project_name text,
  postcode text not null,
  address_line text,
  summary jsonb not null,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists consultation_requests_user_id_idx on public.consultation_requests (user_id);
create index if not exists consultation_requests_stripe_session_idx on public.consultation_requests (stripe_checkout_session_id);

alter table public.consultation_requests enable row level security;

-- Installers can create and view their own requests. Updates (marking paid)
-- happen via the Stripe webhook using the service_role key, which bypasses
-- RLS entirely, so no update policy is needed for the client.
create policy "Installers can insert own consultation requests"
  on public.consultation_requests for insert
  with check (auth.uid() = user_id);

create policy "Installers can view own consultation requests"
  on public.consultation_requests for select
  using (auth.uid() = user_id);
