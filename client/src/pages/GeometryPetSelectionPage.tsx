import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Award, BookOpen, ChevronLeft, ChevronRight, CheckCircle2, Compass, GitCompare, Info, Sparkles } from "lucide-react";
import { playAvatarSlideSound, playAvatarSelectSound, playFireworkPopSound } from "@/lib/magicAudio";
import { useGame } from "@/contexts/GameContext";
import { getGuardian } from "@/game/gameData";
import { getGuardianAffinity, FIVE_ELEMENT_LABEL } from "@/game/fiveElementCombat";

type StarterGuardian = {
  id: "cubix" | "vane" | "scalera";
  role: string;
  mathSkill: string;
  stats: { power: number; precision: number; speed: number; defense: number };
  mathConceptTooltip: string;
};

const STARTER_GUARDIANS: StarterGuardian[] = [
  { id: "cubix", role: "Bạn đồng hành mở tuyến · suy luận & quy luật", mathSkill: "Giữ nhịp giải và nhận diện quy luật số học", stats: { power: 88, precision: 90, speed: 82, defense: 84 }, mathConceptTooltip: "Quan sát quy luật, kiểm tra từng bước và dùng bằng chứng để dự đoán số tiếp theo." },
  { id: "vane", role: "Bạn đồng hành cân bằng · đại lượng & trung bình", mathSkill: "Cân bằng dữ liệu và tìm giá trị trung bình", stats: { power: 80, precision: 92, speed: 88, defense: 86 }, mathConceptTooltip: "Trung bình cộng bằng tổng các giá trị chia cho số lượng giá trị." },
  { id: "scalera", role: "Bạn đồng hành chính xác · quy đổi & đo lường", mathSkill: "Theo dõi đơn vị và kiểm soát phép quy đổi", stats: { power: 86, precision: 98, speed: 78, defense: 90 }, mathConceptTooltip: "Khi đổi đơn vị, luôn xác định quan hệ giữa hai đơn vị trước khi nhân hoặc chia." },
];

