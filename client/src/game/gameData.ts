/**
 * Math4Fun data — Field Journal Quest.
 * Design note: all gameplay content is local-only. A question tagged as verified
 * has an Archimede source recorded in research/*_verification_notes.md.
 */

export const HERO_IMAGE = "/manus-storage/math4fun-hero-journey_c4c6745e.jpg";
export const ARENA_IMAGE = "/manus-storage/math4fun-arcane-arena-reference_3e0f6085.jpg";
export const CARD_IMAGE = "/manus-storage/math4fun-guardian-card_0acf6e09.jpg";
export const STICKERS_IMAGE = "/manus-storage/math4fun-reward-stickers_3366726f.jpg";
export const LOGO_IMAGE = "/manus-storage/math4fun-logo-mark_7740cd77.png";
export const ELEMENTS_IMAGE = "/manus-storage/math4fun-spell-elements_450241d7.png";
export const PROFILE_IMAGE = "/manus-storage/math4fun-profile-compass_bf90b6cf.png";
export const BATTLE_AUDIO = "/manus-storage/math4fun-battle-loop_053e734b.wav";

export type Difficulty = "E" | "M" | "H";
export type Book = "Tập 1" | "Tập 2";
export type TopicStatus = "ready" | "survey";

export type Guardian = {
  id: string;
  name: string;
  type: string;
  element: "lửa" | "nước" | "gió" | "sấm" | "độc" | "đất";
  description: string;
  stationId: number | "boss";
  sprite: string;
  tone: string;
};

export type Station = {
  id: number;
  code: string;
  title: string;
  brief: string;
  group: string;
  book: Book;
  guardianId: string;
  accent: string;
  questionIds: string[];
  masteryTarget: number;
  status: TopicStatus;
};

export type VerifiedQuestion = {
  id: string;
  stationId: number;
  source: string;
  prompt: string;
  supportingText?: string;
  choices: number[];
  answer: number;
  hint: string;
  explanation: string;
  difficulty: Difficulty;
  pool: "station" | "boss";
};

export type Spell = {
  id: "thunder" | "flame" | "tide" | "gust" | "venom" | "quarry";
  name: string;
  element: string;
  icon: string;
  tone: string;
  damage: number;
  counterDamage: number;
  note: string;
};

export type ElementName = Guardian["element"];

export type MagicMedia = {
  title: string;
  shortLabel: string;
  src: string;
  note: string;
};

export type ElementMatchup = {
  strongAgainst: ElementName;
  weakAgainst: ElementName;
  fieldNote: string;
};

export type WeeklyMagicQuestDefinition = {
  element: ElementName;
  target: number;
  title: string;
  note: string;
  rewardXp: number;
};

export type CosmeticSlot = "outfit" | "trail";
export type ShopItem = {
  id: "potion-25" | "potion-50" | "potion-100" | "outfit-indigo" | "outfit-marigold" | "outfit-moss" | "trail-stars" | "trail-leaves";
  label: string;
  price: number;
  description: string;
  tone: string;
  icon: string;
  kind: "healing" | "cosmetic";
  heal?: number;
  slot?: CosmeticSlot;
  setId?: "indigo" | "moss";
};

export type CosmeticSetDefinition = {
  id: "indigo" | "moss";
  label: string;
  motif: string;
  note: string;
  itemIds: ShopItem["id"][];
  bonusGold: number;
  bonusXp: number;
};

const sprite = (id: number) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const GUARDIANS: Guardian[] = [
  { id: "pipra", name: "Pipra", type: "SEQUENCE / SCOUT", element: "gió", description: "Bạn đồng hành mở đầu, ghi dấu từng bước của dãy số trước khi suy luận.", stationId: 1, sprite: sprite(172), tone: "bg-emerald-500" },
  { id: "mimo", name: "Mimo", type: "MEAN / GUIDE", element: "nước", description: "Dùng la bàn cân bằng để nhìn ra tổng ẩn sau trung bình cộng.", stationId: 2, sprite: sprite(298), tone: "bg-sky-500" },
  { id: "voltix", name: "Voltix", type: "UNIT / SPARK", element: "sấm", description: "Biết chia nhỏ mỗi đơn vị trước khi nhân rộng con đường.", stationId: 3, sprite: sprite(403), tone: "bg-amber-400" },
  { id: "mossy", name: "Mossy", type: "DIFFERENCE / TRAIL", element: "đất", description: "Dẫn đường qua bài toán thừa–thiếu bằng những dấu chân cân bằng.", stationId: 4, sprite: sprite(387), tone: "bg-lime-500" },
  { id: "coru", name: "Coru", type: "FRACTION / COMPASS", element: "lửa", description: "Chia hành trình thành những phần bằng nhau thật rõ ràng.", stationId: 5, sprite: sprite(447), tone: "bg-rose-400" },
  { id: "aeris", name: "Aeris", type: "AREA / FIELD", element: "gió", description: "Ghi kích thước vùng đất bằng những ô lưới gọn gàng.", stationId: 6, sprite: sprite(280), tone: "bg-cyan-500" },
  { id: "brix", name: "Brix", type: "MASS / CRAFT", element: "đất", description: "Chỉ ra phép đổi đơn vị qua từng viên gạch ký hiệu.", stationId: 7, sprite: sprite(66), tone: "bg-orange-500" },
  { id: "luma", name: "Luma", type: "TIME / LANTERN", element: "lửa", description: "Giữ nhịp thời gian của mỗi cuộc thám hiểm.", stationId: 8, sprite: sprite(175), tone: "bg-yellow-400" },
  { id: "nori", name: "Nori", type: "GRAPH / TIDE", element: "nước", description: "Đọc số liệu như đọc làn sóng trên bản đồ.", stationId: 9, sprite: sprite(183), tone: "bg-blue-500" },
  { id: "pavo", name: "Pavo", type: "PERIMETER / MARK", element: "độc", description: "Đánh dấu chu vi và diện tích bằng những nét mực tím gọn gàng.", stationId: 10, sprite: sprite(234), tone: "bg-violet-500" },
  { id: "soli", name: "Soli", type: "REVERSE / FLAME", element: "lửa", description: "Lần ngược dấu vết để tìm số ban đầu.", stationId: 11, sprite: sprite(37), tone: "bg-red-500" },
  { id: "dexo", name: "Dexo (Pikachu)", type: "MULTIPLY / SPARK", element: "sấm", description: "Bạn đồng hành Pikachu hệ Sấm sét, biến quy luật nhân chia thành tia chớp có thứ tự.", stationId: 12, sprite: sprite(25), tone: "bg-amber-500" },
  { id: "maru", name: "Maru", type: "DIVIDE / TIDE", element: "nước", description: "Chia đường đi đều nhau, không bỏ sót dấu mốc.", stationId: 13, sprite: sprite(158), tone: "bg-teal-500" },
  { id: "sena", name: "Sena", type: "DECIMAL / MIST", element: "gió", description: "Giữ những con số bé xíu đúng vị trí trên dòng kẻ.", stationId: 14, sprite: sprite(133), tone: "bg-slate-500" },
  { id: "kora", name: "Kora", type: "COMPOSITE / LEAF", element: "đất", description: "Ghép mảnh và ghi diện tích các hình cắt theo từng dấu lá.", stationId: 15, sprite: sprite(152), tone: "bg-green-500" },
  { id: "vexa", name: "Vexa", type: "RATIO / VENOM", element: "độc", description: "Đọc các quan hệ hơn–kém qua ký hiệu tím kín đáo.", stationId: 16, sprite: sprite(23), tone: "bg-fuchsia-500" },
  { id: "runo", name: "Runo", type: "MONEY / COIN", element: "lửa", description: "Canh giữ phép tính mua bán bằng dấu niêm phong đồng.", stationId: 17, sprite: sprite(52), tone: "bg-orange-400" },
  { id: "tavi", name: "Tavi", type: "DATA / NOTE", element: "nước", description: "Chép số liệu thành bảng gọn và dễ đọc.", stationId: 18, sprite: sprite(54), tone: "bg-indigo-400" },
  { id: "oryx", name: "Oryx", type: "REVIEW / STORM", element: "sấm", description: "Ghép các dấu vết cũ thành một cơn mưa ôn tập.", stationId: 19, sprite: sprite(135), tone: "bg-yellow-500" },
  { id: "nexa", name: "Nexa", type: "MIXED / ARCHIVE", element: "gió", description: "Người ghi chép cuối tuyến cho bài toán tổng hợp.", stationId: 20, sprite: sprite(196), tone: "bg-indigo-600" },
  { id: "atlas", name: "Atlas", type: "BOSS / ARCHIVE", element: "độc", description: "Người giữ kho lưu trữ. Atlas phản công ở mọi lượt, kể cả khi em trả lời đúng.", stationId: "boss", sprite: sprite(143), tone: "bg-indigo-700" },
];

/** Field Journal Quest: a shared local-only catalog for the Boss study reel and Magic Book gallery. */
export const MAGIC_MEDIA: Record<ElementName, MagicMedia> = {
  "sấm": { title: "Tia Chớp Số Học", shortLabel: "SẤM ẤN", src: "/manus-storage/thunder-number-spell_ea927287.mp4", note: "Tia chớp nạp từ một phép tính đúng." },
  "lửa": { title: "Hỏa Ấn Số Học", shortLabel: "HỎA ẤN", src: "/manus-storage/FlameSeal_5f0136e4.mp4", note: "Dấu số ghép thành ngọn lửa quyết tâm." },
  "nước": { title: "Thủy Triều Số Học", shortLabel: "THỦY ẤN", src: "/manus-storage/TideSeal_750f204b.mp4", note: "Con số được cân bằng như những làn sóng." },
  "độc": { title: "Độc Ấn Quy Luật", shortLabel: "ĐỘC ẤN", src: "/manus-storage/VenomSeal_c53ae165.mp4", note: "Chuỗi dấu tím nối lại theo một quy luật kín đáo." },
  "gió": { title: "Gió Ấn Mở Đường", shortLabel: "GIÓ ẤN", src: "/manus-storage/WindGlyph_954183b6.mp4", note: "Những bước suy luận tạo thành đường gió mở tuyến mới." },
  "đất": { title: "Địa Ấn Cân Bằng", shortLabel: "ĐỊA ẤN", src: "/manus-storage/EarthSeal_bc898ab9.mp4", note: "Các dấu số dựng thành nền đất bền vững." },
};

