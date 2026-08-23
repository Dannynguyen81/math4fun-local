/**
 * Math4Fun five-element combat runtime.
 *
 * The public canon is Hỏa · Thủy · Mộc · Kim · Thổ. The older ElementName strings
 * are kept only as a wire/storage codec so existing v3 localStorage profiles and
 * UI code can be upgraded without losing progress. No Guardian uses the old Độc
 * branch after this module is applied.
 */
import {
  ELEMENTAL_MATCHUPS,
  ELEMENT_ORDER,
  GUARDIANS,
  MAGIC_MEDIA,
  MAP_BOSS_ARCHIVES,
  SPELLS,
  WEEKLY_MAGIC_QUESTS,
} from "./gameData";
import { GUARDIAN_AFFINITY, type GuardianAffinity } from "./guardianBranding";

export type FiveElement = GuardianAffinity;
export type FiveElementWire = "lửa" | "nước" | "gió" | "sấm" | "đất";

export const FIVE_ELEMENT_ORDER: readonly FiveElement[] = ["hỏa", "thủy", "mộc", "kim", "thổ"];

/** Compatibility codec. These wire values are implementation details, not UI labels. */
export const FIVE_ELEMENT_TO_WIRE: Record<FiveElement, FiveElementWire> = {
  "hỏa": "lửa",
  "thủy": "nước",
  "mộc": "gió",
  "kim": "sấm",
  "thổ": "đất",
};

export const WIRE_TO_FIVE_ELEMENT: Record<FiveElementWire, FiveElement> = {
  "lửa": "hỏa",
  "nước": "thủy",
  "gió": "mộc",
  "sấm": "kim",
  "đất": "thổ",
};

export const FIVE_ELEMENT_LABEL: Record<FiveElement, string> = {
  "hỏa": "Hỏa",
  "thủy": "Thủy",
  "mộc": "Mộc",
  "kim": "Kim",
  "thổ": "Thổ",
};

export const FIVE_ELEMENT_GLYPH: Record<FiveElement, string> = {
  "hỏa": "✦",
  "thủy": "≈",
  "mộc": "❋",
  "kim": "◇",
  "thổ": "◆",
};

/**
 * Math4Fun uses the traditional controlling cycle for battle advantage:
 * Mộc → Thổ → Thủy → Hỏa → Kim → Mộc.
 */
export const FIVE_ELEMENT_MATCHUPS: Record<FiveElement, { strongAgainst: FiveElement; weakAgainst: FiveElement; fieldNote: string }> = {
  "hỏa": { strongAgainst: "kim", weakAgainst: "thủy", fieldNote: "Hỏa luyện Kim, nhưng dịu xuống trước Thủy." },
  "thủy": { strongAgainst: "hỏa", weakAgainst: "thổ", fieldNote: "Thủy khắc Hỏa, nhưng bị Thổ ngăn và dẫn dòng." },
  "mộc": { strongAgainst: "thổ", weakAgainst: "kim", fieldNote: "Mộc xuyên và giữ Thổ, nhưng bị Kim cắt khắc." },
  "kim": { strongAgainst: "mộc", weakAgainst: "hỏa", fieldNote: "Kim khắc Mộc bằng độ chính xác, nhưng bị Hỏa luyện hóa." },
  "thổ": { strongAgainst: "thủy", weakAgainst: "mộc", fieldNote: "Thổ chặn Thủy và giữ thế, nhưng bị Mộc xuyên phá." },
};

export function getGuardianAffinity(guardianId: string | undefined): FiveElement | undefined {
  return guardianId ? GUARDIAN_AFFINITY[guardianId] : undefined;
}

export function getFiveElementFromWire(value: string | undefined): FiveElement | undefined {
  if (!value) return undefined;
  if ((FIVE_ELEMENT_ORDER as readonly string[]).includes(value)) return value as FiveElement;
  if (value === "độc") return "mộc"; // one-time compatibility from the retired sixth branch
  return WIRE_TO_FIVE_ELEMENT[value as FiveElementWire];
}

function wire(element: FiveElement) {
  return FIVE_ELEMENT_TO_WIRE[element];
}

function applyGuardianElements() {
  for (const guardian of GUARDIANS) {
    const affinity = GUARDIAN_AFFINITY[guardian.id];
    if (affinity) guardian.element = wire(affinity) as typeof guardian.element;
  }
  MAP_BOSS_ARCHIVES[1].element = wire(GUARDIAN_AFFINITY.atlas) as typeof MAP_BOSS_ARCHIVES[1]["element"];
  MAP_BOSS_ARCHIVES[2].element = wire(GUARDIAN_AFFINITY.myrion) as typeof MAP_BOSS_ARCHIVES[2]["element"];
}

function applyFiveElementSpells() {
  SPELLS.splice(0, SPELLS.length,
    { id: "flame", name: "Hỏa Ấn", element: "Lửa", icon: "✦", tone: "border-[#ee6b4e] bg-[#ffe4dc]", damage: 30, counterDamage: 13, note: "Hỏa thiên về bộc phát; khắc Kim và yếu trước Thủy." },
    { id: "tide", name: "Thủy Ấn", element: "Nước", icon: "≈", tone: "border-[#55a9dd] bg-[#e4f3fb]", damage: 21, counterDamage: 6, note: "Thủy linh hoạt và phòng thủ; khắc Hỏa, yếu trước Thổ." },
    { id: "gust", name: "Mộc Ấn", element: "Gió", icon: "❋", tone: "border-[#4d8b67] bg-[#e7f2e5]", damage: 24, counterDamage: 8, note: "Mộc cân bằng công–hỗ trợ; khắc Thổ, yếu trước Kim." },
    { id: "thunder", name: "Kim Ấn", element: "Sấm", icon: "◇", tone: "border-[#c89a38] bg-[#fff0b6]", damage: 27, counterDamage: 10, note: "Kim chính xác và phản đòn; khắc Mộc, yếu trước Hỏa." },
    { id: "quarry", name: "Thổ Ấn", element: "Đất", icon: "◆", tone: "border-[#b17a3d] bg-[#f7ead5]", damage: 24, counterDamage: 7, note: "Thổ bền bỉ và giữ thế; khắc Thủy, yếu trước Mộc." },
  );
}

