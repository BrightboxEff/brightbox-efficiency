-- supabase/005_performance_monitor.sql
-- Run this in the Supabase SQL Editor after the existing schema files.
-- Adds the Performance Monitor add-on: installers save a system's PVGIS
-- baseline once (at quote time), then log actual monthly generation
-- against it to get an automatic healthy/watch/alert status.
--
-- Two tables, not one:
--   monitored_systems   - one row per installed system, holds the baseline
--   performance_readings - many rows per system, just the actual kWh logged
-- Expected kWh for a given month is looked up from the system's stored
-- baseline rather than re-entered or duplicated per reading.

create table if not exists monitored_systems (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  system_reference text not null, -- installer's own label, e.g. "Smith, 14 Oak Road"
  postcode text not null,
  address_line text,
  system_size_kwp numeric not null,
  -- 12 values, index 1 = January .. index 12 = December (Postgres arrays
  -- are 1-indexed by default, so this lines up directly with reading_month).
  monthly_baseline_kwh numeric[] not null,
  created_at timestamptz not null default now()
);

alter table monitored_systems enable row level security;

create policy "Installers can view their own monitored systems"
  on monitored_systems for select
  using (auth.uid() = user_id);

create policy "Installers can insert their own monitored systems"
  on monitored_systems for insert
  with check (auth.uid() = user_id);

create policy "Installers can delete their own monitored systems"
  on monitored_systems for delete
  using (auth.uid() = user_id);

create table if not exists performance_readings (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references monitored_systems (id) on delete cascade,
  reading_month int not null check (reading_month between 1 and 12),
  reading_year int not null,
  actual_kwh numeric not null,
  created_at timestamptz not null default now(),
  unique (system_id, reading_year, reading_month)
);

alter table performance_readings enable row level security;

-- No user_id on this table directly, so RLS checks ownership via the
-- parent monitored_systems row instead.
create policy "Installers can view readings for their own systems"
  on performance_readings for select
  using (system_id in (select id from monitored_systems where user_id = auth.uid()));

create policy "Installers can insert readings for their own systems"
  on performance_readings for insert
  with check (system_id in (select id from monitored_systems where user_id = auth.uid()));

create index if not exists idx_performance_readings_system
  on performance_readings (system_id, reading_year, reading_month);
