/**
 * Field Journal Quest — the training arena is a tactical field dossier, not a gold farm.
 * Indigo carries the arena surface; Marigold appears only for committed actions and breakthroughs.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Lock, MapPinned, ScrollText, Swords, Volume2, X, Zap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ARENA_IMAGE,
  BATTLE_AUDIO,
  GUARDIANS,
  QUESTIONS_BY_ID,
  TRAINING_DIFFICULTIES,
  TRAINING_TECHNIQUES,
  getElementalAdvantage,
  getGuardian,
  getSpellForGuardian,
  getTrainingDifficulty,
  getTrainingTechnique,
  type ElementName,
  type TrainingDifficultyId,
} from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { playElementLevelUpSound, playElementSound, playFiveStreakSound, playTechniqueSound } from "@/lib/magicAudio";

const elementColor: Record<string, string> = { "sấm": "#f6b73c", "lửa": "#ee6b4e", "nước": "#55a9dd", "gió": "#3e9b7a", "độc": "#8e69ad", "đất": "#b17a3d" };
const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

type BattleFeedback = { correct: boolean; playerDamage: number; bossDamage: number; ended: boolean };
type LevelCelebration = { level: number; technique: string; bonusDamage: number };
const xpChartConfig = { xp: { label: "XP Huấn luyện", color: "#4d8b67" } } satisfies ChartConfig;
const elementalGlyph: Record<ElementName, string> = { "sấm": "ϟ", "lửa": "✦", "nước": "≈", "gió": "〰", "độc": "✥", "đất": "◆" };
const techniqueVisual: Record<number, { fieldTag: string; particleCount: number; impactCount: number }> = {
  1: { fieldTag: "DẤU KHỞI PHÁT", particleCount: 1, impactCount: 4 },
  2: { fieldTag: "LIÊN HOÀN", particleCount: 3, impactCount: 6 },
  3: { fieldTag: "LA BÀN BỘC PHÁ", particleCount: 4, impactCount: 8 },
  4: { fieldTag: "MẬT LỆNH", particleCount: 5, impactCount: 12 },
};
const trailPosition = ["left-0 top-0", "-left-4 top-2", "left-2 -top-4", "left-4 top-6", "-left-6 -top-5"];
const impactPosition = ["left-1/2 top-0", "right-0 top-1/2", "left-1/2 bottom-0", "left-0 top-1/2", "right-2 top-2", "right-2 bottom-2", "left-2 bottom-2", "left-2 top-2", "right-1 top-1/3", "left-1 top-1/3", "right-1 bottom-1/3", "left-1 bottom-1/3"];

/** Field Journal Quest: paper-seal projectiles move only through transform and opacity. */
function TrainingTechniqueEffect({ attacker, technique, correct, reducedMotion }: { attacker: { name: string; element: ElementName }; technique: typeof TRAINING_TECHNIQUES[number]; correct: boolean; reducedMotion: boolean | null }) {
  const level = Math.min(4, Math.max(1, technique.level));
  const visual = techniqueVisual[level];
  const color = elementColor[attacker.element];
  const travel = correct ? 420 : -420;
  const duration = reducedMotion ? 0.01 : 0.7 + level * 0.06;
  const targetClass = correct ? "right-[14%]" : "left-[14%]";
  const originClass = correct ? "left-[18%]" : "right-[18%]";

  return <>
    <motion.div aria-label={`${attacker.name} kích hoạt ${technique.name}`} initial={{ opacity: 0, scale: 0.72, x: 0, y: 0 }} animate={{ opacity: [0, 1, 1, 0], scale: [0.72, 1, 1.12 + level * 0.04, 1.36], x: reducedMotion ? 0 : [0, travel], y: reducedMotion ? 0 : [0, -16, 5, 0] }} transition={{ duration, ease: [0.23, 1, 0.32, 1] }} className={`pointer-events-none absolute top-[57%] z-20 grid h-12 w-12 place-items-center ${originClass}`}>
      {Array.from({ length: visual.particleCount }).map((_, index) => <span key={index} aria-hidden className={`absolute grid h-5 w-5 place-items-center rounded-full border border-white/80 bg-[#172a48]/85 text-xs font-black ${trailPosition[index]}`} style={{ color, boxShadow: `0 0 ${7 + level * 2}px ${color}` }}>{elementalGlyph[attacker.element]}</span>)}
      <motion.span aria-hidden animate={reducedMotion ? { rotate: 0 } : { rotate: level >= 3 ? 360 : 0 }} transition={{ duration: level >= 3 ? 0.56 : 0.01, ease: "linear" }} className={`relative z-10 grid h-10 w-10 place-items-center border-2 border-white bg-[#172a48] font-display text-2xl font-black ${level >= 3 ? "rounded-full" : "rotate-45"}`} style={{ color, boxShadow: `0 0 ${14 + level * 5}px ${color}` }}><span className={level >= 3 ? "" : "-rotate-45"}>{elementalGlyph[attacker.element]}</span></motion.span>
      {level >= 3 && <span aria-hidden className="absolute inset-[-9px] rounded-full border border-dashed border-white/80" />}
      <span className="absolute -bottom-5 whitespace-nowrap border border-white/60 bg-[#172a48]/90 px-1.5 py-0.5 font-mono text-[8px] font-black tracking-[.12em] text-white">{visual.fieldTag}</span>
    </motion.div>
    <motion.div initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: [0, 0, 1, 0], scale: [0.3, 0.55, 1.42 + level * 0.12, 2.05] }} transition={{ duration: reducedMotion ? 0.01 : 0.38 + level * 0.05, delay: reducedMotion ? 0 : 0.39, ease: [0.23, 1, 0.32, 1] }} className={`pointer-events-none absolute top-[40%] z-20 grid h-24 w-24 place-items-center ${targetClass}`}>
      <span aria-hidden className="absolute inset-3 rounded-full border-2 border-white/90" style={{ background: `radial-gradient(circle, ${color} 0%, ${color}99 28%, transparent 70%)`, boxShadow: `0 0 ${22 + level * 6}px ${color}` }} />
      {Array.from({ length: visual.impactCount }).map((_, index) => <span key={index} aria-hidden className={`absolute h-5 w-[2px] origin-bottom bg-white ${impactPosition[index]}`} style={{ boxShadow: `0 0 7px ${color}`, transform: impactPosition[index].includes("top") ? "rotate(30deg)" : "rotate(-30deg)" }} />)}
      <span className="relative z-10 grid h-11 w-11 place-items-center rounded-full border-2 border-white bg-[#172a48] font-display text-xl font-black" style={{ color }}>{elementalGlyph[attacker.element]}</span>
    </motion.div>
  </>;
}

