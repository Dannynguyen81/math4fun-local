/**
 * Math4Fun — Field Journal Quest
 * Design reminder: tactile field-journal UI, asymmetrical route map, Marigold Compass CTAs,
 * and Pokémon imagery kept as local-only prototype references rather than the product's visual system.
 */
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Compass,
  Crown,
  Flame,
  Gem,
  Home as HomeIcon,
  Leaf,
  Lock,
  Map,
  Play,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  X,
  Zap,
} from "lucide-react";

const HERO_IMAGE = "/manus-storage/math4fun-hero-journey_c4c6745e.jpg";
const ARENA_IMAGE = "/manus-storage/math4fun-combat-arena_c86f9514.jpg";
const CARD_IMAGE = "/manus-storage/math4fun-guardian-card_0acf6e09.jpg";
const STICKERS_IMAGE = "/manus-storage/math4fun-reward-stickers_3366726f.jpg";
const LOGO_IMAGE = "/manus-storage/math4fun-logo-mark_7740cd77.png";
const POKEMON_REFERENCE = "/manus-storage/pokemon-starters-local-reference_4807f3a1.jpeg";

type Station = {
  id: number;
  title: string;
  guardian: string;
  code: string;
  status: "mastered" | "active" | "available" | "locked";
  color: string;
  icon: typeof Zap;
};

const stations: Station[] = [
  { id: 1, title: "Tạo số lớn nhất", guardian: "Pipra", code: "SỐ.01", status: "mastered", color: "bg-emerald-500", icon: Gem },
  { id: 2, title: "Đếm số chẵn lẻ", guardian: "Mimo", code: "SỐ.02", status: "mastered", color: "bg-sky-500", icon: Sparkles },
  { id: 3, title: "Dãy số cách đều", guardian: "Voltix", code: "DÃY.01", status: "active", color: "bg-amber-400", icon: Zap },
  { id: 4, title: "Trồng cây hai đầu", guardian: "Mossy", code: "DÃY.02", status: "available", color: "bg-lime-500", icon: Leaf },
  { id: 5, title: "Tổng và hiệu", guardian: "Coru", code: "BÀI.01", status: "available", color: "bg-rose-400", icon: Swords },
  { id: 6, title: "Thử thách Boss", guardian: "Atlas", code: "BOSS", status: "locked", color: "bg-indigo-700", icon: Crown },
];

const navItems = [
  { label: "Trang chủ", icon: HomeIcon, active: true },
  { label: "Bản đồ học", icon: Map, active: false },
  { label: "Bộ sưu tập", icon: Gem, active: false },
  { label: "Đấu Boss", icon: Swords, active: false },
];

function StationTag({ station, selected, onClick, className = "" }: { station: Station; selected: boolean; onClick: () => void; className?: string }) {
  const Icon = station.icon;
  const locked = station.status === "locked";
  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`route-stop group relative flex w-full items-center gap-3 border-2 border-[#172a48] bg-[#fffdf6] px-3 py-2.5 text-left shadow-[4px_4px_0_#172a48] transition ${
        selected ? "-translate-y-1 bg-[#fff0b6] shadow-[5px_5px_0_#172a48]" : "hover:-translate-y-0.5 hover:bg-[#fff8da]"
      } ${locked ? "cursor-not-allowed opacity-50 grayscale" : ""} ${className}`}
      aria-pressed={selected}
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-[#172a48] ${station.color} text-[#172a48]`}>
        {locked ? <Lock size={16} /> : station.status === "mastered" ? <Check size={19} strokeWidth={3} /> : <Icon size={18} strokeWidth={2.5} />}
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[10px] font-bold tracking-[0.16em] text-[#58708b]">{station.code}</span>
        <span className="block truncate font-semibold text-[#172a48]">{station.title}</span>
      </span>
      <span className="ml-auto text-xs font-bold text-[#58708b]">{station.status === "mastered" ? "Đã xong" : station.status === "active" ? "Đang học" : station.status === "locked" ? "Khoá" : "Mở"}</span>
    </button>
  );
}

function ProgressDots({ current }: { current: number }) {
  return (
    <div className="flex gap-1.5" aria-label={`Ngày ${current} trên 3`}>
      {[1, 2, 3].map((day) => (
        <span key={day} className={`h-2.5 w-8 rounded-full ${day < current ? "bg-emerald-500" : day === current ? "bg-[#f6b73c]" : "bg-[#d7d0bf]"}`} />
      ))}
    </div>
  );
}

