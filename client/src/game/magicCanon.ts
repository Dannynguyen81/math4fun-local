/**
 * Canonical Magic Book data.
 *
 * The combat/storage layer still uses the old Vietnamese wire values
 * (lửa, nước, gió, sấm, đất) so existing local profiles remain readable.
 * This file is the presentation canon: exactly five Ngũ hành branches and
 * five spells per branch.
 */
import type { ElementName } from "./gameData";

export type MagicBookElement = "hỏa" | "thủy" | "mộc" | "kim" | "thổ";
export type MagicBookLevel = 1 | 2 | 3 | 4 | 5;

export type MagicBookElementDefinition = {
  key: MagicBookElement;
  wire: Exclude<ElementName, "độc">;
  label: string;
  shortLabel: string;
  glyph: string;
  color: string;
  softColor: string;
  artwork: string;
  intro: string;
  strongAgainst: MagicBookElement;
  weakAgainst: MagicBookElement;
  matchupNote: string;
};

export type MagicBookSpell = {
  level: MagicBookLevel;
  name: string;
  title: string;
  description: string;
  effect: string;
  unlockXp: number;
};

export const MAGIC_BOOK_XP_PER_LEVEL = 100;
export const MAGIC_BOOK_MAX_LEVEL: MagicBookLevel = 5;

export const MAGIC_BOOK_ELEMENTS: readonly MagicBookElementDefinition[] = [
  {
    key: "hỏa",
    wire: "lửa",
    label: "Hỏa",
    shortLabel: "HỎA ẤN",
    glyph: "✦",
    color: "#ee6b4e",
    softColor: "#ffe4dc",
    artwork: "/magic/spells/hoa.webp",
    intro: "Hỏa biến một lời giải chính xác thành luồng sáng bùng nổ.",
    strongAgainst: "kim",
    weakAgainst: "thủy",
    matchupNote: "Hỏa luyện Kim, nhưng dịu xuống trước Thủy.",
  },
  {
    key: "thủy",
    wire: "nước",
    label: "Thủy",
    shortLabel: "THỦY ẤN",
    glyph: "≈",
    color: "#3698d4",
    softColor: "#e4f3fb",
    artwork: "/magic/spells/thuy.webp",
    intro: "Thủy giữ nhịp bình tĩnh, cân bằng từng bước tính như một con sóng.",
    strongAgainst: "hỏa",
    weakAgainst: "thổ",
    matchupNote: "Thủy khắc Hỏa, nhưng bị Thổ ngăn và dẫn dòng.",
  },
  {
    key: "mộc",
    wire: "gió",
    label: "Mộc",
    shortLabel: "MỘC ẤN",
    glyph: "❋",
    color: "#4d8b67",
    softColor: "#e7f2e5",
    artwork: "/magic/spells/moc.webp",
    intro: "Mộc lớn lên từ chuỗi suy luận đều đặn, nở thành dấu lá bảo hộ.",
    strongAgainst: "thổ",
    weakAgainst: "kim",
    matchupNote: "Mộc xuyên và giữ Thổ, nhưng bị Kim cắt khắc.",
  },
  {
    key: "kim",
    wire: "sấm",
    label: "Kim",
    shortLabel: "KIM ẤN",
    glyph: "◇",
    color: "#b88728",
    softColor: "#fff0b6",
    artwork: "/magic/spells/kim.webp",
    intro: "Kim gom sự chính xác thành la bàn tinh thể, chỉ thẳng đến đáp án.",
    strongAgainst: "mộc",
    weakAgainst: "hỏa",
    matchupNote: "Kim khắc Mộc bằng độ chính xác, nhưng bị Hỏa luyện hóa.",
  },
  {
    key: "thổ",
    wire: "đất",
    label: "Thổ",
    shortLabel: "THỔ ẤN",
    glyph: "◆",
    color: "#b17a3d",
    softColor: "#f7ead5",
    artwork: "/magic/spells/tho.webp",
    intro: "Thổ dựng nền vững chắc để người học không bị cuốn khỏi cách giải.",
    strongAgainst: "thủy",
    weakAgainst: "mộc",
    matchupNote: "Thổ chặn Thủy và giữ thế, nhưng bị Mộc xuyên phá.",
  },
] as const;

export const MAGIC_BOOK_ELEMENT_BY_KEY = Object.fromEntries(
  MAGIC_BOOK_ELEMENTS.map(element => [element.key, element])
) as Record<MagicBookElement, MagicBookElementDefinition>;

export const MAGIC_BOOK_ELEMENT_BY_WIRE = Object.fromEntries(
  MAGIC_BOOK_ELEMENTS.map(element => [element.wire, element.key])
) as Record<Exclude<ElementName, "độc">, MagicBookElement>;

