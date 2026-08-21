-- Bảng xếp hạng chỉ chứa chỉ số hiển thị tối thiểu; RLS vẫn giới hạn đúng cột/bản ghi công khai.
grant select on table public.leaderboard to anon, authenticated;
