// Field Journal Quest: parchment evidence meets an indigo arena; guardian seals and elemental magic remain the visual focus.
// Field Journal Quest: đấu trường là dossier khảo sát; mọi guardian đều được đóng khung như tiêu bản có niêm phong.
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  Crown,
  Flag,
  Lightbulb,
  Lock,
  ShieldAlert,
  Sparkles,
  Swords,
  Volume2,
  X,
} from "lucide-react";
import {
  ARENA_IMAGE,
  BATTLE_AUDIO,
  MAP1_BOSS_QUESTION_IDS,
  MAP2_BOSS_QUESTION_IDS,
  MAP_BOSS_ARCHIVES,
  MAP_BOSS_RULES,
  getGuardian,
  getSpellForGuardian,
  GUARDIANS,
  MAGIC_MEDIA,
  QUESTIONS_BY_ID,
  type MapId,
} from "@/game/gameData";
import { type ElementLevelUp, useGame } from "@/contexts/GameContext";
import {
  playBossAttackSound,
  playBossResultSound,
  playElementLevelUpSound,
  playElementSound,
  playFiveStreakSound,
  playTechniqueSound,
} from "@/lib/magicAudio";

type Feedback = {
  correct: boolean;
  playerDamage: number;
  bossDamage: number;
  ended: boolean;
};

const elementIcon: Record<string, string> = {
  sấm: "ϟ",
  lửa: "✦",
  nước: "≈",
  gió: "≋",
  độc: "☾",
  đất: "◆",
};
const elementColor: Record<string, string> = {
  sấm: "#f6b73c",
  lửa: "#ee6b4e",
  nước: "#55a9dd",
  gió: "#3e9b7a",
  độc: "#8e69ad",
  đất: "#b17a3d",
};

function shuffle(answers: number[]) {
  return [...answers].sort(() => Math.random() - 0.5);
}

function spellStyle(element: string): CSSProperties {
  return { "--spell-color": elementColor[element] } as CSSProperties;
}

function GuardianCaster({
  guardianId,
  active,
  isCasting,
}: {
  guardianId: string;
  active: boolean;
  isCasting: boolean;
}) {
  const guardian = getGuardian(guardianId);
  if (!guardian) return null;
  return (
    <span
      className={`guardian-battle-avatar ${active ? "is-active" : ""} ${isCasting ? "is-casting" : ""}`}
      style={spellStyle(guardian.element)}
    >
      <motion.img
        animate={{
          y: active ? [-3, 3, -3] : 0,
          rotate: isCasting ? [0, -5, 6, 0] : 0,
          scale: isCasting ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: isCasting ? 0.42 : 2,
          repeat: isCasting ? 0 : Infinity,
          ease: "easeInOut",
        }}
        src={guardian.sprite}
        alt={guardian.name}
      />
      <span>
        {elementIcon[guardian.element]} {guardian.name}
      </span>
    </span>
  );
}