function applyFiveElementMatchups() {
  const target = ELEMENTAL_MATCHUPS as unknown as Record<string, { strongAgainst: string; weakAgainst: string; fieldNote: string }>;
  for (const key of Object.keys(target)) delete target[key];
  for (const element of FIVE_ELEMENT_ORDER) {
    const matchup = FIVE_ELEMENT_MATCHUPS[element];
    target[wire(element)] = {
      strongAgainst: wire(matchup.strongAgainst),
      weakAgainst: wire(matchup.weakAgainst),
      fieldNote: matchup.fieldNote,
    };
  }

  ELEMENT_ORDER.splice(0, ELEMENT_ORDER.length, ...FIVE_ELEMENT_ORDER.map((element) => wire(element) as typeof ELEMENT_ORDER[number]));
}

function applyFiveElementMediaAndQuests() {
  const media = MAGIC_MEDIA as unknown as Record<string, { title: string; shortLabel: string; src: string; note: string }>;
  delete media["độc"];
  media["lửa"] = { ...media["lửa"], title: "Hỏa Ấn Số Học", shortLabel: "HỎA ẤN", note: "Hỏa lực bùng lên từ một lời giải chính xác." };
  media["nước"] = { ...media["nước"], title: "Thủy Ấn Số Học", shortLabel: "THỦY ẤN", note: "Dòng Thủy giữ nhịp và cân bằng thế trận." };
  media["gió"] = { ...media["gió"], title: "Mộc Ấn Sinh Trưởng", shortLabel: "MỘC ẤN", note: "Mộc khí lớn dần theo chuỗi suy luận đúng." };
  media["sấm"] = { ...media["sấm"], title: "Kim Ấn Chính Xác", shortLabel: "KIM ẤN", note: "Kim quang hội tụ vào một đòn phép chính xác." };
  media["đất"] = { ...media["đất"], title: "Thổ Ấn Cân Bằng", shortLabel: "THỔ ẤN", note: "Thổ lực dựng nền phòng thủ bền vững." };

  WEEKLY_MAGIC_QUESTS.splice(0, WEEKLY_MAGIC_QUESTS.length,
    { element: "lửa", target: 3, title: "Ba lần giữ Hỏa", note: "Kích hoạt Hỏa Ấn ba lượt trong trận Boss.", rewardXp: 45 },
    { element: "nước", target: 3, title: "Ba nhịp Thủy", note: "Kích hoạt Thủy Ấn ba lượt trong trận Boss.", rewardXp: 45 },
    { element: "gió", target: 3, title: "Mộc khí sinh trưởng", note: "Kích hoạt Mộc Ấn ba lượt trong trận Boss.", rewardXp: 45 },
    { element: "sấm", target: 3, title: "Kim quang chính xác", note: "Kích hoạt Kim Ấn ba lượt trong trận Boss.", rewardXp: 45 },
    { element: "đất", target: 3, title: "Ba nền Thổ vững", note: "Kích hoạt Thổ Ấn ba lượt trong trận Boss.", rewardXp: 45 },
  );
}

/** Aggregate the retired Độc progress into Mộc; all other old keys already map 1:1 to the compatibility codec. */
function migrateRecord(record: unknown) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return record;
  const source = record as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    const canonical = getFiveElementFromWire(key);
    const destination = canonical ? wire(canonical) : key;
    if (typeof value === "number" && typeof result[destination] === "number") result[destination] = (result[destination] as number) + value;
    else result[destination] = value;
  }
  return result;
}

function migrateSavedProfiles() {
  if (typeof window === "undefined") return;
  const storageKey = "math4fun-field-journal-v3";
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (parsed.combatElementSchema === "wu-xing-v1") return;
    if (Array.isArray(parsed.profiles)) {
      parsed.profiles = parsed.profiles.map((entry) => {
        if (!entry || typeof entry !== "object") return entry;
        const profile = { ...(entry as Record<string, unknown>) };
        profile.magicUsage = migrateRecord(profile.magicUsage);
        profile.elementXp = migrateRecord(profile.elementXp);
        if (Array.isArray(profile.magicBookWatchedElements)) {
          profile.magicBookWatchedElements = Array.from(new Set(profile.magicBookWatchedElements.map((value) => {
            const canonical = typeof value === "string" ? getFiveElementFromWire(value) : undefined;
            return canonical ? wire(canonical) : value;
          })));
        }
        if (profile.weeklyMagicQuest && typeof profile.weeklyMagicQuest === "object") {
          const quest = { ...(profile.weeklyMagicQuest as Record<string, unknown>) };
          const canonical = typeof quest.element === "string" ? getFiveElementFromWire(quest.element) : undefined;
          if (canonical) quest.element = wire(canonical);
          profile.weeklyMagicQuest = quest;
        }
        return profile;
      });
    }
    parsed.combatElementSchema = "wu-xing-v1";
    window.localStorage.setItem(storageKey, JSON.stringify(parsed));
  } catch {
    // A malformed local save is handled by GameContext's existing recovery path.
  }
}

applyGuardianElements();
applyFiveElementSpells();
applyFiveElementMatchups();
applyFiveElementMediaAndQuests();
migrateSavedProfiles();
