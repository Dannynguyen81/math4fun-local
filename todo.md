# Math4Fun Local Prototype — Checklist

- [x] Xác nhận scaffold web local đã sẵn sàng và các file thiết yếu hoạt động.
- [x] Viết `ideas.md` với một design direction được chọn cho Math4Fun.
- [x] Chuẩn bị asset Pokémon nội bộ, local-only và ghi nguồn sử dụng.
- [x] Xây dựng dashboard, Gym map, Station Detail và thử thách mẫu Toán 4.
- [x] Thêm combat feedback, collection, streak và lưu tiến trình local.
- [x] Kiểm thử responsive, kiểm tra trực quan, lưu checkpoint và bàn giao.

## Nội dung Toán 4 đã kiểm chứng

- [x] Trích từng bài toán dự kiến dùng từ PDF Archimede và ghi số trang/bài.
- [x] Tính lại đáp án, kiểm tra phép tính và viết gợi ý theo phương pháp sách.
- [x] Thay câu hỏi mẫu trong station bằng ngân hàng câu hỏi đã xác nhận.
- [x] Kiểm thử đáp án đúng/sai, gợi ý, nguồn trang và combat feedback.
- [x] Lưu checkpoint bản nội dung Toán 4 đã xác minh.

## Hoàn thiện game local

- [x] Chuẩn hóa game state, unlock rule và lưu/khôi phục dữ liệu localStorage.
- [x] Mở rộng ngân hàng câu hỏi Toán 4 có nguồn kiểm chứng theo từng station.
- [x] Làm các khu vực Bản đồ học, Bộ sưu tập, Trạm học và Đấu Boss có thể truy cập.
- [x] Thêm gameplay hoàn chỉnh: XP, streak, unlock guardian, tiến độ và combat turn.
- [x] Kiểm thử điều hướng, luồng học, local persistence và responsive; lưu checkpoint.

## Nâng cấp theo phản hồi chơi thử

- [x] Đối chiếu PDF Toán 4 Tập 2 và lập lộ trình 20 chủ đề nhỏ thuộc các chủ đề lớn.
- [x] Thiết kế ngân hàng câu hỏi E–M–H, thứ tự xáo trộn và chống lặp câu hỏi khi chơi lại.
- [x] Tăng yêu cầu mastery lên tối thiểu 10 câu/trạm, lưu điểm sai/dở dang để không thể thoát–vào làm lại từ đầu.
- [x] Xây Boss 5 câu khó không trùng câu thu phục; cân bằng sát thương hai chiều và phép thuật nguyên tố.
- [x] Thêm tạo hồ sơ local, chọn nhân vật, đội guardian dùng để chiến đấu và giới hạn mở hai chủ đề mỗi tuần.
- [x] Thêm hiệu ứng âm thanh, dashboard thống kê học tập local và kiểm thử cân bằng toàn bộ game.
- [ ] Tiếp tục đối chiếu và bổ sung tối thiểu 10 câu E–M–H cho từng chủ đề 4–20 trước khi cho phép mở toàn bộ lộ trình.

## Guardian và phép thuật

- [x] Rà soát thuộc tính nguyên tố của từng guardian và gán đúng phép đặc trưng, bao gồm Pikachu hệ Sấm sét.
- [x] Thêm hoạt ảnh guardian chủ động tung phép, đòn bay, va chạm và phản công trong trận Boss.
- [x] Tạo đoạn minh họa Manim ngắn cho kỹ năng Sấm sét và tích hợp như tư liệu luyện phép local.
- [x] Kiểm tra màn hình Boss, hiệu năng hoạt ảnh và lưu checkpoint.

## Video phép nguyên tố

- [x] Viết phân cảnh Manim không lời cho phép hệ Lửa, Nước và Độc theo từng guardian.
- [x] Render và kiểm tra trực quan ba clip minh họa phép thuật.
- [x] Tích hợp clip đúng theo guardian được chọn trong đấu trường Boss.
- [x] Kiểm thử màn hình Boss, lưu checkpoint và bàn giao bản nâng cấp.

