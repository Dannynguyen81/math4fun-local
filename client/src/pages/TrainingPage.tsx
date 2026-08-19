/**
 * Field Journal Quest training arena: a paper-dossier PvP drill, not a gold farm.
 * Indigo ink, marigold prompts, spell motion and sound retain the expedition's tactile field-guide tone.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, MapPinned, ScrollText, Swords, Volume2, X, Zap } from "lucide-react";
import { ARENA_IMAGE, BATTLE_AUDIO, GUARDIANS, QUESTIONS_BY_ID, TRAINING_DIFFICULTIES, TRAINING_TECHNIQUES, getGuardian, getSpellForGuardian, getTrainingDifficulty, getTrainingTechnique, type TrainingDifficultyId } from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";
import { playElementSound, playFiveStreakSound } from "@/lib/magicAudio";

const elementColor: Record<string, string> = { "sấm": "#f6b73c", "lửa": "#ee6b4e", "nước": "#55a9dd", "gió": "#3e9b7a", "độc": "#8e69ad", "đất": "#b17a3d" };
function shuffle<T>(items: T[]) { return [...items].sort(() => Math.random() - 0.5); }

function TrainingSeal({ hasProfile }: { hasProfile: boolean }) {
  const specimen = GUARDIANS.find((guardian) => guardian.id === "pipra") ?? GUARDIANS[0];
  const href = hasProfile ? "/map" : "/start";
  return <section className="training-ticket overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] shadow-[6px_6px_0_#172a48]"><div className="training-ticket-cover relative bg-[#172a48] px-6 py-7 text-white"><div className="absolute right-0 top-0 h-full w-28 border-l-2 border-dashed border-[#172a48] bg-[#e8f0e4] [clip-path:polygon(42%_0,100%_0,100%_100%,0_100%)]"/><p className="section-kicker relative text-[#fff0b6]"><Lock size={13}/> PHIẾU SÂN LUYỆN · NIÊM PHONG</p><h1 className="relative mt-2 max-w-xl font-display text-4xl font-black">Võ đài cần một nhật ký đã ký</h1><p className="relative mt-3 max-w-2xl text-sm text-[#d5dfed]">{hasProfile ? "Hãy đánh thức guardian đầu tiên. Chỉ các chủ đề đã mở trên Bản đồ mới trở thành bài luyện." : "Ký nhật ký, mở một mốc và ghi đủ bằng chứng để đưa guardian vào sân luyện."}</p></div><div className="grid gap-5 p-5 lg:grid-cols-[1fr_250px]"><div><p className="section-kicker"><MapPinned size={13}/> ROUTE FRAGMENT · BA DẤU MỞ KHÓA</p><ol className="mt-4 space-y-3 border-l-2 border-dashed border-[#4d8b67] pl-5 text-sm"><li><b className="font-display text-lg">01 · Ký nhật ký</b><span className="block text-[#58708b]">Tạo một hồ sơ hành trình riêng.</span></li><li><b className="font-display text-lg">02 · Mở và hoàn tất một trạm</b><span className="block text-[#58708b]">Ghi 10 bằng chứng Toán ở một chủ đề.</span></li><li><b className="font-display text-lg">03 · Đánh thức guardian</b><span className="block text-[#58708b]">Huấn luyện mở và chỉ trao XP, không trao Gold.</span></li></ol><Link href={href} className="mt-5 inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-2.5 font-black text-[#172a48] shadow-[3px_3px_0_#172a48]"><ScrollText size={16}/>{hasProfile ? "Mở mốc trên Bản đồ" : "Ký nhật ký để mở sân"}</Link></div><aside className="border-2 border-dashed border-[#172a48] bg-[#fff8da] p-4 text-center"><p className="font-mono text-[9px] font-black tracking-[.15em] text-[#58708b]">MẪU VẬT SÂN LUYỆN</p><div className="guardian-stamp mx-auto mt-3 grid h-20 w-20 place-items-center bg-[#eef1fb]"><img src={specimen.sprite} alt={`Mẫu vật ${specimen.name}`} className="h-16 w-16 object-contain"/></div><span className="mt-2 inline-block border border-[#172a48] bg-[#fffdf6] px-2 py-0.5 font-mono text-[9px] font-black">NIÊM PHONG</span><p className="mt-3 font-display text-xl font-black">{specimen.name}</p><p className="text-[10px] font-bold tracking-[.1em] text-[#58708b]">MẪU VẬT · {specimen.element.toUpperCase()}</p><p className="mt-3 border-t-2 border-dashed border-[#d7d0bf] pt-3 text-xs text-[#58708b]">Phần thưởng: mở kỹ thuật mới theo cấp XP Huấn luyện.</p></aside></div></section>;
}

export default function TrainingPage() {
  const { profile, canTrainPets, startTrainingBattle, resolveBattleAnswer, advanceBattle, guardianTrainingLevel, audioEnabled } = useGame();
  const [selectedGuardianId, setSelectedGuardianId] = useState<string | null>(null);
  const [selectedOpponentId, setSelectedOpponentId] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<TrainingDifficultyId>("pathfinder");
  const [choices, setChoices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; playerDamage: number; bossDamage: number; ended: boolean } | null>(null);
  const [levelNote, setLevelNote] = useState<string | null>(null);
  const [streakBadge, setStreakBadge] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const battle = profile?.battle;
  const trainingActive = battle?.mode === "training" && battle.status === "active";
  const team = profile?.collectedGuardianIds.filter((id) => id !== "atlas") ?? [];
  const activeGuardian = getGuardian(battle?.guardianId ?? selectedGuardianId ?? team[0] ?? "") ?? GUARDIANS[0];
  const opponent = getGuardian(battle?.opponentGuardianId ?? "") ?? GUARDIANS.find((guardian) => guardian.id !== activeGuardian.id && guardian.id !== "atlas") ?? GUARDIANS[1];
  const opponentCandidates = GUARDIANS.filter((guardian) => guardian.id !== activeGuardian.id && guardian.id !== "atlas");
  const spell = getSpellForGuardian(activeGuardian);
  const trainingLevel = guardianTrainingLevel(activeGuardian.id);
  const technique = getTrainingTechnique(trainingLevel);
  const trainingRule = getTrainingDifficulty(battle?.trainingDifficulty ?? selectedDifficulty);
  const nextTechnique = TRAINING_TECHNIQUES.find((candidate) => candidate.level > trainingLevel);
  const questionId = battle?.questionIds[battle.questionIndex ?? 0] ?? "";
  const question = trainingActive ? QUESTIONS_BY_ID[questionId] : undefined;

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

  if (!profile) return <TrainingSeal hasProfile={false}/>;
  if (!canTrainPets) return <TrainingSeal hasProfile/>;

  function begin() {
    if (selectedGuardianId && selectedOpponentId && startTrainingBattle(selectedGuardianId, selectedOpponentId, selectedDifficulty)) playElementSound(activeGuardian.element, audioEnabled, "ready");
  }
  function submit(answer: number) {
    if (!question || feedback) return;
    const result = resolveBattleAnswer(answer, spell.id);
    if (!result) return;
    setSelectedAnswer(answer); setFeedback(result);
    playElementSound(activeGuardian.element, audioEnabled, result.correct ? "cast" : "counter");
    if (result.streakMilestone) { setStreakBadge(result.streakMilestone.streak); playFiveStreakSound(audioEnabled); }
    if (result.trainingLevelUp) { const unlocked = getTrainingTechnique(result.trainingLevelUp.nextLevel); setLevelNote(`${activeGuardian.name} lên cấp Huấn luyện ${result.trainingLevelUp.nextLevel}! Mở kỹ thuật ${unlocked.name} (${unlocked.bonusDamage ? `+${unlocked.bonusDamage} sát thương` : "kỹ thuật nền"}).`); }
  }
  const playerHp = battle?.playerHp ?? trainingRule.playerHp;
  const opponentHp = battle?.bossHp ?? trainingRule.opponentHp;

  return <section className="relative">
    <audio ref={audioRef} src={BATTLE_AUDIO} loop preload="auto" />
    <AnimatePresence>{streakBadge && <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="pointer-events-none absolute inset-x-4 top-14 z-30 mx-auto max-w-sm border-2 border-[#f6b73c] bg-[#172a48]/95 p-4 text-center text-white shadow-[5px_5px_0_#f6b73c]"><div className="text-xl tracking-[.25em] text-[#f6b73c]">✦ ✦ ✦</div><b className="font-display text-2xl">Combo {streakBadge} dấu đúng!</b><p className="mt-1 text-xs text-[#fff0b6]">Nhật ký ghi nhận chuỗi suy luận xuất sắc. Võ đài vẫn chỉ trao XP.</p></motion.div>}</AnimatePresence>
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker"><Swords size={13}/> HUẤN LUYỆN PET · XP ONLY</p><h1 className="font-display text-4xl font-black">Võ đài bài tập</h1><p className="mt-2 max-w-2xl text-sm text-[#58708b]">Đúng để ra đòn, sai để bị phản công. Võ đài không trao Gold; guardian nhận XP và lên cấp Huấn luyện. Rời võ đài, HP luôn hồi đầy.</p></div><span className="field-tag"><Zap size={14}/> {activeGuardian.name}: cấp {trainingLevel} · {technique.name}{technique.bonusDamage ? ` +${technique.bonusDamage}` : ""}</span></div>
    {!trainingActive ? <article className="overflow-hidden border-2 border-[#172a48] bg-[#172a48] text-white shadow-[6px_6px_0_#f6b73c]"><div className="relative h-52"><img src={ARENA_IMAGE} alt="Võ đài Huấn luyện Pet" className="h-full w-full object-cover opacity-60"/><div className="absolute inset-0 bg-gradient-to-t from-[#172a48] via-[#172a48]/45 to-transparent"/><div className="absolute inset-x-5 bottom-5"><p className="field-tag border-white/30 bg-white/10 text-white">PHIẾU GHÉP KÈO · CÂU HỎI TỪ TRẠM ĐÃ MỞ</p><h2 className="mt-2 font-display text-4xl font-black">Chọn đội hình chiến thuật</h2></div></div><div className="space-y-6 p-5"><div><p className="section-kicker text-[#fff0b6]">01 · COMPANION CỦA EM</p><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{team.map((guardianId) => { const guardian = getGuardian(guardianId); if (!guardian) return null; const selected = guardianId === selectedGuardianId; return <button key={guardianId} onClick={() => setSelectedGuardianId(guardianId)} className={`flex items-center gap-3 border-2 p-3 text-left shadow-[2px_2px_0_#f6b73c] ${selected ? "border-[#f6b73c] bg-[#fff0b6] text-[#172a48]" : "border-white/70 bg-white/10"}`}><img src={guardian.sprite} alt="" className="h-14 w-14 object-contain"/><span><b className="font-display text-xl">{guardian.name}</b><small className="block text-xs">{guardian.element} · Cấp {guardianTrainingLevel(guardian.id)}</small></span></button>; })}</div></div><div><p className="section-kicker text-[#fff0b6]">02 · PET ĐỐI THỦ</p><div className="mt-3 flex gap-3 overflow-x-auto pb-2">{opponentCandidates.map((guardian) => { const selected = guardian.id === selectedOpponentId; return <button key={guardian.id} onClick={() => setSelectedOpponentId(guardian.id)} className={`min-w-32 border-2 p-3 text-center shadow-[2px_2px_0_#f6b73c] ${selected ? "border-[#f6b73c] bg-[#fff0b6] text-[#172a48]" : "border-white/70 bg-white/10"}`}><img src={guardian.sprite} alt="" className="mx-auto h-14 w-14 object-contain"/><b className="mt-1 block font-display text-lg">{guardian.name}</b><small className="block text-[10px] uppercase">{guardian.element}</small></button>; })}</div></div><div><p className="section-kicker text-[#fff0b6]">03 · CẤP ĐỘ HUẤN LUYỆN</p><div className="mt-3 grid gap-3 lg:grid-cols-3">{Object.values(TRAINING_DIFFICULTIES).map((rule) => { const selected = rule.id === selectedDifficulty; return <button key={rule.id} onClick={() => setSelectedDifficulty(rule.id)} className={`border-2 p-4 text-left shadow-[2px_2px_0_#f6b73c] ${selected ? "border-[#f6b73c] bg-[#fff0b6] text-[#172a48]" : "border-white/70 bg-white/10"}`}><b className="font-display text-xl">{rule.label}</b><span className="mt-1 block text-xs">{rule.fieldNote}</span><span className="mt-3 block font-mono text-[10px] font-black tracking-[.1em]">{rule.questionCount} CÂU · HP {rule.playerHp}/{rule.opponentHp} · +{rule.xpCorrect} XP ĐÚNG</span></button>; })}</div></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-white/40 pt-5"><p className="max-w-xl text-sm text-[#d5dfed]">{trainingRule.questionCount} câu từ các trạm đã mở. Không Gold, không mất guardian; rời võ đài là HP hồi đầy.</p><button onClick={begin} className="inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-5 py-3 font-black text-[#172a48] shadow-[3px_3px_0_white]"><Swords size={17}/> Xác nhận kèo đấu</button></div></div></article> : <article className="overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] shadow-[6px_6px_0_#172a48]"><div className="relative min-h-72 overflow-hidden bg-[#172a48] p-5"><img src={ARENA_IMAGE} alt="Trận Huấn luyện Pet" className="absolute inset-0 h-full w-full object-cover opacity-55"/><div className="absolute inset-0 bg-gradient-to-r from-[#172a48]/90 via-[#172a48]/30 to-[#172a48]/90"/><AnimatePresence>{feedback && <motion.div initial={{opacity:0, scale:.85}} animate={{opacity:1, scale:1}} exit={{opacity:0}} className="absolute inset-0 z-10 grid place-items-center text-7xl" style={{color: elementColor[activeGuardian.element]}}>{feedback.correct ? "✦" : "✕"}</motion.div>}</AnimatePresence><div className="relative grid gap-6 sm:grid-cols-2"><motion.div animate={feedback?.playerDamage ? {x:[0,-8,8,0]} : {x:0}}><p className="font-mono text-[10px] font-bold tracking-[.14em] text-[#f6b73c]">{activeGuardian.name.toUpperCase()} · HP {playerHp}/{trainingRule.playerHp}</p><div className="mt-2 h-3 border border-white/60 bg-[#172a48]"><motion.div animate={{width:`${(playerHp/trainingRule.playerHp)*100}%`}} className="h-full bg-[#3e9b7a]"/></div><img src={activeGuardian.sprite} alt={activeGuardian.name} className="mt-4 h-32 w-32 object-contain"/></motion.div><motion.div animate={feedback?.bossDamage ? {x:[0,9,-9,0]} : {x:0}} className="text-right"><p className="font-mono text-[10px] font-bold tracking-[.14em] text-[#f6b73c]">ĐỐI THỦ · {opponent.name.toUpperCase()} · HP {opponentHp}/{trainingRule.opponentHp}</p><div className="mt-2 h-3 border border-white/60 bg-[#172a48]"><motion.div animate={{width:`${(opponentHp/trainingRule.opponentHp)*100}%`}} className="ml-auto h-full bg-[#ee6b4e]"/></div><img src={opponent.sprite} alt={opponent.name} className="ml-auto mt-4 h-32 w-32 object-contain"/></motion.div></div></div><div className="p-5"><div className="flex flex-wrap items-center justify-between gap-2"><p className="section-kicker">{trainingRule.label.toUpperCase()} · LƯỢT {(battle?.questionIndex ?? 0) + 1}/{battle?.questionIds.length ?? 5} · {question?.difficulty} · KHÔNG GOLD</p><span className="field-tag"><Volume2 size={13}/> {audioEnabled ? "hiệu ứng bật" : "hiệu ứng tắt"}</span></div><h2 className="mt-4 font-display text-3xl font-black">{question?.prompt}</h2><p className="mt-2 text-xs text-[#58708b]">Nguồn: {question?.source}</p><div className="mt-5 grid grid-cols-2 gap-3">{choices.map((answer, index) => { const isCorrect = answer === question?.answer; const isSelected = answer === selectedAnswer; const tone = feedback && isCorrect ? "border-[#3e9b7a] bg-[#e7f2e5]" : feedback && isSelected ? "border-[#ee6b4e] bg-[#ffe4dc]" : "border-[#172a48] bg-white hover:bg-[#fff0b6]"; return <button key={answer} onClick={() => submit(answer)} disabled={Boolean(feedback)} className={`border-2 px-4 py-3 text-left font-display text-2xl font-black shadow-[2px_2px_0_#172a48] ${tone}`}>{String.fromCharCode(65+index)}. {answer}</button>; })}</div>{feedback && <div className={`mt-4 flex flex-wrap items-center justify-between gap-3 border-2 p-4 text-sm font-bold ${feedback.correct ? "border-[#235b45] bg-[#e7f2e5] text-[#235b45]" : "border-[#a54539] bg-[#ffe4dc] text-[#9e3d2d]"}`}><span>{feedback.correct ? <><Check className="mr-1 inline" size={16}/> Đúng: {activeGuardian.name} tấn công, +{trainingRule.xpCorrect} XP Huấn luyện.</> : <><X className="mr-1 inline" size={16}/> Sai: {opponent.name} phản công, +{trainingRule.xpIncorrect} XP Huấn luyện.</>} <span className="font-normal">{question?.explanation}</span></span>{feedback.ended ? <button onClick={() => advanceBattle()} className="border-2 border-[#172a48] bg-[#f6b73c] px-3 py-2 text-[#172a48] shadow-[2px_2px_0_#172a48]">Kết thúc lượt luyện</button> : <button onClick={() => advanceBattle()} className="border-2 border-[#172a48] bg-[#f6b73c] px-3 py-2 text-[#172a48] shadow-[2px_2px_0_#172a48]">Lượt tiếp</button>}</div>}{levelNote && <div className="mt-4 border-2 border-[#f6b73c] bg-[#fff0b6] p-3 text-sm font-black"><Zap className="mr-1 inline" size={15}/>{levelNote}<button onClick={() => setLevelNote(null)} className="ml-3 underline">Đã rõ</button></div>}</div></article>}
    {!trainingActive && nextTechnique && <p className="mt-4 border-l-4 border-[#f6b73c] bg-[#fff8da] px-4 py-3 text-sm text-[#4f3d1e]">Mốc kỹ thuật kế tiếp: <b>Cấp {nextTechnique.level} — {nextTechnique.name}</b> ({nextTechnique.bonusDamage ? `+${nextTechnique.bonusDamage} sát thương trong Võ đài` : "kỹ thuật nền"}). Mỗi câu đúng nhận 20 XP Huấn luyện, câu sai vẫn nhận 5 XP.</p>}
  </section>;
}
