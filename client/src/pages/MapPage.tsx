/** Math4Fun learning map — Field Journal Quest uses an off-axis stitched trail instead of a conventional grid of lessons. */
import { Link } from "wouter";
import { Check, ChevronRight, Lock, Sparkles } from "lucide-react";
import { CARD_IMAGE, getGuardian, STATIONS } from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";

export default function MapPage() {
  const { isStationUnlocked, isStationMastered, stationProgress, isBossUnlocked } = useGame();
  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">Tuyến đường học tập</p><h1 className="font-display text-4xl font-black tracking-tight">Bản đồ: Số & Quy luật</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#58708b]">Hoàn thành toàn bộ câu hỏi tại một trạm để đóng dấu guardian và mở tuyến đường kế tiếp.</p></div><span className="field-tag"><Sparkles size={14} /> 5 trạm · 12 nhiệm vụ</span></div>
      <div className="route-map relative overflow-hidden border-2 border-[#172a48] bg-[#dfe9d9] p-4 shadow-[6px_6px_0_#172a48] sm:p-6">
        <div className="map-canvas relative">
          <svg className="route-stitch" viewBox="0 0 1000 610" fill="none" preserveAspectRatio="none" aria-hidden="true"><path d="M100 82 C265 42 400 104 500 172 S755 172 810 274 S640 386 520 414 S286 452 345 542" stroke="#172a48" strokeWidth="5" strokeDasharray="7 13" strokeLinecap="round" /><path d="M106 79 C271 39 406 101 506 169 S761 169 816 271 S646 383 526 411 S292 449 351 539" stroke="#fffdf6" strokeWidth="1.5" strokeDasharray="3 17" strokeLinecap="round" /></svg>
          {STATIONS.map((station) => {
            const unlocked = isStationUnlocked(station.id);
            const mastered = isStationMastered(station.id);
            const { done, total } = stationProgress(station.id);
            const guardian = getGuardian(station.guardianId);
            const card = <div className={`route-stop group relative flex w-full items-center gap-3 border-2 border-[#172a48] bg-[#fffdf6] px-3 py-3 text-left shadow-[4px_4px_0_#172a48] transition ${unlocked ? "hover:-translate-y-1 hover:bg-[#fff8da]" : "opacity-55 grayscale"}`}><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-[#172a48] ${station.accent} text-[#172a48]`}>{mastered ? <Check size={19} strokeWidth={3} /> : unlocked ? <img className="h-8 w-8 object-contain" src={guardian?.sprite} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = CARD_IMAGE; }} alt="" /> : <Lock size={17} />}</span><span className="min-w-0"><span className="block font-mono text-[10px] font-bold tracking-[0.16em] text-[#58708b]">{station.code}</span><span className="block truncate font-semibold text-[#172a48]">{station.title}</span><span className="block text-[11px] text-[#58708b]">{mastered ? "Đã làm chủ" : unlocked ? `${done}/${total} nhiệm vụ` : "Cần hoàn thành trạm trước"}</span></span><ChevronRight className="ml-auto shrink-0 text-[#58708b]" size={16} /></div>;
            return <div key={station.id} className={`map-stop map-stop-${station.id}`}><span className="map-pin" aria-hidden="true" />{unlocked ? <Link href={`/station/${station.id}`}>{card}</Link> : card}</div>;
          })}
          <span className="map-note note-a">bước nhỏ → bằng chứng lớn</span><span className="map-note note-b">dấu chân guardian</span>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-[#172a48]/30 pt-4 text-xs text-[#476275]"><span>Guardian chỉ gia nhập sau khi hoàn thành một trạm.</span><Link href="/boss" className={`font-bold underline decoration-2 underline-offset-4 ${isBossUnlocked ? "text-[#172a48]" : "text-[#58708b]"}`}>{isBossUnlocked ? "Atlas đã sẵn sàng — vào đấu Boss" : "Atlas sẽ xuất hiện sau 4 trạm đầu"}</Link></div>
      </div>
    </section>
  );
}
