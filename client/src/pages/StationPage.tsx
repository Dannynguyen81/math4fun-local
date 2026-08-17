/** Math4Fun station page — Field Journal Quest frames verified Math problems as one focused field mission at a time. */
import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Lightbulb, Lock, Map, ShieldCheck, Sparkles, X } from "lucide-react";
import GuardianSeal from "@/components/GuardianSeal";
import { getGuardian, getStation, QUESTIONS_BY_ID } from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";

export default function StationPage() {
  const [, params] = useRoute("/station/:id");
  const stationId = Number(params?.id);
  const station = getStation(stationId);
  const { isStationUnlocked, isStationMastered, isQuestionCompleted, answerQuestion, stationProgress } = useGame();
  const stationQuestions = useMemo(() => station?.questionIds.map((questionId) => QUESTIONS_BY_ID[questionId]).filter(Boolean) ?? [], [station]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const firstPending = stationQuestions.find((question) => !isQuestionCompleted(question.id));
    setSelectedQuestionId(firstPending?.id ?? stationQuestions[0]?.id ?? "");
    setSelectedAnswer(null);
    setShowHint(false);
  }, [stationId]);

  if (!station) return <section className="border-2 border-[#172a48] bg-[#fffdf6] p-6 shadow-[5px_5px_0_#172a48]"><h1 className="font-display text-3xl font-black">Không tìm thấy trạm</h1><Link href="/map" className="mt-4 inline-flex items-center gap-2 font-bold underline decoration-2 underline-offset-4"><ArrowLeft size={16} /> Trở lại bản đồ</Link></section>;
  const unlocked = isStationUnlocked(station.id);
  if (!unlocked) return <section className="border-2 border-[#172a48] bg-[#fffdf6] p-6 shadow-[5px_5px_0_#172a48]"><Lock className="text-[#ee6b4e]" size={32} /><h1 className="mt-3 font-display text-3xl font-black">Tuyến này chưa mở</h1><p className="mt-2 text-sm text-[#58708b]">Hãy hoàn thành toàn bộ nhiệm vụ của trạm trước để nối tiếp đường chỉ dẫn.</p><Link href="/map" className="mt-5 inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-2.5 font-bold shadow-[2px_2px_0_#172a48]"><Map size={16} /> Xem bản đồ</Link></section>;

  const question = QUESTIONS_BY_ID[selectedQuestionId] ?? stationQuestions[0];
  const alreadyCompleted = Boolean(question && isQuestionCompleted(question.id));
  const answered = selectedAnswer !== null;
  const correct = selectedAnswer === question?.answer;
  const { done, total } = stationProgress(station.id);
  const mastered = isStationMastered(station.id);
  const guardian = getGuardian(station.guardianId);
  const nextStationId = station.id + 1;
  const nextQuestion = stationQuestions.find((item) => !isQuestionCompleted(item.id) && item.id !== question?.id);

  function selectQuestion(questionId: string) {
    setSelectedQuestionId(questionId);
    setSelectedAnswer(null);
    setShowHint(false);
  }

  function submit(answer: number) {
    if (answered || alreadyCompleted || !question) return;
    setSelectedAnswer(answer);
    if (answer === question.answer) answerQuestion(question.id);
  }

  return <section>
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><Link href="/map" className="inline-flex items-center gap-1 text-sm font-bold underline decoration-2 underline-offset-4"><ArrowLeft size={15} /> Bản đồ học</Link><p className="mt-4 section-kicker">{station.code} · station field note</p><h1 className="font-display text-4xl font-black tracking-tight">{station.title}</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#58708b]">{station.brief}</p></div><div className="border-2 border-[#172a48] bg-[#fffdf6] px-4 py-3 text-right shadow-[3px_3px_0_#172a48]"><p className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#58708b]">TIẾN ĐỘ TRẠM</p><p className="font-display text-3xl font-black">{done}/{total}</p></div></div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_250px]">
      <article className="paper-stack relative overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] p-5 shadow-[6px_6px_0_#172a48] sm:p-6"><span className="paper-tape" aria-hidden="true" /><div className={`absolute right-0 top-0 h-16 w-16 border-b-2 border-l-2 border-[#172a48] ${station.accent}`} />
        {mastered ? <div className="relative"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#172a48] bg-[#e7f2e5]"><Check size={25} className="text-[#235b45]" /></span><div><p className="section-kicker">Trạm đã làm chủ</p><h2 className="font-display text-3xl font-black">Dấu ấn {guardian?.name} đã được ghi</h2></div></div><p className="mt-4 text-sm leading-relaxed text-[#476275]">Bạn có thể chọn bất kỳ câu nào bên dưới để ôn lại. Guardian đã gia nhập bộ sưu tập của bạn.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/collection" className="inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-3 font-bold shadow-[3px_3px_0_#172a48]"><Sparkles size={16} /> Xem guardian</Link>{nextStationId <= 5 && <Link href={`/station/${nextStationId}`} className="inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#fffdf6] px-4 py-3 font-bold shadow-[2px_2px_0_#172a48]">Trạm tiếp theo <ArrowRight size={16} /></Link>}</div></div> : <div className="relative"><div className="flex flex-wrap items-center justify-between gap-2"><p className="section-kicker">Nhiệm vụ đang mở</p><span className="rounded-full border border-[#172a48]/20 bg-white px-2 py-1 font-mono text-[9px] font-bold text-[#476275]">ĐÃ KIỂM CHỨNG</span></div><AnimatePresence mode="wait"><motion.div key={question?.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}><p className="mt-4 font-display text-2xl font-black leading-tight sm:text-3xl">{question?.prompt}</p>{question?.supportingText && <p className="mt-2 font-mono text-sm font-bold text-[#ee6b4e]">{question.supportingText}</p>}<p className="mt-3 text-xs font-semibold text-[#58708b]">Nguồn: {question?.source}</p><div className="mt-5 grid grid-cols-2 gap-3">{question?.choices.map((answer) => { const optionCorrect = answer === question.answer; const optionSelected = answer === selectedAnswer; let state = "border-[#172a48] bg-white hover:bg-[#fff0b6]"; if (answered && optionCorrect) state = "border-[#3e9b7a] bg-[#e7f2e5]"; if (answered && optionSelected && !optionCorrect) state = "border-[#ee6b4e] bg-[#ffe4dc]"; return <button key={answer} disabled={answered || alreadyCompleted} onClick={() => submit(answer)} className={`answer-choice border-2 px-4 py-3 text-left font-display text-2xl font-black shadow-[2px_2px_0_#172a48] transition disabled:cursor-default ${state}`}>{answer}</button>; })}</div>{showHint && <div className="mt-4 rounded-xl border-2 border-[#f6b73c] bg-[#fff0b6] px-3 py-2.5 text-sm leading-relaxed text-[#624d1b]"><b>Gợi ý:</b> {question?.hint}</div>}{answered && <div className={correct ? "mt-4 flex items-start gap-2 rounded-xl bg-[#e7f2e5] px-3 py-2.5 text-sm font-bold text-[#235b45]" : "mt-4 flex items-start gap-2 rounded-xl bg-[#ffe4dc] px-3 py-2.5 text-sm font-bold text-[#9e3d2d]"}>{correct ? <><Check size={18} className="mt-0.5 shrink-0" /><span><b>Chính xác!</b> {question?.explanation}</span></> : <><X size={18} className="mt-0.5 shrink-0" /><span>Chưa đúng. {question?.explanation}</span></>}</div>}{alreadyCompleted && !answered && <div className="mt-4 rounded-xl bg-[#e7f2e5] px-3 py-2.5 text-sm font-bold text-[#235b45]"><Check className="mr-1 inline-block" size={16} /> Câu này đã hoàn thành. Hãy chọn câu chưa làm trong danh sách nhiệm vụ.</div>}</motion.div></AnimatePresence><div className="mt-5 flex flex-wrap items-center gap-3"><span className="field-tag"><BookOpen size={14} /> PDF đã đối chiếu</span><span className="field-tag"><ShieldCheck size={14} /> Đáp án đã tính lại</span><button onClick={() => setShowHint((value) => !value)} className="ml-auto inline-flex items-center gap-1 text-sm font-bold underline decoration-[#f6b73c] decoration-2 underline-offset-4"><Lightbulb size={15} /> {showHint ? "Ẩn gợi ý" : "Xem gợi ý"}</button>{answered && correct && nextQuestion && <button onClick={() => selectQuestion(nextQuestion.id)} className="inline-flex items-center gap-1 border-2 border-[#172a48] bg-[#f6b73c] px-3 py-2 font-bold shadow-[2px_2px_0_#172a48]">Câu tiếp <ChevronRight size={16} /></button>}</div></div>}
      </article>
      <aside className="space-y-5"><article className="guardian-guide guardian-guide-compact relative overflow-hidden border-2 border-[#172a48] bg-[#172a48] p-5 text-white shadow-[4px_4px_0_#ee6b4e]"><span className="field-tag border-white/25 bg-white/10 text-white"><Sparkles size={14} className="text-[#f6b73c]" /> Field guide margin note</span><div className="mt-4 flex items-start gap-3"><GuardianSeal guardian={guardian} unlocked={mastered} compact progressLabel={`${done}/${total} nhiệm vụ`} /><div className="min-w-0"><p className="font-mono text-[10px] tracking-[0.15em] text-[#9bb4ce]">{guardian?.type}</p><h2 className="font-display text-3xl font-black">{guardian?.name}</h2><p className="mt-2 text-sm leading-relaxed text-[#d5dfed]">{guardian?.description}</p></div></div></article><article className="evidence-card border-2 border-[#172a48] bg-[#fff8da] p-4 shadow-[3px_3px_0_#172a48]"><p className="section-kicker">Sổ nhiệm vụ</p><div className="mt-3 space-y-2">{stationQuestions.map((item, index) => <button key={item.id} onClick={() => selectQuestion(item.id)} className={`flex w-full items-center gap-2 border-2 px-3 py-2 text-left text-sm font-bold ${selectedQuestionId === item.id ? "border-[#172a48] bg-[#f6b73c]" : "border-[#d7d0bf] bg-[#fffdf6] hover:border-[#172a48]"}`}><span className="grid h-5 w-5 place-items-center rounded-full border border-[#172a48] text-[10px]">{isQuestionCompleted(item.id) ? <Check size={13} /> : index + 1}</span><span className="truncate">Nhiệm vụ {index + 1}</span></button>)}</div></article></aside>
    </div>
  </section>;
}
