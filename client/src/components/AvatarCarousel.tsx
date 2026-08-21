/**
 * Field Journal Quest onboarding: one full-body chibi specimen at a time, framed as a deliberate companion choice.
 * Enhanced with touch swipe, keyboard shortcuts, specimen stats panel, and audio feedback.
 */
import { useEffect, useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, LoaderCircle, Shield, Sparkles, Swords, Wand2, Zap } from "lucide-react";
import type { AvatarId } from "@/contexts/GameContext";
import { useGame } from "@/contexts/GameContext";
import { avatarImageById } from "@/components/PlayerAvatar";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { playAvatarSlideSound, playAvatarSelectSound } from "@/lib/magicAudio";

type AvatarSpecimen = {
  id: AvatarId;
  name: string;
  role: string;
  trait: string;
  motto: string;
  tone: string;
  detail: string;
  power: number;
  speed: number;
  wisdom: number;
  element: string;
};

const AVATARS: AvatarSpecimen[] = [
  { id: "onb01", name: "Minh La Bàn", role: "Người đọc tuyến đường", trait: "Bình tĩnh · quan sát", motto: "Mỗi con số đều có một hướng đi.", tone: "bg-[#dbe5ff]", detail: "Luôn ghi mốc nhỏ trước khi giải bài lớn.", power: 75, speed: 80, wisdom: 85, element: "sấm" },
  { id: "onb02", name: "Tí Đỉnh Đồi", role: "Kẻ săn quy luật", trait: "Nhanh nhẹn · dí dỏm", motto: "Thử thêm một cách nữa nhé!", tone: "bg-[#e7f2e5]", detail: "Thích tìm quy luật trong những dãy số bí mật.", power: 70, speed: 95, wisdom: 75, element: "gió" },
  { id: "onb03", name: "Nam Kính Lúp", role: "Nhà quan sát hình học", trait: "Tỉ mỉ · tò mò", motto: "Nhìn kỹ là thấy lời giải.", tone: "bg-[#fff0b6]", detail: "Không bỏ qua một góc, một cạnh hay một dấu chấm nào.", power: 80, speed: 70, wisdom: 90, element: "đất" },
  { id: "onb04", name: "Bảo Lông Vũ", role: "Người ghi chép phép tính", trait: "Sáng tạo · chắc chắn", motto: "Lời giải đẹp cần từng nét rõ ràng.", tone: "bg-[#f9eadf]", detail: "Biến những phép tính dài thành đường đi thật gọn.", power: 85, speed: 75, wisdom: 80, element: "lửa" },
  { id: "onb05", name: "Khoa Cờ Mốc", role: "Đội trưởng tuyến học", trait: "Can đảm · tử tế", motto: "Cùng tiến lên từng trạm một!", tone: "bg-[#eef1fb]", detail: "Luôn nhắc bạn đồng hành nghỉ một nhịp rồi thử lại.", power: 90, speed: 65, wisdom: 85, element: "nước" },
  { id: "ong01", name: "An Mây Nhỏ", role: "Người kể chuyện con số", trait: "Ấm áp · thông minh", motto: "Toán cũng có chuyện để kể.", tone: "bg-[#ffe4dc]", detail: "Gợi ý cách biến đề bài thành một câu chuyện dễ nhớ.", power: 75, speed: 85, wisdom: 90, element: "gió" },
  { id: "ong02", name: "Linh Bản Đồ", role: "Nhà vẽ lối tắt", trait: "Tinh tế · quyết đoán", motto: "Đặt dấu mốc, rồi đường sẽ hiện ra.", tone: "bg-[#dceef6]", detail: "Thích chia bài toán thành các chặng vừa sức.", power: 80, speed: 85, wisdom: 85, element: "đất" },
  { id: "ong03", name: "Vy Kính Lúp", role: "Thợ săn manh mối", trait: "Tinh nghịch · sắc sảo", motto: "Manh mối đang trốn ở đâu nhỉ?", tone: "bg-[#eff4e9]", detail: "Luôn tìm được dữ kiện quan trọng trong đề bài.", power: 75, speed: 90, wisdom: 85, element: "độc" },
  { id: "ong04", name: "Mai Lông Vũ", role: "Pháp sư đo lường", trait: "Nhẹ nhàng · chính xác", motto: "Đo đúng một lần, tự tin cả chặng.", tone: "bg-[#fff3df]", detail: "Giỏi đổi đơn vị và ghi phép tính thật ngay ngắn.", power: 85, speed: 75, wisdom: 90, element: "nước" },
  { id: "ong05", name: "Nhi Cờ Mốc", role: "Người giữ nhịp hành trình", trait: "Bền bỉ · vui vẻ", motto: "Thêm một câu đúng, thêm một vì sao.", tone: "bg-[#f9eeee]", detail: "Mang năng lượng tích cực cho những thử thách khó.", power: 80, speed: 80, wisdom: 85, element: "lửa" },
];

