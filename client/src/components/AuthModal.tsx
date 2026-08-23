/**
 * Field Journal Quest auth artifact: an ink-stamped parchment modal with one clear next step.
 * It keeps local credentials on-device while Google OAuth only establishes the Supabase identity.
 */
import { FormEvent, useEffect, useMemo, useState } from "react";
import { BookOpen, Chrome, Compass, KeyRound, LockKeyhole, Sparkles, UserRound, X } from "lucide-react";
import { useLocation } from "wouter";
import { useGame } from "@/contexts/GameContext";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type AuthMode = "login" | "register";
type AuthModalProps = { open: boolean; initialMode?: AuthMode; onOpenChange: (open: boolean) => void };

function normalizeUsername(value: string) { return value.trim().toLocaleLowerCase("vi-VN").replace(/\s+/g, ""); }

export function AuthModal({ open, initialMode = "login", onOpenChange }: AuthModalProps) {
  const [, navigate] = useLocation();
  const { createProfile, continueWithGoogleIdentity, profiles, setLegacyProfilePassword, signIn, selectProfile } = useGame();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gradeLevel, setGradeLevel] = useState<4 | 5 | 6>(4);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const oauthCallback = useMemo(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("auth") === "google", [open]);

  useEffect(() => { if (open) { setMode(initialMode); setNotice(""); } }, [initialMode, open]);
  useEffect(() => {
    if (!open || !oauthCallback || !supabase) return;
    let cancelled = false;
    void (async () => {
      setBusy(true);
      const { data, error } = await supabase.auth.getUser();
      if (cancelled) return;
      if (error || !data.user) {
        setNotice("Không thể xác nhận phiên Google. Em hãy thử lại từ nút Google.");
      } else {
        const result = continueWithGoogleIdentity(data.user.id, String(data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? "Nhà thám hiểm"));
        setNotice(result.message);
        if (result.ok) window.setTimeout(() => onOpenChange(false), 450);
      }
      window.history.replaceState({}, "", window.location.pathname);
      navigate(window.location.pathname, { replace: true });
      setBusy(false);
    })();
    return () => { cancelled = true; };
  }, [continueWithGoogleIdentity, navigate, oauthCallback, onOpenChange, open]);

  async function handleGoogle() {
    if (!supabase) { setNotice("Đồng bộ Supabase chưa sẵn sàng trên thiết bị này."); return; }
    setBusy(true); setNotice("");
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/?auth=google` } });
    if (error) { setBusy(false); setNotice("Google chưa được cấu hình hoàn chỉnh. Phụ huynh có thể dùng tên đăng nhập và mật khẩu trong lúc này."); }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice("");
    if (mode === "register") {
      const result = await createProfile(name, "onb01", username, password, gradeLevel);
      setNotice(result.message); if (result.ok) onOpenChange(false);
    } else {
      const accountName = normalizeUsername(username);
      const target = profiles.find((entry) => entry.username === accountName);
      const result = !target
        ? { ok: false, message: "Không tìm thấy nhật ký có tên đăng nhập này trên thiết bị." }
        : target.id === "math4fun-local-admin"
          ? password === "passw@rd"
            ? (selectProfile(target.id), { ok: true, message: "Chào mừng Quản trị viên." })
            : { ok: false, message: "Mật khẩu chưa chính xác." }
          : target.authProvider === "google"
            ? { ok: false, message: "Nhật ký này được mở bằng Google. Hãy chọn nút Tiếp tục với Google." }
            : target.passwordHash ? await signIn(target.id, password) : await setLegacyProfilePassword(target.id, username, password);
      setNotice(result.message); if (result.ok) onOpenChange(false);
    }
    setBusy(false);
  }

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[min(720px,calc(100vh-2rem))] w-[min(94vw,880px)] max-w-none gap-0 overflow-y-auto rounded-none border-2 border-[#172a48] bg-[#fffdf6] p-0 text-[#172a48] shadow-[8px_8px_0_#f6b73c] sm:w-[min(92vw,880px)]" showCloseButton={false}>
      <div className="relative grid min-h-[520px] md:grid-cols-[.78fr_1.22fr]">
        <div className="paper-noise pointer-events-none absolute inset-0 opacity-40" />
        <aside className="relative overflow-hidden border-b-2 border-dashed border-[#c9b88c] bg-[#172a48] p-6 text-white md:border-b-0 md:border-r-2 md:p-8">
          <button onClick={() => onOpenChange(false)} aria-label="Đóng cửa sổ xác thực" className="absolute right-4 top-4 grid h-9 w-9 place-items-center border border-[#f6b73c] text-[#f6b73c] transition hover:bg-[#f6b73c] hover:text-[#172a48] active:scale-[.97]"><X size={18} /></button>
          <div className="relative z-10"><span className="inline-flex items-center gap-2 border border-[#f6b73c] px-2 py-1 font-mono text-[9px] font-black tracking-[.16em] text-[#f6b73c]"><Compass size={13} /> FIELD GATE · 01</span>
            <DialogTitle className="mt-8 font-display text-4xl font-black leading-[.92] tracking-tight text-white">Mở sổ<br />hành trình.</DialogTitle>
            <DialogDescription className="mt-4 max-w-xs text-sm leading-relaxed text-[#d5dfed]">Mỗi nhà thám hiểm giữ một dấu chân riêng. Tiến độ học và guardian của em luôn được ghi theo nhật ký này.</DialogDescription>
            <div className="mt-8 border-2 border-[#f6b73c] bg-[#fff8da] p-4 text-[#172a48] shadow-[4px_4px_0_rgba(246,183,60,.32)]"><span className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#172a48] bg-[#f6b73c]"><Sparkles size={18} /></span><p className="mt-3 font-display text-xl font-black leading-tight">Chọn avatar sau khi ký tên</p><p className="mt-2 text-xs leading-relaxed text-[#476275]">10 nhân vật chibi 3D đang chờ trở thành bạn đồng hành đầu tiên của em.</p></div>
          </div>
          <svg aria-hidden viewBox="0 0 300 170" className="pointer-events-none absolute -bottom-9 -left-8 h-52 w-[120%] opacity-60"><path d="M0 112 C63 26 110 168 176 84 S262 28 330 64" fill="none" stroke="#f6b73c" strokeDasharray="5 8" strokeWidth="2" /><circle cx="176" cy="84" r="8" fill="#f6b73c" /></svg>
          <span className="absolute bottom-5 right-6 font-mono text-[9px] font-black tracking-[.17em] text-[#b9cae4]">M4F · LOCAL-FIRST</span>
        </aside>
        <section className="relative z-10 p-6 sm:p-8">
          <div className="flex items-center justify-between border-b-2 border-dashed border-[#c9b88c] pb-4"><div><p className="font-mono text-[10px] font-black tracking-[.15em] text-[#58708b]">NHẬT KÝ CÁ NHÂN</p><h2 className="mt-1 font-display text-3xl font-black">{mode === "login" ? "Đăng nhập" : "Đăng ký"}</h2></div><BookOpen className="text-[#f6b73c]" size={28} /></div>
          <div role="tablist" aria-label="Chọn hình thức xác thực" className="mt-5 grid grid-cols-2 border-2 border-[#172a48] bg-[#fff8da] p-1"><button role="tab" aria-selected={mode === "login"} onClick={() => { setMode("login"); setNotice(""); }} className={`py-2 text-sm font-black transition ${mode === "login" ? "bg-[#172a48] text-white" : "hover:bg-[#fff0b6]"}`}>Đăng nhập</button><button role="tab" aria-selected={mode === "register"} onClick={() => { setMode("register"); setNotice(""); }} className={`py-2 text-sm font-black transition ${mode === "register" ? "bg-[#172a48] text-white" : "hover:bg-[#fff0b6]"}`}>Đăng ký</button></div>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {mode === "register" && <label className="block text-sm font-bold">Tên hiển thị<input value={name} onChange={(event) => setName(event.target.value)} maxLength={22} required placeholder="Ví dụ: Violet" className="mt-1.5 block w-full border-2 border-[#172a48] bg-white px-3 py-2.5 outline-none transition placeholder:text-[#8c9bab] focus:bg-[#fff8da]" /></label>}
            <label className="block text-sm font-bold">Tên đăng nhập<div className="relative mt-1.5"><UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58708b]" size={16} /><input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" maxLength={18} required placeholder="violet.math" className="block w-full border-2 border-[#172a48] bg-white py-2.5 pl-10 pr-3 outline-none transition placeholder:text-[#8c9bab] focus:bg-[#fff8da]" /></div></label>
            <label className="block text-sm font-bold">Mật khẩu<div className="relative mt-1.5"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58708b]" size={16} /><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} maxLength={64} required placeholder="Từ 6 ký tự trở lên" className="block w-full border-2 border-[#172a48] bg-white py-2.5 pl-10 pr-3 outline-none transition placeholder:text-[#8c9bab] focus:bg-[#fff8da]" /></div></label>
            {mode === "register" && <label className="block text-sm font-bold">Lớp học<select value={gradeLevel} onChange={(event) => setGradeLevel(Number(event.target.value) as 4 | 5 | 6)} className="mt-1.5 block w-full border-2 border-[#172a48] bg-white px-3 py-2.5 outline-none focus:bg-[#fff8da]"><option value={4}>Lớp 4 · Đang mở hành trình</option><option value={5} disabled>Lớp 5 · Sắp ra mắt</option><option value={6} disabled>Lớp 6 · Sắp ra mắt</option></select></label>}
            {notice && <p role="status" className="border-l-4 border-[#f6b73c] bg-[#fff8da] px-3 py-2 text-sm font-bold leading-relaxed">{notice}</p>}
            <button disabled={busy} className="flex w-full items-center justify-center gap-2 border-2 border-[#172a48] bg-[#f6b73c] px-4 py-3 font-black shadow-[3px_3px_0_#172a48] transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[.97] disabled:cursor-wait disabled:opacity-60"><KeyRound size={17} />{busy ? "Đang mở nhật ký…" : mode === "login" ? "Vào hành trình" : "Tạo nhật ký"}</button>
          </form>
          <div className="my-5 flex items-center gap-3 text-[10px] font-black tracking-[.12em] text-[#58708b]"><i className="h-px flex-1 bg-[#c9b88c]" />HOẶC<i className="h-px flex-1 bg-[#c9b88c]" /></div>
          <button type="button" disabled={busy} onClick={handleGoogle} className="flex w-full items-center justify-center gap-3 border-2 border-[#172a48] bg-white px-4 py-3 text-sm font-black shadow-[2px_2px_0_#c9b88c] transition hover:bg-[#eef1fb] active:scale-[.97] disabled:opacity-60"><span className="grid h-5 w-5 place-items-center rounded-full border border-[#172a48] bg-[#fff8da] font-black text-[#294f86]">G</span>Tiếp tục với Google<Chrome size={16} /></button>
          <p className="mt-4 text-center text-xs leading-relaxed text-[#58708b]">Tên đăng nhập và mật khẩu chỉ được lưu trên thiết bị này. Google chỉ dùng để xác thực và đồng bộ tiến độ khi phụ huynh bật kết nối.</p>
        </section>
      </div>
    </DialogContent>
  </Dialog>;
}
