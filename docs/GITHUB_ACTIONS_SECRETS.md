# Cấu hình biến Supabase cho GitHub Actions

Tài liệu này áp dụng cho repository riêng tư [`Dannynguyen81/math4fun-local`](https://github.com/Dannynguyen81/math4fun-local). CI chỉ cần hai giá trị client-side để build nhất quán với Supabase: URL dự án và **publishable key**. Không bao giờ tạo, lưu hoặc chia sẻ `SUPABASE_SERVICE_ROLE_KEY` trong repository, GitHub Actions, file `.env` đã commit, ảnh chụp màn hình hoặc chat.

> `VITE_*` được Vite đóng gói vào JavaScript chạy trên trình duyệt. Vì vậy URL Supabase và publishable key **không phải bí mật bảo mật**; RLS mới là lớp bảo vệ dữ liệu. Có thể giữ chúng ở GitHub Actions secrets theo quy trình quản trị mong muốn, nhưng không được hiểu đây là cách che giấu chúng khỏi người dùng cuối.

## Phương án khuyến nghị: chủ repository tự thêm hai giá trị

Vì GitHub account đang kết nối là `Dannynguyen81` nhưng phiên CLI hiện thiếu quyền quản lý Actions secrets, cách gọn và ít cấp quyền nhất là chủ repository tạo hai giá trị trực tiếp trong giao diện GitHub. GitHub yêu cầu collaborator của personal repository hoặc người có quyền ghi với organization repository khi tạo repository secret.[1]

Mở [trang Actions secrets của Math4Fun](https://github.com/Dannynguyen81/math4fun-local/settings/secrets/actions), chọn **New repository secret**, rồi tạo từng mục dưới đây. Giá trị phải được sao chép từ **Supabase Dashboard → Project Settings → API** của dự án `qxgyjhrmmwkibcpozzau`; không gửi giá trị đó qua chat.

| Tên chính xác | Giá trị cần nhập | Mục đích |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Project URL của Math4Fun | Địa chỉ API Supabase cho production build |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable key của Math4Fun | Credential client bị RLS giới hạn |

Sau khi lưu, GitHub chỉ hiển thị **tên** secret, không hiển thị lại giá trị. Điều này là hành vi bình thường. Workflow CI đã đọc đúng hai tên trên khi chạy build.

## Nếu muốn cho phép tác nhân cấu hình bằng GitHub CLI

Không gửi personal access token vào chat. Thay vào đó, hãy **tái xác thực GitHub integration/CLI** đang kết nối với repository bằng chính account `Dannynguyen81`, rồi báo tôi thực hiện lại kiểm tra quyền. Token chỉ có thể làm những việc chủ token vốn có quyền làm và còn bị giới hạn bởi scope/permission mà token được cấp.[2]

Nếu GitHub yêu cầu tạo token fine-grained, hãy giới hạn token vào **duy nhất** repository `Dannynguyen81/math4fun-local`, đặt ngày hết hạn ngắn, và chỉ cấp quyền repository tối thiểu cần thiết để quản lý **Actions secrets**. Không dùng token classic có quyền rộng nếu fine-grained token hoạt động; GitHub khuyến nghị ưu tiên fine-grained token khi có thể.[2] Sau khi cấu hình xong, thu hồi token hoặc giảm quyền nếu không còn cần thiết.

## Kiểm tra sau khi cấu hình

Sau khi thêm hai giá trị, vào tab [Actions](https://github.com/Dannynguyen81/math4fun-local/actions), mở lần chạy mới nhất và xác nhận hai bước **TypeScript** và **Production build** thành công. Không in giá trị biến môi trường vào log workflow. Với pull request từ fork, GitHub có thể không cấp secrets cho workflow; build Math4Fun vẫn có cấu hình client fallback an toàn để kiểm tra mã nguồn.

## Tham khảo

[1]: https://docs.github.com/actions/security-guides/using-secrets-in-github-actions "GitHub Docs — Using secrets in GitHub Actions"
[2]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens "GitHub Docs — Managing your personal access tokens"
