/**
 * Field Journal Quest — Stats dossier.
 * Design reminder: parchment evidence sheets, indigo ink, marigold compass accents, and compact field records.
 */
import { useRef, useState } from "react";
import { Link } from "wouter";
import { BarChart3, BookOpen, Crosshair, Download, Flame, KeyRound, LockKeyhole, ScrollText, ShieldCheck, Sparkles, Swords, Upload } from "lucide-react";
import { ELEMENT_ORDER, ELEMENT_XP_PER_LEVEL, MAGIC_MEDIA, STATIONS, type ElementName } from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ELEMENT_COLORS: Record<ElementName, string> = { "sấm": "#f6b73c", "lửa": "#ee6b4e", "nước": "#55a9dd", "độc": "#8e69ad", "gió": "#3e9b7a", "đất": "#b17a3d" };
const ELEMENT_SIGILS: Record<ElementName, string> = { "sấm": "ϟ", "lửa": "✦", "nước": "≈", "độc": "☾", "gió": "≋", "đất": "◆" };

export default function StatsPage() {
  const { profile, stationProgress, siteVisitCount, lastSiteVisitAt, mostUsedMagicElement, magicBookWatchedCount, hasMagicBookAchievement, elementXp, elementLevel, weeklyMagicQuest, createProfileBackup, restoreProfileBackup, hasParentPin, setParentPin } = useGame();
  const uploadRef = useRef<HTMLInputElement>(null);
  const [transferMessage, setTransferMessage] = useState("");
  const [pendingBackup, setPendingBackup] = useState<File | null>(null);
  const [parentPin, setParentPinValue] = useState("");
  const [parentPinConfirm, setParentPinConfirm] = useState("");
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinBusy, setPinBusy] = useState(false);

  if (!profile) {
    return <section className="stats-blank-dossier"><header><p className="section-kicker">HỒ SƠ DÃ NGOẠI · CHỜ KÝ TÊN</p><h1 className="font-display text-4xl font-black">Báo cáo bằng chứng chưa niêm phong</h1><p>Nhật ký của em đang chờ chủ nhân. Khi tạo hồ sơ, mỗi câu đúng sẽ để lại một dấu mực trên tuyến đường này.</p></header><div className="stats-blank-route" aria-label="Tuyến đường đang chờ mở"><span className="is-active">01<br/><small>Ký tên</small></span><i /><span>02<br/><small>Thu thập</small></span><i /><span>03<br/><small>Niêm phong</small></span><i /><span>04<br/><small>Đấu Boss</small></span></div><div className="stats-blank-evidence"><article><p className="section-kicker">DẤU VẾT TRÌNH DUYỆT</p><b>Đã mở {siteVisitCount} lượt</b><small>{lastSiteVisitAt ? `Lần gần nhất ${new Date(lastSiteVisitAt).toLocaleString("vi-VN")}` : "Chưa có lượt ghé thăm được ghi nhận"}</small></article><article className="stats-blank-seal"><ShieldCheck size={27}/><b>6 ô bằng chứng</b><small>đang chờ những lần học đầu tiên</small></article></div><Link href="/start" className="stats-blank-cta">Mở hồ sơ thám hiểm</Link></section>;
  }

  const accuracy = profile.metrics.totalAnswers ? Math.round((profile.metrics.correctAnswers / profile.metrics.totalAnswers) * 100) : 0;
  const mastered = profile.completedStationIds.length;
  const readyStations = STATIONS.filter((station) => station.status === "ready");
  const questProgress = weeklyMagicQuest ? Math.round((weeklyMagicQuest.usedCount / weeklyMagicQuest.target) * 100) : 0;
  const cards = [
    { label: "Đáp án đã làm", value: profile.metrics.totalAnswers, icon: BookOpen, tone: "bg-[#fff0b6]" },
    { label: "Độ chính xác", value: `${accuracy}%`, icon: Crosshair, tone: "bg-[#e7f2e5]" },
    { label: "Chuỗi học", value: `${profile.streak} ngày`, icon: Flame, tone: "bg-[#ffe4dc]" },
    { label: "Boss thắng", value: profile.metrics.bossWins, icon: Swords, tone: "bg-[#f0e7f6]" },
    { label: "Lượt mở local", value: siteVisitCount, icon: BarChart3, tone: "bg-[#eaf0f7]" },
    { label: "Phép dùng nhiều nhất", value: mostUsedMagicElement ? MAGIC_MEDIA[mostUsedMagicElement].shortLabel : "Chưa có", icon: Sparkles, tone: "bg-[#fff0b6]" },
  ];
  const downloadBackup = () => {
    const json = createProfileBackup();
    if (!json) return;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `math4fun-${profile.name.trim().replace(/\s+/g, "-").toLowerCase() || "ho-so"}-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setTransferMessage("Đã tạo tệp sao lưu JSON cho hồ sơ hiện tại.");
  };
  const beginRestore = (file?: File) => {
    if (!file) return;
    setPendingBackup(file);
    setParentPinValue("");
    setParentPinConfirm("");
    setPinDialogOpen(true);
  };
  const openPinSetup = () => {
    setPendingBackup(null);
    setParentPinValue("");
    setParentPinConfirm("");
    setPinDialogOpen(true);
  };
  const confirmPinAction = async () => {
    if (!hasParentPin && parentPin !== parentPinConfirm) {
      setTransferMessage("Hai lần nhập PIN chưa khớp. PIN chưa được thiết lập.");
      return;
    }
    setPinBusy(true);
    try {
      if (!hasParentPin) {
        const pinResult = await setParentPin(parentPin);
        if (!pinResult.ok) { setTransferMessage(pinResult.message); return; }
        if (!pendingBackup) { setTransferMessage(pinResult.message); setPinDialogOpen(false); return; }
      }
      if (!pendingBackup) return;
      const result = await restoreProfileBackup(await pendingBackup.text(), parentPin);
      setTransferMessage(result.message);
      if (result.ok) setPinDialogOpen(false);
    } finally {
      setPinBusy(false);
    }
  };

  return <section>
    <div className="mb-6"><p className="section-kicker">Bằng chứng hành trình · local only</p><h1 className="font-display text-4xl font-black">Thống kê của {profile.name}</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#58708b]">Số liệu chỉ lưu trong trình duyệt đang dùng. Đây là nhật ký học tập, không phải thống kê truy cập công khai của website.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(({ label, value, icon: Icon, tone }) => <article key={label} className={`evidence-card border-2 border-[#172a48] p-4 shadow-[3px_3px_0_#172a48] ${tone}`}><Icon size={18} /><p className="mt-5 font-display text-4xl font-black">{value}</p><p className="mt-1 text-sm font-bold text-[#476275]">{label}</p></article>)}</div>
    <div className="magic-stats-evidence"><Sparkles size={18} /><div><p className="section-kicker">SỔ PHÉP</p><b>{hasMagicBookAchievement ? "Đã nhận huy hiệu Nhà Lưu Trữ Sáu Ấn" : `Đã xem ${magicBookWatchedCount}/6 hoạt ảnh nguyên tố`}</b></div></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <article className="paper-stack border-2 border-[#172a48] bg-[#fffdf6] p-5 shadow-[5px_5px_0_#172a48]"><div className="flex items-center gap-2"><BarChart3 size={18} /><h2 className="font-display text-3xl font-black">Dấu vết trạm đã mở</h2></div><div className="mt-5 space-y-4">{readyStations.map((station) => { const item = stationProgress(station.id); const width = Math.min(100, Math.round((item.correct / item.target) * 100)); return <div key={station.id}><div className="flex justify-between gap-3 text-sm font-bold"><span>{station.code} · {station.title}</span><span>{item.correct}/{item.target} đúng</span></div><div className="mt-2 h-3 overflow-hidden border border-[#172a48] bg-[#f5efdf]"><div style={{ width: `${width}%` }} className={`h-full ${station.accent}`} /></div><p className="mt-1 text-xs text-[#58708b]">{item.answered} lượt đã chốt · độ chính xác {item.accuracy}%</p></div>; })}</div></article>
      <aside className="space-y-5"><article className="border-2 border-[#172a48] bg-[#172a48] p-5 text-white shadow-[4px_4px_0_#f6b73c]"><ShieldCheck className="text-[#f6b73c]" /><h2 className="mt-4 font-display text-3xl font-black">{mastered}/20 dấu niêm phong</h2><p className="mt-2 text-sm leading-relaxed text-[#d5dfed]">Một guardian chỉ gia nhập sau 10 câu đúng riêng biệt của trạm đã kiểm chứng.</p></article><article className="evidence-card border-2 border-[#172a48] bg-[#fff8da] p-4"><p className="section-kicker">Lần hoạt động gần nhất</p><p className="mt-2 text-sm font-bold">{profile.metrics.lastActiveAt ? new Date(profile.metrics.lastActiveAt).toLocaleString("vi-VN") : "Chưa có lượt học nào"}</p></article></aside>
    </div>
    <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <article className="border-2 border-[#172a48] bg-[#fffdf6] p-5 shadow-[5px_5px_0_#172a48]"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="section-kicker">BẢNG LUYỆN ẤN</p><h2 className="font-display text-3xl font-black">XP Nguyên tố</h2><p className="mt-1 text-sm text-[#58708b]">Mỗi {ELEMENT_XP_PER_LEVEL} XP sẽ tăng một bậc luyện ấn. XP nhận được khi dùng phép trong trận Boss.</p></div><span className="field-tag">6 HỆ RIÊNG BIỆT</span></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{ELEMENT_ORDER.map((element) => { const xp = elementXp[element] ?? 0; const progress = xp % ELEMENT_XP_PER_LEVEL; return <article key={element} className="border border-[#172a48] bg-[#f7f0df] p-3"><div className="flex items-center justify-between gap-2"><span className="text-2xl" style={{ color: ELEMENT_COLORS[element] }}>{ELEMENT_SIGILS[element]}</span><div className="text-right"><b className="text-sm">{MAGIC_MEDIA[element].shortLabel}</b><small className="block text-xs text-[#58708b]">Bậc {elementLevel(element)}</small></div></div><div className="mt-3 h-2.5 overflow-hidden border border-[#172a48] bg-[#fffdf6]"><div className="h-full" style={{ width: `${(progress / ELEMENT_XP_PER_LEVEL) * 100}%`, backgroundColor: ELEMENT_COLORS[element] }} /></div><p className="mt-1 text-xs font-bold text-[#476275]">{xp} XP · {progress}/{ELEMENT_XP_PER_LEVEL} đến bậc sau</p></article>; })}</div></article>
      <aside className="border-2 border-[#172a48] bg-[#172a48] p-5 text-white shadow-[4px_4px_0_#f6b73c]"><ScrollText className="text-[#f6b73c]" /><p className="mt-3 text-xs font-bold tracking-[0.15em] text-[#f6b73c]">NHIỆM VỤ TUẦN</p>{weeklyMagicQuest && <><h2 className="mt-2 font-display text-2xl font-black">{weeklyMagicQuest.title}</h2><p className="mt-2 text-sm leading-relaxed text-[#d5dfed]">{weeklyMagicQuest.note}</p><div className="mt-5 flex items-end justify-between"><span className="text-3xl" style={{ color: ELEMENT_COLORS[weeklyMagicQuest.element] }}>{ELEMENT_SIGILS[weeklyMagicQuest.element]}</span><b>{weeklyMagicQuest.usedCount}/{weeklyMagicQuest.target} lần</b></div><div className="mt-2 h-3 overflow-hidden border border-white/70 bg-white/15"><div className="h-full bg-[#f6b73c]" style={{ width: `${questProgress}%` }} /></div><p className="mt-3 text-xs font-bold text-[#f6b73c]">{weeklyMagicQuest.rewardClaimed ? `Đã nhận +${weeklyMagicQuest.rewardXp} XP` : `Hoàn thành để nhận +${weeklyMagicQuest.rewardXp} XP`}</p></>}</aside>
    </section>
    <section className="mt-6 border-2 border-[#172a48] bg-[#e8f0e4] p-5 shadow-[5px_5px_0_#172a48]"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><p className="section-kicker">CHUYỂN HỒ SƠ · JSON</p><h2 className="font-display text-3xl font-black">Sao lưu nhật ký thám hiểm</h2><p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#476275]">Tệp JSON chứa duy nhất hồ sơ đang chọn, bao gồm tiến độ trạm, guardian, XP nguyên tố và nhiệm vụ tuần. Khôi phục sẽ thêm một bản hồ sơ mới, không ghi đè hồ sơ đang có.</p><p className="mt-3 inline-flex items-center gap-2 border border-[#244e4a] bg-[#fffdf6] px-3 py-2 text-xs font-bold text-[#244e4a]"><LockKeyhole size={14} /> {hasParentPin ? "Khôi phục cần PIN phụ huynh trên thiết bị này." : "Hãy thiết lập PIN phụ huynh trước lần khôi phục đầu tiên."}</p>{transferMessage && <p className="mt-3 text-sm font-bold text-[#244e4a]" role="status">{transferMessage}</p>}</div><div className="flex shrink-0 flex-wrap gap-3"><button type="button" onClick={downloadBackup} className="inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#fffdf6] px-4 py-3 text-sm font-black shadow-[3px_3px_0_#172a48] transition-transform hover:-translate-y-0.5 active:translate-y-0"><Download size={17} /> Sao lưu hồ sơ</button><button type="button" onClick={openPinSetup} className="inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#d5dfed] px-4 py-3 text-sm font-black shadow-[3px_3px_0_#172a48] transition-transform hover:-translate-y-0.5 active:translate-y-0"><KeyRound size={17} /> {hasParentPin ? "PIN đã thiết lập" : "Thiết lập PIN"}</button><button type="button" onClick={() => uploadRef.current?.click()} className="inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-3 text-sm font-black shadow-[3px_3px_0_#172a48] transition-transform hover:-translate-y-0.5 active:translate-y-0"><Upload size={17} /> Khôi phục JSON</button><input ref={uploadRef} type="file" accept="application/json,.json" className="sr-only" onChange={(event) => { beginRestore(event.target.files?.[0]); event.target.value = ""; }} /></div></div></section>
    <Dialog open={pinDialogOpen} onOpenChange={setPinDialogOpen}><DialogContent className="border-2 border-[#172a48] bg-[#fffdf6] text-[#172a48] shadow-[6px_6px_0_#172a48]"><DialogHeader><p className="section-kicker">PHỤ HUYNH · NIÊM PHONG KHÔI PHỤC</p><DialogTitle className="font-display text-3xl font-black">{hasParentPin ? "Xác nhận PIN phụ huynh" : "Tạo PIN phụ huynh"}</DialogTitle><DialogDescription className="leading-relaxed text-[#476275]">{hasParentPin ? "Nhập PIN để mở tệp sao lưu. Nhập sai sẽ không thay đổi hồ sơ nào." : "Tạo PIN gồm 4–8 chữ số. PIN chỉ được lưu dạng mã hóa một chiều trong trình duyệt này."}</DialogDescription></DialogHeader><div className="space-y-3"><label className="block text-sm font-bold" htmlFor="parent-pin">PIN phụ huynh<input id="parent-pin" inputMode="numeric" pattern="[0-9]*" autoComplete="new-password" type="password" value={parentPin} onChange={(event) => setParentPinValue(event.target.value.replace(/\D/g, "").slice(0, 8))} className="mt-1 block w-full border-2 border-[#172a48] bg-white px-3 py-2 font-mono tracking-[0.3em] outline-none focus:bg-[#fff0b6]" /></label>{!hasParentPin && <label className="block text-sm font-bold" htmlFor="parent-pin-confirm">Nhập lại PIN<input id="parent-pin-confirm" inputMode="numeric" pattern="[0-9]*" autoComplete="new-password" type="password" value={parentPinConfirm} onChange={(event) => setParentPinConfirm(event.target.value.replace(/\D/g, "").slice(0, 8))} className="mt-1 block w-full border-2 border-[#172a48] bg-white px-3 py-2 font-mono tracking-[0.3em] outline-none focus:bg-[#fff0b6]" /></label>}</div><DialogFooter><button type="button" onClick={() => setPinDialogOpen(false)} className="border-2 border-[#172a48] bg-white px-4 py-2 text-sm font-black">Hủy</button><button type="button" onClick={() => void confirmPinAction()} disabled={pinBusy || !parentPin} className="border-2 border-[#172a48] bg-[#f6b73c] px-4 py-2 text-sm font-black shadow-[2px_2px_0_#172a48] disabled:opacity-50">{pinBusy ? "Đang kiểm tra…" : hasParentPin ? "Mở tệp an toàn" : pendingBackup ? "Thiết lập và khôi phục" : "Niêm phong PIN"}</button></DialogFooter></DialogContent></Dialog>
  </section>;
}
