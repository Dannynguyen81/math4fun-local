/** Field Journal Quest — a first-run paper dossier lets each local learner own a separate expedition. */
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { Compass, Feather, Flame, Shield, Sparkles, Waves } from "lucide-react";
import { AvatarId, useGame } from "@/contexts/GameContext";

const avatars: { id: AvatarId; label: string; note: string; Icon: typeof Compass; tone: string }[] = [
  { id: "compass", label: "La bàn", note: "thích khám phá", Icon: Compass, tone: "bg-[#fff0b6]" },
  { id: "ember", label: "Tia lửa", note: "thích thử thách", Icon: Flame, tone: "bg-[#ffe4dc]" },
  { id: "tide", label: "Làn nước", note: "bình tĩnh suy luận", Icon: Waves, tone: "bg-[#e4f3fb]" },
  { id: "leaf", label: "Lá dẫn đường", note: "học từng bước", Icon: Feather, tone: "bg-[#e7f2e5]" },
];

export default function StartPage() {
  const [, navigate] = useLocation();
  const { createProfile, profiles, selectProfile } = useGame();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarId>("compass");
  function submit(event: FormEvent) {
    event.preventDefault();
    createProfile(name.trim() || "Nhà thám hiểm", avatar);
    navigate("/");
  }
  return <section className="mx-auto max-w-4xl overflow-hidden border-2 border-[#172a48] bg-[#fffdf6] shadow-[7px_7px_0_#172a48]">
    <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[0.9fr_1.1fr]"><div className="paper-noise pointer-events-none absolute inset-0 opacity-40" /><div className="relative border-b-2 border-dashed border-[#d7d0bf] pb-7 lg:border-b-0 lg:border-r-2 lg:pb-0 lg:pr-8"><span className="field-tag"><Shield size={14} /> HỒ SƠ LOCAL</span><h1 className="mt-5 font-display text-5xl font-black leading-[0.92] tracking-tight">Mở sổ<br />hành trình.</h1><p className="mt-5 text-sm leading-relaxed text-[#476275]">Mỗi học sinh có tên, tiến độ, đội guardian và thống kê riêng trên <b>trình duyệt này</b>. Không cần email, không có tài khoản trực tuyến.</p><div className="evidence-card mt-6 border-2 border-[#172a48] bg-[#fff8da] p-4"><p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#58708b]">LUẬT THÁM HIỂM</p><p className="mt-2 text-sm leading-relaxed">Mỗi tuần chỉ mở tối đa <b>2 chủ đề</b>. Một trạm cần 10 câu đúng riêng biệt; thoát ra không xóa câu đã làm sai.</p></div></div>
      <form onSubmit={submit} className="relative"><p className="section-kicker">Phiếu đăng ký nhà thám hiểm</p><label className="mt-4 block font-display text-2xl font-black">Em muốn được gọi là gì?</label><input value={name} onChange={(event) => setName(event.target.value)} maxLength={22} placeholder="Ví dụ: Violet" className="mt-3 w-full border-2 border-[#172a48] bg-white px-4 py-3 font-display text-xl font-black outline-none transition focus:bg-[#fff8da]" />
        <p className="mt-6 font-display text-2xl font-black">Chọn dấu hiệu của em</p><div className="mt-3 grid grid-cols-2 gap-3">{avatars.map(({ id, label, note, Icon, tone }) => <button type="button" key={id} onClick={() => setAvatar(id)} className={`flex items-center gap-3 border-2 border-[#172a48] p-3 text-left shadow-[2px_2px_0_#172a48] transition ${avatar === id ? "bg-[#172a48] text-white" : `${tone} hover:-translate-y-0.5`}`}><span className={`grid h-10 w-10 place-items-center rounded-full border-2 border-[#172a48] ${avatar === id ? "bg-[#f6b73c] text-[#172a48]" : "bg-white"}`}><Icon size={20} /></span><span><b className="block">{label}</b><span className={`block text-xs ${avatar === id ? "text-[#d5dfed]" : "text-[#58708b]"}`}>{note}</span></span></button>)}</div><button className="mt-7 inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-5 py-3 font-bold shadow-[3px_3px_0_#172a48] transition active:scale-[0.97]"><Sparkles size={17} /> Bắt đầu hành trình</button></form>
    </div>{profiles.length > 0 && <div className="relative border-t-2 border-[#172a48] bg-[#172a48] p-5 text-white"><p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#f6b73c]">HỒ SƠ ĐÃ CÓ TRÊN MÁY NÀY</p><div className="mt-3 flex flex-wrap gap-2">{profiles.map((profile) => <button key={profile.id} onClick={() => { selectProfile(profile.id); navigate("/"); }} className="border border-white/40 bg-white/10 px-3 py-2 text-sm font-bold hover:bg-white/20">{profile.name}</button>)}</div></div>}
    <p className="relative border-t-2 border-dashed border-[#d7d0bf] p-4 text-center text-xs text-[#58708b]">Đây là prototype chạy local; phụ huynh có thể đổi hoặc xoá dữ liệu qua cài đặt trình duyệt.</p>
  </section>;
}
