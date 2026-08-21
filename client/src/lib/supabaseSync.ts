/** Field Journal Quest — offline-first sync adapter. Passwords, PINs, cookies and question overrides never leave this browser. */
import type { Json, CloudLeaderboardRow } from "./supabase.types";
import { isSupabaseSyncEnabled, supabase } from "@/lib/supabase";
import type { AvatarId, GoldTransaction, LeaderboardEntry, QuestionReport, StudentProfile } from "@/contexts/GameContext";

export type SupabaseSyncResult = { ok: boolean; reason?: string };
type SupabaseWriteResponse = { error?: { message?: string } | null };

function asJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}

function compactProfileState(profile: StudentProfile): Json {
  const { passwordSalt: _passwordSalt, passwordHash: _passwordHash, role: _role, questionReports: _reports, goldHistory: _goldHistory, ...state } = profile;
  return asJson(state);
}

function getBadgeCount(profile: StudentProfile) {
  const elementBadges = Object.values(profile.elementXp).filter((xp) => (xp ?? 0) >= 200).length;
  const streakBadges = profile.streak >= 14 ? 2 : profile.streak >= 7 ? 1 : 0;
  return elementBadges + streakBadges + profile.bossBadges.length;
}

export function toLeaderboardEntry(profile: StudentProfile): LeaderboardEntry {
  const badges = getBadgeCount(profile);
  const score = profile.xp + profile.completedStationIds.length * 250 + profile.collectedGuardianIds.length * 175 + badges * 200;
  return {
    profileId: profile.id,
    name: profile.name,
    avatar: profile.avatar,
    score,
    level: Math.floor(profile.xp / 250) + 1,
    badges,
    guardians: profile.collectedGuardianIds.length,
    stations: profile.completedStationIds.length,
    streak: profile.streak,
  };
}

function reportRow(report: QuestionReport) {
  return {
    id: report.id,
    reporter_id: report.reporterId,
    question_id: report.questionId,
    category: report.category,
    note: report.note,
    status: report.status,
    admin_reply: report.adminReply ?? null,
    reviewed_at: report.reviewedAt ?? null,
    reviewed_by: report.reviewedBy ?? null,
    handling_history: asJson(report.handlingHistory ?? []),
    created_at: report.createdAt,
  };
}

function guardianRows(profile: StudentProfile) {
  return profile.collectedGuardianIds.map((guardianId) => ({
    profile_id: profile.id,
    guardian_id: guardianId,
    training_xp: Math.max(0, Math.floor(profile.guardianTrainingXp[guardianId] ?? 0)),
    health: Math.max(0, Math.min(100, Math.floor(profile.guardianHealth[guardianId]?.hp ?? 100))),
    is_in_team: profile.teamGuardianIds.includes(guardianId),
  }));
}

export async function getSupabaseOwnerId(): Promise<string | null> {
  if (!isSupabaseSyncEnabled || !supabase) return null;
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session?.user.id) return sessionData.session.user.id;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user?.id) return null;
  return data.user.id;
}

export async function syncProfileToSupabase(profile: StudentProfile, ownerId: string): Promise<SupabaseSyncResult> {
  if (!supabase || profile.role === "admin") return { ok: false, reason: "disabled" };
  const leaderboard = toLeaderboardEntry(profile);
  const profileWrite = await supabase.from("profiles").upsert({
    id: profile.id,
    owner_id: ownerId,
    local_profile_id: profile.id,
    username: profile.username ?? null,
    display_name: profile.name,
    avatar: profile.avatar,
    state: compactProfileState(profile),
    state_version: 14,
    xp: profile.xp,
    gold: profile.gold,
    streak: profile.streak,
    map1_boss_defeated: profile.map1BossDefeated,
    map2_boss_defeated: profile.map2BossDefeated,
  }, { onConflict: "id" });
  if (profileWrite.error) return { ok: false, reason: profileWrite.error.message };

  const jobs: PromiseLike<unknown>[] = [
    supabase.from("leaderboard").upsert({
      profile_id: leaderboard.profileId,
      display_name: leaderboard.name,
      avatar: leaderboard.avatar,
      score: leaderboard.score,
      level: leaderboard.level,
      badges: leaderboard.badges,
      guardians: leaderboard.guardians,
      stations: leaderboard.stations,
      streak: leaderboard.streak,
    }, { onConflict: "profile_id" }),
  ];
  if (profile.goldHistory.length) jobs.push(supabase.from("gold_ledger").upsert(profile.goldHistory.map((entry) => ({ id: entry.id, profile_id: profile.id, amount: entry.amount, category: entry.category, label: entry.label, created_at: entry.createdAt })), { onConflict: "id", ignoreDuplicates: true }));
  if (profile.questionReports.length) jobs.push(supabase.from("reports").upsert(profile.questionReports.map(reportRow), { onConflict: "id", ignoreDuplicates: true }));
  const guardians = guardianRows(profile);
  if (guardians.length) jobs.push(supabase.from("guardian_collection").upsert(guardians, { onConflict: "profile_id,guardian_id" }));
  const settled = await Promise.allSettled(jobs);
  const rejection = settled.find((result) => result.status === "rejected");
  if (rejection?.status === "rejected") return { ok: false, reason: String(rejection.reason) };
  const writeError = settled.find((result) => result.status === "fulfilled" && Boolean((result.value as SupabaseWriteResponse)?.error));
  if (writeError?.status === "fulfilled") {
    const error = (writeError.value as SupabaseWriteResponse).error;
    return { ok: false, reason: error?.message ?? "Supabase từ chối ghi dữ liệu." };
  }
  return { ok: true };
}

export async function fetchSupabaseLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("leaderboard").select("profile_id, display_name, avatar, score, level, badges, guardians, stations, streak").order("score", { ascending: false }).order("streak", { ascending: false }).limit(100);
  if (error || !data) return [];
  return (data as Pick<CloudLeaderboardRow, "profile_id" | "display_name" | "avatar" | "score" | "level" | "badges" | "guardians" | "stations" | "streak">[]).map((row) => ({
    profileId: row.profile_id,
    name: row.display_name,
    avatar: row.avatar as AvatarId,
    score: row.score,
    level: row.level,
    badges: row.badges,
    guardians: row.guardians,
    stations: row.stations,
    streak: row.streak,
  }));
}

export function cloudLedgerToLocal(entry: { id: string; amount: number; category: string; label: string; created_at: string }): GoldTransaction | null {
  if (!["answer", "hint", "station-open", "shop", "set-reward"].includes(entry.category)) return null;
  return { id: entry.id, amount: entry.amount, category: entry.category as GoldTransaction["category"], label: entry.label, createdAt: entry.created_at };
}
