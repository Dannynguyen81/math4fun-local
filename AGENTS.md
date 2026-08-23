# Quy ước cộng tác Math4Fun

## Mục tiêu và giới hạn

Math4Fun là game học Toán lớp 4 dùng nội bộ, có tham chiếu Pokémon phi thương mại. Giao diện dùng tiếng Việt, phong cách **Field Journal Quest**: parchment, Indigo Trail, Marigold Compass, Fraunces, route chỉ khâu và dossier/tiêu bản.

## Quy trình thay đổi

1. Đọc `PLAN.md`, `ideas.md`, `todo.md` và các tệp liên quan trước khi sửa.
2. Giữ đúng dữ liệu câu hỏi đã kiểm tra. Khi thay đổi câu hỏi/đáp án/gợi ý, nêu nguồn và không tự suy đoán.
3. Không xóa hoặc reset tiến trình localStorage, migration tương thích dữ liệu cũ là bắt buộc.
4. Với giao diện, tránh dashboard chung chung; mỗi trang phải giữ một artifact hành trình rõ ràng.
5. Với hoạt ảnh, chỉ animate `transform` và `opacity`; tôn trọng `prefers-reduced-motion`.
6. Chạy `pnpm check && pnpm build` trước khi commit. Kèm ảnh kiểm tra nếu thay đổi bố cục lớn.

## Guardian / Pet art direction

- Trước khi tạo mới, chỉnh sửa hoặc thay thế bất kỳ Guardian/Pet nào, bắt buộc đọc `AI_SKILLS/math4fun-pet-designer/SKILL.md` và tuân theo skill này như chuẩn art direction chính thức.
- Guardian/Pet mới phải có thiết kế nguyên bản; không mô phỏng hoặc tạo hình quá gần creature/nhân vật của game, phim hay thương hiệu khác.
- Nếu dùng ảnh do người dùng/trẻ em tự vẽ làm creative seed, giữ các đặc trưng nhận diện cốt lõi nhưng phải nâng cấp theo visual language Math4Fun và ghi rõ `preserved_traits` trong pet spec.
- Phép thuật phải gắn với hệ Ngũ hành và hình thái của pet, không chỉ thêm particle effect bên ngoài.
- Khi tạo theo batch, phải kiểm tra diversity về silhouette, body archetype, tail/ear/horn language, movement và combat role.
- Chỉ sửa dữ liệu/code Guardian khi yêu cầu công việc bao gồm tích hợp vào game; nếu chỉ được yêu cầu artwork/concept thì không thay đổi progression hoặc game logic.

## Quy ước Git

- Làm việc trên nhánh `feat/`, `fix/`, `docs/` hoặc `chore/`; không push trực tiếp lên `main` khi có Agent khác cùng làm việc.
- Một pull request chỉ nên giải quyết một nhóm thay đổi rõ ràng.
- Không commit `.env*`, token Supabase, khóa service role, localStorage export, log hoặc tệp build.
- Giữ `README.md`, `todo.md` và tài liệu migration đồng bộ với thay đổi kiến trúc.

## Supabase khi được kích hoạt

Schema chính thức sẽ nằm trong `supabase/migrations/`; RLS phải được bật trên mọi bảng chứa dữ liệu học sinh. Frontend chỉ dùng khóa public/anon; các thao tác quản trị dùng endpoint server đã xác thực hoặc Supabase Edge Function, không dùng service role trên trình duyệt.

