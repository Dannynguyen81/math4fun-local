# Lộ trình Supabase cho Math4Fun

## Khi nào cần đưa dữ liệu lên Supabase

Phiên bản hiện tại lưu game state theo trình duyệt. Điều này là hợp lý khi phụ huynh và học sinh chỉ chơi trên một máy, nhưng không đáp ứng việc đồng bộ dữ liệu giữa thiết bị, xử lý report tập trung, quản trị ngân hàng câu hỏi chung hay bảng xếp hạng nhiều người. Khi một trong các nhu cầu này trở thành chính thức, Supabase là lớp dữ liệu dùng chung phù hợp.

## Ranh giới nguồn dữ liệu

| Dữ liệu | Trạng thái hiện tại | Đích Supabase |
| --- | --- | --- |
| Hồ sơ, guardian, Gold, tiến trình Map | localStorage | `profiles`, `guardian_progress`, `gold_ledger`, `station_progress` |
| Câu hỏi, đáp án, nguồn và độ khó | mã nguồn/local state | `question_bank`, `question_sources` |
| Report và phản hồi quản trị | localStorage | `question_reports`, `report_replies` |
| Bảng xếp hạng và chỉ số | tổng hợp local | view/RPC có RLS |
| Asset minh họa | manus-storage/CDN | giữ CDN; Supabase Storage chỉ khi cần upload của người dùng |

## Thứ tự triển khai an toàn

1. Nâng dự án lên backend an toàn trước khi đưa bất kỳ khóa riêng tư nào vào môi trường chạy.
2. Tạo một dự án Supabase mới hoặc kết nối dự án do chủ sở hữu chỉ định. Bật RLS trước khi import dữ liệu.
3. Tạo migration versioned trong `supabase/migrations/`, sau đó thêm seed chỉ cho dữ liệu câu hỏi đã đối chiếu.
4. Đăng nhập người dùng qua Supabase Auth hoặc tiếp tục dùng tài khoản local trong giai đoạn chuyển tiếp; không chuyển mật khẩu local thô lên cloud.
5. Chuyển từng read path sang Supabase trước, sau đó chuyển write path có audit log, cuối cùng mới làm leaderboard/time sync.
6. Sau migration, dùng `GameContext` như cache/UI state; không giữ hai nguồn ghi dữ liệu dài hạn.

## Chính sách bảo mật tối thiểu

Mỗi học sinh chỉ đọc/ghi được hồ sơ của mình. Phụ huynh/admin cần role được xác minh để duyệt report và sửa ngân hàng câu hỏi. Service role chỉ được đặt ở server/Edge Function, không được đưa vào Vite, GitHub Actions log hoặc bundle client. Bản sao lưu JSON của phụ huynh vẫn cần PIN cục bộ theo quy tắc hiện tại.

