/**
 * Math4Fun local state — Field Journal Quest keeps learning evidence across navigation.
 * Gameplay rules live here, never in a page: a station needs 10 distinct correct answers,
 * unfinished attempts persist, and a Boss run always uses a separate hard-question pool.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BOSS_QUESTION_IDS, Difficulty, getGuardian, getReadyStations, getStation, QUESTIONS_BY_ID, STATIONS } from "@/game/gameData";

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
  metrics: LearningMetrics;
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

type GameStore = { version: 3; profiles: StudentProfile[]; activeProfileId: string | null; audioEnabled: boolean; siteVisitCount: number; lastSiteVisitAt?: string };
export type StationProgress = { correct: number; answered: number; target: number; total: number; accuracy: number };
export type AnswerResult = { correct: boolean; stationMastered: boolean; nextQuestionId: string | null };
export type BattleAnswerResult = { correct: boolean; playerDamage: number; bossDamage: number; ended: boolean };

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
  toggleTeamGuardian: (guardianId: string) => void;
  setAudioEnabled: (enabled: boolean) => void;
  resetActiveProfile: () => void;
};

const STORAGE_KEY = "math4fun-field-journal-v3";
const emptyBattle = (): BattleState => ({ status: "idle", questionIds: [], questionIndex: 0, playerHp: 100, bossHp: 150 });
const emptyMetrics = (): LearningMetrics => ({ totalAnswers: 0, correctAnswers: 0, stationSessions: 0, bossRuns: 0, bossWins: 0 });
const DEFAULT_STORE: GameStore = { version: 3, profiles: [], activeProfileId: null, audioEnabled: true, siteVisitCount: 0 };
const GameContext = createContext<GameContextValue | undefined>(undefined);

function localDate() { return new Date().toISOString().slice(0, 10); }
function weekKey() {
  const date = new Date();
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date.toISOString().slice(0, 10);
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
    metrics: emptyMetrics(),
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
      version: 3,
      activeProfileId: typeof parsed.activeProfileId === "string" ? parsed.activeProfileId : null,
      audioEnabled: typeof parsed.audioEnabled === "boolean" ? parsed.audioEnabled : true,
      siteVisitCount: typeof parsed.siteVisitCount === "number" && Number.isFinite(parsed.siteVisitCount) ? Math.max(0, parsed.siteVisitCount) : 0,
      lastSiteVisitAt: typeof parsed.lastSiteVisitAt === "string" ? parsed.lastSiteVisitAt : undefined,
      profiles: parsed.profiles.map((profile) => ({
        ...createProfileRecord(typeof profile.name === "string" ? profile.name : "Nhà thám hiểm", (profile.avatar as AvatarId) || "compass"),
        ...profile,
        unlockedStationIds: Array.isArray(profile.unlockedStationIds) ? profile.unlockedStationIds : [],
        stationOpenedAt: profile.stationOpenedAt && typeof profile.stationOpenedAt === "object" ? profile.stationOpenedAt : {},
        correctQuestionIds: Array.isArray(profile.correctQuestionIds) ? profile.correctQuestionIds : [],
        incorrectQuestionIds: Array.isArray(profile.incorrectQuestionIds) ? profile.incorrectQuestionIds : [],
        completedStationIds: Array.isArray(profile.completedStationIds) ? profile.completedStationIds : [],
        collectedGuardianIds: Array.isArray(profile.collectedGuardianIds) ? profile.collectedGuardianIds : [],
        teamGuardianIds: Array.isArray(profile.teamGuardianIds) ? profile.teamGuardianIds : [],
        attempts: profile.attempts && typeof profile.attempts === "object" ? profile.attempts : {},
        battle: profile.battle?.status ? profile.battle : emptyBattle(),
        bossQuestionHistory: Array.isArray(profile.bossQuestionHistory) ? profile.bossQuestionHistory : [],
        metrics: { ...emptyMetrics(), ...profile.metrics },
      })),
    };
  } catch {
    return DEFAULT_STORE;
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<GameStore>(readStore);
  useEffect(() => { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); }, [store]);
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
    const attempt: StationAttempt = { id: `station-${stationId}-${Date.now()}`, stationId, questionIds: shuffle(pending), answeredQuestionIds: [], currentQuestionId: shuffle(pending)[0] ?? null, startedAt: new Date().toISOString() };
    // Reuse exactly the same shuffled ordering for the displayed first question.
    attempt.questionIds = shuffle(pending);
    attempt.currentQuestionId = attempt.questionIds[0] ?? null;
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
    const spell = { thunder: [24, 10], flame: [30, 14], tide: [18, 6], gust: [21, 8], venom: [26, 12] }[spellId] ?? [21, 10];
    const correct = answer === question.answer;
    const bossDamage = correct ? spell[0] : 0;
    const playerDamage = correct ? spell[1] : 34;
    const bossHp = Math.max(0, profile.battle.bossHp - bossDamage);
    const playerHp = Math.max(0, profile.battle.playerHp - playerDamage);
    const ended = bossHp === 0 || playerHp === 0;
    updateProfile(profile.id, (current) => ({ ...current, battle: { ...current.battle, bossHp, playerHp, status: bossHp === 0 ? "victory" : playerHp === 0 ? "defeat" : "active", lastResult: { correct, bossDamage, playerDamage, spellId } }, xp: current.xp + (correct ? 30 : 0), metrics: { ...current.metrics, totalAnswers: current.metrics.totalAnswers + 1, correctAnswers: current.metrics.correctAnswers + (correct ? 1 : 0), bossWins: current.metrics.bossWins + (bossHp === 0 ? 1 : 0), lastActiveAt: new Date().toISOString() }, collectedGuardianIds: bossHp === 0 && !current.collectedGuardianIds.includes("atlas") ? [...current.collectedGuardianIds, "atlas"] : current.collectedGuardianIds }));
    return { correct, playerDamage, bossDamage, ended };
  }, [profile, updateProfile]);
  const advanceBattle = useCallback(() => {
    if (!profile || profile.battle.status !== "active") return;
    const nextIndex = profile.battle.questionIndex + 1;
    updateProfile(profile.id, (current) => ({ ...current, battle: nextIndex >= current.battle.questionIds.length ? { ...current.battle, status: "defeat" } : { ...current.battle, questionIndex: nextIndex, lastResult: undefined } }));
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
  const value = useMemo<GameContextValue>(() => ({ profile, profiles: store.profiles, hasProfile: Boolean(profile), audioEnabled: store.audioEnabled, siteVisitCount: store.siteVisitCount, lastSiteVisitAt: store.lastSiteVisitAt, level, levelProgress, weeklyOpenCount, createProfile, selectProfile, unlockStationForWeek, isStationUnlocked, isStationMastered, stationProgress, getStationAttempt, startStationSession, answerStationQuestion, isBossUnlocked, startBattle, resolveBattleAnswer, advanceBattle, toggleTeamGuardian, setAudioEnabled, resetActiveProfile }), [profile, store.profiles, store.audioEnabled, store.siteVisitCount, store.lastSiteVisitAt, level, levelProgress, weeklyOpenCount, createProfile, selectProfile, unlockStationForWeek, isStationUnlocked, isStationMastered, stationProgress, getStationAttempt, startStationSession, answerStationQuestion, isBossUnlocked, startBattle, resolveBattleAnswer, advanceBattle, toggleTeamGuardian, setAudioEnabled, resetActiveProfile]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
}
