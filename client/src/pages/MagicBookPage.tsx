/**
 * Field Journal Quest — Magic Book page.
 * A tactile gallery: videos and sound replay only after their guardian has been collected.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { BookMarked, Lock, Play, Sparkles, Volume2 } from "lucide-react";
import { GUARDIANS, MAGIC_MEDIA, type ElementName } from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";
import { playElementSound } from "@/lib/magicAudio";

const ELEMENT_ORDER: ElementName[] = ["sấm", "lửa", "nước", "độc", "gió", "đất"];
const ELEMENT_COLORS: Record<ElementName, string> = { "sấm": "#f6b73c", "lửa": "#ee6b4e", "nước": "#55a9dd", "độc": "#8e69ad", "gió": "#3e9b7a", "đất": "#b17a3d" };
const ELEMENT_SIGILS: Record<ElementName, string> = { "sấm": "ϟ", "lửa": "✦", "nước": "≈", "độc": "☾", "gió": "≋", "đất": "◆" };

export default function MagicBookPage() {
  const { profile, audioEnabled } = useGame();
  const unlockedByElement = useMemo(() => {
    const elementMap = new Map<ElementName, string>();
    for (const guardianId of profile?.collectedGuardianIds ?? []) {
      const guardian = GUARDIANS.find((item) => item.id === guardianId);
      if (guardian && !elementMap.has(guardian.element)) elementMap.set(guardian.element, guardian.id);
    }
    return elementMap;
  }, [profile?.collectedGuardianIds]);
  const [selectedElement, setSelectedElement] = useState<ElementName>("sấm");
  const selectedUnlocked = unlockedByElement.has(selectedElement);
  const selectedMedia = MAGIC_MEDIA[selectedElement];
  const selectedGuardian = GUARDIANS.find((item) => item.id === unlockedByElement.get(selectedElement));

  useEffect(() => {
    const firstUnlocked = ELEMENT_ORDER.find((element) => unlockedByElement.has(element));
    if (firstUnlocked && !unlockedByElement.has(selectedElement)) setSelectedElement(firstUnlocked);
  }, [selectedElement, unlockedByElement]);

  return (
    <section className="magic-book-page">
      <header className="magic-book-cover">
        <div><p className="section-kicker"><BookMarked size={14} /> LOCAL MAGIC ARCHIVE</p><h1 className="font-display text-4xl font-black tracking-tight">Sổ Phép</h1><p>Ghi lại hoạt ảnh và âm thanh của các hệ em đã thật sự thu phục. Mỗi dấu niêm phong cần một guardian đồng hành để mở.</p></div>
        <div className="magic-book-count"><span>{unlockedByElement.size}</span><small>/ 6 hệ đã mở</small></div>
      </header>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="magic-sigil-grid" aria-label="Các dấu ấn nguyên tố">
          {ELEMENT_ORDER.map((element) => {
            const guardian = GUARDIANS.find((item) => item.id === unlockedByElement.get(element));
            const unlocked = Boolean(guardian);
            const selected = element === selectedElement;
            return <button key={element} disabled={!unlocked} onClick={() => setSelectedElement(element)} className={`magic-sigil-card ${selected ? "is-selected" : ""} ${unlocked ? "is-unlocked" : "is-locked"}`} style={{ "--magic-color": ELEMENT_COLORS[element] } as React.CSSProperties}>
              <span className="magic-sigil-mark">{ELEMENT_SIGILS[element]}</span><span className="magic-sigil-copy"><b>{MAGIC_MEDIA[element].shortLabel}</b><small>{unlocked ? guardian?.name : "Cần thu phục guardian"}</small></span>{unlocked ? <Sparkles size={16} /> : <Lock size={15} />}
            </button>;
          })}
        </div>

        <aside className="magic-book-viewer" style={{ "--magic-color": ELEMENT_COLORS[selectedElement] } as React.CSSProperties}>
          {selectedUnlocked && selectedGuardian ? <><div className="magic-viewer-heading"><span className="field-tag"><Sparkles size={13} /> ĐÃ MỞ</span><h2>{selectedMedia.title}</h2><p>{selectedMedia.note} Guardian giữ dấu này: <b>{selectedGuardian.name}</b>.</p></div><video key={selectedElement} src={selectedMedia.src} controls loop playsInline preload="metadata" aria-label={`Video ${selectedMedia.title}`} /><button onClick={() => playElementSound(selectedElement, audioEnabled, "cast")} className="magic-sound-button"><Volume2 size={17} /> Nghe lại âm phép</button></> : <div className="magic-locked-viewer"><Lock size={28} /><h2>Trang này còn niêm phong</h2><p>Thu phục một guardian thuộc hệ {MAGIC_MEDIA[selectedElement].shortLabel.toLowerCase()} để xem lại clip và nghe âm phép.</p>{profile ? <Link href="/map" className="magic-sound-button"><Play size={17} /> Đi đến Bản đồ học</Link> : <Link href="/start" className="magic-sound-button"><Play size={17} /> Tạo hồ sơ thám hiểm</Link>}</div>}
        </aside>
      </div>
    </section>
  );
}
