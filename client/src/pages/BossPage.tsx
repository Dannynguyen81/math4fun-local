// Field Journal Quest: parchment evidence meets an indigo arena; guardian seals and elemental magic remain the visual focus.
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Crown, Lock, ShieldAlert, Sparkles, Swords, Volume2, X } from "lucide-react";
import { ARENA_IMAGE, BATTLE_AUDIO, BOSS_QUESTION_IDS, getGuardian, getSpellForGuardian, GUARDIANS, MAGIC_MEDIA, QUESTIONS_BY_ID } from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";
import { playElementSound } from "@/lib/magicAudio";

type Feedback = { correct: boolean; playerDamage: number; bossDamage: number; ended: boolean };

const elementIcon: Record<string, string> = { "sấm": "ϟ", "lửa": "✦", "nước": "≈", "gió": "≋", "độc": "☾", "đất": "◆" };
const elementColor: Record<string, string> = { "sấm": "#f6b73c", "lửa": "#ee6b4e", "nước": "#55a9dd", "gió": "#3e9b7a", "độc": "#8e69ad", "đất": "#b17a3d" };

function shuffle(answers: number[]) {
  return [...answers].sort(() => Math.random() - 0.5);
}

function spellStyle(element: string): CSSProperties {
  return { "--spell-color": elementColor[element] } as CSSProperties;
}

function GuardianCaster({ guardianId, active, isCasting }: { guardianId: string; active: boolean; isCasting: boolean }) {
  const guardian = getGuardian(guardianId);
  if (!guardian) return null;
  return (
    <span className={`guardian-battle-avatar ${active ? "is-active" : ""} ${isCasting ? "is-casting" : ""}`} style={spellStyle(guardian.element)}>
      <motion.img
        animate={{ y: active ? [-3, 3, -3] : 0, rotate: isCasting ? [0, -5, 6, 0] : 0, scale: isCasting ? [1, 1.1, 1] : 1 }}
        transition={{ duration: isCasting ? 0.42 : 2, repeat: isCasting ? 0 : Infinity, ease: "easeInOut" }}
        src={guardian.sprite}
        alt={guardian.name}
      />
      <span>{elementIcon[guardian.element]} {guardian.name}</span>
    </span>
  );
}

