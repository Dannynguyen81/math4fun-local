# Math4Fun — Design Brainstorm

## Three stylistic approaches

### 1. Field Journal Quest

**Very Brief Intro:** Một cuốn sổ thám hiểm toán học sống động, nơi mỗi bài học là một tuyến đường và mỗi guardian là một phát hiện mới. Không khí ấm, có nhịp điệu của giấy, bản đồ và tem sưu tầm.

**Probability:** 0.07

### 2. Chalkboard Gymnasium

**Very Brief Intro:** Một phòng tập toán mang ngôn ngữ bảng phấn, sticker huân chương và thiết bị luyện tập. Tập trung vào cảm giác rõ ràng, năng động và phản hồi kỹ năng trực tiếp.

**Probability:** 0.04

### 3. Paper Observatory

**Very Brief Intro:** Một trạm quan sát số học với giấy cắt lớp, quỹ đạo số và các sinh vật phát sáng nhẹ. Tạo cảm giác tò mò, bình tĩnh và có chiều sâu khám phá.

**Probability:** 0.09

---

## Chosen direction: Field Journal Quest

### Design Movement

**Contemporary editorial field guide** kết hợp bản đồ hành trình giáo dục và game UI mềm mại. Sản phẩm tránh sao chép giao diện Pokémon: asset Pokémon chỉ là tham chiếu nội bộ cho prototype local, còn bố cục, màu và UI mang IP Math4Fun riêng.

### Core Principles

1. **Learning is a route, not a feed.** Người học luôn nhìn thấy đang ở đâu, mục tiêu tiếp theo và lý do mở khóa.
2. **Tactile evidence over decoration.** Tem, đường chỉ, nhãn nhiệm vụ, thẻ sưu tầm và ghi chú viết tay đều phải truyền thông tin tiến trình hoặc mục tiêu học.
3. **One hero, one task.** Mỗi màn hình ưu tiên một hành động học chính; combat chỉ là phần thưởng thị giác sau đáp án.
4. **Safe delight.** Animation ngắn, có nút giảm chuyển động, phản hồi sai mang tính hướng dẫn thay vì trừng phạt.

### Color Philosophy

Nền giấy **Oat Parchment** tạo cảm giác sách bài tập không áp lực. **Indigo Trail** làm khung thông tin và typographic anchor; **Marigold Compass** là signature color cho CTA, XP và bước kế tiếp; **Leaf Green** gắn với mastery; **Coral Spark** dành cho combat/critical feedback. Màu sáng xuất hiện có mục đích, không dùng gradient tím hoặc glow neon.

### Layout Paradigm

Trang dashboard được tổ chức như một **bản đồ hành trình lệch trục**: cột trái là navigation/field notes, giữa là tuyến đường Wing/Station uốn cong, cột phải là mission card và companion. Các section không đồng đều; card dùng như nhãn trên bản đồ thay vì lưới đều tăm tắp.

### Signature Elements

1. **Route thread:** nét chỉ đường chấm–gạch nối các station và thể hiện tiến trình.
2. **Field tags:** nhãn giấy có chấm kim/viền ink để chứa level, loại bài, streak hoặc reward.
3. **Guardian stamp:** portrait guardian nằm trong một huy hiệu tròn có vệt mực/halftone nhẹ; bản local có thể hiển thị ảnh Pokémon tham chiếu.

### Interaction Philosophy

Nút chính luôn dùng động từ học rõ ràng như “Đi vào trạm”, “Xem ví dụ”, “Đấu Boss”. Hover nghiêng nhẹ như nhãn giấy; chọn station làm route thread sáng lên; khi đúng, kết quả xuất hiện ngay gần đáp án trước khi chuyển sang combat feedback.

### Animation

Route thread vẽ dần khi mở Wing; card vào màn hình theo cascade 40–70 ms; guardian idle ở mức rất nhẹ. Combat chỉ gồm anticipate → attack → hit → HP tick, tổng dưới 1,2 giây cho một lượt. Tất cả animation không thiết yếu bị tắt khi `prefers-reduced-motion` bật.

### Typography System

**Fraunces** cho heading, tạo cảm giác sách hướng dẫn giàu cá tính nhưng dễ đọc. **DM Sans** cho body, prompt toán và UI. Heading dùng cỡ lớn, density thấp, line-height chặt; số, XP và kết quả dùng tabular numerals. Không dùng Inter.

### Brand Essence

**Math4Fun biến các dạng toán lớp 4 thành chuyến thám hiểm ngắn có guardian, bản đồ và phản hồi học tập rõ ràng.**

Personality: **curious, reassuring, spirited**.

### Brand Voice

Giọng điệu như một người dẫn đường vui vẻ, không phán xét; ưu tiên động từ cụ thể và bằng chứng tiến bộ.

> “Mở trạm Dãy số — tìm quy luật trước khi Guardian đánh thức.”

> “Bạn đã nhìn ra bước nhảy +4. Hãy biến nó thành đòn tiếp theo.”

### Wordmark & Logo

Logo là **la bàn bốn nhánh ghép từ dấu cộng, đường cong quỹ đạo và một mầm lá**, tạo thành chữ M trừu tượng ở tâm. Wordmark “Math4Fun” dùng Fraunces custom weight, có dấu chỉ hướng nhỏ sau chữ F. Favicon dùng symbol la bàn–dấu cộng, không có text.

### Signature Brand Color

**Marigold Compass — #F6B73C.** Màu vàng cam ấm được dùng riêng cho hành động tiếp theo, đường route đang hoạt động và “aha moment”.

## Style Decisions

- Route map luôn là hệ thống dẫn đường chính: station phải lệch trục trên đường chỉ khâu/dotted path; không được trở lại dạng lưới nhiệm vụ đều.
- Surface chính biểu đạt nhiều lớp giấy, tem, ghim, note và dấu vết tiến bộ; card đồng đều chỉ dành cho lựa chọn đáp án hoặc input học có tính cấu trúc.
- Guardian luôn hiển thị theo hệ thống field-guide stamp với taxonomy, viền mực, seal và nhãn tiến trình; không trình bày như nhân vật game rời rạc.
- Mọi màn hình ngoài bản đồ phải có một route fragment hoặc evidence trail nhìn thấy được để duy trì cảm giác một hành trình liên tục.
- Locked guardian vẫn là một mẫu vật field-guide có niêm phong, taxonomy và dấu vết tiến độ; không dùng ô trống hoặc thẻ xám vô danh.
- Marigold Compass chỉ xuất hiện ở thao tác tiếp theo, route đang hoạt động, XP/bằng chứng tiến độ và phản hồi “aha”; các chi tiết trang trí dùng giấy, Indigo Trail, Leaf Green hoặc Coral Spark thay thế.
