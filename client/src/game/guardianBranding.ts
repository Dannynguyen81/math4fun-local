/**
 * Original Math4Fun Guardian canon.
 *
 * Internal IDs and the legacy combat `element` field stay unchanged so existing
 * localStorage progress and battle balance remain compatible. User-facing names,
 * species, descriptions and artwork are replaced here. Five-element affinity and
 * spell names are recorded for the future combat migration.
 */
import { GUARDIANS, MAP_BOSS_ARCHIVES } from "./gameData";

export type GuardianAffinity = "hỏa" | "thủy" | "mộc" | "kim" | "thổ";

type GuardianBrand = {
  name: string;
  species: string;
  affinity: GuardianAffinity;
  description: string;
  spells: readonly [string, string, string, string];
};

const brand = (
  name: string,
  species: string,
  affinity: GuardianAffinity,
  description: string,
  spells: GuardianBrand["spells"],
): GuardianBrand => ({ name, species, affinity, description, spells });

export const GUARDIAN_BRANDING: Record<string, GuardianBrand> = {
  pipra: brand("Homa", "Hỏa miêu tinh", "hỏa", "Linh sủng nhỏ bùng sáng khi người học tìm đúng nhịp giải.", ["Hỏa Châu", "Hỏa Hoa", "Noãn Giáp", "Nhật Vũ"]),
  mimo: brand("Rilu", "Thủy mao linh", "thủy", "Linh sủng nước vui tính, gom những giọt sáng thành dòng chữa lành.", ["Thủy Châu", "Lam Triều", "Tịnh Lưu", "Ngân Hải"]),
  voltix: brand("Kemi", "Kim giác thú", "kim", "Linh sủng kim loại chính xác, dùng giáp xoay để đổi hướng đòn phép.", ["Kim Quang", "Hoàn Giáp", "Phản Quang", "Thiên Kim Trận"]),
  mossy: brand("Toru", "Thạch giáp linh", "thổ", "Linh sủng mai đá hiền lành, đứng vững để bảo vệ bạn đồng hành.", ["Thạch Tử", "Địa Thuẫn", "Trấn Bộ", "Sơn Thành"]),
  coru: brand("Veli", "Diệp hồ linh", "mộc", "Linh sủng lá non nhạy bén, làm nở mầm khi chuỗi học tập được giữ vững.", ["Diệp Phi", "Mầm Hoa", "Sinh Khí", "Vạn Mộc"]),
  aeris: brand("Sylu", "Vân diệp thú", "mộc", "Linh sủng nhẹ như lá, dẫn luồng sinh khí để khóa nhịp đối thủ.", ["Diệp Tiễn", "Lục Hoàn", "Mộc Phược", "Thanh Lâm"]),
  brix: brand("Brum", "Nham cầu thú", "thổ", "Linh sủng tròn chắc, càng bình tĩnh càng tạo được lớp địa giáp dày.", ["Nham Châu", "Trọng Giáp", "Địa Neo", "Đại Địa Tâm"]),
  luma: brand("Sori", "Dương hỏa thú", "hỏa", "Linh sủng ánh dương ấm áp, chuyển nhiệt thành những vòng sáng dễ đọc.", ["Hỏa Tinh", "Dương Hoàn", "Ấm Quang", "Nhật Thăng"]),
  nori: brand("Aomi", "Lam vây linh", "thủy", "Linh sủng thủy sinh linh hoạt, dùng vây như dải lụa để đổi hướng dòng phép.", ["Lam Châu", "Thủy Vũ", "Sương Màn", "Hải Hoàn"]),
  pavo: brand("Livi", "Hoa lộc linh", "mộc", "Linh sủng hươu lá thân thiện, nụ hoa trên sừng nở theo tiến bộ học tập.", ["Mầm Sáng", "Hoa Giác", "Lộc Tức", "Xuân Lâm"]),
  soli: brand("Karo", "Liệt vĩ linh", "hỏa", "Linh sủng nhanh và gan dạ, chiếc đuôi hỏa vũ là dấu hiệu không thể nhầm lẫn.", ["Viêm Tử", "Vĩ Hỏa", "Hỏa Bộ", "Liệt Nhật"]),
  dexo: brand("Zeni", "Ngân giáp linh", "kim", "Linh sủng kim quang nhỏ gọn, nổi bật bởi giáp sáng và vòng từ lực.", ["Ngân Tinh", "Từ Hoàn", "Kim Thuẫn", "Tinh Kim"]),
  maru: brand("Aroa", "Thủy long miêu", "thủy", "Linh sủng nửa mèo nửa thủy linh, uốn đuôi tạo vòng nước mềm.", ["Thủy Tinh", "Vĩ Triều", "Thanh Tẩy", "Nguyệt Hải"]),
  sena: brand("Yori", "Mộc miêu hoa", "mộc", "Linh sủng rừng nhanh nhẹn, lao qua đối thủ bằng dải lá sáng.", ["Lá Sao", "Hoa Xoáy", "Lục Bộ", "Bích Lâm"]),
  kora: brand("Moru", "Tinh thạch thú", "thổ", "Linh sủng đất mang tinh thể, dựng các mốc đá để điều tiết nhịp trận.", ["Thổ Tinh", "Thạch Trụ", "Trầm Trọng", "Địa Mạch"]),
  vexa: brand("Hổm", "Hỏa lân khúc", "hỏa", "Linh sủng phát triển từ bản vẽ gia đình: thân chữ S, bốn chân nhỏ, sừng nhánh và đuôi hoa lửa.", ["Hỏa Châu", "Hỏa Hoa", "Noãn Giáp", "Nhật Vĩ Vũ"]),
  runo: brand("Orin", "Kim hoàn thú", "kim", "Linh sủng bảo hộ có các vòng kim loại nổi, ghép chúng thành khiên chính xác.", ["Kim Điểm", "Hoàn Trận", "Hộ Quang", "Thiên Hoàn"]),
  tavi: brand("Tilu", "Thủy cầu linh", "thủy", "Linh sủng nhỏ thích lăn trong bong bóng nước và hỗ trợ đồng đội.", ["Bọt Lam", "Cầu Triều", "Thủy Dưỡng", "Hải Cầu"]),
  oryx: brand("Kintar", "Kim lân thú", "kim", "Linh sủng giáp sáng mạnh mẽ nhưng thân thiện, tập trung lực qua tinh thể trán.", ["Kim Xạ", "Tinh Kích", "Bạch Giáp", "Kim Nhật"]),
  nexa: brand("Fenu", "Mầm vân linh", "mộc", "Linh sủng mầm cây hoạt bát, tạo dấu vân lá để tăng nhịp học và chiến đấu.", ["Mầm Quang", "Vân Diệp", "Sinh Mạch", "Mộc Tinh Vũ"]),
  atlas: brand("Rokan", "Sơn giáp vương", "thổ", "Thủ hộ Map 1: linh thú địa tầng lớn, kiên định và thiên về phòng thủ chiến thuật.", ["Nham Tinh", "Sơn Môn", "Địa Trấn", "Vạn Sơn"]),
  myrion: brand("Astra", "Thiên kim linh", "kim", "Thủ hộ Map 2: linh thú kim quang điều khiển các mảnh tinh thể theo quỹ đạo.", ["Tinh Phi", "Quỹ Hoàn", "Phản Kính", "Thiên Tinh Trận"]),
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
  guardian.sprite = `/guardians/${guardian.id}.webp`;
}

const map1 = GUARDIAN_BRANDING.atlas;
MAP_BOSS_ARCHIVES[1].name = map1.name;
MAP_BOSS_ARCHIVES[1].title = "Sơn Giáp Vương · Người Giữ Nhật Ký Mực Chàm";
MAP_BOSS_ARCHIVES[1].note = map1.description;
MAP_BOSS_ARCHIVES[1].sprite = "/guardians/atlas.webp";

const map2 = GUARDIAN_BRANDING.myrion;
MAP_BOSS_ARCHIVES[2].name = map2.name;
MAP_BOSS_ARCHIVES[2].title = "Thiên Kim Linh · Người Gác La Bàn Vàng";
MAP_BOSS_ARCHIVES[2].note = map2.description;
MAP_BOSS_ARCHIVES[2].sprite = "/guardians/myrion.webp";