export default function BossPage() {
  const { profile, isBossUnlocked, startBattle, resolveBattleAnswer, advanceBattle, audioEnabled } = useGame();
  const [selectedGuardianId, setSelectedGuardianId] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [choices, setChoices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const battle = profile?.battle;
  const status = battle?.status ?? "idle";
  const questionId = battle?.questionIds[battle.questionIndex ?? 0] ?? "";
  const question = status === "active" ? QUESTIONS_BY_ID[questionId] : undefined;
  const team = useMemo(() => profile?.teamGuardianIds ?? [], [profile?.teamGuardianIds]);
  const selectedGuardian = getGuardian(selectedGuardianId ?? team[0] ?? "") ?? GUARDIANS.find((guardian) => guardian.id === "dexo")!;
  const spell = getSpellForGuardian(selectedGuardian);
  const studyReel = MAGIC_MEDIA[selectedGuardian.element];
  const unusedBossQuestions = useMemo(
    () => (profile ? BOSS_QUESTION_IDS.filter((id) => !profile.bossQuestionHistory.includes(id)).length : 0),
    [profile],
  );

  useEffect(() => {
    if (!selectedGuardianId || !team.includes(selectedGuardianId)) {
      setSelectedGuardianId(team.includes("dexo") ? "dexo" : team[0] ?? null);
    }
  }, [team, selectedGuardianId]);

  useEffect(() => {
    if (question) {
      setChoices(shuffle(question.choices));
      setSelectedAnswer(null);
      setFeedback(null);
    }
  }, [question?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.22;
    if (audioEnabled && status === "active") audio.play().catch(() => undefined);
    else audio.pause();
  }, [audioEnabled, status]);

  function begin() {
    if (startBattle()) {
      playElementSound(selectedGuardian.element, audioEnabled, "ready");
      audioRef.current?.play().catch(() => undefined);
    }
  }

  function submit(answer: number) {
    if (!question || feedback) return;
    const result = resolveBattleAnswer(answer, spell.id);
    if (!result) return;
    setSelectedAnswer(answer);
    setFeedback(result);
    playElementSound(selectedGuardian.element, audioEnabled, result.correct ? "cast" : "counter");
  }

  function next() {
    if (status === "active" && !feedback?.ended) advanceBattle();
  }

  if (!profile) {
    return (
      <section className="boss-unopened-dossier">
        <header className="boss-dossier-cover">
          <div>
            <span className="field-tag border-white/30 bg-white/10 text-white"><ShieldAlert size={13} /> ARENA DOSSIER · NIÊM PHONG</span>
            <h1>Hồ sơ đấu trường Atlas</h1>
            <p>Đấu trường chưa gọi tên người thách đấu. Hãy lập hồ sơ, thu thập bằng chứng học tập và mở khóa niêm phong cuối tuyến.</p>
          </div>
          <div className="boss-seal-stamp"><Lock size={20} /><b>KHÓA</b><small>5 CÂU H</small></div>
        </header>
        <div className="boss-dossier-body">
          <div className="boss-route-evidence">
            <p className="section-kicker">LỘ TRÌNH MỞ NIÊM PHONG</p>
            {[
              ["01", "Lập hồ sơ thám hiểm", "Chọn tên và guardian đầu tiên."],
              ["02", "Ghi đủ 20 bằng chứng", "Hoàn thành 2 trạm mastery, mỗi trạm 10 câu."],
              ["03", "Gọi Atlas ra đấu trường", "Chọn guardian và dùng đúng phép hệ."],
            ].map(([step, title, note], index) => (
              <div className="boss-evidence-step" key={step}>
                <b>{step}</b><span aria-hidden="true" /><div><strong>{title}</strong><small>{note}</small></div>{index < 2 && <i aria-hidden="true" />}
              </div>
            ))}
          </div>
          <aside className="boss-reward-specimen">
            <span className="field-tag"><Crown size={13} /> PHẦN THƯỞNG CUỐI TUYẾN</span>
            <img src={GUARDIANS.find((guardian) => guardian.id === "atlas")?.sprite} alt="Bóng niêm phong của Atlas" />
            <b>Atlas đang giữ 5 câu H</b>
            <p>Mỗi lượt có phản công. Guardian và Sổ Phép sẽ là bằng chứng em mang vào đấu trường.</p>
          </aside>
        </div>
        <footer className="boss-dossier-footer">
          <span>Điểm xuất phát được đánh dấu bằng la bàn Marigold.</span>
          <Link href="/start" className="boss-dossier-cta"><Swords size={16} /> Mở hồ sơ thám hiểm</Link>
        </footer>
      </section>
    );
  }

  if (!isBossUnlocked) {
    return <section className="overflow-hidden border-2 border-[#172a48] bg-[#172a48] text-white shadow-[6px_6px_0_#f6b73c]"><div className="relative h-52"><img src={ARENA_IMAGE} alt="Đấu trường Boss Atlas" className="h-full w-full object-cover opacity-55" /><div className="absolute inset-0 bg-gradient-to-t from-[#172a48] via-[#172a48]/50 to-transparent" /><div className="absolute inset-x-5 bottom-5"><span className="field-tag border-white/30 bg-white/10 text-white"><Lock size={13} /> BOSS RADAR</span><h1 className="mt-3 font-display text-4xl font-black">Atlas đang chờ</h1></div></div><div className="p-6"><p className="max-w-2xl text-sm leading-relaxed text-[#d5dfed]">Thu phục 2 guardian bằng 20 câu đúng riêng biệt để mở Boss. Mỗi guardian chỉ dùng đúng phép của hệ mình: Dexo (Pikachu) là hệ Sấm sét.</p><Link href="/map" className="mt-5 inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-3 font-bold text-[#172a48] shadow-[3px_3px_0_white]"><Swords size={16} /> Trở về tuyến đường</Link></div></section>;
  }

  const playerHp = battle?.playerHp ?? 100;
  const bossHp = battle?.bossHp ?? 150;
  const hasFreshRun = unusedBossQuestions >= 5;

  return (
    <section>
      <audio ref={audioRef} src={BATTLE_AUDIO} loop preload="auto" />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">BOSS COMBAT · GUARDIAN SPELLS</p><h1 className="font-display text-4xl font-black tracking-tight">Atlas — Người giữ kho lưu trữ</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#58708b]">Chọn guardian để gọi đúng phép hệ của bạn ấy. Trả lời đúng vẫn nhận phản công 6–14 HP; sai mất 34 HP. Mỗi trận rút 5 câu H không lặp.</p></div><span className="field-tag"><Crown size={14} /> {status === "active" ? `Lượt ${(battle?.questionIndex ?? 0) + 1}/5` : `${unusedBossQuestions} câu H chưa dùng`}</span></div>

      {status !== "active" ? (
        <article className="overflow-hidden border-2 border-[#172a48] bg-[#172a48] text-white shadow-[6px_6px_0_#f6b73c]"><div className="relative h-56"><img src={ARENA_IMAGE} alt="Đấu trường ma thuật Atlas" className="h-full w-full object-cover opacity-70" /><div className="absolute inset-0 bg-gradient-to-t from-[#172a48] via-[#172a48]/60 to-transparent" /><div className="absolute inset-x-5 bottom-5"><span className="field-tag border-white/25 bg-white/10 text-white">{hasFreshRun ? <ShieldAlert size={13} className="text-[#f6b73c]" /> : <Lock size={13} className="text-[#f6b73c]" />} {hasFreshRun ? "5 CÂU H · KHÔNG LẶP" : "ARCHIVE ĐÃ HẾT CÂU MỚI"}</span><h2 className="mt-3 font-display text-4xl font-black">{status === "victory" ? "Atlas đã trao dấu ấn cuối." : status === "defeat" ? "Atlas giữ được kho lưu trữ." : "Chọn guardian rồi bước vào."}</h2></div></div><div className="grid gap-5 p-6 lg:grid-cols-[1fr_auto]"><p className="max-w-2xl text-sm leading-relaxed text-[#d5dfed]">{!hasFreshRun ? `Atlas còn ${unusedBossQuestions} câu H chưa dùng — chưa đủ năm câu cho một trận mới.` : "Mỗi guardian có một phép riêng theo nguyên tố. Dexo (Pikachu) dùng Tia Chớp; không có phép Gió cho Pikachu."}</p><button onClick={begin} disabled={!hasFreshRun} className="inline-flex h-fit items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-5 py-3 font-bold text-[#172a48] shadow-[3px_3px_0_white] disabled:cursor-not-allowed disabled:opacity-45"><Swords size={17} /> {status === "idle" ? "Bắt đầu trận 5 câu" : "Thách đấu lại"}</button></div></article>
      ) : (
        <div className="overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] shadow-[6px_6px_0_#172a48]">
          <div className="relative min-h-76 overflow-hidden bg-[#172a48] p-5 sm:min-h-92"><img src={ARENA_IMAGE} alt="Đấu trường Boss Atlas" className="absolute inset-0 h-full w-full object-cover opacity-70" /><div className="absolute inset-0 bg-gradient-to-r from-[#172a48]/90 via-[#172a48]/35 to-[#172a48]/90" />
            <AnimatePresence>{feedback && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`spell-effect ${feedback.correct ? "is-hit" : "is-counter"}`} style={spellStyle(selectedGuardian.element)}><motion.span initial={{ x: "-135%", scale: 0.4, opacity: 0 }} animate={{ x: feedback.correct ? "135%" : "-5%", scale: [0.4, 1.4, 1], opacity: [0, 1, 0] }} transition={{ duration: 0.62, ease: "easeOut" }}>{elementIcon[selectedGuardian.element]}</motion.span></motion.div>}</AnimatePresence>
            <div className="relative grid gap-6 sm:grid-cols-2"><motion.div animate={feedback?.playerDamage ? { x: [0, -7, 7, -4, 0] } : { x: 0 }} transition={{ duration: 0.28 }} className="pt-3"><p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#f6b73c]">{profile.name.toUpperCase()} · HP {playerHp}/100</p><div className="mt-2 h-3 overflow-hidden border border-white/50 bg-[#172a48]"><motion.div animate={{ width: `${playerHp}%` }} className="h-full bg-[#3e9b7a]" /></div><div className="mt-4 flex flex-wrap gap-3">{team.map((guardianId) => <button key={guardianId} onClick={() => setSelectedGuardianId(guardianId)} className="text-left"><GuardianCaster guardianId={guardianId} active={guardianId === selectedGuardian.id} isCasting={Boolean(feedback) && guardianId === selectedGuardian.id} /></button>)}</div></motion.div><motion.div animate={feedback?.bossDamage ? { x: [0, 10, -8, 0] } : { x: 0 }} transition={{ duration: 0.3 }} className="sm:text-right"><p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#f6b73c]">BOSS ATLAS · HP {bossHp}/150</p><div className="mt-2 h-3 overflow-hidden border border-white/50 bg-[#172a48]"><motion.div animate={{ width: `${(bossHp / 150) * 100}%` }} className="h-full bg-[#ee6b4e]" /></div><motion.img animate={{ y: [-3, 3, -3], rotate: feedback?.bossDamage ? [0, 4, -4, 0] : 0 }} transition={{ duration: feedback?.bossDamage ? 0.3 : 2.2, repeat: feedback?.bossDamage ? 0 : Infinity }} src={getGuardian("atlas")?.sprite} alt="Atlas" className="ml-auto mt-3 h-28 w-28 object-contain drop-shadow-[0_6px_0_rgba(23,42,72,.65)]" /><div className="mt-1 inline-flex items-center gap-2 border-2 border-white/60 bg-[#172a48]/80 px-3 py-1.5 font-display text-xl font-black text-white"><Crown className="text-[#f6b73c]" /> Atlas</div></motion.div></div>
          </div>
          <div className="p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-2"><p className="section-kicker">Câu H · archive pool {BOSS_QUESTION_IDS.length} câu</p><span className="field-tag"><Volume2 size={14} /> {audioEnabled ? "nhạc battle bật" : "nhạc battle tắt"}</span></div><div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]"><div><p className="font-display text-2xl font-black leading-tight sm:text-3xl">{question?.prompt}</p><p className="mt-2 text-xs font-semibold text-[#58708b]">Nguồn: {question?.source}</p></div><div className="spell-ready-card" style={spellStyle(selectedGuardian.element)}><img src={selectedGuardian.sprite} alt={selectedGuardian.name} /><div><span>{selectedGuardian.type}</span><b>{selectedGuardian.name} · {spell.name}</b><small>{spell.note} +{spell.damage} / phản công −{spell.counterDamage}</small></div></div></div>
            {studyReel && <aside className="spell-study-reel" style={spellStyle(selectedGuardian.element)} aria-label={`Minh họa phép ${studyReel.title} của ${selectedGuardian.name}`}><div><span className="field-tag border-[#172a48]/35 bg-[#fffdf6]"><Sparkles size={13} style={{ color: elementColor[selectedGuardian.element] }} /> TƯ LIỆU PHÉP</span><h2>{selectedGuardian.name} · {studyReel.title}</h2><p>Clip minh họa {spell.name} được nạp từ phép tính đúng; chỉ gợi cảm hứng phép thuật, không tiết lộ đáp án Boss.</p></div><video src={studyReel.src} muted autoPlay loop playsInline preload="metadata" aria-label={`${selectedGuardian.name} dùng ${studyReel.title}`} /></aside>}
            <p className="mt-4 font-mono text-[10px] font-bold tracking-[0.15em] text-[#58708b]">CHỌN GUARDIAN Ở ĐẤU TRƯỜNG · PHÉP TỰ ĐỘNG THEO HỆ</p>
            <div className="mt-5 grid grid-cols-2 gap-3">{choices.map((answer, index) => { const isCorrect = answer === question?.answer; const isSelected = answer === selectedAnswer; const tone = feedback && isCorrect ? "border-[#3e9b7a] bg-[#e7f2e5]" : feedback && isSelected ? "border-[#ee6b4e] bg-[#ffe4dc]" : "border-[#172a48] bg-white hover:bg-[#fff0b6]"; return <button key={`${question?.id}-${answer}`} onClick={() => submit(answer)} disabled={Boolean(feedback)} className={`answer-choice border-2 px-4 py-3 text-left font-display text-2xl font-black shadow-[2px_2px_0_#172a48] transition disabled:cursor-default ${tone}`}>{String.fromCharCode(65 + index)}. {answer}</button>; })}</div>
            <AnimatePresence>{feedback && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={feedback.correct ? "mt-4 flex flex-wrap items-center justify-between gap-3 border-2 border-[#235b45] bg-[#e7f2e5] p-4 text-sm font-bold text-[#235b45]" : "mt-4 flex flex-wrap items-center justify-between gap-3 border-2 border-[#a54539] bg-[#ffe4dc] p-4 text-sm font-bold text-[#9e3d2d]"}><span>{feedback.correct ? <><Check className="mr-1 inline" size={17} /> {selectedGuardian.name} dùng {spell.name}: Atlas −{feedback.bossDamage} HP; phản công −{feedback.playerDamage} HP.</> : <><X className="mr-1 inline" size={17} /> Sai đáp án: Atlas phản công mạnh −{feedback.playerDamage} HP.</>} <span className="font-normal">{question?.explanation}</span></span>{feedback.ended ? <span className="font-black">Trận đã kết thúc.</span> : <button onClick={next} className="whitespace-nowrap border-2 border-[#172a48] bg-[#f6b73c] px-3 py-2 text-[#172a48] shadow-[2px_2px_0_#172a48]">Lượt tiếp <Swords className="ml-1 inline" size={14} /></button>}</motion.div>}</AnimatePresence>
          </div>
        </div>
      )}
    </section>
  );
}