## Hoàn thiện hệ ma thuật

- [x] Tạo clip Manim không lời cho phép hệ Gió và Đất, đồng bộ với phong cách Sổ Phép hiện có.
- [x] Tạo hiệu ứng âm thanh riêng cho sáu nguyên tố: Sấm sét, Lửa, Nước, Độc, Gió và Đất.
- [x] Xây trang Sổ Phép để học sinh xem lại video/âm thanh của các guardian đã thu phục.
- [x] Tích hợp hiệu ứng âm thanh vào combat, kiểm thử và lưu checkpoint.

## Thành tựu và phân tích ma thuật

- [x] Lưu lịch sử xem clip nguyên tố và mở huy hiệu khi xem đủ sáu hệ.
- [x] Theo dõi số lần dùng từng phép và hiển thị hệ phép được dùng nhiều nhất trong Thống kê.
- [x] Thêm bảng tương khắc mạnh/yếu của sáu nguyên tố vào Sổ Phép.
- [x] Kiểm thử quyền mở, dữ liệu local và lưu checkpoint.

## Tiến độ và sao lưu ma thuật

- [x] Thêm XP, cấp độ và mốc mở riêng cho từng nguyên tố.
- [x] Tạo nhiệm vụ tuần yêu cầu dùng đúng phép nguyên tố trong Boss combat.
- [x] Hiển thị tiến độ XP nguyên tố và nhiệm vụ tuần trong Sổ Phép/Thống kê.
- [x] Thêm xuất và nhập hồ sơ học sinh JSON có kiểm tra dữ liệu an toàn.
- [ ] Kiểm thử local persistence, khôi phục JSON và lưu checkpoint.

## Phần thưởng, bảo vệ phụ huynh và trạm niêm phong

- [x] Thiết kế và tích hợp lễ chúc mừng hình ảnh/âm thanh khi một nguyên tố tăng bậc.
- [x] Thêm thiết lập PIN phụ huynh trong hồ sơ local và yêu cầu PIN trước khi khôi phục JSON.
- [x] Rà soát tài liệu Archimede đã đối chiếu để chọn câu hỏi chính xác cho hai trạm được mở trong đợt này.
- [x] Bổ sung hai bộ 10 thử thách E–M–H, giữ xáo trộn và chống lặp, cho T2.03 và T1.08.
- [x] Kiểm tra TypeScript, build và giao diện của luồng mới; cần chơi thử thủ công thêm với hồ sơ thật và tệp JSON thực tế.

## Tiến trình, kinh tế và hành trình guardian

- [x] Thiết kế huy hiệu nguyên tố và điều kiện mở khi hoàn thành đủ ba bậc XP của một hệ.
- [x] Đối chiếu PDF Archimede và mở thêm hai trạm tiếp theo, mỗi trạm có đúng 10 câu hỏi kèm nguồn, gợi ý và đáp án kiểm chứng.
- [x] Bổ sung câu hỏi bảo mật, đổi PIN và đặt lại PIN phụ huynh theo luồng local an toàn.
- [x] Cải tổ tạo hồ sơ với bộ hình đại diện dễ thương, chọn nhanh và hiển thị rõ nhân vật đã chọn.
- [x] Thêm Gold cho mỗi câu trả lời, kho đồ cá nhân và dữ liệu sản phẩm Shop.
- [x] Thiết kế hồi máu theo thời gian, bình hồi phục 25%/50%/100% và luồng mua/dùng vật phẩm.
- [x] Áp dụng luật guardian hết HP bị mất, gỡ khỏi đội và phải thu phục lại qua trạm.
- [x] Kiểm tra TypeScript, build và các màn hình đại diện; cần chơi thử thủ công thêm chuỗi chiến đấu dài, mua/dùng bình và đặt lại PIN với dữ liệu thật.

