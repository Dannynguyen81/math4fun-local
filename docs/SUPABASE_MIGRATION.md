# Lộ trình Supabase cho Math4Fun

## Khi nào cần đưa dữ liệu lên Supabase

Phiên bản hiện tại lưu game state theo trình duyệt. Điều này là hợp lý khi phụ huynh và học sinh chỉ chơi trên một máy, nhưng không đáp ứng việc đồng bộ dữ liệu giữa thiết bị, xử lý report tập trung, quản trị ngân hàng câu hỏi chung hay bảng xếp hạng nhiều người. Khi một trong các nhu cầu này trở thành chính thức, Supabase là lớp dữ liệu dùng chung phù hợp.

## Ranh giới nguồn dữ liệu

| Dữ liệu | Trạng thái hiện tại | Đích Supabase |
| --- | --- | --- |
| Hồ sơ, tiến trình Map và chỉ số | localStorage | `profiles.state` cùng các chỉ số tóm tắt |
| Guardian đã thu phục/XP/đội hình | localStorage | `guardian_collection` |
| Câu hỏi, đáp án, nguồn và độ khó | mã nguồn/local state | `questions` |
| Report và phản hồi quản trị | localStorage | `reports` |
| Nhật ký Gold | localStorage | `gold_ledger` |
| Bảng xếp hạng và chỉ số công khai | tổng hợp local | `leaderboard` |
| Asset minh họa | manus-storage/CDN | giữ CDN; Supabase Storage chỉ khi cần upload của người dùng |

## Thứ tự triển khai an toàn

1. Đã tạo migration versioned `supabase/migrations/202608210001_init_math4fun_schema.sql`. Migration này bật RLS cho toàn bộ sáu bảng dữ liệu học sinh.
2. Frontend chỉ dùng URL và publishable key. Mật khẩu/salt/hash local, PIN phụ huynh, cookie và token tuyệt đối không được ghi vào Supabase.
3. Khi trình duyệt có phiên Supabase Auth ẩn danh, một identity này sở hữu nhiều hồ sơ local trên cùng thiết bị. `GameContext` tiếp tục làm cache/UI offline-first; lớp sync chỉ đẩy state đã lọc mật khẩu, Gold ledger, report, guardian và chỉ số leaderboard.
4. Câu hỏi hiện vẫn chạy từ mã nguồn đã đối chiếu. Seed sang `questions` là một migration riêng sau khi nội dung được kiểm tra lại; không được seed câu hỏi suy đoán.
5. Quyền quản trị cloud dựa trên `app_metadata.math4fun_role = "admin"`, do phía server hoặc bảng điều khiển Supabase cấp. Không có trang web nào được tự nâng quyền này.

## Chính sách bảo mật tối thiểu

Mỗi học sinh chỉ đọc/ghi được hồ sơ, guardian, Gold ledger và report của mình. Bảng xếp hạng chỉ công khai tập chỉ số tối thiểu; state đầy đủ vẫn riêng tư. Phụ huynh/admin cần role được xác minh để duyệt report và sửa ngân hàng câu hỏi. Service role chỉ được đặt ở server/Edge Function, không được đưa vào Vite, GitHub Actions log hoặc bundle client. Bản sao lưu JSON của phụ huynh vẫn cần PIN cục bộ theo quy tắc hiện tại.

## Trạng thái triển khai ngày 2026-08-21

Dự án Supabase **Math4Fun** có ref `qxgyjhrmmwkibcpozzau` tại Singapore. Bốn migration đầu tiên tạo sáu bảng chia sẻ, vá bỏ hàm `SECURITY DEFINER` khỏi đường đi RLS, đổi `profiles.id` thành local profile ID để một identity thiết bị có thể sở hữu nhiều hồ sơ học sinh, và cấp quyền đọc tối thiểu cho bảng xếp hạng công khai. Security Advisor không còn cảnh báo và Anonymous sign-ins đã được bật để mỗi thiết bị có identity RLS riêng.

`GameContext` vẫn là cache/UI offline-first. Sau mỗi thay đổi, lớp sync lọc hoàn toàn mật khẩu, salt/hash, PIN phụ huynh, cookie và role cục bộ, sau đó đồng bộ hồ sơ học sinh, Gold ledger, report, guardian và chỉ số xếp hạng. Đồng bộ quét toàn bộ hồ sơ học sinh thay đổi trên cùng thiết bị để phản hồi report do admin cục bộ tạo cũng được đẩy lên cloud. Client dùng URL và **publishable key** (credential công khai được RLS bảo vệ), có thể ghi đè bằng `VITE_SUPABASE_URL` và `VITE_SUPABASE_PUBLISHABLE_KEY`/`VITE_SUPABASE_ANON_KEY`, hoặc tắt bằng `VITE_SUPABASE_SYNC_ENABLED=false`. Không có service-role key, mật khẩu, PIN hay cookie nào được đưa vào bundle hoặc Git.

Giao diện đặt biểu tượng cloud nhỏ cạnh điều khiển ambient trên thanh trên cùng. Tooltip có bốn trạng thái thực tế: **đang đồng bộ**, **đã đồng bộ**, **ngoại tuyến** và **không thể đồng bộ**. Chỉ báo chỉ phản ánh kết nối và kết quả adapter, không hiển thị nội dung hồ sơ, Gold, report hay bất kỳ thông tin học sinh nào.

## Google Sign-in cho cổng landing-first

Phiên bản hiện tại có nút **Tiếp tục với Google** trong hai tab Đăng nhập và Đăng ký. Nút gọi `supabase.auth.signInWithOAuth({ provider: "google" })`, quay về landing với cờ `?auth=google`, sau đó hoàn tất phiên Supabase, tạo hoặc chọn hồ sơ cục bộ tương ứng và mở màn hình chọn avatar nếu đây là lần đầu. Tên đăng nhập/mật khẩu cục bộ, PIN phụ huynh và cookie ứng dụng không được gửi sang Google hoặc Supabase.

| Bước chủ dự án cần thực hiện | Giá trị hoặc vị trí cấu hình |
| --- | --- |
| Tạo OAuth client | Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID, loại Web application |
| Authorized redirect URI | `https://qxgyjhrmmwkibcpozzau.supabase.co/auth/v1/callback` |
| Bật provider | Supabase Dashboard → Authentication → Providers → Google → Enable, sau đó dán Client ID và Client Secret |
| Redirect về website | Supabase Dashboard → Authentication → URL Configuration → thêm `https://math4fun-dyeju3sp.manus.space` và URL preview đang dùng vào danh sách Redirect URLs |
| Kiểm thử an toàn | Đăng nhập bằng tài khoản Google thử nghiệm, xác nhận quay lại landing, chọn avatar, sau đó logout/login để bảo đảm hồ sơ vẫn được nhận diện |

Google OAuth chỉ hoạt động end-to-end sau khi provider được bật và các URL trên được khai báo. Nếu provider chưa cấu hình hoặc bị chặn bởi trình duyệt, popup hiển thị thông báo lỗi, không xóa hồ sơ local và vẫn cho phép học sinh tiếp tục dùng đăng nhập cục bộ.
