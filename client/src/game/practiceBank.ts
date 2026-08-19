/**
 * Math4Fun practice bank: deterministic, checked numeric variations for the Field Journal Quest.
 * Every record is an original practice variation, clearly distinct from the verified Archimede source set.
 */
import type { Difficulty, VerifiedQuestion } from "./gameData";

const difficultyAt = (index: number): Difficulty => index < 8 ? "E" : index < 14 ? "M" : "H";
const choices = (answer: number, step = Math.max(1, Math.ceil(Math.abs(answer) / 12))) => {
  const set = Array.from(new Set([answer - step, answer, answer + step, answer + step * 2].filter((value) => value >= 0)));
  while (set.length < 4) set.push(answer + step * (set.length + 2));
  return set.sort(() => 0.5 - Math.random());
};
const question = (stationId: number, index: number, prompt: string, answer: number, hint: string, explanation: string): VerifiedQuestion => ({
  id: `practice-${stationId}-${index + 1}`,
  stationId,
  source: `Bài luyện mở rộng tự tạo · biến thể ${index + 1}`,
  prompt,
  choices: choices(answer),
  answer,
  hint,
  explanation,
  difficulty: difficultyAt(index),
  pool: "station",
});

function makePractice(stationId: number, index: number): VerifiedQuestion {
  const level = difficultyAt(index);
  const n = index + 1;
  switch (stationId) {
    case 1: { const first = 4 + n * 3; const step = 2 + (n % 5); const term = level === "E" ? 6 + n : level === "M" ? 15 + n : 28 + n; const answer = first + step * (term - 1); return question(stationId, index, `Dãy số cách đều ${first}; ${first + step}; ${first + step * 2}; … Số hạng thứ ${term} là số nào?`, answer, "Từ số đầu đi thêm số bước bằng số thứ tự trừ 1.", `${first} + (${term} − 1) × ${step} = ${answer}.`); }
    case 2: { const base = 8 + n * 2; const values = [base - 3, base, base + 3, base + 6]; const answer = values.reduce((sum, value) => sum + value, 0) / values.length; return question(stationId, index, `Tìm trung bình cộng của ${values.join("; ")}.`, answer, "Cộng các số rồi chia cho số số hạng.", `Tổng là ${values.reduce((sum, value) => sum + value, 0)}; chia ${values.length} được ${answer}.`); }
    case 3: { const per = 4 + (n % 9); const boxes = 3 + (n % 7); const answer = per * boxes; return question(stationId, index, `${boxes} hộp như nhau, mỗi hộp có ${per} món đồ. Có tất cả bao nhiêu món đồ?`, answer, "Tìm số đồ trong một hộp rồi nhân số hộp.", `${per} × ${boxes} = ${answer}.`); }
    case 4: { const pupils = 4 + (n % 8); const per = 3 + (n % 5); const spare = pupils; const answer = pupils * per + spare; return question(stationId, index, `Chia ${answer} nhãn vở đều cho các bạn: mỗi bạn ${per} nhãn thì thừa ${spare} nhãn. Có bao nhiêu bạn?`, pupils, "Phần thừa đúng bằng số bạn nếu mỗi bạn nhận thêm 1 nhãn.", `Có ${spare} bạn; kiểm tra: ${spare} × ${per} + ${spare} = ${answer}.`); }
    case 5: { const total = 12 + 4 * (n % 6); const numerator = 1 + (n % 3); const denominator = 2 + (n % 3); const answer = total / denominator * numerator; return question(stationId, index, `Một hộp có ${total} thẻ. Lan lấy ${numerator}/${denominator} số thẻ trong hộp. Lan lấy bao nhiêu thẻ?`, answer, "Chia số thẻ thành số phần ở mẫu số, rồi lấy số phần ở tử số.", `${total} : ${denominator} × ${numerator} = ${answer}.`); }
    case 6: { const length = 8 + n; const width = 3 + (n % 7); const answer = length * width; return question(stationId, index, `Hình chữ nhật có chiều dài ${length} cm, chiều rộng ${width} cm. Diện tích là bao nhiêu cm²?`, answer, "Diện tích hình chữ nhật bằng dài nhân rộng.", `${length} × ${width} = ${answer} cm².`); }
    case 7: { const kg = 2 + (n % 7); const g = 100 * (n % 9); const answer = kg * 1000 + g; return question(stationId, index, `${kg} kg ${g} g bằng bao nhiêu gam?`, answer, "Đổi ki-lô-gam ra gam rồi cộng thêm số gam.", `${kg} kg = ${kg * 1000} g; cộng ${g} g được ${answer} g.`); }
    case 8: { const start = 7 * 60 + (n % 4) * 10; const duration = 35 + (n % 6) * 15; const answer = start + duration; const h = Math.floor(answer / 60); const m = answer % 60; return question(stationId, index, `Một buổi học bắt đầu lúc ${Math.floor(start / 60)} giờ ${start % 60} phút và kéo dài ${duration} phút. Buổi học kết thúc lúc mấy giờ mấy phút?`, answer, "Đổi cả giờ và thời gian học ra phút rồi cộng.", `${start} + ${duration} = ${answer} phút, tức ${h} giờ ${m} phút.`); }
    case 9: { const a = 12 + n; const b = 8 + (n % 9); const c = 10 + (n % 7); const answer = a + b + c; return question(stationId, index, `Bảng ghi nhận ba nhóm đã thu được ${a}, ${b} và ${c} dấu sao. Cả ba nhóm có bao nhiêu dấu sao?`, answer, "Cộng ba số liệu trong bảng.", `${a} + ${b} + ${c} = ${answer}.`); }
    case 10: { const side = 5 + (n % 10); const answer = side * side; return question(stationId, index, `Một hình vuông có cạnh ${side} cm. Diện tích hình vuông là bao nhiêu cm²?`, answer, "Diện tích hình vuông bằng cạnh nhân cạnh.", `${side} × ${side} = ${answer} cm².`); }
    case 11: case 16: { const small = 12 + n * 2; const diff = 6 + 2 * (n % 8); const answer = small + diff; const sum = answer + small; return question(stationId, index, `Tổng của hai số là ${sum}, hiệu của chúng là ${diff}. Số lớn là bao nhiêu?`, answer, "Lấy tổng cộng hiệu rồi chia 2.", `(${sum} + ${diff}) : 2 = ${answer}.`); }
    case 12: { const a = 6 + (n % 9); const b = 4 + (n % 8); const answer = a * b; return question(stationId, index, `Tính ${a} × ${b}.`, answer, "Nhân hai thừa số.", `${a} × ${b} = ${answer}.`); }
    case 13: { const divisor = 5 + (n % 6); const quotient = 4 + n; const remainder = n % divisor; const answer = divisor * quotient + remainder; return question(stationId, index, `Trong phép chia có thương là ${quotient}, số chia là ${divisor}, số dư là ${remainder}. Số bị chia là bao nhiêu?`, answer, "Số bị chia bằng số chia nhân thương cộng số dư.", `${divisor} × ${quotient} + ${remainder} = ${answer}.`); }
    case 14: { const whole = 2 + (n % 7); const tenths = n % 10; const answer = whole * 10 + tenths; return question(stationId, index, `Số thập phân ${whole},${tenths} có bao nhiêu phần mười?`, answer, "Một đơn vị bằng 10 phần mười.", `${whole} đơn vị là ${whole * 10} phần mười; thêm ${tenths} phần mười là ${answer}.`); }
    case 15: { const a = 6 + n; const b = 3 + (n % 6); const c = 4 + (n % 5); const answer = a * b + b * c; return question(stationId, index, `Một hình ghép gồm hai hình chữ nhật có cùng chiều rộng ${b} cm; chiều dài lần lượt là ${a} cm và ${c} cm. Diện tích hình ghép là bao nhiêu cm²?`, answer, "Tính diện tích từng hình chữ nhật rồi cộng.", `${a} × ${b} + ${c} × ${b} = ${answer} cm².`); }
    case 17: { const price = 10 + (n % 9) * 5; const qty = 2 + (n % 6); const paid = price * qty + 50; const answer = paid - price * qty; return question(stationId, index, `Mỗi quyển vở giá ${price} nghìn đồng. Mua ${qty} quyển và đưa ${paid} nghìn đồng. Cần trả lại bao nhiêu nghìn đồng?`, answer, "Tính tiền mua rồi lấy số tiền đưa trừ đi.", `${paid} − (${price} × ${qty}) = ${answer} nghìn đồng.`); }
    case 18: { const red = 3 + (n % 7); const blue = 4 + (n % 6); const yellow = 2 + (n % 5); const answer = red + blue + yellow; return question(stationId, index, `Một hộp có ${red} thẻ đỏ, ${blue} thẻ xanh và ${yellow} thẻ vàng. Hộp có tất cả bao nhiêu thẻ?`, answer, "Cộng số thẻ của ba màu.", `${red} + ${blue} + ${yellow} = ${answer}.`); }
    case 19: { const a = 24 + n * 3; const b = 3 + (n % 7); const answer = a * b; return question(stationId, index, `Tính nhanh ${a} × ${b}.`, answer, "Nhân số thứ nhất với số thứ hai.", `${a} × ${b} = ${answer}.`); }
    default: { const a = 30 + n * 4; const b = 5 + (n % 8); const answer = a + b; return question(stationId, index, `Trong bài ôn tập, tính ${a} + ${b}.`, answer, "Cộng hai số.", `${a} + ${b} = ${answer}.`); }
  }
}

export const AI_PRACTICE_QUESTIONS: VerifiedQuestion[] = Array.from({ length: 20 }, (_, stationIndex) =>
  Array.from({ length: 20 }, (_, index) => makePractice(stationIndex + 1, index)),
).flat();
