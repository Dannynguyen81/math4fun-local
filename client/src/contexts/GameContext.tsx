/**
 * Math4Fun local state — Field Journal Quest keeps learning evidence across navigation.
 * Gameplay rules live here, never in a page: mastery needs 10 distinct correct answers,
 * Boss runs use a non-repeating hard-question pool, and magic progression stays local-only.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BOSS_QUESTION_IDS, Difficulty, ELEMENT_ORDER, ELEMENT_XP_PER_LEVEL, ElementName, getGuardian, getStation, QUESTIONS_BY_ID, SPELLS, STATIONS, WEEKLY_MAGIC_QUESTS, type WeeklyMagicQuestDefinition } from "@/game/gameData";

export type AvatarId = "compass" | "ember" | "tide" | "leaf";
export type StudentProfile = {
  id: string;
  name: string;
  avatar: AvatarId;
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
  status: "idle" | "active" | "victory" | "defeat";
  questionIds: string[];
  questionIndex: number;
  playerHp: number;
  bossHp: number;
  lastResult?: { correct: boolean; playerDamage: number; bossDamage: number; spellId: string };
  startedAt?: string;
};

export type LearningMetrics = {
  totalAnswers: number;
  correctAnswers: number;
  stationSessions: number;
  bossRuns: number;
  bossWins: number;
  lastActiveAt?: string;
};

export type ElementLevelUp = { element: ElementName; previousLevel: number; nextLevel: number; totalXp: number };
type ParentPinRecord = { salt: string; hash: string; createdAt: string };
type GameStore = { version: 5; profiles: StudentProfile[]; activeProfileId: string | null; audioEnabled: boolean; siteVisitCount: number; lastSiteVisitAt?: string; parentPin?: ParentPinRecord };
export type StationProgress = { correct: number; answered: number; target: number; total: number; accuracy: number };
export type AnswerResult = { correct: boolean; stationMastered: boolean; nextQuestionId: string | null };
export type BattleAnswerResult = { correct: boolean; playerDamage: number; bossDamage: number; ended: boolean; levelUp?: ElementLevelUp };

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
  createProfile: (name: string, avatar: AvatarId) => void;
  selectProfile: (profileId: string) => void;
  unlockStationForWeek: (stationId: number) => boolean;
  isStationUnlocked: (stationId: number) => boolean;
  isStationMastered: (stationId: number) => boolean;
  stationProgress: (stationId: number) => StationProgress;
  getStationAttempt: (stationId: number) => StationAttempt | null;
  startStationSession: (stationId: number) => StationAttempt | null;
  answerStationQuestion: (questionId: string, answer: number) => AnswerResult | null;
  isBossUnlocked: boolean;
  startBattle: () => boolean;
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
  setParentPin: (pin: string) => Promise<{ ok: boolean; message: string }>;
  restoreProfileBackup: (raw: string, pin: string) => Promise<{ ok: boolean; message: string }>;
  toggleTeamGuardian: (guardianId: string) => void;
  setAudioEnabled: (enabled: boolean) => void;
  resetActiveProfile: () => void;
};

// Giữ khóa v3 để tự động nâng mọi hồ sơ đã lưu, không làm mất hành trình đang có.
const STORAGE_KEY = "math4fun-field-journal-v3";
const emptyBattle = (): BattleState => ({ status: "idle", questionIds: [], questionIndex: 0, playerHp: 100, bossHp: 150 });
const emptyMetrics = (): LearningMetrics => ({ totalAnswers: 0, correctAnswers: 0, stationSessions: 0, bossRuns: 0, bossWins: 0 });
const DEFAULT_STORE: GameStore = { version: 5, profiles: [], activeProfileId: null, audioEnabled: true, siteVisitCount: 0 };
const GameContext = createContext<GameContextValue | undefined>(undefined);

function localDate() { return new Date().toISOString().slice(0, 10); }
function isParentPin(pin: string) { return /^\d{4,8}$/.test(pin); }
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
function createProfileRecord(name: string, avatar: AvatarId): StudentProfile {
  return {
    id: `student-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim().slice(0, 22),
    avatar,
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
    metrics: emptyMetrics(),
  };
}
function hydrateProfile(candidate: Partial<StudentProfile>, forcedId?: string): StudentProfile {
  const avatar: AvatarId = ["compass", "ember", "tide", "leaf"].includes(candidate.avatar as AvatarId) ? candidate.avatar as AvatarId : "compass";
  const base = createProfileRecord(typeof candidate.name === "string" ? candidate.name : "Nhà thám hiểm", avatar);
  const currentQuest = getWeeklyMagicQuest();
  const storedQuest = candidate.weeklyMagicQuest;
  const validQuest = storedQuest && storedQuest.week === currentQuest.week && ELEMENT_ORDER.includes(storedQuest.element) ? storedQuest : currentQuest;
  return {
    ...base,
    ...candidate,
    id: forcedId ?? (typeof candidate.id === "string" ? candidate.id : base.id),
    avatar,
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
      version: 5,
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
  const createProfile = useCallback((name: string, avatar: AvatarId) => {
    const record = createProfileRecord(name || "Nhà thám hiểm", avatar);
    setStore((previous) => ({ ...previous, profiles: [...previous.profiles, record], activeProfileId: record.id }));
  }, []);
  const selectProfile = useCallback((profileId: string) => setStore((previous) => previous.profiles.some((entry) => entry.id === profileId) ? { ...previous, activeProfileId: profileId } : previous), []);
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
    const correct = station ? station.questionIds.filter((id) => profile?.correctQuestionIds.includes(id)).length : 0;
    const answered = attempt?.answeredQuestionIds.length ?? 0;
    const target = station?.masteryTarget ?? 10;
    return { correct, answered, target, total: station?.questionIds.length ?? 0, accuracy: answered ? Math.round((correct / answered) * 100) : 0 };
  }, [profile]);
  const getStationAttempt = useCallback((stationId: number) => profile?.attempts[stationId] ?? null, [profile]);
  const startStationSession = useCallback((stationId: number) => {
    if (!profile || !profile.unlockedStationIds.includes(stationId)) return null;
    const station = getStation(stationId);
    if (!station || station.status !== "ready") return null;
    const existing = profile.attempts[stationId];
    if (existing && !existing.completedAt) return existing;
    const pending = station.questionIds.filter((id) => !profile.correctQuestionIds.includes(id));
    if (!pending.length) return existing ?? null;
    const questionIds = shuffle(pending);
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
    const nextCorrectCount = station.questionIds.filter((id) => nextCorrectIds.includes(id)).length;
    const masteredNow = nextCorrectCount >= station.masteryTarget;
    updateProfile(profile.id, (current) => {
      const currentAttempt = current.attempts[question.stationId];
      if (!currentAttempt || currentAttempt.answeredQuestionIds.includes(questionId)) return current;
      const updatedAttempt: StationAttempt = { ...currentAttempt, answeredQuestionIds: [...currentAttempt.answeredQuestionIds, questionId], currentQuestionId: nextQuestionId, completedAt: nextQuestionId ? undefined : new Date().toISOString() };
      const collected = masteredNow && !current.collectedGuardianIds.includes(station.guardianId) ? [...current.collectedGuardianIds, station.guardianId] : current.collectedGuardianIds;
      const completed = masteredNow && !current.completedStationIds.includes(station.id) ? [...current.completedStationIds, station.id] : current.completedStationIds;
      const team = masteredNow && !current.teamGuardianIds.includes(station.guardianId) && current.teamGuardianIds.length < 3 ? [...current.teamGuardianIds, station.guardianId] : current.teamGuardianIds;
      const today = localDate();
      const streak = current.lastStudyDate === today ? current.streak : current.lastStudyDate ? current.streak + 1 : 1;
      return {
        ...current,
        xp: current.xp + (correct && !alreadyCorrect ? ({ E: 25, M: 35, H: 50 } as Record<Difficulty, number>)[question.difficulty] : 0),
        streak,
        lastStudyDate: today,
        correctQuestionIds: correct && !alreadyCorrect ? [...current.correctQuestionIds, questionId] : current.correctQuestionIds,
        incorrectQuestionIds: !correct && !current.incorrectQuestionIds.includes(questionId) ? [...current.incorrectQuestionIds, questionId] : current.incorrectQuestionIds,
        completedStationIds: completed,
        collectedGuardianIds: collected,
        teamGuardianIds: team,
        attempts: { ...current.attempts, [question.stationId]: updatedAttempt },
        metrics: { ...current.metrics, totalAnswers: current.metrics.totalAnswers + 1, correctAnswers: current.metrics.correctAnswers + (correct ? 1 : 0), lastActiveAt: new Date().toISOString() },
      };
    });
    return { correct, stationMastered: masteredNow, nextQuestionId };
  }, [profile, updateProfile]);

  const isBossUnlocked = Boolean(profile && profile.collectedGuardianIds.filter((id) => id !== "atlas").length >= 2);
  const startBattle = useCallback(() => {
    if (!profile || !isBossUnlocked) return false;
    const unseen = BOSS_QUESTION_IDS.filter((id) => !profile.bossQuestionHistory.includes(id));
    if (unseen.length < 5) return false;
    const questionIds = shuffle(unseen).slice(0, 5);
    updateProfile(profile.id, (current) => ({ ...current, battle: { status: "active", questionIds, questionIndex: 0, playerHp: 100, bossHp: 150, startedAt: new Date().toISOString() }, bossQuestionHistory: [...current.bossQuestionHistory, ...questionIds], metrics: { ...current.metrics, bossRuns: current.metrics.bossRuns + 1 } }));
    return true;
  }, [profile, isBossUnlocked, updateProfile]);
  const resolveBattleAnswer = useCallback((answer: number, spellId: string): BattleAnswerResult | null => {
    if (!profile || profile.battle.status !== "active") return null;
    const questionId = profile.battle.questionIds[profile.battle.questionIndex];
    const question = QUESTIONS_BY_ID[questionId];
    if (!question) return null;
    const selectedSpell = SPELLS.find((item) => item.id === spellId) ?? SPELLS[0];
    const magicElement = selectedSpell.element.toLocaleLowerCase("vi-VN") as ElementName;
    const correct = answer === question.answer;
    const bossDamage = correct ? selectedSpell.damage : 0;
    const playerDamage = correct ? selectedSpell.counterDamage : 34;
    const bossHp = Math.max(0, profile.battle.bossHp - bossDamage);
    const playerHp = Math.max(0, profile.battle.playerHp - playerDamage);
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
    updateProfile(profile.id, (current) => {
      return {
        ...current,
        battle: { ...current.battle, bossHp, playerHp, status: bossHp === 0 ? "victory" : playerHp === 0 ? "defeat" : "active", lastResult: { correct, bossDamage, playerDamage, spellId } },
        xp: current.xp + (correct ? 30 : 0) + questReward,
        magicUsage: { ...current.magicUsage, [magicElement]: (current.magicUsage[magicElement] ?? 0) + 1 },
        elementXp: { ...current.elementXp, [magicElement]: (current.elementXp[magicElement] ?? 0) + elementGain },
        weeklyMagicQuest: { ...currentQuest, usedCount: nextUsedCount, rewardClaimed: currentQuest.rewardClaimed || questJustCompleted, completedAt: questJustCompleted ? new Date().toISOString() : currentQuest.completedAt },
        metrics: { ...current.metrics, totalAnswers: current.metrics.totalAnswers + 1, correctAnswers: current.metrics.correctAnswers + (correct ? 1 : 0), bossWins: current.metrics.bossWins + (bossHp === 0 ? 1 : 0), lastActiveAt: new Date().toISOString() },
        collectedGuardianIds: bossHp === 0 && !current.collectedGuardianIds.includes("atlas") ? [...current.collectedGuardianIds, "atlas"] : current.collectedGuardianIds,
      };
    });
    return { correct, playerDamage, bossDamage, ended, levelUp };
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
  const elementLevel = useCallback((element: ElementName) => Math.floor((profile?.elementXp[element] ?? 0) / ELEMENT_XP_PER_LEVEL) + 1, [profile]);
  const createProfileBackup = useCallback(() => profile ? JSON.stringify({ format: "math4fun-profile-backup", version: 1, exportedAt: new Date().toISOString(), profile }, null, 2) : null, [profile]);
  const hasParentPin = Boolean(store.parentPin);
  const setParentPin = useCallback(async (pin: string) => {
    if (!isParentPin(pin)) return { ok: false, message: "PIN cần gồm 4–8 chữ số." };
    if (typeof window === "undefined" || !window.crypto?.subtle) return { ok: false, message: "Trình duyệt này chưa hỗ trợ tạo PIN an toàn." };
    const salt = createParentPinSalt();
    const hash = await hashParentPin(pin, salt);
    if (!hash) return { ok: false, message: "Không thể tạo PIN trên trình duyệt này." };
    const parentPin = { salt, hash, createdAt: new Date().toISOString() };
    parentPinRef.current = parentPin;
    setStore((previous) => ({ ...previous, parentPin }));
    return { ok: true, message: "Đã thiết lập PIN phụ huynh trên thiết bị này." };
  }, []);
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
    selectProfile,
    unlockStationForWeek,
    isStationUnlocked,
    isStationMastered,
    stationProgress,
    getStationAttempt,
    startStationSession,
    answerStationQuestion,
    isBossUnlocked,
    startBattle,
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
    setParentPin,
    restoreProfileBackup,
    toggleTeamGuardian,
    setAudioEnabled,
    resetActiveProfile,
  }), [profile, store.profiles, store.audioEnabled, store.siteVisitCount, store.lastSiteVisitAt, level, levelProgress, weeklyOpenCount, createProfile, selectProfile, unlockStationForWeek, isStationUnlocked, isStationMastered, stationProgress, getStationAttempt, startStationSession, answerStationQuestion, isBossUnlocked, startBattle, resolveBattleAnswer, advanceBattle, markMagicVideoWatched, magicBookWatchedCount, hasMagicBookAchievement, mostUsedMagicElement, elementLevel, weeklyMagicQuest, createProfileBackup, hasParentPin, setParentPin, restoreProfileBackup, toggleTeamGuardian, setAudioEnabled, resetActiveProfile]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
}