export const MAGIC_BOOK_SPELLS: Record<
  MagicBookElement,
  readonly MagicBookSpell[]
> = {
  hỏa: [
    {
      level: 1,
      name: "Hỏa Tinh",
      title: "Tia lửa khởi hành",
      description: "Một đốm lửa nhỏ đánh dấu bước tính đầu tiên đã chính xác.",
      effect: "+1 nhịp bộc phát",
      unlockXp: 0,
    },
    {
      level: 2,
      name: "Phượng Mạch",
      title: "Mạch phượng thức giấc",
      description:
        "Các bước giải nối nhau thành đôi cánh lửa, sáng hơn sau mỗi lần luyện.",
      effect: "+4 sát thương phép",
      unlockXp: 100,
    },
    {
      level: 3,
      name: "Liệt Dương",
      title: "Mặt trời phân số",
      description:
        "Hỏa lực gom thành vòng dương quang, giúp em giữ nhịp khi bài khó hơn.",
      effect: "+8 sát thương phép",
      unlockXp: 200,
    },
    {
      level: 4,
      name: "Nhật Vũ",
      title: "Vũ điệu nhật quang",
      description:
        "Những tia lửa xoay quanh đáp án như một vũ điệu có quy luật.",
      effect: "+12 sát thương phép",
      unlockXp: 300,
    },
    {
      level: 5,
      name: "Thiên Hỏa Ấn",
      title: "Ấn trời mở khóa",
      description:
        "Dấu Hỏa hoàn thiện: một lời giải sáng rõ có thể thắp cả trang nhật ký.",
      effect: "Bậc tối đa · Hỏa hoàn thiện",
      unlockXp: 400,
    },
  ],
  thủy: [
    {
      level: 1,
      name: "Thủy Châu",
      title: "Giọt nước đầu nguồn",
      description:
        "Giọt nước xanh giữ lại đáp án đúng đầu tiên trong dòng chảy học tập.",
      effect: "+1 nhịp cân bằng",
      unlockXp: 0,
    },
    {
      level: 2,
      name: "Lam Triều",
      title: "Triều xanh dâng",
      description:
        "Dòng triều biết tìm đường vòng, biến một bài toán thành các bước dễ theo dõi.",
      effect: "+4 sát thương phép",
      unlockXp: 100,
    },
    {
      level: 3,
      name: "Hải Nguyệt",
      title: "Trăng soi mặt biển",
      description:
        "Mặt nước phẳng lặng giúp em nhìn ra dữ kiện ẩn trong đề bài.",
      effect: "+8 sát thương phép",
      unlockXp: 200,
    },
    {
      level: 4,
      name: "Tịnh Lưu",
      title: "Dòng chảy tinh lọc",
      description:
        "Mỗi phép tính được lọc gọn như một con suối trong, không bỏ sót đơn vị.",
      effect: "+12 sát thương phép",
      unlockXp: 300,
    },
    {
      level: 5,
      name: "Vạn Hải Trận",
      title: "Bản đồ vạn dòng",
      description:
        "Thủy ấn hoàn thiện, nối mọi dữ kiện thành một dòng lời giải mạch lạc.",
      effect: "Bậc tối đa · Thủy hoàn thiện",
      unlockXp: 400,
    },
  ],
  mộc: [
    {
      level: 1,
      name: "Mầm Quang",
      title: "Mầm sáng đầu tiên",
      description: "Mầm non bật lên khi em gieo một đáp án đúng vào đất học.",
      effect: "+1 nhịp sinh trưởng",
      unlockXp: 0,
    },
    {
      level: 2,
      name: "Diệp Phi",
      title: "Lá bay dẫn đường",
      description:
        "Những chiếc lá ghi nhớ thứ tự suy luận, giúp em không lạc trong bài dài.",
      effect: "+4 sát thương phép",
      unlockXp: 100,
    },
    {
      level: 3,
      name: "Sinh Mạch",
      title: "Mạch sống liên hoàn",
      description:
        "Rễ cây nối các phép tính liên quan để một ý tưởng có thể nảy nhiều nhánh.",
      effect: "+8 sát thương phép",
      unlockXp: 200,
    },
    {
      level: 4,
      name: "Vạn Mộc",
      title: "Khu rừng quy luật",
      description:
        "Mộc khí phủ kín trang giấy, biến quy luật thành một khu rừng dễ khám phá.",
      effect: "+12 sát thương phép",
      unlockXp: 300,
    },
    {
      level: 5,
      name: "Cổ Lâm Thức",
      title: "Thức tỉnh cổ lâm",
      description:
        "Mộc ấn hoàn thiện, rễ hiểu biết bám chắc vào mọi dạng bài đã gặp.",
      effect: "Bậc tối đa · Mộc hoàn thiện",
      unlockXp: 400,
    },
  ],
  kim: [
    {
      level: 1,
      name: "Kim Điểm",
      title: "Điểm sáng chính xác",
      description: "Một chấm kim loại khóa đúng vị trí của đáp án trên la bàn.",
      effect: "+1 nhịp định hướng",
      unlockXp: 0,
    },
    {
      level: 2,
      name: "Hoàn Giáp",
      title: "Vòng giáp bảo hộ",
      description:
        "Vòng kim loại giữ cho từng con số đứng đúng hàng, đúng cột.",
      effect: "+4 sát thương phép",
      unlockXp: 100,
    },
    {
      level: 3,
      name: "Phản Quang",
      title: "Gương phản quang",
      description:
        "Mặt gương sáng giúp em soi lại phép tính trước khi chốt câu trả lời.",
      effect: "+8 sát thương phép",
      unlockXp: 200,
    },
    {
      level: 4,
      name: "Thiên Kim Trận",
      title: "Trận sao kim tuyến",
      description:
        "Các mảnh la bàn ghép thành mạng lưới chính xác cho bài nhiều bước.",
      effect: "+12 sát thương phép",
      unlockXp: 300,
    },
    {
      level: 5,
      name: "Tinh Hà Kim Ấn",
      title: "Kim ấn tinh hà",
      description:
        "Kim ấn hoàn thiện, từng dữ kiện lấp lánh đúng vị trí trong bản đồ tư duy.",
      effect: "Bậc tối đa · Kim hoàn thiện",
      unlockXp: 400,
    },
  ],
  thổ: [
    {
      level: 1,
      name: "Thạch Tử",
      title: "Viên đá nền",
      description:
        "Viên đá đầu tiên dựng nền cho một lời giải chắc chắn và có kiểm tra.",
      effect: "+1 nhịp giữ thế",
      unlockXp: 0,
    },
    {
      level: 2,
      name: "Địa Thuẫn",
      title: "Khiên đất nung",
      description: "Lớp đất ấm che chắn các bước tính khỏi sai lệch vội vàng.",
      effect: "+4 sát thương phép",
      unlockXp: 100,
    },
    {
      level: 3,
      name: "Trấn Bộ",
      title: "Bước chân trấn giữ",
      description:
        "Mỗi bước giải được đóng như một viên gạch, tạo thành đường đi rõ ràng.",
      effect: "+8 sát thương phép",
      unlockXp: 200,
    },
    {
      level: 4,
      name: "Sơn Thành",
      title: "Thành lũy núi số",
      description:
        "Núi số bảo vệ em trước bài toán nhiều dữ kiện và nhiều phép tính.",
      effect: "+12 sát thương phép",
      unlockXp: 300,
    },
    {
      level: 5,
      name: "Vạn Sơn Tâm",
      title: "Tâm núi vạn lời giải",
      description:
        "Thổ ấn hoàn thiện, nền tảng vững đến mức em có thể tự tin thử cửa Boss.",
      effect: "Bậc tối đa · Thổ hoàn thiện",
      unlockXp: 400,
    },
  ],
};