function TrainingArchive({ guardianName, timeline, history }: { guardianName: string; timeline: { label: string; xp: number }[]; history: ReturnType<ReturnType<typeof useGame>["getGuardianTrainingHistory"]> }) {
  return <section className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
    <article className="border-2 border-[#172a48] bg-[#fffdf6] p-5 shadow-[4px_4px_0_#172a48]">
      <p className="section-kicker"><Zap size={13} /> ĐƯỜNG XP · {guardianName.toUpperCase()}</p>
      <h2 className="mt-2 font-display text-2xl font-black">Đường tăng trưởng Huấn luyện</h2>
      <p className="mt-1 text-sm text-[#58708b]">Mỗi mốc là một trận đã khép lại; XP được lưu riêng cho guardian này.</p>
      <ChartContainer config={xpChartConfig} className="mt-4 h-52 w-full">
        <AreaChart accessibilityLayer data={timeline} margin={{ left: -18, right: 8, top: 10, bottom: 0 }}>
          <defs><linearGradient id="training-xp-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="var(--color-xp)" stopOpacity={0.42} /><stop offset="95%" stopColor="var(--color-xp)" stopOpacity={0.05} /></linearGradient></defs>
          <CartesianGrid vertical={false} strokeDasharray="3 4" stroke="#b7c4cf" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={34} />
          <ChartTooltip cursor={{ stroke: "#f6b73c", strokeWidth: 2 }} content={<ChartTooltipContent indicator="line" />} />
          <Area type="monotone" dataKey="xp" stroke="var(--color-xp)" strokeWidth={3} fill="url(#training-xp-fill)" />
        </AreaChart>
      </ChartContainer>
    </article>
    <article className="border-2 border-[#172a48] bg-[#fff8da] p-5 shadow-[4px_4px_0_#172a48]">
      <p className="section-kicker"><ScrollText size={13} /> NHẬT KÝ GIAO ĐẤU</p>
      <h2 className="mt-2 font-display text-2xl font-black">Trận gần đây</h2>
      {history.length ? <ol className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1">{history.slice(0, 6).map((record) => { const foe = getGuardian(record.opponentGuardianId); const rule = getTrainingDifficulty(record.difficulty); return <li key={record.id} className="border-l-4 border-[#4d8b67] bg-[#fffdf6] px-3 py-2 text-xs"><div className="flex items-center justify-between gap-2"><b className="font-display text-base">{record.outcome === "victory" ? "Thắng" : "Thua"} · {foe?.name ?? "Đối thủ"}</b><span className="font-mono text-[9px]">+{record.xpGain} XP</span></div><p className="mt-1 text-[#58708b]">{rule.label} · Đúng {record.correctCount}, sai {record.incorrectCount} · {new Date(record.endedAt).toLocaleDateString("vi-VN")}</p></li>; })}</ol> : <p className="mt-4 border-2 border-dashed border-[#58708b] bg-[#fffdf6] p-4 text-sm text-[#58708b]">Chưa có trận nào được ký. Hoàn tất một kèo để ghi mốc XP đầu tiên.</p>}
    </article>
  </section>;
}

function TrainingSeal({ hasProfile }: { hasProfile: boolean }) {
  const specimen = GUARDIANS.find((guardian) => guardian.id === "pipra") ?? GUARDIANS[0];
  const href = hasProfile ? "/map" : "/start";

  return <section className="training-ticket relative overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] shadow-[6px_6px_0_#172a48]">
    <div aria-hidden className="absolute bottom-[-22px] left-[9%] z-0 h-16 w-44 rotate-[-4deg] border-2 border-dashed border-[#4d8b67] bg-[#fff0b6]/70" />
    <div className="training-ticket-cover relative z-10 bg-[#172a48] px-6 py-7 text-white">
      <div className="absolute right-0 top-0 h-full w-28 border-l-2 border-dashed border-[#172a48] bg-[#e8f0e4] [clip-path:polygon(42%_0,100%_0,100%_100%,0_100%)]" />
      <div className="absolute left-[56%] top-4 rotate-[3deg] border border-[#d5dfed]/70 bg-[#fff8da] px-3 py-1 font-mono text-[9px] font-black tracking-[.16em] text-[#172a48] shadow-[2px_2px_0_#f6b73c]">PHIẾU ĐỦ ĐIỀU KIỆN · XP ONLY</div>
      <div aria-hidden className="absolute bottom-4 right-36 h-8 w-36 rotate-[-2deg] border-b-2 border-dashed border-[#f6b73c] opacity-80" />
      <p className="section-kicker relative text-[#fff0b6]"><Lock size={13} /> PHIẾU SÂN LUYỆN · NIÊM PHONG</p>
      <h1 className="relative mt-2 max-w-xl font-display text-4xl font-black">Võ đài cần một nhật ký đã ký</h1>
      <p className="relative mt-3 max-w-2xl text-sm text-[#d5dfed]">{hasProfile ? "Hãy đánh thức guardian đầu tiên. Chỉ các chủ đề đã mở trên Bản đồ mới trở thành bài luyện." : "Ký nhật ký, mở một mốc và ghi đủ bằng chứng để đưa guardian vào sân luyện."}</p>
    </div>
    <div className="relative z-10 grid gap-5 p-5 lg:grid-cols-[1fr_250px]">
      <div>
        <p className="section-kicker"><MapPinned size={13} /> ROUTE FRAGMENT · PHIẾU ĐIỀU KIỆN SÂN LUYỆN</p>
        <ol className="relative mt-4 space-y-3 border-l-2 border-dashed border-[#4d8b67] pl-7 text-sm before:absolute before:-left-[5px] before:top-0 before:h-2 before:w-2 before:rounded-full before:bg-[#f6b73c] after:absolute after:-bottom-1 after:-left-[5px] after:h-2 after:w-2 after:rounded-full after:bg-[#172a48]">
          <li className="relative"><span className="absolute -left-[35px] top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-[#172a48] bg-[#fff0b6] font-mono text-[9px] font-black">01</span><b className="font-display text-lg">Ký nhật ký</b><span className="block text-[#58708b]">Tạo một hồ sơ hành trình riêng và đóng dấu tên vào sổ.</span></li>
          <li className="relative"><span className="absolute -left-[35px] top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-[#172a48] bg-[#e8f0e4] font-mono text-[9px] font-black">02</span><b className="font-display text-lg">Mở và hoàn tất một trạm</b><span className="block text-[#58708b]">Ghi 10 bằng chứng Toán; câu đúng trở thành tư liệu sân luyện.</span></li>
          <li className="relative"><span className="absolute -left-[35px] top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-[#172a48] bg-[#d5dfed] font-mono text-[9px] font-black">03</span><b className="font-display text-lg">Đánh thức guardian</b><span className="block text-[#58708b]">Sân mở, HP phiên được cấp lại và guardian nhận XP — không nhận Gold.</span></li>
        </ol>
        <Link href={href} className="mt-5 inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-2.5 font-black text-[#172a48] shadow-[3px_3px_0_#172a48]"><ScrollText size={16} />{hasProfile ? "Mở mốc trên Bản đồ" : "Ký nhật ký để mở sân"}</Link>
      </div>
      <aside className="relative border-2 border-dashed border-[#172a48] bg-[#fff8da] p-4 text-center">
        <span className="absolute -right-2 -top-3 rotate-[7deg] border-2 border-[#a54539] bg-[#fffdf6] px-2 py-1 font-mono text-[8px] font-black tracking-[.13em] text-[#a54539]">MẪU · 01</span>
        <p className="font-mono text-[9px] font-black tracking-[.15em] text-[#58708b]">SPECIMEN DOSSIER · SÂN LUYỆN</p>
        <div className="guardian-stamp mx-auto mt-3 grid h-20 w-20 place-items-center bg-[#eef1fb]"><img src={specimen.sprite} alt={`Mẫu vật ${specimen.name}`} className="h-16 w-16 object-contain" /></div>
        <span className="mt-2 inline-block border border-[#172a48] bg-[#fffdf6] px-2 py-0.5 font-mono text-[9px] font-black">NIÊM PHONG · CHƯA CÓ XP</span>
        <p className="mt-3 font-display text-xl font-black">{specimen.name}</p>
        <p className="text-[10px] font-bold tracking-[.1em] text-[#58708b]">PHÂN LOẠI · {specimen.element.toUpperCase()}</p>
        <p className="mt-2 border-t border-dashed border-[#58708b] pt-2 text-[10px] text-[#58708b]">Bằng chứng: 0 trận · 0 XP<br />Phần thưởng: phép mới theo cấp</p>
      </aside>
    </div>
  </section>;
}

export default function TrainingPage() {
  const { profile, canTrainPets, startTrainingBattle, resolveBattleAnswer, advanceBattle, guardianTrainingLevel, getGuardianTrainingHistory, getGuardianTrainingXpTimeline, audioEnabled } = useGame();
  const [selectedGuardianId, setSelectedGuardianId] = useState<string | null>(null);
  const [selectedOpponentId, setSelectedOpponentId] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<TrainingDifficultyId>("pathfinder");
  const [choices, setChoices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<BattleFeedback | null>(null);
  const [levelCelebration, setLevelCelebration] = useState<LevelCelebration | null>(null);
  const [streakBadge, setStreakBadge] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const reducedMotion = useReducedMotion();

  const battle = profile?.battle;
  const trainingActive = battle?.mode === "training" && battle.status === "active";
  const team = profile?.collectedGuardianIds.filter((id) => id !== "atlas") ?? [];
  const activeGuardian = getGuardian(battle?.guardianId ?? selectedGuardianId ?? team[0] ?? "") ?? GUARDIANS[0];
  const opponentCandidates = useMemo(() => GUARDIANS.filter((guardian) => guardian.id !== activeGuardian.id && guardian.id !== "atlas"), [activeGuardian.id]);
  const opponent = getGuardian(battle?.opponentGuardianId ?? selectedOpponentId ?? "") ?? opponentCandidates[0] ?? GUARDIANS[1];
  const spell = getSpellForGuardian(activeGuardian);
  const trainingLevel = guardianTrainingLevel(activeGuardian.id);
  const technique = getTrainingTechnique(trainingLevel);
  const trainingRule = getTrainingDifficulty(battle?.trainingDifficulty ?? selectedDifficulty);
  const nextTechnique = TRAINING_TECHNIQUES.find((candidate) => candidate.level > trainingLevel);
  const guardianHistory = getGuardianTrainingHistory(activeGuardian.id);
  const guardianXpTimeline = getGuardianTrainingXpTimeline(activeGuardian.id);
  const guardianAdvantage = getElementalAdvantage(activeGuardian.element, opponent.element);
  const opponentAdvantage = getElementalAdvantage(opponent.element, activeGuardian.element);
  const questionId = battle?.questionIds[battle.questionIndex ?? 0] ?? "";
  const question = trainingActive ? QUESTIONS_BY_ID[questionId] : undefined;
  const playerHp = battle?.playerHp ?? trainingRule.playerHp;
  const opponentHp = battle?.bossHp ?? trainingRule.opponentHp;

  useEffect(() => {
    if (!selectedGuardianId || !team.includes(selectedGuardianId)) setSelectedGuardianId(team[0] ?? null);
  }, [selectedGuardianId, team]);
  useEffect(() => {
    if (!selectedOpponentId || selectedOpponentId === activeGuardian.id || !opponentCandidates.some((guardian) => guardian.id === selectedOpponentId)) setSelectedOpponentId(opponentCandidates[0]?.id ?? null);
  }, [activeGuardian.id, opponentCandidates, selectedOpponentId]);
  useEffect(() => {
    if (question) { setChoices(shuffle(question.choices)); setSelectedAnswer(null); setFeedback(null); }
  }, [question?.id]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.17;
    if (trainingActive && audioEnabled) audio.play().catch(() => undefined); else audio.pause();
  }, [trainingActive, audioEnabled]);
  useEffect(() => {
    if (!streakBadge) return;
    const timer = window.setTimeout(() => setStreakBadge(null), 2400);
    return () => window.clearTimeout(timer);
  }, [streakBadge]);
  useEffect(() => {
    if (!levelCelebration) return;
    const timer = window.setTimeout(() => setLevelCelebration(null), 4600);
    return () => window.clearTimeout(timer);
  }, [levelCelebration]);

  if (!profile) return <TrainingSeal hasProfile={false} />;
  if (!canTrainPets) return <TrainingSeal hasProfile />;

  function begin() {
    if (selectedGuardianId && selectedOpponentId && startTrainingBattle(selectedGuardianId, selectedOpponentId, selectedDifficulty)) {
      playElementSound(activeGuardian.element, audioEnabled, "ready");
    }
  }
  function submit(answer: number) {
    if (!question || feedback) return;
    const result = resolveBattleAnswer(answer, spell.id);
    if (!result) return;
    setSelectedAnswer(answer);
    setFeedback(result);
    playElementSound(activeGuardian.element, audioEnabled, result.correct ? "cast" : "counter");
    window.setTimeout(() => playTechniqueSound(result.correct ? activeGuardian.element : opponent.element, technique.level, audioEnabled), result.correct ? 110 : 80);
    if (result.streakMilestone) { setStreakBadge(result.streakMilestone.streak); playFiveStreakSound(audioEnabled); }
    if (result.trainingLevelUp) {
      const unlocked = getTrainingTechnique(result.trainingLevelUp.nextLevel);
      setLevelCelebration({ level: result.trainingLevelUp.nextLevel, technique: unlocked.name, bonusDamage: unlocked.bonusDamage });
      playElementLevelUpSound(activeGuardian.element, audioEnabled);
    }
  }

  return <section className="relative">
    <audio ref={audioRef} src={BATTLE_AUDIO} loop preload="auto" />
    <AnimatePresence>
      {streakBadge && <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="pointer-events-none absolute inset-x-4 top-14 z-30 mx-auto max-w-sm border-2 border-[#f6b73c] bg-[#172a48]/95 p-4 text-center text-white shadow-[5px_5px_0_#f6b73c]"><div className="text-xl tracking-[.25em] text-[#f6b73c]">✦ ✦ ✦</div><b className="font-display text-2xl">Combo {streakBadge} dấu đúng!</b><p className="mt-1 text-xs text-[#fff0b6]">Nhật ký ghi nhận chuỗi suy luận xuất sắc. Võ đài vẫn chỉ trao XP.</p></motion.div>}
      {levelCelebration && <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="absolute inset-x-3 top-8 z-40 mx-auto max-w-xl overflow-hidden border-2 border-[#f6b73c] bg-[#172a48] p-1 text-white shadow-[8px_8px_0_#f6b73c]"><div className="relative overflow-hidden border border-[#fff0b6]/60 px-6 py-7 text-center"><motion.div aria-hidden className="absolute inset-0 opacity-30" animate={{ rotate: 360 }} transition={{ duration: 11, repeat: Infinity, ease: "linear" }} style={{ background: "repeating-conic-gradient(from 0deg, transparent 0 10deg, #f6b73c 11deg 12deg)" }} /><div className="relative"><motion.p animate={{ y: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }} className="font-mono text-xs font-black tracking-[.22em] text-[#f6b73c]">✦ PHÉP THUẬT ĐƯỢC GIẢI MÃ ✦</motion.p><div className="mx-auto mt-3 grid h-20 w-20 place-items-center rounded-full border-2 border-[#f6b73c] bg-[#fff0b6] text-[#172a48] shadow-[0_0_36px_rgba(246,183,60,.7)]"><Zap size={42} fill="currentColor" /></div><h2 className="mt-4 font-display text-4xl font-black">{activeGuardian.name} đạt Cấp {levelCelebration.level}!</h2><p className="mt-2 text-sm text-[#fff0b6]">Kỹ thuật mới: <b>{levelCelebration.technique}</b>{levelCelebration.bonusDamage ? ` · +${levelCelebration.bonusDamage} sát thương` : " · kỹ thuật nền"}</p><button onClick={() => setLevelCelebration(null)} className="mt-5 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-2 text-sm font-black text-[#172a48] shadow-[2px_2px_0_white]">Ghi vào nhật ký</button></div></div></motion.div>}
    </AnimatePresence>

    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker"><Swords size={13} /> HUẤN LUYỆN PET · XP ONLY</p><h1 className="font-display text-4xl font-black">Võ đài bài tập</h1><p className="mt-2 max-w-2xl text-sm text-[#58708b]">Đúng để ra đòn, sai để bị phản công. Võ đài không trao Gold; guardian nhận XP và lên cấp Huấn luyện. Rời võ đài, HP luôn hồi đầy.</p></div><span className="field-tag"><Zap size={14} /> {activeGuardian.name}: cấp {trainingLevel} · {technique.name}{technique.bonusDamage ? ` +${technique.bonusDamage}` : ""}</span></div>

    {!trainingActive ? <article className="overflow-hidden border-2 border-[#172a48] bg-[#172a48] text-white shadow-[6px_6px_0_#f6b73c]">
      <div className="relative h-52"><img src={ARENA_IMAGE} alt="Võ đài Huấn luyện Pet" className="h-full w-full object-cover opacity-60" /><div className="absolute inset-0 bg-gradient-to-t from-[#172a48] via-[#172a48]/45 to-transparent" /><div className="absolute inset-x-5 bottom-5"><p className="field-tag border-white/30 bg-white/10 text-white">PHIẾU GHÉP KÈO · CÂU HỎI TỪ TRẠM ĐÃ MỞ</p><h2 className="mt-2 font-display text-4xl font-black">Chọn đội hình chiến thuật</h2></div></div>
      <div className="space-y-6 p-5">
        <div><p className="section-kicker text-[#fff0b6]">01 · COMPANION CỦA EM</p><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{team.map((guardianId) => { const guardian = getGuardian(guardianId); if (!guardian) return null; const selected = guardianId === selectedGuardianId; return <button key={guardianId} onClick={() => setSelectedGuardianId(guardianId)} className={`flex items-center gap-3 border-2 p-3 text-left shadow-[2px_2px_0_#f6b73c] ${selected ? "border-[#f6b73c] bg-[#fff0b6] text-[#172a48]" : "border-white/70 bg-white/10"}`}><img src={guardian.sprite} alt="" className="h-14 w-14 object-contain" /><span><b className="font-display text-xl">{guardian.name}</b><small className="block text-xs">{guardian.element} · Cấp {guardianTrainingLevel(guardian.id)}</small></span></button>; })}</div></div>
        <div><p className="section-kicker text-[#fff0b6]">02 · PET ĐỐI THỦ</p><div className="mt-3 flex gap-3 overflow-x-auto pb-2">{opponentCandidates.map((guardian) => { const selected = guardian.id === selectedOpponentId; return <button key={guardian.id} onClick={() => setSelectedOpponentId(guardian.id)} className={`min-w-32 border-2 p-3 text-center shadow-[2px_2px_0_#f6b73c] ${selected ? "border-[#f6b73c] bg-[#fff0b6] text-[#172a48]" : "border-white/70 bg-white/10"}`}><img src={guardian.sprite} alt="" className="mx-auto h-14 w-14 object-contain" /><b className="mt-1 block font-display text-lg">{guardian.name}</b><small className="block text-[10px] uppercase">{guardian.element}</small></button>; })}</div></div>
        <aside className={`border-2 p-4 ${guardianAdvantage.state === "strong" ? "border-[#f6b73c] bg-[#fff0b6] text-[#172a48]" : guardianAdvantage.state === "weak" ? "border-[#ee6b4e] bg-[#ffe4dc] text-[#722e27]" : "border-white/60 bg-white/10 text-white"}`}><p className="font-mono text-[10px] font-black tracking-[.15em]">DẤU KHẮC CHẾ · PHÂN TÍCH KÈO ĐẤU</p><div className="mt-2 flex flex-wrap items-baseline justify-between gap-2"><b className="font-display text-2xl">{guardianAdvantage.label}</b><span className="font-mono text-xs font-black">PHÉP {activeGuardian.element.toUpperCase()} ×{guardianAdvantage.multiplier}</span></div><p className="mt-1 text-sm">{guardianAdvantage.fieldNote}</p><p className="mt-2 border-t border-current/30 pt-2 text-xs">Đối thủ {opponent.name} dùng {opponent.element}; khi phản công: <b>{opponentAdvantage.label.toLowerCase()}</b> (×{opponentAdvantage.multiplier}).</p></aside>
        <div><p className="section-kicker text-[#fff0b6]">03 · CẤP ĐỘ HUẤN LUYỆN</p><div className="mt-3 grid gap-3 lg:grid-cols-3">{Object.values(TRAINING_DIFFICULTIES).map((rule) => { const selected = rule.id === selectedDifficulty; return <button key={rule.id} onClick={() => setSelectedDifficulty(rule.id)} className={`border-2 p-4 text-left shadow-[2px_2px_0_#f6b73c] ${selected ? "border-[#f6b73c] bg-[#fff0b6] text-[#172a48]" : "border-white/70 bg-white/10"}`}><b className="font-display text-xl">{rule.label}</b><span className="mt-1 block text-xs">{rule.fieldNote}</span><span className="mt-3 block font-mono text-[10px] font-black tracking-[.1em]">{rule.questionCount} CÂU · HP {rule.playerHp}/{rule.opponentHp} · +{rule.xpCorrect} XP ĐÚNG</span></button>; })}</div></div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-white/40 pt-5"><p className="max-w-xl text-sm text-[#d5dfed]">{trainingRule.questionCount} câu từ các trạm đã mở. Không Gold, không mất guardian; rời võ đài là HP hồi đầy.</p><button onClick={begin} className="inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-5 py-3 font-black text-[#172a48] shadow-[3px_3px_0_white]"><Swords size={17} /> Xác nhận kèo đấu</button></div>
      </div>
    </article> : <article className="overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] shadow-[6px_6px_0_#172a48]">
      <div className="relative min-h-72 overflow-hidden bg-[#172a48] p-5"><img src={ARENA_IMAGE} alt="Trận Huấn luyện Pet" className="absolute inset-0 h-full w-full object-cover opacity-55" /><div className="absolute inset-0 bg-gradient-to-r from-[#172a48]/90 via-[#172a48]/30 to-[#172a48]/90" /><AnimatePresence>{feedback && <TrainingTechniqueEffect attacker={feedback.correct ? activeGuardian : opponent} technique={technique} correct={feedback.correct} reducedMotion={reducedMotion} />}{feedback && <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-0 z-10 grid place-items-center text-7xl" style={{ color: elementColor[feedback.correct ? activeGuardian.element : opponent.element] }}>{feedback.correct ? "✦" : "✕"}</motion.div>}</AnimatePresence><div className="relative grid gap-6 sm:grid-cols-2"><motion.div animate={feedback?.playerDamage ? { x: [0, -8, 8, 0] } : { x: 0 }}><p className="font-mono text-[10px] font-bold tracking-[.14em] text-[#f6b73c]">{activeGuardian.name.toUpperCase()} · HP {playerHp}/{trainingRule.playerHp}</p><div className="mt-2 h-3 border border-white/60 bg-[#172a48]"><motion.div animate={{ width: `${(playerHp / trainingRule.playerHp) * 100}%` }} className="h-full bg-[#3e9b7a]" /></div><img src={activeGuardian.sprite} alt={activeGuardian.name} className="mt-4 h-32 w-32 object-contain" /></motion.div><motion.div animate={feedback?.bossDamage ? { x: [0, 9, -9, 0] } : { x: 0 }} className="text-right"><p className="font-mono text-[10px] font-bold tracking-[.14em] text-[#f6b73c]">ĐỐI THỦ · {opponent.name.toUpperCase()} · HP {opponentHp}/{trainingRule.opponentHp}</p><div className="mt-2 h-3 border border-white/60 bg-[#172a48]"><motion.div animate={{ width: `${(opponentHp / trainingRule.opponentHp) * 100}%` }} className="ml-auto h-full bg-[#ee6b4e]" /></div><img src={opponent.sprite} alt={opponent.name} className="ml-auto mt-4 h-32 w-32 object-contain" /></motion.div></div></div>
      <div className="p-5"><div className="flex flex-wrap items-center justify-between gap-2"><p className="section-kicker">{trainingRule.label.toUpperCase()} · LƯỢT {(battle?.questionIndex ?? 0) + 1}/{battle?.questionIds.length ?? 5} · {question?.difficulty} · KHÔNG GOLD</p><span className="field-tag"><Volume2 size={13} /> {audioEnabled ? "hiệu ứng bật" : "hiệu ứng tắt"}</span></div><h2 className="mt-4 font-display text-3xl font-black">{question?.prompt}</h2><p className="mt-2 text-xs text-[#58708b]">Nguồn: {question?.source}</p><div className="mt-5 grid grid-cols-2 gap-3">{choices.map((answer, index) => { const isCorrect = answer === question?.answer; const isSelected = answer === selectedAnswer; const tone = feedback && isCorrect ? "border-[#235b45] bg-[#e7f2e5]" : feedback && isSelected ? "border-[#ee6b4e] bg-[#ffe4dc]" : "border-[#172a48] bg-white hover:bg-[#fff0b6]"; return <button key={answer} onClick={() => submit(answer)} disabled={Boolean(feedback)} className={`border-2 px-4 py-3 text-left font-display text-2xl font-black shadow-[2px_2px_0_#172a48] ${tone}`}>{String.fromCharCode(65 + index)}. {answer}</button>; })}</div>{feedback && <div className={`mt-4 flex flex-wrap items-center justify-between gap-3 border-2 p-4 text-sm font-bold ${feedback.correct ? "border-[#235b45] bg-[#e7f2e5] text-[#235b45]" : "border-[#a54539] bg-[#ffe4dc] text-[#9e3d2d]"}`}><span>{feedback.correct ? <><Check className="mr-1 inline" size={16} /> Đúng: {activeGuardian.name} tấn công, +{trainingRule.xpCorrect} XP Huấn luyện.</> : <><X className="mr-1 inline" size={16} /> Sai: {opponent.name} phản công, +{trainingRule.xpIncorrect} XP Huấn luyện.</>} <span className="font-normal">{question?.explanation}</span></span><button onClick={() => advanceBattle()} className="border-2 border-[#172a48] bg-[#f6b73c] px-3 py-2 text-[#172a48] shadow-[2px_2px_0_#172a48]">{feedback.ended ? "Kết thúc lượt luyện" : "Lượt tiếp"}</button></div>}</div>
    </article>}
    {!trainingActive && nextTechnique && <p className="mt-4 border-l-4 border-[#f6b73c] bg-[#fff8da] px-4 py-3 text-sm text-[#4f3d1e]">Mốc kỹ thuật kế tiếp: <b>Cấp {nextTechnique.level} — {nextTechnique.name}</b> ({nextTechnique.bonusDamage ? `+${nextTechnique.bonusDamage} sát thương trong Võ đài` : "kỹ thuật nền"}).</p>}
    {!trainingActive && <TrainingArchive guardianName={activeGuardian.name} timeline={guardianXpTimeline} history={guardianHistory} />}
  </section>;
}
