# Thiết kế tiến trình v6 — Math4Fun Field Journal

## Phạm vi đợt mở rộng

Đợt này tạo một vòng lặp rõ ràng: học và chiến đấu tạo **Gold**, Gold mua vật phẩm, vật phẩm hồi sức cho guardian, còn các guardian cạn sinh lực phải được thu phục lại bằng chính bằng chứng học tập. Mọi dữ liệu vẫn chỉ lưu ở trình duyệt, không có cơ chế thanh toán hoặc tài khoản trực tuyến.

| Hệ thống | Quy tắc đã chọn |
| --- | --- |
| Huy hiệu nguyên tố | Mỗi hệ nhận một huy hiệu đặc biệt khi tổng XP hệ đó đạt **300 XP**, tương ứng hoàn thành Bậc 1–3. Huy hiệu được suy ra từ XP, không thể mất do khôi phục dữ liệu cũ. |
| Gold | Mỗi câu trả lời đều nhận Gold: trạm đúng nhận 12/18/25 Gold theo E/M/H, sai nhận 4 Gold; Boss đúng nhận 30 Gold, sai nhận 10 Gold. |
| Kho đồ | Mỗi hồ sơ giữ số lượng vật phẩm theo mã; bình hồi sức là tài sản cục bộ và không thể đổi thành tiền. |
| Shop | Ba bình có giá cân bằng cho 10 câu đầu: 25% HP giá 35 Gold; 50% HP giá 60 Gold; 100% HP giá 110 Gold. |
| Sinh lực guardian | Mỗi guardian có HP và mốc thời gian cập nhật. Cứ đủ một giờ trôi qua, guardian hồi 20 HP, tối đa 100 HP. |
| Mất guardian | Khi guardian đang chiến đấu giảm về 0 HP, guardian bị gỡ khỏi Bộ sưu tập và Đội battle; trạm gắn với guardian cũng bị xóa evidence/mastery để người chơi phải thu phục lại. |
| Vật phẩm hồi phục | Có thể dùng từ Kho đồ cho guardian đang sở hữu khi không có trận Boss hoạt động. |
| PIN phụ huynh | PIN gồm 4–8 số; thiết lập kèm một câu hỏi bảo mật và câu trả lời. Đổi PIN cần PIN hiện tại. Đặt lại PIN cần trả lời đúng câu hỏi bảo mật, sau đó tạo PIN mới. Cả PIN lẫn câu trả lời chỉ được lưu dưới dạng SHA-256 kèm salt. |
| Vào/thoát game | “Vào game” chọn hồ sơ local; “Thoát game” chỉ bỏ chọn hồ sơ hiện hành và trở lại `/start`, không xóa dữ liệu. |

## Cấu trúc dữ liệu dự kiến

| Kiểu | Các trường cốt lõi |
| --- | --- |
| `StudentProfile` | `gold`, `inventory`, `guardianHealth`, `guardianLosses`, ngoài tiến trình hiện có. |
| `GuardianHealth` | `hp` và `updatedAt`; HP hiệu dụng được tính khi đọc theo quy tắc 20 HP/giờ. |
| `BattleState` | Thêm `guardianId` để gắn mọi sát thương trận Boss vào đúng companion. |
| `ParentPinRecord` | Bổ sung mã câu hỏi, salt/hash câu trả lời an toàn bên cạnh salt/hash PIN hiện có. |
| `ShopItem` | `id`, `label`, `price`, `heal`, `description`, để trang Shop và state không trùng luật. |

## Nội dung học được mở

| Trạm | Nội dung | Nguồn kiểm chứng | Số câu |
| --- | --- | --- | ---: |
| `T1-08` | Bài toán tổng–hiệu | Tập 1, trang PDF 46–50; ghi chú `tap1_total_difference_notes.md` | 10 |
| `T2-04` | Bài toán rút về đơn vị | Tập 2, trang PDF 33–39; ghi chú `tap2_question_verification_notes.md` | 10 |

> Trạm đang gắn nhãn `T1-08 Nhân & chia` phải được điều chỉnh về `T1-09` để khớp sơ đồ chương trình; ID bài tập cũ được giữ để không làm hỏng tiến độ local.
