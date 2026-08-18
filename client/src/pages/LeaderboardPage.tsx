/** Field Journal Quest — evidence route: rank cards are pinned field records, not dashboard widgets. */
import { Award, Crown, Footprints, Gem, Medal, ShieldCheck, Trophy } from "lucide-react";
import { Link } from "wouter";
import { useGame } from "@/contexts/GameContext";
import { GUARDIANS } from "@/game/gameData";

const rankInk = ["bg-[#fff0b6]", "bg-[#e7f2e5]", "bg-[#e4edf7]", "bg-[#fffdf6]"];

export default function LeaderboardPage() {
  const { leaderboard, profile } = useGame();
  const hasEntries = leaderboard.length > 0;
  const sealedSpecimen = GUARDIANS.find((guardian) => guardian.id === "atlas");
  return <section className="relative overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] shadow-[6px_6px_0_#172a48]">
    <div className="absolute right-6 top-5 rotate-6 border-2 border-dashed border-[#172a48] bg-[#f6b73c] px-3 py-1 font-mono text-[10px] font-black tracking-[0.15em]">DEVICE LOG</div>
    <header className="border-b-2 border-[#172a48] bg-[#e4edf7] px-5 pb-7 pt-6 sm:px-8">
      <div className="flex items-start gap-3"><span className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#172a48] bg-[#f6b73c] shadow-[3px_3px_0_#172a48]"><Trophy size={22}/></span><div><p className="section-kicker">BẢNG CHỨNG TÍCH</p><h1 className="font-display text-3xl font-black leading-none sm:text-4xl">Đường đua trên thiết bị</h1></div></div>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#476275]">Mỗi hồ sơ được ký tên trong trình duyệt này sẽ thành một dấu mốc trên cùng tuyến đường. Điểm ưu tiên bằng chứng học tập, sau đó là guardian, huy hiệu và tiến độ trạm.</p>
      <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold"><span className="field-tag"><Footprints size={13}/> Điểm: câu đúng + trạm + Boss</span><span className="field-tag"><Award size={13}/> Huy hiệu là bằng chứng phụ</span><span className="field-tag"><ShieldCheck size={13}/> Chỉ so sánh cùng thiết bị</span></div>
    </header>
    <div className="relative px-5 py-7 sm:px-8">
      <div aria-hidden="true" className="absolute bottom-5 left-9 top-5 border-l-2 border-dashed border-[#58708b]" />
      {!hasEntries ? <div className="relative ml-8 grid gap-5 border-2 border-dashed border-[#172a48] bg-[#fff8da] p-5 sm:grid-cols-[1fr_190px]"><div><p className="font-mono text-xs font-black tracking-[0.15em]">SỔ ĐIỀU HƯỚNG · CHƯA CÓ DẤU CHÂN</p><h2 className="mt-2 font-display text-3xl font-black">Tuyến đua chờ chữ ký đầu tiên</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-[#476275]">Hoàn thành một câu toán để ghi điểm bằng chứng; hoàn thành trạm để thêm guardian và huy hiệu vào bảng chứng tích của thiết bị này.</p><div className="mt-5 flex items-center gap-2 text-center text-[10px] font-black"><span className="border-2 border-[#172a48] bg-[#f6b73c] px-2 py-2">01<br/>KÝ TÊN</span><i className="w-7 border-t-2 border-dotted border-[#172a48]"/><span className="border-2 border-[#172a48] bg-white px-2 py-2">02<br/>GIẢI CÂU</span><i className="w-7 border-t-2 border-dotted border-[#172a48]"/><span className="border-2 border-[#172a48] bg-white px-2 py-2">03<br/>GHI ĐIỂM</span></div><Link href="/start" className="mt-5 inline-flex border-2 border-[#172a48] bg-[#f6b73c] px-4 py-2 text-sm font-black shadow-[3px_3px_0_#172a48]">Ký tên để ghi điểm đầu tiên</Link></div><aside className="rotate-[2deg] border-2 border-[#172a48] bg-[#e8f0e4] p-3 shadow-[3px_3px_0_#172a48]"><span className="field-tag">SPECIMEN R-01 · SEALED</span><div className="mx-auto mt-3 grid h-24 w-24 place-items-center rounded-full border-2 border-dashed border-[#172a48] bg-[#fffdf6]"><img src={sealedSpecimen?.sprite} alt="Tiêu bản guardian đang niêm phong" className="h-16 w-16 object-contain grayscale-[.55]"/></div><p className="mt-3 border-t border-dashed border-[#9ea99e] pt-2 font-mono text-[9px] font-bold tracking-[.12em] text-[#58708b]">ATLAS · MỐC THỨ HẠNG · MỞ KHI CÓ BẰNG CHỨNG</p></aside></div> : <ol className="relative space-y-4">{leaderboard.map((entry, index) => {
        const rank = index + 1; const isCurrent = entry.profileId === profile?.id;
        return <li key={entry.profileId} className={`relative ml-8 grid gap-4 border-2 border-[#172a48] p-4 shadow-[3px_3px_0_#172a48] sm:grid-cols-[64px_1fr_auto] sm:items-center ${rankInk[Math.min(index, 3)]} ${isCurrent ? "ring-4 ring-[#f6b73c] ring-offset-2" : ""}`}>
          <span className="absolute -left-[2.95rem] grid h-8 w-8 place-items-center rounded-full border-2 border-[#172a48] bg-[#fffdf6] font-display font-black">{rank}</span>
          <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-[#172a48] bg-white text-2xl shadow-[2px_2px_0_#172a48]">{entry.avatar.startsWith("g") ? "✿" : entry.avatar.startsWith("b") ? "✦" : "⌁"}</div>
          <div><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-2xl font-black">{entry.name}</h2>{isCurrent && <span className="field-tag bg-[#f6b73c]">HỒ SƠ CỦA EM</span>}{rank === 1 && <Crown size={19} className="text-[#d88900]"/>}</div><p className="mt-1 text-xs font-bold text-[#476275]">LV.{entry.level} · {entry.stations} trạm hoàn thành · chuỗi {entry.streak} ngày</p><div className="mt-3 flex flex-wrap gap-2 text-xs font-bold"><span className="border border-[#172a48] bg-white px-2 py-1"><Gem className="mr-1 inline" size={13}/>{entry.guardians} guardian</span><span className="border border-[#172a48] bg-white px-2 py-1"><Medal className="mr-1 inline" size={13}/>{entry.badges} huy hiệu</span></div></div>
          <div className="border-2 border-[#172a48] bg-[#172a48] px-3 py-2 text-center text-white"><p className="font-mono text-[9px] font-bold tracking-[0.14em] text-[#fff0b6]">FIELD SCORE</p><p className="font-display text-2xl font-black">{entry.score}</p></div>
        </li>;
      })}</ol>}
    </div>
  </section>;
}