## Mở rộng nhân vật, nhịp học và hình học

- [x] Đối chiếu PDF Archimede để chọn hai chủ đề hình học kế tiếp và ghi nguồn, đáp án, gợi ý cho 20 câu mới.
- [x] Mở rộng danh mục thành 20 thẻ nhân vật, cân bằng 10 bé trai và 10 bé gái, có lựa chọn dễ nhận biết trong hồ sơ.
- [x] Rà soát nhịp Gold trên từng đáp án và điều chỉnh giá ba bình hồi phục theo số câu học cần thiết.
- [x] Thêm huy hiệu chuỗi học 7 ngày và 14 ngày, hiển thị rõ trong hồ sơ/thống kê.
- [x] Mở hai trạm hình học đã đối chiếu và giữ luật Mastery 10 câu, xáo trộn, không lặp.
- [x] Kiểm tra TypeScript, build và giao diện chính; cần chơi thử thủ công nhiều ngày để xác thực mốc chuỗi 7/14 ngày.

## Tài khoản cục bộ và bảng xếp hạng

- [x] Thêm tên đăng nhập và mật khẩu đã băm cho từng hồ sơ local, giữ tương thích các hồ sơ cũ.
- [x] Thiết kế luồng đăng nhập, chuyển hồ sơ và đăng xuất rõ ràng trên thiết bị dùng chung.
- [x] Tạo bảng xếp hạng local xếp theo thành tích học tập, huy hiệu, guardian thu phục và tiến độ tổng.
- [x] Thêm trang/tuyến Bảng xếp hạng và diễn giải rõ phạm vi cạnh tranh trên cùng thiết bị.
- [x] Kiểm tra TypeScript, build và trạng thái xếp hạng trống; cần thử thủ công đăng nhập sai và chuyển nhiều hồ sơ trước khi dùng trên thiết bị chung.

## So sánh hồ sơ, trang trí và lịch học

- [x] Rà soát dữ liệu thành tích để xác định chỉ số so sánh chi tiết giữa các hồ sơ local.
- [x] Tạo màn hình so sánh tiến độ, huy hiệu, guardian, Gold và nhịp học giữa các hồ sơ trên thiết bị.
- [x] Thêm vật phẩm trang phục/trang trí vào Shop, kho đồ và trạng thái trang bị cho companion.
- [x] Thêm lịch học tuần, chọn ngày học và hiển thị mức độ duy trì chuỗi trong hồ sơ.
- [x] Tạo nhắc học cục bộ khi mở game, có ngưỡng cảnh báo trước khi chuỗi bị đứt.
- [x] Kiểm tra TypeScript, build và giao diện các màn chính; cần chơi thử thủ công mua/trang bị và kiểm tra nhắc chuỗi qua nhiều ngày.

## Avatar đầy đủ, bộ sưu tập và hồ sơ xếp hạng

- [x] Kiểm kê và sửa liên kết minh họa để cả 20 thẻ nhân vật đều có ảnh hiển thị ổn định.
- [x] Thiết kế các bộ trang phục/trang trí theo chủ đề, có nhãn bộ và điều kiện hoàn tất.
- [x] Thêm hiệu ứng hình ảnh khi companion trang bị đủ các vật phẩm thuộc cùng một bộ.
- [x] Mở chi tiết hồ sơ từ bảng xếp hạng để xem companion, trang phục đang mặc và guardian đã thu phục.
- [x] Kiểm tra TypeScript, build và toàn bộ thẻ nhân vật; cần chơi thử thủ công mua/trang bị đủ bộ và mở hồ sơ khi có nhiều người chơi local.

## Hồ sơ hiện diện, Shop trực quan và phần thưởng bộ sưu tập

