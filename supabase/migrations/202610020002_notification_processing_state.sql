-- A claimed delivery enters `processing`. If a process dies after Evolution
-- accepts a message but before the receipt is stored, it remains visible for
-- manual reconciliation instead of being automatically sent twice.

alter table public.leads drop constraint if exists leads_notification_status_check;
alter table public.leads add constraint leads_notification_status_check
  check (notification_status in ('pending', 'processing', 'sent', 'failed', 'permanently_failed'));

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
  set notification_status = 'processing',
      notification_locked_at = now(),
      notification_attempts = notification_attempts + 1,
      updated_at = now()
  where id = p_lead_id
    and notification_status in ('pending', 'failed')
    and notification_attempts < 4
    and notification_next_attempt_at is not null
    and notification_next_attempt_at <= now()
    and (notification_locked_at is null or notification_locked_at < now() - interval '5 minutes');
  get diagnostics claimed_count = row_count;
  return claimed_count = 1;
end;
$$;

revoke all on function public.claim_lead_notification(bigint) from public, anon, authenticated;
grant execute on function public.claim_lead_notification(bigint) to service_role;
