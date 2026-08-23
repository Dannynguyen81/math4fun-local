# Math4Fun Pet Designer Skill

Bộ skill này dùng cho AI agent khác để thiết kế linh sủng nguyên bản và prompt tạo ảnh đồng bộ với Math4Fun.

## File chính

- `SKILL.md` — luật và workflow đầy đủ.
- `templates/pet-spec.yaml` — schema mô tả pet.
- `examples/hoa-linh-example.yaml` — ví dụ hoàn chỉnh.

## Cách dùng nhanh

### Cách 1 — Agent hỗ trợ project skills

Copy nguyên thư mục `math4fun-pet-designer-skill` vào thư mục skill/project-instruction mà agent của bạn hỗ trợ, sau đó yêu cầu agent đọc `SKILL.md`.

Ví dụ lệnh:

> Read `math4fun-pet-designer-skill/SKILL.md` and follow it as the canonical creature-design skill for this repository.

### Cách 2 — Agent không có hệ thống skill

Đặt thư mục này ở root repo, ví dụ:

```text
math4fun-local/
  AI_SKILLS/
    math4fun-pet-designer/
      SKILL.md
      templates/
      examples/
```

Sau đó prompt:

> Trước khi làm, đọc `AI_SKILLS/math4fun-pet-designer/SKILL.md`. Thiết kế 5 linh sủng mới, mỗi hệ một con. Chỉ xuất concept + prompt, chưa sửa code.

### Cách 3 — Tạo từ bản vẽ của trẻ

Đưa ảnh cho agent và prompt:

> Đọc `SKILL.md`. Dùng bản vẽ đính kèm làm creative seed. Giữ tối thiểu 4 đặc trưng nhận diện từ bản vẽ, nhưng nâng cấp thành linh sủng nguyên bản hệ Hỏa theo style Math4Fun. Xuất Pet Design Pack và prompt character sheet 4:5.

## Prompt mẫu

### Tạo 1 pet

> Đọc skill Math4Fun Pet Designer. Tạo 1 pet hệ Thủy, role support. Không dùng rồng làm body archetype. Xuất full Pet Design Pack.

### Tạo một batch 10 pet

> Đọc skill. Tạo diversity matrix trước, sau đó thiết kế 10 pet cân bằng 5 hệ, mỗi hệ 2 pet. Không để quá 2 pet có cùng body archetype.

### Tạo ảnh bằng image model

> Đọc skill. Tạo Pet Design Pack rồi dùng phần Master Image Prompt để generate concept sheet 4:5. Nếu có ảnh style anchor, chỉ dùng để khóa rendering/style, không copy anatomy.

## Đưa vào math4fun-local

Nếu agent có quyền repo:
1. đọc `AGENTS.md`;
2. đọc `client/src/game/gameData.ts`;
3. kiểm tra guardian schema hiện tại;
4. chỉ sửa code khi được yêu cầu;
5. chạy `pnpm check && pnpm build`.

## Khuyến nghị

Giữ skill trong Git để mọi agent dùng cùng một “visual constitution”. Điều này quan trọng hơn việc mỗi lần viết một prompt mới.
