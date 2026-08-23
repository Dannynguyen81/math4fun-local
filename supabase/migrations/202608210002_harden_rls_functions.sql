-- Remove public SECURITY DEFINER helpers from RLS paths.
-- Admin claims are read directly from the signed JWT within each policy.

drop policy if exists profiles_select_own_or_admin on public.profiles;
drop policy if exists profiles_insert_own_or_admin on public.profiles;
drop policy if exists profiles_update_own_or_admin on public.profiles;
drop policy if exists questions_admin_write on public.questions;
drop policy if exists reports_select_owner_or_admin on public.reports;
drop policy if exists reports_admin_update on public.reports;
drop policy if exists gold_ledger_select_owner_or_admin on public.gold_ledger;
drop policy if exists guardian_collection_select_owner_or_admin on public.guardian_collection;
drop policy if exists guardian_collection_insert_owner_or_admin on public.guardian_collection;
drop policy if exists guardian_collection_update_owner_or_admin on public.guardian_collection;
drop policy if exists guardian_collection_delete_owner_or_admin on public.guardian_collection;
drop policy if exists leaderboard_insert_owner_or_admin on public.leaderboard;
drop policy if exists leaderboard_update_owner_or_admin on public.leaderboard;

drop function if exists public.is_math4fun_admin();

create policy profiles_select_own_or_admin on public.profiles
for select to authenticated
using (id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy profiles_insert_own_or_admin on public.profiles
for insert to authenticated
with check (id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy profiles_update_own_or_admin on public.profiles
for update to authenticated
using (id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false))
with check (id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy questions_admin_write on public.questions
for all to authenticated
using (coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false))
with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy reports_select_owner_or_admin on public.reports
for select to authenticated
using (reporter_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy reports_admin_update on public.reports
for update to authenticated
using (coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false))
with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy gold_ledger_select_owner_or_admin on public.gold_ledger
for select to authenticated
using (profile_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy guardian_collection_select_owner_or_admin on public.guardian_collection
for select to authenticated
using (profile_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy guardian_collection_insert_owner_or_admin on public.guardian_collection
for insert to authenticated
with check (profile_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy guardian_collection_update_owner_or_admin on public.guardian_collection
for update to authenticated
using (profile_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false))
with check (profile_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy guardian_collection_delete_owner_or_admin on public.guardian_collection
for delete to authenticated
using (profile_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy leaderboard_insert_owner_or_admin on public.leaderboard
for insert to authenticated
with check (profile_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy leaderboard_update_owner_or_admin on public.leaderboard
for update to authenticated
using (profile_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false))
with check (profile_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create or replace function public.set_math4fun_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

revoke all on function public.set_math4fun_updated_at() from public;