export default function GeometryPetSelectionPage() {
  const [, navigate] = useLocation();
  const { audioEnabled } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const cards = useMemo(() => STARTER_GUARDIANS.map((starter) => {
    const guardian = getGuardian(starter.id)!;
    const affinity = getGuardianAffinity(starter.id)!;
    return { ...starter, guardian, affinity };
  }), []);
  const active = cards[currentIndex];
  function previous() { playAvatarSlideSound(audioEnabled); setCurrentIndex((value) => value === 0 ? cards.length - 1 : value - 1); }
  function next() { playAvatarSlideSound(audioEnabled); setCurrentIndex((value) => value === cards.length - 1 ? 0 : value + 1); }
  function selectGuardian() { playAvatarSelectSound(audioEnabled); playFireworkPopSound(audioEnabled); setSelectedId(active.id); window.setTimeout(() => navigate("/"), 900); }

  return <div className="relative min-h-screen overflow-hidden bg-[#172a48] p-4 text-white md:p-8">
    <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(#f6b73c_1px,transparent_1px)] [background-size:24px_24px]" />
    <header className="relative z-10 mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-4"><div><p className="font-mono text-[10px] font-black tracking-[.16em] text-[#f6b73c]">MATH4FUN · GUARDIAN GATE</p><h1 className="font-display text-3xl font-black">Chọn Guardian đồng hành</h1><p className="mt-1 text-sm text-[#d5dfed]">Ba Guardian đầu tiên dùng cùng canon và artwork với Map, Collection, Training và Boss.</p></div><button onClick={() => navigate("/")} className="border border-white/40 bg-white/10 px-4 py-2 text-sm font-black">Trang chủ</button></header>
    <main className="relative z-10 mx-auto mt-8 max-w-4xl">
      <div className="relative flex items-center justify-center px-12"><button onClick={previous} aria-label="Guardian trước" className="absolute left-0 z-20 grid h-11 w-11 place-items-center rounded-full border-2 border-[#f6b73c] bg-[#172a48]"><ChevronLeft /></button><AnimatePresence mode="wait"><motion.article key={active.id} initial={{ opacity: 0, x: 35, scale: .96 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -35, scale: .96 }} className="grid w-full max-w-2xl gap-6 border-2 border-[#f6b73c] bg-[#fffdf6] p-6 text-[#172a48] shadow-[7px_7px_0_#f6b73c] md:grid-cols-[240px_1fr]">
        <div className="flex flex-col items-center justify-center"><div className="guardian-stamp grid h-52 w-52 place-items-center overflow-hidden rounded-full border-4 border-[#172a48] bg-transparent p-3 shadow-[0_0_0_6px_#fff0b6]"><img src={active.guardian.sprite} alt={active.guardian.name} className="h-full w-full object-contain" /></div><span className="mt-4 field-tag bg-[#fff0b6] text-[#172a48]">{FIVE_ELEMENT_LABEL[active.affinity].toUpperCase()} · {active.guardian.name}</span></div>
        <div><p className="font-mono text-[9px] font-black tracking-[.15em] text-[#58708b]">ID NỘI BỘ · {active.id.toUpperCase()}</p><h2 className="mt-1 font-display text-4xl font-black">{active.guardian.name}</h2><p className="mt-1 font-bold text-[#4d8b67]">{active.guardian.type}</p><p className="mt-3 text-sm leading-relaxed text-[#58708b]">{active.guardian.description}</p><div className="mt-4 border-l-4 border-[#f6b73c] bg-[#fff8da] p-3"><b>{active.role}</b><p className="mt-1 text-xs text-[#58708b]">{active.mathSkill}</p></div><div className="mt-4 grid grid-cols-2 gap-2 text-xs"><Stat label="Sức mạnh" value={active.stats.power}/><Stat label="Chính xác" value={active.stats.precision}/><Stat label="Tốc độ" value={active.stats.speed}/><Stat label="Phòng thủ" value={active.stats.defense}/></div><div className="mt-4 flex items-start gap-2 text-xs text-[#58708b]"><Info size={15} className="mt-0.5 shrink-0"/><span>{active.mathConceptTooltip}</span></div><button onClick={selectGuardian} className="mt-5 flex w-full items-center justify-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-3 font-black shadow-[3px_3px_0_#172a48]"><Sparkles size={17}/>{selectedId === active.id ? "Đã chọn · đang mở hành trình" : `Chọn ${active.guardian.name}`}</button></div>
      </motion.article></AnimatePresence><button onClick={next} aria-label="Guardian tiếp theo" className="absolute right-0 z-20 grid h-11 w-11 place-items-center rounded-full border-2 border-[#f6b73c] bg-[#172a48]"><ChevronRight /></button></div>
      <div className="mt-6 flex justify-center"><button onClick={() => setShowComparison((value) => !value)} className="inline-flex items-center gap-2 border border-white/40 bg-white/10 px-4 py-2 text-sm font-bold"><GitCompare size={16}/> {showComparison ? "Ẩn so sánh" : "So sánh ba Guardian"}</button></div>
      {showComparison && <section className="mt-4 overflow-x-auto border border-white/30 bg-white/10 p-4"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="text-[#f6b73c]"><th className="p-2">Guardian</th><th>Sức mạnh</th><th>Chính xác</th><th>Tốc độ</th><th>Phòng thủ</th></tr></thead><tbody>{cards.map((item) => <tr key={item.id} className="border-t border-white/15"><td className="p-2 font-black">{item.guardian.name} · {FIVE_ELEMENT_LABEL[item.affinity]}</td><td>{item.stats.power}</td><td>{item.stats.precision}</td><td>{item.stats.speed}</td><td>{item.stats.defense}</td></tr>)}</tbody></table></section>}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">{cards.map((item, index) => <button key={item.id} onClick={() => { playAvatarSlideSound(audioEnabled); setCurrentIndex(index); }} className={`flex items-center gap-3 border p-3 text-left ${index === currentIndex ? "border-[#f6b73c] bg-white/15" : "border-white/25 bg-white/5"}`}><img src={item.guardian.sprite} alt="" className="h-14 w-14 object-contain"/><span><b className="block">{item.guardian.name}</b><small className="text-[#d5dfed]">{FIVE_ELEMENT_LABEL[item.affinity]}</small></span>{index === currentIndex && <CheckCircle2 className="ml-auto text-[#f6b73c]" size={18}/>}</button>)}</section>
      <footer className="mt-7 flex flex-wrap items-center justify-center gap-4 text-xs text-[#d5dfed]"><span className="inline-flex items-center gap-1"><BookOpen size={14}/> Guardian canon thống nhất toàn game</span><span className="inline-flex items-center gap-1"><Award size={14}/> ID save hiện tại được giữ nguyên</span><span className="inline-flex items-center gap-1"><Compass size={14}/> Ngũ hành: Hỏa · Thủy · Mộc · Kim · Thổ</span></footer>
    </main>
  </div>;
}

function Stat({ label, value }: { label: string; value: number }) { return <div className="border border-[#c9b88c] bg-white p-2"><div className="flex justify-between gap-2"><span>{label}</span><b>{value}</b></div><div className="mt-1 h-1.5 bg-[#e6e0cf]"><span className="block h-full bg-[#4d8b67]" style={{ width: `${value}%` }}/></div></div>; }
