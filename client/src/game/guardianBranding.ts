/**
 * Original Math4Fun Guardian canon.
 *
 * Internal gameplay IDs stay unchanged so current localStorage saves, station
 * mappings and battle history remain compatible. The branding layer replaces
 * every legacy pet identity and sprite with original Math4Fun Guardian IP.
 */
import { GUARDIANS, MAP_BOSS_ARCHIVES } from "./gameData";

export type GuardianAffinity = "hỏa" | "thủy" | "mộc" | "kim" | "thổ";

type GuardianBrand = {
  name: string;
  species: string;
  affinity: GuardianAffinity;
  description: string;
  spells: readonly [string, string, string, string];
  artwork: string;
};

const brand = (
  name: string,
  species: string,
  affinity: GuardianAffinity,
  description: string,
  spells: GuardianBrand["spells"],
  artwork: string,
): GuardianBrand => ({ name, species, affinity, description, spells, artwork });

/**
 * Current gameplay/save IDs remain stable. Artwork IDs are a separate visual
 * namespace so every topic can own one unique Guardian without migrating saves.
 */
export const GUARDIAN_BRANDING: Record<string, GuardianBrand> = {
  cubix: brand("Homa", "Hỏa kỳ lân", "hỏa", "Kỳ lân lửa lanh lợi, bùng sáng khi người học tìm đúng nhịp giải.", ["Hỏa Châu", "Hỏa Hoa", "Noãn Giáp", "Nhật Vũ"], "pipra"),
  vane: brand("Rilu", "Thủy long rái cá", "thủy", "Linh thú nước vui tính, dùng đuôi sóng để giữ nhịp và chữa lành.", ["Thủy Châu", "Lam Triều", "Tịnh Lưu", "Ngân Hải"], "mimo"),
  scalera: brand("Kemi", "Kim sư tinh", "kim", "Sư tử kim quang chính xác, dùng giáp xoay để đổi hướng đòn phép.", ["Kim Quang", "Hoàn Giáp", "Phản Quang", "Thiên Kim Trận"], "voltix"),
  voltaria: brand("Toru", "Tinh quy thạch", "thổ", "Linh quy mang tinh thể, đứng vững để bảo vệ bạn đồng hành.", ["Thạch Tử", "Địa Thuẫn", "Trấn Bộ", "Sơn Thành"], "mossy"),
  mossar: brand("Veli", "Diệp linh giác", "mộc", "Linh thú lá non có sừng nhánh, làm nở mầm khi chuỗi học tập được giữ vững.", ["Diệp Phi", "Mầm Hoa", "Sinh Khí", "Vạn Mộc"], "coru"),
  coris: brand("Sylu", "Hoa lộc linh", "mộc", "Linh hươu hoa nhẹ bước, dẫn sinh khí để khóa nhịp đối thủ.", ["Diệp Tiễn", "Lục Hoàn", "Mộc Phược", "Thanh Lâm"], "aeris"),
  aerion: brand("Brum", "Địa thần nham", "thổ", "Linh thú đá tròn chắc, càng bình tĩnh càng tạo được lớp địa giáp dày.", ["Nham Châu", "Trọng Giáp", "Địa Neo", "Đại Địa Tâm"], "brix"),
  brio: brand("Sori", "Liệt hồ", "hỏa", "Hồ ly hỏa dực ấm áp, chuyển nhiệt thành những vòng sáng dễ đọc.", ["Hỏa Tinh", "Dương Hoàn", "Ấm Quang", "Nhật Thăng"], "luma"),
  lumen: brand("Aomi", "Thủy miêu lưu quang", "thủy", "Linh miêu thủy sinh linh hoạt, dùng đuôi nước để đổi hướng dòng phép.", ["Lam Châu", "Thủy Vũ", "Sương Màn", "Hải Hoàn"], "nori"),
  noris: brand("Livi", "Diệp miêu linh", "mộc", "Linh miêu lá thân thiện, đôi cánh lá mở rộng theo tiến bộ học tập.", ["Mầm Sáng", "Hoa Giác", "Lộc Tức", "Xuân Lâm"], "pavo"),
  pavor: brand("Karo", "Hỏa long ấu", "hỏa", "Rồng lửa nhỏ nhanh và gan dạ, chiếc đuôi hỏa vũ là dấu hiệu không thể nhầm lẫn.", ["Viêm Tử", "Vĩ Hỏa", "Hỏa Bộ", "Liệt Nhật"], "soli"),
  solaris: brand("Zeni", "Kim dực miêu", "kim", "Linh miêu có cánh kim quang, nổi bật bởi giáp sáng và phản xạ chính xác.", ["Ngân Tinh", "Từ Hoàn", "Kim Thuẫn", "Tinh Kim"], "dexo"),
  dexia: brand("Aroa", "Hải quy linh", "thủy", "Linh quy biển cân bằng, dựng vòm nước để chia đều lực và nhịp trận.", ["Thủy Tinh", "Vĩ Triều", "Thanh Tẩy", "Nguyệt Hải"], "maru"),
  marion: brand("Yori", "Mộc lửng linh", "mộc", "Linh lửng rừng nhanh nhẹn, lao qua đối thủ bằng dải lá sáng.", ["Lá Sao", "Hoa Xoáy", "Lục Bộ", "Bích Lâm"], "sena"),
  senia: brand("Moru", "Thổ huyền thú", "thổ", "Linh thú đá tối mang tinh thể, dựng các mốc địa lực để điều tiết nhịp trận.", ["Thổ Tinh", "Thạch Trụ", "Trầm Trọng", "Địa Mạch"], "kora"),
  koran: brand("Hổm", "Hỏa lân khúc", "hỏa", "Linh sủng phát triển từ bản vẽ gia đình: thân chữ S, bốn chân nhỏ, sừng nhánh và đuôi hoa lửa.", ["Hỏa Châu", "Hỏa Hoa", "Noãn Giáp", "Nhật Vĩ Vũ"], "vexa"),
  vexan: brand("Orin", "Kim cú tinh", "kim", "Cú kim loại bảo hộ, dùng đôi cánh tinh thể để ghép khiên chính xác.", ["Kim Điểm", "Hoàn Trận", "Hộ Quang", "Thiên Hoàn"], "runo"),
  runon: brand("Tilu", "Thủy long vũ", "thủy", "Thủy long nhỏ uốn thân theo dòng nước và hỗ trợ đồng đội bằng nhịp sóng mềm.", ["Bọt Lam", "Cầu Triều", "Thủy Dưỡng", "Hải Cầu"], "tavi"),
  tavira: brand("Kintar", "Kim lộc tinh", "kim", "Linh hươu giáp sáng mạnh mẽ nhưng thân thiện, tập trung lực qua tinh thể trán.", ["Kim Xạ", "Tinh Kích", "Bạch Giáp", "Kim Nhật"], "oryx"),
  nexia: brand("Fenu", "Mộc long non", "mộc", "Linh long mầm cây hoạt bát, tạo dấu vân lá để tăng nhịp học và chiến đấu.", ["Mầm Quang", "Vân Diệp", "Sinh Mạch", "Mộc Tinh Vũ"], "nexa"),
  "atlas-prime": brand("Rokan", "Sơn giáp vương", "thổ", "Thủ hộ Map 1: linh thú địa tầng lớn, kiên định và thiên về phòng thủ chiến thuật.", ["Nham Tinh", "Sơn Môn", "Địa Trấn", "Vạn Sơn"], "atlas"),
  myrion: brand("Astra", "Thiên kim kỳ lân", "kim", "Thủ hộ Map 2: kỳ lân kim quang điều khiển các mảnh tinh thể theo quỹ đạo.", ["Tinh Phi", "Quỹ Hoàn", "Phản Kính", "Thiên Tinh Trận"], "myrion"),
};

