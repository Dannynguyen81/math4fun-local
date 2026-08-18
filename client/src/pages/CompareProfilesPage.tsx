// Field Journal Quest: a comparative evidence spread, not an administrative leaderboard.
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Award, BookOpenCheck, Compass, Crown, Gem, Scale, Sparkles, Trophy, UsersRound } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

function tallyBadges(profile: { elementXp: Record<string, number | undefined>; streak: number }) {
  const elemental = Object.values(profile.elementXp).filter((xp) => (xp ?? 0) >= 200).length;
  return elemental + (profile.streak >= 14 ? 2 : profile.streak >= 7 ? 1 : 0);
}

function CompareEmptyArtifact({ hasOneProfile }: { hasOneProfile: boolean }) {
  const title = hasOneProfile ? "Một nhật ký nữa sẽ mở bàn đối chiếu." : "Hai nhật ký mới tạo được một tuyến so sánh.";
  const description = hasOneProfile
    ? "Hồ sơ đầu tiên đã có mặt. Hãy ký một nhật ký khác trên cùng thiết bị để đặt hai dấu mốc học tập cạnh nhau."
    : "Ký tên vào hai hồ sơ trên cùng thiết bị để các guardian, huy hiệu và mốc học cùng hiện trên phiếu đối chiếu.";

  return <section className="stats-blank-dossier relative overflow-hidden">
    <div className="absolute right-8 top-6 rotate-[12deg] font-display text-7xl font-black text-[#172a48]/5">VS</div>
    <header className="relative grid gap-5 lg:grid-cols-[1fr_245px]">
      <div><p className="section-kicker">PHIẾU ĐỐI CHIẾU · {hasOneProfile ? "01 / 02" : "CHỜ KÝ TÊN"}</p><h1 className="font-display text-4xl font-black">{title}</h1><p className="mt-3 max-w-xl">{description}</p><div className="mt-5 inline-flex items-center gap-2 border-2 border-dashed border-[#172a48] bg-[#fff8da] px-3 py-2 text-xs font-bold"><Sparkles size={15} className="text-[#d99818]"/> Cùng tiến bộ, không phải hơn thua.</div></div>
      <aside className="rotate-[2deg] border-2 border-[#172a48] bg-[#fff8da] p-4 shadow-[3px_3px_0_#172a48]"><p className="field-tag">SPECIMEN · SO SÁNH</p><div className="mt-3 grid h-28 place-items-center rounded-full border-2 border-dashed border-[#172a48] bg-[#fffdf6]"><Scale size={38}/></div><p className="mt-3 font-mono text-[10px] font-bold tracking-[.13em]">{hasOneProfile ? "01 NHẬT KÝ · CẦN 01" : "02 NHẬT KÝ · MỞ NIÊM"}</p><p className="mt-2 text-xs text-[#476275]">Con dấu công bằng chờ đủ hai dấu chân.</p></aside>
    </header>
    <div className="stats-blank-route relative mt-7"><span className="is-active">01<small>{hasOneProfile ? "Đã ký tên" : "Ký nhật ký A"}</small></span><i/><span className={hasOneProfile ? "is-active" : ""}>02<small>Ký nhật ký B</small></span><i/><span>03<small>Đặt hai dấu mốc</small></span></div>
    <div className="relative mt-6 grid gap-3 border-y-2 border-dashed border-[#c9b88c] bg-[#eef1fb] p-4 md:grid-cols-3"><div><p className="field-tag">BẰNG CHỨNG 01</p><b className="mt-1 block font-display text-lg">Một câu toán</b><p className="text-xs text-[#476275]">Ghi điểm đầu tiên.</p></div><div><p className="field-tag">BẰNG CHỨNG 02</p><b className="mt-1 block font-display text-lg">Một guardian</b><p className="text-xs text-[#476275]">Đánh dấu trạm đã qua.</p></div><div><p className="field-tag">BẰNG CHỨNG 03</p><b className="mt-1 block font-display text-lg">Phiếu đôi mở</b><p className="text-xs text-[#476275]">So mục tiêu cho tuần này.</p></div></div>
    <Link href="/start" className="stats-blank-cta">Ký tên mở phiếu đối chiếu <Compass className="ml-1 inline" size={15}/></Link>
  </section>;
}

