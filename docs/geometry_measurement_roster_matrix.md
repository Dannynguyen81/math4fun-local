# Roster Matrix: Bộ Ba Pet Chủ Đề Hình học và Đo lường (Math4Fun)

Bộ ba đồng hành nguyên bản này được thiết kế theo chuẩn **Math4Fun Field Journal Quest**, tuân thủ triết lý 3D chibi Nhật Bản dễ thương, vật liệu tactile (giấy da, gốm, gỗ), hệ nguyên tố phong phú và gắn liền với các kỹ năng **Hình học và Đo lường (Geometry & Measurement)** trong chương trình Toán lớp 4 (chu vi, diện tích, góc, đơn vị đo độ dài/khối lượng/thời gian).

## Bảng Roster Matrix

| Pet ID | Name | Silhouette family | Habitat | Element | Role | Dominant hue | Face grammar | Signature motion | Learning link | Differentiators | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `pet-geo-01` | **Cubix** (Khối Vuông Đạc) | Khối hộp lục lăng (Blocky/Geometric) | Thung lũng Thước Kẻ | Đất (Earth) | Tank / Sức bền | Xanh rêu cổ điển (`#4A6B5B`) | Mắt thấu kính to tròn, miệng hình chữ D tò mò, không mũi | Lăn tròn bật nhảy, dùng góc cạnh đo đạc xung quanh | Chu vi và Diện tích hình chữ nhật / hình vuông | 1. Thân hình cấu tạo từ các khối lăng trụ có thể tách rời; 2. Dùng thước gập bằng gỗ làm đuôi; 3. Biểu cảm thay đổi theo số đo diện tích | `needs-human-review` |
| `pet-geo-02` | **Vane** (Gió Xoáy Góc) | Đĩa bay tam giác / Cánh quạt mượt (Aerodynamic Triangle) | Đỉnh Đồi Đo Góc | Gió (Wind) | Striker / Tốc độ | Vàng nghệ Marigold (`#D49B2B`) | Mắt lanh lợi hình cung, miệng cười mỉm tự tin, tai nhọn dạng thước đo độ | Xoay tít như chong chóng, lướt theo các đường thẳng góc vuông | Nhận diện góc nhọn, góc tù, góc vuông và đo độ bằng thước đo góc | 1. Thân cánh quạt xoay 360 độ quanh trục; 2. Cầm bút chì cổ xưa làm trượng; 3. Tạo hiệu ứng luồng gió theo dạng đường kẻ tia phân giác | `needs-human-review` |
| `pet-geo-03` | **Scalera** (Cân Ốc Biển) | Vỏ ốc xoắn ốc đối xứng (Spiral Shell / Balance Beam) | Vịnh Thang Đo | Nước (Water) | Support / Hồi phục | Xanh ngọc Indigo (`#2E4A62`) | Mắt to long lanh dạng bọt nước, má hồng phúng phính, biểu cảm điềm đạm | Bập bênh thăng bằng trên chiếc vỏ ốc xoắn ốc | Chuyển đổi đơn vị đo độ dài (mm, cm, m, km) và khối lượng (g, kg) | 1. Đầu đội mũ hình quả cân đồng cổ điển; 2. Vỏ ốc ghi các vạch chia độ phát sáng; 3. Dùng dòng nước để cân bằng trọng lượng | `needs-human-review` |

## Quyết định cấp Batch (Batch-level Decisions)

- **Shared continuity block:** `3D Japanese chibi game asset style, tactile materials (parched leather, smooth ceramic, polished natural wood), clean soft studio lighting with warm rim light, solid parchment/transparent background, playful proportions, high readability at 48px UI size, zero violent gore, child-safe fantasy explorer aesthetic.`
- **Variation policy:** Mỗi pet thuộc một họ hình học hoàn toàn khác nhau (Khối lập phương - Hợp kim gỗ, Đĩa chong chóng tam giác - Nhựa trong suốt thấu kính, Vỏ ốc cân bằng - Gốm men ngọc kết hợp đồng thau). Bảng màu phân bố độc lập (Xanh rêu, Vàng Marigold, Xanh Indigo) với chất liệu bề mặt và chuyển động đặc trưng không trùng lặp.
- **Education coverage:**
  - *Cubix:* Rèn luyện kỹ năng tính chu vi và diện tích qua ước lượng ô vuông.
  - *Vane:* Rèn luyện kỹ năng phân biệt góc (vuông, nhọn, tù, bẹt) và sử dụng thước đo độ.
  - *Scalera:* Rèn luyện kỹ năng đổi đơn vị đo lường (mét, xăng-ti-mét, ki-lô-gam, gam).
- **Review gates:** Mọi thông số, mã nguồn và prompt đều được kiểm định tự động bằng `validate_pet_spec.py` và `validate_prompt_pack.py`. Trạng thái hiện tại là `needs-human-review` chờ phê duyệt cuối cùng từ chuyên gia giáo dục.
