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
  { id: "pavo", name: "Pavo", type: "GEOMETRY / MARK", element: "độc", description: "Săn tìm góc, đoạn thẳng và hình trong rìa sổ tay.", stationId: 10, sprite: sprite(234), tone: "bg-violet-500" },
  { id: "soli", name: "Soli", type: "REVERSE / FLAME", element: "lửa", description: "Lần ngược dấu vết để tìm số ban đầu.", stationId: 11, sprite: sprite(37), tone: "bg-red-500" },
  { id: "dexo", name: "Dexo (Pikachu)", type: "MULTIPLY / SPARK", element: "sấm", description: "Bạn đồng hành Pikachu hệ Sấm sét, biến quy luật nhân chia thành tia chớp có thứ tự.", stationId: 12, sprite: sprite(25), tone: "bg-amber-500" },
  { id: "maru", name: "Maru", type: "DIVIDE / TIDE", element: "nước", description: "Chia đường đi đều nhau, không bỏ sót dấu mốc.", stationId: 13, sprite: sprite(158), tone: "bg-teal-500" },
  { id: "sena", name: "Sena", type: "DECIMAL / MIST", element: "gió", description: "Giữ những con số bé xíu đúng vị trí trên dòng kẻ.", stationId: 14, sprite: sprite(133), tone: "bg-slate-500" },
  { id: "kora", name: "Kora", type: "SYMMETRY / LEAF", element: "đất", description: "Soi đường gấp đôi để nhận ra vẻ cân xứng.", stationId: 15, sprite: sprite(152), tone: "bg-green-500" },
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
  { id: 4, code: "T2.03", title: "Bài toán thừa–thiếu", brief: "Dùng hiệu của hai cách chia để lần ra số người và số vật.", group: "Đại lượng và bài toán", book: "Tập 2", guardianId: "mossy", accent: "bg-lime-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 5, code: "T1.02", title: "Phân số", brief: "Nhận biết phần bằng nhau và so sánh phần của một đơn vị.", group: "Phân số", book: "Tập 1", guardianId: "coru", accent: "bg-rose-400", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 6, code: "T1.03", title: "Diện tích", brief: "Ghi nhận vùng mặt phẳng qua ô vuông và đơn vị đo.", group: "Hình học & đo lường", book: "Tập 1", guardianId: "aeris", accent: "bg-cyan-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 7, code: "T1.04", title: "Khối lượng", brief: "Đổi đơn vị và xử lý phép tính theo khối lượng.", group: "Hình học & đo lường", book: "Tập 1", guardianId: "brix", accent: "bg-orange-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 8, code: "T1.05", title: "Thời gian", brief: "Đọc lịch, giờ và quãng thời gian chính xác.", group: "Hình học & đo lường", book: "Tập 1", guardianId: "luma", accent: "bg-yellow-400", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 9, code: "T1.06", title: "Bảng số liệu", brief: "Tìm thông tin, tổng và hiệu qua bảng dữ liệu.", group: "Dữ liệu", book: "Tập 1", guardianId: "nori", accent: "bg-blue-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 10, code: "T1.07", title: "Góc & hình phẳng", brief: "Nhận diện đặc điểm hình học trong nhật ký thám hiểm.", group: "Hình học & đo lường", book: "Tập 1", guardianId: "pavo", accent: "bg-violet-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 11, code: "T2.04", title: "Tính ngược", brief: "Lần theo sơ đồ đoạn thẳng để tìm số ban đầu.", group: "Đại lượng và bài toán", book: "Tập 2", guardianId: "soli", accent: "bg-red-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 12, code: "T2.05", title: "Nhân & chia", brief: "Củng cố quy tắc tính và thứ tự thực hiện phép tính.", group: "Số và phép tính", book: "Tập 2", guardianId: "dexo", accent: "bg-amber-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 13, code: "T2.06", title: "Chia có dư", brief: "Đọc thương và số dư trong mỗi tình huống thực tế.", group: "Số và phép tính", book: "Tập 2", guardianId: "maru", accent: "bg-teal-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 14, code: "T2.07", title: "Số thập phân", brief: "Đọc, viết và so sánh các phần mười, phần trăm.", group: "Số và phép tính", book: "Tập 2", guardianId: "sena", accent: "bg-slate-500", questionIds: [], masteryTarget: 10, status: "survey" },
  { id: 15, code: "T2.08", title: "Đối xứng", brief: "Quan sát trục gấp và các hình có nét đối xứng.", group: "Hình học & đo lường", book: "Tập 2", guardianId: "kora", accent: "bg-green-500", questionIds: [], masteryTarget: 10, status: "survey" },
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
  { id: "B85a", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 85a", prompt: "Có bao nhiêu số tự nhiên có hai chữ số mà chữ số tận cùng là 4?", choices: [8, 9, 10, 11], answer: 9, hint: "Viết dãy từ 14 đến 94, mỗi lần tăng 10.", explanation: "Dãy là 14; 24; …; 94. Có (94 − 14) : 10 + 1 = 9 số.", difficulty: "H", pool: "boss" },
  { id: "B84a", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 84a", prompt: "Tìm a: (a + 1) + (a + 3) + (a + 5) + … + (a + 17) = 513.", choices: [42, 44, 48, 51], answer: 48, hint: "Có 9 số hạng. Tổng phần số lẻ là 81.", explanation: "9a + 81 = 513 nên a = 48.", difficulty: "H", pool: "boss" },
  { id: "B84b", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 84b", prompt: "Tìm a: (a + 2) + (a + 4) + … + (a + 50) = 1150.", choices: [18, 20, 22, 25], answer: 20, hint: "Có 25 số hạng; tổng 2 + 4 + … + 50 là 650.", explanation: "25a + 650 = 1150 nên a = 20.", difficulty: "H", pool: "boss" },
  { id: "B84c", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 84c", prompt: "Tìm a: (a + 1) + (a + 4) + (a + 7) + … + (a + 34) = 282.", choices: [4, 6, 8, 12], answer: 6, hint: "Có 12 số hạng; tổng 1 + 4 + … + 34 là 210.", explanation: "12a + 210 = 282 nên a = 6.", difficulty: "H", pool: "boss" },
  { id: "B85b", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 85b", prompt: "Có bao nhiêu số tự nhiên có ba chữ số mà chữ số tận cùng là 5?", choices: [80, 89, 90, 91], answer: 90, hint: "Dãy là 105; 115; …; 995.", explanation: "Có (995 − 105) : 10 + 1 = 90 số.", difficulty: "H", pool: "boss" },
  { id: "B89", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 89", prompt: "Một quyển sách đánh số trang từ trang 3 đến trang 278. Hỏi cần bao nhiêu chữ số để đánh số trang?", choices: [714, 724, 734, 744], answer: 724, hint: "Tách các trang một chữ số, hai chữ số và ba chữ số.", explanation: "3–9: 7 chữ số; 10–99: 180; 100–278: 537. Tổng 724.", difficulty: "H", pool: "boss" },
];

export const SPELLS: Spell[] = [
  { id: "thunder", name: "Tia Chớp", element: "Sấm", icon: "ϟ", tone: "border-[#f6b73c] bg-[#fff0b6]", damage: 26, counterDamage: 10, note: "Đòn hệ Sấm sét của Pikachu và các guardian sấm." },
  { id: "flame", name: "Hỏa Ấn", element: "Lửa", icon: "✦", tone: "border-[#ee6b4e] bg-[#ffe4dc]", damage: 30, counterDamage: 14, note: "Mạnh hơn, Atlas phản công mạnh hơn." },
  { id: "tide", name: "Thủy Thuẫn", element: "Nước", icon: "≈", tone: "border-[#55a9dd] bg-[#e4f3fb]", damage: 18, counterDamage: 6, note: "Gây sát thương vừa, giảm phản công." },
  { id: "gust", name: "Phong Ảnh", element: "Gió", icon: "≋", tone: "border-[#3e9b7a] bg-[#e7f2e5]", damage: 21, counterDamage: 8, note: "Cân bằng giữa công và thủ." },
  { id: "venom", name: "Độc Ấn", element: "Độc", icon: "☾", tone: "border-[#8e69ad] bg-[#f0e7f6]", damage: 26, counterDamage: 12, note: "Đòn bền bỉ từ dấu niêm phong." },
  { id: "quarry", name: "Thạch Ấn", element: "Đất", icon: "◆", tone: "border-[#b17a3d] bg-[#f7ead5]", damage: 24, counterDamage: 8, note: "Đòn đất chắc chắn, giữ thế phòng thủ." },
];

export const QUESTIONS_BY_ID = Object.fromEntries(QUESTIONS.map((question) => [question.id, question])) as Record<string, VerifiedQuestion>;
export const BOSS_QUESTION_IDS = QUESTIONS.filter((question) => question.pool === "boss" && question.difficulty === "H").map((question) => question.id);
export const getGuardian = (guardianId: string) => GUARDIANS.find((guardian) => guardian.id === guardianId);
export const getSpellForGuardian = (guardian?: Guardian) => SPELLS.find((spell) => spell.element.toLocaleLowerCase("vi-VN") === guardian?.element) ?? SPELLS[0];
export const getStation = (stationId: number) => STATIONS.find((station) => station.id === stationId);
export const getStationQuestions = (stationId: number) => QUESTIONS.filter((question) => question.stationId === stationId && question.pool === "station");
export const getReadyStations = () => STATIONS.filter((station) => station.status === "ready");
