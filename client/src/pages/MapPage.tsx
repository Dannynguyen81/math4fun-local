/**
 * Field Journal Quest map: the stitched, off-axis expedition route is the central artifact; station cards pin evidence onto it.
 */
import { Link } from "wouter";
import { Compass, LockKeyhole, MapPinned, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { STATIONS, getGuardian } from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";
import { PlayerAvatar } from "@/components/PlayerAvatar";

const routeOffsets = [0, 13, 4, 20, 8, 25, 11, 1, 16, 6, 22, 9, 3, 18, 7, 24, 10, 2, 15, 5];

export default function MapPage() {
  const { profile, isStationUnlocked, isStationMastered, stationProgress, unlockStationForWeek, weeklyOpenCount, equippedCosmetics } = useGame();
  const stations = STATIONS.filter((station) => station.status === "ready");
  const nextStation = stations.find((station) => isStationUnlocked(station.id) && !isStationMastered(station.id));

  if (!profile) return <section>
    <p className="section-kicker"><MapPinned size={13} /> BẢN ĐỒ XEM TRƯỚC · AWAITING EXPLORER</p>
    <h1 className="font-display text-4xl font-black">Một tuyến đường đang chờ chữ ký</h1><p className="mt-2 max-w-3xl text-sm text-[#58708b]">Đây là bản đồ của em: 20 chủ đề đã được cắm mốc, guardian đang niêm phong và đường chỉ khâu sẽ sáng khi em tạo sổ hành trình.</p>
    <RouteArtifact stations={stations.slice(0, 5)} profile={null} isStationUnlocked={() => false} isStationMastered={() => false} stationProgress={() => ({ correct: 0, answered: 0, target: 10, total: 10, accuracy: 0 })} onOpen={() => false} canOpen={false} nextStationId={undefined} />
    <div className="mt-4 border-2 border-dashed border-[#172a48] bg-[#fff8da] p-4"><b className="font-display text-xl">Hai lượt mở chủ đề mỗi tuần sẽ được ghi ở đây.</b><p className="mt-1 text-sm text-[#58708b]">Tạo sổ trước, sau đó chọn một tuyến để bắt đầu ghi bằng chứng.</p><Link href="/start" className="mt-4 inline-flex border-2 border-[#172a48] bg-[#f6b73c] px-4 py-2 font-bold shadow-[3px_3px_0_#172a48]">Ký tên vào bản đồ</Link></div>
  </section>;

  return <section>
    <div className="grid gap-4 xl:grid-cols-[1fr_270px] xl:items-end"><div><p className="section-kicker"><MapPinned size={13} /> EXPEDITION ROUTE · {weeklyOpenCount}/2 OPEN</p><h1 className="font-display text-4xl font-black">Bản đồ đường chỉ khâu</h1><p className="mt-2 max-w-3xl text-sm text-[#58708b]">Mỗi trạm là một mốc thực địa. Đường nét vàng chỉ nơi cần bước tiếp; đừng bỏ qua bằng chứng đang ghi dở.</p></div><aside className="border-2 border-[#172a48] bg-[#fffdf6] p-3 shadow-[3px_3px_0_#172a48]"><div className="flex items-center gap-3"><PlayerAvatar avatar={profile.avatar} name={profile.name} outfitId={equippedCosmetics.outfit} trailId={equippedCosmetics.trail} size="sm"/><div><p className="font-mono text-[9px] font-black tracking-[.15em] text-[#58708b]">COMPANION ĐỒNG HÀNH</p><b className="font-display text-lg">{profile.name}</b><p className="text-[11px] text-[#4d8b67]">{nextStation ? `Đang hướng tới ${nextStation.code}` : "Đang tìm mốc mới"}</p></div></div></aside></div>
    <RouteArtifact stations={stations} profile={profile} isStationUnlocked={isStationUnlocked} isStationMastered={isStationMastered} stationProgress={stationProgress} onOpen={unlockStationForWeek} canOpen={weeklyOpenCount < 2} nextStationId={nextStation?.id} />
  </section>;
}

function RouteArtifact({ stations, profile, isStationUnlocked, isStationMastered, stationProgress, onOpen, canOpen, nextStationId }: { stations: typeof STATIONS; profile: ReturnType<typeof useGame>["profile"]; isStationUnlocked: (stationId: number) => boolean; isStationMastered: (stationId: number) => boolean; stationProgress: ReturnType<typeof useGame>["stationProgress"]; onOpen: (stationId: number) => boolean; canOpen: boolean; nextStationId?: number }) {
  return <div className="relative mt-6 overflow-hidden border-2 border-[#172a48] bg-[#e8f0e4] p-5 shadow-[6px_6px_0_#172a48]" style={{ backgroundImage: "linear-gradient(#c9d5c7 1px, transparent 1px), linear-gradient(90deg, #c9d5c7 1px, transparent 1px)", backgroundSize: "22px 22px" }}>
    <div className="absolute left-4 top-4 rotate-[-3deg] border-2 border-[#172a48] bg-[#fff0b6] px-2 py-1 font-mono text-[9px] font-black tracking-[.14em] shadow-[2px_2px_0_#172a48]">ROUTE THREAD · {profile ? "LIVE" : "SEALED"}</div>
    <svg className="pointer-events-none absolute inset-x-0 top-8 h-[calc(100%-4rem)] w-full opacity-70" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M 7 22 C 82 55 15 84 83 126 S 9 192 79 230 S 17 301 88 345 S 7 415 79 465 S 20 545 89 592 S 11 665 78 714 S 16 800 86 840 S 10 910 75 965" fill="none" stroke="#4d8b67" strokeWidth=".9" strokeDasharray="1 1.6"/><path d="M 7 22 C 82 55 15 84 83 126" fill="none" stroke="#f6b73c" strokeWidth="1.35" strokeDasharray="1 1.6"/></svg>
    <div className="relative z-10 mt-12 space-y-5 pb-4">{stations.map((station, index) => {
      const guardian = getGuardian(station.guardianId); const unlocked = isStationUnlocked(station.id); const mastered = isStationMastered(station.id); const progress = stationProgress(station.id); const isNext = station.id === nextStationId; const offset = routeOffsets[index % routeOffsets.length];
      return <motion.article key={station.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.025, .36) }} style={{ marginLeft: `min(${offset}%, 170px)` }} className={`relative max-w-[640px] border-2 border-[#172a48] bg-[#fffdf6] p-4 shadow-[4px_4px_0_#172a48] ${isNext ? "ring-4 ring-[#f6b73c] ring-offset-2" : ""}`}>
        <span className={`absolute -left-7 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border-2 border-[#172a48] ${mastered ? "bg-[#9dba70]" : isNext ? "bg-[#f6b73c]" : "bg-[#eef1fb]"}`}><Compass size={17}/></span>
        <div className="flex gap-3"><div className="min-w-0 flex-1"><p className="font-mono text-[10px] font-black tracking-[.13em] text-[#58708b]">{station.code} · {mastered ? "BẰNG CHỨNG ĐỦ" : unlocked ? "ĐANG GHI" : "MỐC ĐÃ NIÊM"}</p><h2 className="mt-1 font-display text-2xl font-black">{station.title}</h2><p className="mt-1 text-xs text-[#58708b]">Guardian {guardian?.name ?? "niêm phong"} · {mastered ? "Đã thu phục" : `${progress.correct}/10 bằng chứng`}</p></div><div className="guardian-stamp grid h-14 w-14 shrink-0 place-items-center overflow-hidden bg-[#eef1fb]">{guardian?.sprite ? <img src={guardian.sprite} alt="" className="h-11 w-11 object-contain"/> : <LockKeyhole size={18}/>}</div></div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-[#d7d0bf] pt-3">{isNext && <span className="field-tag bg-[#fff0b6] text-[#172a48]"><Sparkles size={12}/> MỐC KẾ TIẾP</span>}<span className="text-xs font-bold text-[#4d8b67]">{mastered ? "Dấu mực hoàn tất" : unlocked ? "Tuyến đã mở" : "Chờ ký mở"}</span>{unlocked ? <Link href={`/station/${station.id}`} className="border-2 border-[#172a48] bg-white px-3 py-2 text-xs font-black shadow-[2px_2px_0_#172a48]">{mastered ? "Xem trạm" : "Ghi bằng chứng"}</Link> : <button disabled={!profile || !canOpen} onClick={() => onOpen(station.id)} className="border-2 border-[#172a48] bg-[#f6b73c] px-3 py-2 text-xs font-black shadow-[2px_2px_0_#172a48] disabled:cursor-not-allowed disabled:bg-[#d7d0bf] disabled:opacity-80">{profile ? canOpen ? "Mở mốc" : "Đã dùng lượt tuần" : "Niêm phong"}</button>}</div>
      </motion.article>;
    })}</div>
  </div>;
}
