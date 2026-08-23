# Ghi chú sử dụng skill ngoài cho Math4Fun

## Gamestack và Game Development Orchestrator

Gamestack được cài như một **skill pack hướng dẫn thiết kế**, không phải engine hay codebase cần chạy. Với Math4Fun, các module áp dụng trực tiếp là onboarding-and-teaching, ui-ux-and-feedback, game-feel-and-juice, art-direction-and-readability, RPG systems và iteration loop. Mọi thay đổi giao diện cần đi theo chu trình reference → diff → ưu tiên → triển khai → xác minh thay vì sao chép nguyên trạng website tham chiếu.

Game Development Orchestrator được dùng để khóa product thesis và core loop trước khi thêm tính năng. Luồng onboarding Math4Fun phải giữ nguyên lời hứa: học sinh lớp 4 bắt đầu hành trình nhanh, chọn companion, học bằng thử thách và nhận phản hồi rõ ràng. Các yêu cầu xác thực, avatar và UI chỉ được triển khai khi phục vụ trực tiếp cho vòng lặp này, có trạng thái tương tác/accessibility minh bạch và không tăng phạm vi gameplay không cần thiết.

Hai repository chỉ được đọc như tài liệu. Không chạy script, installer, dependency hay code mẫu từ các repository này nếu chưa có yêu cầu rõ ràng của người dùng.

### Áp dụng cho popup xác thực và onboarding avatar

Popup xác thực của Math4Fun dùng UI/UX Pro Max để bảo đảm label luôn hiển thị, vùng bấm rõ, focus keyboard, contrast, phản hồi validation tại chỗ và một CTA chính trên mỗi trạng thái. Theo Gamestack `ui-ux-and-feedback`, modal chỉ hiển thị dữ liệu cần quyết định tại thời điểm đó: đăng nhập, đăng ký hoặc xác nhận avatar — không ghép tất cả vào cùng một màn hình.

Theo Gamestack `onboarding-and-teaching`, lần đầu vào game dùng progressive disclosure: xác thực → xem một avatar mẫu → điều hướng vòng để chọn → xác nhận “Bắt đầu hành trình”. Mỗi bước dạy đúng một quyết định; avatar được mô tả như companion đầu tiên trong vòng lặp học–thử thách–phần thưởng, thay vì một catalogue nhân vật.