- [x] Hiển thị avatar đã chọn cạnh tên người chơi trong khung điều hướng và các trang sau đăng nhập.
- [x] Tạo minh họa trực quan cho bình hồi phục, trang phục và trang trí trong Shop.
- [x] Đặt preview companion/trang phục hiện hành trực tiếp trên bản đồ chính.
- [x] Thêm thưởng Gold và XP một lần khi hoàn tất đủ một bộ trang phục.
- [x] Thêm bộ lọc bảng xếp hạng theo thành tích tổng, chuỗi học và số guardian thu phục.
- [x] Kiểm tra TypeScript, build, trang có hồ sơ, Shop, preview bản đồ, thưởng bộ và bộ lọc; lưu checkpoint.

## Hành trình hai bản đồ và Huấn luyện Pet

- [x] Chuẩn hóa phần thưởng Gold: đúng E/M/H nhận 2/3/4 Gold, sai nhận 1 Gold và cộng 5 Gold ở mỗi chuỗi 5 câu đúng.
- [x] Chia lộ trình thành Map 1 gồm 10 chủ đề Tập 1 và Map 2 gồm 10 chủ đề Tập 2, với Map 2 chỉ mở sau Boss Map 1.
- [x] Tạo Boss Map 1 gồm 10 câu tổng hợp mức trung bình/khó từ các chủ đề đã hoàn tất của Tập 1.
- [x] Đổi mục Boss trong nhật ký thành Huấn luyện Pet và xây PvP mở khi có ít nhất một guardian.
- [x] Tạo combat Huấn luyện có XP không có Gold, HP chỉ tồn tại trong phiên, phản công theo đáp án sai và âm thanh/hiệu ứng phép.
- [x] Gắn XP huấn luyện với cấp guardian và điều kiện mở phép mới.
- [x] Lọc câu hỏi Huấn luyện theo các chủ đề Map đã mở; không đưa chủ đề bị niêm phong vào pool.
- [x] Bổ sung khoảng 20 câu tạo bổ sung cho mỗi chủ đề, phân tầng E/M/H và tách rõ dữ liệu nguồn sách với dữ liệu luyện tập bổ sung.
- [x] Bảo đảm mỗi trạm map rút ngẫu nhiên 4 câu dễ, 3 câu trung bình, 3 câu khó theo đúng chủ đề và luật không lặp.
- [x] Thêm bong bóng thoại/hoạt ảnh tương tác cho companion trên bản đồ hành trình.
- [x] Kiểm tra TypeScript, build, combat, khóa/mở Map 2, persistence và các trường hợp không đủ guardian; lưu checkpoint.

## Chiến thuật Huấn luyện và kiểm thử Boss

- [x] Bổ sung màn chọn guardian, pet đối thủ và cấp độ Huấn luyện trước khi vào võ đài.
- [x] Cân bằng máu, sát thương, XP và số câu theo ba cấp độ Huấn luyện; vẫn không trao Gold.
- [x] Thêm hiệu ứng hình ảnh, âm thanh và thông báo phần thưởng khi đạt đúng năm câu liên tiếp.
- [x] Thêm các câu Boss Map 1 mẫu mức trung bình/khó có đáp án, gợi ý và nguồn/nhãn luyện rõ ràng.
- [x] Kiểm thử TypeScript, build, lựa chọn đối thủ/độ khó, phản hồi chuỗi 5 và pool Boss Map 1; lưu checkpoint.

## Tiến hóa Huấn luyện Pet

- [x] Tạo lễ thăng cấp/mở phép có âm thanh, hoạt ảnh và lớp chúc mừng rõ ràng khi guardian đủ XP.
- [x] Lưu lịch sử trận Huấn luyện theo guardian: đối thủ, cấp độ, kết quả, XP nhận, câu đúng/sai và thời điểm.
- [x] Hiển thị biểu đồ tăng trưởng XP và bảng lịch sử trận trong khu vực Huấn luyện.
- [x] Thêm hồ sơ nguyên tố đối thủ, nhãn mạnh/yếu và giải thích lựa chọn chiến thuật trước trận.
- [x] Áp dụng hệ số sát thương khắc chế nguyên tố trong Huấn luyện Pet, minh bạch trong phản hồi giao chiến.
- [x] Kiểm thử TypeScript, build, persistence lịch sử, lễ thăng cấp và khắc chế nguyên tố; lưu checkpoint.

