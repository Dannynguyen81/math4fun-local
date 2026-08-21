-- Math4Fun initial shared-data schema.
-- The browser remains offline-first. This schema stores synchronized state only
-- after a profile has a Supabase Auth session; password material is never copied here.

create or replace function public.is_math4fun_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'math4fun_role') = 'admin', false);
$$;

revoke all on function public.is_math4fun_admin() from public;
grant execute on function public.is_math4fun_admin() to authenticated;

create or replace function public.set_math4fun_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  local_profile_id text unique,
  username text unique,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 64),
  avatar text not null default 'compass',
  state jsonb not null default '{}'::jsonb,
  state_version integer not null default 14 check (state_version >= 1),
  xp integer not null default 0 check (xp >= 0),
  gold integer not null default 0 check (gold >= 0),
  streak integer not null default 0 check (streak >= 0),
  map1_boss_defeated boolean not null default false,
  map2_boss_defeated boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.questions (
  id text primary key,
  station_id integer not null check (station_id > 0),
  source text not null,
  prompt text not null,
  supporting_text text,
  choices integer[] not null check (cardinality(choices) >= 2),
  answer integer not null,
  hint text not null,
  explanation text not null,
  difficulty text not null check (difficulty in ('E', 'M', 'H')),
  pool text not null check (pool in ('station', 'boss')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.reports (
  id text primary key,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  question_id text not null,
  category text not null check (category in ('answer', 'prompt', 'source', 'other')),
  note text not null check (char_length(btrim(note)) between 1 and 1200),
  status text not null default 'new' check (status in ('new', 'reviewing', 'resolved')),
  admin_reply text,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  handling_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.gold_ledger (
  id text primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null check (amount <> 0),
  category text not null check (category in ('answer', 'hint', 'station-open', 'shop', 'set-reward')),
  label text not null check (char_length(btrim(label)) between 1 and 180),
  created_at timestamptz not null default timezone('utc', now())
);

create table public.guardian_collection (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  guardian_id text not null,
  collected_at timestamptz not null default timezone('utc', now()),
  training_xp integer not null default 0 check (training_xp >= 0),
  health integer not null default 100 check (health between 0 and 100),
  is_in_team boolean not null default false,
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (profile_id, guardian_id)
);

create table public.leaderboard (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 64),
  avatar text not null default 'compass',
  score integer not null default 0 check (score >= 0),
  level integer not null default 1 check (level >= 1),
  badges integer not null default 0 check (badges >= 0),
  guardians integer not null default 0 check (guardians >= 0),
  stations integer not null default 0 check (stations >= 0),
  streak integer not null default 0 check (streak >= 0),
  updated_at timestamptz not null default timezone('utc', now())
);

create index profiles_updated_at_idx on public.profiles (updated_at desc);
create index questions_station_difficulty_idx on public.questions (station_id, difficulty, pool);
create index reports_reporter_status_idx on public.reports (reporter_id, status, updated_at desc);
create index reports_status_updated_idx on public.reports (status, updated_at desc);
create index gold_ledger_profile_created_idx on public.gold_ledger (profile_id, created_at desc);
create index guardian_collection_profile_idx on public.guardian_collection (profile_id, collected_at desc);
create index leaderboard_score_idx on public.leaderboard (score desc, streak desc, updated_at desc);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_math4fun_updated_at();

create trigger questions_set_updated_at
before update on public.questions
for each row execute function public.set_math4fun_updated_at();

create trigger reports_set_updated_at
before update on public.reports
for each row execute function public.set_math4fun_updated_at();

create trigger guardian_collection_set_updated_at
before update on public.guardian_collection
for each row execute function public.set_math4fun_updated_at();

alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.reports enable row level security;
alter table public.gold_ledger enable row level security;
alter table public.guardian_collection enable row level security;
alter table public.leaderboard enable row level security;

create policy profiles_select_own_or_admin on public.profiles
for select to authenticated
using (id = auth.uid() or public.is_math4fun_admin());

create policy profiles_insert_own_or_admin on public.profiles
for insert to authenticated
with check (id = auth.uid() or public.is_math4fun_admin());

create policy profiles_update_own_or_admin on public.profiles
for update to authenticated
using (id = auth.uid() or public.is_math4fun_admin())
with check (id = auth.uid() or public.is_math4fun_admin());

create policy questions_read_authenticated on public.questions
for select to authenticated
using (true);

create policy questions_admin_write on public.questions
for all to authenticated
using (public.is_math4fun_admin())
with check (public.is_math4fun_admin());

create policy reports_select_owner_or_admin on public.reports
for select to authenticated
using (reporter_id = auth.uid() or public.is_math4fun_admin());

create policy reports_insert_owner on public.reports
for insert to authenticated
with check (reporter_id = auth.uid());

create policy reports_admin_update on public.reports
for update to authenticated
using (public.is_math4fun_admin())
with check (public.is_math4fun_admin());

create policy gold_ledger_select_owner_or_admin on public.gold_ledger
for select to authenticated
using (profile_id = auth.uid() or public.is_math4fun_admin());

create policy gold_ledger_insert_owner on public.gold_ledger
for insert to authenticated
with check (profile_id = auth.uid());

create policy guardian_collection_select_owner_or_admin on public.guardian_collection
for select to authenticated
using (profile_id = auth.uid() or public.is_math4fun_admin());

create policy guardian_collection_insert_owner_or_admin on public.guardian_collection
for insert to authenticated
with check (profile_id = auth.uid() or public.is_math4fun_admin());

create policy guardian_collection_update_owner_or_admin on public.guardian_collection
for update to authenticated
using (profile_id = auth.uid() or public.is_math4fun_admin())
with check (profile_id = auth.uid() or public.is_math4fun_admin());

create policy guardian_collection_delete_owner_or_admin on public.guardian_collection
for delete to authenticated
using (profile_id = auth.uid() or public.is_math4fun_admin());

create policy leaderboard_read_authenticated on public.leaderboard
for select to authenticated
using (true);

create policy leaderboard_insert_owner_or_admin on public.leaderboard
for insert to authenticated
with check (profile_id = auth.uid() or public.is_math4fun_admin());

create policy leaderboard_update_owner_or_admin on public.leaderboard
for update to authenticated
using (profile_id = auth.uid() or public.is_math4fun_admin())
with check (profile_id = auth.uid() or public.is_math4fun_admin());

revoke all on table public.profiles, public.questions, public.reports, public.gold_ledger, public.guardian_collection, public.leaderboard from anon;
grant select, insert, update, delete on table public.profiles, public.questions, public.reports, public.gold_ledger, public.guardian_collection, public.leaderboard to authenticated;

comment on table public.profiles is 'Dữ liệu đồng bộ của một hồ sơ Math4Fun; không chứa mật khẩu local.';
comment on table public.questions is 'Ngân hàng câu hỏi đã kiểm chứng; chỉ admin có app_metadata.math4fun_role=admin mới được chỉnh sửa.';
comment on table public.reports is 'Report câu hỏi và phản hồi quản trị.';
comment on table public.gold_ledger is 'Nhật ký Gold chỉ ghi thêm, thuộc một hồ sơ.';
comment on table public.guardian_collection is 'Guardian đã thu phục, XP luyện và đội hình đồng bộ.';
comment on table public.leaderboard is 'Chỉ số công khai tối thiểu phục vụ bảng xếp hạng Math4Fun.';
