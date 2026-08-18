# Math4Fun Local Prototype — Checklist

- [x] Xác nhận scaffold web local đã sẵn sàng và các file thiết yếu hoạt động.
- [x] Viết `ideas.md` với một design direction được chọn cho Math4Fun.
- [x] Chuẩn bị asset Pokémon nội bộ, local-only và ghi nguồn sử dụng.
- [x] Xây dựng dashboard, Gym map, Station Detail và thử thách mẫu Toán 4.
- [x] Thêm combat feedback, collection, streak và lưu tiến trình local.
- [x] Kiểm thử responsive, kiểm tra trực quan, lưu checkpoint và bàn giao.

## Nội dung Toán 4 đã kiểm chứng

- [x] Trích từng bài toán dự kiến dùng từ PDF Archimede và ghi số trang/bài.
- [x] Tính lại đáp án, kiểm tra phép tính và viết gợi ý theo phương pháp sách.
- [x] Thay câu hỏi mẫu trong station bằng ngân hàng câu hỏi đã xác nhận.
- [x] Kiểm thử đáp án đúng/sai, gợi ý, nguồn trang và combat feedback.
- [x] Lưu checkpoint bản nội dung Toán 4 đã xác minh.

## Hoàn thiện game local

- [x] Chuẩn hóa game state, unlock rule và lưu/khôi phục dữ liệu localStorage.
- [x] Mở rộng ngân hàng câu hỏi Toán 4 có nguồn kiểm chứng theo từng station.
- [x] Làm các khu vực Bản đồ học, Bộ sưu tập, Trạm học và Đấu Boss có thể truy cập.
- [x] Thêm gameplay hoàn chỉnh: XP, streak, unlock guardian, tiến độ và combat turn.
- [x] Kiểm thử điều hướng, luồng học, local persistence và responsive; lưu checkpoint.

## Nâng cấp theo phản hồi chơi thử

- [x] Đối chiếu PDF Toán 4 Tập 2 và lập lộ trình 20 chủ đề nhỏ thuộc các chủ đề lớn.
- [x] Thiết kế ngân hàng câu hỏi E–M–H, thứ tự xáo trộn và chống lặp câu hỏi khi chơi lại.
- [x] Tăng yêu cầu mastery lên tối thiểu 10 câu/trạm, lưu điểm sai/dở dang để không thể thoát–vào làm lại từ đầu.
- [x] Xây Boss 5 câu khó không trùng câu thu phục; cân bằng sát thương hai chiều và phép thuật nguyên tố.
- [x] Thêm tạo hồ sơ local, chọn nhân vật, đội guardian dùng để chiến đấu và giới hạn mở hai chủ đề mỗi tuần.
- [x] Thêm hiệu ứng âm thanh, dashboard thống kê học tập local và kiểm thử cân bằng toàn bộ game.
- [ ] Tiếp tục đối chiếu và bổ sung tối thiểu 10 câu E–M–H cho từng chủ đề 4–20 trước khi cho phép mở toàn bộ lộ trình.

## Guardian và phép thuật

- [x] Rà soát thuộc tính nguyên tố của từng guardian và gán đúng phép đặc trưng, bao gồm Pikachu hệ Sấm sét.
- [x] Thêm hoạt ảnh guardian chủ động tung phép, đòn bay, va chạm và phản công trong trận Boss.
- [x] Tạo đoạn minh họa Manim ngắn cho kỹ năng Sấm sét và tích hợp như tư liệu luyện phép local.
- [x] Kiểm tra màn hình Boss, hiệu năng hoạt ảnh và lưu checkpoint.

## Video phép nguyên tố

- [x] Viết phân cảnh Manim không lời cho phép hệ Lửa, Nước và Độc theo từng guardian.
- [x] Render và kiểm tra trực quan ba clip minh họa phép thuật.
- [x] Tích hợp clip đúng theo guardian được chọn trong đấu trường Boss.
- [x] Kiểm thử màn hình Boss, lưu checkpoint và bàn giao bản nâng cấp.

## Hoàn thiện hệ ma thuật

- [x] Tạo clip Manim không lời cho phép hệ Gió và Đất, đồng bộ với phong cách Sổ Phép hiện có.
- [x] Tạo hiệu ứng âm thanh riêng cho sáu nguyên tố: Sấm sét, Lửa, Nước, Độc, Gió và Đất.
- [x] Xây trang Sổ Phép để học sinh xem lại video/âm thanh của các guardian đã thu phục.
- [x] Tích hợp hiệu ứng âm thanh vào combat, kiểm thử và lưu checkpoint.

## Thành tựu và phân tích ma thuật