## Quản trị cục bộ, hồ sơ và kỹ thuật Huấn luyện

- [x] Bổ sung tài khoản quản trị cục bộ `admin` và phiên đăng nhập bền vững theo cookie/local storage; chỉ đăng nhập lại sau khi đăng xuất.
- [x] Tạo menu tài khoản, hồ sơ cá nhân và console quản trị để duyệt/sửa/khôi phục ghi đè câu hỏi, kèm mở khóa toàn bộ nội dung thử nghiệm.
- [x] Thay bộ chọn nhân vật bằng 20 avatar chibi toàn thân, có khuôn mặt, tóc và biểu cảm phân biệt.
- [x] Liên kết mỗi kỹ thuật Huấn luyện mở khóa với hiệu ứng phóng phép, va chạm và âm thanh riêng trong võ đài.
- [x] Kiểm tra TypeScript, build, quyền admin, persistence phiên, avatar mới và các kỹ thuật Huấn luyện; lưu checkpoint.

## Nhịp mở chủ đề, Boss hai Map và trải nghiệm quản trị

- [x] Chẩn đoán và sửa lỗi hiển thị trang So sánh hồ sơ trên desktop và mobile.
- [x] Giữ hai lượt mở chủ đề miễn phí mỗi tuần; sau khi dùng hết, cho phép mở thêm chủ đề với giá 30 Gold và giải thích rõ quy tắc trong bản đồ.
- [x] Khóa Map 2 cho đến khi Boss Map 1 bị đánh bại; đặt Boss Map 1 ở cửa cuối Map 1 và chỉ mở trận khi đủ 10 chủ đề Map 1 đã mở.
- [x] Đặt Boss Map 2 ở cửa cuối Map 2 và chỉ mở trận khi đủ 10 chủ đề Map 2 đã mở; trao huy hiệu Dũng sĩ diệt Boss cấp 1/2 theo chiến thắng tương ứng.
- [x] Tinh chỉnh nhịp độ, thời lượng và âm lượng âm thanh kỹ thuật trong Võ đài Huấn luyện để các lượt đánh rõ ràng nhưng không gắt.
- [x] Thêm bộ lọc nguồn và tập sách trong Console quản trị cùng kiểm thử dữ liệu câu hỏi.
- [ ] Thay SVG dự phòng bằng ảnh chibi AI toàn thân g07, g08, g09 đồng nhất khi hạn mức tạo ảnh sẵn sàng.
- [x] Kiểm tra TypeScript, build, luồng Gold, điều kiện Boss, huy hiệu, giao diện và lưu checkpoint.

## Chất lượng câu hỏi, Boss và sổ Gold

- [x] Lưu report cục bộ trên mỗi câu hỏi, gồm loại lỗi, ghi chú, thời điểm và trạng thái duyệt cho admin.
- [x] Thêm nút report và gợi ý có xác nhận trừ 1 Gold trong Trạm, Boss Map 1/2 và Huấn luyện.
- [x] Thêm Gold ledger gồm mở trạm trả phí, hint, Shop và phần thưởng; hiển thị lịch sử/bộ lọc trong Thống kê.
- [x] Thêm hàng đợi report và bộ lọc trạng thái vào Console quản trị, giữ bộ lọc nguồn/tập sách.
- [x] Tạo nhạc nền ambient nhẹ cho các trang không làm bài, tự dừng khi làm bài/battle và tôn trọng toggle audio.
- [x] Tái bố cục Boss Map 1/2 để sân đấu và câu hỏi cùng thấy được; nâng projectile, va chạm, phản hồi HP và thông số cân bằng.
- [x] Tăng guardian trên Map khoảng 2× và tái bố cục trang Trạm theo artifact Field Journal.
- [x] Thử lại một lượt tạo ảnh AI g07–g09; giữ SVG fallback vì hạn mức tạo ảnh chưa cho phép thay thế.
- [x] Kiểm tra TypeScript/build và giao diện desktop/mobile; route `/boss` tương thích liên kết cũ đã được xác nhận.
- [ ] Chơi thử bằng hồ sơ admin: xác nhận trừ Gold/cancel hint, gửi-duyệt report, ledger và toàn bộ 10 lượt Boss trên thiết bị người dùng.