/** Field Journal Quest: a directional battle stamp makes each Boss hit readable without moving layout. */
function BossTechniqueEffect({
  element,
  correct,
  power,
}: {
  element: string;
  correct: boolean;
  power: number;
}) {
  const color = elementColor[element] ?? "#f6b73c";
  const glyph = elementIcon[element] ?? "✦";
  const travelFrom = correct ? "-165%" : "165%";
  const travelTo = correct ? "145%" : "-145%";
  const impactSide = correct ? "right-[10%]" : "left-[10%]";
  const particleCount = Math.min(7, Math.max(3, power + 2));
  return (
    <AnimatePresence>
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ x: travelFrom, opacity: 0, scale: 0.42 }}
          animate={{
            x: travelTo,
            opacity: [0, 1, 1, 0],
            scale: [0.42, 1, 1.08, 0.72],
          }}
          transition={{
            duration: 0.6 + power * 0.035,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="absolute left-1/2 top-[43%] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white"
          style={{
            background: `radial-gradient(circle, #fff 0 9%, ${color} 22%, ${color}bb 48%, transparent 70%)`,
            boxShadow: `0 0 ${18 + power * 5}px ${color}`,
          }}
        >
          {Array.from({ length: particleCount }).map((_, index) => (
            <span
              key={index}
              aria-hidden
              className="absolute h-1 w-6 rounded-full bg-white/90"
              style={{
                transform: `rotate(${index * (360 / particleCount)}deg) translateX(${26 + power * 2}px)`,
                boxShadow: `0 0 6px ${color}`,
              }}
            />
          ))}
          <b
            className="relative z-10 font-display text-3xl"
            style={{ color, textShadow: "0 1px 0 white" }}
          >
            {glyph}
          </b>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.35 }}
          animate={{
            opacity: [0, 0, 1, 0],
            scale: [0.35, 0.65, 1.45 + power * 0.08, 2],
          }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className={`absolute top-[43%] ${impactSide} grid h-24 w-24 -translate-y-1/2 place-items-center rounded-full border-2 border-white/90`}
          style={{
            background: `radial-gradient(circle, #fff 0 7%, ${color}44 20%, ${color} 28%, transparent 72%)`,
            boxShadow: `0 0 ${25 + power * 5}px ${color}`,
          }}
        >
          <span
            className="font-display text-4xl text-white"
            style={{ textShadow: `0 0 12px ${color}` }}
          >
            {correct ? "✦" : "✕"}
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function BossPage({ mapId = 1 }: { mapId?: MapId }) {
  const {
    profile,
    isMap1BossUnlocked,
    isMap2BossUnlocked,
    startMap1BossBattle,
    startMap2BossBattle,
    resolveBattleAnswer,
    advanceBattle,
    audioEnabled,
    guardianHp,
    reportQuestion,
    unlockQuestionHint,
  } = useGame();
  const boss = MAP_BOSS_ARCHIVES[mapId];
  const bossUnlocked = mapId === 1 ? isMap1BossUnlocked : isMap2BossUnlocked;
  const bossDefeated =
    mapId === 1
      ? Boolean(profile?.map1BossDefeated)
      : Boolean(profile?.map2BossDefeated);
  const bossPool =
    mapId === 1 ? MAP1_BOSS_QUESTION_IDS : MAP2_BOSS_QUESTION_IDS;
  const bossHistory =
    mapId === 1
      ? (profile?.map1BossQuestionHistory ?? [])
      : (profile?.map2BossQuestionHistory ?? []);
  const bossMaxHp = MAP_BOSS_RULES[mapId].maxHp;
  const [selectedGuardianId, setSelectedGuardianId] = useState<string | null>(
    null
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [choices, setChoices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [levelUp, setLevelUp] = useState<ElementLevelUp | null>(null);
  const [streakBadge, setStreakBadge] = useState<number | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const reducedMotion = useReducedMotion();

  const battle = profile?.battle;
  const status = battle?.status ?? "idle";
  const questionId = battle?.questionIds[battle.questionIndex ?? 0] ?? "";
  const question =
    status === "active" ? QUESTIONS_BY_ID[questionId] : undefined;
  const team = useMemo(
    () => profile?.teamGuardianIds ?? [],
    [profile?.teamGuardianIds]
  );
  const selectedGuardian =
    getGuardian(selectedGuardianId ?? team[0] ?? "") ??
    GUARDIANS.find(guardian => guardian.id === "dexo")!;
  const spell = getSpellForGuardian(selectedGuardian);
  const unusedBossQuestions = useMemo(
    () => bossPool.filter(id => !bossHistory.includes(id)).length,
    [bossHistory, bossPool]
  );

  useEffect(() => {
    if (!selectedGuardianId || !team.includes(selectedGuardianId)) {
      setSelectedGuardianId(team.includes("dexo") ? "dexo" : (team[0] ?? null));
    }
  }, [team, selectedGuardianId]);

  useEffect(() => {
    if (question) {
      setChoices(shuffle(question.choices));
      setSelectedAnswer(null);
      setFeedback(null);
      setHintVisible(false);
    }
  }, [question?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.22;
    if (audioEnabled && status === "active")
      audio.play().catch(() => undefined);
    else audio.pause();
  }, [audioEnabled, status]);

  useEffect(() => {
    if (!levelUp) return;
    const timer = window.setTimeout(() => setLevelUp(null), 3600);
    return () => window.clearTimeout(timer);
  }, [levelUp]);
  useEffect(() => {
    if (!streakBadge) return;
    const timer = window.setTimeout(() => setStreakBadge(null), 2500);
    return () => window.clearTimeout(timer);
  }, [streakBadge]);

  function begin() {
    const started =
      mapId === 1
        ? startMap1BossBattle(selectedGuardian.id)
        : startMap2BossBattle(selectedGuardian.id);
    if (started) {
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
    playElementSound(
      selectedGuardian.element,
      audioEnabled,
      result.correct ? "cast" : "counter"
    );
    playBossResultSound(result.correct, audioEnabled);
    const techniqueLevel =
      spell.damage >= 30
        ? 4
        : spell.damage >= 26
          ? 3
          : spell.damage >= 21
            ? 2
            : 1;
    window.setTimeout(
      () =>
        playTechniqueSound(
          result.correct ? selectedGuardian.element : boss.element,
          techniqueLevel,
          audioEnabled
        ),
      result.correct ? 110 : 80
    );
    window.setTimeout(
      () => playBossAttackSound(boss.element, audioEnabled),
      result.correct ? 270 : 150
    );
    if (result.streakMilestone) {
      setStreakBadge(result.streakMilestone.streak);
      playFiveStreakSound(audioEnabled);
    }
    if (result.levelUp) {
      setLevelUp(result.levelUp);
      playElementLevelUpSound(result.levelUp.element, audioEnabled);
    }
  }

  function next() {
    if (status === "active" && !feedback?.ended) advanceBattle();
  }
  function revealHint() {
    if (
      !question ||
      !window.confirm(
        "Mở gợi ý chiến thuật này sẽ trừ 1 Gold. Em có đồng ý không?"
      )
    )
      return;
    const result = unlockQuestionHint(question.id);
    window.alert(result.message);
    if (result.ok) setHintVisible(true);
  }
  function reportCurrentQuestion() {
    if (!question) return;
    const note = window.prompt(
      "Ghi ngắn gọn lỗi em phát hiện về đề bài hoặc đáp án Boss:"
    );
    if (note === null) return;
    window.alert(reportQuestion(question.id, "other", note).message);
  }

  if (!profile) {
    return (
      <section className="boss-unopened-dossier">
        <header className="boss-dossier-cover">
          <div>
            <span className="field-tag border-white/30 bg-white/10 text-white">
              <ShieldAlert size={13} /> ARENA DOSSIER · NIÊM PHONG
            </span>
            <h1>Hồ sơ đấu trường {boss.name}</h1>
            <p>
              Đấu trường chưa gọi tên người thách đấu. Hãy lập hồ sơ, thu thập
              bằng chứng học tập và mở khóa niêm phong cuối tuyến.
            </p>
          </div>
          <div className="boss-seal-stamp">
            <Lock size={20} />
            <b>KHÓA</b>
            <small>5 CÂU H</small>
          </div>
        </header>
        <div className="boss-dossier-body">
          <div className="boss-route-evidence">
            <p className="section-kicker">LỘ TRÌNH MỞ NIÊM PHONG</p>
            {[
              ["01", "Lập hồ sơ thám hiểm", "Chọn tên và guardian đầu tiên."],
              [
                "02",
                "Ghi đủ 20 bằng chứng",
                "Hoàn thành 2 trạm mastery, mỗi trạm 10 câu.",
              ],
              [
                "03",
                `Gọi ${boss.name} ra đấu trường`,
                "Chọn guardian và dùng đúng phép hệ.",
              ],
            ].map(([step, title, note], index) => (
              <div className="boss-evidence-step" key={step}>
                <b>{step}</b>
                <span aria-hidden="true" />
                <div>
                  <strong>{title}</strong>
                  <small>{note}</small>
                </div>
                {index < 2 && <i aria-hidden="true" />}
              </div>
            ))}
          </div>
          <aside className="boss-reward-specimen relative overflow-hidden">
            <span className="field-tag">
              <Crown size={13} /> PHẦN THƯỞNG CUỐI TUYẾN
            </span>
            <div className="relative mx-auto mt-3 grid h-28 w-28 place-items-center rounded-full border-2 border-dashed border-[#172a48] bg-[#edf1e8] p-2 shadow-[2px_2px_0_#172a48]">
              <span
                aria-hidden="true"
                className="absolute -left-4 top-3 rotate-[-20deg] font-mono text-[8px] font-black tracking-[0.16em] text-[#58708b]"
              >
                SPECIMEN 0{mapId}
              </span>
              <img
                src={boss.sprite}
                alt={`Tiêu bản niêm phong của ${boss.name}`}
                className="h-20 w-20 object-contain grayscale-[0.35]"
              />
              <span className="absolute -bottom-2 border border-[#172a48] bg-[#f6b73c] px-2 py-0.5 font-mono text-[8px] font-black">
                BOSS · CHƯA GHI
              </span>
            </div>
            <p className="mt-4 border-y border-dashed border-[#c9b88c] py-2 font-mono text-[9px] font-black tracking-[0.1em] text-[#58708b]">
              MẪU: {boss.name.toUpperCase()} · {boss.title.toUpperCase()}
            </p>
            <b>{boss.name} đang giữ 10 câu M/H</b>
            <p>
              Mỗi lượt có phản công. Guardian và Sổ Phép là bằng chứng em mang
              vào đấu trường.
            </p>
          </aside>
        </div>
        <footer className="boss-dossier-footer">
          <span>Điểm xuất phát được đánh dấu bằng la bàn Marigold.</span>
          <Link href="/start" className="boss-dossier-cta">
            <Swords size={16} /> Mở hồ sơ thám hiểm
          </Link>
        </footer>
      </section>
    );
  }

  if (!bossUnlocked) {
    return (
      <section className="overflow-hidden border-2 border-[#172a48] bg-[#172a48] text-white shadow-[6px_6px_0_#f6b73c]">
        <div className="relative h-52">
          <img
            src={ARENA_IMAGE}
            alt={`Đấu trường Boss Map ${mapId}`}
            className="h-full w-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172a48] via-[#172a48]/50 to-transparent" />
          <img
            src={boss.sprite}
            alt={boss.name}
            className="absolute bottom-3 right-7 h-40 w-40 object-contain drop-shadow-[0_7px_0_rgba(0,0,0,.45)]"
          />
          <div className="absolute inset-x-5 bottom-5">
            <span className="field-tag border-white/30 bg-white/10 text-white">
              <Lock size={13} /> CỬA CUỐI MAP {mapId}
            </span>
            <h1 className="mt-3 font-display text-4xl font-black">
              {boss.name} đang chờ
            </h1>
          </div>
        </div>
        <div className="p-6">
          <p className="max-w-2xl text-sm leading-relaxed text-[#d5dfed]">
            Mở đủ 10 chủ đề của Map {mapId} để gọi {boss.name}. Trận có 10 câu
            trung bình và khó từ Tập {mapId}; chiến thắng nhận huy hiệu{" "}
            <b>{boss.badge}</b>
            {mapId === 1 ? " và mở Map 2." : "."}
          </p>
          <Link
            href="/map"
            className="mt-5 inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-3 font-bold text-[#172a48] shadow-[3px_3px_0_white]"
          >
            <Swords size={16} /> Trở về tuyến đường
          </Link>
        </div>
      </section>
    );
  }

  const playerHp = battle?.playerHp ?? 100;
  const bossHp = battle?.bossHp ?? bossMaxHp;
  const hasFreshRun = unusedBossQuestions >= 10 || bossDefeated;
  const battleGuardian =
    getGuardian(battle?.guardianId ?? selectedGuardian.id) ?? selectedGuardian;

  return (
    <section>
      <audio ref={audioRef} src={BATTLE_AUDIO} loop preload="auto" />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-kicker">MAP {mapId} BOSS · GUARDIAN SPELLS</p>
          <h1 className="font-display text-4xl font-black tracking-tight">
            Boss tổng hợp — {boss.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#58708b]">
            Mười câu trung bình và khó được rút từ các trạm Tập {mapId}. Trả lời
            đúng vẫn nhận phản công; sai mất nhiều HP hơn. Chiến thắng ghi huy
            hiệu <b>{boss.badge}</b>
            {mapId === 1 ? " và mở toàn bộ tuyến Tập 2." : "."}
          </p>
        </div>
        <span className="field-tag">
          <Crown size={14} />{" "}
          {status === "active"
            ? `Lượt ${(battle?.questionIndex ?? 0) + 1}/10`
            : `${unusedBossQuestions} câu M/H chưa dùng`}
        </span>
      </div>

      {status !== "active" ? (
        <article className="arena-dossier overflow-hidden border-2 border-[#172a48] bg-[#172a48] text-white shadow-[6px_6px_0_#f6b73c]">
          <div className="relative h-56">
            <img
              src={ARENA_IMAGE}
              alt={`Đấu trường ma thuật ${boss.name}`}
              className="h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#172a48] via-[#172a48]/60 to-transparent" />
            <img
              src={boss.sprite}
              alt={boss.name}
              className="absolute bottom-2 right-6 h-48 w-48 object-contain drop-shadow-[0_7px_0_rgba(0,0,0,.45)]"
            />
            <div className="absolute inset-x-5 bottom-5">
              <span className="field-tag border-white/25 bg-white/10 text-white">
                {hasFreshRun ? (
                  <ShieldAlert size={13} className="text-[#f6b73c]" />
                ) : (
                  <Lock size={13} className="text-[#f6b73c]" />
                )}{" "}
                {hasFreshRun
                  ? "10 CÂU M/H · KHÔNG LẶP"
                  : "ARCHIVE ĐÃ HẾT CÂU MỚI"}
              </span>
              <h2 className="mt-3 font-display text-4xl font-black">
                {status === "victory"
                  ? `${boss.name} đã trao ${boss.badge}.`
                  : status === "defeat"
                    ? `${battleGuardian.name} đã gục ngã và trở về trạm.`
                    : "Chọn guardian rồi bước vào."}
              </h2>
            </div>
          </div>
          <div className="grid gap-5 p-6 lg:grid-cols-[1fr_auto]">
            <p className="max-w-2xl text-sm leading-relaxed text-[#d5dfed]">
              {!hasFreshRun ? (
                `${boss.name} còn ${unusedBossQuestions} câu M/H chưa dùng — chưa đủ mười câu cho một trận mới.`
              ) : status === "victory" ? (
                <>
                  <b className="text-[#f6b73c]">
                    Huy hiệu đã đóng dấu: {boss.badge}.
                  </b>{" "}
                  {boss.reward}
                </>
              ) : status === "defeat" ? (
                "Guardian đã rời Bộ sưu tập và dấu trạm tương ứng đã được mở lại. Hoàn thành lại 10 câu đúng để thu phục bạn ấy lần nữa."
              ) : (
                `${selectedGuardian.name} đang có ${guardianHp(selectedGuardian.id)}/100 HP. Mỗi guardian có một phép riêng theo nguyên tố.`
              )}
            </p>
            <button
              onClick={begin}
              disabled={!hasFreshRun || !selectedGuardianId || bossDefeated}
              className="inline-flex h-fit items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-5 py-3 font-bold text-[#172a48] shadow-[3px_3px_0_white] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Swords size={17} />{" "}
              {bossDefeated
                ? "Đã hoàn tất cửa Boss"
                : status === "idle"
                  ? "Bắt đầu trận 10 câu"
                  : "Thách đấu lại"}
            </button>
          </div>
        </article>
      ) : (
        <div className="battle-layout battle-layout--boss">
          <section className="battlefield-panel">
            <div className="battlefield-scene">
              <img
                src={ARENA_IMAGE}
                alt={`Đấu trường Boss ${boss.name}`}
                className="battlefield-backdrop"
              />
              <div className="battlefield-shade" />
              <div className="battlefield-stars" aria-hidden="true" />
              <span
                className="battlefield-rune battlefield-rune--fire"
                aria-hidden="true"
              >
                ✦
              </span>
              <span
                className="battlefield-rune battlefield-rune--water"
                aria-hidden="true"
              >
                ≈
              </span>
              <span
                className="battlefield-rune battlefield-rune--wood"
                aria-hidden="true"
              >
                ❋
              </span>
              <span
                className="battlefield-rune battlefield-rune--metal"
                aria-hidden="true"
              >
                ◇
              </span>
              <span
                className="battlefield-rune battlefield-rune--earth"
                aria-hidden="true"
              >
                ◆
              </span>
              <span className="battlefield-orbit" aria-hidden="true" />
              <div className="battlefield-topline">
                <span className="battlefield-stamp">
                  <Crown size={12} /> BOSS · MAP {mapId}
                </span>
                <span className="battlefield-status">
                  LƯỢT {(battle?.questionIndex ?? 0) + 1}/10
                </span>
              </div>
              {feedback && (
                <BossTechniqueEffect
                  element={
                    feedback.correct ? selectedGuardian.element : boss.element
                  }
                  correct={feedback.correct}
                  power={
                    spell.damage >= 30
                      ? 4
                      : spell.damage >= 26
                        ? 3
                        : spell.damage >= 21
                          ? 2
                          : 1
                  }
                />
              )}
              <AnimatePresence>
                {feedback?.playerDamage ? (
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-20 border-4 border-[#ee6b4e] bg-[#ee6b4e]/15 mix-blend-screen"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={
                      reducedMotion
                        ? { opacity: [0, 0.48, 0] }
                        : { opacity: [0, 0.72, 0.12, 0], scale: [1, 1.018, 1] }
                    }
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: reducedMotion ? 0.24 : 0.42,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                  />
                ) : null}
              </AnimatePresence>
              <AnimatePresence>
                {levelUp && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="battle-level-overlay"
                  >
                    <div className="relative w-full max-w-md overflow-hidden border-2 border-[#f6b73c] bg-[#fffdf6] p-5 text-[#172a48] shadow-[5px_5px_0_#f6b73c]">
                      <motion.i
                        aria-hidden="true"
                        initial={{ scale: 0.55, rotate: -18, opacity: 0 }}
                        animate={{
                          scale: [0.55, 1.2, 1],
                          rotate: [-18, 8, 0],
                          opacity: 1,
                        }}
                        transition={{ duration: 0.56, ease: "easeOut" }}
                        className="absolute left-1/2 top-1/2 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-dashed opacity-20"
                        style={{ borderColor: elementColor[levelUp.element] }}
                      >
                        <span
                          className="text-8xl"
                          style={{ color: elementColor[levelUp.element] }}
                        >
                          {elementIcon[levelUp.element]}
                        </span>
                      </motion.i>
                      <div className="relative">
                        <div
                          className="flex justify-center gap-3 text-2xl"
                          style={{ color: elementColor[levelUp.element] }}
                        >
                          {[0, 1, 2, 3, 4].map(star => (
                            <motion.span
                              key={star}
                              initial={{ y: -18, opacity: 0, rotate: -12 }}
                              animate={{
                                y: [-18, 7, 0],
                                opacity: 1,
                                rotate: 0,
                              }}
                              transition={{
                                delay: star * 0.06,
                                duration: 0.42,
                              }}
                            >
                              ✦
                            </motion.span>
                          ))}
                        </div>
                        <p className="mt-3 font-mono text-[10px] font-black tracking-[0.18em]">
                          ẤN ĐÃ ĐƯỢC GHI VÀO NHẬT KÝ
                        </p>
                        <h2
                          className="mt-2 font-display text-4xl font-black"
                          style={{ color: elementColor[levelUp.element] }}
                        >
                          {MAGIC_MEDIA[levelUp.element].shortLabel} TĂNG BẬC
                        </h2>
                        <p className="mt-2 text-sm font-bold">
                          Bậc {levelUp.previousLevel} → Bậc {levelUp.nextLevel}{" "}
                          · tổng {levelUp.totalXp} XP
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-[#476275]">
                          Guardian đã chuyển hóa phép tính vừa dùng thành một
                          dấu ấn mới. Tiếp tục hành trình để chạm bậc tiếp theo.
                        </p>
                        <button
                          type="button"
                          onClick={() => setLevelUp(null)}
                          className="mt-4 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-2 text-sm font-black shadow-[2px_2px_0_#172a48]"
                        >
                          Ghi nhận dấu ấn
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {streakBadge && (
                  <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-1/2 top-5 z-30 w-[min(92%,360px)] -translate-x-1/2 border-2 border-[#f6b73c] bg-[#172a48]/95 p-4 text-center text-white shadow-[4px_4px_0_#f6b73c]"
                  >
                    <div className="text-xl tracking-[.25em] text-[#f6b73c]">
                      ✦ ✦ ✦
                    </div>
                    <b className="font-display text-2xl">
                      Chuỗi {streakBadge} đòn chính xác!
                    </b>
                    <p className="mt-1 text-xs text-[#fff0b6]">
                      +5 Gold được đóng dấu vào nhật ký.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="battlefield-lanes">
                <motion.div
                  animate={
                    feedback?.playerDamage && !reducedMotion
                      ? { x: [0, -8, 8, -5, 3, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.34 }}
                  className="battle-pet-side battle-pet-side--player"
                >
                  <p className="battle-pet-label">
                    <span>NGƯỜI CHƠI · HP {playerHp}/100</span>
                    <strong>{battleGuardian.name}</strong>
                  </p>
                  <div className="battle-hp-track">
                    <motion.div
                      animate={{ width: `${playerHp}%` }}
                      className="h-full bg-[#3e9b7a]"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-[#d5dfed]">
                    Sai: −{MAP_BOSS_RULES[mapId].wrongAnswerDamage} HP · Đúng:
                    vẫn chịu phản công phép.
                  </p>
                  <div className="boss-team-tray">
                    {team.map(guardianId => (
                      <button
                        key={guardianId}
                        disabled
                        className="cursor-default text-left disabled:opacity-60"
                      >
                        <GuardianCaster
                          guardianId={guardianId}
                          active={guardianId === battleGuardian.id}
                          isCasting={
                            Boolean(feedback) &&
                            guardianId === battleGuardian.id
                          }
                        />
                      </button>
                    ))}
                  </div>
                </motion.div>
                <motion.div
                  animate={
                    feedback?.bossDamage && !reducedMotion
                      ? { x: [0, 10, -8, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.3 }}
                  className="battle-pet-side battle-pet-side--opponent"
                >
                  <p className="battle-pet-label">
                    <span>
                      BOSS · HP {bossHp}/{bossMaxHp}
                    </span>
                    <strong>{boss.name}</strong>
                  </p>
                  <div className="battle-hp-track">
                    <motion.div
                      animate={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
                      className="h-full bg-[#ee6b4e]"
                    />
                  </div>
                  <div className="battle-pet-portrait">
                    <motion.img
                      animate={{
                        y: reducedMotion ? 0 : [-3, 3, -3],
                        rotate:
                          feedback?.bossDamage && !reducedMotion
                            ? [0, 4, -4, 0]
                            : 0,
                      }}
                      transition={{
                        duration: feedback?.bossDamage ? 0.3 : 2.2,
                        repeat:
                          feedback?.bossDamage || reducedMotion ? 0 : Infinity,
                      }}
                      src={boss.sprite}
                      alt={boss.name}
                      className="battle-pet-image"
                    />
                  </div>
                  <div className="battle-pet-meta">
                    <span>{boss.element}</span>
                    <span>{boss.title}</span>
                  </div>
                </motion.div>
              </div>
              <div
                className="battle-vs-core"
                aria-label={`Đối đầu với ${boss.name}`}
              >
                VS<small>TRẬN BOSS</small>
              </div>
              <div className="battlefield-footer">
                <span className="battle-technique-chip">
                  <Crown size={11} /> <b>{boss.badge}</b>
                </span>
                <span className="battlefield-spell-chip">
                  <b>{battleGuardian.name}</b> · {spell.name}
                </span>
              </div>
            </div>
          </section>
          <section className="battle-question-panel">
            <div className="battle-question-head">
              <p className="section-kicker">
                Boss Map {mapId} · pool {bossPool.length} câu M/H
              </p>
              <span className="field-tag">
                <Volume2 size={14} />{" "}
                {audioEnabled ? "battle bật" : "battle tắt"}
              </span>
            </div>
            <div>
              <p className="battle-question-text">{question?.prompt}</p>
              <div className="battle-question-source font-semibold">
                <span>Nguồn: {question?.source}</span>
                <button
                  onClick={reportCurrentQuestion}
                  className="inline-flex items-center gap-1 border-b border-dashed border-[#a54539] pb-0.5 font-bold text-[#a54539]"
                >
                  <Flag size={13} /> Báo lỗi
                </button>
              </div>
            </div>
            <div
              className="mt-4 spell-ready-card battle-spell-card"
              style={spellStyle(selectedGuardian.element)}
            >
              <img src={selectedGuardian.sprite} alt={selectedGuardian.name} />
              <div>
                <span>{selectedGuardian.type}</span>
                <b>
                  {selectedGuardian.name} · {spell.name}
                </b>
                <small>
                  {spell.note} +{spell.damage} / phản công −
                  {spell.counterDamage}
                </small>
              </div>
            </div>
            <div className="battle-hint border-2 border-dashed border-[#c9b88c] bg-[#fff8da] text-[#476275]">
              {hintVisible ? (
                <>
                  <b className="text-[#172a48]">Gợi ý đã mở:</b>{" "}
                  {question?.hint}
                </>
              ) : (
                <button
                  onClick={revealHint}
                  className="inline-flex items-center gap-1 font-bold text-[#172a48] underline decoration-2 underline-offset-4"
                >
                  <Lightbulb size={15} /> Mở gợi ý chiến thuật · 1 Gold
                </button>
              )}
            </div>
            <p className="mt-4 font-mono text-[10px] font-bold tracking-[0.15em] text-[#58708b]">
              CHỌN GUARDIAN Ở ĐẤU TRƯỜNG · PHÉP TỰ ĐỘNG THEO HỆ
            </p>
            <div className="battle-answer-grid">
              {choices.map((answer, index) => {
                const isCorrect = answer === question?.answer;
                const isSelected = answer === selectedAnswer;
                const tone =
                  feedback && isCorrect
                    ? "border-[#3e9b7a] bg-[#e7f2e5]"
                    : feedback && isSelected
                      ? "border-[#ee6b4e] bg-[#ffe4dc]"
                      : "border-[#172a48] bg-white hover:bg-[#fff0b6]";
                return (
                  <button
                    key={`${question?.id}-${answer}`}
                    onClick={() => submit(answer)}
                    disabled={Boolean(feedback)}
                    className={`answer-choice border-2 px-4 py-3 text-left font-display text-2xl font-black shadow-[2px_2px_0_#172a48] transition disabled:cursor-default ${tone}`}
                  >
                    {String.fromCharCode(65 + index)}. {answer}
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`battle-feedback flex flex-wrap items-center justify-between gap-3 border-2 font-bold ${
                    feedback.correct
                      ? "border-[#235b45] bg-[#e7f2e5] text-[#235b45]"
                      : "border-[#a54539] bg-[#ffe4dc] text-[#9e3d2d]"
                  }`}
                >
                  <span>
                    {feedback.correct ? (
                      <>
                        <Check className="mr-1 inline" size={17} />{" "}
                        {battleGuardian.name} dùng {spell.name}: {boss.name} −
                        {feedback.bossDamage} HP; phản công −
                        {feedback.playerDamage} HP.
                      </>
                    ) : (
                      <>
                        <X className="mr-1 inline" size={17} /> Sai đáp án:{" "}
                        {boss.name} phản công mạnh −{feedback.playerDamage} HP.
                      </>
                    )}{" "}
                    <span className="font-normal">{question?.explanation}</span>
                  </span>
                  {feedback.ended ? (
                    <span className="font-black">
                      {playerHp === 0
                        ? `${battleGuardian.name} đã gục ngã — hãy thu phục lại tại trạm.`
                        : `Trận đã kết thúc · ${boss.badge} đang chờ đóng dấu.`}
                    </span>
                  ) : (
                    <button
                      onClick={next}
                      className="whitespace-nowrap border-2 border-[#172a48] bg-[#f6b73c] px-3 py-2 text-[#172a48] shadow-[2px_2px_0_#172a48]"
                    >
                      Lượt tiếp <Swords className="ml-1 inline" size={14} />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      )}
    </section>
  );
}
