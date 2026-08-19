/**
 * Math4Fun local state — Field Journal Quest keeps learning evidence across navigation.
 * Gameplay rules live here, never in a page: mastery needs 10 distinct correct answers,
 * Boss runs use a non-repeating hard-question pool, magic progression stays local-only,
 * and collectible-set rewards are recorded once per companion profile.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BOSS_QUESTION_IDS, COMPANION_COSMETIC_SETS, Difficulty, ELEMENT_ORDER, ELEMENT_XP_PER_LEVEL, ElementName, FIVE_CORRECT_STREAK_GOLD, getGuardian, getMapIdForStation, getMapStations, getStation, getStationSessionQuestionIds, getTrainingDifficulty, getTrainingTechnique, GOLD_BY_DIFFICULTY, GUARDIANS, MAP1_BOSS_QUESTION_IDS, QUESTIONS_BY_ID, SHOP_ITEMS, SPELLS, STATIONS, WEEKLY_MAGIC_QUESTS, type CosmeticSlot, type CosmeticSetDefinition, type MapId, type ShopItem, type TrainingDifficultyId, type WeeklyMagicQuestDefinition } from "@/game/gameData";

export type AvatarId =
  | "compass" | "ember" | "tide" | "leaf"
  | "b01" | "b02" | "b03" | "b04" | "b05" | "b06" | "b07" | "b08" | "b09" | "b10"
  | "g01" | "g02" | "g03" | "g04" | "g05" | "g06" | "g07" | "g08" | "g09" | "g10";
const AVATAR_IDS: AvatarId[] = ["compass", "ember", "tide", "leaf", "b01", "b02", "b03", "b04", "b05", "b06", "b07", "b08", "b09", "b10", "g01", "g02", "g03", "g04", "g05", "g06", "g07", "g08", "g09", "g10"];
export type StudentProfile = {
  id: string;
  name: string;
  avatar: AvatarId;
  username?: string;
  passwordSalt?: string;
  passwordHash?: string;
  createdAt: string;
  xp: number;
  streak: number;
  lastStudyDate?: string;
  unlockedStationIds: number[];
  stationOpenedAt: Record<number, string>;
  correctQuestionIds: string[];
  incorrectQuestionIds: string[];
  completedStationIds: number[];
  collectedGuardianIds: string[];
  teamGuardianIds: string[];
  attempts: Record<number, StationAttempt>;
  battle: BattleState;
  bossQuestionHistory: string[];
  magicBookWatchedElements: ElementName[];
  magicUsage: Partial<Record<ElementName, number>>;
  elementXp: Partial<Record<ElementName, number>>;
  weeklyMagicQuest: WeeklyMagicQuest;
  gold: number;
  inventory: Record<ShopItem["id"], number>;
  equippedCosmetics: Partial<Record<CosmeticSlot, ShopItem["id"]>>;
  setRewardsClaimed: string[];
  answerStreak: number;
  map1BossDefeated: boolean;
  map1BossQuestionHistory: string[];
  trainingQuestionHistory: string[];
  guardianTrainingXp: Record<string, number>;
  studyDays: number[];
  guardianHealth: Record<string, GuardianHealth>;
  guardianLosses: string[];
  metrics: LearningMetrics;
};

export type WeeklyMagicQuest = WeeklyMagicQuestDefinition & {
  week: string;
  usedCount: number;
  rewardClaimed: boolean;
  completedAt?: string;
};

export type StationAttempt = {
  id: string;
  stationId: number;
  questionIds: string[];
  answeredQuestionIds: string[];
  currentQuestionId: string | null;
  startedAt: string;
  completedAt?: string;
};

export type BattleState = {
  mode: "atlas" | "map1-boss" | "training";
  status: "idle" | "active" | "victory" | "defeat";
  questionIds: string[];
  questionIndex: number;
  playerHp: number;
  bossHp: number;
  lastResult?: { correct: boolean; playerDamage: number; bossDamage: number; spellId: string };
  startedAt?: string;
  guardianId?: string;
  opponentGuardianId?: string;
  trainingDifficulty?: TrainingDifficultyId;
};

export type GuardianHealth = { hp: number; updatedAt: string };

export type LearningMetrics = {
  totalAnswers: number;
  correctAnswers: number;
  stationSessions: number;
  bossRuns: number;
  bossWins: number;
  lastActiveAt?: string;
};

export type ElementLevelUp = { element: ElementName; previousLevel: number; nextLevel: number; totalXp: number };
export type LearningBadgeId = "streak-7" | "streak-14";
export type LeaderboardEntry = { profileId: string; name: string; avatar: AvatarId; score: number; level: number; badges: number; guardians: number; stations: number; streak: number };
export type StudyReminder = { state: "today" | "tomorrow" | "rest"; label: string; scheduledDays: number[] };
type ParentPinRecord = { salt: string; hash: string; createdAt: string; securityQuestion?: string; answerSalt?: string; answerHash?: string };
type GameStore = { version: 9; profiles: StudentProfile[]; activeProfileId: string | null; audioEnabled: boolean; siteVisitCount: number; lastSiteVisitAt?: string; parentPin?: ParentPinRecord };
export type StationProgress = { correct: number; answered: number; target: number; total: number; accuracy: number };
export type StreakMilestone = { streak: number; bonusGold: number };
export type AnswerResult = { correct: boolean; stationMastered: boolean; nextQuestionId: string | null; streakMilestone?: StreakMilestone };
export type BattleAnswerResult = { correct: boolean; playerDamage: number; bossDamage: number; ended: boolean; levelUp?: ElementLevelUp; trainingLevelUp?: { guardianId: string; previousLevel: number; nextLevel: number; totalXp: number }; streakMilestone?: StreakMilestone };
export type PurchaseResult = { ok: boolean; message: string; setReward?: CosmeticSetDefinition };

type GameContextValue = {
  profile: StudentProfile | null;
  profiles: StudentProfile[];
  hasProfile: boolean;
  audioEnabled: boolean;
  siteVisitCount: number;
  lastSiteVisitAt?: string;
  level: number;
  levelProgress: number;
  weeklyOpenCount: number;
  createProfile: (name: string, avatar: AvatarId, username: string, password: string) => Promise<{ ok: boolean; message: string }>;
  signIn: (profileId: string, password: string) => Promise<{ ok: boolean; message: string }>;
  setLegacyProfilePassword: (profileId: string, username: string, password: string) => Promise<{ ok: boolean; message: string }>;
  selectProfile: (profileId: string) => void;
  leaderboard: LeaderboardEntry[];
  learningBadges: LearningBadgeId[];
  unlockStationForWeek: (stationId: number) => boolean;
  isStationUnlocked: (stationId: number) => boolean;
  isStationMastered: (stationId: number) => boolean;
  stationProgress: (stationId: number) => StationProgress;
  getStationAttempt: (stationId: number) => StationAttempt | null;
  startStationSession: (stationId: number) => StationAttempt | null;
  answerStationQuestion: (questionId: string, answer: number) => AnswerResult | null;
  isBossUnlocked: boolean;
  startBattle: (guardianId: string) => boolean;
  isMapUnlocked: (mapId: MapId) => boolean;
  isMap1BossUnlocked: boolean;
  startMap1BossBattle: (guardianId: string) => boolean;
  canTrainPets: boolean;
  startTrainingBattle: (guardianId: string, opponentGuardianId: string, difficulty: TrainingDifficultyId) => boolean;
  guardianTrainingLevel: (guardianId: string) => number;
  resolveBattleAnswer: (answer: number, spellId: string) => BattleAnswerResult | null;
  advanceBattle: () => void;
  markMagicVideoWatched: (element: ElementName) => void;
  magicBookWatchedCount: number;
  hasMagicBookAchievement: boolean;
  mostUsedMagicElement: ElementName | null;
  elementXp: Partial<Record<ElementName, number>>;
  elementLevel: (element: ElementName) => number;
  weeklyMagicQuest: WeeklyMagicQuest | null;
  createProfileBackup: () => string | null;
  hasParentPin: boolean;
  parentSecurityQuestion: string | null;
  setParentPin: (pin: string, securityQuestion: string, securityAnswer: string) => Promise<{ ok: boolean; message: string }>;
  changeParentPin: (currentPin: string, nextPin: string, securityQuestion: string, securityAnswer: string) => Promise<{ ok: boolean; message: string }>;
  resetParentPin: (securityAnswer: string, nextPin: string) => Promise<{ ok: boolean; message: string }>;
  restoreProfileBackup: (raw: string, pin: string) => Promise<{ ok: boolean; message: string }>;
  toggleTeamGuardian: (guardianId: string) => void;
  exitGame: () => void;
  gold: number;
  inventory: Record<ShopItem["id"], number>;
  elementBadges: ElementName[];
  guardianHp: (guardianId: string) => number;
  purchaseItem: (itemId: ShopItem["id"]) => PurchaseResult;
  useHealingItem: (itemId: ShopItem["id"], guardianId: string) => { ok: boolean; message: string };
  equippedCosmetics: Partial<Record<CosmeticSlot, ShopItem["id"]>>;
  equipCosmetic: (itemId: ShopItem["id"]) => { ok: boolean; message: string };
  studyDays: number[];
  studyReminder: StudyReminder | null;
  setStudyDays: (days: number[]) => void;
  requestStudyNotifications: () => Promise<{ ok: boolean; message: string }>;
  setAudioEnabled: (enabled: boolean) => void;
  resetActiveProfile: () => void;
};

// Giữ khóa v3 để tự động nâng mọi hồ sơ đã lưu, không làm mất hành trình đang có.
const STORAGE_KEY = "math4fun-field-journal-v3";
const emptyBattle = (): BattleState => ({ mode: "atlas", status: "idle", questionIds: [], questionIndex: 0, playerHp: 100, bossHp: 150 });
const emptyMetrics = (): LearningMetrics => ({ totalAnswers: 0, correctAnswers: 0, stationSessions: 0, bossRuns: 0, bossWins: 0 });
const emptyInventory = (): Record<ShopItem["id"], number> => ({ "potion-25": 0, "potion-50": 0, "potion-100": 0, "outfit-indigo": 0, "outfit-marigold": 0, "outfit-moss": 0, "trail-stars": 0, "trail-leaves": 0 });
const GUARDIAN_MAX_HP = 100;
const GUARDIAN_HP_PER_HOUR = 20;
const DEFAULT_STORE: GameStore = { version: 9, profiles: [], activeProfileId: null, audioEnabled: true, siteVisitCount: 0 };
const GameContext = createContext<GameContextValue | undefined>(undefined);

function localDate() { return new Date().toISOString().slice(0, 10); }
const DEFAULT_STUDY_DAYS = [1, 2, 3, 4, 5];
const VIETNAMESE_DAYS = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
function normalizeStudyDays(candidate: unknown) {
  return Array.isArray(candidate) ? Array.from(new Set(candidate.filter((day): day is number => typeof day === "number" && Number.isInteger(day) && day >= 0 && day <= 6))).sort((left, right) => left - right) : DEFAULT_STUDY_DAYS;
}
function isConsecutiveStudyDay(previous: string | undefined, today: string) {
  if (!previous) return false;
  const [previousYear, previousMonth, previousDay] = previous.split("-").map(Number);
  const [todayYear, todayMonth, todayDay] = today.split("-").map(Number);
  if (![previousYear, previousMonth, previousDay, todayYear, todayMonth, todayDay].every(Number.isFinite)) return false;
  const previousUtc = Date.UTC(previousYear, previousMonth - 1, previousDay);
  const todayUtc = Date.UTC(todayYear, todayMonth - 1, todayDay);
  return todayUtc - previousUtc === 86_400_000;
}
function isParentPin(pin: string) { return /^\d{4,8}$/.test(pin); }
function isStudentPassword(password: string) { return password.length >= 6 && password.length <= 64; }
function normalizeUsername(username: string) { return username.trim().toLocaleLowerCase("vi-VN").replace(/\s+/g, ""); }
function bytesToHex(bytes: Uint8Array) { return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(""); }
function createParentPinSalt() {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}
async function hashParentPin(pin: string, salt: string) {
  if (typeof window === "undefined" || !window.crypto?.subtle) return null;
  const encoded = new TextEncoder().encode(`${salt}:${pin}`);
  const digest = await window.crypto.subtle.digest("SHA-256", encoded);
  return bytesToHex(new Uint8Array(digest));
}
function normalizeSecurityAnswer(answer: string) { return answer.trim().toLocaleLowerCase("vi-VN"); }
function effectiveGuardianHealth(health?: GuardianHealth, now = Date.now()): GuardianHealth {
  if (!health) return { hp: GUARDIAN_MAX_HP, updatedAt: new Date(now).toISOString() };
  const lastUpdate = new Date(health.updatedAt).getTime();
  const elapsedHours = Number.isFinite(lastUpdate) ? Math.floor(Math.max(0, now - lastUpdate) / 3_600_000) : 0;
  return { hp: Math.min(GUARDIAN_MAX_HP, Math.max(0, health.hp) + elapsedHours * GUARDIAN_HP_PER_HOUR), updatedAt: new Date(now).toISOString() };
}
function weekKey() {
  const date = new Date();
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date.toISOString().slice(0, 10);
}
function getWeeklyMagicQuest(seedWeek = weekKey()): WeeklyMagicQuest {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const questIndex = Math.abs(Math.floor(new Date(`${seedWeek}T00:00:00`).getTime() / msPerWeek)) % WEEKLY_MAGIC_QUESTS.length;
  return { ...WEEKLY_MAGIC_QUESTS[questIndex], week: seedWeek, usedCount: 0, rewardClaimed: false };
}
function shuffle<T>(source: T[]) {
  const result = [...source];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}
function createProfileRecord(name: string, avatar: AvatarId, account?: Pick<StudentProfile, "username" | "passwordSalt" | "passwordHash">): StudentProfile {
  return {
    id: `student-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim().slice(0, 22),
    avatar,
    ...account,
    createdAt: new Date().toISOString(),
    xp: 0,
    streak: 0,
    unlockedStationIds: [],
    stationOpenedAt: {},
    correctQuestionIds: [],
    incorrectQuestionIds: [],
    completedStationIds: [],
    collectedGuardianIds: [],
    teamGuardianIds: [],
    attempts: {},
    battle: emptyBattle(),
    bossQuestionHistory: [],
    magicBookWatchedElements: [],
    magicUsage: {},
    elementXp: {},
    weeklyMagicQuest: getWeeklyMagicQuest(),
    gold: 0,
    inventory: emptyInventory(),
    equippedCosmetics: {},
    setRewardsClaimed: [],
    answerStreak: 0,
    map1BossDefeated: false,
    map1BossQuestionHistory: [],
    trainingQuestionHistory: [],
    guardianTrainingXp: {},
    studyDays: DEFAULT_STUDY_DAYS,
    guardianHealth: {},
    guardianLosses: [],
    metrics: emptyMetrics(),
  };
}
function hydrateProfile(candidate: Partial<StudentProfile>, forcedId?: string): StudentProfile {
  const avatar: AvatarId = AVATAR_IDS.includes(candidate.avatar as AvatarId) ? candidate.avatar as AvatarId : "compass";
  const base = createProfileRecord(typeof candidate.name === "string" ? candidate.name : "Nhà thám hiểm", avatar);
  const currentQuest = getWeeklyMagicQuest();
  const storedQuest = candidate.weeklyMagicQuest;
  const validQuest = storedQuest && storedQuest.week === currentQuest.week && ELEMENT_ORDER.includes(storedQuest.element) ? storedQuest : currentQuest;
  return {
    ...base,
    ...candidate,
    id: forcedId ?? (typeof candidate.id === "string" ? candidate.id : base.id),
    avatar,
    username: typeof candidate.username === "string" && normalizeUsername(candidate.username).length >= 3 ? normalizeUsername(candidate.username).slice(0, 18) : undefined,
    passwordSalt: typeof candidate.passwordSalt === "string" && candidate.passwordSalt.length >= 16 ? candidate.passwordSalt : undefined,
    passwordHash: typeof candidate.passwordHash === "string" && candidate.passwordHash.length >= 32 ? candidate.passwordHash : undefined,
    createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : base.createdAt,
    xp: typeof candidate.xp === "number" && Number.isFinite(candidate.xp) ? Math.max(0, candidate.xp) : 0,
    streak: typeof candidate.streak === "number" && Number.isFinite(candidate.streak) ? Math.max(0, candidate.streak) : 0,
    unlockedStationIds: Array.isArray(candidate.unlockedStationIds) ? candidate.unlockedStationIds.filter((id): id is number => typeof id === "number") : [],
    stationOpenedAt: candidate.stationOpenedAt && typeof candidate.stationOpenedAt === "object" ? candidate.stationOpenedAt : {},
    correctQuestionIds: Array.isArray(candidate.correctQuestionIds) ? candidate.correctQuestionIds.filter((id): id is string => typeof id === "string") : [],
    incorrectQuestionIds: Array.isArray(candidate.incorrectQuestionIds) ? candidate.incorrectQuestionIds.filter((id): id is string => typeof id === "string") : [],
    completedStationIds: Array.isArray(candidate.completedStationIds) ? candidate.completedStationIds.filter((id): id is number => typeof id === "number") : [],
    collectedGuardianIds: Array.isArray(candidate.collectedGuardianIds) ? candidate.collectedGuardianIds.filter((id): id is string => typeof id === "string") : [],
    teamGuardianIds: Array.isArray(candidate.teamGuardianIds) ? candidate.teamGuardianIds.filter((id): id is string => typeof id === "string").slice(0, 3) : [],
    attempts: candidate.attempts && typeof candidate.attempts === "object" ? candidate.attempts : {},
    battle: candidate.battle?.status ? candidate.battle : emptyBattle(),
    bossQuestionHistory: Array.isArray(candidate.bossQuestionHistory) ? candidate.bossQuestionHistory.filter((id): id is string => typeof id === "string") : [],
    magicBookWatchedElements: Array.isArray(candidate.magicBookWatchedElements) ? candidate.magicBookWatchedElements.filter((element): element is ElementName => ELEMENT_ORDER.includes(element as ElementName)) : [],
    magicUsage: candidate.magicUsage && typeof candidate.magicUsage === "object" ? candidate.magicUsage : {},
    elementXp: candidate.elementXp && typeof candidate.elementXp === "object" ? candidate.elementXp : {},
    weeklyMagicQuest: { ...currentQuest, ...validQuest, usedCount: Math.min(currentQuest.target, Math.max(0, Number(validQuest.usedCount) || 0)), rewardClaimed: Boolean(validQuest.rewardClaimed) },
    gold: typeof candidate.gold === "number" && Number.isFinite(candidate.gold) ? Math.max(0, Math.floor(candidate.gold)) : 0,
    inventory: { ...emptyInventory(), ...(candidate.inventory && typeof candidate.inventory === "object" ? candidate.inventory : {}) },
    equippedCosmetics: candidate.equippedCosmetics && typeof candidate.equippedCosmetics === "object" ? candidate.equippedCosmetics : {},
    setRewardsClaimed: Array.isArray(candidate.setRewardsClaimed) ? Array.from(new Set(candidate.setRewardsClaimed.filter((setId): setId is string => typeof setId === "string" && COMPANION_COSMETIC_SETS.some((set) => set.id === setId)))) : [],
    answerStreak: typeof candidate.answerStreak === "number" && Number.isFinite(candidate.answerStreak) ? Math.max(0, Math.floor(candidate.answerStreak)) : 0,
    map1BossDefeated: Boolean(candidate.map1BossDefeated) || (Array.isArray(candidate.unlockedStationIds) && candidate.unlockedStationIds.some((id) => {
      const station = getStation(id);
      return station ? getMapIdForStation(station) === 2 : false;
    })),
    map1BossQuestionHistory: Array.isArray(candidate.map1BossQuestionHistory) ? candidate.map1BossQuestionHistory.filter((id): id is string => typeof id === "string") : [],
    trainingQuestionHistory: Array.isArray(candidate.trainingQuestionHistory) ? candidate.trainingQuestionHistory.filter((id): id is string => typeof id === "string") : [],
    guardianTrainingXp: candidate.guardianTrainingXp && typeof candidate.guardianTrainingXp === "object" ? candidate.guardianTrainingXp : {},
    studyDays: normalizeStudyDays(candidate.studyDays),
    guardianHealth: candidate.guardianHealth && typeof candidate.guardianHealth === "object" ? candidate.guardianHealth : {},
    guardianLosses: Array.isArray(candidate.guardianLosses) ? candidate.guardianLosses.filter((id): id is string => typeof id === "string") : [],
    metrics: { ...emptyMetrics(), ...(candidate.metrics && typeof candidate.metrics === "object" ? candidate.metrics : {}) },
  };
}
function readStore(): GameStore {
  if (typeof window === "undefined") return DEFAULT_STORE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORE;
    const parsed = JSON.parse(raw) as Partial<GameStore>;
    if (!Array.isArray(parsed.profiles)) return DEFAULT_STORE;
    return {
      version: 9,
      activeProfileId: typeof parsed.activeProfileId === "string" ? parsed.activeProfileId : null,
      audioEnabled: typeof parsed.audioEnabled === "boolean" ? parsed.audioEnabled : true,
      siteVisitCount: typeof parsed.siteVisitCount === "number" && Number.isFinite(parsed.siteVisitCount) ? Math.max(0, parsed.siteVisitCount) : 0,
      lastSiteVisitAt: typeof parsed.lastSiteVisitAt === "string" ? parsed.lastSiteVisitAt : undefined,
      parentPin: parsed.parentPin && typeof parsed.parentPin === "object" && typeof parsed.parentPin.salt === "string" && typeof parsed.parentPin.hash === "string" ? parsed.parentPin : undefined,
      profiles: parsed.profiles.map((profile) => hydrateProfile(profile)),
    };
  } catch {
    return DEFAULT_STORE;
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<GameStore>(readStore);
  const parentPinRef = useRef<ParentPinRecord | undefined>(store.parentPin);
  useEffect(() => { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); }, [store]);
  useEffect(() => { parentPinRef.current = store.parentPin; }, [store.parentPin]);
  useEffect(() => { setStore((previous) => ({ ...previous, siteVisitCount: previous.siteVisitCount + 1, lastSiteVisitAt: new Date().toISOString() })); }, []);

  const profile = useMemo(() => store.profiles.find((entry) => entry.id === store.activeProfileId) ?? null, [store]);
  const updateProfile = useCallback((profileId: string, updater: (entry: StudentProfile) => StudentProfile) => {
    setStore((previous) => ({ ...previous, profiles: previous.profiles.map((entry) => entry.id === profileId ? updater(entry) : entry) }));
  }, []);
  const createProfile = useCallback(async (name: string, avatar: AvatarId, username: string, password: string) => {
    const accountName = normalizeUsername(username);
    if (name.trim().length < 2) return { ok: false, message: "Hãy nhập tên hiển thị gồm ít nhất 2 ký tự." };
    if (accountName.length < 3 || accountName.length > 18) return { ok: false, message: "Tên đăng nhập cần từ 3–18 ký tự, không có khoảng trắng." };
    if (!isStudentPassword(password)) return { ok: false, message: "Mật khẩu cần từ 6–64 ký tự." };
    if (typeof window === "undefined" || !window.crypto?.subtle) return { ok: false, message: "Trình duyệt này chưa hỗ trợ tạo mật khẩu an toàn." };
    if (store.profiles.some((entry) => entry.username === accountName)) return { ok: false, message: "Tên đăng nhập này đã có trên thiết bị." };
    const passwordSalt = createParentPinSalt();
    const passwordHash = await hashParentPin(password, passwordSalt);
    if (!passwordHash) return { ok: false, message: "Không thể lưu mật khẩu trên trình duyệt này." };
    const record = createProfileRecord(name || "Nhà thám hiểm", avatar, { username: accountName, passwordSalt, passwordHash });
    setStore((previous) => ({ ...previous, profiles: [...previous.profiles, record], activeProfileId: record.id }));
    return { ok: true, message: "Đã tạo nhật ký và đăng nhập trên thiết bị này." };
  }, [store.profiles]);
  const setLegacyProfilePassword = useCallback(async (profileId: string, username: string, password: string) => {
    const accountName = normalizeUsername(username);
    const existing = store.profiles.find((entry) => entry.id === profileId);
    if (!existing) return { ok: false, message: "Không tìm thấy hồ sơ này." };
    if (existing.passwordHash) return { ok: false, message: "Hồ sơ này đã có mật khẩu; hãy đăng nhập bình thường." };
    if (accountName.length < 3 || accountName.length > 18) return { ok: false, message: "Tên đăng nhập cần từ 3–18 ký tự." };
    if (!isStudentPassword(password)) return { ok: false, message: "Mật khẩu cần từ 6–64 ký tự." };
    if (store.profiles.some((entry) => entry.id !== profileId && entry.username === accountName)) return { ok: false, message: "Tên đăng nhập này đã có trên thiết bị." };
    const passwordSalt = createParentPinSalt();
    const passwordHash = await hashParentPin(password, passwordSalt);
    if (!passwordHash) return { ok: false, message: "Không thể tạo mật khẩu trên trình duyệt này." };
    updateProfile(profileId, (current) => ({ ...current, username: accountName, passwordSalt, passwordHash }));
    setStore((previous) => ({ ...previous, activeProfileId: profileId }));
    return { ok: true, message: "Đã bảo vệ nhật ký cũ bằng tên đăng nhập và mật khẩu." };
  }, [store.profiles, updateProfile]);
  const signIn = useCallback(async (profileId: string, password: string) => {
    const entry = store.profiles.find((profileEntry) => profileEntry.id === profileId);
    if (!entry) return { ok: false, message: "Không tìm thấy nhật ký này trên thiết bị." };
    if (!entry.passwordHash || !entry.passwordSalt) return { ok: false, message: "Nhật ký này cần thiết lập mật khẩu lần đầu." };
    const enteredHash = await hashParentPin(password, entry.passwordSalt);
    if (!enteredHash || enteredHash !== entry.passwordHash) return { ok: false, message: "Mật khẩu chưa chính xác." };
    setStore((previous) => ({ ...previous, activeProfileId: profileId }));
    return { ok: true, message: `Chào mừng ${entry.name} quay lại hành trình.` };
  }, [store.profiles]);
  const selectProfile = useCallback((profileId: string) => setStore((previous) => previous.profiles.some((entry) => entry.id === profileId) ? { ...previous, activeProfileId: profileId } : previous), []);
  const exitGame = useCallback(() => setStore((previous) => ({ ...previous, activeProfileId: null })), []);
  const setAudioEnabled = useCallback((audioEnabled: boolean) => setStore((previous) => ({ ...previous, audioEnabled })), []);

  const weeklyOpenCount = useMemo(() => {
    if (!profile) return 0;
    const start = new Date(weekKey()).getTime();
    const end = start + 7 * 24 * 60 * 60 * 1000;
    return profile.unlockedStationIds.filter((stationId) => {
      const openedAt = profile.stationOpenedAt[stationId] ? new Date(profile.stationOpenedAt[stationId]).getTime() : 0;
      return openedAt >= start && openedAt < end;
    }).length;
  }, [profile]);
  const unlockStationForWeek = useCallback((stationId: number) => {
    if (!profile || !getStation(stationId)) return false;
    const station = getStation(stationId);
    if (!station || (getMapIdForStation(station) === 2 && !profile.map1BossDefeated)) return false;
    if (profile.unlockedStationIds.includes(stationId)) return true;
    if (weeklyOpenCount >= 2) return false;
    updateProfile(profile.id, (current) => ({ ...current, unlockedStationIds: [...current.unlockedStationIds, stationId], stationOpenedAt: { ...current.stationOpenedAt, [stationId]: new Date().toISOString() } }));
    return true;
  }, [profile, updateProfile, weeklyOpenCount]);
  const isStationUnlocked = useCallback((stationId: number) => Boolean(profile?.unlockedStationIds.includes(stationId)), [profile]);
  const isStationMastered = useCallback((stationId: number) => Boolean(profile?.completedStationIds.includes(stationId)), [profile]);
  const stationProgress = useCallback((stationId: number): StationProgress => {
    const station = getStation(stationId);
    const attempt = profile?.attempts[stationId];
    const correct = station ? Object.values(QUESTIONS_BY_ID).filter((question) => question.stationId === stationId && profile?.correctQuestionIds.includes(question.id)).length : 0;
    const answered = attempt?.answeredQuestionIds.length ?? 0;
    const target = station?.masteryTarget ?? 10;
    const total = station ? Object.values(QUESTIONS_BY_ID).filter((question) => question.stationId === stationId && question.pool === "station").length : 0;
    return { correct, answered, target, total, accuracy: answered ? Math.round((correct / answered) * 100) : 0 };
  }, [profile]);
  const getStationAttempt = useCallback((stationId: number) => profile?.attempts[stationId] ?? null, [profile]);
  const startStationSession = useCallback((stationId: number) => {
    if (!profile || !profile.unlockedStationIds.includes(stationId)) return null;
    const station = getStation(stationId);
    if (!station || station.status !== "ready") return null;
    const existing = profile.attempts[stationId];
    if (existing && !existing.completedAt) return existing;
    const pending = Object.values(QUESTIONS_BY_ID).filter((question) => question.stationId === stationId && question.pool === "station" && !profile.correctQuestionIds.includes(question.id));
    if (!pending.length) return existing ?? null;
    const questionIds = getStationSessionQuestionIds(stationId, profile.correctQuestionIds);
    const attempt: StationAttempt = { id: `station-${stationId}-${Date.now()}`, stationId, questionIds, answeredQuestionIds: [], currentQuestionId: questionIds[0] ?? null, startedAt: new Date().toISOString() };
    updateProfile(profile.id, (current) => ({ ...current, attempts: { ...current.attempts, [stationId]: attempt }, metrics: { ...current.metrics, stationSessions: current.metrics.stationSessions + 1 } }));
    return attempt;
  }, [profile, updateProfile]);
  const answerStationQuestion = useCallback((questionId: string, answer: number): AnswerResult | null => {
    if (!profile) return null;
    const question = QUESTIONS_BY_ID[questionId];
    if (!question || question.pool !== "station") return null;
    const station = getStation(question.stationId);
    const attempt = profile.attempts[question.stationId];
    if (!station || !attempt || attempt.currentQuestionId !== questionId || attempt.answeredQuestionIds.includes(questionId)) return null;
    const correct = answer === question.answer;
    const alreadyCorrect = profile.correctQuestionIds.includes(questionId);
    const nextCorrectIds = correct && !alreadyCorrect ? [...profile.correctQuestionIds, questionId] : profile.correctQuestionIds;
    const nextAnswered = [...attempt.answeredQuestionIds, questionId];
    const nextQuestionId = attempt.questionIds.find((id) => !nextAnswered.includes(id)) ?? null;
    const nextCorrectCount = Object.values(QUESTIONS_BY_ID).filter((candidate) => candidate.stationId === station.id && candidate.pool === "station" && nextCorrectIds.includes(candidate.id)).length;
    const masteredNow = nextCorrectCount >= station.masteryTarget;
    const nextAnswerStreak = correct ? profile.answerStreak + 1 : 0;
    const streakMilestone = correct && nextAnswerStreak % 5 === 0 ? { streak: nextAnswerStreak, bonusGold: FIVE_CORRECT_STREAK_GOLD } : undefined;
    updateProfile(profile.id, (current) => {
      const currentAttempt = current.attempts[question.stationId];
      if (!currentAttempt || currentAttempt.answeredQuestionIds.includes(questionId)) return current;
      const updatedAttempt: StationAttempt = { ...currentAttempt, answeredQuestionIds: [...currentAttempt.answeredQuestionIds, questionId], currentQuestionId: nextQuestionId, completedAt: nextQuestionId ? undefined : new Date().toISOString() };
      const collected = masteredNow && !current.collectedGuardianIds.includes(station.guardianId) ? [...current.collectedGuardianIds, station.guardianId] : current.collectedGuardianIds;
      const completed = masteredNow && !current.completedStationIds.includes(station.id) ? [...current.completedStationIds, station.id] : current.completedStationIds;
      const team = masteredNow && !current.teamGuardianIds.includes(station.guardianId) && current.teamGuardianIds.length < 3 ? [...current.teamGuardianIds, station.guardianId] : current.teamGuardianIds;
      const recaptured = masteredNow && current.guardianLosses.includes(station.guardianId);
      const today = localDate();
      const streak = current.lastStudyDate === today ? current.streak : isConsecutiveStudyDay(current.lastStudyDate, today) ? current.streak + 1 : 1;
      const answerStreak = correct ? current.answerStreak + 1 : 0;
      const streakBonus = correct && answerStreak % 5 === 0 ? FIVE_CORRECT_STREAK_GOLD : 0;
      const goldEarned = correct ? GOLD_BY_DIFFICULTY[question.difficulty] + streakBonus : 1;
      return {
        ...current,
        xp: current.xp + (correct && !alreadyCorrect ? ({ E: 25, M: 35, H: 50 } as Record<Difficulty, number>)[question.difficulty] : 0),
        gold: current.gold + goldEarned,
        answerStreak,
        streak,
        lastStudyDate: today,
        correctQuestionIds: correct && !alreadyCorrect ? [...current.correctQuestionIds, questionId] : current.correctQuestionIds,
        incorrectQuestionIds: !correct && !current.incorrectQuestionIds.includes(questionId) ? [...current.incorrectQuestionIds, questionId] : current.incorrectQuestionIds,
        completedStationIds: completed,
        collectedGuardianIds: collected,
        teamGuardianIds: team,
        guardianLosses: recaptured ? current.guardianLosses.filter((id) => id !== station.guardianId) : current.guardianLosses,
        guardianHealth: recaptured ? { ...current.guardianHealth, [station.guardianId]: { hp: GUARDIAN_MAX_HP, updatedAt: new Date().toISOString() } } : current.guardianHealth,
        attempts: { ...current.attempts, [question.stationId]: updatedAttempt },
        metrics: { ...current.metrics, totalAnswers: current.metrics.totalAnswers + 1, correctAnswers: current.metrics.correctAnswers + (correct ? 1 : 0), lastActiveAt: new Date().toISOString() },
      };
    });
    return { correct, stationMastered: masteredNow, nextQuestionId, streakMilestone };
  }, [profile, updateProfile]);

  const isMapUnlocked = useCallback((mapId: MapId) => mapId === 1 || Boolean(profile?.map1BossDefeated), [profile?.map1BossDefeated]);
  const map1ReadyStations = useMemo(() => getMapStations(1).filter((station) => station.status === "ready"), []);
  const isMap1BossUnlocked = Boolean(profile && map1ReadyStations.length > 0 && map1ReadyStations.every((station) => profile.completedStationIds.includes(station.id)));
  const isBossUnlocked = Boolean(profile && profile.collectedGuardianIds.filter((id) => id !== "atlas").length >= 2);
  const startBattle = useCallback((guardianId: string) => {
    if (!profile || !isBossUnlocked) return false;
    if (!profile.teamGuardianIds.includes(guardianId) || !profile.collectedGuardianIds.includes(guardianId)) return false;
    const health = effectiveGuardianHealth(profile.guardianHealth[guardianId]);
    if (health.hp <= 0) return false;
    const unseen = BOSS_QUESTION_IDS.filter((id) => !profile.bossQuestionHistory.includes(id));
    if (unseen.length < 5) return false;
    const questionIds = shuffle(unseen).slice(0, 5);
    updateProfile(profile.id, (current) => ({ ...current, guardianHealth: { ...current.guardianHealth, [guardianId]: health }, battle: { mode: "atlas", status: "active", questionIds, questionIndex: 0, playerHp: health.hp, bossHp: 150, guardianId, startedAt: new Date().toISOString() }, bossQuestionHistory: [...current.bossQuestionHistory, ...questionIds], metrics: { ...current.metrics, bossRuns: current.metrics.bossRuns + 1 } }));
    return true;
  }, [profile, isBossUnlocked, updateProfile]);
  const startMap1BossBattle = useCallback((guardianId: string) => {
    if (!profile || !isMap1BossUnlocked || profile.map1BossDefeated) return false;
    if (!profile.teamGuardianIds.includes(guardianId) || !profile.collectedGuardianIds.includes(guardianId)) return false;
    const health = effectiveGuardianHealth(profile.guardianHealth[guardianId]);
    if (health.hp <= 0) return false;
    const unseen = MAP1_BOSS_QUESTION_IDS.filter((id) => !profile.map1BossQuestionHistory.includes(id));
    const pool = unseen.length >= 10 ? unseen : MAP1_BOSS_QUESTION_IDS;
    if (pool.length < 10) return false;
    const questionIds = shuffle(pool).slice(0, 10);
    updateProfile(profile.id, (current) => ({
      ...current,
      guardianHealth: { ...current.guardianHealth, [guardianId]: health },
      battle: { mode: "map1-boss", status: "active", questionIds, questionIndex: 0, playerHp: health.hp, bossHp: 260, guardianId, startedAt: new Date().toISOString() },
      map1BossQuestionHistory: Array.from(new Set([...current.map1BossQuestionHistory, ...questionIds])),
      metrics: { ...current.metrics, bossRuns: current.metrics.bossRuns + 1 },
    }));
    return true;
  }, [profile, isMap1BossUnlocked, updateProfile]);
  const canTrainPets = Boolean(profile?.collectedGuardianIds.length);
  const guardianTrainingLevel = useCallback((guardianId: string) => Math.floor((profile?.guardianTrainingXp[guardianId] ?? 0) / 100) + 1, [profile?.guardianTrainingXp]);
  const startTrainingBattle = useCallback((guardianId: string, opponentGuardianId: string, difficulty: TrainingDifficultyId) => {
    if (!profile || !profile.collectedGuardianIds.includes(guardianId)) return false;
    const unlockedQuestionPool = Object.values(QUESTIONS_BY_ID).filter((question) => profile.unlockedStationIds.includes(question.stationId) && question.pool === "station");
    if (!unlockedQuestionPool.length) return false;
    const opponent = GUARDIANS.find((guardian) => guardian.id === opponentGuardianId && guardian.id !== guardianId && guardian.id !== "atlas");
    if (!opponent) return false;
    const rule = getTrainingDifficulty(difficulty);
    const difficultyPool = unlockedQuestionPool.filter((question) => rule.allowedDifficulties.includes(question.difficulty));
    const unseen = difficultyPool.filter((question) => !profile.trainingQuestionHistory.includes(question.id));
    const pool = unseen.length >= rule.questionCount ? unseen : difficultyPool;
    const questionIds = shuffle(pool).slice(0, Math.min(rule.questionCount, pool.length)).map((question) => question.id);
    if (questionIds.length < 1) return false;
    updateProfile(profile.id, (current) => ({
      ...current,
      battle: { mode: "training", status: "active", questionIds, questionIndex: 0, playerHp: rule.playerHp, bossHp: rule.opponentHp, guardianId, opponentGuardianId: opponent.id, trainingDifficulty: difficulty, startedAt: new Date().toISOString() },
      trainingQuestionHistory: Array.from(new Set([...current.trainingQuestionHistory, ...questionIds])).slice(-120),
    }));
    return true;
  }, [profile, updateProfile]);
  const resolveBattleAnswer = useCallback((answer: number, spellId: string): BattleAnswerResult | null => {
    if (!profile || profile.battle.status !== "active") return null;
    const questionId = profile.battle.questionIds[profile.battle.questionIndex];
    const question = QUESTIONS_BY_ID[questionId];
    if (!question) return null;
    const selectedSpell = SPELLS.find((item) => item.id === spellId) ?? SPELLS[0];
    const magicElement = selectedSpell.element.toLocaleLowerCase("vi-VN") as ElementName;
    const isMap1Boss = profile.battle.mode === "map1-boss";
    const isTraining = profile.battle.mode === "training";
    const trainingRule = isTraining ? getTrainingDifficulty(profile.battle.trainingDifficulty) : null;
    const correct = answer === question.answer;
    const preBattleTrainingXp = profile.guardianTrainingXp[profile.battle.guardianId ?? profile.teamGuardianIds[0] ?? ""] ?? 0;
    const trainingTechnique = getTrainingTechnique(Math.floor(preBattleTrainingXp / 100) + 1);
    const bossDamage = correct ? Math.round((selectedSpell.damage + (isTraining ? trainingTechnique.bonusDamage : 0)) * (trainingRule?.playerDamageMultiplier ?? 1)) : 0;
    const playerDamage = Math.round((correct ? selectedSpell.counterDamage : 34) * (trainingRule?.opponentDamageMultiplier ?? 1));
    const bossHp = Math.max(0, profile.battle.bossHp - bossDamage);
    const guardianId = profile.battle.guardianId ?? profile.teamGuardianIds[0];
    if (!guardianId) return null;
    const currentGuardianHealth = effectiveGuardianHealth(profile.guardianHealth[guardianId]);
    const startingPlayerHp = isTraining ? profile.battle.playerHp : currentGuardianHealth.hp;
    const playerHp = Math.max(0, startingPlayerHp - playerDamage);
    const ended = bossHp === 0 || playerHp === 0;
    const currentQuest = profile.weeklyMagicQuest.week === weekKey() ? profile.weeklyMagicQuest : getWeeklyMagicQuest();
    const nextUsedCount = magicElement === currentQuest.element ? Math.min(currentQuest.target, currentQuest.usedCount + 1) : currentQuest.usedCount;
    const questJustCompleted = nextUsedCount >= currentQuest.target && !currentQuest.rewardClaimed;
    const questReward = questJustCompleted ? currentQuest.rewardXp : 0;
    const elementGain = (correct ? 18 : 5) + (magicElement === currentQuest.element ? questReward : 0);
    const previousElementXp = profile.elementXp[magicElement] ?? 0;
    const previousLevel = Math.floor(previousElementXp / ELEMENT_XP_PER_LEVEL) + 1;
    const totalElementXp = previousElementXp + elementGain;
    const nextElementLevel = Math.floor(totalElementXp / ELEMENT_XP_PER_LEVEL) + 1;
    const levelUp = nextElementLevel > previousLevel ? { element: magicElement, previousLevel, nextLevel: nextElementLevel, totalXp: totalElementXp } : undefined;
    const trainingGain = isTraining ? (correct ? trainingRule?.xpCorrect ?? 20 : trainingRule?.xpIncorrect ?? 5) : 0;
    const previousTrainingXp = profile.guardianTrainingXp[guardianId] ?? 0;
    const previousTrainingLevel = Math.floor(previousTrainingXp / 100) + 1;
    const totalTrainingXp = previousTrainingXp + trainingGain;
    const nextTrainingLevel = Math.floor(totalTrainingXp / 100) + 1;
    const trainingLevelUp = isTraining && nextTrainingLevel > previousTrainingLevel ? { guardianId, previousLevel: previousTrainingLevel, nextLevel: nextTrainingLevel, totalXp: totalTrainingXp } : undefined;
    const nextAnswerStreak = correct ? profile.answerStreak + 1 : 0;
    const streakMilestone = correct && nextAnswerStreak % 5 === 0 ? { streak: nextAnswerStreak, bonusGold: isTraining ? 0 : FIVE_CORRECT_STREAK_GOLD } : undefined;
    updateProfile(profile.id, (current) => {
      const guardianStation = STATIONS.find((station) => station.guardianId === guardianId);
      const guardianLost = !isTraining && playerHp === 0;
      const nextAttempts = { ...current.attempts };
      if (guardianLost && guardianStation) delete nextAttempts[guardianStation.id];
      const removedQuestionIds = guardianLost && guardianStation ? guardianStation.questionIds : [];
      const answerStreak = correct ? current.answerStreak + 1 : 0;
      const streakBonus = !isTraining && correct && answerStreak % 5 === 0 ? FIVE_CORRECT_STREAK_GOLD : 0;
      const earnedGold = isTraining ? 0 : (correct ? GOLD_BY_DIFFICULTY[question.difficulty] + streakBonus : 1);
      return {
        ...current,
        battle: { ...current.battle, bossHp, playerHp, status: bossHp === 0 ? "victory" : playerHp === 0 ? "defeat" : "active", lastResult: { correct, bossDamage, playerDamage, spellId } },
        xp: current.xp + (isTraining ? trainingGain : (correct ? 30 : 0) + questReward),
        gold: current.gold + earnedGold,
        answerStreak,
        guardianTrainingXp: isTraining ? { ...current.guardianTrainingXp, [guardianId]: (current.guardianTrainingXp[guardianId] ?? 0) + trainingGain } : current.guardianTrainingXp,
        magicUsage: { ...current.magicUsage, [magicElement]: (current.magicUsage[magicElement] ?? 0) + 1 },
        elementXp: { ...current.elementXp, [magicElement]: (current.elementXp[magicElement] ?? 0) + elementGain },
        weeklyMagicQuest: { ...currentQuest, usedCount: nextUsedCount, rewardClaimed: currentQuest.rewardClaimed || questJustCompleted, completedAt: questJustCompleted ? new Date().toISOString() : currentQuest.completedAt },
        metrics: { ...current.metrics, totalAnswers: current.metrics.totalAnswers + 1, correctAnswers: current.metrics.correctAnswers + (correct ? 1 : 0), bossWins: current.metrics.bossWins + (bossHp === 0 ? 1 : 0), lastActiveAt: new Date().toISOString() },
        map1BossDefeated: current.map1BossDefeated || (isMap1Boss && bossHp === 0),
        collectedGuardianIds: guardianLost ? current.collectedGuardianIds.filter((id) => id !== guardianId) : !isMap1Boss && bossHp === 0 && !current.collectedGuardianIds.includes("atlas") ? [...current.collectedGuardianIds, "atlas"] : current.collectedGuardianIds,
        teamGuardianIds: guardianLost ? current.teamGuardianIds.filter((id) => id !== guardianId) : current.teamGuardianIds,
        guardianHealth: isTraining ? current.guardianHealth : guardianLost ? Object.fromEntries(Object.entries(current.guardianHealth).filter(([id]) => id !== guardianId)) : { ...current.guardianHealth, [guardianId]: { hp: playerHp, updatedAt: new Date().toISOString() } },
        guardianLosses: guardianLost && !current.guardianLosses.includes(guardianId) ? [...current.guardianLosses, guardianId] : current.guardianLosses,
        correctQuestionIds: guardianLost ? current.correctQuestionIds.filter((id) => !removedQuestionIds.includes(id)) : current.correctQuestionIds,
        incorrectQuestionIds: guardianLost ? current.incorrectQuestionIds.filter((id) => !removedQuestionIds.includes(id)) : current.incorrectQuestionIds,
        completedStationIds: guardianLost && guardianStation ? current.completedStationIds.filter((id) => id !== guardianStation.id) : current.completedStationIds,
        attempts: nextAttempts,
      };
    });
    return { correct, playerDamage, bossDamage, ended, levelUp, trainingLevelUp, streakMilestone };
  }, [profile, updateProfile]);
  const advanceBattle = useCallback(() => {
    if (!profile || profile.battle.status !== "active") return;
    const nextIndex = profile.battle.questionIndex + 1;
    updateProfile(profile.id, (current) => ({ ...current, battle: nextIndex >= current.battle.questionIds.length ? { ...current.battle, status: "defeat" } : { ...current.battle, questionIndex: nextIndex, lastResult: undefined } }));
  }, [profile, updateProfile]);
  const markMagicVideoWatched = useCallback((element: ElementName) => {
    if (!profile || !profile.collectedGuardianIds.some((guardianId) => getGuardian(guardianId)?.element === element)) return;
    updateProfile(profile.id, (current) => current.magicBookWatchedElements.includes(element) ? current : { ...current, magicBookWatchedElements: [...current.magicBookWatchedElements, element] });
  }, [profile, updateProfile]);
  const toggleTeamGuardian = useCallback((guardianId: string) => {
    if (!profile || !profile.collectedGuardianIds.includes(guardianId) || guardianId === "atlas") return;
    updateProfile(profile.id, (current) => {
      const selected = current.teamGuardianIds.includes(guardianId);
      if (!selected && current.teamGuardianIds.length >= 3) return current;
      return { ...current, teamGuardianIds: selected ? current.teamGuardianIds.filter((id) => id !== guardianId) : [...current.teamGuardianIds, guardianId] };
    });
  }, [profile, updateProfile]);
  const guardianHp = useCallback((guardianId: string) => {
    if (!profile?.collectedGuardianIds.includes(guardianId)) return 0;
    return effectiveGuardianHealth(profile.guardianHealth[guardianId]).hp;
  }, [profile]);
  const purchaseItem = useCallback((itemId: ShopItem["id"]) => {
    if (!profile) return { ok: false, message: "Hãy vào một hồ sơ trước khi ghé Shop." };
    const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
    if (!item) return { ok: false, message: "Vật phẩm này chưa có trong sổ hàng." };
    if (item.kind === "cosmetic" && profile.inventory[itemId] > 0) return { ok: false, message: `${item.label} đã có trong Kho đồ; em chỉ cần trang bị.` };
    if (profile.gold < item.price) return { ok: false, message: `Cần thêm ${item.price - profile.gold} Gold để mua ${item.label}.` };
    const inventoryAfterPurchase = { ...profile.inventory, [itemId]: profile.inventory[itemId] + 1 };
    const setReward = item.kind === "cosmetic" ? COMPANION_COSMETIC_SETS.find((set) => !profile.setRewardsClaimed.includes(set.id) && set.itemIds.every((setItemId) => inventoryAfterPurchase[setItemId] > 0)) : undefined;
    updateProfile(profile.id, (current) => {
      const nextInventory = { ...current.inventory, [itemId]: current.inventory[itemId] + 1 };
      const completedSets = item.kind === "cosmetic" ? COMPANION_COSMETIC_SETS.filter((set) => !current.setRewardsClaimed.includes(set.id) && set.itemIds.every((setItemId) => nextInventory[setItemId] > 0)) : [];
      const bonusGold = completedSets.reduce((total, set) => total + set.bonusGold, 0);
      const bonusXp = completedSets.reduce((total, set) => total + set.bonusXp, 0);
      return { ...current, gold: current.gold - item.price + bonusGold, xp: current.xp + bonusXp, inventory: nextInventory, setRewardsClaimed: [...current.setRewardsClaimed, ...completedSets.map((set) => set.id)] };
    });
    return setReward
      ? { ok: true, message: `Đã hoàn tất ${setReward.label}: nhận thêm ${setReward.bonusGold} Gold và ${setReward.bonusXp} XP!`, setReward }
      : { ok: true, message: `Đã thêm ${item.label} vào Kho đồ.` };
  }, [profile, updateProfile]);
  const useHealingItem = useCallback((itemId: ShopItem["id"], guardianId: string) => {
    if (!profile) return { ok: false, message: "Hãy vào một hồ sơ trước khi dùng vật phẩm." };
    if (profile.battle.status === "active") return { ok: false, message: "Không thể dùng bình hồi phục trong lúc Atlas đang phản công." };
    if (!profile.collectedGuardianIds.includes(guardianId)) return { ok: false, message: "Guardian này chưa có trong Bộ sưu tập." };
    const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
    if (!item || item.kind !== "healing" || typeof item.heal !== "number" || !profile.inventory[itemId]) return { ok: false, message: "Kho đồ chưa có bình hồi phục này." };
    const healAmount = item.heal;
    const health = effectiveGuardianHealth(profile.guardianHealth[guardianId]);
    if (health.hp >= GUARDIAN_MAX_HP) return { ok: false, message: "Guardian này đã đầy sinh lực." };
    updateProfile(profile.id, (current) => ({ ...current, inventory: { ...current.inventory, [itemId]: Math.max(0, current.inventory[itemId] - 1) }, guardianHealth: { ...current.guardianHealth, [guardianId]: { hp: Math.min(GUARDIAN_MAX_HP, health.hp + healAmount), updatedAt: new Date().toISOString() } } }));
    return { ok: true, message: `${item.label} đã hồi sinh lực cho guardian.` };
  }, [profile, updateProfile]);
  const equipCosmetic = useCallback((itemId: ShopItem["id"]) => {
    if (!profile) return { ok: false, message: "Hãy vào một hồ sơ trước khi trang bị." };
    const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
    if (!item || item.kind !== "cosmetic" || !item.slot) return { ok: false, message: "Vật phẩm này không phải trang phục hoặc trang trí." };
    if (!profile.inventory[itemId]) return { ok: false, message: "Em cần mua vật phẩm này trước khi trang bị." };
    updateProfile(profile.id, (current) => ({ ...current, equippedCosmetics: { ...current.equippedCosmetics, [item.slot!]: current.equippedCosmetics[item.slot!] === itemId ? undefined : itemId } }));
    return { ok: true, message: profile.equippedCosmetics[item.slot] === itemId ? `Đã cất ${item.label} vào Kho đồ.` : `Đã trang bị ${item.label}.` };
  }, [profile, updateProfile]);
  const setStudyDays = useCallback((days: number[]) => {
    if (!profile) return;
    updateProfile(profile.id, (current) => ({ ...current, studyDays: normalizeStudyDays(days) }));
  }, [profile, updateProfile]);
  const resetActiveProfile = useCallback(() => { if (profile) updateProfile(profile.id, (current) => createProfileRecord(current.name, current.avatar)); }, [profile, updateProfile]);

  const level = Math.floor((profile?.xp ?? 0) / 250) + 1;
  const levelProgress = (profile?.xp ?? 0) % 250;
  const magicBookWatchedCount = profile?.magicBookWatchedElements.length ?? 0;
  const hasMagicBookAchievement = magicBookWatchedCount === ELEMENT_ORDER.length;
  const mostUsedMagicElement = useMemo<ElementName | null>(() => {
    if (!profile) return null;
    return ELEMENT_ORDER.reduce<ElementName | null>((leader, element) => (profile.magicUsage[element] ?? 0) > (leader ? profile.magicUsage[leader] ?? 0 : 0) ? element : leader, null);
  }, [profile]);
  const weeklyMagicQuest = useMemo(() => profile ? (profile.weeklyMagicQuest.week === weekKey() ? profile.weeklyMagicQuest : getWeeklyMagicQuest()) : null, [profile]);
  const studyReminder = useMemo<StudyReminder | null>(() => {
    if (!profile) return null;
    const scheduledDays = profile.studyDays;
    if (!scheduledDays.length) return { state: "rest", label: "Chưa chọn ngày học. Hãy đánh dấu các ngày phù hợp trong Lịch học.", scheduledDays };
    const today = new Date().getDay();
    if (scheduledDays.includes(today) && profile.lastStudyDate !== localDate()) return { state: "today", label: "Hôm nay có hẹn với Sổ Hành Trình — làm ít nhất một câu để giữ chuỗi học.", scheduledDays };
    const nextOffset = Array.from({ length: 7 }, (_, index) => index + 1).find((offset) => scheduledDays.includes((today + offset) % 7));
    return { state: "tomorrow", label: nextOffset ? `Phiên học kế tiếp: ${VIETNAMESE_DAYS[(today + nextOffset) % 7]}. Chuẩn bị Gold và guardian nhé.` : "Hãy chọn một ngày học trong tuần.", scheduledDays };
  }, [profile]);
  const requestStudyNotifications = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return { ok: false, message: "Trình duyệt này chưa hỗ trợ thông báo." };
    const permission = await window.Notification.requestPermission();
    return permission === "granted" ? { ok: true, message: "Đã cho phép nhắc học khi Math4Fun đang mở." } : { ok: false, message: "Chưa được cấp quyền thông báo. Nhắc học vẫn hiện trong game." };
  }, []);
  const elementLevel = useCallback((element: ElementName) => Math.floor((profile?.elementXp[element] ?? 0) / ELEMENT_XP_PER_LEVEL) + 1, [profile]);
  const createProfileBackup = useCallback(() => profile ? JSON.stringify({ format: "math4fun-profile-backup", version: 1, exportedAt: new Date().toISOString(), profile }, null, 2) : null, [profile]);
  const saveParentPin = useCallback(async (pin: string, securityQuestion: string, securityAnswer: string) => {
    if (!isParentPin(pin)) return { ok: false as const, message: "PIN cần gồm 4–8 chữ số." };
    if (securityQuestion.trim().length < 5 || securityAnswer.trim().length < 2) return { ok: false as const, message: "Hãy ghi câu hỏi bảo mật và câu trả lời dễ nhớ cho phụ huynh." };
    if (typeof window === "undefined" || !window.crypto?.subtle) return { ok: false as const, message: "Trình duyệt này chưa hỗ trợ tạo PIN an toàn." };
    const salt = createParentPinSalt();
    const answerSalt = createParentPinSalt();
    const [hash, answerHash] = await Promise.all([hashParentPin(pin, salt), hashParentPin(normalizeSecurityAnswer(securityAnswer), answerSalt)]);
    if (!hash || !answerHash) return { ok: false as const, message: "Không thể tạo PIN trên trình duyệt này." };
    const parentPin: ParentPinRecord = { salt, hash, answerSalt, answerHash, securityQuestion: securityQuestion.trim(), createdAt: new Date().toISOString() };
    parentPinRef.current = parentPin;
    setStore((previous) => ({ ...previous, parentPin }));
    return { ok: true as const, message: "Đã lưu PIN và câu hỏi bảo mật trên thiết bị này." };
  }, []);
  const hasParentPin = Boolean(store.parentPin);
  const parentSecurityQuestion = store.parentPin?.securityQuestion ?? null;
  const setParentPin = useCallback(async (pin: string, securityQuestion: string, securityAnswer: string) => {
    if (parentPinRef.current) return { ok: false, message: "PIN đã tồn tại. Hãy dùng mục Đổi PIN." };
    return saveParentPin(pin, securityQuestion, securityAnswer);
  }, [saveParentPin]);
  const changeParentPin = useCallback(async (currentPin: string, nextPin: string, securityQuestion: string, securityAnswer: string) => {
    const savedPin = parentPinRef.current;
    if (!savedPin) return { ok: false, message: "Chưa có PIN phụ huynh để thay đổi." };
    const enteredHash = await hashParentPin(currentPin, savedPin.salt);
    if (!enteredHash || enteredHash !== savedPin.hash) return { ok: false, message: "PIN hiện tại chưa chính xác." };
    return saveParentPin(nextPin, securityQuestion, securityAnswer);
  }, [saveParentPin]);
  const resetParentPin = useCallback(async (securityAnswer: string, nextPin: string) => {
    const savedPin = parentPinRef.current;
    if (!savedPin?.answerSalt || !savedPin.answerHash) return { ok: false, message: "PIN cũ chưa có câu hỏi bảo mật; hãy phụ huynh thiết lập lại trực tiếp trên thiết bị này." };
    const answerHash = await hashParentPin(normalizeSecurityAnswer(securityAnswer), savedPin.answerSalt);
    if (!answerHash || answerHash !== savedPin.answerHash) return { ok: false, message: "Câu trả lời bảo mật chưa chính xác." };
    return saveParentPin(nextPin, savedPin.securityQuestion ?? "Câu hỏi bảo mật", securityAnswer);
  }, [saveParentPin]);
  const restoreProfileBackup = useCallback(async (raw: string, pin: string) => {
    if (raw.length > 500_000) return { ok: false, message: "Tệp sao lưu quá lớn để khôi phục an toàn." };
    const savedPin = parentPinRef.current;
    if (!savedPin) return { ok: false, message: "Phụ huynh cần thiết lập PIN trước khi khôi phục hồ sơ." };
    const enteredHash = await hashParentPin(pin, savedPin.salt);
    if (!enteredHash || enteredHash !== savedPin.hash) return { ok: false, message: "PIN phụ huynh chưa chính xác. Hồ sơ chưa được thay đổi." };
    try {
      const parsed = JSON.parse(raw) as { format?: string; profile?: Partial<StudentProfile> };
      if (parsed.format !== "math4fun-profile-backup" || !parsed.profile || typeof parsed.profile.name !== "string") return { ok: false, message: "Đây không phải tệp sao lưu Math4Fun hợp lệ." };
      const restored = hydrateProfile(parsed.profile, `student-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
      setStore((previous) => ({ ...previous, profiles: [...previous.profiles, restored], activeProfileId: restored.id }));
      return { ok: true, message: `Đã khôi phục hồ sơ ${restored.name}.` };
    } catch {
      return { ok: false, message: "Không thể đọc tệp JSON. Vui lòng chọn tệp sao lưu chưa bị chỉnh sửa." };
    }
  }, []);
  const elementBadges = useMemo(() => profile ? ELEMENT_ORDER.filter((element) => (profile.elementXp[element] ?? 0) >= ELEMENT_XP_PER_LEVEL * 2) : [], [profile]);
  const learningBadges = useMemo<LearningBadgeId[]>(() => {
    if (!profile) return [];
    const badges: LearningBadgeId[] = [];
    if (profile.streak >= 7) badges.push("streak-7");
    if (profile.streak >= 14) badges.push("streak-14");
    return badges;
  }, [profile]);
  const leaderboard = useMemo<LeaderboardEntry[]>(() => store.profiles.map((entry) => {
    const elementCount = ELEMENT_ORDER.filter((element) => (entry.elementXp[element] ?? 0) >= ELEMENT_XP_PER_LEVEL * 2).length;
    const streakBadgeCount = entry.streak >= 14 ? 2 : entry.streak >= 7 ? 1 : 0;
    const score = entry.xp + entry.completedStationIds.length * 250 + entry.collectedGuardianIds.length * 175 + elementCount * 300 + streakBadgeCount * 200;
    return { profileId: entry.id, name: entry.name, avatar: entry.avatar, score, level: Math.floor(entry.xp / 250) + 1, badges: elementCount + streakBadgeCount, guardians: entry.collectedGuardianIds.length, stations: entry.completedStationIds.length, streak: entry.streak };
  }).sort((left, right) => right.score - left.score || right.level - left.level || left.name.localeCompare(right.name, "vi")), [store.profiles]);
  const value = useMemo<GameContextValue>(() => ({
    profile,
    profiles: store.profiles,
    hasProfile: Boolean(profile),
    audioEnabled: store.audioEnabled,
    siteVisitCount: store.siteVisitCount,
    lastSiteVisitAt: store.lastSiteVisitAt,
    level,
    levelProgress,
    weeklyOpenCount,
    createProfile,
    signIn,
    setLegacyProfilePassword,
    selectProfile,
    leaderboard,
    learningBadges,
    unlockStationForWeek,
    isStationUnlocked,
    isStationMastered,
    stationProgress,
    getStationAttempt,
    startStationSession,
    answerStationQuestion,
    isBossUnlocked,
    startBattle,
    isMapUnlocked,
    isMap1BossUnlocked,
    startMap1BossBattle,
    canTrainPets,
    startTrainingBattle,
    guardianTrainingLevel,
    resolveBattleAnswer,
    advanceBattle,
    markMagicVideoWatched,
    magicBookWatchedCount,
    hasMagicBookAchievement,
    mostUsedMagicElement,
    elementXp: profile?.elementXp ?? {},
    elementLevel,
    weeklyMagicQuest,
    createProfileBackup,
    hasParentPin,
    parentSecurityQuestion,
    setParentPin,
    changeParentPin,
    resetParentPin,
    restoreProfileBackup,
    toggleTeamGuardian,
    exitGame,
    gold: profile?.gold ?? 0,
    inventory: profile?.inventory ?? emptyInventory(),
    elementBadges,
    guardianHp,
    purchaseItem,
    useHealingItem,
    equippedCosmetics: profile?.equippedCosmetics ?? {},
    equipCosmetic,
    studyDays: profile?.studyDays ?? DEFAULT_STUDY_DAYS,
    studyReminder,
    setStudyDays,
    requestStudyNotifications,
    setAudioEnabled,
    resetActiveProfile,
  }), [profile, store.profiles, store.audioEnabled, store.siteVisitCount, store.lastSiteVisitAt, level, levelProgress, weeklyOpenCount, createProfile, signIn, setLegacyProfilePassword, selectProfile, leaderboard, learningBadges, unlockStationForWeek, isStationUnlocked, isStationMastered, stationProgress, getStationAttempt, startStationSession, answerStationQuestion, isBossUnlocked, startBattle, isMapUnlocked, isMap1BossUnlocked, startMap1BossBattle, canTrainPets, startTrainingBattle, guardianTrainingLevel, resolveBattleAnswer, advanceBattle, markMagicVideoWatched, magicBookWatchedCount, hasMagicBookAchievement, mostUsedMagicElement, elementLevel, weeklyMagicQuest, studyReminder, createProfileBackup, hasParentPin, parentSecurityQuestion, setParentPin, changeParentPin, resetParentPin, restoreProfileBackup, toggleTeamGuardian, exitGame, elementBadges, guardianHp, purchaseItem, useHealingItem, equipCosmetic, setStudyDays, requestStudyNotifications, setAudioEnabled, resetActiveProfile]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
}
