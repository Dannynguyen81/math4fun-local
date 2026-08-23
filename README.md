# Math4Fun — Học Toán lớp 4 qua hành trình guardian

Math4Fun là ứng dụng React + TypeScript dành cho học sinh lớp 4, theo ngôn ngữ thiết kế **Field Journal Quest**. Trò chơi dùng trạm học, guardian, Boss hai Map, Gold, report câu hỏi và các nhịp phản hồi âm thanh/hình ảnh để biến việc luyện Toán thành một hành trình có tiến trình.

## Chạy dự án

Yêu cầu Node.js 22+ và pnpm 10+.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Trước khi tạo pull request hoặc checkpoint, luôn chạy:

```bash
pnpm check
pnpm build
```

## Kiến trúc hiện tại

| Khu vực | Vai trò |
| --- | --- |
| `client/src/pages` | Màn hình hành trình, trạm, Boss, Võ đài, quản trị và thống kê. |
| `client/src/contexts/GameContext.tsx` | Trạng thái hồ sơ, Gold, report, tiến trình và phiên local. |
| `client/src/game` | Dữ liệu câu hỏi, guardian, Map, Boss và quy tắc combat. |
| `client/src/lib` | Âm thanh, helper giao diện và lớp sync Supabase offline-first. |
| `supabase/migrations` | Schema versioned, RLS và quyền đọc bảng xếp hạng tối thiểu. |
| `docs/SUPABASE_MIGRATION.md` | Lộ trình, ranh giới dữ liệu và trạng thái vận hành Supabase. |

Ứng dụng vẫn là frontend tĩnh: localStorage là cache/UI offline-first cho gameplay. GitHub là nguồn chuẩn cho **mã nguồn**; Supabase đang là lớp đồng bộ tùy chọn cho **dữ liệu dùng chung**, report tập trung và bảng xếp hạng nhiều thiết bị.

## Cộng tác với AI Agent

Mọi Agent phải đọc `AGENTS.md`, giữ nguyên phong cách Field Journal Quest, không đưa khóa bí mật vào Git, và chạy `pnpm check && pnpm build` trước khi đề xuất thay đổi. Các thay đổi về câu hỏi phải có nguồn, đáp án và gợi ý được kiểm tra; không tự tạo đánh giá hay lời chứng thực giả.

## Supabase

Không đưa `SUPABASE_SERVICE_ROLE_KEY` hoặc tệp `.env` vào repository. Frontend chỉ dùng URL và publishable/anon key qua RLS; `GameContext` không đưa mật khẩu, PIN phụ huynh, hash/salt, cookie hay role cục bộ lên cloud. Từ một thiết bị, một phiên Auth ẩn danh có thể đồng bộ nhiều hồ sơ học sinh cục bộ. Xem `docs/SUPABASE_MIGRATION.md` trước khi thay đổi migration hoặc policy.
