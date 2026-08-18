/** Field Journal Quest — a hard-question archive battle with persistent anti-repeat evidence. */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Crown, Flame, Lock, ShieldAlert, Sparkles, Swords, Volume2, Waves, Wind, X, Zap } from "lucide-react";
import { ARENA_IMAGE, BATTLE_AUDIO, BOSS_QUESTION_IDS, QUESTIONS_BY_ID, SPELLS } from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";

function randomChoices(choices: number[]) { return [...choices].sort(() => Math.random() - 0.5); }
function spellIcon(id: string) { return id === "thunder" ? Zap : id === "flame" ? Flame : id === "tide" ? Waves : id === "gust" ? Wind : Sparkles; }

export default function BossPage() {
  const { profile, isBossUnlocked, startBattle, resolveBattleAnswer, advanceBattle, audioEnabled } = useGame();
  const [selectedSpell, setSelectedSpell] = useState("thunder");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [choices, setChoices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ correct: boolean; playerDamage: number; bossDamage: number; ended: boolean } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const battle = profile?.battle;
  const status = battle?.status ?? "idle";
  const question = status === "active" ? QUESTIONS_BY_ID[battle?.questionIds[battle.questionIndex] ?? ""] : undefined;
  const team = useMemo(() => profile?.teamGuardianIds ?? [], [profile?.teamGuardianIds]);
  const unusedBossQuestions = useMemo(() => profile ? BOSS_QUESTION_IDS.filter((id) => !profile.bossQuestionHistory.includes(id)).length : 0, [profile]);

  useEffect(() => { if (question) { setChoices(randomChoices(question.choices)); setSelectedAnswer(null); setFeedback(null); } }, [question?.id]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.22;
    if (audioEnabled && status === "active") audio.play().catch(() => undefined); else audio.pause();
  }, [audioEnabled, status]);

  function pulse(frequency: number) {
    if (!audioEnabled || typeof window === "undefined") return;
    const context = new AudioContext(); const oscillator = context.createOscillator(); const gain = context.createGain();
    oscillator.frequency.value = frequency; oscillator.type = "triangle";
    gain.gain.setValueAtTime(0.055, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.22);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.22);
  }
  function begin() { if (startBattle()) { pulse(520); audioRef.current?.play().catch(() => undefined); } }
  function submit(answer: number) {
    if (!question || feedback) return;
    const result = resolveBattleAnswer(answer, selectedSpell);
    if (!result) return;
    setSelectedAnswer(answer); setFeedback(result); pulse(result.correct ? 760 : 180);
  }
  function next() { if (status === "active" && !feedback?.ended) advanceBattle(); }

  if (!profile) return <section className="evidence-card border-2 border-[#172a48] bg-[#fffdf6] p-6 shadow-[5px_5px_0_#172a48]"><h1 className="font-display text-4xl font-black">Đấu trường chưa có người thách đấu</h1><Link href="/start" className="mt-5 inline-flex border-2 border-[#172a48] bg-[#f6b73c] px-4 py-2.5 font-bold shadow-[2px_2px_0_#172a48]">Tạo hồ sơ</Link></section>;
  if (!isBossUnlocked) return <section className="overflow-hidden border-2 border-[#172a48] bg-[#172a48] text-white shadow-[6px_6px_0_#f6b73c]"><div className="relative h-52"><img src={ARENA_IMAGE} alt="Đấu trường Boss Atlas" className="h-full w-full object-cover opacity-55" /><div className="absolute inset-0 bg-gradient-to-t from-[#172a48] via-[#172a48]/50 to-transparent" /><div className="absolute inset-x-5 bottom-5"><span className="field-tag border-white/30 bg-white/10 text-white"><Lock size={13} /> BOSS RADAR</span><h1 className="mt-3 font-display text-4xl font-black">Atlas đang chờ</h1></div></div><div className="p-6"><p className="max-w-2xl text-sm leading-relaxed text-[#d5dfed]">Thu phục <b>2 guardian</b> bằng 20 câu đúng riêng biệt để mở Boss. Mỗi trận dùng 5 câu H riêng, không lấy lại câu thu phục guardian.</p><Link href="/map" className="mt-5 inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-3 font-bold text-[#172a48] shadow-[3px_3px_0_white]"><Swords size={16} /> Trở về tuyến đường</Link></div></section>;

  const playerHp = battle?.playerHp ?? 100;
  const bossHp = battle?.bossHp ?? 150;
  const hasFreshRun = unusedBossQuestions >= 5;
  const resultHeading = status === "victory" ? "Atlas đã trao dấu ấn cuối." : status === "defeat" ? "Atlas giữ được kho lưu trữ." : "Chọn phép rồi bước vào.";

  return <section>
    <audio ref={audioRef} src={BATTLE_AUDIO} loop preload="auto" />
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">BOSS COMBAT · 5 câu H riêng</p><h1 className="font-display text-4xl font-black tracking-tight">Atlas — Người giữ kho lưu trữ</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#58708b]">Atlas luôn phản công: trả lời đúng vẫn mất 6–14 HP tùy phép; trả lời sai mất <b>34 HP</b>. Mỗi trận rút năm câu khó <b>không lặp lại giữa các trận</b>.</p></div><span className="field-tag"><Crown size={14} /> {status === "active" ? `Lượt ${(battle?.questionIndex ?? 0) + 1}/5` : `${unusedBossQuestions} câu H chưa dùng`}</span></div>
    {status !== "active" ? <article className="overflow-hidden border-2 border-[#172a48] bg-[#172a48] text-white shadow-[6px_6px_0_#f6b73c]"><div className="relative h-56"><img src={ARENA_IMAGE} alt="Đấu trường ma thuật Atlas" className="h-full w-full object-cover opacity-70" /><div className="absolute inset-0 bg-gradient-to-t from-[#172a48] via-[#172a48]/60 to-transparent" /><div className="absolute inset-x-5 bottom-5"><span className="field-tag border-white/25 bg-white/10 text-white">{hasFreshRun ? <ShieldAlert size={13} className="text-[#f6b73c]" /> : <Lock size={13} className="text-[#f6b73c]" />} {hasFreshRun ? "5 CÂU H · KHÔNG LẶP" : "ARCHIVE ĐÃ HẾT CÂU MỚI"}</span><h2 className="mt-3 font-display text-4xl font-black">{resultHeading}</h2></div></div><div className="grid gap-5 p-6 lg:grid-cols-[1fr_auto]"><p className="max-w-2xl text-sm leading-relaxed text-[#d5dfed]">{!hasFreshRun ? `Atlas còn ${unusedBossQuestions} câu H chưa dùng — chưa đủ năm câu cho một trận mới. Math4Fun không lặp lại câu Boss đã xuất hiện.` : status === "victory" ? "Dấu ấn Atlas đã được ghi vào bộ sưu tập. Lần tới sẽ dùng năm câu H mới hoàn toàn." : status === "defeat" ? "Tiến độ trạm không hề bị xoá. Hãy xem lại gợi ý và thách đấu lại bằng năm câu khác." : "Phép thuật thay đổi sát thương và sức phản công; đáp án đúng mới là chìa khóa."}</p><button onClick={begin} disabled={!hasFreshRun} className="inline-flex h-fit items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-5 py-3 font-bold text-[#172a48] shadow-[3px_3px_0_white] disabled:cursor-not-allowed disabled:opacity-45"><Swords size={17} /> {status === "idle" ? "Bắt đầu trận 5 câu" : "Thách đấu lại"}</button></div></article> : <div className="overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] shadow-[6px_6px_0_#172a48]"><div className="relative min-h-64 overflow-hidden bg-[#172a48] p-5 sm:min-h-80"><img src={ARENA_IMAGE} alt="Đấu trường Boss Atlas" className="absolute inset-0 h-full w-full object-cover opacity-70" /><div className="absolute inset-0 bg-gradient-to-r from-[#172a48]/90 via-[#172a48]/35 to-[#172a48]/90" /><div className="relative grid gap-6 sm:grid-cols-2"><motion.div animate={feedback?.playerDamage ? { x: [0, -7, 7, -4, 0] } : { x: 0 }} transition={{ duration: 0.28 }} className="pt-3"><p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#f6b73c]">{profile.name.toUpperCase()} · HP {playerHp}/100</p><div className="mt-2 h-3 overflow-hidden border border-white/50 bg-[#172a48]"><motion.div animate={{ width: `${playerHp}%` }} className="h-full bg-[#3e9b7a]" /></div><div className="mt-7 flex flex-wrap gap-2">{team.length ? team.map((guardianId) => <span key={guardianId} className="border border-white/50 bg-[#172a48]/75 px-2 py-1 text-xs font-bold">{guardianId}</span>) : <span className="border border-white/50 bg-[#172a48]/75 px-2 py-1 text-xs">Đội trống — vẫn dùng phép cơ bản</span>}</div></motion.div><motion.div animate={feedback?.bossDamage ? { x: [0, 10, -8, 0] } : { x: 0 }} transition={{ duration: 0.3 }} className="sm:text-right"><p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#f6b73c]">BOSS ATLAS · HP {bossHp}/150</p><div className="mt-2 h-3 overflow-hidden border border-white/50 bg-[#172a48]"><motion.div animate={{ width: `${(bossHp / 150) * 100}%` }} className="h-full bg-[#ee6b4e]" /></div><div className="mt-8 inline-flex items-center gap-2 border-2 border-white/60 bg-[#172a48]/80 px-4 py-2 font-display text-2xl font-black text-white"><Crown className="text-[#f6b73c]" /> Atlas</div></motion.div></div></div><div className="p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-2"><p className="section-kicker">Câu H · archive pool {BOSS_QUESTION_IDS.length} câu</p><span className="field-tag"><Volume2 size={14} /> {audioEnabled ? "nhạc battle bật" : "nhạc battle tắt"}</span></div><p className="mt-4 font-display text-2xl font-black leading-tight sm:text-3xl">{question?.prompt}</p><p className="mt-2 text-xs font-semibold text-[#58708b]">Nguồn: {question?.source}</p><div className="mt-5"><p className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#58708b]">CHỌN MA THUẬT TRƯỚC KHI TRẢ LỜI</p><div className="mt-2 grid gap-2 sm:grid-cols-5">{SPELLS.map((spell) => { const Icon = spellIcon(spell.id); return <button key={spell.id} onClick={() => setSelectedSpell(spell.id)} disabled={Boolean(feedback)} className={`border-2 border-[#172a48] p-2 text-left text-xs shadow-[1px_1px_0_#172a48] ${selectedSpell === spell.id ? "bg-[#172a48] text-white" : `${spell.tone} text-[#172a48]`}`}><Icon size={15} /><b className="ml-1">{spell.name}</b><span className={`mt-1 block ${selectedSpell === spell.id ? "text-[#d5dfed]" : "text-[#58708b]"}`}>+{spell.damage} / -{spell.counterDamage}</span></button>; })}</div></div><div className="mt-5 grid grid-cols-2 gap-3">{choices.map((answer, index) => { const correct = answer === question?.answer; const selected = answer === selectedAnswer; const answerTone = feedback && correct ? "border-[#3e9b7a] bg-[#e7f2e5]" : feedback && selected ? "border-[#ee6b4e] bg-[#ffe4dc]" : "border-[#172a48] bg-white hover:bg-[#fff0b6]"; return <button key={`${question?.id}-${answer}`} onClick={() => submit(answer)} disabled={Boolean(feedback)} className={`answer-choice border-2 px-4 py-3 text-left font-display text-2xl font-black shadow-[2px_2px_0_#172a48] transition disabled:cursor-default ${answerTone}`}>{String.fromCharCode(65 + index)}. {answer}</button>; })}</div><AnimatePresence>{feedback && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={feedback.correct ? "mt-4 flex flex-wrap items-center justify-between gap-3 border-2 border-[#235b45] bg-[#e7f2e5] p-4 text-sm font-bold text-[#235b45]" : "mt-4 flex flex-wrap items-center justify-between gap-3 border-2 border-[#a54539] bg-[#ffe4dc] p-4 text-sm font-bold text-[#9e3d2d]"}><span>{feedback.correct ? <><Check className="mr-1 inline" size={17} /> Phép trúng Atlas −{feedback.bossDamage} HP; Atlas phản công −{feedback.playerDamage} HP.</> : <><X className="mr-1 inline" size={17} /> Sai đáp án: Atlas phản công mạnh −{feedback.playerDamage} HP.</>} <span className="font-normal">{question?.explanation}</span></span>{feedback.ended ? <span className="font-black">Trận đã kết thúc.</span> : <button onClick={next} className="whitespace-nowrap border-2 border-[#172a48] bg-[#f6b73c] px-3 py-2 text-[#172a48] shadow-[2px_2px_0_#172a48]">Lượt tiếp <Swords className="ml-1 inline" size={14} /></button>}</motion.div>}</AnimatePresence></div></div>}</section>;
}
