-- Brightbox Solar Payback Calculator — structured equipment list for the
-- energy efficiency survey. Run once in the Supabase SQL editor, after
-- 003_energy_survey.sql.
--
-- Replaces the free-text-only "largest consuming items" question with a
-- repeatable structured list (name, quantity, estimated wattage, hours/day)
-- so the AI report drafter (lib/reportGeneration.ts) has concrete numbers
-- to build an equipment profile and payback estimates from, matching the
-- level of detail in Brightbox's own manually-written scorecards.

alter table public.energy_survey_submissions
  add column if not exists equipment jsonb not null default '[]';

-- largest_consumers is now a free-text supplementary notes field rather
-- than the primary equipment capture, so it's no longer required.
alter table public.energy_survey_submissions
  alter column largest_consumers drop not null;
