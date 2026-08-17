/** Math4Fun collection page — Field Journal Quest treats guardians and learning evidence as tangible stamps in a field journal. */
import { Link } from "wouter";
import { Check, Lock, Map, Sparkles, Trophy } from "lucide-react";
import GuardianSeal from "@/components/GuardianSeal";
import { GUARDIANS, STATIONS } from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";

export default function CollectionPage() {
  const { progress, isStationMastered, isBossUnlocked } = useGame();
  const completedStations = STATIONS.filter((station) => isStationMastered(station.id)).length;
  const stickerCount = Math.min(4, Math.floor(progress.completedQuestionIds.length / 3) + (progress.bossDefeated ? 1 : 0));

  return <section>
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">Sổ dấu ấn</p><h1 className="font-display text-4xl font-black tracking-tight">Bộ sưu tập guardian</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#58708b]">Mỗi guardian là bằng chứng rằng bạn đã làm chủ một đoạn đường học tập, không phải phần thưởng ngẫu nhiên.</p></div><span className="field-tag"><Trophy size={14} /> {progress.collectedGuardianIds.length}/{GUARDIANS.length} đã mở</span></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {GUARDIANS.map((guardian) => {
        const unlocked = progress.collectedGuardianIds.includes(guardian.id);
        const associatedStation = guardian.stationId === "boss" ? null : STATIONS.find((station) => station.id === guardian.stationId);
        return <article key={guardian.id} className={`evidence-card relative overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] p-4 shadow-[4px_4px_0_#172a48] ${unlocked ? "" : "opacity-75"}`}><div className={`absolute right-0 top-0 h-14 w-14 border-b-2 border-l-2 border-[#172a48] ${unlocked ? guardian.tone : "bg-[#d7d0bf]"}`} /><div className="flex gap-4"><GuardianSeal guardian={guardian} unlocked={unlocked} compact progressLabel={unlocked ? "dấu ấn đã ghi" : "mẫu vật niêm phong"} /><div className="min-w-0"><p className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#58708b]">FIELD SPECIMEN</p><h2 className="font-display text-3xl font-black">{unlocked ? guardian.name : "Mẫu vật ???"}</h2><p className="mt-1 text-xs leading-relaxed text-[#58708b]">{unlocked ? guardian.description : guardian.stationId === "boss" ? "Hoàn thành bốn trạm đầu và đánh bại Atlas." : `Hoàn thành ${associatedStation?.title.toLowerCase()} để phá niêm phong mẫu vật này.`}</p></div></div><div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-[#d7d0bf] pt-3 text-xs font-bold">{unlocked ? <span className="inline-flex items-center gap-1 text-[#235b45]"><Check size={14} /> Dấu ấn đã ghi</span> : <span className="inline-flex items-center gap-1 text-[#58708b]"><Lock size={13} /> Đang niêm phong</span>}{associatedStation ? <Link href={`/station/${associatedStation.id}`} className="underline decoration-2 underline-offset-4">Xem trạm</Link> : <Link href="/boss" className="underline decoration-2 underline-offset-4">{isBossUnlocked ? "Đến đấu Boss" : "Điều kiện Boss"}</Link>}</div></article>;
      })}
    </div>
    <section className="mt-8 overflow-hidden border-2 border-[#172a48] bg-[#172a48] text-white shadow-[5px_5px_0_#f6b73c]"><div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto]"><div><p className="section-kicker text-[#f6b73c]">Những sticker bằng chứng</p><h2 className="mt-1 font-display text-3xl font-black">{stickerCount}/4 dấu đóng trong nhật ký</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-[#d5dfed]">Cứ ba nhiệm vụ đúng lần đầu sẽ nhận một sticker học tập; chiến thắng Atlas đóng dấu cuối cùng.</p></div><div className="flex items-center gap-2 self-center">{[0, 1, 2, 3].map((index) => <span key={index} className={`grid h-12 w-12 place-items-center rounded-full border-2 border-white/60 ${index < stickerCount ? "bg-[#f6b73c] text-[#172a48]" : "bg-white/10 text-white/45"}`}>{index < stickerCount ? <Sparkles size={18} /> : <Lock size={16} />}</span>)}</div></div></section>
    <div className="mt-6 flex flex-wrap items-center gap-3 border-2 border-dashed border-[#172a48] bg-[#fff8da] p-4"><Map size={18} /><span className="text-sm"><b>{completedStations}/5</b> station đã làm chủ. Tiến độ này được lưu localStorage ngay trên trình duyệt.</span><Link href="/map" className="ml-auto text-sm font-bold underline decoration-2 underline-offset-4">Trở lại bản đồ</Link></div>
  </section>;
}