/** Quy ước chiến thuật riêng của Math4Fun; dùng để đọc Sổ Phép, chưa thay đổi điểm Toán. */
export const ELEMENTAL_MATCHUPS: Record<ElementName, ElementMatchup> = {
  "sấm": { strongAgainst: "nước", weakAgainst: "đất", fieldNote: "Tia chớp xuyên qua dòng nước, nhưng bị nền đất dẫn xuống an toàn." },
  "lửa": { strongAgainst: "gió", weakAgainst: "nước", fieldNote: "Hỏa ấn đốt tan lớp sương gió, nhưng dịu đi trước thủy triều." },
  "nước": { strongAgainst: "lửa", weakAgainst: "sấm", fieldNote: "Làn nước dập lửa, nhưng cần né những tia sấm đang nạp điện." },
  "độc": { strongAgainst: "đất", weakAgainst: "gió", fieldNote: "Độc ấn len vào khe đất, nhưng bị luồng gió phân tán." },
  "gió": { strongAgainst: "độc", weakAgainst: "lửa", fieldNote: "Phong ấn cuốn đi mây độc, nhưng phải giữ khoảng cách với hỏa ấn." },
  "đất": { strongAgainst: "sấm", weakAgainst: "độc", fieldNote: "Thạch ấn tiếp đất an toàn, nhưng cần che kín các mạch đất trước độc ấn." },
};

/** Mốc tiến độ riêng theo hệ; mỗi 100 XP là một bậc luyện ấn mới. */
export const ELEMENT_XP_PER_LEVEL = 100;
export const ELEMENT_ORDER: ElementName[] = ["sấm", "lửa", "nước", "độc", "gió", "đất"];

/** Nhiệm vụ luân phiên theo tuần ISO, tính cục bộ và chỉ tiến triển trong trận Boss. */
export const WEEKLY_MAGIC_QUESTS: WeeklyMagicQuestDefinition[] = [
  { element: "sấm", target: 3, title: "Ba tia chớp có chủ đích", note: "Kích hoạt Sấm ấn ba lượt trong trận Boss.", rewardXp: 45 },
  { element: "lửa", target: 3, title: "Giữ lửa suy luận", note: "Kích hoạt Hỏa ấn ba lượt trong trận Boss.", rewardXp: 45 },
  { element: "nước", target: 3, title: "Ba nhịp thủy triều", note: "Kích hoạt Thủy ấn ba lượt trong trận Boss.", rewardXp: 45 },
  { element: "độc", target: 3, title: "Dấu tím kín đáo", note: "Kích hoạt Độc ấn ba lượt trong trận Boss.", rewardXp: 45 },
  { element: "gió", target: 3, title: "Mở ba đường gió", note: "Kích hoạt Gió ấn ba lượt trong trận Boss.", rewardXp: 45 },
  { element: "đất", target: 3, title: "Ba nền đất vững", note: "Kích hoạt Địa ấn ba lượt trong trận Boss.", rewardXp: 45 },
];

export const STATIONS: Station[] = [
  { id: 1, code: "T1.01", title: "Dãy số & quy luật", brief: "Đếm số hạng, dự đoán quy luật và tính tổng bằng những bước nhảy có ghi chép.", group: "Số và quy luật", book: "Tập 1", guardianId: "pipra", accent: "bg-emerald-500", questionIds: ["B80a", "B80b", "B81a", "B82a", "B87b", "B83a-count", "B83a-term50", "B83a-sum", "B86a", "B86b"], masteryTarget: 10, status: "ready" },
  { id: 2, code: "T2.01", title: "Trung bình cộng", brief: "Dùng tổng và số phần để cân bằng dữ liệu, tuổi và những đại lượng chưa biết.", group: "Đại lượng và bài toán", book: "Tập 2", guardianId: "mimo", accent: "bg-sky-500", questionIds: ["T2-B1a", "T2-B1b", "T2-B1c", "T2-B1d", "T2-B1.4a", "T2-B1.4b", "T2-B2.1", "T2-B2.2", "T2-B2.3", "T2-B2.4"], masteryTarget: 10, status: "ready" },
  { id: 3, code: "T2.02", title: "Rút về đơn vị", brief: "Tìm giá trị một đơn vị rồi mở rộng theo số lần như nhau.", group: "Đại lượng và bài toán", book: "Tập 2", guardianId: "voltix", accent: "bg-amber-400", questionIds: ["T2-RVD-apple", "T2-RVD-cloth", "T2-RVD-1", "T2-RVD-2", "T2-RVD-3", "T2-RVD-candy", "T2-RVD-workers-m", "T2-RVD-workers-days", "T2-RVD-B12.1", "T2-RVD-B12.2", "T2-RVD-B12.3", "T2-RVD-B12.4"], masteryTarget: 10, status: "ready" },
  { id: 4, code: "T2.03", title: "Bài toán thừa–thiếu", brief: "Dùng hiệu của hai cách chia để lần ra số người và số vật.", group: "Đại lượng và bài toán", book: "Tập 2", guardianId: "mossy", accent: "bg-lime-500", questionIds: ["T2-TT-apple-pupils", "T2-TT-apple-total", "T2-TT-marbles-bags", "T2-TT-marbles-total", "T2-TT-shirts-total", "T2-TT-notebooks-pupils", "T2-TT-notebooks-total", "T2-TT-mango-total", "T2-TT-candy-total", "T2-TT-trucks-count"], masteryTarget: 10, status: "ready" },
  { id: 5, code: "T1.02", title: "Phân số", brief: "Nhận biết phần bằng nhau và so sánh phần của một đơn vị.", group: "Phân số", book: "Tập 1", guardianId: "coru", accent: "bg-rose-400", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 6, code: "T1.03", title: "Diện tích hình chữ nhật", brief: "Dùng chu vi, chiều dài và chiều rộng để ghi nhận vùng đất qua đơn vị đo.", group: "Hình học & đo lường", book: "Tập 1", guardianId: "aeris", accent: "bg-cyan-500", questionIds: ["T1-AREA-116-p", "T1-AREA-116-diff", "T1-AREA-116-length", "T1-AREA-116-width", "T1-AREA-116-area", "T1-AREA-117-p", "T1-AREA-117-square", "T1-AREA-117-length", "T1-AREA-117-width", "T1-AREA-117-area"], masteryTarget: 10, status: "ready" },
  { id: 7, code: "T1.04", title: "Khối lượng", brief: "Đổi đơn vị và xử lý phép tính theo khối lượng.", group: "Hình học & đo lường", book: "Tập 1", guardianId: "brix", accent: "bg-orange-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 8, code: "T1.05", title: "Thời gian", brief: "Đọc lịch, giờ và quãng thời gian chính xác.", group: "Hình học & đo lường", book: "Tập 1", guardianId: "luma", accent: "bg-yellow-400", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 9, code: "T1.06", title: "Bảng số liệu", brief: "Tìm thông tin, tổng và hiệu qua bảng dữ liệu.", group: "Dữ liệu", book: "Tập 1", guardianId: "nori", accent: "bg-blue-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 10, code: "T1.G1", title: "Chu vi & diện tích", brief: "Tìm cạnh, chu vi và diện tích hình vuông, hình chữ nhật qua dấu mực hình học.", group: "Hình học & đo lường", book: "Tập 1", guardianId: "pavo", accent: "bg-violet-500", questionIds: ["T1-G1-ex1-perimeter", "T1-G1-ex1-width", "T1-G1-ex1-area", "T1-G1-ex2-width", "T1-G1-ex2-length", "T1-G1-ex2-area", "T1-G1-b56-side", "T1-G1-b56-area", "T1-G1-b57-width", "T1-G1-b57-area"], masteryTarget: 10, status: "ready" },
  { id: 11, code: "T1.08", title: "Bài toán tổng–hiệu", brief: "Lần theo sơ đồ đoạn thẳng để tìm hai số qua tổng và hiệu.", group: "Đại lượng và bài toán", book: "Tập 1", guardianId: "soli", accent: "bg-red-500", questionIds: ["T1-TH-118-first", "T1-TH-118-second", "T1-TH-119-first", "T1-TH-119-second", "T1-TH-120-box1", "T1-TH-120-box2", "T1-TH-121-lower", "T1-TH-122-thu", "T1-TH-123-older", "T1-TH-124-mother"], masteryTarget: 10, status: "ready" },
  { id: 12, code: "T1.09", title: "Nhân & chia", brief: "Củng cố quy tắc tính, tính chất phép toán và tìm ẩn số.", group: "Số và phép tính", book: "Tập 1", guardianId: "dexo", accent: "bg-amber-500", questionIds: ["T1-NC-136a", "T1-NC-136b", "T1-NC-136c", "T1-NC-136d", "T1-NC-137g", "T1-NC-138a", "T1-NC-138b", "T1-NC-138d", "T1-NC-140-first", "T1-NC-141-first"], masteryTarget: 10, status: "ready" },
  { id: 13, code: "T2.06", title: "Chia có dư", brief: "Đọc thương và số dư trong mỗi tình huống thực tế.", group: "Số và phép tính", book: "Tập 2", guardianId: "maru", accent: "bg-teal-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 14, code: "T2.07", title: "Số thập phân", brief: "Đọc, viết và so sánh các phần mười, phần trăm.", group: "Số và phép tính", book: "Tập 2", guardianId: "sena", accent: "bg-slate-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 15, code: "T1.G2", title: "Hình ghép & mảnh cắt", brief: "Tách khung, phần lõm và mảnh cắt để tính diện tích qua các dấu lá.", group: "Hình học & đo lường", book: "Tập 1", guardianId: "kora", accent: "bg-green-500", questionIds: ["T1-G2-ex3-area", "T1-G2-ex4-outer", "T1-G2-ex4-cutout", "T1-G2-ex4-area", "T1-G2-b60-width", "T1-G2-b60-length", "T1-G2-b60-area", "T1-G2-b61-length", "T1-G2-b61-area", "T1-G2-b67-area"], masteryTarget: 10, status: "ready" },
  { id: 16, code: "T2.09", title: "Tổng–hiệu", brief: "Dùng sơ đồ đoạn thẳng để giải quan hệ tổng và hiệu.", group: "Đại lượng và bài toán", book: "Tập 2", guardianId: "vexa", accent: "bg-fuchsia-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 17, code: "T2.10", title: "Tiền Việt Nam", brief: "Tính toán mua bán bằng các mệnh giá quen thuộc.", group: "Đại lượng và bài toán", book: "Tập 2", guardianId: "runo", accent: "bg-orange-400", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 18, code: "T2.11", title: "Thống kê & xác suất", brief: "Ghi nhận bảng, biểu đồ và khả năng xảy ra của một việc.", group: "Dữ liệu", book: "Tập 2", guardianId: "tavi", accent: "bg-indigo-400", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 19, code: "T2.12", title: "Ôn tập số học", brief: "Kết nối dấu vết số học của cả năm thành một tuyến ôn tập.", group: "Ôn tập tổng hợp", book: "Tập 2", guardianId: "oryx", accent: "bg-yellow-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 20, code: "T2.13", title: "Ôn tập tổng hợp", brief: "Tổng hợp các dạng bài trước khi chạm đến kho lưu trữ cuối tuyến.", group: "Ôn tập tổng hợp", book: "Tập 2", guardianId: "nexa", accent: "bg-indigo-600", questionIds: [], masteryTarget: 10, status: "survey" },
];