export default function Home() {
  const [selectedStation, setSelectedStation] = useState(3);
  const [activeAnswer, setActiveAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [hp, setHp] = useState(72);
  const [xp, setXp] = useState(740);
  const [showCombat, setShowCombat] = useState(false);
  const selected = useMemo(() => stations.find((station) => station.id === selectedStation) ?? stations[2], [selectedStation]);

  const submitAnswer = (answer: number) => {
    if (answered) return;
    setActiveAnswer(answer);
    setAnswered(true);
    if (answer === 24) {
      setHp((value) => Math.max(0, value - 28));
      setXp((value) => value + 40);
      setShowCombat(true);
    }
  };

  const nextQuestion = () => {
    setAnswered(false);
    setActiveAnswer(null);
    setShowCombat(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5efdf] text-[#172a48]">
      <div className="paper-noise pointer-events-none fixed inset-0 z-0" />
      <header className="relative z-20 border-b-2 border-[#172a48] bg-[#fffdf6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1536px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5" aria-label="Math4Fun home">
            <img src={LOGO_IMAGE} alt="Math4Fun compass mark" className="h-11 w-11 object-contain" />
            <span className="leading-none">
              <span className="block font-display text-xl font-black tracking-tight">Math4Fun</span>
              <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#58708b]">field journal</span>
            </span>
          </a>
          <div className="hidden items-center gap-5 md:flex">
            <span className="field-tag"><Flame size={14} className="text-[#ee6b4e]" /> Streak 3 ngày</span>
            <span className="field-tag"><Gem size={14} className="text-[#3e9b7a]" /> 18 dấu ấn</span>
            <button className="flex items-center gap-2 rounded-full border-2 border-[#172a48] bg-[#172a48] px-3 py-1.5 text-sm font-bold text-white shadow-[2px_2px_0_#f6b73c] transition hover:-translate-y-0.5">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#f6b73c] text-[10px] text-[#172a48]">AN</span> An Nhiên
            </button>
          </div>
          <button className="rounded-lg border-2 border-[#172a48] bg-[#f6b73c] p-2 md:hidden" aria-label="Open menu"><Compass size={20} /></button>
        </div>
      </header>

      <main id="top" className="relative z-10 mx-auto grid max-w-[1536px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)_320px] lg:px-8">
        <aside className="order-2 lg:order-1">
          <div className="sticky top-5 rounded-[1.25rem] border-2 border-[#172a48] bg-[#fffdf6] p-3 shadow-[5px_5px_0_#172a48]">
            <p className="px-2 pb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#58708b]">Nhật ký hành trình</p>
            <nav className="space-y-1" aria-label="Primary navigation">
              {navItems.map(({ label, icon: Icon, active }) => (
                <button key={label} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${active ? "bg-[#172a48] text-white" : "hover:bg-[#fff0b6]"}`}>
                  <Icon size={17} className={active ? "text-[#f6b73c]" : "text-[#58708b]"} /> {label}
                </button>
              ))}
            </nav>
            <div className="my-4 border-t-2 border-dashed border-[#d7d0bf]" />
            <div className="rounded-xl bg-[#e7f2e5] p-3">
              <div className="flex items-center justify-between text-xs font-bold"><span>Level 8</span><span>740 / 900 XP</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full w-[82%] rounded-full bg-[#3e9b7a]" /></div>
              <p className="mt-2 text-xs leading-relaxed text-[#476275]">Một trạm nữa để nhận <b>Huy hiệu Khám phá</b>.</p>
            </div>
            <div className="mt-4 rounded-xl border-2 border-dashed border-[#172a48] bg-[#fff8da] p-3">
              <span className="font-mono text-[10px] font-bold tracking-[0.16em]">LOCAL PROTOTYPE</span>
              <p className="mt-1 text-xs leading-relaxed text-[#58708b]">Ảnh Pokémon chỉ dùng cho trải nghiệm thử nghiệm trên máy local.</p>
            </div>
          </div>
        </aside>

        <section className="order-1 min-w-0 lg:order-2">
          <section className="relative overflow-hidden border-2 border-[#172a48] bg-[#172a48] shadow-[7px_7px_0_#f6b73c]">
            <img src={HERO_IMAGE} alt="Original Math4Fun guardians exploring a number trail" className="absolute inset-0 h-full w-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#172a48] via-[#172a48]/80 to-[#172a48]/10" />
            <div className="relative max-w-[66%] px-6 py-8 sm:px-9 sm:py-11">
              <span className="field-tag border-white/40 bg-white/10 text-white"><Compass size={13} className="text-[#f6b73c]" /> World 01 · Số & Quy luật</span>
              <h1 className="mt-4 font-display text-4xl font-black leading-[0.92] tracking-tight text-white sm:text-5xl">Hôm nay, bạn sẽ tìm ra <em className="text-[#f6b73c]">quy luật</em> nào?</h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#e8e4d8] sm:text-base">Mở trạm Dãy số cách đều, cùng Voltix phát hiện bước nhảy bí mật và tích thêm một dấu ấn mới.</p>
              <button onClick={() => document.getElementById("mission")?.scrollIntoView({ behavior: "smooth" })} className="mt-6 inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-3 text-sm font-black text-[#172a48] shadow-[3px_3px_0_white] transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[.98]">
                Đi vào trạm <ArrowRight size={17} />
              </button>
            </div>
            <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-[#fffdf6] px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.13em] text-[#172a48]">ROUTE 03 <span className="h-1.5 w-1.5 rounded-full bg-[#3e9b7a]" /></div>
          </section>

          <section className="mt-8">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="section-kicker">Dấu vết học tập hôm nay</p>
                <h2 className="font-display text-3xl font-black tracking-tight">Tuyến đường: Số & Quy luật</h2>
              </div>
              <button className="inline-flex items-center gap-1.5 text-sm font-bold underline decoration-2 underline-offset-4">Mở bản đồ lớn <ChevronRight size={16} /></button>
            </div>
            <div className="route-map relative overflow-hidden border-2 border-[#172a48] bg-[#dfe9d9] p-4 shadow-[5px_5px_0_#172a48] sm:p-6">
              <div className="map-canvas relative">
                <svg className="route-stitch" viewBox="0 0 1000 610" fill="none" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M100 82 C265 42 400 104 500 172 S755 172 810 274 S640 386 520 414 S286 452 345 542" stroke="#172a48" strokeWidth="5" strokeDasharray="7 13" strokeLinecap="round" />
                  <path d="M106 79 C271 39 406 101 506 169 S761 169 816 271 S646 383 526 411 S292 449 351 539" stroke="#fffdf6" strokeWidth="1.5" strokeDasharray="3 17" strokeLinecap="round" />
                </svg>
                {stations.map((station) => (
                  <div key={station.id} className={`map-stop map-stop-${station.id}`}>
                    <span className="map-pin" aria-hidden="true" />
                    <StationTag station={station} selected={station.id === selectedStation} onClick={() => !["locked"].includes(station.status) && setSelectedStation(station.id)} />
                  </div>
                ))}
                <span className="map-note note-a">bước nhỏ → bằng chứng lớn</span>
                <span className="map-note note-b">dấu chân Voltix</span>
              </div>
              <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-[#172a48]/30 pt-4 text-xs text-[#476275]"><span><b>2 / 6</b> station đã có guardian</span><span className="font-bold">Boss Atlas đang chờ</span></div>
            </div>
          </section>

          <section id="mission" className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_.7fr]">
            <div className="paper-stack relative overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] p-5 shadow-[6px_6px_0_#172a48] sm:p-6">
              <span className="paper-tape" aria-hidden="true" />
              <div className="absolute right-0 top-0 h-16 w-16 border-b-2 border-l-2 border-[#172a48] bg-[#f6b73c]" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <span className="section-kicker">Nhiệm vụ đang mở</span>
                  <h2 className="mt-1 font-display text-3xl font-black">{selected.title}</h2>
                  <p className="mt-2 text-sm text-[#58708b]">Day 2 of 3 · Đạt 9/10 để bảo vệ streak.</p>
                </div>
                <ProgressDots current={2} />
              </div>
              <div className="mt-6 rounded-2xl border-2 border-[#d7d0bf] bg-[#f8f3e7] p-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#58708b]">Câu hỏi 07 / 10</p>
                <p className="mt-3 font-display text-3xl font-black leading-tight">4, 8, 12, 16, <span className="text-[#ee6b4e]">?</span></p>
                <p className="mt-2 text-sm text-[#58708b]">Số tiếp theo trong dãy là bao nhiêu?</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[18, 20, 24, 28].map((answer) => {
                    const correct = answer === 24;
                    const selectedAnswer = activeAnswer === answer;
                    let state = "border-[#172a48] bg-white hover:bg-[#fff0b6]";
                    if (answered && correct) state = "border-[#3e9b7a] bg-[#e7f2e5]";
                    if (answered && selectedAnswer && !correct) state = "border-[#ee6b4e] bg-[#ffe4dc]";
                    return <button key={answer} onClick={() => submitAnswer(answer)} className={`answer-choice border-2 px-4 py-3 text-left font-display text-2xl font-black shadow-[2px_2px_0_#172a48] transition active:scale-[.98] ${state}`}>{answer}</button>;
                  })}
                </div>
                {answered && <div className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold ${activeAnswer === 24 ? "bg-[#e7f2e5] text-[#235b45]" : "bg-[#ffe4dc] text-[#9e3d2d]"}`}>
                  {activeAnswer === 24 ? <><Check size={18} /> Chính xác! Bước nhảy luôn là +4.</> : <><X size={18} /> Thử nhìn khoảng cách giữa các số nhé.</>}
                </div>}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3"><span className="field-tag"><BookOpen size={14} /> 2 ví dụ đã mở</span><span className="field-tag"><ShieldCheck size={14} /> Có gợi ý</span><button className="ml-auto text-sm font-bold underline decoration-[#f6b73c] decoration-2 underline-offset-4">Xem lời giải mẫu</button></div>
            </div>

            <article className="guardian-guide relative overflow-hidden border-2 border-[#172a48] bg-[#172a48] p-5 text-white shadow-[5px_5px_0_#ee6b4e]">
              <span className="field-tag border-white/25 bg-white/10 text-white"><Zap size={14} className="text-[#f6b73c]" /> Guardian đang đồng hành</span>
              <div className="guardian-stamp mx-auto mt-3"><img src={CARD_IMAGE} alt="Original Math4Fun guardian portrait" className="h-40 w-40 rounded-full object-cover" /><span className="stamp-seal">M4F</span></div>
              <div className="mt-3 flex items-end justify-between gap-2"><div><p className="font-mono text-[10px] tracking-[0.15em] text-[#9bb4ce]">ELECTRIC / PATTERN</p><h3 className="font-display text-3xl font-black">Voltix</h3></div><span className="rounded-full bg-[#f6b73c] px-2 py-1 font-mono text-[10px] font-bold text-[#172a48]">LV.08</span></div>
              <p className="mt-3 text-sm leading-relaxed text-[#d5dfed]">“Đừng đoán. Hãy nhìn bước nhảy giữa hai số liên tiếp.”</p>
              <div className="mt-4 rounded-xl bg-white/10 p-3"><div className="flex justify-between text-xs font-bold"><span>Năng lượng</span><span>{xp} XP</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20"><div style={{ width: `${Math.min(100, (xp / 900) * 100)}%` }} className="h-full rounded-full bg-[#f6b73c]" /></div></div>
            </article>
          </section>

          <section className="mt-8 overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] shadow-[5px_5px_0_#172a48]">
            <div className="grid items-center gap-4 p-4 sm:grid-cols-[auto_1fr_auto] sm:p-5"><img src={STICKERS_IMAGE} alt="Math4Fun reward stickers" className="h-20 w-20 object-contain" /><div><p className="section-kicker">Collection update</p><h2 className="font-display text-2xl font-black">Mở dấu ấn thứ 3 trong hôm nay</h2><p className="text-sm text-[#58708b]">Hoàn thành 3 câu đúng liên tiếp để nhận sticker La bàn ánh vàng.</p></div><button className="justify-self-start border-2 border-[#172a48] bg-[#fff0b6] px-4 py-2 text-sm font-bold shadow-[2px_2px_0_#172a48] transition hover:-translate-y-0.5">Xem collection</button></div>
          </section>
        </section>

        <aside className="order-3 space-y-6">
          <section className="evidence-note overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] shadow-[3px_3px_0_#172a48]">
            <div className="flex items-center justify-between border-b-2 border-[#172a48] bg-[#f6b73c] px-4 py-3"><span className="font-display text-xl font-black">Bằng chứng hôm nay</span><Trophy size={21} /></div>
            <div className="p-4"><div className="flex gap-3"><div className="guardian-stamp guardian-stamp-mini"><img src={POKEMON_REFERENCE} alt="Pokémon reference artwork used locally" className="h-16 w-16 rounded-full object-cover object-left" /></div><div><p className="font-bold">An Nhiên</p><p className="text-sm text-[#58708b]">Bạn đã giữ mạch học 3 ngày.</p><span className="mt-1 inline-flex rounded-full bg-[#e7f2e5] px-2 py-0.5 text-[10px] font-bold text-[#235b45]">Đã có bằng chứng</span></div></div><div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-[#f8f3e7] p-2"><b className="block font-display text-xl">08</b><span className="text-[10px] text-[#58708b]">Level</span></div><div className="rounded-xl bg-[#f8f3e7] p-2"><b className="block font-display text-xl">03</b><span className="text-[10px] text-[#58708b]">Streak</span></div><div className="rounded-xl bg-[#f8f3e7] p-2"><b className="block font-display text-xl">18</b><span className="text-[10px] text-[#58708b]">Dấu ấn</span></div></div></div>
          </section>
          <section className="overflow-hidden border-2 border-[#172a48] bg-[#172a48] text-white shadow-[5px_5px_0_#3e9b7a]">
            <div className="relative h-32 overflow-hidden"><img src={ARENA_IMAGE} alt="Math4Fun combat arena" className="h-full w-full object-cover opacity-70" /><div className="absolute inset-0 bg-gradient-to-t from-[#172a48] to-transparent" /><span className="absolute bottom-3 left-4 font-mono text-[10px] font-bold tracking-[0.18em] text-[#f6b73c]">BOSS RADAR</span></div>
            <div className="p-4"><div className="flex items-center justify-between"><div><p className="font-display text-2xl font-black">Atlas đang chờ</p><p className="text-sm text-[#b4c6db]">Mở khi chinh phục 4 station.</p></div><span className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#f6b73c]"><Crown size={19} className="text-[#f6b73c]" /></span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full w-1/2 rounded-full bg-[#f6b73c]" /></div><p className="mt-2 text-xs text-[#d5dfed]">2/4 station đã sẵn sàng</p></div>
          </section>
          <section className="border-2 border-dashed border-[#172a48] bg-[#fff8da] p-4"><p className="section-kicker">Gợi ý nhỏ</p><p className="mt-2 text-sm leading-relaxed">Khi chưa chắc, hãy kéo đường số trong phần ví dụ. Voltix sẽ chỉ cho bạn khoảng cách giữa các số.</p><button className="mt-3 inline-flex items-center gap-1 text-sm font-bold underline decoration-2 underline-offset-4">Mở ví dụ <ChevronRight size={15} /></button></section>
        </aside>
      </main>

      {showCombat && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#172a48]/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Combat result">
          <section className="battle-pop w-full max-w-3xl overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] shadow-[8px_8px_0_#f6b73c]">
            <div className="relative h-56 bg-[#172a48] sm:h-64"><img src={ARENA_IMAGE} alt="Math4Fun combat arena" className="h-full w-full object-cover opacity-75" /><div className="absolute inset-0 bg-gradient-to-t from-[#172a48] via-transparent to-transparent" /><div className="absolute left-5 top-5 rounded-lg border-2 border-white/50 bg-[#172a48]/75 px-3 py-2 text-white"><p className="font-mono text-[10px] tracking-[0.16em] text-[#f6b73c]">VOLTiX DÙNG</p><p className="font-display text-2xl font-black">Pattern Spark!</p></div><div className="absolute bottom-5 right-5 text-right"><p className="font-display text-5xl font-black italic text-[#f6b73c]">-28</p><p className="font-mono text-[10px] font-bold tracking-[0.16em] text-white">BOSS ATLAS</p></div><div className="absolute bottom-6 left-6 right-6 h-3 overflow-hidden rounded-full border border-white/50 bg-[#172a48]"><div style={{ width: `${hp}%` }} className="h-full bg-[#ee6b4e] transition-all duration-700" /></div></div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-5"><div><p className="section-kicker">Câu trả lời chính xác</p><h2 className="font-display text-3xl font-black">Quy luật +4 đã tạo đòn chí mạng!</h2><p className="mt-1 text-sm text-[#58708b]">Bạn nhận +40 XP và giữ streak ngày thứ 2.</p></div><button onClick={nextQuestion} className="inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-3 font-bold shadow-[3px_3px_0_#172a48] transition hover:-translate-y-0.5"><Play size={16} fill="currentColor" /> Câu tiếp theo</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
