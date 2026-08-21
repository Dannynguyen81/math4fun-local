# Biên bản kiểm thử giao diện và đồng bộ

## 2026-08-21 — Phản hồi phần thưởng Gold

Đã kiểm tra `pnpm check` và `pnpm build` thành công sau khi thêm `playGoldGainSound` trong Web Audio API, bộ so sánh Gold theo hồ sơ đang hoạt động và hoạt ảnh xoay nhẹ cho đồng tiền 3D. Ảnh xem trước của trang chủ và trang khởi tạo hiển thị ổn định; thanh trên không bị tràn hoặc che các điều khiển cloud/âm thanh. Âm ting chỉ được kích hoạt khi số Gold tăng sau thời điểm hydrate, tôn trọng `audioEnabled`, và không phát lại khi học sinh đổi hồ sơ hoặc tải tiến độ cũ. Hoạt ảnh bị vô hiệu hóa theo quy tắc `prefers-reduced-motion` toàn cục.