export const QUESTIONS: VerifiedQuestion[] = [
  { id: "B80a", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 38 · Bài 80a", prompt: "Cho dãy số cách đều 2024; 2022; 2020; …; 20. Dãy số trên có bao nhiêu số hạng?", choices: [1002, 1003, 1004, 1012], answer: 1003, hint: "Tính số khoảng giảm rồi cộng số hạng đầu tiên.", explanation: "Có (2024 − 20) : 2 = 1002 khoảng giảm, nên có 1003 số hạng.", difficulty: "E", pool: "station" },
  { id: "B80b", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 38 · Bài 80b", prompt: "Vẫn với dãy 2024; 2022; 2020; …; 20, số hạng thứ 258 là số nào?", choices: [1508, 1510, 1512, 1514], answer: 1510, hint: "Đi 257 bước từ số đầu, mỗi bước giảm 2.", explanation: "2024 − 257 × 2 = 1510.", difficulty: "M", pool: "station" },
  { id: "B81a", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 38 · Bài 81a", prompt: "Cho dãy số cách đều 0; 3; 6; 9; … Tìm số hạng thứ 75.", choices: [219, 222, 225, 228], answer: 222, hint: "Số hạng thứ 75 đi 74 bước từ 0.", explanation: "0 + 74 × 3 = 222.", difficulty: "E", pool: "station" },
  { id: "B82a", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 38 · Bài 82a", prompt: "Cho dãy số cách đều 11; 16; 21; 26; … Tìm số hạng thứ 85.", choices: [421, 426, 431, 436], answer: 431, hint: "Số hạng thứ 85 cách số hạng đầu 84 bước, mỗi bước tăng 5.", explanation: "11 + 84 × 5 = 431.", difficulty: "M", pool: "station" },
  { id: "B87b", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 87b", prompt: "Dãy 1; 2; 4; 7; 11; … có khoảng tăng 1; 2; 3; 4; … Số hạng thứ 10 là bao nhiêu?", choices: [42, 44, 46, 48], answer: 46, hint: "Sau 11, lần lượt cộng 5; 6; 7; 8; 9.", explanation: "Các số tiếp theo là 16; 22; 29; 37; 46.", difficulty: "H", pool: "station" },
  { id: "B83a-count", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 38 · Bài 83a", prompt: "Cho tổng A = 1 + 3 + 5 + … + 199. Tổng A có bao nhiêu số hạng?", choices: [98, 99, 100, 101], answer: 100, hint: "Đây là dãy số lẻ cách đều 2.", explanation: "(199 − 1) : 2 = 99 khoảng, nên có 100 số hạng.", difficulty: "E", pool: "station" },
  { id: "B83a-term50", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 38 · Bài 83a", prompt: "Trong dãy 1; 3; 5; …; 199, số hạng thứ 50 là số nào?", choices: [97, 99, 101, 103], answer: 99, hint: "Từ số đầu đi 49 bước, mỗi bước tăng 2.", explanation: "1 + 49 × 2 = 99.", difficulty: "M", pool: "station" },
  { id: "B83a-sum", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 38 · Bài 83a", prompt: "Tính A = 1 + 3 + 5 + … + 199.", choices: [9900, 9950, 10000, 10100], answer: 10000, hint: "Dùng số đầu, số cuối và 100 số hạng.", explanation: "(1 + 199) × 100 : 2 = 10000.", difficulty: "H", pool: "station" },
  { id: "B86a", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 86a", prompt: "Tính tổng 10 số tự nhiên liên tiếp kể từ 12.", choices: [155, 160, 165, 170], answer: 165, hint: "Số thứ 10 là 21.", explanation: "(12 + 21) × 10 : 2 = 165.", difficulty: "M", pool: "station" },
  { id: "B86b", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 86b", prompt: "Tính tổng 12 số chẵn liên tiếp kể từ 60.", choices: [828, 840, 852, 864], answer: 852, hint: "Số chẵn thứ 12 là 82.", explanation: "(60 + 82) × 12 : 2 = 852.", difficulty: "H", pool: "station" },
  { id: "T2-B1a", stationId: 2, source: "Archimede Toán 4 Tập 2 · PDF tr. 10 · Bài 1.1a", prompt: "Tìm trung bình cộng của 12; 16; 20.", choices: [14, 15, 16, 17], answer: 16, hint: "Cộng ba số rồi chia cho 3.", explanation: "(12 + 16 + 20) : 3 = 16.", difficulty: "E", pool: "station" },
  { id: "T2-B1b", stationId: 2, source: "Archimede Toán 4 Tập 2 · PDF tr. 10 · Bài 1.1b", prompt: "Tìm trung bình cộng của 7; 15; 23; 35.", choices: [18, 19, 20, 21], answer: 20, hint: "Tổng là 80, rồi chia cho 4.", explanation: "(7 + 15 + 23 + 35) : 4 = 20.", difficulty: "E", pool: "station" },
  { id: "T2-B1c", stationId: 2, source: "Archimede Toán 4 Tập 2 · PDF tr. 10 · Bài 1.1c", prompt: "Tìm trung bình cộng của 41; 45; 42; 44.", choices: [41, 42, 43, 44], answer: 43, hint: "Tổng là 172.", explanation: "172 : 4 = 43.", difficulty: "E", pool: "station" },
  { id: "T2-B1d", stationId: 2, source: "Archimede Toán 4 Tập 2 · PDF tr. 10 · Bài 1.1d", prompt: "Tìm trung bình cộng của 92; 98; 67; 81; 52.", choices: [76, 77, 78, 79], answer: 78, hint: "Tính tổng năm số trước, sau đó chia 5.", explanation: "Tổng là 390, nên trung bình cộng là 78.", difficulty: "M", pool: "station" },
  { id: "T2-B1.4a", stationId: 2, source: "Archimede Toán 4 Tập 2 · PDF tr. 10 · Bài 1.4a", prompt: "Tính trung bình cộng điểm: 7; 8; 9; 9; 10; 10; 10; 8; 9; 10.", choices: [8, 9, 10, 11], answer: 9, hint: "Có 10 điểm, hãy tính tổng rồi chia 10.", explanation: "Tổng là 90 nên trung bình cộng là 9.", difficulty: "M", pool: "station" },
  { id: "T2-B1.4b", stationId: 2, source: "Archimede Toán 4 Tập 2 · PDF tr. 10 · Bài 1.4b", prompt: "Trong dãy điểm 7; 8; 9; 9; 10; 10; 10; 8; 9; 10, có bao nhiêu điểm nhỏ hơn trung bình cộng?", choices: [2, 3, 4, 5], answer: 3, hint: "Trung bình cộng của dãy là 9.", explanation: "Nhỏ hơn 9 là 7; 8; 8, có 3 điểm.", difficulty: "M", pool: "station" },
  { id: "T2-B2.1", stationId: 2, source: "Archimede Toán 4 Tập 2 · PDF tr. 12 · Bài 2.1", prompt: "Trung bình cộng của ba số là 273. Số thứ nhất là 253 và hơn số thứ hai 53 đơn vị. Tìm số thứ ba.", choices: [356, 366, 376, 386], answer: 366, hint: "Tổng ba số là 273 × 3; số thứ hai là 253 − 53.", explanation: "Tổng là 819, số thứ hai là 200, nên số thứ ba là 366.", difficulty: "M", pool: "station" },
  { id: "T2-B2.2", stationId: 2, source: "Archimede Toán 4 Tập 2 · PDF tr. 12 · Bài 2.2", prompt: "Trung bình cộng của năm số là 245. Nếu bớt số thứ năm thì trung bình cộng của bốn số là 230. Tìm số thứ năm.", choices: [295, 305, 315, 325], answer: 305, hint: "So sánh tổng của 5 số với tổng của 4 số.", explanation: "Tổng 5 số là 1225, tổng 4 số là 920; số thứ năm là 305.", difficulty: "H", pool: "station" },
  { id: "T2-B2.3", stationId: 2, source: "Archimede Toán 4 Tập 2 · PDF tr. 12 · Bài 2.3", prompt: "Trung bình cộng của bốn số là 3500. Nếu thêm số thứ năm là 2800 thì trung bình cộng của năm số là bao nhiêu?", choices: [3260, 3320, 3360, 3400], answer: 3360, hint: "Từ trung bình cộng bốn số hãy tìm tổng bốn số.", explanation: "Tổng mới là 3500 × 4 + 2800 = 16800; 16800 : 5 = 3360.", difficulty: "H", pool: "station" },
  { id: "T2-B2.4", stationId: 2, source: "Archimede Toán 4 Tập 2 · PDF tr. 12 · Bài 2.4", prompt: "TBC tuổi bố, mẹ và Hoa là 30. Nếu không tính bố, TBC tuổi mẹ và Hoa là 24. Bố hiện nay bao nhiêu tuổi?", choices: [40, 42, 44, 46], answer: 42, hint: "Lấy tổng tuổi của ba người trừ tổng tuổi mẹ và Hoa.", explanation: "Tổng ba người là 90, mẹ và Hoa là 48; bố 42 tuổi.", difficulty: "H", pool: "station" },
  { id: "T2-B4.1", stationId: 2, source: "Archimede Toán 4 Tập 2 · PDF tr. 15 · Bài 4.1", prompt: "Một sách giá 340 000 đồng, một bộ đồ chơi giá 560 000 đồng. Bộ quần áo có giá bằng trung bình cộng giá cả ba món. Hỏi mẹ mua hết bao nhiêu nghìn đồng?", choices: [1250, 1300, 1350, 1400], answer: 1350, hint: "Gọi giá bộ quần áo là x nghìn đồng; x bằng trung bình cộng của 340, 560 và x.", explanation: "3x = 340 + 560 + x nên x = 450. Tổng là 340 + 560 + 450 = 1350 nghìn đồng.", difficulty: "H", pool: "boss" },
  { id: "T2-B4.2", stationId: 2, source: "Archimede Toán 4 Tập 2 · PDF tr. 15 · Bài 4.2", prompt: "Tổ Một thu 142 chai, nhiều hơn Tổ Hai 26 chai. Tổ Ba thu bằng trung bình cộng của ba tổ. Hỏi cả lớp thu bao nhiêu chai?", choices: [377, 382, 387, 392], answer: 387, hint: "Tổ Hai có 142 − 26 chai. Gọi số chai tổ Ba là x.", explanation: "Tổ Hai có 116 chai. x = (142 + 116 + x) : 3 nên x = 129. Tổng là 387 chai.", difficulty: "H", pool: "boss" },
  { id: "T2-B4.3", stationId: 2, source: "Archimede Toán 4 Tập 2 · PDF tr. 15 · Bài 4.3", prompt: "Thuỷ mua 30 nhãn vở, Hiền mua 20 nhãn vở. Hoà mua ít hơn trung bình cộng của ba bạn 6 nhãn. Hỏi Hoà mua bao nhiêu nhãn?", choices: [12, 14, 16, 18], answer: 16, hint: "Gọi số nhãn của Hoà là x, rồi dùng điều kiện x ít hơn trung bình cộng 6.", explanation: "x + 6 = (30 + 20 + x) : 3 nên 2x = 32 và x = 16.", difficulty: "H", pool: "boss" },
  { id: "T2-B4.4", stationId: 2, source: "Archimede Toán 4 Tập 2 · PDF tr. 15 · Bài 4.4", prompt: "Hai cầu dài 2477m và 1535m. Cầu Sông Hàn ngắn hơn trung bình cộng chiều dài ba cầu 1012m. Tính chiều dài cầu Sông Hàn.", choices: [468, 478, 488, 498], answer: 488, hint: "Gọi chiều dài cầu Sông Hàn là x; dùng x = TBC − 1012.", explanation: "3x = 2477 + 1535 + x − 3036, nên 2x = 976 và x = 488m.", difficulty: "H", pool: "boss" },
  { id: "T2-RVD-apple", stationId: 3, source: "Archimede Toán 4 Tập 2 · PDF tr. 33 · Bài toán 1", prompt: "Có 240 kg táo được đựng đều vào 8 thùng. Hỏi 10 thùng như thế có tất cả bao nhiêu ki-lô-gam táo?", choices: [280, 300, 320, 340], answer: 300, hint: "Tìm số táo trong 1 thùng trước.", explanation: "Mỗi thùng có 240 : 8 = 30 kg. 10 thùng có 30 × 10 = 300 kg.", difficulty: "E", pool: "station" },
  { id: "T2-RVD-cloth", stationId: 3, source: "Archimede Toán 4 Tập 2 · PDF tr. 33 · Bài toán 2", prompt: "May 5 bộ quần áo như nhau hết 15 m vải. Có 240 m vải thì may được bao nhiêu bộ quần áo như thế?", choices: [60, 70, 80, 90], answer: 80, hint: "Một bộ dùng bao nhiêu mét vải?", explanation: "Một bộ dùng 15 : 5 = 3 m. Có 240 : 3 = 80 bộ.", difficulty: "E", pool: "station" },
  { id: "T2-RVD-1", stationId: 3, source: "Archimede Toán 4 Tập 2 · PDF tr. 34 · Bài 1", prompt: "May 4 áo như nhau hết 8 m vải. May 24 áo như thế cần bao nhiêu mét vải?", choices: [40, 44, 48, 52], answer: 48, hint: "Tìm số mét vải dùng cho 1 áo.", explanation: "Một áo cần 8 : 4 = 2 m. 24 áo cần 2 × 24 = 48 m.", difficulty: "E", pool: "station" },
  { id: "T2-RVD-2", stationId: 3, source: "Archimede Toán 4 Tập 2 · PDF tr. 34 · Bài 2", prompt: "Một xưởng may 360 bộ quần áo trong 9 ngày. Với năng suất như nhau, trong 4 ngày xưởng may được bao nhiêu bộ?", choices: [140, 150, 160, 170], answer: 160, hint: "Tìm số bộ may trong một ngày.", explanation: "Mỗi ngày may 360 : 9 = 40 bộ. Trong 4 ngày may 40 × 4 = 160 bộ.", difficulty: "E", pool: "station" },
  { id: "T2-RVD-3", stationId: 3, source: "Archimede Toán 4 Tập 2 · PDF tr. 34 · Bài 3", prompt: "6 hộp như nhau có 72 cái bánh. 18 hộp như thế có bao nhiêu cái bánh?", choices: [196, 206, 216, 226], answer: 216, hint: "Một hộp có bao nhiêu cái bánh?", explanation: "Một hộp có 72 : 6 = 12 cái. 18 hộp có 12 × 18 = 216 cái.", difficulty: "E", pool: "station" },
  { id: "T2-RVD-candy", stationId: 3, source: "Archimede Toán 4 Tập 2 · PDF tr. 35 · Ví dụ 3", prompt: "8 gói kẹo như nhau đựng được 160 cái kẹo. 15 gói như thế đựng được bao nhiêu cái kẹo?", choices: [280, 290, 300, 320], answer: 300, hint: "Tìm số kẹo trong 1 gói trước.", explanation: "Mỗi gói có 160 : 8 = 20 cái. 15 gói có 20 × 15 = 300 cái.", difficulty: "E", pool: "station" },
  { id: "T2-RVD-workers-m", stationId: 3, source: "Archimede Toán 4 Tập 2 · PDF tr. 36 · Ví dụ 4", prompt: "5 công nhân đào trong 2 ngày được 20 m đường. 10 công nhân đào trong 4 ngày được bao nhiêu mét đường, biết năng suất mỗi người như nhau?", choices: [60, 70, 80, 90], answer: 80, hint: "Tính phần việc của 1 người trong 2 ngày, rồi đổi số người và số ngày.", explanation: "1 người trong 2 ngày đào 20 : 5 = 4 m. 10 người đào 40 m trong 2 ngày; trong 4 ngày đào 80 m.", difficulty: "M", pool: "station" },
  { id: "T2-RVD-workers-days", stationId: 3, source: "Archimede Toán 4 Tập 2 · PDF tr. 36 · Bài toán 4", prompt: "10 công nhân hoàn thành một công việc trong 30 ngày. Nếu có 20 công nhân với năng suất như nhau thì hoàn thành công việc đó trong bao lâu?", choices: [12, 15, 18, 20], answer: 15, hint: "Tổng số phần công việc là số công nhân nhân số ngày.", explanation: "Công việc có 10 × 30 = 300 phần công. 20 công nhân cần 300 : 20 = 15 ngày.", difficulty: "H", pool: "station" },
  { id: "T2-RVD-B12.1", stationId: 3, source: "Archimede Toán 4 Tập 2 · PDF tr. 39 · Bài 12.1", prompt: "Một xưởng may 981 bộ quần áo trong 9 ngày. Với năng suất như nhau, trong 3 ngày xưởng may được bao nhiêu bộ?", choices: [317, 327, 337, 347], answer: 327, hint: "Tìm số bộ quần áo may trong 1 ngày.", explanation: "Mỗi ngày may 981 : 9 = 109 bộ. Trong 3 ngày may 109 × 3 = 327 bộ.", difficulty: "M", pool: "station" },
  { id: "T2-RVD-B12.2", stationId: 3, source: "Archimede Toán 4 Tập 2 · PDF tr. 39 · Bài 12.2", prompt: "4 đôi dép giá 240 nghìn đồng, 3 đôi giày giá 375 nghìn đồng. Hỏi 3 đôi dép và 1 đôi giày giá bao nhiêu nghìn đồng?", choices: [285, 295, 305, 315], answer: 305, hint: "Tìm giá một đôi dép và một đôi giày riêng.", explanation: "Một đôi dép 240 : 4 = 60 nghìn; một đôi giày 375 : 3 = 125 nghìn. Tổng là 3 × 60 + 125 = 305 nghìn.", difficulty: "M", pool: "station" },
  { id: "T2-RVD-B12.3", stationId: 3, source: "Archimede Toán 4 Tập 2 · PDF tr. 39 · Bài 12.3", prompt: "6 gói có 240 cái kẹo. Lấy 4 gói chia đều cho mỗi bạn 5 cái. Có bao nhiêu bạn được chia?", choices: [24, 28, 32, 36], answer: 32, hint: "Tìm số kẹo của 4 gói rồi chia 5.", explanation: "Mỗi gói có 240 : 6 = 40 cái. 4 gói có 160 cái; 160 : 5 = 32 bạn.", difficulty: "M", pool: "station" },
  { id: "T2-RVD-B12.4", stationId: 3, source: "Archimede Toán 4 Tập 2 · PDF tr. 39 · Bài 12.4", prompt: "Hai đoàn xe chở cùng loại hàng. Đoàn thứ nhất có 9 xe, đoàn thứ hai có 6 xe và chênh nhau 222 bao hàng. Đoàn thứ nhất chở bao nhiêu bao?", choices: [636, 656, 666, 686], answer: 666, hint: "Hiệu số xe là 3 xe; tìm số bao mỗi xe rồi nhân 9.", explanation: "Mỗi xe chở 222 : (9 − 6) = 74 bao. Đoàn thứ nhất chở 74 × 9 = 666 bao.", difficulty: "H", pool: "station" },
  { id: "T2-TT-apple-pupils", stationId: 4, source: "Archimede Toán 4 Tập 2 · PDF tr. 25 · Bài mẫu táo chia cho các em", prompt: "Nếu chia táo cho mỗi em 3 quả thì thừa 2 quả; nếu chia mỗi em 4 quả thì thiếu 3 quả. Có bao nhiêu em được chia?", choices: [4, 5, 6, 7], answer: 5, hint: "So sánh phần thừa và thiếu khi tăng mỗi phần thêm 1 quả.", explanation: "Từ thừa 2 đến thiếu 3 chênh 5 quả. Mỗi em nhận thêm 1 quả nên có 5 em.", difficulty: "E", pool: "station" },
  { id: "T2-TT-apple-total", stationId: 4, source: "Archimede Toán 4 Tập 2 · PDF tr. 25 · Bài mẫu táo chia cho các em", prompt: "Với bài táo: chia 3 quả/em thì thừa 2, chia 4 quả/em thì thiếu 3. Có tất cả bao nhiêu quả táo?", choices: [15, 16, 17, 18], answer: 17, hint: "Đã biết có 5 em; tính theo cách chia 3 quả/em rồi cộng phần thừa.", explanation: "Có 5 em. Số táo là 5 × 3 + 2 = 17 quả.", difficulty: "M", pool: "station" },
  { id: "T2-TT-marbles-bags", stationId: 4, source: "Archimede Toán 4 Tập 2 · PDF tr. 26 · Ví dụ túi bi", prompt: "Bỏ 10 viên bi vào mỗi túi thì thừa 16 viên; bỏ 12 viên vào mỗi túi thì thừa 4 viên. Có bao nhiêu túi?", choices: [4, 5, 6, 7], answer: 6, hint: "Khi tăng 2 viên mỗi túi, số bi thừa giảm 12 viên.", explanation: "12 : (12 − 10) = 6 túi.", difficulty: "E", pool: "station" },
  { id: "T2-TT-marbles-total", stationId: 4, source: "Archimede Toán 4 Tập 2 · PDF tr. 26 · Ví dụ túi bi", prompt: "Bỏ 10 viên/túi thừa 16 viên, bỏ 12 viên/túi thừa 4 viên. Có tất cả bao nhiêu viên bi?", choices: [72, 74, 76, 78], answer: 76, hint: "Có 6 túi; dùng cách bỏ 10 viên mỗi túi và cộng phần thừa.", explanation: "6 × 10 + 16 = 76 viên bi.", difficulty: "M", pool: "station" },
  { id: "T2-TT-shirts-total", stationId: 4, source: "Archimede Toán 4 Tập 2 · PDF tr. 26–27 · Ví dụ áo/thùng", prompt: "Mỗi thùng 20 chiếc áo thì thiếu 5 chiếc; mỗi thùng 25 chiếc thì thiếu 40 chiếc. Có bao nhiêu chiếc áo?", choices: [125, 130, 135, 140], answer: 135, hint: "Số thiếu tăng 35 khi tăng 5 áo mỗi thùng, nên có 7 thùng.", explanation: "Có 7 thùng. Số áo là 7 × 20 − 5 = 135 chiếc.", difficulty: "M", pool: "station" },
  { id: "T2-TT-notebooks-pupils", stationId: 4, source: "Archimede Toán 4 Tập 2 · PDF tr. 28–29 · Luyện tập Bài 9, bài 1", prompt: "Cô giáo chia vở: mỗi bạn 5 quyển thì thừa 8 quyển, mỗi bạn 6 quyển thì vừa đủ. Có bao nhiêu bạn được chia vở?", choices: [6, 7, 8, 9], answer: 8, hint: "Mỗi bạn thêm 1 quyển sẽ dùng hết đúng 8 quyển đang thừa.", explanation: "Có 8 bạn được chia vở.", difficulty: "E", pool: "station" },
  { id: "T2-TT-notebooks-total", stationId: 4, source: "Archimede Toán 4 Tập 2 · PDF tr. 28–29 · Luyện tập Bài 9, bài 1", prompt: "Trong bài chia vở: mỗi bạn 5 quyển thì thừa 8, mỗi bạn 6 quyển thì vừa đủ. Cô giáo có bao nhiêu quyển vở?", choices: [42, 46, 48, 54], answer: 48, hint: "Có 8 bạn và chia 6 quyển cho mỗi bạn thì vừa đủ.", explanation: "8 × 6 = 48 quyển vở.", difficulty: "M", pool: "station" },
  { id: "T2-TT-mango-total", stationId: 4, source: "Archimede Toán 4 Tập 2 · PDF tr. 28–29 · Luyện tập Bài 9, bài 2", prompt: "Bác Hùng cho xoài vào hộp: mỗi hộp 10 quả thì vừa đủ, mỗi hộp 12 quả thì thiếu 10 quả. Bác Hùng thu hoạch bao nhiêu quả xoài?", choices: [40, 45, 50, 55], answer: 50, hint: "Số thiếu 10 quả ứng với tăng thêm 2 quả cho mỗi hộp, nên có 5 hộp.", explanation: "Có 5 hộp. Số xoài là 5 × 10 = 50 quả.", difficulty: "M", pool: "station" },
  { id: "T2-TT-candy-total", stationId: 4, source: "Archimede Toán 4 Tập 2 · PDF tr. 28–29 · Luyện tập Bài 9, bài 3", prompt: "Chị Nga cho kẹo: mỗi em 5 chiếc thì thừa 2 chiếc, mỗi em 6 chiếc thì thiếu 4 chiếc. Chị có bao nhiêu chiếc kẹo?", choices: [28, 30, 32, 34], answer: 32, hint: "Từ thừa 2 đến thiếu 4 là 6 chiếc; vì tăng 1 chiếc/em nên có 6 em.", explanation: "Có 6 em. Số kẹo là 6 × 5 + 2 = 32 chiếc.", difficulty: "H", pool: "station" },
  { id: "T2-TT-trucks-count", stationId: 4, source: "Archimede Toán 4 Tập 2 · PDF tr. 28–29 · Luyện tập Bài 9, bài 5", prompt: "Một tổ xe tải chở gạo: mỗi xe 15 bao thì thừa 15 bao, mỗi xe 20 bao thì thiếu 20 bao. Tổ có mấy xe tải?", choices: [5, 6, 7, 8], answer: 7, hint: "Phần chênh từ thừa 15 đến thiếu 20 là 35 bao; mỗi xe tăng 5 bao.", explanation: "35 : (20 − 15) = 7 xe tải.", difficulty: "H", pool: "station" },
  { id: "T1-NC-136a", stationId: 12, source: "Archimede Toán 4 Tập 1 · PDF tr. 53 · Bài 136A", prompt: "Tính nhanh: 25 × 9 × 8 × 4 × 125.", choices: [90000, 900000, 900900, 990000], answer: 900000, hint: "Ghép 25 × 4 và 8 × 125 trước.", explanation: "25 × 4 = 100; 8 × 125 = 1000; vậy 100 × 9 × 1000 = 900 000.", difficulty: "E", pool: "station" },
  { id: "T1-NC-136b", stationId: 12, source: "Archimede Toán 4 Tập 1 · PDF tr. 53 · Bài 136B", prompt: "Tính nhanh: 317 × 42 + 317 × 58.", choices: [30700, 31200, 31700, 32200], answer: 31700, hint: "Đặt 317 làm thừa số chung.", explanation: "317 × (42 + 58) = 317 × 100 = 31 700.", difficulty: "E", pool: "station" },
  { id: "T1-NC-136c", stationId: 12, source: "Archimede Toán 4 Tập 1 · PDF tr. 53 · Bài 136C", prompt: "Tính nhanh: 57 × 114 + 42 × 114 + 114.", choices: [10400, 10900, 11400, 11900], answer: 11400, hint: "Đưa 114 ra ngoài làm thừa số chung; 114 cũng bằng 1 × 114.", explanation: "(57 + 42 + 1) × 114 = 100 × 114 = 11 400.", difficulty: "M", pool: "station" },
  { id: "T1-NC-136d", stationId: 12, source: "Archimede Toán 4 Tập 1 · PDF tr. 53 · Bài 136D", prompt: "Tính nhanh: 576 × 87 + 576 × 13.", choices: [55600, 56600, 57600, 58600], answer: 57600, hint: "Đặt 576 làm thừa số chung và cộng 87 với 13.", explanation: "576 × (87 + 13) = 576 × 100 = 57 600.", difficulty: "M", pool: "station" },
  { id: "T1-NC-137g", stationId: 12, source: "Archimede Toán 4 Tập 1 · PDF tr. 53 · Bài 137G", prompt: "Tính nhanh: 9000 : 72 × 8.", choices: [800, 900, 1000, 1100], answer: 1000, hint: "Thực hiện chia rồi nhân từ trái sang phải.", explanation: "9000 : 72 = 125; 125 × 8 = 1000.", difficulty: "E", pool: "station" },
  { id: "T1-NC-138a", stationId: 12, source: "Archimede Toán 4 Tập 1 · PDF tr. 54 · Bài 138a", prompt: "Tìm a: (a − 32) × 2024 = 2024 × 27.", choices: [54, 57, 59, 62], answer: 59, hint: "Hai vế có cùng thừa số 2024 khác 0.", explanation: "a − 32 = 27 nên a = 59.", difficulty: "M", pool: "station" },
  { id: "T1-NC-138b", stationId: 12, source: "Archimede Toán 4 Tập 1 · PDF tr. 54 · Bài 138b", prompt: "Tìm a: 252 × 37 = 37 × (348 − a).", choices: [86, 91, 96, 101], answer: 96, hint: "Hai vế có cùng thừa số 37 khác 0.", explanation: "252 = 348 − a nên a = 348 − 252 = 96.", difficulty: "M", pool: "station" },
  { id: "T1-NC-138d", stationId: 12, source: "Archimede Toán 4 Tập 1 · PDF tr. 54 · Bài 138d", prompt: "Tìm a: a × 101 − a = 2400.", choices: [20, 22, 24, 26], answer: 24, hint: "a × 101 − a chính là a × (101 − 1).", explanation: "a × 100 = 2400 nên a = 24.", difficulty: "H", pool: "station" },
  { id: "T1-NC-140-first", stationId: 12, source: "Archimede Toán 4 Tập 1 · PDF tr. 54 · Bài 140", prompt: "Tích của hai số là 2860. Nếu thêm vào thừa số thứ nhất 30 đơn vị và giữ nguyên thừa số thứ hai thì tích mới là 4810. Thừa số thứ nhất ban đầu là bao nhiêu?", choices: [42, 44, 46, 48], answer: 44, hint: "Hiệu hai tích là 30 lần thừa số thứ hai.", explanation: "Thừa số thứ hai là (4810 − 2860) : 30 = 65. Thừa số thứ nhất là 2860 : 65 = 44.", difficulty: "H", pool: "station" },
  { id: "T1-NC-141-first", stationId: 12, source: "Archimede Toán 4 Tập 1 · PDF tr. 54 · Bài 141", prompt: "Tích của hai số là 6270. Nếu giữ nguyên thừa số thứ nhất và bớt ở thừa số thứ hai 6 đơn vị thì tích mới là 5610. Thừa số thứ nhất là bao nhiêu?", choices: [100, 105, 110, 115], answer: 110, hint: "Hiệu hai tích bằng 6 lần thừa số thứ nhất.", explanation: "Thừa số thứ nhất là (6270 − 5610) : 6 = 110.", difficulty: "H", pool: "station" },
  { id: "B85a", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 85a", prompt: "Có bao nhiêu số tự nhiên có hai chữ số mà chữ số tận cùng là 4?", choices: [8, 9, 10, 11], answer: 9, hint: "Viết dãy từ 14 đến 94, mỗi lần tăng 10.", explanation: "Dãy là 14; 24; …; 94. Có (94 − 14) : 10 + 1 = 9 số.", difficulty: "H", pool: "boss" },
  { id: "B84a", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 84a", prompt: "Tìm a: (a + 1) + (a + 3) + (a + 5) + … + (a + 17) = 513.", choices: [42, 44, 48, 51], answer: 48, hint: "Có 9 số hạng. Tổng phần số lẻ là 81.", explanation: "9a + 81 = 513 nên a = 48.", difficulty: "H", pool: "boss" },
  { id: "B84b", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 84b", prompt: "Tìm a: (a + 2) + (a + 4) + … + (a + 50) = 1150.", choices: [18, 20, 22, 25], answer: 20, hint: "Có 25 số hạng; tổng 2 + 4 + … + 50 là 650.", explanation: "25a + 650 = 1150 nên a = 20.", difficulty: "H", pool: "boss" },
  { id: "B84c", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 84c", prompt: "Tìm a: (a + 1) + (a + 4) + (a + 7) + … + (a + 34) = 282.", choices: [4, 6, 8, 12], answer: 6, hint: "Có 12 số hạng; tổng 1 + 4 + … + 34 là 210.", explanation: "12a + 210 = 282 nên a = 6.", difficulty: "H", pool: "boss" },
  { id: "B85b", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 85b", prompt: "Có bao nhiêu số tự nhiên có ba chữ số mà chữ số tận cùng là 5?", choices: [80, 89, 90, 91], answer: 90, hint: "Dãy là 105; 115; …; 995.", explanation: "Có (995 − 105) : 10 + 1 = 90 số.", difficulty: "H", pool: "boss" },
  { id: "B89", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 89", prompt: "Một quyển sách đánh số trang từ trang 3 đến trang 278. Hỏi cần bao nhiêu chữ số để đánh số trang?", choices: [714, 724, 734, 744], answer: 724, hint: "Tách các trang một chữ số, hai chữ số và ba chữ số.", explanation: "3–9: 7 chữ số; 10–99: 180; 100–278: 537. Tổng 724.", difficulty: "H", pool: "boss" },
  { id: "T1-AREA-116-p", stationId: 6, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 116", prompt: "Bài 116 cho một miếng đất hình chữ nhật có chu vi bao nhiêu xăng-ti-mét?", choices: [44, 46, 48, 50], answer: 48, hint: "Đọc đúng dữ kiện chu vi của đề bài.", explanation: "Đề bài ghi chu vi miếng đất là 48 cm.", difficulty: "E", pool: "station" },
  { id: "T1-AREA-116-diff", stationId: 6, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 116", prompt: "Ở Bài 116, chiều dài hơn chiều rộng bao nhiêu xăng-ti-mét?", choices: [2, 4, 6, 8], answer: 4, hint: "Đọc dữ kiện về hiệu hai kích thước.", explanation: "Đề bài cho chiều dài hơn chiều rộng 4 cm.", difficulty: "E", pool: "station" },
  { id: "T1-AREA-116-length", stationId: 6, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 116", prompt: "Một hình chữ nhật có chu vi 48 cm, chiều dài hơn chiều rộng 4 cm. Chiều dài là bao nhiêu xăng-ti-mét?", choices: [12, 14, 16, 18], answer: 14, hint: "Nửa chu vi là tổng chiều dài và chiều rộng: 24 cm.", explanation: "Chiều dài = (24 + 4) : 2 = 14 cm.", difficulty: "M", pool: "station" },
  { id: "T1-AREA-116-width", stationId: 6, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 116", prompt: "Vẫn hình chữ nhật ở Bài 116, chiều rộng là bao nhiêu xăng-ti-mét?", choices: [8, 10, 12, 14], answer: 10, hint: "Lấy tổng hai kích thước trừ hiệu, rồi chia 2.", explanation: "Chiều rộng = (24 − 4) : 2 = 10 cm.", difficulty: "M", pool: "station" },
  { id: "T1-AREA-116-area", stationId: 6, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 116", prompt: "Một miếng đất hình chữ nhật có chu vi 48 cm, chiều dài hơn chiều rộng 4 cm. Diện tích là bao nhiêu xăng-ti-mét vuông?", choices: [120, 130, 140, 150], answer: 140, hint: "Tìm chiều dài 14 cm và chiều rộng 10 cm trước.", explanation: "Diện tích là 14 × 10 = 140 cm².", difficulty: "H", pool: "station" },
  { id: "T1-AREA-117-p", stationId: 6, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 117", prompt: "Bài 117 cho một hình chữ nhật có chu vi bao nhiêu xăng-ti-mét?", choices: [86, 90, 96, 100], answer: 96, hint: "Đọc đúng dữ kiện chu vi của đề bài.", explanation: "Đề bài ghi chu vi hình chữ nhật là 96 cm.", difficulty: "E", pool: "station" },
  { id: "T1-AREA-117-square", stationId: 6, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 117", prompt: "Hình chữ nhật có chu vi 96 cm. Giảm chiều dài 4 cm, tăng chiều rộng 4 cm thì được hình vuông. Cạnh hình vuông là bao nhiêu xăng-ti-mét?", choices: [20, 22, 24, 26], answer: 24, hint: "Nửa chu vi là 48 cm; hai cạnh hình vuông bằng nhau.", explanation: "Cạnh hình vuông là 48 : 2 = 24 cm.", difficulty: "M", pool: "station" },
  { id: "T1-AREA-117-length", stationId: 6, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 117", prompt: "Với Bài 117, chiều dài ban đầu của hình chữ nhật là bao nhiêu xăng-ti-mét?", choices: [24, 26, 28, 30], answer: 28, hint: "Sau khi giảm 4 cm, chiều dài bằng cạnh hình vuông 24 cm.", explanation: "Chiều dài ban đầu là 24 + 4 = 28 cm.", difficulty: "M", pool: "station" },
  { id: "T1-AREA-117-width", stationId: 6, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 117", prompt: "Với Bài 117, chiều rộng ban đầu của hình chữ nhật là bao nhiêu xăng-ti-mét?", choices: [16, 18, 20, 22], answer: 20, hint: "Sau khi tăng 4 cm, chiều rộng bằng cạnh hình vuông 24 cm.", explanation: "Chiều rộng ban đầu là 24 − 4 = 20 cm.", difficulty: "M", pool: "station" },
  { id: "T1-AREA-117-area", stationId: 6, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 117", prompt: "Hình chữ nhật ở Bài 117 có diện tích bao nhiêu xăng-ti-mét vuông?", choices: [520, 540, 560, 580], answer: 560, hint: "Dùng chiều dài 28 cm và chiều rộng 20 cm.", explanation: "Diện tích là 28 × 20 = 560 cm².", difficulty: "H", pool: "station" },
  { id: "T1-TH-118-first", stationId: 11, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 118", prompt: "Số hạng thứ nhất kém số hạng thứ hai 48. Thêm 17 vào số hạng thứ nhất thì tổng mới là 335. Số hạng thứ nhất ban đầu là bao nhiêu?", choices: [125, 130, 135, 140], answer: 135, hint: "Tổng ban đầu là 335 − 17 = 318.", explanation: "Số thứ nhất = (318 − 48) : 2 = 135.", difficulty: "M", pool: "station" },
  { id: "T1-TH-118-second", stationId: 11, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 118", prompt: "Vẫn Bài 118, số hạng thứ hai ban đầu là bao nhiêu?", choices: [173, 178, 183, 188], answer: 183, hint: "Số hạng thứ hai hơn số hạng thứ nhất 48.", explanation: "Số hạng thứ hai là 135 + 48 = 183.", difficulty: "M", pool: "station" },
  { id: "T1-TH-119-first", stationId: 11, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 119", prompt: "Tổng hai số là 467. Thêm 19 vào số hạng thứ nhất thì số đó lớn hơn số hạng thứ hai 28. Số hạng thứ nhất ban đầu là bao nhiêu?", choices: [228, 233, 238, 243], answer: 238, hint: "Sau khi thêm, tổng mới là 486 và hiệu là 28.", explanation: "Số thứ nhất sau khi thêm là (486 + 28) : 2 = 257; ban đầu là 257 − 19 = 238.", difficulty: "H", pool: "station" },
  { id: "T1-TH-119-second", stationId: 11, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 119", prompt: "Vẫn Bài 119, số hạng thứ hai là bao nhiêu?", choices: [219, 224, 229, 234], answer: 229, hint: "Lấy tổng 467 trừ số hạng thứ nhất 238.", explanation: "Số hạng thứ hai là 467 − 238 = 229.", difficulty: "M", pool: "station" },
  { id: "T1-TH-120-box1", stationId: 11, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 120", prompt: "Hai hộp có 50 bút màu. Lấy 5 bút ở hộp thứ nhất thì hộp đó ít hơn hộp thứ hai 15 bút. Hộp thứ nhất lúc đầu có bao nhiêu bút?", choices: [15, 20, 25, 30], answer: 20, hint: "Sau khi lấy 5 bút, tổng còn 45 và hiệu là 15.", explanation: "Hộp thứ nhất sau khi lấy có 15 bút, nên lúc đầu có 20 bút.", difficulty: "M", pool: "station" },
  { id: "T1-TH-120-box2", stationId: 11, source: "Archimede Toán 4 Tập 1 · PDF tr. 49 · Bài 120", prompt: "Vẫn Bài 120, hộp thứ hai có bao nhiêu bút màu?", choices: [20, 25, 30, 35], answer: 30, hint: "Tổng hai hộp là 50 bút.", explanation: "Hộp thứ hai có 50 − 20 = 30 bút.", difficulty: "E", pool: "station" },
  { id: "T1-TH-121-lower", stationId: 11, source: "Archimede Toán 4 Tập 1 · PDF tr. 50 · Bài 121", prompt: "Hai ngăn có 184 quyển sách. Chuyển 50 quyển từ ngăn dưới lên ngăn trên thì ngăn dưới ít hơn ngăn trên 12 quyển. Ngăn dưới lúc đầu có bao nhiêu quyển?", choices: [116, 126, 136, 146], answer: 136, hint: "Sau khi chuyển, hiệu thay đổi thêm 100 quyển.", explanation: "Lúc đầu ngăn dưới hơn ngăn trên 88 quyển; ngăn dưới = (184 + 88) : 2 = 136.", difficulty: "H", pool: "station" },
  { id: "T1-TH-122-thu", stationId: 11, source: "Archimede Toán 4 Tập 1 · PDF tr. 50 · Bài 122", prompt: "Thú và Hà có 88 con hạc giấy. Nếu mỗi bạn gấp thêm 6 con thì Thú nhiều hơn Hà 12 con. Thú có bao nhiêu con hạc giấy lúc đầu?", choices: [44, 48, 50, 56], answer: 50, hint: "Gấp thêm bằng nhau nên hiệu hai bạn vẫn là 12.", explanation: "Thú có (88 + 12) : 2 = 50 con.", difficulty: "M", pool: "station" },
  { id: "T1-TH-123-older", stationId: 11, source: "Archimede Toán 4 Tập 1 · PDF tr. 50 · Bài 123", prompt: "Hai năm nữa tổng tuổi hai anh em là 27, anh hơn em 5 tuổi. Anh hiện nay bao nhiêu tuổi?", choices: [12, 13, 14, 15], answer: 14, hint: "Tổng tuổi hiện nay giảm 4 so với hai năm nữa.", explanation: "Hiện nay tổng tuổi là 23. Tuổi anh = (23 + 5) : 2 = 14.", difficulty: "H", pool: "station" },
  { id: "T1-TH-124-mother", stationId: 11, source: "Archimede Toán 4 Tập 1 · PDF tr. 50 · Bài 124", prompt: "Cách đây ba năm, tổng tuổi mẹ con là 35, mẹ hơn con 25 tuổi. Mẹ hiện nay bao nhiêu tuổi?", choices: [31, 32, 33, 34], answer: 33, hint: "Tổng tuổi hiện nay tăng thêm 6 so với ba năm trước.", explanation: "Hiện nay tổng là 41. Tuổi mẹ = (41 + 25) : 2 = 33.", difficulty: "H", pool: "station" },
  { id: "T1-G1-ex1-perimeter", stationId: 10, source: "Archimede Toán 4 Tập 1 · PDF tr. 28 · Ví dụ 1", prompt: "Một hình vuông có cạnh 16 cm. Hình chữ nhật có chu vi bằng chu vi hình vuông đó. Chu vi hình chữ nhật là bao nhiêu xăng-ti-mét?", choices: [48, 56, 64, 72], answer: 64, hint: "Tính chu vi hình vuông trước.", explanation: "Chu vi hình vuông là 16 × 4 = 64 cm, nên chu vi hình chữ nhật cũng là 64 cm.", difficulty: "E", pool: "station" },
  { id: "T1-G1-ex1-width", stationId: 10, source: "Archimede Toán 4 Tập 1 · PDF tr. 28 · Ví dụ 1", prompt: "Vẫn Ví dụ 1: hình chữ nhật có chu vi 64 cm và chiều dài 20 cm. Chiều rộng là bao nhiêu xăng-ti-mét?", choices: [10, 12, 14, 16], answer: 12, hint: "Nửa chu vi là tổng chiều dài và chiều rộng.", explanation: "64 : 2 = 32; chiều rộng là 32 − 20 = 12 cm.", difficulty: "M", pool: "station" },
  { id: "T1-G1-ex1-area", stationId: 10, source: "Archimede Toán 4 Tập 1 · PDF tr. 28 · Ví dụ 1", prompt: "Vẫn Ví dụ 1: hình chữ nhật dài 20 cm, rộng 12 cm. Diện tích là bao nhiêu xăng-ti-mét vuông?", choices: [220, 230, 240, 250], answer: 240, hint: "Diện tích hình chữ nhật bằng chiều dài nhân chiều rộng.", explanation: "20 × 12 = 240 cm².", difficulty: "M", pool: "station" },
  { id: "T1-G1-ex2-width", stationId: 10, source: "Archimede Toán 4 Tập 1 · PDF tr. 28–29 · Ví dụ 2", prompt: "Một hình chữ nhật giảm chiều dài 3 cm thì thành hình vuông. Diện tích hình vuông nhỏ hơn hình chữ nhật 30 cm². Chiều rộng hình chữ nhật là bao nhiêu xăng-ti-mét?", choices: [8, 10, 12, 14], answer: 10, hint: "Phần diện tích chênh lệch là một dải 3 cm nhân chiều rộng.", explanation: "Chiều rộng là 30 : 3 = 10 cm.", difficulty: "M", pool: "station" },
  { id: "T1-G1-ex2-length", stationId: 10, source: "Archimede Toán 4 Tập 1 · PDF tr. 28–29 · Ví dụ 2", prompt: "Vẫn Ví dụ 2: chiều rộng 10 cm, chiều dài hơn chiều rộng 3 cm. Chiều dài là bao nhiêu xăng-ti-mét?", choices: [11, 12, 13, 14], answer: 13, hint: "Chiều dài hơn chiều rộng 3 cm.", explanation: "10 + 3 = 13 cm.", difficulty: "E", pool: "station" },
  { id: "T1-G1-ex2-area", stationId: 10, source: "Archimede Toán 4 Tập 1 · PDF tr. 28–29 · Ví dụ 2", prompt: "Hình chữ nhật ở Ví dụ 2 có chiều dài 13 cm và chiều rộng 10 cm. Diện tích là bao nhiêu xăng-ti-mét vuông?", choices: [120, 125, 130, 135], answer: 130, hint: "Nhân chiều dài với chiều rộng.", explanation: "13 × 10 = 130 cm².", difficulty: "M", pool: "station" },
  { id: "T1-G1-b56-side", stationId: 10, source: "Archimede Toán 4 Tập 1 · PDF tr. 31 · Bài 56", prompt: "Một hình chữ nhật rộng 6 cm và chiều dài gấp đôi chiều rộng. Hình vuông có chu vi bằng chu vi hình chữ nhật. Cạnh hình vuông là bao nhiêu xăng-ti-mét?", choices: [8, 9, 10, 12], answer: 9, hint: "Tìm chiều dài 12 cm, rồi tính chu vi hình chữ nhật.", explanation: "Chu vi hình chữ nhật là (12 + 6) × 2 = 36 cm; cạnh hình vuông là 36 : 4 = 9 cm.", difficulty: "H", pool: "station" },
  { id: "T1-G1-b56-area", stationId: 10, source: "Archimede Toán 4 Tập 1 · PDF tr. 31 · Bài 56", prompt: "Với Bài 56, hình vuông có cạnh 9 cm. Diện tích hình vuông là bao nhiêu xăng-ti-mét vuông?", choices: [72, 81, 90, 99], answer: 81, hint: "Diện tích hình vuông bằng cạnh nhân cạnh.", explanation: "9 × 9 = 81 cm².", difficulty: "M", pool: "station" },
  { id: "T1-G1-b57-width", stationId: 10, source: "Archimede Toán 4 Tập 1 · PDF tr. 31 · Bài 57", prompt: "Hình vuông có diện tích 81 dm². Hình chữ nhật có chu vi bằng chu vi hình vuông và một cạnh 4 dm. Cạnh còn lại của hình chữ nhật là bao nhiêu đề-xi-mét?", choices: [12, 13, 14, 15], answer: 14, hint: "Hình vuông có cạnh 9 dm nên chu vi là 36 dm.", explanation: "Nửa chu vi hình chữ nhật là 18 dm; cạnh còn lại là 18 − 4 = 14 dm.", difficulty: "H", pool: "station" },
  { id: "T1-G1-b57-area", stationId: 10, source: "Archimede Toán 4 Tập 1 · PDF tr. 31 · Bài 57", prompt: "Với Bài 57, hình chữ nhật có hai cạnh 4 dm và 14 dm. Diện tích là bao nhiêu đề-xi-mét vuông?", choices: [48, 52, 56, 60], answer: 56, hint: "Nhân hai cạnh của hình chữ nhật.", explanation: "4 × 14 = 56 dm².", difficulty: "M", pool: "station" },
  { id: "T1-G2-ex3-area", stationId: 15, source: "Archimede Toán 4 Tập 1 · PDF tr. 29 · Ví dụ 3", prompt: "Ví dụ 3 yêu cầu tính diện tích hình mũi tên trên ô vuông đơn vị cạnh 1 cm. Diện tích hình mũi tên là bao nhiêu xăng-ti-mét vuông?", choices: [10, 11, 12, 13], answer: 12, hint: "Tách hình mũi tên thành các phần theo hướng dẫn trong sách.", explanation: "Cả hai cách tách hình ở ví dụ đều cho diện tích 12 cm².", difficulty: "M", pool: "station" },
  { id: "T1-G2-ex4-outer", stationId: 15, source: "Archimede Toán 4 Tập 1 · PDF tr. 30–31 · Ví dụ 4", prompt: "Hình ở Ví dụ 4 có khung ngoài dài 16 cm và rộng 12 cm. Diện tích khung ngoài là bao nhiêu xăng-ti-mét vuông?", choices: [180, 192, 196, 208], answer: 192, hint: "Tính diện tích hình chữ nhật khung ngoài.", explanation: "16 × 12 = 192 cm².", difficulty: "E", pool: "station" },
  { id: "T1-G2-ex4-cutout", stationId: 15, source: "Archimede Toán 4 Tập 1 · PDF tr. 30–31 · Ví dụ 4", prompt: "Ở Ví dụ 4, phần lõm ở giữa rộng 6 cm và sâu 9 cm. Diện tích phần lõm là bao nhiêu xăng-ti-mét vuông?", choices: [45, 48, 54, 60], answer: 54, hint: "Phần lõm là một hình chữ nhật.", explanation: "9 × 6 = 54 cm².", difficulty: "E", pool: "station" },
  { id: "T1-G2-ex4-area", stationId: 15, source: "Archimede Toán 4 Tập 1 · PDF tr. 30–31 · Ví dụ 4", prompt: "Ở Ví dụ 4, diện tích khung ngoài là 192 cm² và phần lõm là 54 cm². Diện tích hình cần tính là bao nhiêu xăng-ti-mét vuông?", choices: [128, 132, 138, 142], answer: 138, hint: "Lấy diện tích khung ngoài trừ diện tích phần lõm.", explanation: "192 − 54 = 138 cm².", difficulty: "M", pool: "station" },
  { id: "T1-G2-b60-width", stationId: 15, source: "Archimede Toán 4 Tập 1 · PDF tr. 31 · Bài 60", prompt: "Một hình chữ nhật chu vi 64 cm. Giảm chiều dài 6 cm thì diện tích giảm 48 cm². Chiều rộng hình chữ nhật là bao nhiêu xăng-ti-mét?", choices: [6, 8, 10, 12], answer: 8, hint: "Phần diện tích giảm là 6 cm nhân chiều rộng.", explanation: "Chiều rộng là 48 : 6 = 8 cm.", difficulty: "H", pool: "station" },
  { id: "T1-G2-b60-length", stationId: 15, source: "Archimede Toán 4 Tập 1 · PDF tr. 31 · Bài 60", prompt: "Với Bài 60, chu vi 64 cm và chiều rộng 8 cm. Chiều dài là bao nhiêu xăng-ti-mét?", choices: [20, 22, 24, 26], answer: 24, hint: "Nửa chu vi là tổng chiều dài và chiều rộng: 32 cm.", explanation: "Chiều dài là 32 − 8 = 24 cm.", difficulty: "M", pool: "station" },
  { id: "T1-G2-b60-area", stationId: 15, source: "Archimede Toán 4 Tập 1 · PDF tr. 31 · Bài 60", prompt: "Hình chữ nhật ở Bài 60 dài 24 cm, rộng 8 cm. Diện tích là bao nhiêu xăng-ti-mét vuông?", choices: [176, 184, 192, 200], answer: 192, hint: "Nhân chiều dài với chiều rộng.", explanation: "24 × 8 = 192 cm².", difficulty: "M", pool: "station" },
  { id: "T1-G2-b61-length", stationId: 15, source: "Archimede Toán 4 Tập 1 · PDF tr. 31 · Bài 61", prompt: "Hình chữ nhật chu vi 40 cm. Tăng chiều rộng 5 cm và giảm chiều dài 3 cm thì được hình vuông. Chiều dài ban đầu là bao nhiêu xăng-ti-mét?", choices: [12, 13, 14, 15], answer: 14, hint: "Gọi chiều dài L, chiều rộng W: L + W = 20 và L − 3 = W + 5.", explanation: "L − W = 8; kết hợp L + W = 20, suy ra L = 14 cm.", difficulty: "H", pool: "station" },
  { id: "T1-G2-b61-area", stationId: 15, source: "Archimede Toán 4 Tập 1 · PDF tr. 31 · Bài 61", prompt: "Với Bài 61, chiều dài 14 cm và chiều rộng 6 cm. Diện tích là bao nhiêu xăng-ti-mét vuông?", choices: [72, 78, 84, 90], answer: 84, hint: "Nhân chiều dài với chiều rộng.", explanation: "14 × 6 = 84 cm².", difficulty: "M", pool: "station" },
  { id: "T1-G2-b67-area", stationId: 15, source: "Archimede Toán 4 Tập 1 · PDF tr. 32 · Bài 67", prompt: "Một hình vuông cạnh 10 cm bị cắt đi bốn góc là bốn hình vuông cạnh 2 cm. Diện tích phần bìa còn lại là bao nhiêu xăng-ti-mét vuông?", choices: [80, 84, 88, 92], answer: 84, hint: "Lấy diện tích hình vuông lớn trừ diện tích bốn hình vuông nhỏ.", explanation: "10 × 10 − 4 × (2 × 2) = 100 − 16 = 84 cm².", difficulty: "H", pool: "station" },
];

export const SPELLS: Spell[] = [
  { id: "thunder", name: "Tia Chớp", element: "Sấm", icon: "ϟ", tone: "border-[#f6b73c] bg-[#fff0b6]", damage: 26, counterDamage: 10, note: "Đòn hệ Sấm sét của Pikachu và các guardian sấm." },
  { id: "flame", name: "Hỏa Ấn", element: "Lửa", icon: "✦", tone: "border-[#ee6b4e] bg-[#ffe4dc]", damage: 30, counterDamage: 14, note: "Mạnh hơn, Atlas phản công mạnh hơn." },
  { id: "tide", name: "Thủy Thuẫn", element: "Nước", icon: "≈", tone: "border-[#55a9dd] bg-[#e4f3fb]", damage: 18, counterDamage: 6, note: "Gây sát thương vừa, giảm phản công." },
  { id: "gust", name: "Phong Ảnh", element: "Gió", icon: "≋", tone: "border-[#3e9b7a] bg-[#e7f2e5]", damage: 21, counterDamage: 8, note: "Cân bằng giữa công và thủ." },
  { id: "venom", name: "Độc Ấn", element: "Độc", icon: "☾", tone: "border-[#8e69ad] bg-[#f0e7f6]", damage: 26, counterDamage: 12, note: "Đòn bền bỉ từ dấu niêm phong." },
  { id: "quarry", name: "Thạch Ấn", element: "Đất", icon: "◆", tone: "border-[#b17a3d] bg-[#f7ead5]", damage: 24, counterDamage: 8, note: "Đòn đất chắc chắn, giữ thế phòng thủ." },
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: "potion-25", label: "Bình Lộ Sáng 25%", kind: "healing", icon: "◒", heal: 25, price: 30, description: "Hồi 25 HP cho một guardian đang sở hữu.", tone: "bg-[#e4f3fb] border-[#55a9dd]" },
  { id: "potion-50", label: "Bình Lộ Sáng 50%", kind: "healing", icon: "◐", heal: 50, price: 60, description: "Hồi 50 HP cho một guardian đang sở hữu.", tone: "bg-[#e7f2e5] border-[#3e9b7a]" },
  { id: "potion-100", label: "Bình Lộ Sáng 100%", kind: "healing", icon: "◉", heal: 100, price: 120, description: "Hồi đầy 100 HP cho một guardian đang sở hữu.", tone: "bg-[#fff0b6] border-[#f6b73c]" },
  { id: "outfit-indigo", label: "Áo Khoác Indigo", kind: "cosmetic", icon: "✦", slot: "outfit", setId: "indigo", price: 40, description: "Áo khoác mực chàm cho thám hiểm ban sớm.", tone: "bg-[#e9e8f7] border-[#57518d]" },
  { id: "outfit-marigold", label: "Khăn Choàng Marigold", kind: "cosmetic", icon: "✹", slot: "outfit", price: 55, description: "Khăn choàng vàng la bàn, rực rỡ trên tuyến học.", tone: "bg-[#fff0b6] border-[#d99818]" },
  { id: "outfit-moss", label: "Túi Mẫu Vật Moss", kind: "cosmetic", icon: "▣", slot: "outfit", setId: "moss", price: 70, description: "Túi vải rêu để ghi lại bằng chứng của một hành trình dài.", tone: "bg-[#e6f0df] border-[#5f8a5e]" },
  { id: "trail-stars", label: "Dấu Chân Sao", kind: "cosmetic", icon: "✧", slot: "trail", setId: "indigo", price: 45, description: "Đường đi có dấu sao nhỏ cho mỗi lần mở nhật ký.", tone: "bg-[#f3e8ff] border-[#9a77b8]" },
  { id: "trail-leaves", label: "Dấu Lá Lộ Trình", kind: "cosmetic", icon: "❋", slot: "trail", setId: "moss", price: 65, description: "Dấu lá ép hiện bên cạnh companion trong hồ sơ.", tone: "bg-[#e7f2e5] border-[#4d8b67]" },
];

export const COMPANION_COSMETIC_SETS: CosmeticSetDefinition[] = [
  { id: "indigo", label: "Bộ Nhà Thám Hiểm Indigo", motif: "✦", note: "Mực chàm và sao dẫn đường.", itemIds: ["outfit-indigo", "trail-stars"], bonusGold: 35, bonusXp: 90 },
  { id: "moss", label: "Bộ Người Giữ Rừng Moss", motif: "❋", note: "Rêu ép và dấu lá lộ trình.", itemIds: ["outfit-moss", "trail-leaves"], bonusGold: 50, bonusXp: 120 },
];

export const QUESTIONS_BY_ID = Object.fromEntries(QUESTIONS.map((question) => [question.id, question])) as Record<string, VerifiedQuestion>;
export const BOSS_QUESTION_IDS = QUESTIONS.filter((question) => question.pool === "boss" && question.difficulty === "H").map((question) => question.id);
export const getGuardian = (guardianId: string) => GUARDIANS.find((guardian) => guardian.id === guardianId);
export const getSpellForGuardian = (guardian?: Guardian) => SPELLS.find((spell) => spell.element.toLocaleLowerCase("vi-VN") === guardian?.element) ?? SPELLS[0];
export const getStation = (stationId: number) => STATIONS.find((station) => station.id === stationId);
export const getStationQuestions = (stationId: number) => QUESTIONS.filter((question) => question.stationId === stationId && question.pool === "station");
export const getReadyStations = () => STATIONS.filter((station) => station.status === "ready");
