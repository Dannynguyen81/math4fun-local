/** Field Journal Quest — profile gate: playful specimen stickers on a parchment registration sheet. */
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Compass, Shield, Sparkles, UserRoundCheck } from "lucide-react";
import { AvatarId, useGame } from "@/contexts/GameContext";

const avatars: { id: AvatarId; label: string; note: string; image: string; tint: string }[] = [
  { id: "compass", label: "Mây La Bàn", note: "ham khám phá", image: "/manus-storage/math4fun-avatar-compass_c1cebf77.png", tint: "bg-[#fff0b6]" },
  { id: "ember", label: "Nhi Hỏa Tinh", note: "gan dạ thử thách", image: "/manus-storage/math4fun-avatar-ember_095098ee.png", tint: "bg-[#ffe4dc]" },
  { id: "tide", label: "Lam Thủy Triều", note: "điềm tĩnh suy luận", image: "/manus-storage/math4fun-avatar-tide_cc836336.png", tint: "bg-[#e4f3fb]" },
  { id: "leaf", label: "Mầm Rêu Non", note: "chăm chỉ từng bước", image: "/manus-storage/math4fun-avatar-leaf_b35efd62.png", tint: "bg-[#e7f2e5]" },
];
const avatarFor = (id: AvatarId) => avatars.find((avatar) => avatar.id === id) ?? avatars[0];

export default function StartPage() {
  const [, navigate] = useLocation();
  const { createProfile, profiles, selectProfile } = useGame();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarId>("compass");
  const selected = avatarFor(avatar);
  function submit(event: FormEvent) { event.preventDefault(); createProfile(name.trim() || "Nhà thám hiểm", avatar); navigate("/"); }
  return <section className="mx-auto max-w-5xl overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] shadow-[7px_7px_0_#172a48]">
    <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[.8fr_1.2fr]"><div className="paper-noise pointer-events-none absolute inset-0 opacity-40"/>
      <aside className="relative border-b-2 border-dashed border-[#d7d0bf] pb-7 lg:border-b-0 lg:border-r-2 lg:pb-0 lg:pr-8"><span className="field-tag"><Shield size={14}/> HỒ SƠ LOCAL</span><h1 className="mt-5 font-display text-5xl font-black leading-[.92] tracking-tight">Chọn bạn<br/>đồng hành.</h1><p className="mt-5 text-sm leading-relaxed text-[#476275]">Mỗi học sinh có một nhật ký riêng: tiến độ trạm, Gold, kho đồ, guardian và huy hiệu đều chỉ nằm trên trình duyệt này.</p><div className="relative mt-6 overflow-hidden border-2 border-[#172a48] bg-[#172a48] p-4 text-white shadow-[4px_4px_0_#f6b73c]"><img src={selected.image} alt="" className="absolute -right-8 -top-7 h-40 w-40 object-contain opacity-35"/><div className="relative"><p className="font-mono text-[10px] font-black tracking-[.16em] text-[#f6b73c]">THẺ NHÂN VẬT ĐANG CHỌN</p><b className="mt-3 block font-display text-2xl">{selected.label}</b><p className="mt-1 text-sm text-[#d5dfed]">{selected.note}. Mọi con đường đều mở từ một lời giải đúng.</p></div></div><Link href="/" className="relative mt-6 inline-flex items-center gap-2 text-sm font-black text-[#172a48] underline decoration-[#f6b73c] decoration-2 underline-offset-4">Về trang hành trình <ArrowRight size={15}/></Link></aside>
      <form onSubmit={submit} className="relative"><p className="section-kicker">PHIẾU ĐĂNG KÝ NHÀ THÁM HIỂM</p><label className="mt-4 block font-display text-2xl font-black">Em muốn được gọi là gì?</label><input value={name} onChange={(event) => setName(event.target.value)} maxLength={22} placeholder="Ví dụ: Violet" className="mt-3 w-full border-2 border-[#172a48] bg-white px-4 py-3 font-display text-xl font-black outline-none transition focus:bg-[#fff8da]"/>
        <div className="mt-6 flex items-end justify-between gap-3"><div><p className="font-display text-2xl font-black">Chọn nhân vật của em</p><p className="mt-1 text-sm text-[#58708b]">Chạm vào sticker để ghi dấu lên thẻ hành trình.</p></div><Compass className="text-[#f6b73c]" size={28}/></div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{avatars.map((item) => <button type="button" key={item.id} onClick={() => setAvatar(item.id)} className={`relative overflow-hidden border-2 border-[#172a48] p-2 text-left shadow-[2px_2px_0_#172a48] transition duration-200 ${avatar === item.id ? "-translate-y-1 bg-[#172a48] text-white shadow-[4px_4px_0_#f6b73c]" : `${item.tint} hover:-translate-y-0.5`}`}><img src={item.image} alt={`Avatar ${item.label}`} className="mx-auto h-24 w-full object-contain"/><b className="mt-1 block text-xs leading-tight">{item.label}</b><small className={avatar === item.id ? "block text-[10px] text-[#d5dfed]" : "block text-[10px] text-[#58708b]"}>{item.note}</small>{avatar === item.id && <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-[#f6b73c] text-[#172a48]"><Sparkles size={12}/></span>}</button>)}</div>
        <button className="mt-7 inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-5 py-3 font-bold shadow-[3px_3px_0_#172a48] transition active:scale-[.97]"><Sparkles size={17}/> Vào hành trình với {selected.label}</button>
      </form>
    </div>
    {profiles.length > 0 && <section className="relative border-t-2 border-[#172a48] bg-[#172a48] p-5 text-white"><p className="font-mono text-[10px] font-bold tracking-[.16em] text-[#f6b73c]">NHẬT KÝ ĐÃ CÓ TRÊN MÁY NÀY</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{profiles.map((entry) => { const avatarInfo = avatarFor(entry.avatar); return <button key={entry.id} onClick={() => { selectProfile(entry.id); navigate("/"); }} className="flex items-center gap-3 border border-white/35 bg-white/10 p-3 text-left transition hover:-translate-y-0.5 hover:bg-white/20"><img src={avatarInfo.image} alt="" className="h-12 w-12 rounded-full border border-[#f6b73c] object-cover"/><span><b className="block">{entry.name}</b><small className="text-[#d5dfed]">{entry.gold ?? 0} Gold · {entry.completedStationIds.length} dấu niêm phong</small></span><UserRoundCheck className="ml-auto text-[#f6b73c]" size={18}/></button>; })}</div></section>}
    <p className="relative border-t-2 border-dashed border-[#d7d0bf] p-4 text-center text-xs text-[#58708b]">Đây là prototype local; phụ huynh quản lý hồ sơ và PIN ngay trên thiết bị đang dùng.</p>
  </section>;
}
