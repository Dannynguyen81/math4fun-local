/** Math4Fun shared game state — Field Journal Quest data is intentionally stored only in this browser's localStorage. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getStation, QUESTIONS_BY_ID, STATIONS } from "@/game/gameData";

export type GameProgress = {
  xp: number;
  streak: number;
  completedQuestionIds: string[];
  completedStationIds: number[];
  collectedGuardianIds: string[];
  bossHp: number;
  bossDefeated: boolean;
};

type GameContextValue = {
  progress: GameProgress;
  level: number;
  levelProgress: number;
  isStationUnlocked: (stationId: number) => boolean;
  isStationMastered: (stationId: number) => boolean;
  stationProgress: (stationId: number) => { done: number; total: number };
  answerQuestion: (questionId: string) => boolean;
  isQuestionCompleted: (questionId: string) => boolean;
  isBossUnlocked: boolean;
  hitBoss: (damage: number) => void;
  resetProgress: () => void;
};

const STORAGE_KEY = "math4fun-field-journal-v2";
const DEFAULT_PROGRESS: GameProgress = {
  xp: 120,
  streak: 3,
  completedQuestionIds: [],
  completedStationIds: [],
  collectedGuardianIds: [],
  bossHp: 100,
  bossDefeated: false,
};

const GameContext = createContext<GameContextValue | undefined>(undefined);

function readProgress(): GameProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(saved) as Partial<GameProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      completedQuestionIds: Array.isArray(parsed.completedQuestionIds) ? parsed.completedQuestionIds : [],
      completedStationIds: Array.isArray(parsed.completedStationIds) ? parsed.completedStationIds : [],
      collectedGuardianIds: Array.isArray(parsed.collectedGuardianIds) ? parsed.collectedGuardianIds : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<GameProgress>(readProgress);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const isStationMastered = useCallback((stationId: number) => progress.completedStationIds.includes(stationId), [progress.completedStationIds]);
  const isStationUnlocked = useCallback((stationId: number) => {
    if (stationId === 1) return true;
    return progress.completedStationIds.includes(stationId - 1);
  }, [progress.completedStationIds]);
  const stationProgress = useCallback((stationId: number) => {
    const station = getStation(stationId);
    const total = station?.questionIds.length ?? 0;
    const done = station?.questionIds.filter((questionId) => progress.completedQuestionIds.includes(questionId)).length ?? 0;
    return { done, total };
  }, [progress.completedQuestionIds]);
  const isQuestionCompleted = useCallback((questionId: string) => progress.completedQuestionIds.includes(questionId), [progress.completedQuestionIds]);

  const answerQuestion = useCallback((questionId: string) => {
    const question = QUESTIONS_BY_ID[questionId];
    if (!question || progress.completedQuestionIds.includes(questionId)) return false;

    setProgress((previous) => {
      if (previous.completedQuestionIds.includes(questionId)) return previous;
      const completedQuestionIds = [...previous.completedQuestionIds, questionId];
      const station = getStation(question.stationId);
      const masteredNow = Boolean(station?.questionIds.every((id) => completedQuestionIds.includes(id)));
      const completedStationIds = masteredNow && !previous.completedStationIds.includes(question.stationId)
        ? [...previous.completedStationIds, question.stationId]
        : previous.completedStationIds;
      const collectedGuardianIds = masteredNow && station && !previous.collectedGuardianIds.includes(station.guardianId)
        ? [...previous.collectedGuardianIds, station.guardianId]
        : previous.collectedGuardianIds;
      return { ...previous, xp: previous.xp + 40, completedQuestionIds, completedStationIds, collectedGuardianIds };
    });
    return true;
  }, [progress.completedQuestionIds]);

  const hitBoss = useCallback((damage: number) => {
    setProgress((previous) => {
      if (previous.bossDefeated) return previous;
      const bossHp = Math.max(0, previous.bossHp - damage);
      const bossDefeated = bossHp === 0;
      const collectedGuardianIds = bossDefeated && !previous.collectedGuardianIds.includes("atlas")
        ? [...previous.collectedGuardianIds, "atlas"]
        : previous.collectedGuardianIds;
      return { ...previous, bossHp, bossDefeated, collectedGuardianIds, xp: previous.xp + 65 };
    });
  }, []);

  const resetProgress = useCallback(() => setProgress(DEFAULT_PROGRESS), []);
  const isBossUnlocked = STATIONS.slice(0, 4).every((station) => isStationMastered(station.id));
  const level = Math.floor(progress.xp / 180) + 1;
  const levelProgress = progress.xp % 180;

  const value = useMemo<GameContextValue>(() => ({
    progress, level, levelProgress, isStationUnlocked, isStationMastered, stationProgress, answerQuestion,
    isQuestionCompleted, isBossUnlocked, hitBoss, resetProgress,
  }), [progress, level, levelProgress, isStationUnlocked, isStationMastered, stationProgress, answerQuestion, isQuestionCompleted, isBossUnlocked, hitBoss, resetProgress]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
}
