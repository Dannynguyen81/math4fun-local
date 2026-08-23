/**
 * Math4Fun Guardian visual canon.
 *
 * Existing guardian IDs and the legacy battle `element` field are intentionally kept
 * for localStorage/combat backward compatibility. This module replaces all user-facing
 * creature identity and artwork with original Math4Fun pets, while recording the new
 * five-element affinity and spell kit for the next combat-system migration.
 */
import { GUARDIANS, MAP_BOSS_ARCHIVES } from "./gameData";

export type GuardianAffinity = "hỏa" | "thủy" | "mộc" | "kim" | "thổ";
export type GuardianSpellTier = "basic" | "signature" | "utility" | "ultimate";

export type GuardianSpellBrand = {
  name: string;
  tier: GuardianSpellTier;
  visual: string;
};

export type GuardianBrand = {
  name: string;
  species: string;
  affinity: GuardianAffinity;
  role: "striker" | "guardian" | "support" | "control" | "balanced";
  description: string;
  signatureTraits: [string, string];
  spells: [GuardianSpellBrand, GuardianSpellBrand, GuardianSpellBrand, GuardianSpellBrand];
  sprite: string;
};

const pet = (
  id: string,
  name: string,
  species: string,
  affinity: GuardianAffinity,
  role: GuardianBrand["role"],
  description: string,
  signatureTraits: [string, string],
  spells: GuardianBrand["spells"],
): GuardianBrand => ({
  name,
  species,
  affinity,
  role,
  description,
  signatureTraits,
  spells,
  sprite: `/guardians/${id}.webp`,
});