## Tinh chỉnh chiến trường, report và avatar

- [x] Đồng bộ Boss Map 1/2 theo bố cục chiến trường Võ đài, ẩn tư liệu phép trong lúc giao chiến để ưu tiên guardian, Boss, HP và câu hỏi.
- [x] Ngăn nhạc ambient chồng với nhạc/âm thanh Huấn luyện và Boss; chỉ giữ một nguồn âm thanh theo ngữ cảnh.
- [x] Thêm âm thanh phản công Boss và phản hồi rõ cho đáp án đúng/sai trong trận Boss.
- [x] Cho admin duyệt report, nhập phản hồi gửi lại hồ sơ người chơi và lưu nhật ký xử lý cục bộ.
- [x] Bỏ nền tím không phù hợp khỏi thẻ avatar, giữ ảnh chibi trên chất liệu parchment trung tính.
- [x] Kiểm tra TypeScript/build, layout Boss/Huấn luyện, luồng report và ảnh avatar; lưu checkpoint.

## Điều khiển âm thanh và phản hồi người chơi

- [x] Thêm nút bật/tắt nhạc nền ở góc trên phải, lưu tùy chọn cục bộ và giữ âm hiệu ứng chiến đấu độc lập.
- [x] Thêm rung lắc/chớp sáng GPU-friendly khi Boss phản công, đồng bộ với âm thanh nhưng tôn trọng giảm chuyển động.
- [x] Thiết kế viền/stamp tương tác cho thẻ avatar trên nền parchment, có trạng thái chọn rõ ràng.
- [x] Hiển thị hộp thư/thông báo trong game khi report của người chơi đã được admin duyệt và phản hồi.
- [x] Kiểm tra TypeScript/build, audio toggle, hiệu ứng Boss, thẻ avatar và thông báo report; lưu checkpoint.

## Cộng tác GitHub và dữ liệu Supabase

- [x] Kiểm tra repository Git hiện có, trạng thái xác thực GitHub và các tệp cần loại trừ khi công khai mã nguồn.
- [x] Bổ sung tài liệu README/AGENTS cho quy trình cộng tác của nhiều AI Agent, nhánh, kiểm tra build và bảo vệ dữ liệu.
- [x] Đánh giá mô hình localStorage hiện tại và xác định schema Supabase tối thiểu cho hồ sơ, câu hỏi, report, Gold và leaderboard.
- [x] Xác nhận repository GitHub đích và dự án Supabase trước khi thực hiện các thao tác kết nối có tính thay đổi bên ngoài.
- [x] Cài Supabase client, tích hợp lớp đồng bộ offline-first đa hồ sơ và kiểm chứng `pnpm check`/`pnpm build`; GitHub Actions secrets chưa thể tạo do token hiện tại bị GitHub từ chối quyền Actions secrets.

## Dự án Supabase Math4Fun

- [x] Lấy chi phí chính thức và xác nhận của người dùng trước khi tạo dự án Supabase mới Math4Fun.
- [x] Tạo dự án Math4Fun ở khu vực Singapore phù hợp, rồi kiểm tra trạng thái sẵn sàng.
- [x] Áp dụng schema có RLS cho dữ liệu người chơi, question bank, report, Gold ledger và leaderboard.
- [x] Lưu cấu hình công khai an toàn, sinh TypeScript types, bật Anonymous sign-ins, kiểm tra RLS/leaderboard và cập nhật hướng dẫn GitHub/Supabase cho AI Agent.