export default function CompareProfilesPage() {
  const { profile, profiles, leaderboard } = useGame();
  const candidates = useMemo(() => profiles.filter((entry) => entry.id !== profile?.id), [profiles, profile?.id]);
  const [selectedId, setSelectedId] = useState("");
  const opponent = candidates.find((entry) => entry.id === selectedId) ?? candidates[0];
  if (!profile) return <CompareEmptyArtifact hasOneProfile={false}/>;
  if (!opponent) return <CompareEmptyArtifact hasOneProfile/>;
  const activeRank = leaderboard.findIndex((entry) => entry.profileId === profile.id) + 1;
  const opponentRank = leaderboard.findIndex((entry) => entry.profileId === opponent.id) + 1;
  const rows = [
    { label: "Điểm XP", value: profile.xp, other: opponent.xp, icon: Trophy },
    { label: "Bằng chứng đúng", value: profile.correctQuestionIds.length, other: opponent.correctQuestionIds.length, icon: BookOpenCheck },
    { label: "Trạm hoàn thành", value: profile.completedStationIds.length, other: opponent.completedStationIds.length, icon: Compass },
    { label: "Guardian thu phục", value: profile.collectedGuardianIds.length, other: opponent.collectedGuardianIds.length, icon: Gem },
    { label: "Huy hiệu", value: tallyBadges(profile), other: tallyBadges(opponent), icon: Award },
    { label: "Chuỗi học (ngày)", value: profile.streak, other: opponent.streak, icon: Crown },
  ];
  return <section><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="section-kicker">PHIẾU ĐỐI CHIẾU · LOCAL ONLY</p><h1 className="font-display text-4xl font-black">So sánh hành trình</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#58708b]">Đặt hai nhật ký cạnh nhau để cổ vũ nhau học đều. Không có dữ liệu nào rời khỏi thiết bị này.</p></div><label className="border-2 border-[#172a48] bg-[#fff8da] p-3 text-xs font-bold shadow-[3px_3px_0_#172a48]"><span className="block font-mono text-[9px] tracking-[.13em] text-[#58708b]">ĐỐI CHIẾU VỚI</span><select value={opponent.id} onChange={(event) => setSelectedId(event.target.value)} className="mt-1 max-w-48 bg-transparent text-base font-display font-black outline-none">{candidates.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label></header>
    <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_120px_1fr]"><article className="border-2 border-[#172a48] bg-[#eef1fb] p-5 shadow-[4px_4px_0_#172a48]"><p className="field-tag">NHẬT KÝ A · HỒ SƠ ĐANG VÀO</p><div className="mt-4 flex items-center gap-3"><span className="grid h-16 w-16 place-items-center rounded-full border-2 border-[#172a48] bg-[#fffdf6] text-3xl">{profile.avatar}</span><div><h2 className="font-display text-3xl font-black">{profile.name}</h2><p className="text-sm text-[#476275]">Hạng #{activeRank} · Level {Math.floor(profile.xp / 250) + 1}</p></div></div></article><div className="grid place-items-center border-y-2 border-dashed border-[#172a48] bg-[#fff8da] p-4 font-display text-2xl font-black lg:border-x-2 lg:border-y-0">VS</div><article className="border-2 border-[#172a48] bg-[#e8f0e4] p-5 shadow-[4px_4px_0_#172a48]"><p className="field-tag">NHẬT KÝ B · ĐỐI CHIẾU</p><div className="mt-4 flex items-center gap-3"><span className="grid h-16 w-16 place-items-center rounded-full border-2 border-[#172a48] bg-[#fffdf6] text-3xl">{opponent.avatar}</span><div><h2 className="font-display text-3xl font-black">{opponent.name}</h2><p className="text-sm text-[#476275]">Hạng #{opponentRank} · Level {Math.floor(opponent.xp / 250) + 1}</p></div></div></article></div>
    <section className="mt-6 overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] shadow-[5px_5px_0_#172a48]"><div className="border-b-2 border-dashed border-[#c9b88c] bg-[#fff8da] px-5 py-4"><p className="section-kicker">DẤU VẾT SONG HÀNH</p><h2 className="font-display text-3xl font-black">Cùng nhìn về tuyến kế tiếp</h2></div><div className="divide-y-2 divide-dashed divide-[#d7d0bf]">{rows.map(({ label, value, other, icon: Icon }) => { const max = Math.max(value, other, 1); return <div key={label} className="grid gap-3 p-4 md:grid-cols-[1fr_170px_1fr] md:items-center"><div className="text-right"><b className="font-display text-2xl">{value}</b><div className="ml-auto mt-1 h-2 max-w-48 bg-[#d7d0bf]"><div className="ml-auto h-full bg-[#57518d]" style={{ width: `${(value / max) * 100}%` }}/></div></div><div className="text-center text-xs font-bold text-[#476275]"><Icon className="mx-auto mb-1 text-[#d99818]" size={16}/>{label}</div><div><b className="font-display text-2xl">{other}</b><div className="mt-1 h-2 max-w-48 bg-[#d7d0bf]"><div className="h-full bg-[#3e9b7a]" style={{ width: `${(other / max) * 100}%` }}/></div></div></div>; })}</div></section>
    <p className="mt-6 border-2 border-dashed border-[#172a48] bg-[#fff8da] p-4 text-sm leading-relaxed"><Scale className="mr-2 inline text-[#d99818]" size={17}/><strong>Tinh thần chuyến đi:</strong> dùng phiếu này để đặt mục tiêu học cùng nhau, không phải để làm ai thấy thua kém. Mỗi dấu mốc đều là một trang nhật ký đáng quý.</p></section>;
}
