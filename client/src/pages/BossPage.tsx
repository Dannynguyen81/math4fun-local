/** Math4Fun Boss page — Field Journal Quest turns verified review questions into short, turn-based combat with clear feedback. */
import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, Crown, Lock, RotateCcw, ShieldAlert, Sparkles, Swords, X, Zap } from "lucide-react";
import { ARENA_IMAGE, BOSS_QUESTION_IDS, QUESTIONS_BY_ID } from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";

export default function BossPage() {
  const { isBossUnlocked, progress, hitBoss, resetProgress } = useGame();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [turn, setTurn] = useState<"idle" | "correct" | "wrong">("idle");
  const [playerHp, setPlayerHp] = useState(100);
  const question = QUESTIONS_BY_ID[BOSS_QUESTION_IDS[questionIndex]];
  const bossHp = progress.bossHp;
  const defeated = progress.bossDefeated;

  function submit(answer: number) {
    if (turn !== "idle" || defeated) return;
    setSelectedAnswer(answer);
    if (answer === question.answer) {
      hitBoss(25);
      setTurn("correct");
    } else {
      setPlayerHp((current) => Math.max(0, current - 18));
      setTurn("wrong");
    }
  }

  function nextTurn() {
    setSelectedAnswer(null);
    setTurn("idle");
    setQuestionIndex((index) => (index + 1) % BOSS_QUESTION_IDS.length);
  }

  if (!isBossUnlocked) return <section className="overflow-hidden border-2 border-[#172a48] bg-[#172a48] text-white shadow-[6px_6px_0_#f6b73c]"><div className="relative h-52"><img src={ARENA_IMAGE} alt="Đấu trường Boss Atlas" className="h-full w-full object-cover opacity-55" /><div className="absolute inset-0 bg-gradient-to-t from-[#172a48] via-[#172a48]/50 to-transparent" /><div className="absolute inset-x-5 bottom-5"><span className="field-tag border-white/30 bg-white/10 text-white"><Lock size={13} /> BOSS RADAR</span><h1 className="mt-3 font-display text-4xl font-black">Atlas đang chờ</h1></div></div><div className="p-6"><p className="max-w-2xl text-sm leading-relaxed text-[#d5dfed]">Atlas chỉ chấp nhận lời thách đấu khi bốn trạm đầu được làm chủ. Hoàn thành các nhiệm vụ trong bản đồ để chứng minh bạn đã nắm quy luật dãy số.</p><Link href="/map" className="mt-5 inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-3 font-bold text-[#172a48] shadow-[3px_3px_0_white]"><Swords size={16} /> Trở về tuyến đường</Link></div></section>;

  return <section>
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">BOSS COMBAT · thử thách tổng hợp</p><h1 className="font-display text-4xl font-black tracking-tight">Atlas — Người giữ kho lưu trữ</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#58708b]">Mỗi đáp án đúng tung một đòn Pattern Spark và gây 25 sát thương. Đáp án sai khiến Atlas phản công 18 sát thương.</p></div><span className="field-tag"><Crown size={14} /> {defeated ? "Đã chiến thắng" : "Đang giao chiến"}</span></div>
    {defeated ? <article className="overflow-hidden border-2 border-[#172a48] bg-[#172a48] text-white shadow-[6px_6px_0_#f6b73c]"><div className="relative h-56"><img src={ARENA_IMAGE} alt="Đấu trường Boss Atlas" className="h-full w-full object-cover opacity-70" /><div className="absolute inset-0 bg-gradient-to-t from-[#172a48] to-transparent" /><div className="absolute inset-x-5 bottom-5"><span className="field-tag border-white/25 bg-white/10 text-white"><Check size={13} className="text-[#f6b73c]" /> ARCHIVE CLEARED</span><h2 className="mt-3 font-display text-4xl font-black">Atlas đã trao dấu ấn cuối.</h2></div></div><div className="flex flex-wrap items-center justify-between gap-4 p-6"><p className="max-w-xl text-sm leading-relaxed text-[#d5dfed]">Bạn đã hoàn thành trận Boss và mở guardian Atlas trong Bộ sưu tập. Tiến độ vẫn được lưu riêng trên máy local.</p><div className="flex gap-3"><Link href="/collection" className="border-2 border-[#172a48] bg-[#f6b73c] px-4 py-3 font-bold text-[#172a48] shadow-[3px_3px_0_white]">Xem dấu ấn</Link><button onClick={resetProgress} className="inline-flex items-center gap-2 border-2 border-white/50 bg-white/10 px-4 py-3 font-bold"><RotateCcw size={15} /> Chơi lại từ đầu</button></div></div></article> : <div className="overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] shadow-[6px_6px_0_#172a48]"><div className="relative min-h-64 overflow-hidden bg-[#172a48] p-5 sm:min-h-80"><img src={ARENA_IMAGE} alt="Đấu trường Boss Atlas" className="absolute inset-0 h-full w-full object-cover opacity-70" /><div className="absolute inset-0 bg-gradient-to-r from-[#172a48]/90 via-[#172a48]/40 to-[#172a48]/85" /><div className="relative grid gap-6 sm:grid-cols-2"><div className="pt-3"><p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#f6b73c]">AN NHIÊN · HP {playerHp}/100</p><div className="mt-2 h-3 overflow-hidden rounded-full border border-white/50 bg-[#172a48]"><div style={{ width: `${playerHp}%` }} className="h-full bg-[#3e9b7a] transition-[width] duration-300" /></div><motion.div animate={turn === "wrong" ? { x: [0, -8, 8, -4, 0] } : { x: 0 }} transition={{ duration: 0.28 }} className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-[#f6b73c] bg-[#172a48]/80 px-4 py-2 font-display text-2xl font-black text-white"><Zap className="text-[#f6b73c]" /> Voltix</motion.div></div><div className="sm:text-right"><p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#f6b73c]">BOSS ATLAS · HP {bossHp}/100</p><div className="mt-2 h-3 overflow-hidden rounded-full border border-white/50 bg-[#172a48]"><motion.div animate={{ width: `${bossHp}%` }} className="h-full bg-[#ee6b4e]" /></div><motion.div animate={turn === "correct" ? { x: [0, 14, -10, 0], rotate: [0, 2, -2, 0] } : { x: 0, rotate: 0 }} transition={{ duration: 0.3 }} className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-white/60 bg-[#172a48]/80 px-4 py-2 font-display text-2xl font-black text-white"><Crown className="text-[#f6b73c]" /> Atlas</motion.div></div></div></div><div className="p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-2"><p className="section-kicker">Lượt {questionIndex + 1} · câu hỏi từ ngân hàng đã kiểm chứng</p><span className="field-tag"><ShieldAlert size={14} /> +25 / −18</span></div><p className="mt-4 font-display text-2xl font-black leading-tight sm:text-3xl">{question.prompt}</p><p className="mt-2 text-xs font-semibold text-[#58708b]">Nguồn: {question.source}</p><div className="mt-5 grid grid-cols-2 gap-3">{question.choices.map((answer) => { const isCorrect = answer === question.answer; const isSelected = answer === selectedAnswer; let state = "border-[#172a48] bg-white hover:bg-[#fff0b6]"; if (turn !== "idle" && isCorrect) state = "border-[#3e9b7a] bg-[#e7f2e5]"; if (turn === "wrong" && isSelected) state = "border-[#ee6b4e] bg-[#ffe4dc]"; return <button key={answer} onClick={() => submit(answer)} disabled={turn !== "idle" || playerHp === 0} className={`answer-choice border-2 px-4 py-3 text-left font-display text-2xl font-black shadow-[2px_2px_0_#172a48] transition disabled:cursor-default ${state}`}>{answer}</button>; })}</div>{turn !== "idle" && <div className={turn === "correct" ? "mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#e7f2e5] px-4 py-3 text-sm font-bold text-[#235b45]" : "mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#ffe4dc] px-4 py-3 text-sm font-bold text-[#9e3d2d]"}>{turn === "correct" ? <span><Check className="mr-1 inline-block" size={17} /> Pattern Spark đánh trúng! {question.explanation}</span> : <span><X className="mr-1 inline-block" size={17} /> Atlas phản công. {question.explanation}</span>}<button onClick={nextTurn} className="whitespace-nowrap border-2 border-[#172a48] bg-[#f6b73c] px-3 py-2 text-[#172a48] shadow-[2px_2px_0_#172a48]">Lượt tiếp <Swords className="ml-1 inline-block" size={14} /></button></div>}{playerHp === 0 && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-2 border-[#ee6b4e] bg-[#ffe4dc] p-4"><span className="font-bold text-[#9e3d2d]">Năng lượng đã cạn. Thử lại để ôn tập câu hỏi một lần nữa.</span><button onClick={() => { setPlayerHp(100); setSelectedAnswer(null); setTurn("idle"); }} className="border-2 border-[#172a48] bg-[#fffdf6] px-3 py-2 font-bold shadow-[2px_2px_0_#172a48]"><RotateCcw className="mr-1 inline-block" size={14} /> Hồi năng lượng</button></div>}</div></div>}
  </section>;
}
