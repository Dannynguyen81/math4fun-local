import { useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
/** Field Journal Quest: parchment dossier shell, stitched route, Marigold next actions, and companion identity remain visible throughout. */
import { BarChart3, Bell, BookOpen, BookMarked, CalendarClock, ChevronDown, ClipboardPenLine, Cloud, CloudOff, CloudUpload, Compass, Flame, Gem, Home, LockKeyhole, LogOut, Map, Music2, Scale, ShieldCheck, ShoppingBag, Swords, TriangleAlert, Trophy, UserRound, Volume2, VolumeX } from "lucide-react";
import { LOGO_IMAGE, MAGIC_MEDIA } from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";
import { useAuthGate } from "@/components/AuthGate";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const AMBIENT_AUDIO = "/manus-storage/math4fun-field-journal-ambient_ab24706b.mp3";

const navItems = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/map", label: "Bản đồ", icon: Map },
  { href: "/collection", label: "Guardian", icon: Gem },
  { href: "/magic-book", label: "Sổ Phép", icon: BookMarked },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/training", label: "Huấn luyện", icon: Swords },
  { href: "/leaderboard", label: "Xếp hạng", icon: Trophy },
  { href: "/compare", label: "So sánh", icon: Scale },
  { href: "/study-calendar", label: "Lịch học", icon: CalendarClock },
  { href: "/stats", label: "Thống kê", icon: BarChart3 },
];

const isActivePath = (path: string, href: string) => href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);

