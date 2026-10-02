-- Secure, persistence-first lead attribution and WhatsApp delivery state.
-- Additive and safe to apply to the existing YAIdigitals database.

alter table public.leads alter column email drop not null;
alter table public.leads add column if not exists source_url text;
alter table public.leads add column if not exists referrer text;
alter table public.leads add column if not exists utm_source text;
alter table public.leads add column if not exists utm_medium text;
alter table public.leads add column if not exists utm_campaign text;
alter table public.leads add column if not exists utm_content text;
alter table public.leads add column if not exists utm_term text;
alter table public.leads add column if not exists consent_at timestamptz;
alter table public.leads add column if not exists submission_key text;
alter table public.leads add column if not exists notification_status text default 'pending' not null;
alter table public.leads add column if not exists notification_provider text;
alter table public.leads add column if not exists notification_provider_message_id text;
alter table public.leads add column if not exists notification_attempts integer default 0 not null;
alter table public.leads add column if not exists notification_next_attempt_at timestamptz default now();
alter table public.leads add column if not exists notification_last_error text;
alter table public.leads add column if not exists notification_sent_at timestamptz;
alter table public.leads add column if not exists notification_locked_at timestamptz;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'leads_notification_status_check') then
    alter table public.leads add constraint leads_notification_status_check
      check (notification_status in ('pending', 'sent', 'failed'));
  end if;
end $$;

create unique index if not exists leads_submission_key_unique
  on public.leads (submission_key) where submission_key is not null;
create index if not exists leads_notification_due_idx
  on public.leads (notification_next_attempt_at)
  where notification_status in ('pending', 'failed') and notification_attempts < 4;

-- Public traffic must use the validated server endpoint, never anonymous table writes.
drop policy if exists "Leads are insertable by everyone" on public.leads;

create table if not exists public.lead_rate_limits (
  key_hash text primary key,
  window_started_at timestamptz default now() not null,
  request_count integer default 1 not null,
  updated_at timestamptz default now() not null
);
alter table public.lead_rate_limits enable row level security;

create or replace function public.check_lead_rate_limit(
  p_key_hash text,
  p_limit integer default 5,
  p_window_seconds integer default 600
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.lead_rate_limits%rowtype;
begin
  insert into public.lead_rate_limits (key_hash)
  values (p_key_hash)
  on conflict (key_hash) do update set
    request_count = case
      when lead_rate_limits.window_started_at < now() - make_interval(secs => p_window_seconds) then 1
      else lead_rate_limits.request_count + 1
    end,
    window_started_at = case
      when lead_rate_limits.window_started_at < now() - make_interval(secs => p_window_seconds) then now()
      else lead_rate_limits.window_started_at
    end,
    updated_at = now()
  returning * into current_row;

  return current_row.request_count <= p_limit;
end;
$$;

create or replace function public.claim_lead_notification(p_lead_id bigint)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed_count integer;
begin
  update public.leads
  set notification_locked_at = now(),
      notification_attempts = notification_attempts + 1,
      updated_at = now()
  where id = p_lead_id
    and notification_status <> 'sent'
    and notification_attempts < 4
    and notification_next_attempt_at is not null
    and notification_next_attempt_at <= now()
    and (notification_locked_at is null or notification_locked_at < now() - interval '5 minutes');
  get diagnostics claimed_count = row_count;
  return claimed_count = 1;
end;
$$;

revoke all on table public.lead_rate_limits from anon, authenticated;
revoke all on function public.check_lead_rate_limit(text, integer, integer) from public, anon, authenticated;
revoke all on function public.claim_lead_notification(bigint) from public, anon, authenticated;
grant execute on function public.check_lead_rate_limit(text, integer, integer) to service_role;
grant execute on function public.claim_lead_notification(bigint) to service_role;

comment on column public.leads.submission_key is 'Server-generated daily idempotency key; never supplied by the browser.';
comment on column public.leads.notification_last_error is 'Sanitised delivery error without credentials or lead PII.';
