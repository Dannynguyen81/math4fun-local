# Roster thử nghiệm Ngũ hành — Map 1

## Phạm vi

Roster này là một **batch thử nghiệm 10 guardian nguyên bản** cho mười slot đầu Map 1 và một Boss Map 1. Các `internalId` hiện hành được giữ nguyên để không làm mất tiến độ localStorage, liên kết trạm, phép đang mở hoặc cân bằng combat. Chỉ lớp nhận diện, mô tả, phép đặt tên và sprite được thay đổi.

Các concept tuân theo `AI_SKILLS/math4fun-pet-designer` v1.1.0. Bảng tham chiếu người dùng chỉ được dùng để trích xuất nhịp roster, taxonomy Ngũ hành, độ đọc card và yêu cầu asset. Không loài, tên, silhouette, khuôn mặt, logo, khung thẻ hoặc phép nhận diện nào từ reference được sao chép.

## Ma trận đa dạng

| Internal ID | Display name | Hệ / slot | Vai trò | Silhouette & face grammar | Chuyển động / nguồn phép | Vật liệu chính | Asset |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `cubix` | Kavon | Thổ / vanguard | Guardian | Thân lăng khối thấp, sáu chân, mõm nêm mềm | Neo chân; thước gập ở đuôi | Sa thạch, đất nung, đồng | `math4fun-guardian-cubix-v2` |
| `vane` | Sivra | Hỏa / vanguard | Striker | Thân quả lê, sáu chân, mặt nạ ngà | Dash bên; vòng hổ phách ở đuôi phát lửa | Ember glass, gốm bóng | `math4fun-guardian-vane-v2` |
| `scalera` | Nerumi | Thủy / vanguard | Support | Rái cá dài với buồng xoắn ngọc trai | Cân bằng đứng; ribbon nước từ buồng lưng | Wet gloss, fin trong | `math4fun-guardian-scalera-v2` |
| `voltaria` | Orbis | Kim / vanguard | Guardian | Nhím–chim đứng nhỏ, mặt nêm, vành tám phiến thoi | Bước chính xác; phiến gốm xoay quanh lưng | Gốm satin, đồng xước | `math4fun-guardian-voltaria-v2` |
| `mossar` | Mavie | Mộc / vanguard | Support | Hươu non cao, tai lá xếp tầng, chồi trán | Nhảy nhẹ; chồi trán mở cánh hoa | Leaf velvet, bark, dew | `math4fun-guardian-mossar-v2` |
| `coris` | Ruvin | Thổ / guide | Control | Bọ geode bầu dục tám chân, mặt phiến đá | Dừng–trỏ; buồng geode nhả sỏi đếm | Slate, đất nung, tinh thể hổ phách | `math4fun-guardian-coris-v2` |
| `aerion` | Zephyra | Mộc / guide | Control | Hạt mầm hình thoi, mặt trong đài hoa, cánh lá bất đối xứng | Lượn; đèn hạt ở đuôi dây leo phát mầm | Màng lá, dew gloss | `math4fun-guardian-aerion-v2` |
| `brio` | Timbal | Kim / guide | Balanced | Chim–tê tê chân dài, mỏ nêm, đuôi đối trọng | Giữ một chân; vòng cân dưới chân | Gốm kim, bạc, đồng | `math4fun-guardian-brio-v2` |
| `lumen` | Virel | Hỏa / guide | Support | Đèn lồng bướm nhỏ bay, mặt nạ san hô | Lơ lửng; bấc xoắn trong bụng phát sáng | Frosted glass, wax ceramic | `math4fun-guardian-lumen-v2` |
| `noris` | Selnor | Thủy / guide | Striker | Kỳ giông dải lụa chữ S, tai vây cong | Bơi theo cột; ba lăng kính giọt tạo đường biểu đồ | Nước trong, glass droplets | `math4fun-guardian-noris-v2` |

Mỗi hệ có hai vai trò bổ sung, nhưng không có cặp nào trùng cả `body archetype + face grammar + movement`. Batch sử dụng đủ body low-six-leg, long-body, upright-compact, tall-biped, cervid, oval-octopod, floating-seed, hover-lantern và ribbon-salamander.

## Boss Map 1

| ID | Name | Hệ | Tóm tắt anatomy | Cast source | Asset |
| --- | --- | --- | --- | --- | --- |
| `atlas` | Atlas | Thổ | Tapir–bọ ngựa sáu chân, lưng basalt bậc thang, mõm đĩa la bàn, áo choàng phiến slate | Buồng geode ngực và các phiến slate gấp thành khiên địa hình | `math4fun-boss-atlas-v2` |

Atlas được cố ý thiết kế khác toàn bộ guardian: khối lượng lớn, bốn nhóm silhouette nhìn thấy (mõm dài, lưng bậc, mantle slate, geode ngực) và nhịp cast phòng thủ chiến thuật. Boss không phải rồng, rắn, khủng long hoặc sinh vật nhượng quyền.

## Asset contract

Các sprite hiện dùng URL asset 3D dành cho preview nội bộ. Trước khi đưa branch vào Vercel production, cần vendoring asset theo policy self-contained hiện hành (cùng tên file, manifest và checksum), sau đó thay URL preview bằng `/media/...` mà không đổi `internalId` hay combat metadata.
