/**
 * Field Journal Quest home: a signed journal opening makes the learning route—not the navigation shell—the first artifact a learner sees.
 */
import { Link } from "wouter";
import { ArrowRight, BookOpen, Compass, LockKeyhole, MapPinned, Sparkles, Swords } from "lucide-react";
import { HERO_IMAGE, STATIONS } from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";

function RoutePreview({ signed }: { signed: boolean }) {
  const positions = ["md:left-[2%] md:top-[9%]", "md:left-[26%] md:top-[56%]", "md:left-[52%] md:top-[14%]", "md:right-[1%] md:top-[58%]"];
  return <article className="relative mt-6 overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] p-5 shadow-[5px_5px_0_#172a48]">
    <div className="absolute right-4 top-3 rotate-6 border-2 border-dashed border-[#4d8b67] bg-[#eef5f2] px-2 py-1 font-mono text-[9px] font-black tracking-[.16em] text-[#4d8b67]">ROUTE SPECIMEN</div>
    <div aria-hidden className="absolute left-[47%] top-2 hidden -rotate-2 border border-[#c9b88c] bg-[#fff8da] px-2 py-1 font-mono text-[8px] font-black tracking-[.13em] text-[#58708b] shadow-[2px_2px_0_#c9b88c] md:block">DẤU CHÂN · TUYẾN 01</div>
    <p className="section-kicker"><MapPinned size={13} /> BẢN RẬP TUYẾN HỌC</p>
    <h2 className="mt-2 font-display text-3xl font-black">Những mốc đầu tiên đang chờ</h2>
    <div className="relative mt-5 grid gap-4 md:block md:h-[250px]">
      <svg aria-hidden viewBox="0 0 1000 280" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"><path d="M45 57 C170 35 218 210 340 184 S487 47 605 74 S718 235 838 208 S925 130 990 168" fill="none" stroke="#4d8b67" strokeDasharray="7 7" strokeWidth="3"/><path d="M45 57 C170 35 218 210 340 184 S487 47 605 74 S718 235 838 208 S925 130 990 168" fill="none" stroke="#f6b73c" strokeDasharray="3 55" strokeLinecap="round" strokeWidth="7"/></svg>
      {STATIONS.slice(0, 4).map((station, index) => <div key={station.id} className={`relative z-10 flex items-center gap-3 border-2 border-[#172a48] bg-white p-2 shadow-[3px_3px_0_#172a48] md:absolute md:w-[23%] md:block ${positions[index]} ${index === 1 ? "md:-rotate-[1.2deg]" : index === 2 ? "md:rotate-[.8deg]" : index === 3 ? "md:-rotate-[.6deg]" : "md:rotate-[.4deg]"}`}>
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-[#172a48] font-display text-xl font-black shadow-[2px_2px_0_#172a48] md:absolute md:-left-3 md:-top-5 ${signed && index === 0 ? "bg-[#f6b73c]" : "bg-[#eef1fb]"}`}>{index + 1}</span>
        <div className="min-w-0 pl-1 pt-1 md:pl-4"><b className="font-mono text-[9px] tracking-[.12em]">{station.code}</b><p className="mt-1 text-xs font-bold leading-tight">{station.title}</p><small className="mt-1 block font-mono text-[8px] font-black tracking-[.1em] text-[#58708b]">{signed && index === 0 ? "ĐIỂM ĐẾN KẾ TIẾP" : "MỐC NIÊM PHONG"}</small></div>
      </div>)}
    </div>
    <p className="mt-8 border-t-2 border-dashed border-[#d7d0bf] pt-3 text-xs font-bold text-[#58708b]">{signed ? "Dấu mực của em đã có trên bản đồ. Chọn trạm kế tiếp để ghi bằng chứng mới." : "Ký tên, chọn companion và mở tối đa hai tuyến mỗi tuần để bản đồ bắt đầu có dấu chân."}</p>
  </article>;
}

export default function Home() {
  const { profile, isStationUnlocked, isStationMastered, stationProgress, isBossUnlocked, weeklyOpenCount } = useGame();
  if (!profile) return <section>
    <div className="relative overflow-hidden border-2 border-[#172a48] bg-[#172a48] text-white shadow-[7px_7px_0_#f6b73c]">
      <img src={HERO_IMAGE} alt="Hành trình học Toán của Math4Fun" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#172a48] via-[#172a48]/85 to-[#172a48]/35" />
      <div aria-hidden className="absolute bottom-4 right-4 hidden rotate-3 border-2 border-dashed border-[#f6b73c] bg-[#fff8da] px-3 py-2 font-mono text-[9px] font-black tracking-[.12em] text-[#172a48] shadow-[3px_3px_0_#0d1c33] sm:block">MỞ 2 TUYẾN / TUẦN<br/><span className="text-[#4d8b67]">BẢN ĐỒ ĐANG CHỜ DẤU MỰC</span></div>
      <svg aria-hidden viewBox="0 0 360 110" className="absolute bottom-0 right-0 hidden h-24 w-80 opacity-75 sm:block"><path d="M0 74 C80 8 125 110 190 48 S280 8 360 34" fill="none" stroke="#f6b73c" strokeDasharray="5 7" strokeWidth="2"/></svg>
      <div className="relative max-w-2xl p-7 sm:p-10"><span className="field-tag border-white/25 bg-white/10 text-white"><Compass size={14} /> FIELD JOURNAL QUEST</span><h1 className="mt-6 font-display text-5xl font-black leading-[0.92]">Một cuốn sổ.<br />Hai mươi tuyến học.</h1><p className="mt-5 max-w-xl text-sm leading-relaxed text-[#d5dfed]">Math4Fun giữ tiến độ riêng của từng em, cho phép mở tối đa hai chủ đề mỗi tuần và yêu cầu 10 câu đúng để thu phục một guardian.</p><Link href="/start" className="mt-7 inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-5 py-3 font-bold text-[#172a48] shadow-[3px_3px_0_white]"><Sparkles size={17} /> Tạo sổ hành trình <ArrowRight size={16} /></Link></div>
    </div>
    <RoutePreview signed={false} />
  </section>;

  const next = STATIONS.find((station) => station.status === "ready" && isStationUnlocked(station.id) && !isStationMastered(station.id));
  const mastered = profile.completedStationIds.length;
  return <section>
    <div className="relative overflow-hidden border-2 border-[#172a48] bg-[#172a48] text-white shadow-[7px_7px_0_#f6b73c]">
      <img src={HERO_IMAGE} alt="Hành trình học Toán của Math4Fun" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#172a48] via-[#172a48]/85 to-[#172a48]/35" />
      <div aria-hidden className="absolute bottom-3 right-5 hidden rotate-3 border-2 border-dashed border-[#f6b73c] bg-[#fff8da] px-3 py-2 font-mono text-[9px] font-black tracking-[.12em] text-[#172a48] shadow-[3px_3px_0_#0d1c33] lg:block">BẰNG CHỨNG MỚI<br/><span className="text-[#4d8b67]">TUYẾN ĐANG MỞ</span></div>
      <div className="relative grid gap-6 p-6 sm:p-9 lg:grid-cols-[1fr_280px]"><div><span className="field-tag border-white/25 bg-white/10 text-white"><Compass size={14} /> SỔ HÀNH TRÌNH CỦA {profile.name.toUpperCase()}</span><h1 className="mt-5 font-display text-5xl font-black leading-[0.92]">Đi chậm.<br />Ghi đúng.</h1><p className="mt-5 max-w-xl text-sm leading-relaxed text-[#d5dfed]">Mỗi câu sai vẫn được ghi lại để lần sau em quay lại sửa bằng hiểu biết, không phải bằng cách thoát ra làm lại.</p><Link href={next ? `/station/${next.id}` : "/map"} className="mt-6 inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-5 py-3 font-bold text-[#172a48] shadow-[3px_3px_0_white]">{next ? `Tiếp tục: ${next.title}` : "Mở bản đồ học"} <ArrowRight size={16} /></Link></div><div className="border-2 border-white/40 bg-[#172a48]/75 p-5 backdrop-blur"><p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#f6b73c]">DẤU MỐC</p><p className="mt-3 font-display text-4xl font-black">{mastered}<span className="text-lg text-[#9bb4ce]">/20</span></p><p className="text-sm text-[#d5dfed]">guardian đã thu phục</p><div className="mt-5 border-t border-white/20 pt-4 text-sm"><b>{weeklyOpenCount}/2</b> chủ đề được mở trong tuần này</div></div></div>
    </div>
    <RoutePreview signed />
    <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><article className="paper-stack border-2 border-[#172a48] bg-[#fffdf6] p-5 shadow-[5px_5px_0_#172a48]"><p className="section-kicker">Dấu vết tiếp theo</p>{next ? <><h2 className="mt-3 font-display text-3xl font-black">{next.code} · {next.title}</h2><p className="mt-2 text-sm leading-relaxed text-[#58708b]">{next.brief}</p><div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-[#d7d0bf] pt-4"><span className="font-bold">{stationProgress(next.id).correct}/10 câu đúng</span><Link href={`/station/${next.id}`} className="font-bold underline decoration-2 underline-offset-4">Vào trạm</Link></div></> : <><h2 className="mt-3 font-display text-3xl font-black">Chọn tuyến mới</h2><p className="mt-2 text-sm text-[#58708b]">Bản đồ cho biết các tuyến có đủ câu hỏi nguồn đã kiểm chứng để mở trong tuần này.</p><Link href="/map" className="mt-5 inline-flex font-bold underline decoration-2 underline-offset-4">Xem bản đồ học</Link></>}</article><article className="evidence-card border-2 border-[#172a48] bg-[#fff8da] p-5 shadow-[4px_4px_0_#172a48]"><p className="section-kicker">Radar Boss</p><h2 className="mt-3 font-display text-3xl font-black">{isBossUnlocked ? "Atlas đã đánh dấu em" : "Atlas còn niêm phong"}</h2><p className="mt-2 text-sm leading-relaxed text-[#58708b]">{isBossUnlocked ? "Mỗi trận có 5 câu khó, không trùng với câu thu phục. Atlas phản công kể cả khi em trả lời đúng." : "Thu phục 2 guardian bằng 20 câu đúng riêng biệt để mở thử thách 5 câu khó."}</p><Link href="/boss" className="mt-5 inline-flex items-center gap-2 font-bold underline decoration-[#f6b73c] decoration-2 underline-offset-4">{isBossUnlocked ? <Swords size={16} /> : <LockKeyhole size={16} />}{isBossUnlocked ? "Đến đấu trường" : "Xem điều kiện"}</Link></article></div>
  </section>;
}
