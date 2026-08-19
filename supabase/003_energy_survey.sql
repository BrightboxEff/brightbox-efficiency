-- Brightbox Solar Payback Calculator — energy efficiency survey feature
-- Run once in the Supabase SQL editor, in addition to schema.sql and
-- 002_consultation_requests.sql.

create table if not exists public.energy_survey_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Intake form answers (public.energy_survey_submissions is written by the
  -- service_role key only — this is a public, unauthenticated flow, not
  -- tied to a Brightbox installer account).
  first_name text not null,
  last_name text not null,
  business_name text not null,
  email text not null,
  annual_spend_bracket text not null,
  operations_description text not null,
  consumption_intensity jsonb not null,
  motivations text[] not null default '{}',
  has_utility_bills boolean not null,
  largest_consumers text not null,
  urgency integer not null,
  terms_accepted boolean not null,

  -- Purchase
  consultation_hours integer not null default 0,
  stripe_checkout_session_id text,
  status text not null default 'pending_payment',
  -- pending_payment | paid | bills_uploaded | report_ready | report_sent

  -- Secure bill upload
  upload_token uuid not null default gen_random_uuid(),
  bill_file_paths text[] not null default '{}',

  -- AI-drafted report + the reviewed/edited version actually sent
  report_draft text,
  report_final text,

  paid_at timestamptz,
  bills_uploaded_at timestamptz,
  report_generated_at timestamptz,
  report_sent_at timestamptz
);

create unique index if not exists energy_survey_upload_token_idx
  on public.energy_survey_submissions (upload_token);
create index if not exists energy_survey_stripe_session_idx
  on public.energy_survey_submissions (stripe_checkout_session_id);

-- RLS is enabled but no policies are added: every read/write to this table
-- goes through server routes using the service_role key (submit, webhook,
-- upload, review, send), since submitters aren't authenticated Brightbox
-- users. This is deliberate — it means the table is fully inaccessible via
-- the anon/publishable key from the browser, which is what we want for
-- data that includes customer utility bill references.
alter table public.energy_survey_submissions enable row level security;

-- Private storage bucket for uploaded utility bills — NOT public, unlike
-- the "logos" bucket. No storage.objects policies are added for the same
-- reason as above: all access goes through server routes with the
-- service_role key, which bypasses RLS entirely.
insert into storage.buckets (id, name, public)
values ('utility-bills', 'utility-bills', false)
on conflict (id) do nothing;