export const getMagicBookElement = (
  value: string | undefined
): MagicBookElement | undefined => {
  if (!value) return undefined;
  if (value in MAGIC_BOOK_ELEMENT_BY_KEY) return value as MagicBookElement;
  if (value === "độc") return "mộc";
  return MAGIC_BOOK_ELEMENT_BY_WIRE[value as Exclude<ElementName, "độc">];
};

export const getMagicBookWire = (element: MagicBookElement): ElementName =>
  MAGIC_BOOK_ELEMENT_BY_KEY[element].wire;

export const getMagicBookLevel = (xp: number): MagicBookLevel =>
  Math.min(
    MAGIC_BOOK_MAX_LEVEL,
    Math.floor(Math.max(0, xp) / MAGIC_BOOK_XP_PER_LEVEL) + 1
  ) as MagicBookLevel;

export const getMagicBookProgress = (xp: number) => {
  const level = getMagicBookLevel(xp);
  return level === MAGIC_BOOK_MAX_LEVEL
    ? MAGIC_BOOK_XP_PER_LEVEL
    : Math.max(0, xp) % MAGIC_BOOK_XP_PER_LEVEL;
};

export const isMagicBookLevelUnlocked = (xp: number, level: MagicBookLevel) =>
  Math.max(0, xp) >= (level - 1) * MAGIC_BOOK_XP_PER_LEVEL;
