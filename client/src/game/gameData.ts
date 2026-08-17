/** Math4Fun game data — Field Journal Quest: only questions recorded as verified against the supplied Archimede PDF are used. */

export const HERO_IMAGE = "/manus-storage/math4fun-hero-journey_c4c6745e.jpg";
export const ARENA_IMAGE = "/manus-storage/math4fun-combat-arena_c86f9514.jpg";
export const CARD_IMAGE = "/manus-storage/math4fun-guardian-card_0acf6e09.jpg";
export const STICKERS_IMAGE = "/manus-storage/math4fun-reward-stickers_3366726f.jpg";
export const LOGO_IMAGE = "/manus-storage/math4fun-logo-mark_7740cd77.png";

export type Guardian = {
  id: string;
  name: string;
  type: string;
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
  guardianId: string;
  accent: string;
  questionIds: string[];
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
};

export const GUARDIANS: Guardian[] = [
  { id: "pipra", name: "Pipra", type: "NUMBER / SCOUT", description: "Bạn đồng hành mở đầu: thích đếm từng bước một cách cẩn thận.", stationId: 1, sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png", tone: "bg-emerald-500" },
  { id: "mimo", name: "Mimo", type: "PATTERN / GUIDE", description: "Luôn tìm số bước giữa hai số hạng trước khi dự đoán đáp án.", stationId: 2, sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/298.png", tone: "bg-sky-500" },
  { id: "voltix", name: "Voltix", type: "SUM / SPARK", description: "Giỏi gom số đầu và số cuối thành từng cặp cân bằng.", stationId: 3, sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/403.png", tone: "bg-amber-400" },
  { id: "mossy", name: "Mossy", type: "EVEN-ODD / TRAIL", description: "Dẫn đường qua các dãy số tự nhiên, số chẵn và số lẻ liên tiếp.", stationId: 4, sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/387.png", tone: "bg-lime-500" },
  { id: "coru", name: "Coru", type: "DIGIT / COMPASS", description: "Nhìn ra những quy luật ẩn trong chữ số tận cùng.", stationId: 5, sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/447.png", tone: "bg-rose-400" },
  { id: "atlas", name: "Atlas", type: "BOSS / ARCHIVE", description: "Người giữ kho lưu trữ quy luật. Chỉ xuất hiện khi bốn trạm đầu đã được làm chủ.", stationId: "boss", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png", tone: "bg-indigo-700" },
];

export const STATIONS: Station[] = [
  { id: 1, code: "SỐ.01", title: "Dãy số lùi", brief: "Đếm số hạng và truy tìm một vị trí trong dãy giảm đều.", guardianId: "pipra", accent: "bg-emerald-500", questionIds: ["B80a", "B80b"] },
  { id: 2, code: "SỐ.02", title: "Bước nhảy bí mật", brief: "Nhận diện khoảng cách giữa các số hạng và quy luật tăng dần.", guardianId: "mimo", accent: "bg-sky-500", questionIds: ["B81a", "B82a", "B87b"] },
  { id: 3, code: "DÃY.01", title: "Kho báu tổng dãy", brief: "Tìm số hạng, số hạng thứ n và tổng của một dãy số lẻ.", guardianId: "voltix", accent: "bg-amber-400", questionIds: ["B83a-count", "B83a-term50", "B83a-sum"] },
  { id: 4, code: "DÃY.02", title: "Tuyến chẵn lẻ", brief: "Gom các số liên tiếp thành cặp để tính tổng nhanh và chính xác.", guardianId: "mossy", accent: "bg-lime-500", questionIds: ["B86a", "B86b", "B86c"] },
  { id: 5, code: "DÃY.03", title: "La bàn chữ số", brief: "Khám phá dãy các số có hai chữ số cùng tận cùng bằng 3.", guardianId: "coru", accent: "bg-rose-400", questionIds: ["B86d"] },
];

export const QUESTIONS: VerifiedQuestion[] = [
  { id: "B80a", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 38 · Bài 80a", prompt: "Cho dãy số cách đều 2024; 2022; 2020; …; 20. Dãy số trên có bao nhiêu số hạng?", choices: [1002, 1003, 1004, 1012], answer: 1003, hint: "Từ 2024 giảm đều 2 đơn vị để đến 20. Hãy tính số khoảng giảm rồi cộng thêm số hạng đầu tiên.", explanation: "Số khoảng giảm là (2024 − 20) : 2 = 1002. Có số hạng đầu và 1002 khoảng nên dãy có 1002 + 1 = 1003 số hạng." },
  { id: "B80b", stationId: 1, source: "Archimede Toán 4 Tập 1 · PDF tr. 38 · Bài 80b", prompt: "Vẫn với dãy 2024; 2022; 2020; …; 20, số hạng thứ 258 là số nào?", choices: [1508, 1510, 1512, 1514], answer: 1510, hint: "Số hạng thứ 258 cách số hạng đầu 257 bước. Mỗi bước giảm 2 đơn vị.", explanation: "Số hạng thứ 258 là 2024 − 257 × 2 = 2024 − 514 = 1510." },
  { id: "B81a", stationId: 2, source: "Archimede Toán 4 Tập 1 · PDF tr. 38 · Bài 81a", prompt: "Cho dãy số cách đều 0; 3; 6; 9; … Tìm số hạng thứ 75.", choices: [219, 222, 225, 228], answer: 222, hint: "Số hạng đầu là 0. Số hạng thứ 75 đi thêm 74 bước, mỗi bước tăng 3.", explanation: "Số hạng thứ 75 là 0 + 74 × 3 = 222." },
  { id: "B82a", stationId: 2, source: "Archimede Toán 4 Tập 1 · PDF tr. 38 · Bài 82a", prompt: "Cho dãy số cách đều 11; 16; 21; 26; … Tìm số hạng thứ 85.", choices: [421, 426, 431, 436], answer: 431, hint: "Số hạng thứ 85 cách số hạng đầu 84 bước. Mỗi bước tăng 5.", explanation: "Số hạng thứ 85 là 11 + 84 × 5 = 11 + 420 = 431." },
  { id: "B87b", stationId: 2, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 87a–b", prompt: "Dãy 1; 2; 4; 7; 11; … có các khoảng tăng lần lượt 1; 2; 3; 4; … Số hạng thứ 10 là bao nhiêu?", choices: [42, 44, 46, 48], answer: 46, hint: "Sau 11, hãy lần lượt cộng 5; 6; 7; 8; 9 để đến số hạng thứ 10.", explanation: "Các số hạng tiếp theo là 16; 22; 29; 37; 46. Vậy số hạng thứ 10 là 46." },
  { id: "B83a-count", stationId: 3, source: "Archimede Toán 4 Tập 1 · PDF tr. 38 · Bài 83a", prompt: "Cho tổng A = 1 + 3 + 5 + … + 199. Tổng A có bao nhiêu số hạng?", choices: [98, 99, 100, 101], answer: 100, hint: "Đây là dãy số lẻ cách đều 2, bắt đầu từ 1 và kết thúc ở 199.", explanation: "Số khoảng là (199 − 1) : 2 = 99. Vậy dãy có 99 + 1 = 100 số hạng." },
  { id: "B83a-term50", stationId: 3, source: "Archimede Toán 4 Tập 1 · PDF tr. 38 · Bài 83a", prompt: "Trong dãy 1; 3; 5; …; 199 của tổng A, số hạng thứ 50 là số nào?", choices: [97, 99, 101, 103], answer: 99, hint: "Số hạng thứ 50 cách số hạng đầu 49 bước; mỗi bước tăng 2.", explanation: "Số hạng thứ 50 là 1 + 49 × 2 = 99." },
  { id: "B83a-sum", stationId: 3, source: "Archimede Toán 4 Tập 1 · PDF tr. 38 · Bài 83a", prompt: "Tính A = 1 + 3 + 5 + … + 199.", choices: [9900, 9950, 10000, 10100], answer: 10000, hint: "Dùng số hạng đầu, số hạng cuối và 100 số hạng vừa tìm được.", explanation: "A = (1 + 199) × 100 : 2 = 10000." },
  { id: "B86a", stationId: 4, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 86a", prompt: "Tính tổng 10 số tự nhiên liên tiếp kể từ 12.", supportingText: "Dãy bắt đầu: 12; 13; 14; …", choices: [155, 160, 165, 170], answer: 165, hint: "Số thứ 10 là 12 + 9. Ghép số đầu và số cuối rồi nhân với số cặp.", explanation: "Số thứ 10 là 21. Tổng là (12 + 21) × 10 : 2 = 165." },
  { id: "B86b", stationId: 4, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 86b", prompt: "Tính tổng 12 số chẵn liên tiếp kể từ 60.", supportingText: "Dãy bắt đầu: 60; 62; 64; …", choices: [828, 840, 852, 864], answer: 852, hint: "Hãy tìm số chẵn thứ 12 trước, rồi lấy (số đầu + số cuối) × số số hạng : 2.", explanation: "Số chẵn thứ 12 là 60 + 11 × 2 = 82. Tổng là (60 + 82) × 12 : 2 = 852." },
  { id: "B86c", stationId: 4, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 86c", prompt: "Tính tổng 16 số lẻ liên tiếp kể từ 21.", supportingText: "Dãy bắt đầu: 21; 23; 25; …", choices: [544, 560, 576, 592], answer: 576, hint: "Số lẻ thứ 16 cách số đầu 15 bước, mỗi bước tăng 2.", explanation: "Số lẻ thứ 16 là 21 + 15 × 2 = 51. Tổng là (21 + 51) × 16 : 2 = 576." },
  { id: "B86d", stationId: 5, source: "Archimede Toán 4 Tập 1 · PDF tr. 39 · Bài 86d", prompt: "Tính tổng các số có hai chữ số, chữ số tận cùng là 3.", supportingText: "Dãy số: 13; 23; 33; …; 93", choices: [432, 450, 477, 486], answer: 477, hint: "Dãy có 9 số hạng, cách đều 10. Ghép số đầu và số cuối để tính tổng.", explanation: "Tổng là (13 + 93) × 9 : 2 = 477." },
];

export const QUESTIONS_BY_ID = Object.fromEntries(QUESTIONS.map((question) => [question.id, question])) as Record<string, VerifiedQuestion>;

export const BOSS_QUESTION_IDS = ["B83a-sum", "B86b", "B87b", "B80b"];

export const getGuardian = (guardianId: string) => GUARDIANS.find((guardian) => guardian.id === guardianId);
export const getStation = (stationId: number) => STATIONS.find((station) => station.id === stationId);
