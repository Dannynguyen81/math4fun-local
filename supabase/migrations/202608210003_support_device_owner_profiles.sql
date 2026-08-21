-- Math4Fun supports several local student journals on one browser.
-- A Supabase Auth user owns those local profile IDs rather than being the profile ID.

drop policy if exists profiles_select_own_or_admin on public.profiles;
drop policy if exists profiles_insert_own_or_admin on public.profiles;
drop policy if exists profiles_update_own_or_admin on public.profiles;
drop policy if exists reports_select_owner_or_admin on public.reports;
drop policy if exists reports_insert_owner on public.reports;
drop policy if exists reports_admin_update on public.reports;
drop policy if exists gold_ledger_select_owner_or_admin on public.gold_ledger;
drop policy if exists gold_ledger_insert_owner on public.gold_ledger;
drop policy if exists guardian_collection_select_owner_or_admin on public.guardian_collection;
drop policy if exists guardian_collection_insert_owner_or_admin on public.guardian_collection;
drop policy if exists guardian_collection_update_owner_or_admin on public.guardian_collection;
drop policy if exists guardian_collection_delete_owner_or_admin on public.guardian_collection;
drop policy if exists leaderboard_insert_owner_or_admin on public.leaderboard;
drop policy if exists leaderboard_update_owner_or_admin on public.leaderboard;

alter table public.reports drop constraint if exists reports_reporter_id_fkey;
alter table public.reports drop constraint if exists reports_reviewed_by_fkey;
alter table public.gold_ledger drop constraint if exists gold_ledger_profile_id_fkey;
alter table public.guardian_collection drop constraint if exists guardian_collection_profile_id_fkey;
alter table public.leaderboard drop constraint if exists leaderboard_profile_id_fkey;
alter table public.profiles drop constraint if exists profiles_id_fkey;

alter table public.profiles add column owner_id uuid references auth.users(id) on delete cascade;
update public.profiles set owner_id = id where owner_id is null;
alter table public.profiles alter column owner_id set not null;
update public.profiles set local_profile_id = id::text where local_profile_id is null;
alter table public.profiles alter column id type text using id::text;

alter table public.reports alter column reporter_id type text using reporter_id::text;
alter table public.reports alter column reviewed_by type text using reviewed_by::text;
alter table public.gold_ledger alter column profile_id type text using profile_id::text;
alter table public.guardian_collection alter column profile_id type text using profile_id::text;
alter table public.leaderboard alter column profile_id type text using profile_id::text;

alter table public.reports add constraint reports_reporter_id_fkey foreign key (reporter_id) references public.profiles(id) on delete cascade;
alter table public.reports add constraint reports_reviewed_by_fkey foreign key (reviewed_by) references public.profiles(id) on delete set null;
alter table public.gold_ledger add constraint gold_ledger_profile_id_fkey foreign key (profile_id) references public.profiles(id) on delete cascade;
alter table public.guardian_collection add constraint guardian_collection_profile_id_fkey foreign key (profile_id) references public.profiles(id) on delete cascade;
alter table public.leaderboard add constraint leaderboard_profile_id_fkey foreign key (profile_id) references public.profiles(id) on delete cascade;

create policy profiles_select_own_or_admin on public.profiles
for select to authenticated
using (owner_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy profiles_insert_own_or_admin on public.profiles
for insert to authenticated
with check (owner_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy profiles_update_own_or_admin on public.profiles
for update to authenticated
using (owner_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false))
with check (owner_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy reports_select_owner_or_admin on public.reports
for select to authenticated
using (
  exists (select 1 from public.profiles where profiles.id = reports.reporter_id and profiles.owner_id = auth.uid())
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false)
);

create policy reports_insert_owner on public.reports
for insert to authenticated
with check (exists (select 1 from public.profiles where profiles.id = reports.reporter_id and profiles.owner_id = auth.uid()));

create policy reports_admin_update on public.reports
for update to authenticated
using (coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false))
with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false));

create policy gold_ledger_select_owner_or_admin on public.gold_ledger
for select to authenticated
using (
  exists (select 1 from public.profiles where profiles.id = gold_ledger.profile_id and profiles.owner_id = auth.uid())
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false)
);

create policy gold_ledger_insert_owner on public.gold_ledger
for insert to authenticated
with check (exists (select 1 from public.profiles where profiles.id = gold_ledger.profile_id and profiles.owner_id = auth.uid()));

create policy guardian_collection_select_owner_or_admin on public.guardian_collection
for select to authenticated
using (
  exists (select 1 from public.profiles where profiles.id = guardian_collection.profile_id and profiles.owner_id = auth.uid())
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false)
);

create policy guardian_collection_insert_owner_or_admin on public.guardian_collection
for insert to authenticated
with check (
  exists (select 1 from public.profiles where profiles.id = guardian_collection.profile_id and profiles.owner_id = auth.uid())
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false)
);

create policy guardian_collection_update_owner_or_admin on public.guardian_collection
for update to authenticated
using (
  exists (select 1 from public.profiles where profiles.id = guardian_collection.profile_id and profiles.owner_id = auth.uid())
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false)
)
with check (
  exists (select 1 from public.profiles where profiles.id = guardian_collection.profile_id and profiles.owner_id = auth.uid())
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false)
);

create policy guardian_collection_delete_owner_or_admin on public.guardian_collection
for delete to authenticated
using (
  exists (select 1 from public.profiles where profiles.id = guardian_collection.profile_id and profiles.owner_id = auth.uid())
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false)
);

create policy leaderboard_insert_owner_or_admin on public.leaderboard
for insert to authenticated
with check (
  exists (select 1 from public.profiles where profiles.id = leaderboard.profile_id and profiles.owner_id = auth.uid())
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false)
);

create policy leaderboard_update_owner_or_admin on public.leaderboard
for update to authenticated
using (
  exists (select 1 from public.profiles where profiles.id = leaderboard.profile_id and profiles.owner_id = auth.uid())
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false)
)
with check (
  exists (select 1 from public.profiles where profiles.id = leaderboard.profile_id and profiles.owner_id = auth.uid())
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false)
);

comment on column public.profiles.owner_id is 'Supabase Auth user sở hữu các hồ sơ cục bộ trên cùng thiết bị.';
