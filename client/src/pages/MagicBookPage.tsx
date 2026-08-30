/** Magic Book — the five-element spell archive, with one 3D relic and five unlockable spells per element. */
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "wouter";
import {
  Award,
  BookMarked,
  Check,
  ChevronRight,
  Lock,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { getGuardian } from "@/game/gameData";
import {
  MAGIC_BOOK_ELEMENT_BY_KEY,
  MAGIC_BOOK_ELEMENTS,
  MAGIC_BOOK_SPELLS,
  getMagicBookElement,
  getMagicBookLevel,
  getMagicBookProgress,
  isMagicBookLevelUnlocked,
  type MagicBookElement,
} from "@/game/magicCanon";
import { playElementSound } from "@/lib/magicAudio";

function storedXp(
  element: (typeof MAGIC_BOOK_ELEMENTS)[number],
  values: Partial<Record<string, number>>
) {
  // The second and third lookups keep old local profiles readable during the
  // transition from the retired Độc branch to the canonical Mộc branch.
  return (
    values[element.wire] ??
    values[element.key] ??
    (element.key === "mộc" ? (values["độc"] ?? 0) : 0)
  );
}

export default function MagicBookPage() {
  const {
    profile,
    audioEnabled,
    magicBookWatchedCount,
    hasMagicBookAchievement,
    elementXp,
    weeklyMagicQuest,
  } = useGame();
  const [selectedElement, setSelectedElement] =
    useState<MagicBookElement>("hỏa");

  const unlockedByElement = useMemo(() => {
    const elementMap = new Map<MagicBookElement, string>();
    for (const guardianId of profile?.collectedGuardianIds ?? []) {
      const guardian = getGuardian(guardianId);
      const element = getMagicBookElement(guardian?.element);
      if (element && !elementMap.has(element))
        elementMap.set(element, guardianId);
    }
    return elementMap;
  }, [profile?.collectedGuardianIds]);

  useEffect(() => {
    if (unlockedByElement.has(selectedElement)) return;
    const firstUnlocked = MAGIC_BOOK_ELEMENTS.find(element =>
      unlockedByElement.has(element.key)
    );
    if (firstUnlocked) setSelectedElement(firstUnlocked.key);
  }, [selectedElement, unlockedByElement]);

  const selected = MAGIC_BOOK_ELEMENT_BY_KEY[selectedElement];
  const selectedGuardian = getGuardian(
    unlockedByElement.get(selectedElement) ?? ""
  );
  const selectedUnlocked = Boolean(selectedGuardian);
  const selectedXp = storedXp(selected, elementXp);
  const selectedLevel = selectedUnlocked ? getMagicBookLevel(selectedXp) : 0;
  const selectedProgress = selectedUnlocked
    ? getMagicBookProgress(selectedXp)
    : 0;
  const selectedSpell =
    MAGIC_BOOK_SPELLS[selectedElement][Math.max(0, selectedLevel - 1)];
  const questElement = weeklyMagicQuest
    ? getMagicBookElement(weeklyMagicQuest.element)
    : undefined;

  const cssVars = {
    "--magic-color": selected.color,
    "--magic-soft": selected.softColor,
  } as CSSProperties;

  return (
    <section className="magic-book-page magic-book-v2">
      <header className="magic-book-cover">
        <div>
          <p className="section-kicker">
            <BookMarked size={14} /> MAGIC ARCHIVE · 5 × 5
          </p>
          <h1 className="font-display text-4xl font-black tracking-tight">
            Sổ Phép Ngũ Hành
          </h1>
          <p>
            Mỗi hệ có một di vật 3D riêng và 5 phép để giải mã. Thu phục
            guardian, tích lũy XP đúng cách rồi mở từng bậc phép mới.
          </p>
        </div>
        <div className="magic-book-count">
          <span>{magicBookWatchedCount}</span>
          <small>/ 5 hệ đã định danh</small>
          <b>25 phép trong kho</b>
        </div>
      </header>

      <div className="magic-book-route">
        <span className="field-tag">TUYẾN GIẢI MÃ</span>
        <i />
        <b>
          {magicBookWatchedCount}/5 hệ · {magicBookWatchedCount * 5}/25 phép
        </b>
        <i />
        <small>
          {hasMagicBookAchievement
            ? "Đủ bộ Ngũ Ấn"
            : "Mỗi guardian mở một nhánh phép"}
        </small>
      </div>

      <section className="magic-book-dashboard">
        <article className="magic-spell-preview" style={cssVars}>
          <div
            className={`magic-spell-art ${selectedUnlocked ? "is-open" : "is-locked"}`}
          >
            <span
              className="magic-spell-ring magic-spell-ring-one"
              aria-hidden="true"
            />
            <span
              className="magic-spell-ring magic-spell-ring-two"
              aria-hidden="true"
            />
            <img
              src={selected.artwork}
              alt={`Di vật phép hệ ${selected.label}`}
            />
            <span className="magic-spell-level-stamp">
              {selectedUnlocked ? `BẬC ${selectedLevel}` : "?"}
            </span>
          </div>
          <div className="magic-spell-copy">
            <div className="magic-spell-eyebrow">
              <span className="field-tag" style={{ color: selected.color }}>
                <Sparkles size={13} /> {selected.label.toUpperCase()} ·{" "}
                {selected.shortLabel}
              </span>
              <b>
                {selectedUnlocked ? `${selectedLevel}/5 bậc` : "NIÊM PHONG"}
              </b>
            </div>
            <h2>
              {selectedUnlocked
                ? selectedSpell.name
                : `${selected.label} đang niêm phong`}
            </h2>
            <p className="magic-spell-intro">
              {selectedUnlocked
                ? selectedSpell.description
                : `Thu phục một guardian hệ ${selected.label} để mở di vật 3D và bắt đầu giải mã nhánh phép này.`}
            </p>
            {selectedUnlocked && selectedGuardian && (
              <p className="magic-spell-guardian">
                Guardian giữ ấn: <b>{selectedGuardian.name}</b> ·{" "}
                {selected.intro}
              </p>
            )}
            <div className="magic-xp-meter">
              <div>
                <b>
                  {selectedUnlocked
                    ? `${selectedXp} XP hệ ${selected.label}`
                    : "Chưa có XP"}
                </b>
                <span>
                  {selectedUnlocked
                    ? selectedLevel === 5
                      ? "Đã mở đủ 5 bậc phép"
                      : `${selectedProgress}/100 đến bậc tiếp theo`
                    : "0/5 bậc đã mở"}
                </span>
              </div>
              <div className="magic-xp-track">
                <i style={{ width: `${selectedProgress}%` }} />
              </div>
            </div>
            {selectedUnlocked && (
              <div className="magic-spell-effect">
                <span>HIỆU ỨNG BẬC HIỆN TẠI</span>
                <b>{selectedSpell.effect}</b>
              </div>
            )}
            <button
              type="button"
              disabled={!selectedUnlocked}
              onClick={() =>
                playElementSound(selected.wire, audioEnabled, "cast")
              }
              className="magic-sound-button"
            >
              <Volume2 size={17} /> Nghe âm phép{" "}
              {selectedUnlocked ? "· đã mở" : "· cần guardian"}
            </button>
          </div>
        </article>

        <aside className="magic-quest-card">
          <div className="magic-quest-icon">
            <ScrollText size={19} />
          </div>
          <p className="section-kicker">NHIỆM VỤ TUẦN</p>
          {weeklyMagicQuest && questElement ? (
            <>
              <h2>{weeklyMagicQuest.title}</h2>
              <p>{weeklyMagicQuest.note}</p>
              <div className="magic-quest-progress">
                <b>
                  {weeklyMagicQuest.usedCount}/{weeklyMagicQuest.target}
                </b>
                <span>
                  {MAGIC_BOOK_ELEMENT_BY_KEY[questElement].shortLabel}
                </span>
              </div>
              <div className="magic-quest-track">
                <i
                  style={{
                    width: `${Math.min(100, (weeklyMagicQuest.usedCount / weeklyMagicQuest.target) * 100)}%`,
                  }}
                />
              </div>
              <strong>
                {weeklyMagicQuest.rewardClaimed
                  ? "Phần thưởng đã ghi vào hồ sơ"
                  : `Thắng Boss để nhận +${weeklyMagicQuest.rewardXp} XP`}
              </strong>
            </>
          ) : (
            <p>Hãy mở một hồ sơ để nhận nhiệm vụ giải mã theo tuần.</p>
          )}
        </aside>
      </section>

      <section className="magic-element-library" aria-label="Năm hệ phép">
        <div className="magic-library-heading">
          <div>
            <p className="section-kicker">BẢN ĐỒ DI VẬT · 05 NHÁNH</p>
            <h2>Chọn một hệ để xem phép đang mở</h2>
          </div>
          <p>
            Phép mới xuất hiện theo từng mốc 100 XP hệ. Cả năm nhánh đều có đúng
            5 bậc.
          </p>
        </div>
        <div className="magic-element-grid">
          {MAGIC_BOOK_ELEMENTS.map(element => {
            const guardian = getGuardian(
              unlockedByElement.get(element.key) ?? ""
            );
            const unlocked = Boolean(guardian);
            const xp = storedXp(element, elementXp);
            const level = unlocked ? getMagicBookLevel(xp) : 0;
            const selectedCard = element.key === selectedElement;
            return (
              <button
                type="button"
                key={element.key}
                onClick={() => setSelectedElement(element.key)}
                className={`magic-element-card ${selectedCard ? "is-selected" : ""} ${unlocked ? "is-open" : "is-locked"}`}
                style={
                  {
                    "--magic-color": element.color,
                    "--magic-soft": element.softColor,
                  } as CSSProperties
                }
              >
                <span className="magic-element-art">
                  <img src={element.artwork} alt="" aria-hidden="true" />
                  <b>{unlocked ? `BẬC ${level}` : "?"}</b>
                </span>
                <span className="magic-element-copy">
                  <b>
                    {element.label} <small>{element.shortLabel}</small>
                  </b>
                  <span>
                    {unlocked ? guardian?.name : "Cần thu phục guardian"}
                  </span>
                  <i>
                    <em
                      style={{ width: `${unlocked ? (level / 5) * 100 : 0}%` }}
                    />
                  </i>
                  <small>
                    {unlocked ? `${level}/5 phép đã mở` : "0/5 phép đã mở"}
                  </small>
                </span>
                {unlocked ? <Sparkles size={16} /> : <Lock size={15} />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="magic-level-sheet" style={cssVars}>
        <div className="magic-library-heading">
          <div>
            <p className="section-kicker">
              CÂY PHÉP · {selected.label.toUpperCase()}
            </p>
            <h2>5 bậc giải mã trong một hệ</h2>
          </div>
          <p>
            {selectedUnlocked
              ? "Bậc sáng là phép đã mở; bậc mờ đang chờ XP hệ."
              : "Các bậc sẽ sáng khi em thu phục guardian thuộc hệ này."}
          </p>
        </div>
        <div className="magic-level-grid">
          {MAGIC_BOOK_SPELLS[selectedElement].map(spell => {
            const unlocked =
              selectedUnlocked &&
              isMagicBookLevelUnlocked(selectedXp, spell.level);
            const current = unlocked && spell.level === selectedLevel;
            return (
              <article
                key={spell.level}
                className={`magic-level-card ${unlocked ? "is-open" : "is-locked"} ${current ? "is-current" : ""}`}
              >
                <div className="magic-level-card-top">
                  <span>
                    {unlocked ? <Check size={15} /> : <Lock size={14} />}
                  </span>
                  <b>BẬC {spell.level}</b>
                  <small>
                    {spell.unlockXp === 0 ? "MỞ SẴN" : `${spell.unlockXp} XP`}
                  </small>
                </div>
                <h3>{unlocked ? spell.name : "Phép chưa giải mã"}</h3>
                <p>
                  {unlocked
                    ? spell.title
                    : `Tích lũy ${spell.unlockXp} XP hệ ${selected.label}`}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className={`magic-achievement ${hasMagicBookAchievement ? "is-earned" : ""}`}
      >
        <Award size={28} />
        <div>
          <p className="section-kicker">HUY HIỆU HỒ SƠ</p>
          <h2>
            {hasMagicBookAchievement ? "Nhà Lưu Trữ Ngũ Ấn" : "Ngũ Ấn Chờ Mở"}
          </h2>
          <p>
            {hasMagicBookAchievement
              ? "Em đã định danh đủ 5 hệ và mở toàn bộ bản đồ 25 phép."
              : `Đã định danh ${magicBookWatchedCount}/5 hệ. Mỗi hệ mở một di vật 3D và 5 bậc phép.`}
          </p>
        </div>
        <span>
          {hasMagicBookAchievement ? (
            <ShieldCheck size={28} />
          ) : (
            `${magicBookWatchedCount}/5`
          )}
        </span>
      </section>

      <section className="magic-matchup-sheet">
        <div className="magic-matchup-heading">
          <div>
            <p className="section-kicker">BẢNG TƯƠNG KHẮC · NGŨ HÀNH</p>
            <h2>Đọc thế trận trước khi tung phép</h2>
          </div>
          <p>
            Đây là luật chiến thuật trong game; đáp án Toán chính xác vẫn là
            điều kiện để phép được kích hoạt.
          </p>
        </div>
        <div className="magic-matchup-list">
          {MAGIC_BOOK_ELEMENTS.map(element => {
            const strong = MAGIC_BOOK_ELEMENT_BY_KEY[element.strongAgainst];
            const weak = MAGIC_BOOK_ELEMENT_BY_KEY[element.weakAgainst];
            return (
              <article
                key={element.key}
                style={{ "--magic-color": element.color } as CSSProperties}
              >
                <span className="magic-sigil-mark">{element.glyph}</span>
                <div>
                  <b>{element.shortLabel}</b>
                  <p>
                    <em>Khắc:</em> {strong.shortLabel} · <em>Bị khắc:</em>{" "}
                    {weak.shortLabel}
                  </p>
                  <small>{element.matchupNote}</small>
                </div>
              </article>
            );
          })}
        </div>
        <Link
          href={profile ? "/training" : "/start"}
          className="magic-matchup-cta"
        >
          {profile ? "Đến Huấn luyện để thử kèo" : "Ký nhật ký để mở phép"}{" "}
          <ChevronRight size={16} />
        </Link>
      </section>
    </section>
  );
}