- [x] Lưu lịch sử xem clip nguyên tố và mở huy hiệu khi xem đủ sáu hệ.
- [x] Theo dõi số lần dùng từng phép và hiển thị hệ phép được dùng nhiều nhất trong Thống kê.
- [x] Thêm bảng tương khắc mạnh/yếu của sáu nguyên tố vào Sổ Phép.
- [x] Kiểm thử quyền mở, dữ liệu local và lưu checkpoint.

## Tiến độ và sao lưu ma thuật

- [x] Thêm XP, cấp độ và mốc mở riêng cho từng nguyên tố.
- [x] Tạo nhiệm vụ tuần yêu cầu dùng đúng phép nguyên tố trong Boss combat.
- [x] Hiển thị tiến độ XP nguyên tố và nhiệm vụ tuần trong Sổ Phép/Thống kê.
- [x] Thêm xuất và nhập hồ sơ học sinh JSON có kiểm tra dữ liệu an toàn.
- [ ] Kiểm thử local persistence, khôi phục JSON và lưu checkpoint.

## Phần thưởng, bảo vệ phụ huynh và trạm niêm phong

- [x] Thiết kế và tích hợp lễ chúc mừng hình ảnh/âm thanh khi một nguyên tố tăng bậc.
- [x] Thêm thiết lập PIN phụ huynh trong hồ sơ local và yêu cầu PIN trước khi khôi phục JSON.
- [x] Rà soát tài liệu Archimede đã đối chiếu để chọn câu hỏi chính xác cho hai trạm được mở trong đợt này.
- [x] Bổ sung hai bộ 10 thử thách E–M–H, giữ xáo trộn và chống lặp, cho T2.03 và T1.08.
- [x] Kiểm tra TypeScript, build và giao diện của luồng mới; cần chơi thử thủ công thêm với hồ sơ thật và tệp JSON thực tế.

## Tiến trình, kinh tế và hành trình guardian

- [x] Thiết kế huy hiệu nguyên tố và điều kiện mở khi hoàn thành đủ ba bậc XP của một hệ.
- [x] Đối chiếu PDF Archimede và mở thêm hai trạm tiếp theo, mỗi trạm có đúng 10 câu hỏi kèm nguồn, gợi ý và đáp án kiểm chứng.
- [x] Bổ sung câu hỏi bảo mật, đổi PIN và đặt lại PIN phụ huynh theo luồng local an toàn.
- [x] Cải tổ tạo hồ sơ với bộ hình đại diện dễ thương, chọn nhanh và hiển thị rõ nhân vật đã chọn.
- [x] Thêm Gold cho mỗi câu trả lời, kho đồ cá nhân và dữ liệu sản phẩm Shop.
- [x] Thiết kế hồi máu theo thời gian, bình hồi phục 25%/50%/100% và luồng mua/dùng vật phẩm.
- [x] Áp dụng luật guardian hết HP bị mất, gỡ khỏi đội và phải thu phục lại qua trạm.
- [x] Kiểm tra TypeScript, build và các màn hình đại diện; cần chơi thử thủ công thêm chuỗi chiến đấu dài, mua/dùng bình và đặt lại PIN với dữ liệu thật.

## Mở rộng nhân vật, nhịp học và hình học

- [x] Đối chiếu PDF Archimede để chọn hai chủ đề hình học kế tiếp và ghi nguồn, đáp án, gợi ý cho 20 câu mới.
- [x] Mở rộng danh mục thành 20 thẻ nhân vật, cân bằng 10 bé trai và 10 bé gái, có lựa chọn dễ nhận biết trong hồ sơ.
- [x] Rà soát nhịp Gold trên từng đáp án và điều chỉnh giá ba bình hồi phục theo số câu học cần thiết.
- [x] Thêm huy hiệu chuỗi học 7 ngày và 14 ngày, hiển thị rõ trong hồ sơ/thống kê.
- [x] Mở hai trạm hình học đã đối chiếu và giữ luật Mastery 10 câu, xáo trộn, không lặp.
- [x] Kiểm tra TypeScript, build và giao diện chính; cần chơi thử thủ công nhiều ngày để xác thực mốc chuỗi 7/14 ngày.

## Tài khoản cục bộ và bảng xếp hạng

- [x] Thêm tên đăng nhập và mật khẩu đã băm cho từng hồ sơ local, giữ tương thích các hồ sơ cũ.
- [x] Thiết kế luồng đăng nhập, chuyển hồ sơ và đăng xuất rõ ràng trên thiết bị dùng chung.
- [x] Tạo bảng xếp hạng local xếp theo thành tích học tập, huy hiệu, guardian thu phục và tiến độ tổng.
- [x] Thêm trang/tuyến Bảng xếp hạng và diễn giải rõ phạm vi cạnh tranh trên cùng thiết bị.
- [x] Kiểm tra TypeScript, build và trạng thái xếp hạng trống; cần thử thủ công đăng nhập sai và chuyển nhiều hồ sơ trước khi dùng trên thiết bị chung.
