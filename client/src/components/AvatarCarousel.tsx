/**
 * Field Journal Quest onboarding: one full-body chibi specimen at a time, framed as a deliberate companion choice.
 * The specimen panel stays compact inside the viewport, uses parchment-friendly transparent artwork, and animates only opacity/transform.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Compass, LoaderCircle, Sparkles, Wand2 } from "lucide-react";
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
  const [imageStatus, setImageStatus] = useState<"loading" | "ready" | "error">("loading");
  const current = AVATARS[index];
  const currentSrc = avatarImageById[current.id];
  const step = (direction: 1 | -1) => setIndex((value) => (value + direction + AVATARS.length) % AVATARS.length);

  useEffect(() => {
    let active = true;
    setImageStatus("loading");
    const nextIndex = (index + 1) % AVATARS.length;
    const previousIndex = (index - 1 + AVATARS.length) % AVATARS.length;
    const sources = [currentSrc, avatarImageById[AVATARS[nextIndex].id], avatarImageById[AVATARS[previousIndex].id]];
    const preloaders = sources.map((src, sourceIndex) => {
      const image = new window.Image();
      image.onload = () => {
        if (active && sourceIndex === 0) setImageStatus("ready");
      };
      image.onerror = () => {
        if (active && sourceIndex === 0) setImageStatus("error");
      };
      image.src = src;
      return image;
    });
    return () => {
      active = false;
      preloaders.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [currentSrc, index]);

  return <Dialog open={open}>
    <DialogContent
      showCloseButton={false}
      onEscapeKeyDown={(event) => event.preventDefault()}
      onPointerDownOutside={(event) => event.preventDefault()}
      className="max-h-[calc(100dvh-1rem)] w-[min(94vw,860px)] max-w-none overflow-y-auto rounded-none border-2 border-[#172a48] bg-[#fffdf6] p-0 text-[#172a48] shadow-[7px_7px_0_#f6b73c] sm:shadow-[9px_9px_0_#f6b73c]"
    >
      <div className="relative overflow-hidden">
        <div className="paper-noise pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative border-b-2 border-dashed border-[#c9b88c] px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-2 border border-[#172a48] bg-[#fff0b6] px-2 py-1 font-mono text-[8px] font-black tracking-[.13em] sm:text-[9px] sm:tracking-[.15em]"><Compass size={12} /> COMPANION SELECTION · 01</span>
              <DialogTitle className="mt-3 font-display text-2xl font-black leading-none sm:mt-4 sm:text-3xl">Ai sẽ cùng em<br />ghi dấu trên bản đồ?</DialogTitle>
              <DialogDescription className="mt-2 max-w-xl text-xs leading-relaxed text-[#476275] sm:mt-3 sm:text-sm">Hãy xem từng nhà thám hiểm, rồi chọn người bạn đầu tiên cho sổ hành trình của em.</DialogDescription>
            </div>
            <span className="hidden border-2 border-[#172a48] bg-[#172a48] px-2 py-1.5 font-mono text-[9px] font-black tracking-[.14em] text-[#f6b73c] sm:block">{String(index + 1).padStart(2, "0")} / 10</span>
          </div>
        </div>

        <div className="relative grid gap-4 p-4 sm:gap-5 sm:p-5 md:grid-cols-[.95fr_1.05fr] md:gap-6 md:p-6">
          <div aria-busy={imageStatus === "loading"} className={`relative h-[clamp(280px,38dvh,420px)] overflow-hidden border-2 border-[#172a48] ${current.tone} shadow-[4px_4px_0_#172a48] sm:h-[clamp(320px,44dvh,450px)]`}>
            <span className="absolute left-3 top-3 z-10 border border-[#172a48] bg-[#fffdf6]/90 px-2 py-1 font-mono text-[8px] font-black tracking-[.14em] sm:left-4 sm:top-4 sm:text-[9px]">SPECIMEN {current.id.toUpperCase()}</span>
            <span className="absolute bottom-3 right-3 z-10 grid h-10 w-10 place-items-center rounded-full border-2 border-[#172a48] bg-[#f6b73c] shadow-[2px_2px_0_#172a48] sm:bottom-4 sm:right-4 sm:h-12 sm:w-12"><Wand2 size={18} /></span>
            <div aria-hidden className="absolute inset-x-6 bottom-7 h-12 rounded-[50%] border-2 border-[#172a48]/20 bg-white/45 blur-[1px] sm:inset-x-8 sm:bottom-9 sm:h-16" />
            <AnimatePresence mode="wait">
              <motion.div key={current.id} initial={{ opacity: 0, x: 24, scale: .985 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -24, scale: .985 }} transition={{ duration: .28, ease: [0.23, 1, 0.32, 1] }} className="absolute inset-0">
                <motion.img src={currentSrc} alt={`Nhân vật chibi 3D ${current.name}`} initial={{ opacity: 0 }} animate={{ opacity: imageStatus === "ready" ? 1 : 0 }} transition={{ duration: .2 }} onLoad={() => setImageStatus("ready")} onError={() => setImageStatus("error")} className="absolute inset-x-0 bottom-2 z-[1] mx-auto h-[88%] w-[86%] object-contain drop-shadow-[0_15px_11px_rgba(23,42,72,.2)] sm:bottom-3 sm:drop-shadow-[0_18px_13px_rgba(23,42,72,.22)]" />
              </motion.div>
            </AnimatePresence>
            {imageStatus === "loading" && <motion.div aria-live="polite" className="absolute inset-0 z-20 grid place-items-center bg-[#fffdf6]/45 backdrop-blur-[1px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div className="flex items-center gap-2 border-2 border-[#172a48] bg-[#fffdf6] px-3 py-2 text-xs font-black shadow-[3px_3px_0_#172a48]"><LoaderCircle size={16} className="animate-spin" /> Đang gọi bạn đồng hành…</div></motion.div>}
            {imageStatus === "error" && <div role="status" className="absolute inset-x-4 bottom-4 z-20 border-2 border-[#172a48] bg-[#fffdf6]/95 px-3 py-2 text-center text-xs font-bold shadow-[2px_2px_0_#172a48]">Ảnh đang được đánh thức — em vẫn có thể chọn bạn này.</div>}
            <svg aria-hidden viewBox="0 0 320 180" className="pointer-events-none absolute inset-0 h-full w-full opacity-35"><path d="M5 142 C70 67 88 178 164 103 S253 41 328 78" fill="none" stroke="#172a48" strokeDasharray="5 9" strokeWidth="2" /><circle cx="164" cy="103" r="5" fill="#f6b73c" /></svg>
          </div>

          <div className="flex min-w-0 flex-col justify-between">
            <div>
              <p className="font-mono text-[9px] font-black tracking-[.16em] text-[#58708b] sm:text-[10px]">{current.role.toUpperCase()}</p>
              <AnimatePresence mode="wait">
                <motion.div key={`${current.id}-copy`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .2 }}>
                  <h3 className="mt-1.5 font-display text-3xl font-black leading-none sm:mt-2 sm:text-4xl">{current.name}</h3>
                  <p className="mt-2 inline-block border-y-2 border-dashed border-[#c9b88c] py-1.5 font-display text-lg font-black sm:mt-3 sm:py-2 sm:text-xl">“{current.motto}”</p>
                  <p className="mt-3 text-xs leading-relaxed text-[#476275] sm:mt-4 sm:text-sm">{current.detail}</p>
                  <span className="mt-4 inline-flex items-center gap-2 border-2 border-[#172a48] bg-[#e7f2e5] px-3 py-1.5 text-[11px] font-black sm:mt-5 sm:py-2 sm:text-xs"><Sparkles size={13} />{current.trait}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center gap-2 sm:mt-7 sm:gap-3">
              <button onClick={() => step(-1)} aria-label="Xem nhân vật trước" className="grid h-10 w-10 place-items-center border-2 border-[#172a48] bg-white shadow-[2px_2px_0_#172a48] transition hover:bg-[#eef1fb] active:scale-[.97] sm:h-12 sm:w-12"><ArrowLeft size={18} /></button>
              <button onClick={() => step(1)} aria-label="Xem nhân vật tiếp theo" className="grid h-10 w-10 place-items-center border-2 border-[#172a48] bg-white shadow-[2px_2px_0_#172a48] transition hover:bg-[#eef1fb] active:scale-[.97] sm:h-12 sm:w-12"><ArrowRight size={18} /></button>
              <div className="ml-auto flex max-w-[42vw] gap-1 overflow-hidden" aria-label="Tiến độ chọn nhân vật">{AVATARS.map((avatar, dotIndex) => <button key={avatar.id} onClick={() => setIndex(dotIndex)} aria-label={`Xem ${avatar.name}`} aria-current={dotIndex === index} className={`h-2.5 shrink-0 transition-[width,background-color] duration-200 ${dotIndex === index ? "w-7 bg-[#f6b73c]" : "w-2.5 bg-[#c9b88c] hover:bg-[#58708b]"}`} />)}</div>
            </div>
            <button onClick={() => completeAvatarOnboarding(current.id)} className="mt-3 flex w-full items-center justify-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-3 py-2.5 text-sm font-black shadow-[3px_3px_0_#172a48] transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[.97] sm:mt-4 sm:px-4 sm:py-3"><Compass size={17} />Chọn {current.name} làm bạn đồng hành</button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>;
}
