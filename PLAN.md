# Game Plan: Math4Fun — Field Journal Quest

## Risk Tasks

### 1. Ngân hàng câu hỏi có nguồn và không lặp
- **Why isolated:** Nội dung phải bám sát hai PDF Archimede, không được suy diễn đề mới như thể là đề nguồn; luật chọn câu phải tránh trùng giữa bài thu phục và Boss.
- **Approach:** Định danh từng câu bằng mã nguồn, chủ đề, bậc E–M–H và pool (`station` hoặc `boss`). Câu trình bày theo phiên được rút bằng thuật toán shuffle có lưu history; thứ tự đáp án cũng được trộn theo seed phiên.
- **Verify:** Không câu Boss nào có mã thuộc câu thu phục cùng phiên; đổi lần vào trạm sẽ thay thứ tự câu/lựa chọn; nguồn và lời giải tồn tại trên từng câu đã mở.

### 2. Tiến độ chống né bài và mức mastery 10 câu
- **Why isolated:** Không được để thoát–vào màn hình xoá nỗ lực, đồng thời không thể cho trẻ mắc kẹt vì một lượt sai.
- **Approach:** Lưu attempts, câu đang chờ, sai/đúng, thứ tự session và mastery theo hồ sơ local. Một câu sai vẫn tiêu hao lượt của session; có thể quay lại trong session khác bằng một câu tương đương đã đối chiếu. Guardian chỉ mở khi đạt tối thiểu 10 đáp án đúng riêng biệt và độ chính xác tối thiểu.
- **Verify:** Refresh/điều hướng vẫn giữ câu dở dang và đáp án sai; không thể reset một trạm bằng cách thoát trang; chưa đủ 10 câu không thể thu phục guardian.

### 3. Boss hai chiều và hoạt ảnh nguyên tố
- **Why isolated:** Phản hồi sát thương, lượt Boss và hiệu ứng không được lệch state khi người dùng bấm nhanh hoặc chuyển route.
- **Approach:** Dùng trạng thái lượt rõ ràng (`choose → resolve → enemy → result`), khoá lựa chọn trong thời gian resolve, tính sát thương có cấp độ câu hỏi/guardian/phép, và lưu trận đang diễn ra. Âm thanh chỉ được bật sau tương tác đầu tiên theo giới hạn browser.
- **Verify:** Đúng vẫn có đòn phản công nhỏ từ Boss; sai nhận sát thương lớn hơn; Boss dùng đúng 5 câu H duy nhất, không lặp trong trận; transition chọn phép → hiệu ứng → phản công không bị chồng.

## Main Build

Xây hồ sơ local cho mỗi học sinh với tên, hình nhân vật, đội tối đa ba guardian, lịch mở tối đa hai chủ đề mỗi tuần và bảng thống kê riêng theo hồ sơ. Mở rộng bản đồ thành 20 trạm curriculum nhưng chỉ bật playable cho những trạm đã có đủ câu nguồn được kiểm tra. Bố cục vẫn là Field Journal Quest: giấy sổ tay, đường chỉ khâu, dấu niêm phong guardian và màu Indigo Trail/Marigold Compass.

- **Assets needed:** Một nền tham chiếu cho arena, một sprite sheet biểu tượng nguyên tố và một badge hồ sơ/đội; tất cả sử dụng URL manus-storage.
- **Verify:** Điều hướng rõ ràng; localStorage không lỗi migration; câu hỏi/đáp án có source; âm thanh không autoplay; giao diện mobile không tràn; không lỗi console khi qua trạm, đổi profile và vào Boss.

