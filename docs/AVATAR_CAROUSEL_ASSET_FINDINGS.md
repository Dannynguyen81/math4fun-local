# Avatar carousel asset findings

## Visual review

- `math4fun-onboarding-b01.png` (ONB 01): full-body 3D explorer trên nền olive xanh nâu phẳng, có thể thấy rõ một hình chữ nhật lớn phía sau nhân vật.
- `math4fun-onboarding-b04.png` (ONB 04): full-body 3D explorer trên nền trắng ngà phẳng, cũng tạo cảm giác một khung chữ nhật khi đặt trong panel parchment.

## Design decision

Giữ nguyên nhận diện nhân vật và không cắt nội dung. Ưu tiên dùng nền panel đồng nhất với card carousel và lớp hòa nền nhẹ trong giao diện; nếu cần chỉnh asset, dùng image editing để loại bỏ riêng vùng nền phẳng, giữ nguyên pose, ánh sáng, silhouette và đạo cụ. Carousel sẽ được thu gọn bằng chiều cao responsive, khung ảnh không tràn viewport, và dùng trạng thái loading/transition chỉ trên `opacity`/`transform`.

- `math4fun-onboarding-g01.png` (ONG 01): nền xanh neon phẳng rất nổi, không phù hợp với parchment panel và cần được loại bỏ/hòa nền.
- `math4fun-onboarding-g02.png` (ONG 02): chủ thể có viền trắng dày và các đường kẻ xanh/đen ngang ở vùng nền, cần làm sạch riêng vùng không phải nhân vật mà không ảnh hưởng silhouette/đạo cụ.


## 2026-08-21 — kiểm tra alpha sau lần xử lý nhanh

Bản GrabCut `*-transparent.png` đã tạo đúng kích thước 832×1248 nhưng ảnh xem trực quan vẫn cho thấy nền sọc olive của ONB 01 bị giữ lại ở nhiều vùng. Không dùng các bản này ngay; cần kiểm tra alpha channel riêng và chuyển sang phương án nền phẳng trùng màu panel nếu tách nền không đủ sạch. Bản carousel hiện đã thu gọn tốt trên desktop và mobile, với panel nhân vật nằm gọn trong viewport.


## 2026-08-21 — desktop visual pass sau tinh chỉnh alpha

ONB 01 đã hiển thị sạch trên panel xanh băng, không còn checkerboard; tóc, khuôn mặt, la bàn, tay và giày vẫn đầy đủ. Modal desktop nằm gọn trong viewport 1280×720, hai cột dễ bao quát. Các asset còn lại cần được kiểm tra qua việc chuyển mẫu trong carousel trước khi checkpoint.


## 2026-08-21 — preview ONG 02

Bản alpha keying màu của ONG 02 làm mất mảng tóc và giữ artefact nền. Bản GrabCut khởi tạo theo bounding box chủ thể (`math4fun-onboarding-g02-grabcut.png`) giữ nguyên tóc, khuôn mặt, bản đồ, áo và giày; composite trên màu panel `#dceef6` không còn các sọc nền. Bản này là ứng viên nên dùng cho ONG 02.


## 2026-08-21 — mobile visual pass

Ở viewport 390×844, carousel nằm gọn trong chiều rộng màn hình, panel nhân vật, mô tả, nút điều hướng và CTA đều nhìn thấy; nhân vật không bị cắt. TypeScript và production build đều thành công. Build chỉ còn cảnh báo chunk JS lớn và cảnh báo pnpm field cũ, không phải lỗi runtime.