export function AvatarCarousel({ open }: { open: boolean }) {
  const { completeAvatarOnboarding, audioEnabled } = useGame();
  const [index, setIndex] = useState(0);
  const [imageStatus, setImageStatus] = useState<"loading" | "ready" | "error">("loading");
  const [isConfirming, setIsConfirming] = useState(false);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

  const current = AVATARS[index];
  const currentSrc = avatarImageById[current.id];

  const step = useCallback((direction: 1 | -1) => {
    setImageStatus("loading");
    setIndex((value) => {
      const next = (value + direction + AVATARS.length) % AVATARS.length;
      playAvatarSlideSound(audioEnabled);
      return next;
    });
  }, [audioEnabled]);

  const handleSelect = () => {
    if (isConfirming) return;
    setIsConfirming(true);
    playAvatarSelectSound(audioEnabled);
    setTimeout(() => {
      completeAvatarOnboarding(current.id);
    }, 1200);
  };

  // Keyboard navigation & Enter to confirm
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "Enter") {
        event.preventDefault();
        handleSelect();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, index, isConfirming, step]);

  // Preload adjacent images
  useEffect(() => {
    if (!open) return;
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
  }, [currentSrc, index, open]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    if (distance > 50) step(1);
    if (distance < -50) step(-1);
  };

  return <Dialog open={open}>
    <DialogContent
      showCloseButton={false}
      onEscapeKeyDown={(event) => event.preventDefault()}
      onPointerDownOutside={(event) => event.preventDefault()}
      className="max-h-[calc(100dvh-1rem)] w-[min(94vw,860px)] max-w-none overflow-y-auto rounded-none border-2 border-[#172a48] bg-[#fffdf6] p-0 text-[#172a48] shadow-[7px_7px_0_#f6b73c] sm:shadow-[9px_9px_0_#f6b73c]"
    >
      <div className="relative overflow-hidden" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        {isConfirming && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 grid place-items-center bg-[#172a48]/85 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, type: "spring" }} className="text-center text-white p-6">
              <div className="text-5xl mb-3 animate-bounce">🎉✨🎆</div>
              <h3 className="font-display text-2xl font-black text-[#f6b73c]">Chúc mừng Nhà thám hiểm!</h3>
              <p className="mt-2 text-sm text-[#dceef6]">Đã triệu hồi {current.name} thành công. Đang ghi danh vào Sổ tay Toán học...</p>
            </motion.div>
          </motion.div>
        )}
        <div className="paper-noise pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative border-b-2 border-dashed border-[#c9b88c] px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-2 border border-[#172a48] bg-[#fff0b6] px-2 py-1 font-mono text-[8px] font-black tracking-[.13em] sm:text-[9px] sm:tracking-[.15em]"><Compass size={12} /> COMPANION SELECTION · 01</span>
              <DialogTitle className="mt-2.5 font-display text-2xl font-black leading-tight sm:mt-3 sm:text-3xl">Ai sẽ cùng em<br />ghi dấu trên bản đồ?</DialogTitle>
              <DialogDescription className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#476275] sm:text-sm">Vuốt hoặc dùng phím mũi tên để lướt qua lại giữa các nhân vật; quan sát chỉ số sức mạnh và bấm xác nhận.</DialogDescription>
            </div>
            <span className="hidden border-2 border-[#172a48] bg-[#172a48] px-2 py-1.5 font-mono text-[9px] font-black tracking-[.14em] text-[#f6b73c] sm:block">{String(index + 1).padStart(2, "0")} / 10</span>
          </div>
        </div>

        <div className="relative grid gap-4 p-4 sm:gap-5 sm:p-5 md:grid-cols-[.92fr_1.08fr] md:gap-6 md:p-6">
          <div aria-busy={imageStatus === "loading"} className={`relative h-[clamp(260px,36dvh,380px)] overflow-hidden rounded-xl border-3 border-[#172a48] ${current.tone} shadow-[5px_5px_0_#172a48] ring-4 ring-[#f6b73c]/70 sm:h-[clamp(300px,40dvh,410px)]`}>
            <span className="absolute left-3 top-3 z-10 border border-[#172a48] bg-[#fffdf6]/95 px-2 py-1 font-mono text-[8px] font-black tracking-[.14em] shadow-[1px_1px_0_#172a48] sm:left-4 sm:top-4 sm:text-[9px]">SPECIMEN {current.id.toUpperCase()}</span>
            <span className="absolute bottom-3 right-3 z-10 grid h-10 w-10 place-items-center rounded-full border-2 border-[#172a48] bg-[#f6b73c] shadow-[2px_2px_0_#172a48] sm:bottom-4 sm:right-4 sm:h-11 sm:w-11"><Wand2 size={17} /></span>
            <div aria-hidden className="absolute inset-x-6 bottom-5 h-10 rounded-[50%] border-2 border-[#172a48]/20 bg-white/50 blur-[1px] sm:inset-x-8 sm:bottom-7 sm:h-14" />
            <AnimatePresence mode="wait">
              <motion.div key={current.id} initial={{ opacity: 0, x: 20, scale: .98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -20, scale: .98 }} transition={{ duration: .24, ease: [0.23, 1, 0.32, 1] }} className="absolute inset-0">
                <motion.img src={currentSrc} alt={`Nhân vật chibi 3D ${current.name}`} initial={{ opacity: 0 }} animate={{ opacity: imageStatus === "ready" ? 1 : 0 }} transition={{ duration: .2 }} onLoad={() => setImageStatus("ready")} onError={() => setImageStatus("error")} className="absolute inset-x-0 bottom-1.5 z-[1] mx-auto h-[90%] w-[88%] object-contain drop-shadow-[0_16px_12px_rgba(23,42,72,.24)] sm:bottom-2" />
              </motion.div>
            </AnimatePresence>
            {imageStatus === "loading" && <motion.div aria-live="polite" className="absolute inset-0 z-20 grid place-items-center bg-[#fffdf6]/50 backdrop-blur-[1px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div className="flex items-center gap-2 border-2 border-[#172a48] bg-[#fffdf6] px-3 py-2 text-xs font-black shadow-[3px_3px_0_#172a48]"><LoaderCircle size={15} className="animate-spin" /> Đang gọi bạn đồng hành…</div></motion.div>}
            {imageStatus === "error" && <div role="status" className="absolute inset-x-3 bottom-3 z-20 border-2 border-[#172a48] bg-[#fffdf6]/95 px-3 py-1.5 text-center text-xs font-bold shadow-[2px_2px_0_#172a48]">Ảnh đang tải — bạn vẫn có thể chọn nhân vật này.</div>}
            <svg aria-hidden viewBox="0 0 320 180" className="pointer-events-none absolute inset-0 h-full w-full opacity-30"><path d="M5 142 C70 67 88 178 164 103 S253 41 328 78" fill="none" stroke="#172a48" strokeDasharray="5 9" strokeWidth="2" /><circle cx="164" cy="103" r="5" fill="#f6b73c" /></svg>
          </div>

          <div className="flex min-w-0 flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[9px] font-black tracking-[.16em] text-[#58708b] sm:text-[10px]">{current.role.toUpperCase()}</p>
                <span className="border border-[#172a48] bg-[#fff0b6] px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider">Hệ {current.element}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={`${current.id}-copy`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .2 }}>
                  <h3 className="mt-1.5 font-display text-3xl font-black leading-none sm:mt-2 sm:text-4xl">{current.name}</h3>
                  <p className="mt-2 inline-block border-y-2 border-dashed border-[#c9b88c] py-1 font-display text-base font-black sm:mt-2 sm:py-1.5 sm:text-lg">“{current.motto}”</p>
                  
                  {/* Stats & Description Panel */}
                  <div className="mt-2.5 rounded-lg border-2 border-[#172a48] bg-[#fffdf6] p-2.5 shadow-[2px_2px_0_#172a48]">
                    <p className="text-xs leading-relaxed text-[#476275]">{current.detail}</p>
                    <div className="mt-2 grid grid-cols-3 gap-2 border-t border-dashed border-[#d7d0bf] pt-2">
                      <div className="text-center"><span className="block font-mono text-[8px] font-bold text-[#58708b]">SỨC MẠNH</span><span className="font-display font-black text-xs text-[#ee6b4e]"><Swords size={12} className="inline mr-0.5" />{current.power}</span></div>
                      <div className="text-center"><span className="block font-mono text-[8px] font-bold text-[#58708b]">TỐC ĐỘ</span><span className="font-display font-black text-xs text-[#294f86]"><Zap size={12} className="inline mr-0.5" />{current.speed}</span></div>
                      <div className="text-center"><span className="block font-mono text-[8px] font-bold text-[#58708b]">ĐỘ TRÍ TUỆ</span><span className="font-display font-black text-xs text-[#27735a]"><Shield size={12} className="inline mr-0.5" />{current.wisdom}</span></div>
                    </div>
                  </div>

                  <span className="mt-2.5 inline-flex items-center gap-1.5 border-2 border-[#172a48] bg-[#e7f2e5] px-2.5 py-1 text-[11px] font-black shadow-[2px_2px_0_#172a48] sm:text-xs"><Sparkles size={12} className="text-[#27735a]" />{current.trait}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:gap-3">
              <button onClick={() => step(-1)} aria-label="Xem nhân vật trước" className="grid h-10 w-10 place-items-center rounded-lg border-2 border-[#172a48] bg-white shadow-[2px_2px_0_#172a48] transition hover:bg-[#eef1fb] active:scale-[.97] sm:h-11 sm:w-11"><ArrowLeft size={17} /></button>
              <button onClick={() => step(1)} aria-label="Xem nhân vật tiếp theo" className="grid h-10 w-10 place-items-center rounded-lg border-2 border-[#172a48] bg-white shadow-[2px_2px_0_#172a48] transition hover:bg-[#eef1fb] active:scale-[.97] sm:h-11 sm:w-11"><ArrowRight size={17} /></button>
              <div className="ml-auto flex max-w-[42vw] gap-1 overflow-hidden" aria-label="Tiến độ chọn nhân vật">{AVATARS.map((avatar, dotIndex) => <button key={avatar.id} onClick={() => { playAvatarSlideSound(audioEnabled); setIndex(dotIndex); }} aria-label={`Xem ${avatar.name}`} aria-current={dotIndex === index} className={`h-2.5 shrink-0 rounded-full transition-[width,background-color] duration-200 ${dotIndex === index ? "w-6 bg-[#f6b73c]" : "w-2.5 bg-[#c9b88c] hover:bg-[#58708b]"}`} />)}</div>
            </div>

            <motion.button
              onClick={handleSelect}
              disabled={isConfirming}
              animate={isConfirming ? { scale: [1, 1.04, .97, 1.02, 1], backgroundColor: ["#f6b73c", "#3e9b7a", "#f6b73c"] } : {}}
              transition={{ duration: .4 }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#172a48] bg-[#f6b73c] px-4 py-3 font-display text-sm font-black text-[#172a48] shadow-[3px_3px_0_#172a48] transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[.97] sm:mt-3.5 sm:text-base"
            >
              {isConfirming ? <>
                <CheckCircle2 size={18} className="animate-bounce text-[#172a48]" />
                <span>Đã chọn {current.name} · Vào sổ ngay!</span>
              </> : <>
                <Compass size={18} />
                <span>Chọn nhân vật này</span>
              </>}
            </motion.button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>;
}
