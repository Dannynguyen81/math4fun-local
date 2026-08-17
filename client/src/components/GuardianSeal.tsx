/** Math4Fun guardian seal — Field Journal Quest presents every companion as a collectible piece of field evidence, not a generic avatar. */
import { Lock } from "lucide-react";
import type { Guardian } from "@/game/gameData";
import { CARD_IMAGE } from "@/game/gameData";

type GuardianSealProps = {
  guardian: Guardian | undefined;
  unlocked?: boolean;
  progressLabel?: string;
  compact?: boolean;
  className?: string;
};

export default function GuardianSeal({ guardian, unlocked = false, progressLabel, compact = false, className = "" }: GuardianSealProps) {
  if (!guardian) return null;
  const fallbackImage = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = CARD_IMAGE;
  };

  return <div className={`guardian-evidence ${compact ? "guardian-evidence-compact" : ""} ${unlocked ? "" : "guardian-evidence-sealed"} ${className}`}>
    <div className="guardian-stamp">
      <img src={unlocked ? guardian.sprite : CARD_IMAGE} onError={fallbackImage} alt={unlocked ? `Guardian ${guardian.name}` : "Mẫu vật guardian chưa mở"} className="h-full w-full rounded-full object-contain" />
      <span className="stamp-seal">{unlocked ? "M4F" : "SEAL"}</span>
    </div>
    <div className="guardian-evidence-caption"><span className="guardian-taxonomy">{guardian.type}</span><span className="guardian-notches" aria-label={progressLabel ?? "Dấu niêm phong"}>{unlocked ? "● ● ●" : <><Lock size={11} /> niêm phong</>}</span></div>
  </div>;
}
