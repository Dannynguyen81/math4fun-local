/**
 * Field Journal Quest visual reminder: companion portraits are tangible field specimens—paper-friendly, indigo-framed, and always paired with the learner's identity.
 */
import type { AvatarId } from "@/contexts/GameContext";

export const avatarImageById: Record<AvatarId, string> = {
  b01: "/manus-storage/math4fun-avatar-b01_6f565763.png", b02: "/manus-storage/math4fun-avatar-b02_94a2f9b6.png", b03: "/manus-storage/math4fun-avatar-b03_de75ed1e.png", b04: "/manus-storage/math4fun-avatar-b04_89e025bd.png", b05: "/manus-storage/math4fun-avatar-b05_f12579a9.png",
  b06: "/manus-storage/math4fun-avatar-b06_6d7df86d.png", b07: "/manus-storage/math4fun-avatar-b07_378f921a.png", b08: "/manus-storage/math4fun-avatar-b08_20f38f4b.png", b09: "/manus-storage/math4fun-avatar-b09_f0041bd7.png", b10: "/manus-storage/math4fun-avatar-b10_37db42f1.png",
  g01: "/manus-storage/math4fun-avatar-g01_0c3aa29a.png", g02: "/manus-storage/math4fun-avatar-g02_4dfa425d.png", g03: "/manus-storage/math4fun-avatar-g03_efd04fca.png", g04: "/manus-storage/math4fun-avatar-g04_b6eb05c9.png", g05: "/manus-storage/math4fun-avatar-g05_e99e6afc.png",
  g06: "/manus-storage/math4fun-avatar-g06_310e75f1.png", g07: "/manus-storage/math4fun-avatar-g07_000ffec0.png", g08: "/manus-storage/math4fun-avatar-g08_37fd713b.png", g09: "/manus-storage/math4fun-avatar-g09_c50a1331.png", g10: "/manus-storage/math4fun-avatar-g10_262e51c0.png",
  compass: "/manus-storage/math4fun-avatar-compass_c1cebf77.png", ember: "/manus-storage/math4fun-avatar-ember_095098ee.png", tide: "/manus-storage/math4fun-avatar-tide_cc836336.png", leaf: "/manus-storage/math4fun-avatar-leaf_b35efd62.png",
};

type PlayerAvatarProps = {
  avatar: AvatarId;
  name?: string;
  outfitId?: string;
  trailId?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  compact?: boolean;
};

const sizeClass = { sm: "h-10 w-10", md: "h-14 w-14", lg: "h-28 w-28" };

export function PlayerAvatar({ avatar, name = "Companion", outfitId, trailId, size = "md", className = "", compact = false }: PlayerAvatarProps) {
  const hasOutfit = Boolean(outfitId);
  const hasTrail = Boolean(trailId);
  return <span className={`relative inline-grid shrink-0 place-items-center ${sizeClass[size]} ${className}`}>
    {hasTrail && <span aria-hidden="true" className="absolute -bottom-1 -left-1 -right-1 h-2 rotate-[-3deg] border-y border-[#172a48] bg-[#f6b73c]/75"/>}
    <span className={`relative grid h-full w-full place-items-center overflow-hidden rounded-full border-2 border-[#172a48] bg-[#fffdf6] ${hasOutfit ? "shadow-[3px_3px_0_#f6b73c]" : "shadow-[2px_2px_0_#172a48]"}`}>
      <img src={avatarImageById[avatar]} alt={name} className="h-full w-full object-cover" />
      {hasOutfit && <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#172a48]/45 to-transparent"/>}
    </span>
    {!compact && hasOutfit && <span aria-hidden="true" className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full border border-[#172a48] bg-[#f6b73c] text-[9px] font-black">✦</span>}
  </span>;
}
