# Math4Fun Structure

## Quyết định kiến trúc

Math4Fun tiếp tục là **React static local-first**, thay vì chuyển sang canvas 3D. Game là một learning journey giàu giao diện và trạng thái, không cần world physics; React/Wouter giữ khả năng đọc nội dung Toán, truy cập và responsive tốt hơn. Combat vẫn có state machine rõ ràng, Framer Motion và hiệu ứng CSS để phản hồi trực quan.

## Cấu trúc dữ liệu

`client/src/game/gameData.ts` chứa curriculum, guardian, phép và dữ liệu câu hỏi đã kiểm chứng. `client/src/contexts/GameContext.tsx` là nguồn state duy nhất: profiles, lịch mở tuần, mastery, attempt history, seed thứ tự, đội guardian, combat và metrics local. Các màn hình chỉ gọi action context, không tự tính luật unlock.

| Khối | Trách nhiệm |
| --- | --- |
| `gameData.ts` | Chủ đề, guardian, phép, question metadata và source của câu đã kiểm chứng. |
| `GameContext.tsx` | Migration localStorage, profile, daily/session state, mastery 10 câu, weekly unlock, battle state và aggregate metrics. |
| `GameLayout.tsx` | HUD hồ sơ đang chọn, route trail, âm lượng và điều hướng. |
| `StationPage.tsx` | Session câu hỏi đã shuffle, phản hồi đúng/sai, không reset attempt khi đổi route. |
| `BossPage.tsx` | State machine turn-based, 5 câu H không lặp, phép thuật và sát thương hai chiều. |
| `CollectionPage.tsx` | Bộ sưu tập, đội battle và tiến độ unlock chậm. |
| `StatsPage.tsx` | Thống kê local theo hồ sơ: lượt học, độ chính xác, chủ đề, chuỗi ngày và hồ sơ battle. |

## Mở rộng hai bản đồ

| Khối | Trách nhiệm bổ sung |
| --- | --- |
| `gameData.ts` | Map membership, question-mix 4E/3M/3H, Boss Map 1 và phép Huấn luyện theo cấp guardian. |
| `GameContext.tsx` | Migration `map1BossDefeated`, answer streak/Gold, XP Huấn luyện và battle mode riêng. |
| `MapPage.tsx` | Chuyển Map 1/Tập 1 và Map 2/Tập 2; CTA Boss Map 1; companion dialogue. |
| `MapBossPage.tsx` | Trận 10 câu tổng hợp M/H để mở Map 2. |
| `BossPage.tsx` | Huấn luyện Pet PvP; tránh viết Gold, khôi phục HP khi trận đóng. |

`/boss` được giữ làm URL Huấn luyện Pet để không làm hỏng bookmark cũ. Boss Map 1 dùng route chuyên biệt `/map-1-boss`, bởi hai mode có luật thưởng và luật HP khác nhau.

## Local-only boundary

Hồ sơ, thống kê truy cập và tiến độ chỉ tồn tại trong `localStorage` của trình duyệt đang dùng. Bản static không thể cho phụ huynh xem dữ liệu từ máy khác hoặc tạo traffic analytics chung; khi cần điều đó, dự án cần backend có đồng ý của gia đình.
