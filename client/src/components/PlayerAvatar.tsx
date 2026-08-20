/**
 * Field Journal Quest visual reminder: companion portraits are tangible field specimens—paper-friendly, indigo-framed, and always paired with the learner's identity.
 */
import type { AvatarId } from "@/contexts/GameContext";

const createFallbackChibi = (label: string, skin: string, hair: string, outfit: string, accent: string, accessory: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" role="img" aria-label="${label}"><rect width="200" height="280" rx="18" fill="#f7eadc"/><path d="M24 244c24-18 128-18 152 0v36H24z" fill="#dceef6"/><path d="M74 227h20v30H74zM108 227h20v30h-20z" fill="${skin}"/><path d="M66 252h31v10H61zM104 252h31v10h-35z" fill="#172a48"/><path d="M53 132c-18 14-22 45-8 56l18-13-3-28zM147 132c18 14 22 45 8 56l-18-13 3-28z" fill="${skin}"/><path d="M61 132h78l13 105H48z" fill="${outfit}"/><path d="M67 142h66v27H67z" fill="${accent}"/><circle cx="100" cy="93" r="48" fill="${skin}"/><path d="M48 97c0-47 22-69 54-69 38 0 57 25 53 73l-17-12-6-34-10 18-8-17c-17 17-38 25-66 28z" fill="${hair}"/><path d="M48 102c3 32 16 49 31 54l-4-25 16 12 10-20 12 20 13-12-3 26c21-9 30-29 30-55z" fill="${hair}" opacity=".94"/><circle cx="82" cy="98" r="5" fill="#172a48"/><circle cx="119" cy="98" r="5" fill="#172a48"/><path d="M87 119q13 11 27 0" fill="none" stroke="#a54539" stroke-width="4" stroke-linecap="round"/>${accessory}<path d="M71 184h58" stroke="#172a48" stroke-width="4" stroke-linecap="round"/><text x="100" y="274" text-anchor="middle" fill="#172a48" font-family="sans-serif" font-size="10" font-weight="700">M4F · FIELD TAG</text></svg>`)}`;

export const avatarImageById: Record<AvatarId, string> = {
  b01: "/manus-storage/math4fun-chibi-b01_18872574.png", b02: "/manus-storage/math4fun-chibi-b02_adfc005d.png", b03: "/manus-storage/math4fun-chibi-b03_28e75fe3.png", b04: "/manus-storage/math4fun-chibi-b04_d0ffd187.png", b05: "/manus-storage/math4fun-chibi-b05_1976cd4e.png",
  b06: "/manus-storage/math4fun-chibi-b06_f7f26c75.png", b07: "/manus-storage/math4fun-chibi-b07_9285680e.png", b08: "/manus-storage/math4fun-chibi-b08_f8bbedf9.png", b09: "/manus-storage/math4fun-chibi-b09_65c6a61e.png", b10: "/manus-storage/math4fun-chibi-b10_fe31118e.png",
  g01: "/manus-storage/math4fun-chibi-g01_0b9b9e78.png", g02: "/manus-storage/math4fun-chibi-g02_61b90e66.png", g03: "/manus-storage/math4fun-chibi-g03_3430d668.png", g04: "/manus-storage/math4fun-chibi-g04_311f202e.png", g05: "/manus-storage/math4fun-chibi-g05_0c188153.png",
  g06: "/manus-storage/math4fun-chibi-g06_5bc00e76.png", g07: createFallbackChibi("Thư Kim Chỉ", "#efb18d", "#25324d", "#7658a6", "#f5c54c", "<circle cx=\"70\" cy=\"95\" r=\"15\" fill=\"none\" stroke=\"#172a48\" stroke-width=\"3\"/><circle cx=\"128\" cy=\"95\" r=\"15\" fill=\"none\" stroke=\"#172a48\" stroke-width=\"3\"/><path d=\"M85 95h28\" stroke=\"#172a48\" stroke-width=\"3\"/><path d=\"M44 48l17-10 13 15-18 9z\" fill=\"#f5c54c\"/>"), g08: createFallbackChibi("Lan Sao Băng", "#d99775", "#402d42", "#cf6c45", "#f6b73c", "<path d=\"M144 55l8 8 12-3-7 11 5 12-13-5-10 8 1-14-10-8 14-1z\" fill=\"#f6b73c\"/><path d=\"M91 104q10-7 20 0\" fill=\"none\" stroke=\"#172a48\" stroke-width=\"2\"/>"), g09: createFallbackChibi("Yến Vỏ Sò", "#c98769", "#472d29", "#2e8f86", "#d5dfed", "<path d=\"M49 56q-13 12-4 28 16-10 27-7\" fill=\"#472d29\"/><path d=\"M136 50l13 11-12 8-11-9z\" fill=\"#ee6b4e\"/><path d=\"M77 178h46v47H77z\" fill=\"#2e8f86\"/>"), g10: "/manus-storage/math4fun-chibi-g10_d0dffbfc.png",
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
      <img src={avatarImageById[avatar]} alt={name} className="h-full w-full object-contain p-0.5" />
      {hasOutfit && <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#172a48]/45 to-transparent"/>}
    </span>
    {!compact && hasOutfit && <span aria-hidden="true" className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full border border-[#172a48] bg-[#f6b73c] text-[9px] font-black">✦</span>}
  </span>;
}