export const GUARDIAN_AFFINITY: Record<string, GuardianAffinity> = Object.fromEntries(
  Object.entries(GUARDIAN_BRANDING).map(([id, item]) => [id, item.affinity]),
) as Record<string, GuardianAffinity>;

export const getGuardianBrand = (id: string | undefined) =>
  id ? GUARDIAN_BRANDING[id] : undefined;

for (const guardian of GUARDIANS) {
  const item = GUARDIAN_BRANDING[guardian.id];
  if (!item) continue;
  guardian.name = item.name;
  guardian.type = `${item.affinity.toUpperCase()} · ${item.species}`;
  guardian.description = item.description;
  guardian.sprite = `/guardians/${item.artwork}.webp`;
}

const map1 = GUARDIAN_BRANDING["atlas-prime"];
MAP_BOSS_ARCHIVES[1].name = map1.name;
MAP_BOSS_ARCHIVES[1].title = "Sơn Giáp Vương · Người Giữ Nhật Ký Mực Chàm";
MAP_BOSS_ARCHIVES[1].note = map1.description;
MAP_BOSS_ARCHIVES[1].sprite = `/guardians/${map1.artwork}.webp`;

const map2 = GUARDIAN_BRANDING.myrion;
MAP_BOSS_ARCHIVES[2].name = map2.name;
MAP_BOSS_ARCHIVES[2].title = "Thiên Kim Kỳ Lân · Người Gác La Bàn Vàng";
MAP_BOSS_ARCHIVES[2].note = map2.description;
MAP_BOSS_ARCHIVES[2].sprite = `/guardians/${map2.artwork}.webp`;