export const GUARDIAN_BRANDING: Record<string, GuardianBrand> = {
  pipra: pet("pipra", "Homa", "Hỏa miêu tinh", "hỏa", "striker", "Linh sủng nhỏ bùng sáng khi người học tìm đúng nhịp giải.", ["bờm lửa cánh hoa", "đuôi ember cong"], [{ name: "Hỏa Châu", tier: "basic", visual: "quả cầu lửa vàng" }, { name: "Hỏa Hoa", tier: "signature", visual: "vòng cánh lửa" }, { name: "Noãn Giáp", tier: "utility", visual: "màng lửa bảo hộ" }, { name: "Nhật Vũ", tier: "ultimate", visual: "xoắn lửa mặt trời" }]),
  mimo: pet("mimo", "Rilu", "Thủy mao linh", "thủy", "support", "Linh sủng nước vui tính, gom những giọt sáng thành dòng chữa lành.", ["tai vây trong", "đuôi sóng kép"], [{ name: "Thủy Châu", tier: "basic", visual: "bọt nước sáng" }, { name: "Lam Triều", tier: "signature", visual: "dải sóng lam" }, { name: "Tịnh Lưu", tier: "utility", visual: "vòng nước hồi phục" }, { name: "Ngân Hải", tier: "ultimate", visual: "triều sáng cuộn tròn" }]),
  voltix: pet("voltix", "Kemi", "Kim giác thú", "kim", "control", "Linh sủng kim loại chính xác, dùng giáp xoay để đổi hướng đòn phép.", ["giáp sứ kim", "sừng tinh thể"], [{ name: "Kim Quang", tier: "basic", visual: "tia kim sáng" }, { name: "Hoàn Giáp", tier: "signature", visual: "vòng giáp xoay" }, { name: "Phản Quang", tier: "utility", visual: "mặt khiên phản xạ" }, { name: "Thiên Kim Trận", tier: "ultimate", visual: "vòng kim quang nhiều lớp" }]),
  mossy: pet("mossy", "Toru", "Thạch giáp linh", "thổ", "guardian", "Linh sủng mai đá hiền lành, đứng vững để bảo vệ bạn đồng hành.", ["mai đá xếp tầng", "mầm rêu vàng"], [{ name: "Thạch Tử", tier: "basic", visual: "viên đá sáng" }, { name: "Địa Thuẫn", tier: "signature", visual: "khiên địa tầng" }, { name: "Trấn Bộ", tier: "utility", visual: "vòng neo đất" }, { name: "Sơn Thành", tier: "ultimate", visual: "thành đá mọc vòng cung" }]),
  coru: pet("coru", "Veli", "Diệp hồ linh", "mộc", "support", "Linh sủng lá non nhạy bén, làm nở mầm mỗi khi chuỗi học tập được giữ vững.", ["tai lá xếp tầng", "đuôi dây leo"], [{ name: "Diệp Phi", tier: "basic", visual: "lá sáng lượn" }, { name: "Mầm Hoa", tier: "signature", visual: "vòng nụ nở" }, { name: "Sinh Khí", tier: "utility", visual: "hào quang lá" }, { name: "Vạn Mộc", tier: "ultimate", visual: "tán cây sáng bung mở" }]),
  aeris: pet("aeris", "Sylu", "Vân diệp thú", "mộc", "control", "Linh sủng nhẹ như lá, dẫn luồng sinh khí để khóa nhịp đối thủ.", ["bờm lá bay", "vân xoắn trên chân"], [{ name: "Diệp Tiễn", tier: "basic", visual: "lá xoáy" }, { name: "Lục Hoàn", tier: "signature", visual: "vòng dây leo" }, { name: "Mộc Phược", tier: "utility", visual: "rễ sáng giữ chân" }, { name: "Thanh Lâm", tier: "ultimate", visual: "rừng ánh sáng trỗi dậy" }]),
  brix: pet("brix", "Brum", "Nham cầu thú", "thổ", "guardian", "Linh sủng tròn chắc, càng bình tĩnh càng tạo được lớp địa giáp dày.", ["vai đá tròn", "tinh thể hổ phách"], [{ name: "Nham Châu", tier: "basic", visual: "đá hổ phách" }, { name: "Trọng Giáp", tier: "signature", visual: "giáp đá khép lại" }, { name: "Địa Neo", tier: "utility", visual: "vòng neo nâu vàng" }, { name: "Đại Địa Tâm", tier: "ultimate", visual: "tâm chấn ánh vàng" }]),
  luma: pet("luma", "Sori", "Dương hỏa thú", "hỏa", "balanced", "Linh sủng ánh dương ấm áp, chuyển nhiệt thành những vòng sáng dễ đọc.", ["mào lửa mềm", "vân mặt trời"], [{ name: "Hỏa Tinh", tier: "basic", visual: "tia lửa tròn" }, { name: "Dương Hoàn", tier: "signature", visual: "vòng thái dương" }, { name: "Ấm Quang", tier: "utility", visual: "lá chắn vàng" }, { name: "Nhật Thăng", tier: "ultimate", visual: "mặt trời nhỏ bừng lên" }]),
  nori: pet("nori", "Aomi", "Lam vây linh", "thủy", "control", "Linh sủng thủy sinh linh hoạt, dùng vây như dải lụa để đổi hướng dòng phép.", ["vây lụa", "sừng giọt nước"], [{ name: "Lam Châu", tier: "basic", visual: "giọt lam" }, { name: "Thủy Vũ", tier: "signature", visual: "vây hóa dải sóng" }, { name: "Sương Màn", tier: "utility", visual: "màn sương mỏng" }, { name: "Hải Hoàn", tier: "ultimate", visual: "xoáy nước trong suốt" }]),
  pavo: pet("pavo", "Livi", "Hoa lộc linh", "mộc", "support", "Linh sủng hươu lá thân thiện, nụ hoa trên sừng nở theo tiến bộ học tập.", ["sừng cành hoa", "lông dạng lá"], [{ name: "Mầm Sáng", tier: "basic", visual: "hạt sáng xanh" }, { name: "Hoa Giác", tier: "signature", visual: "sừng nở hoa" }, { name: "Lộc Tức", tier: "utility", visual: "vòng hồi phục" }, { name: "Xuân Lâm", tier: "ultimate", visual: "hoa lá phủ chiến trường" }]),
  soli: pet("soli", "Karo", "Liệt vĩ linh", "hỏa", "striker", "Linh sủng nhanh và gan dạ, chiếc đuôi hỏa vũ là dấu hiệu không thể nhầm lẫn.", ["đuôi hoa lửa", "vân hỏa chạy lưng"], [{ name: "Viêm Tử", tier: "basic", visual: "tia lửa ngắn" }, { name: "Vĩ Hỏa", tier: "signature", visual: "đuôi quét vòng lửa" }, { name: "Hỏa Bộ", tier: "utility", visual: "bước lửa tăng tốc" }, { name: "Liệt Nhật", tier: "ultimate", visual: "cột lửa vàng cam" }]),
  dexo: pet("dexo", "Zeni", "Ngân giáp linh", "kim", "balanced", "Linh sủng kim quang nhỏ gọn, nổi bật bởi giáp sáng và vòng từ lực.", ["giáp bạc vàng", "vòng từ lực ở đuôi"], [{ name: "Ngân Tinh", tier: "basic", visual: "mảnh sáng kim loại" }, { name: "Từ Hoàn", tier: "signature", visual: "vòng từ lực" }, { name: "Kim Thuẫn", tier: "utility", visual: "khiên bạc" }, { name: "Tinh Kim", tier: "ultimate", visual: "mưa tinh thể vàng bạc" }]),
  maru: pet("maru", "Aroa", "Thủy long miêu", "thủy", "balanced", "Linh sủng nửa mèo nửa thủy linh, uốn đuôi tạo vòng nước mềm.", ["râu nước", "đuôi vây lớn"], [{ name: "Thủy Tinh", tier: "basic", visual: "giọt nước sáng" }, { name: "Vĩ Triều", tier: "signature", visual: "đuôi tạo triều" }, { name: "Thanh Tẩy", tier: "utility", visual: "bọt nước trong" }, { name: "Nguyệt Hải", tier: "ultimate", visual: "sóng trăng lam" }]),
  sena: pet("sena", "Yori", "Mộc miêu hoa", "mộc", "striker", "Linh sủng rừng nhanh nhẹn, lao qua đối thủ bằng dải lá sáng thay vì vũ khí.", ["tai lá nhọn mềm", "đuôi hoa xoắn"], [{ name: "Lá Sao", tier: "basic", visual: "lá sáng hình sao" }, { name: "Hoa Xoáy", tier: "signature", visual: "đuôi hoa xoay" }, { name: "Lục Bộ", tier: "utility", visual: "bước lá tăng né" }, { name: "Bích Lâm", tier: "ultimate", visual: "vòm rừng xanh sáng" }]),
  kora: pet("kora", "Moru", "Tinh thạch thú", "thổ", "control", "Linh sủng đất mang tinh thể, có thể dựng các mốc đá để điều tiết nhịp trận.", ["tinh thể trên mai", "chân đất khối mềm"], [{ name: "Thổ Tinh", tier: "basic", visual: "mảnh tinh thể nâu" }, { name: "Thạch Trụ", tier: "signature", visual: "cột tinh thể mọc lên" }, { name: "Trầm Trọng", tier: "utility", visual: "vòng đất giảm tốc" }, { name: "Địa Mạch", tier: "ultimate", visual: "đường sáng chạy dưới đất" }]),
  vexa: pet("vexa", "Hổm", "Hỏa lân khúc", "hỏa", "balanced", "Linh sủng phát triển từ bản vẽ gốc của gia đình: thân chữ S, bốn chân nhỏ, sừng nhánh và đuôi hoa lửa.", ["thân dài chữ S", "đuôi hoa lửa"], [{ name: "Hỏa Châu", tier: "basic", visual: "cầu lửa từ đuôi" }, { name: "Hỏa Hoa", tier: "signature", visual: "bờm bung cánh lửa" }, { name: "Noãn Giáp", tier: "utility", visual: "màng lửa vàng" }, { name: "Nhật Vĩ Vũ", tier: "ultimate", visual: "đuôi vẽ xoắn lửa lớn" }]),
  runo: pet("runo", "Orin", "Kim hoàn thú", "kim", "support", "Linh sủng bảo hộ có các vòng kim loại nổi, ghép chúng thành khiên chính xác.", ["vòng kim nổi", "mào bạc mềm"], [{ name: "Kim Điểm", tier: "basic", visual: "điểm sáng vàng" }, { name: "Hoàn Trận", tier: "signature", visual: "ba vòng kim xoay" }, { name: "Hộ Quang", tier: "utility", visual: "vòm kim quang" }, { name: "Thiên Hoàn", tier: "ultimate", visual: "nhiều vòng bảo hộ đồng tâm" }]),
  tavi: pet("tavi", "Tilu", "Thủy cầu linh", "thủy", "support", "Linh sủng nhỏ thích lăn trong bong bóng nước và hỗ trợ đồng đội bằng nhịp hồi phục.", ["bụng giọt nước", "đuôi bong bóng"], [{ name: "Bọt Lam", tier: "basic", visual: "bong bóng lam" }, { name: "Cầu Triều", tier: "signature", visual: "bọt nước lớn" }, { name: "Thủy Dưỡng", tier: "utility", visual: "mưa giọt hồi phục" }, { name: "Hải Cầu", tier: "ultimate", visual: "quả cầu nước khổng lồ" }]),
  oryx: pet("oryx", "Kintar", "Kim lân thú", "kim", "striker", "Linh sủng giáp sáng mạnh mẽ nhưng thân thiện, tập trung lực qua tinh thể trán.", ["tinh thể trán", "giáp vảy vàng bạc"], [{ name: "Kim Xạ", tier: "basic", visual: "tia sáng hẹp" }, { name: "Tinh Kích", tier: "signature", visual: "tinh thể phát xung" }, { name: "Bạch Giáp", tier: "utility", visual: "giáp bạc sáng" }, { name: "Kim Nhật", tier: "ultimate", visual: "quầng sáng vàng trắng" }]),
  nexa: pet("nexa", "Fenu", "Mầm vân linh", "mộc", "balanced", "Linh sủng mầm cây hoạt bát, tạo dấu vân lá để tăng nhịp học và nhịp chiến đấu.", ["mào mầm xoắn", "dấu vân lá"], [{ name: "Mầm Quang", tier: "basic", visual: "mầm sáng" }, { name: "Vân Diệp", tier: "signature", visual: "vòng vân lá" }, { name: "Sinh Mạch", tier: "utility", visual: "đường xanh hồi phục" }, { name: "Mộc Tinh Vũ", tier: "ultimate", visual: "mưa lá phát sáng" }]),
  atlas: pet("atlas", "Rokan", "Sơn giáp vương", "thổ", "guardian", "Thủ hộ Map 1: linh thú địa tầng lớn, kiên định và thiên về phòng thủ chiến thuật.", ["giáp sơn tầng", "tinh thể hổ phách lớn"], [{ name: "Nham Tinh", tier: "basic", visual: "đá sáng xoay" }, { name: "Sơn Môn", tier: "signature", visual: "cổng đá bảo hộ" }, { name: "Địa Trấn", tier: "utility", visual: "vòng trấn đất" }, { name: "Vạn Sơn", tier: "ultimate", visual: "dãy núi ánh vàng trỗi dậy" }]),
  myrion: pet("myrion", "Astra", "Thiên kim linh", "kim", "control", "Thủ hộ Map 2: linh thú kim quang nhẹ, điều khiển các mảnh tinh thể theo quỹ đạo.", ["vương miện tinh thể", "dải kim quang bay"], [{ name: "Tinh Phi", tier: "basic", visual: "mảnh tinh thể bay" }, { name: "Quỹ Hoàn", tier: "signature", visual: "vòng quỹ đạo kim" }, { name: "Phản Kính", tier: "utility", visual: "mặt gương bảo hộ" }, { name: "Thiên Tinh Trận", tier: "ultimate", visual: "chòm tinh thể vàng bạc" }]),
};

