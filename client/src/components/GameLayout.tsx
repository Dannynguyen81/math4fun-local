/** Math4Fun application shell — Field Journal Quest keeps the map, journal navigation and player evidence visible on every route. */
import { Link, useLocation } from "wouter";
import { BookOpen, Compass, Flame, Gem, Home, Map, ShieldCheck, Swords } from "lucide-react";
import { LOGO_IMAGE } from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";

const navItems = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/map", label: "Bản đồ học", icon: Map },
  { href: "/collection", label: "Bộ sưu tập", icon: Gem },
  { href: "/boss", label: "Đấu Boss", icon: Swords },
];

function isActivePath(path: string, href: string) {
  return href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
}

function routeLabel(path: string) {
  if (path.startsWith("/station/")) return "Đang ghi chép tại trạm";
  if (path === "/collection") return "Sổ dấu ấn trên tuyến đường";
  if (path === "/boss") return "Tuyến đường dẫn về đấu trường";
  if (path === "/map") return "Đường chỉ khâu của hành trình";
  return "Trang mở đầu của chuyến thám hiểm";
}

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { progress, level, levelProgress, isBossUnlocked } = useGame();
  const progressPercent = Math.round((levelProgress / 180) * 100);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5efdf] text-[#172a48]">
      <div className="paper-noise pointer-events-none fixed inset-0 z-0" />
      <header className="relative z-30 border-b-2 border-[#172a48] bg-[#fffdf6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1536px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Math4Fun trang chủ">
            <img src={LOGO_IMAGE} alt="Biểu tượng la bàn Math4Fun" className="h-11 w-11 object-contain" />
            <span className="leading-none"><span className="block font-display text-xl font-black tracking-tight">Math4Fun</span><span className="block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#58708b]">field journal</span></span>
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <span className="field-tag"><Flame size={14} className="text-[#ee6b4e]" /> Streak {progress.streak} ngày</span>
            <span className="field-tag"><Gem size={14} className="text-[#3e9b7a]" /> {progress.collectedGuardianIds.length} guardian</span>
            <span className="flex items-center gap-2 rounded-full border-2 border-[#172a48] bg-[#172a48] px-3 py-1.5 text-sm font-bold text-white shadow-[2px_2px_0_#f6b73c]"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#f6b73c] text-[10px] text-[#172a48]">AN</span> An Nhiên</span>
          </div>
          <span className="field-tag md:hidden">Lv.{level}</span>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid max-w-[1536px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <aside className="order-2 lg:order-1">
          <div className="sticky top-5 rounded-[1.25rem] border-2 border-[#172a48] bg-[#fffdf6] p-3 shadow-[5px_5px_0_#172a48]">
            <p className="px-2 pb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#58708b]">Nhật ký hành trình</p>
            <nav className="space-y-1" aria-label="Điều hướng chính">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = isActivePath(location, href);
                return <Link key={href} href={href} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-[#172a48] text-white" : "hover:bg-[#fff0b6]"}`}><Icon size={17} className={active ? "text-[#f6b73c]" : "text-[#58708b]"} /> {label}</Link>;
              })}
            </nav>
            <div className="my-4 border-t-2 border-dashed border-[#d7d0bf]" />
            <div className="rounded-xl bg-[#e7f2e5] p-3"><div className="flex items-center justify-between text-xs font-bold"><span>Level {level}</span><span>{levelProgress} / 180 XP</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div style={{ width: `${progressPercent}%` }} className="h-full rounded-full bg-[#3e9b7a] transition-[width] duration-300" /></div><p className="mt-2 text-xs leading-relaxed text-[#476275]">Mỗi câu đúng lần đầu thưởng <b>40 XP</b>.</p></div>
            <div className="mt-4 rounded-xl border-2 border-dashed border-[#172a48] bg-[#fff8da] p-3"><span className="font-mono text-[10px] font-bold tracking-[0.16em]">LOCAL PROTOTYPE</span><p className="mt-1 text-xs leading-relaxed text-[#58708b]">Tiến độ chỉ lưu trong trình duyệt này. Hình Pokémon là tham chiếu thử nghiệm phi thương mại.</p></div>
          </div>
        </aside>

        <main className="order-1 min-w-0 lg:order-2">
          <div className="journey-strip mb-5" aria-label="Dấu vết hành trình hiện tại">
            <span className="journey-strip-label"><Compass size={13} /> {routeLabel(location)}</span>
            <span className="journey-thread" aria-hidden="true"><i /><i /><i className={location === "/map" ? "is-current" : ""} /><i /><i /></span>
            <span className="journey-strip-proof">LV.{level} · {progress.completedQuestionIds.length} bằng chứng</span>
          </div>
          {children}
        </main>
      </div>

      <nav className="sticky bottom-0 z-30 grid grid-cols-4 border-t-2 border-[#172a48] bg-[#fffdf6] px-2 py-2 lg:hidden" aria-label="Điều hướng trên di động">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActivePath(location, href);
          return <Link key={href} href={href} className={`grid place-items-center gap-1 rounded-lg py-1.5 text-[10px] font-bold ${active ? "bg-[#172a48] text-white" : "text-[#58708b]"}`}><Icon size={16} className={active ? "text-[#f6b73c]" : ""} />{label}</Link>;
        })}
      </nav>
      <footer className="relative z-10 border-t-2 border-dashed border-[#d7d0bf] px-4 py-5 text-center text-xs text-[#58708b]"><BookOpen className="mr-1 inline-block" size={13} /> Câu hỏi hiển thị nguồn Archimede Toán 4 Tập 1, PDF trang 38–39. <ShieldCheck className="ml-1 inline-block text-[#3e9b7a]" size={13} /></footer>
      {isBossUnlocked && <div className="pointer-events-none fixed bottom-24 right-4 z-20 hidden rounded-full border-2 border-[#172a48] bg-[#f6b73c] px-3 py-2 text-xs font-black shadow-[3px_3px_0_#172a48] lg:block"><Compass className="mr-1 inline-block" size={14} /> Boss Atlas đã mở</div>}
    </div>
  );
}
