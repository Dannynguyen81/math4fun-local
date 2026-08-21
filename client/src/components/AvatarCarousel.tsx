/**
 * Field Journal Quest onboarding: one full-body chibi specimen at a time, framed as a deliberate companion choice.
 * Navigation is cyclic, keyboard-friendly, and relies only on transform/opacity motion through Framer Motion.
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Compass, Sparkles, Wand2 } from "lucide-react";
import type { AvatarId } from "@/contexts/GameContext";
import { useGame } from "@/contexts/GameContext";
import { avatarImageById } from "@/components/PlayerAvatar";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type AvatarSpecimen = { id: AvatarId; name: string; role: string; trait: string; motto: string; tone: string; detail: string };
const AVATARS: AvatarSpecimen[] = [
  { id: "onb01", name: "Minh La Bàn", role: "Người đọc tuyến đường", trait: "Bình tĩnh · quan sát", motto: "Mỗi con số đều có một hướng đi.", tone: "bg-[#dbe5ff]", detail: "Luôn ghi mốc nhỏ trước khi giải bài lớn." },
  { id: "onb02", name: "Tí Đỉnh Đồi", role: "Kẻ săn quy luật", trait: "Nhanh nhẹn · dí dỏm", motto: "Thử thêm một cách nữa nhé!", tone: "bg-[#e7f2e5]", detail: "Thích tìm quy luật trong những dãy số bí mật." },
  { id: "onb03", name: "Nam Kính Lúp", role: "Nhà quan sát hình học", trait: "Tỉ mỉ · tò mò", motto: "Nhìn kỹ là thấy lời giải.", tone: "bg-[#fff0b6]", detail: "Không bỏ qua một góc, một cạnh hay một dấu chấm nào." },
  { id: "onb04", name: "Bảo Lông Vũ", role: "Người ghi chép phép tính", trait: "Sáng tạo · chắc chắn", motto: "Lời giải đẹp cần từng nét rõ ràng.", tone: "bg-[#f9eadf]", detail: "Biến những phép tính dài thành đường đi thật gọn." },
  { id: "onb05", name: "Khoa Cờ Mốc", role: "Đội trưởng tuyến học", trait: "Can đảm · tử tế", motto: "Cùng tiến lên từng trạm một!", tone: "bg-[#eef1fb]", detail: "Luôn nhắc bạn đồng hành nghỉ một nhịp rồi thử lại." },
  { id: "ong01", name: "An Mây Nhỏ", role: "Người kể chuyện con số", trait: "Ấm áp · thông minh", motto: "Toán cũng có chuyện để kể.", tone: "bg-[#ffe4dc]", detail: "Gợi ý cách biến đề bài thành một câu chuyện dễ nhớ." },
  { id: "ong02", name: "Linh Bản Đồ", role: "Nhà vẽ lối tắt", trait: "Tinh tế · quyết đoán", motto: "Đặt dấu mốc, rồi đường sẽ hiện ra.", tone: "bg-[#dceef6]", detail: "Thích chia bài toán thành các chặng vừa sức." },
  { id: "ong03", name: "Vy Kính Lúp", role: "Thợ săn manh mối", trait: "Tinh nghịch · sắc sảo", motto: "Manh mối đang trốn ở đâu nhỉ?", tone: "bg-[#eff4e9]", detail: "Luôn tìm được dữ kiện quan trọng trong đề bài." },
  { id: "ong04", name: "Mai Lông Vũ", role: "Pháp sư đo lường", trait: "Nhẹ nhàng · chính xác", motto: "Đo đúng một lần, tự tin cả chặng.", tone: "bg-[#fff3df]", detail: "Giỏi đổi đơn vị và ghi phép tính thật ngay ngắn." },
  { id: "ong05", name: "Nhi Cờ Mốc", role: "Người giữ nhịp hành trình", trait: "Bền bỉ · vui vẻ", motto: "Thêm một câu đúng, thêm một vì sao.", tone: "bg-[#f9eeee]", detail: "Mang năng lượng tích cực cho những thử thách khó." },
];

export function AvatarCarousel({ open }: { open: boolean }) {
  const { completeAvatarOnboarding } = useGame();
  const [index, setIndex] = useState(0);
  const current = AVATARS[index];
  const step = (direction: 1 | -1) => setIndex((value) => (value + direction + AVATARS.length) % AVATARS.length);
  return <Dialog open={open}>
    <DialogContent showCloseButton={false} onEscapeKeyDown={(event) => event.preventDefault()} onPointerDownOutside={(event) => event.preventDefault()} className="w-[min(94vw,980px)] max-w-none rounded-none border-2 border-[#172a48] bg-[#fffdf6] p-0 text-[#172a48] shadow-[9px_9px_0_#f6b73c]">
      <div className="relative overflow-hidden"><div className="paper-noise pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative border-b-2 border-dashed border-[#c9b88c] px-6 pb-4 pt-6 sm:px-8 sm:pt-7"><div className="flex items-start justify-between gap-4"><div><span className="inline-flex items-center gap-2 border border-[#172a48] bg-[#fff0b6] px-2 py-1 font-mono text-[9px] font-black tracking-[.15em]"><Compass size={13} /> COMPANION SELECTION · 01</span><DialogTitle className="mt-4 font-display text-3xl font-black leading-none sm:text-4xl">Ai sẽ cùng em<br />ghi dấu trên bản đồ?</DialogTitle><DialogDescription className="mt-3 max-w-xl text-sm leading-relaxed text-[#476275]">Hãy xem từng nhà thám hiểm, rồi chọn người bạn đầu tiên cho sổ hành trình của em.</DialogDescription></div><span className="hidden border-2 border-[#172a48] bg-[#172a48] px-3 py-2 font-mono text-[10px] font-black tracking-[.14em] text-[#f6b73c] sm:block">{String(index + 1).padStart(2, "0")} / 10</span></div></div>
        <div className="relative grid gap-5 p-5 sm:p-7 md:grid-cols-[1.05fr_.95fr] md:gap-8"><div className={`relative min-h-[360px] overflow-hidden border-2 border-[#172a48] ${current.tone} shadow-[5px_5px_0_#172a48] sm:min-h-[430px]`}><span className="absolute left-4 top-4 z-10 border border-[#172a48] bg-[#fffdf6]/90 px-2 py-1 font-mono text-[9px] font-black tracking-[.14em]">SPECIMEN {current.id.toUpperCase()}</span><span className="absolute bottom-4 right-4 z-10 grid h-12 w-12 place-items-center rounded-full border-2 border-[#172a48] bg-[#f6b73c] shadow-[2px_2px_0_#172a48]"><Wand2 size={20} /></span><div aria-hidden className="absolute inset-x-8 bottom-9 h-16 rounded-[50%] border-2 border-[#172a48]/20 bg-white/45 blur-[1px]" />
          <AnimatePresence mode="wait"><motion.img key={current.id} src={avatarImageById[current.id]} alt={`Nhân vật chibi 3D ${current.name}`} initial={{ opacity: 0, x: 24, rotate: 1 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: -24, rotate: -1 }} transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }} className="absolute inset-x-0 bottom-3 z-[1] mx-auto h-[88%] w-[86%] object-contain drop-shadow-[0_18px_13px_rgba(23,42,72,.22)]" /></AnimatePresence>
          <svg aria-hidden viewBox="0 0 320 180" className="pointer-events-none absolute inset-0 h-full w-full opacity-40"><path d="M5 142 C70 67 88 178 164 103 S253 41 328 78" fill="none" stroke="#172a48" strokeDasharray="5 9" strokeWidth="2" /><circle cx="164" cy="103" r="5" fill="#f6b73c" /></svg></div>
          <div className="flex flex-col justify-between"><div><p className="font-mono text-[10px] font-black tracking-[.16em] text-[#58708b]">{current.role.toUpperCase()}</p><AnimatePresence mode="wait"><motion.div key={`${current.id}-copy`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><h3 className="mt-2 font-display text-4xl font-black leading-none">{current.name}</h3><p className="mt-3 inline-block border-y-2 border-dashed border-[#c9b88c] py-2 font-display text-xl font-black">“{current.motto}”</p><p className="mt-4 text-sm leading-relaxed text-[#476275]">{current.detail}</p><span className="mt-5 inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#e7f2e5] px-3 py-2 text-xs font-black"><Sparkles size={14} />{current.trait}</span></motion.div></AnimatePresence></div>
            <div className="mt-7 flex items-center gap-3"><button onClick={() => step(-1)} aria-label="Xem nhân vật trước" className="grid h-12 w-12 place-items-center border-2 border-[#172a48] bg-white shadow-[2px_2px_0_#172a48] transition hover:bg-[#eef1fb] active:scale-[.97]"><ArrowLeft size={20} /></button><button onClick={() => step(1)} aria-label="Xem nhân vật tiếp theo" className="grid h-12 w-12 place-items-center border-2 border-[#172a48] bg-white shadow-[2px_2px_0_#172a48] transition hover:bg-[#eef1fb] active:scale-[.97]"><ArrowRight size={20} /></button><div className="ml-auto flex gap-1">{AVATARS.map((avatar, dotIndex) => <button key={avatar.id} onClick={() => setIndex(dotIndex)} aria-label={`Xem ${avatar.name}`} aria-current={dotIndex === index} className={`h-2.5 transition ${dotIndex === index ? "w-7 bg-[#f6b73c]" : "w-2.5 bg-[#c9b88c] hover:bg-[#58708b]"}`} />)}</div></div>
            <button onClick={() => completeAvatarOnboarding(current.id)} className="mt-4 flex w-full items-center justify-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-3 font-black shadow-[3px_3px_0_#172a48] transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[.97]"><Compass size={18} />Chọn {current.name} làm bạn đồng hành</button>
          </div></div>
      </div>
    </DialogContent>
  </Dialog>;
}
