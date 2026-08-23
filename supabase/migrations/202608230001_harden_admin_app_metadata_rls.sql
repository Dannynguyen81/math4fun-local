-- Math4Fun admin authorization is controlled by Supabase Auth app_metadata only.
-- The browser/local profile role is never sufficient for database authorization.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_math4fun_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'math4fun_role') = 'admin', false);
$$;

revoke all on function private.is_math4fun_admin() from public, anon;
grant execute on function private.is_math4fun_admin() to authenticated;

-- Profiles: owner sees/writes own profiles; an authenticated Math4Fun admin may inspect them.
drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin on public.profiles
for select to authenticated
using (owner_id = (select auth.uid()) or (select private.is_math4fun_admin()));

drop policy if exists profiles_insert_own_or_admin on public.profiles;
create policy profiles_insert_own_or_admin on public.profiles
for insert to authenticated
with check (owner_id = (select auth.uid()) or (select private.is_math4fun_admin()));

drop policy if exists profiles_update_own_or_admin on public.profiles;
create policy profiles_update_own_or_admin on public.profiles
for update to authenticated
using (owner_id = (select auth.uid()) or (select private.is_math4fun_admin()))
with check (owner_id = (select auth.uid()) or (select private.is_math4fun_admin()));

-- Reports: students see/create their own reports; only JWT-authorized admin can review/update.
drop policy if exists reports_select_owner_or_admin on public.reports;
create policy reports_select_owner_or_admin on public.reports
for select to authenticated
using (
  exists (select 1 from public.profiles where profiles.id = reports.reporter_id and profiles.owner_id = (select auth.uid()))
  or (select private.is_math4fun_admin())
);

drop policy if exists reports_insert_owner on public.reports;
create policy reports_insert_owner on public.reports
for insert to authenticated
with check (exists (select 1 from public.profiles where profiles.id = reports.reporter_id and profiles.owner_id = (select auth.uid())));

drop policy if exists reports_admin_update on public.reports;
create policy reports_admin_update on public.reports
for update to authenticated
using ((select private.is_math4fun_admin()))
with check ((select private.is_math4fun_admin()));

-- Gold ledger remains owner-readable; admin can audit.
drop policy if exists gold_ledger_select_owner_or_admin on public.gold_ledger;
create policy gold_ledger_select_owner_or_admin on public.gold_ledger
for select to authenticated
using (
  exists (select 1 from public.profiles where profiles.id = gold_ledger.profile_id and profiles.owner_id = (select auth.uid()))
  or (select private.is_math4fun_admin())
);

-- Guardian collection: owner manages own collection; admin may audit/repair records.
drop policy if exists guardian_collection_select_owner_or_admin on public.guardian_collection;
create policy guardian_collection_select_owner_or_admin on public.guardian_collection
for select to authenticated
using (
  exists (select 1 from public.profiles where profiles.id = guardian_collection.profile_id and profiles.owner_id = (select auth.uid()))
  or (select private.is_math4fun_admin())
);

drop policy if exists guardian_collection_insert_owner_or_admin on public.guardian_collection;
create policy guardian_collection_insert_owner_or_admin on public.guardian_collection
for insert to authenticated
with check (
  exists (select 1 from public.profiles where profiles.id = guardian_collection.profile_id and profiles.owner_id = (select auth.uid()))
  or (select private.is_math4fun_admin())
);

drop policy if exists guardian_collection_update_owner_or_admin on public.guardian_collection;
create policy guardian_collection_update_owner_or_admin on public.guardian_collection
for update to authenticated
using (
  exists (select 1 from public.profiles where profiles.id = guardian_collection.profile_id and profiles.owner_id = (select auth.uid()))
  or (select private.is_math4fun_admin())
)
with check (
  exists (select 1 from public.profiles where profiles.id = guardian_collection.profile_id and profiles.owner_id = (select auth.uid()))
  or (select private.is_math4fun_admin())
);

drop policy if exists guardian_collection_delete_owner_or_admin on public.guardian_collection;
create policy guardian_collection_delete_owner_or_admin on public.guardian_collection
for delete to authenticated
using (
  exists (select 1 from public.profiles where profiles.id = guardian_collection.profile_id and profiles.owner_id = (select auth.uid()))
  or (select private.is_math4fun_admin())
);

-- Leaderboard writes can only target owned profiles, except for JWT-authorized admin repair.
drop policy if exists leaderboard_insert_owner_or_admin on public.leaderboard;
create policy leaderboard_insert_owner_or_admin on public.leaderboard
for insert to authenticated
with check (
  exists (select 1 from public.profiles where profiles.id = leaderboard.profile_id and profiles.owner_id = (select auth.uid()))
  or (select private.is_math4fun_admin())
);

drop policy if exists leaderboard_update_owner_or_admin on public.leaderboard;
create policy leaderboard_update_owner_or_admin on public.leaderboard
for update to authenticated
using (
  exists (select 1 from public.profiles where profiles.id = leaderboard.profile_id and profiles.owner_id = (select auth.uid()))
  or (select private.is_math4fun_admin())
)
with check (
  exists (select 1 from public.profiles where profiles.id = leaderboard.profile_id and profiles.owner_id = (select auth.uid()))
  or (select private.is_math4fun_admin())
);