function routeLabel(path: string) {
  if (path === "/start") return "Phiếu khởi đầu của nhà thám hiểm";
  if (path === "/profile") return "Hồ sơ cá nhân đã ký tên";
  if (path === "/admin/questions") return "Console quản trị · duyệt ngân hàng câu hỏi";
  if (path.startsWith("/station/")) return "Đang ghi bằng chứng tại một trạm";
  if (path === "/shop") return "Quầy tiếp tế trên tuyến đường";
  if (path === "/training") return "Võ đài luyện phép của guardian";
  if (["/boss", "/map-boss"].includes(path)) return "Cửa cuối Map 1 · Boss tổng hợp";
  if (path === "/map2-boss") return "Cửa cuối Map 2 · Boss tổng hợp";
  if (path === "/stats") return "Báo cáo local của hành trình";
  return "Đường chỉ khâu của hành trình";
}

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const {
    profile, level, levelProgress, audioEnabled, setAudioEnabled, ambientEnabled, setAmbientEnabled,
    unreadReportReplies, markReportReplyRead, isBossUnlocked, gold, exitGame, elementBadges,
    studyReminder, isAdmin, syncStatus, syncStatusLabel,
  } = useGame();
  const { openAuth } = useAuthGate();
  const ambientRef = useRef<HTMLAudioElement>(null);
  const landingHome = location === "/";
  const activeBattle = profile?.battle?.status === "active";
  const activeStationAttempt = location.startsWith("/station/") && Object.values(profile?.attempts ?? {}).some((attempt) => Boolean(attempt.currentQuestionId));
  const questionRoute = activeStationAttempt || location === "/training" || (activeBattle && ["/boss", "/map-boss", "/map2-boss"].includes(location));
  const progressPercent = Math.round((levelProgress / 250) * 100);
  const visibleNavItems = isAdmin ? [...navItems, { href: "/admin/questions", label: "Duyệt câu hỏi", icon: ClipboardPenLine }] : navItems;
  const syncVisual = syncStatus === "synced"
    ? { icon: Cloud, className: "bg-[#e7f2e5] text-[#27735a]" }
    : syncStatus === "syncing"
      ? { icon: CloudUpload, className: "bg-[#dbe5ff] text-[#294f86]" }
      : syncStatus === "offline" || syncStatus === "disabled"
        ? { icon: CloudOff, className: "bg-[#f1eee3] text-[#66778a]" }
        : { icon: TriangleAlert, className: "bg-[#fff0b6] text-[#a4493e]" };
  const SyncIcon = syncVisual.icon;

  useEffect(() => {
    const audio = ambientRef.current;
    if (!audio) return;
    audio.volume = 0.09;
    if (audioEnabled && ambientEnabled && !questionRoute) audio.play().catch(() => undefined);
    else audio.pause();
  }, [audioEnabled, ambientEnabled, questionRoute]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5efdf] text-[#172a48]">
      <audio ref={ambientRef} src={AMBIENT_AUDIO} loop preload="auto" />
      <div className="paper-noise pointer-events-none fixed inset-0 z-0" />
      <header className={`relative z-30 border-b-2 border-[#172a48] backdrop-blur ${landingHome ? "bg-[#0d1631]/94 text-white" : "bg-[#fffdf6]/95"}`}>
        <div className="mx-auto flex max-w-[1536px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className={`flex items-center gap-2.5 ${landingHome ? "text-white" : ""}`} aria-label="Math4Fun trang chủ">
            <img src={LOGO_IMAGE} alt="Biểu tượng la bàn Math4Fun" className="h-11 w-11 object-contain" />
            <span className="leading-none"><span className="block font-display text-xl font-black tracking-tight">Math4Fun</span><span className={`block font-mono text-[9px] font-bold uppercase tracking-[.18em] ${landingHome ? "text-[#b9cae4]" : "text-[#58708b]"}`}>field journal</span></span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} role="status" aria-live="polite" aria-label={syncStatusLabel} className={`grid h-10 w-10 place-items-center rounded-lg border-2 border-[#172a48] shadow-[2px_2px_0_#172a48] transition hover:scale-105 ${syncVisual.className}`}>
                  <SyncIcon size={18} aria-hidden="true" />
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-64 border-2 border-[#172a48] bg-[#172a48] text-center text-xs text-white">{syncStatusLabel}</TooltipContent>
            </Tooltip>

            {profile && (
              <div className="relative flex items-center gap-1.5 rounded-lg border-2 border-[#172a48] bg-[#fff0b6] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0_#172a48]" aria-label={`${gold} Gold`} title={`${gold} Gold`}>
                <span className="coin-sparkle-1 pointer-events-none absolute -left-1.5 -top-1.5 text-xs font-black text-[#f6b73c]">✨</span>
                <span className="coin-sparkle-2 pointer-events-none absolute -bottom-1 -right-1 text-[10px] font-black text-[#f6b73c]">⭐</span>
                <img src="/manus-storage/math4fun-gold-coin-3d_1a25edfc.png" alt="" aria-hidden="true" className="gold-coin-wobble h-7 w-7 shrink-0 object-contain drop-shadow-[0_2px_0_rgba(23,42,72,.42)]" />
                <span className="font-display text-sm tracking-tight text-[#172a48]">{gold}</span>
              </div>
            )}

            {profile && unreadReportReplies.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative grid h-10 w-10 place-items-center rounded-lg border-2 border-[#172a48] bg-[#e7f2e5] shadow-[2px_2px_0_#172a48] transition hover:scale-105" aria-label={`${unreadReportReplies.length} phản hồi report mới`}>
                    <Bell size={18} />
                    <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full border-2 border-[#172a48] bg-[#ee6b4e] px-1 text-[10px] font-black text-white">{unreadReportReplies.length}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 border-2 border-[#172a48] bg-[#fffdf6] p-2 shadow-[4px_4px_0_#172a48]">
                  <p className="border-b-2 border-dashed border-[#d7d0bf] px-2 pb-2 font-mono text-[10px] font-black tracking-[.14em]">THƯ PHẢN HỒI · {unreadReportReplies.length}</p>
                  {unreadReportReplies.slice(0, 4).map((report) => (
                    <DropdownMenuItem key={report.id} onSelect={() => markReportReplyRead(report.id)} className="my-1 block whitespace-normal border-2 border-dashed border-[#172a48] bg-[#fff8da] p-2">
                      <b className="block text-xs">Q.{report.questionId} · {report.status === "resolved" ? "Đã xử lý" : "Đang xem xét"}</b>
                      <span className="mt-1 block text-xs leading-relaxed text-[#476275]">{report.adminReply}</span>
                      <span className="mt-2 block font-mono text-[9px] font-black tracking-[.12em]">BẤM ĐỂ ĐÁNH DẤU ĐÃ ĐỌC</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {profile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 rounded-lg border-2 border-[#172a48] bg-[#172a48] py-1.5 pl-1.5 pr-3 text-sm font-bold text-white shadow-[2px_2px_0_#f6b73c] transition hover:scale-[1.02]" aria-label="Mở menu tài khoản">
                    <div className="grid h-8 w-8 place-items-center rounded-full border border-[#f6b73c] bg-[#fffdf6] overflow-hidden">
                      <PlayerAvatar avatar={profile.avatar} name={profile.name} outfitId={profile.equippedCosmetics.outfit} trailId={profile.equippedCosmetics.trail} size="sm" compact />
                    </div>
                    <span className="hidden max-w-32 truncate font-display font-black tracking-tight sm:block">{profile.name}</span>
                    <ChevronDown size={14} className="text-[#f6b73c]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 border-2 border-[#172a48] bg-[#fffdf6] p-2 shadow-[4px_4px_0_#172a48]">
                  <div className="border-b-2 border-dashed border-[#d7d0bf] px-2 pb-2"><b className="block truncate font-display font-black text-sm">{profile.name}</b><span className="block truncate font-mono text-xs text-[#58708b]">@{profile.username}</span></div>
                  <DropdownMenuItem onSelect={() => navigate("/profile")} className="cursor-pointer font-bold"><UserRound size={15} className="mr-2" />Hồ sơ cá nhân</DropdownMenuItem>
                  {isAdmin && <DropdownMenuItem onSelect={() => navigate("/admin/questions")} className="cursor-pointer font-bold"><ClipboardPenLine size={15} className="mr-2" />Duyệt câu hỏi</DropdownMenuItem>}
                  <DropdownMenuItem variant="destructive" onSelect={() => { exitGame(); navigate("/"); }} className="cursor-pointer font-bold text-[#ee6b4e]"><LogOut size={15} className="mr-2" />Đăng xuất</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <button onClick={() => setAmbientEnabled(!ambientEnabled)} className={`grid h-10 w-10 place-items-center rounded-lg border-2 border-[#172a48] shadow-[2px_2px_0_#172a48] transition hover:scale-105 ${ambientEnabled ? "bg-[#dbe5ff] text-[#294f86]" : "bg-[#fffdf6] text-[#58708b]"}`} aria-label={ambientEnabled ? "Tắt nhạc nền" : "Bật nhạc nền"} title={ambientEnabled ? "Tắt nhạc nền" : "Bật nhạc nền"}><Music2 size={18} className={ambientEnabled ? "" : "opacity-40"} /></button>
            <button onClick={() => setAudioEnabled(!audioEnabled)} className={`grid h-10 w-10 place-items-center rounded-lg border-2 border-[#172a48] shadow-[2px_2px_0_#172a48] transition hover:scale-105 ${audioEnabled ? "bg-[#fff8da] text-[#a47326]" : "bg-[#fffdf6] text-[#58708b]"}`} aria-label={audioEnabled ? "Tắt âm hiệu ứng" : "Bật âm hiệu ứng"} title={audioEnabled ? "Tắt âm hiệu ứng" : "Bật âm hiệu ứng"}>{audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="opacity-40" />}</button>

            {!profile && <button onClick={() => openAuth("login")} className="rounded-lg border-2 border-[#172a48] bg-[#f6b73c] px-4 py-2 font-display text-sm font-black text-[#172a48] shadow-[3px_3px_0_#172a48] transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[.97]">Đăng nhập</button>}
          </div>
        </div>
      </header>

      <div className={`relative z-10 mx-auto max-w-[1536px] px-4 py-6 sm:px-6 lg:px-8 ${landingHome ? "" : "lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-8"}`}>
        {!landingHome && <aside className="order-2 mb-6 lg:order-1 lg:mb-0 lg:opacity-90"><div className="sticky top-5 border-2 border-[#172a48] bg-[#fffdf6]/88 p-3 shadow-[3px_3px_0_#172a48]">
          <p className="px-2 pb-3 font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[#58708b]">Nhật ký hành trình · chỉ mục</p>
          {profile && <div className="mb-3 flex items-center gap-2 border-2 border-dashed border-[#172a48] bg-[#eef1fb] p-2"><PlayerAvatar avatar={profile.avatar} name={profile.name} outfitId={profile.equippedCosmetics.outfit} trailId={profile.equippedCosmetics.trail} size="sm" /><span className="min-w-0"><b className="block truncate text-sm">{profile.name}</b><small className="font-mono text-[9px] font-bold tracking-[.12em] text-[#58708b]">{isAdmin ? "LOCAL ADMIN ACTIVE" : "COMPANION ACTIVE"}</small></span></div>}
          <nav className="space-y-1" aria-label="Điều hướng chính">{visibleNavItems.map(({ href, label, icon: Icon }) => { const active = isActivePath(location, href); return <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold transition ${active ? "bg-[#172a48] text-white" : "hover:bg-[#fff0b6]"}`}><Icon size={16} className={active ? "text-[#f6b73c]" : "text-[#58708b]"} />{label}</Link>; })}</nav>
          <div className="my-4 border-t-2 border-dashed border-[#d7d0bf]" />
          {profile ? <>
            <Link href="/profile" className="block border-2 border-dashed border-[#172a48] bg-[#eef1fb] p-3 text-xs hover:bg-[#dbe5ff]"><UserRound className="mr-1 inline" size={13} /><b>Hồ sơ cá nhân</b><span className="mt-1 block text-[#58708b]">Xem dấu vết và cài đặt hành trình</span></Link>
            <div className="mt-4 bg-[#e7f2e5] p-3"><div className="flex items-center justify-between text-xs font-bold"><span>Level {level}</span><span>{levelProgress}/250 XP</span></div><div className="mt-2 h-2 overflow-hidden bg-white"><div style={{ width: `${progressPercent}%` }} className="h-full bg-[#3e9b7a] transition-[width] duration-300" /></div><p className="mt-2 text-xs leading-relaxed text-[#476275]"><Flame className="mr-1 inline text-[#ee6b4e]" size={13} />Chuỗi học {profile.streak} ngày</p></div>
            {studyReminder && <Link href="/study-calendar" className="mt-4 block border-2 border-dashed border-[#172a48] bg-[#fff8da] p-3 text-xs hover:bg-[#fff0b6]"><p className="font-mono text-[9px] font-bold tracking-[.13em]">NHẮC TUYẾN HỌC</p><p className="mt-1 font-bold leading-relaxed">{studyReminder.state === "today" ? "Hôm nay cần ghi bằng chứng." : "Xem lịch tuần kế tiếp."}</p></Link>}
            <div className="mt-4 border-2 border-dashed border-[#172a48] bg-[#fff8da] p-3 text-xs"><p className="font-mono text-[10px] font-bold tracking-[.14em]">ĐỘI BATTLE</p><p className="mt-1 font-bold">{profile.teamGuardianIds.length}/3 guardian được chọn</p></div>
            {elementBadges.length > 0 && <div className="mt-4 border-2 border-[#172a48] bg-[#fff0b6] p-3 text-xs shadow-[2px_2px_0_#172a48]"><p className="font-mono text-[10px] font-bold tracking-[.14em]">HUY HIỆU BA BẬC</p><div className="mt-2 flex flex-wrap gap-1">{elementBadges.map((element) => <span key={element} title={`Huy hiệu Ba Bậc ${MAGIC_MEDIA[element].shortLabel}`} className="grid h-7 w-7 place-items-center rounded-full border border-[#172a48] bg-[#f6b73c] font-black">★</span>)}</div></div>}
          </> : <button onClick={() => openAuth("register")} className="block w-full overflow-hidden border-2 border-dashed border-[#172a48] bg-[#fff8da] p-3 text-left transition hover:bg-[#fff0b6] active:scale-[.98]"><span className="font-mono text-[9px] font-bold tracking-[.14em] text-[#58708b]">ROUTE DORMANT</span><span className="mt-2 grid h-16 place-items-center border-y-2 border-dashed border-[#172a48] bg-[#fffdf6]"><span className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#172a48] bg-[#d7d0bf]"><LockKeyhole size={16} /></span></span><b className="mt-3 block font-display text-xl">Bản đồ chưa ký tên</b><span className="mt-1 block text-xs leading-relaxed text-[#58708b]">Đường chỉ khâu sẽ sáng theo lựa chọn của em.</span><span className="mt-3 block text-sm font-bold">Ký tên mở sổ <Compass className="ml-1 inline" size={14} /></span></button>}
          <div className="mt-4 text-xs leading-relaxed text-[#58708b]"><ShieldCheck className="mr-1 inline text-[#3e9b7a]" size={13} />Tiến độ chỉ lưu ở trình duyệt này.</div>
        </div></aside>}
        <main className="min-w-0 lg:order-2">{!landingHome && <div className="journey-strip mb-5"><span className="journey-strip-label"><Compass size={13} />{routeLabel(location)}</span><span className="journey-thread" aria-hidden="true"><i /><i /><i className={location === "/map" ? "is-current" : ""} /><i /><i /></span><span className="journey-strip-proof">{profile ? `LV.${level} · ${profile.correctQuestionIds.length} bằng chứng · ${gold} Gold` : "CHƯA MỞ SỔ"}</span></div>}{children}</main>
      </div>
      {!landingHome && <nav className="sticky bottom-0 z-30 grid grid-cols-5 border-t-2 border-[#172a48] bg-[#fffdf6] px-2 py-2 lg:hidden">{navItems.slice(0, 5).map(({ href, label, icon: Icon }) => { const active = isActivePath(location, href); return <Link key={href} href={href} className={`grid place-items-center gap-1 rounded-lg py-1.5 text-[8px] font-bold ${active ? "bg-[#172a48] text-white" : "text-[#58708b]"}`}><Icon size={15} className={active ? "text-[#f6b73c]" : ""} />{label}</Link>; })}</nav>}
      <footer className="relative z-10 border-t-2 border-dashed border-[#d7d0bf] px-4 py-5 text-center text-xs text-[#58708b]"><BookOpen className="mr-1 inline-block" size={13} />Câu hỏi hiển thị có nguồn Archimede Toán 4 Tập 1–2 đã đối chiếu. <ShieldCheck className="ml-1 inline-block text-[#3e9b7a]" size={13} /></footer>
      {isBossUnlocked && <div className="pointer-events-none fixed bottom-24 right-4 z-20 hidden border-2 border-[#172a48] bg-[#f6b73c] px-3 py-2 text-xs font-black shadow-[3px_3px_0_#172a48] lg:block"><Compass className="mr-1 inline-block" size={14} />Boss Atlas đã mở</div>}
    </div>
  );
}
