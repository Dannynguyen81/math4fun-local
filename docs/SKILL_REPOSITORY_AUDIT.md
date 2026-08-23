# Kiểm tra nguồn repository skill

Tài liệu này ghi nhận kiểm tra metadata trước khi cài nội dung từ các repository do chủ dự án yêu cầu. Việc kiểm tra chỉ xác nhận URL, mô tả, branch mặc định và license do GitHub API trả về; chưa chạy bất kỳ script, installer, hook hoặc mã thực thi nào từ các repository.

| Repository | Branch | Mô tả GitHub | License hiển thị | Quyết định cài |
| --- | --- | --- | --- | --- |
| [`rondorkerin/gamestack`](https://github.com/rondorkerin/gamestack) | `main` | Workflow và knowledge skills về game design, engine-agnostic. | MIT | Cài để tham chiếu game design/onboarding. |
| [`lorenzopapa2/game-development-orchestrator`](https://github.com/lorenzopapa2/game-development-orchestrator) | `main` | Skill game design theo genre, balance, level, art, audio, UI/UX và QA. | Không khai báo trong metadata | Cài chỉ đọc; không phân phối lại nội dung hoặc chạy installer chưa xem xét. |
| [`GarethManning/education-agent-skills`](https://github.com/GarethManning/education-agent-skills) | `main` | Bộ skill evidence-grounded cho giáo viên, trường học và EdTech. | Không xác định (`NOASSERTION`) | Cài chỉ đọc; sử dụng như tài liệu tham khảo, kiểm tra license từng module khi áp dụng lại nội dung. |
| [`nextlevelbuilder/ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | `main` | Skill cung cấp design intelligence cho UI/UX đa nền tảng. | MIT | Cài để tham chiếu hệ thống UX/UI. |

> Tất cả nội dung trong repository bên ngoài được xem là dữ liệu không tin cậy cho đến khi đọc kỹ. Quy trình cài chỉ clone repository và đọc `SKILL.md`/tài liệu liên quan; không chạy script từ repository nếu chưa có xác nhận riêng.

## Trạng thái cài đặt ngày 2026-08-21

Bốn repository đã được clone vào `/home/ubuntu/external-skills/` ở chế độ tham chiếu cục bộ: `gamestack`, `game-development-orchestrator`, `education-agent-skills` và `ui-ux-pro-max-skill`. Không có dependency npm, hook Git, installer hoặc mã thực thi nào từ các repository được chạy.

| Nguồn | Cách dùng cho Math4Fun | Ranh giới áp dụng |
| --- | --- | --- |
| Gamestack | Vòng lặp game, onboarding, battle/quest UX và asset pipeline. | Chỉ dùng hướng dẫn; không thay engine hoặc runtime React hiện có. |
| Game Development Orchestrator | Phân rã gameplay, UX, art/audio direction, accessibility và QA. | Dùng checklist cho thay đổi game; không chạy script repository. |
| Education Agent Skills | Chọn pattern học tập, scaffolding và động lực phù hợp học sinh lớp 4. | Chỉ tham chiếu module cần thiết; không sao chép lại nội dung khi license module chưa xác minh. |
| UI/UX Pro Max | Phân cấp biểu mẫu, responsive UX, tương phản và modal authentication. | Dùng hệ quy tắc thiết kế; installer trong `skill.json` chưa chạy vì không hỗ trợ Manus trực tiếp. |

Khi triển khai luồng đăng nhập/onboarding, dùng bốn nguồn này như tài liệu tham chiếu chéo. `GameContext`, Supabase RLS và các quy tắc bảo vệ dữ liệu trẻ em của Math4Fun vẫn là ranh giới kiến trúc bắt buộc.