export const GUARDIAN_AFFINITY: Record<string, GuardianAffinity> = Object.fromEntries(
  Object.entries(GUARDIAN_BRANDING).map(([id, brand]) => [id, brand.affinity]),
) as Record<string, GuardianAffinity>;

export function getGuardianBrand(id: string | undefined) {
  return id ? GUARDIAN_BRANDING[id] : undefined;
}

function applyGuardianBranding() {
  for (const guardian of GUARDIANS) {
    const brand = GUARDIAN_BRANDING[guardian.id];
    if (!brand) continue;
    guardian.name = brand.name;
    guardian.type = `${brand.affinity.toUpperCase()} · ${brand.species}`;
    guardian.description = brand.description;
    guardian.sprite = brand.sprite;
  }

  const map1 = GUARDIAN_BRANDING.atlas;
  MAP_BOSS_ARCHIVES[1].name = map1.name;
  MAP_BOSS_ARCHIVES[1].type = `${map1.affinity.toUpperCase()} · ${map1.species}`;
  MAP_BOSS_ARCHIVES[1].description = map1.description;
  MAP_BOSS_ARCHIVES[1].sprite = map1.sprite;
  MAP_BOSS_ARCHIVES[1].tone = "vững chãi, bảo hộ và khích lệ";

  const map2 = GUARDIAN_BRANDING.myrion;
  MAP_BOSS_ARCHIVES[2].name = map2.name;
  MAP_BOSS_ARCHIVES[2].type = `${map2.affinity.toUpperCase()} · ${map2.species}`;
  MAP_BOSS_ARCHIVES[2].description = map2.description;
  MAP_BOSS_ARCHIVES[2].sprite = map2.sprite;
  MAP_BOSS_ARCHIVES[2].tone = "sáng rõ, chính xác và điềm tĩnh";
}

applyGuardianBranding();
