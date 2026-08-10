-- Brightbox Solar Payback Calculator — Supabase schema
-- Run once in the Supabase SQL editor for your project.

create table if not exists public.installers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  company_name text not null default '',
  logo_url text,
  primary_color text not null default '#4A5D3A',
  accent_color text not null default '#C9962B',
  trial_start timestamptz not null default now(),
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text not null default 'trialing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists installers_user_id_idx on public.installers (user_id);
create index if not exists installers_stripe_customer_id_idx on public.installers (stripe_customer_id);

alter table public.installers enable row level security;

-- Owners can read/update their own row. Inserts happen via the signup flow
-- (client-side, authenticated as the new user) so they're covered by the
-- same "own row" check. Deletes and the service_role bypass RLS entirely,
-- which is how the Stripe webhook updates subscription status.
create policy "Installers can view own row"
  on public.installers for select
  using (auth.uid() = user_id);

create policy "Installers can update own row"
  on public.installers for update
  using (auth.uid() = user_id);

create policy "Installers can insert own row"
  on public.installers for insert
  with check (auth.uid() = user_id);

-- Keep updated_at current on every write.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists installers_set_updated_at on public.installers;
create trigger installers_set_updated_at
  before update on public.installers
  for each row execute function public.set_updated_at();

-- Storage bucket for installer logos. Create the bucket via the dashboard
-- (Storage > New bucket > "logos", public) or run:
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- Installers can only manage files under a path prefixed with their own
-- user id (e.g. logos/<user_id>/logo.png). Public read is allowed since the
-- bucket is public (logos need to be embeddable in PDFs/quotes).
create policy "Public can read logos"
  on storage.objects for select
  using (bucket_id = 'logos');

create policy "Installers can upload their own logo"
  on storage.objects for insert
  with check (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Installers can update their own logo"
  on storage.objects for update
  using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Installers can delete their own logo"
  on storage.objects for delete
  using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
