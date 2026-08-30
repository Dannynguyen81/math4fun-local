/**
 * Math4Fun Fantasy Landing: cinematic indigo world, tactile expedition artifacts, and a bespoke Math4Fun wordmark.
 * The route is a living RPG invitation—not a generic feature grid—and signed-in learners still see their real next step.
 */
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Compass,
  Flame,
  Gem,
  LockKeyhole,
  MapPinned,
  Shield,
  Sparkles,
  Star,
  Swords,
  Trophy,
  Wand2,
} from "lucide-react";
import { PLAYER_XP_PER_LEVEL, STATIONS } from "@/game/gameData";
import { useGame } from "@/contexts/GameContext";
import { useAuthGate } from "@/components/AuthGate";

const HERO_ART = "/media/math4fun-rpg-hero.png";
const MAP_ART = "/media/math4fun-world-map.png";
const COMPANION_ART = "/media/math4fun-guardian-companion.png";

function Math4FunWordmark() {
  return (
    <div className="math4fun-wordmark" aria-label="Math4Fun">
      <span className="math4fun-wordmark-math">Math</span>
      <span className="math4fun-wordmark-four">4</span>
      <span className="math4fun-wordmark-fun">Fun</span>
      <span className="math4fun-wordmark-note">HỌC · KHÁM PHÁ · LÊN CẤP</span>
    </div>
  );
}

function StatChip({
  icon: Icon,
  title,
  copy,
  tone = "gold",
}: {
  icon: typeof Gem;
  title: string;
  copy: string;
  tone?: "gold" | "mint" | "coral";
}) {
  return (
    <div className={`landing-stat-chip landing-stat-${tone}`}>
      <span>
        <Icon size={17} aria-hidden="true" />
      </span>
      <p>
        <b>{title}</b>
        <small>{copy}</small>
      </p>
    </div>
  );
}

function WorldRoute({
  signed,
  nextTitle,
  mastered,
}: {
  signed: boolean;
  nextTitle?: string;
  mastered: number;
}) {
  const labels = ["Khởi đầu", "Trạm số", "Rừng hình", "Cổng Boss"];
  return (
    <section className="landing-map-panel" aria-labelledby="world-map-title">
      <div className="landing-panel-heading">
        <div>
          <p className="landing-eyebrow">
            <MapPinned size={14} /> BẢN ĐỒ THẾ GIỚI
          </p>
          <h2 id="world-map-title">Một phép tính, một dấu chân mới.</h2>
        </div>
        <Link href="/map" className="landing-inline-link">
          Xem bản đồ <ArrowRight size={15} />
        </Link>
      </div>
      <div className="landing-map-art">
        <img src={MAP_ART} alt="Bản đồ fantasy của hành trình Math4Fun" />
        <div
          className="landing-map-pulse landing-map-pulse-one"
          aria-hidden="true"
        >
          <i />
        </div>
        <div
          className="landing-map-pulse landing-map-pulse-two"
          aria-hidden="true"
        >
          <i />
        </div>
        <div
          className="landing-map-pulse landing-map-pulse-three"
          aria-hidden="true"
        >
          <i />
        </div>
        <div className="landing-map-stamp">
          <Compass size={18} />
          <span>
            20
            <br />
            TUYẾN
          </span>
        </div>
      </div>
      <div className="landing-route-steps">
        {labels.map((label, index) => (
          <div
            className={signed && index === 1 ? "is-current" : ""}
            key={label}
          >
            <span>{index + 1}</span>
            <b>{label}</b>
          </div>
        ))}
      </div>
      <p className="landing-map-caption">
        {signed
          ? `${mastered}/20 trạm đã ghi bằng chứng${nextTitle ? ` · tiếp theo: ${nextTitle}` : ""}.`
          : "Chọn companion, mở trạm đầu tiên và để bản đồ sáng lên theo từng lần em hiểu bài."}
      </p>
    </section>
  );
}

function GuardianFeature({
  signed,
  onAuthenticate,
}: {
  signed: boolean;
  onAuthenticate: () => void;
}) {
  return (
    <section className="landing-guardian-card" aria-labelledby="guardian-title">
      <div className="landing-guardian-copy">
        <p className="landing-eyebrow">
          <Gem size={14} /> COMPANION QUEST
        </p>
        <h2 id="guardian-title">
          Mỗi lời giải đúng đều triệu hồi một người bạn.
        </h2>
        <p>
          Thu phục guardian, luyện phép, mở XP và bước vào trận đấu Boss. Tiến
          độ Toán trở thành hành trang mà em có thể nhìn thấy.
        </p>
        {signed ? (
          <Link href="/collection" className="landing-text-cta">
            Xem bộ sưu tập guardian
            <ChevronRight size={17} />
          </Link>
        ) : (
          <button onClick={onAuthenticate} className="landing-text-cta">
            Chọn companion đầu tiên
            <ChevronRight size={17} />
          </button>
        )}
      </div>
      <div className="landing-guardian-visual">
        <div className="landing-guardian-halo" aria-hidden="true" />
        <img src={COMPANION_ART} alt="Guardian đồng hành của Math4Fun" />
        <span className="landing-specimen-tag">
          SPECIMEN
          <br />
          M4F–01
        </span>
        <span className="landing-level-pip">
          <Star size={12} fill="currentColor" /> LV.01
        </span>
      </div>
    </section>
  );
}

export default function Home() {
  const {
    profile,
    isStationUnlocked,
    isStationMastered,
    stationProgress,
    isBossUnlocked,
    weeklyOpenCount,
    level,
    levelProgress,
    gold,
  } = useGame();
  const { openAuth } = useAuthGate();
  const next = profile
    ? STATIONS.find(
        station =>
          station.status === "ready" &&
          isStationUnlocked(station.id) &&
          !isStationMastered(station.id)
      )
    : undefined;
  const mastered = profile?.completedStationIds.length ?? 0;
  const primaryHref = profile
    ? next
      ? `/station/${next.id}`
      : "/map"
    : "#auth";
  const primaryLabel = profile
    ? next
      ? `Tiếp tục: ${next.title}`
      : "Mở bản đồ học"
    : "Bắt đầu hành trình";

  return (
    <div className="landing-page">
      <section className="landing-hero" aria-labelledby="math4fun-title">
        <img
          src={HERO_ART}
          alt="Thế giới fantasy của hành trình học Toán Math4Fun"
          className="landing-hero-art"
        />
        <div className="landing-hero-overlay" aria-hidden="true" />
        <div className="landing-hero-grid" aria-hidden="true" />
        <div
          className="landing-hero-orbit landing-hero-orbit-a"
          aria-hidden="true"
        />
        <div
          className="landing-hero-orbit landing-hero-orbit-b"
          aria-hidden="true"
        />
        <div className="landing-hero-margin-notes" aria-hidden="true">
          <span>FIELD PLATE · MAP 01</span>
          <span>PINNED · GUARDIAN TRACE</span>
          <span>ROUTE DRAFT · M4F</span>
        </div>
        <div className="landing-hero-content">
          <div className="landing-hero-kicker">
            <span>
              <Compass size={16} />
            </span>{" "}
            NỀN TẢNG HỌC TOÁN · PHIÊU LƯU MỖI NGÀY
          </div>
          <h1 id="math4fun-title">
            <Math4FunWordmark />
            <span className="sr-only">Math4Fun</span>
          </h1>
          <p className="landing-hero-lede">
            Học Toán lớp 4 bằng những chuyến thám hiểm nhỏ: giải bài, thu phục
            guardian, mở phép thuật và ghi tên lên bản đồ.
          </p>
          <div className="landing-hero-proof">
            <span>
              <Check size={15} /> Trạm học theo chủ đề
            </span>
            <span>
              <Check size={15} /> XP & guardian đồng hành
            </span>
            <span>
              <Check size={15} /> Boss thử thách cuối map
            </span>
          </div>
          <div className="landing-hero-actions">
            {profile ? (
              <Link href={primaryHref} className="landing-primary-cta">
                <Sparkles size={18} /> {primaryLabel} <ArrowRight size={17} />
              </Link>
            ) : (
              <button
                onClick={() => openAuth("register")}
                className="landing-primary-cta"
              >
                <Sparkles size={18} /> {primaryLabel} <ArrowRight size={17} />
              </button>
            )}
            <Link href="/map" className="landing-secondary-cta">
              <MapPinned size={18} /> Khám phá thế giới
            </Link>
          </div>
          {profile && (
            <div className="landing-return-note">
              <span className="landing-return-avatar">
                {profile.name.slice(0, 1).toUpperCase()}
              </span>
              <p>
                <small>NHẬT KÝ ĐANG MỞ</small>
                <b>
                  Chào {profile.name}, hôm nay em đã sẵn sàng ghi thêm dấu chân.
                </b>
              </p>
              <span>
                <Flame size={14} /> {profile.streak} ngày
              </span>
            </div>
          )}
        </div>
        <aside
          className="landing-hero-card"
          aria-label="Tóm tắt game loop như phiếu ghi chép hành trình"
        >
          <div className="landing-hero-card-top">
            <span>FIELD LOG</span>
            <b>{profile ? `LV.${level}` : "LV.01"}</b>
          </div>
          <div className="landing-xp-track">
            <i
              style={{
                width: `${profile ? Math.min(100, Math.round((levelProgress / PLAYER_XP_PER_LEVEL) * 100)) : 12}%`,
              }}
            />
          </div>
          <p>
            {profile
              ? `${levelProgress}/${PLAYER_XP_PER_LEVEL} XP · ${gold} Gold`
              : "Mở sổ để nhận XP & Gold"}
          </p>
          <div className="landing-hero-card-route">
            <span>
              <BookOpen size={16} /> Giải bài
            </span>
            <i />
            <span>
              <Gem size={16} /> Thu phục
            </span>
            <i />
            <span>
              <Swords size={16} /> Đấu Boss
            </span>
          </div>
          <div className="landing-hero-card-seal">
            <Trophy size={21} />
            <span>
              LEVEL UP
              <br />
              IS A CLUE
            </span>
          </div>
        </aside>
      </section>

      <section
        className="landing-proof-band"
        aria-label="Những thành phần chính của Math4Fun"
      >
        <StatChip
          icon={BookOpen}
          title="Bài học có ngữ cảnh"
          copy="Chủ đề theo sách Toán 4"
        />
        <StatChip
          icon={Wand2}
          title="Học bằng chiến thuật"
          copy="Đúng thì tung phép, sai vẫn học tiếp"
          tone="mint"
        />
        <StatChip
          icon={Trophy}
          title="Tiến độ nhìn thấy được"
          copy="Gold, XP, huy hiệu & hành trình"
          tone="coral"
        />
      </section>

      <section className="landing-story-intro">
        <div>
          <p className="landing-eyebrow">
            <Compass size={14} /> VÒNG LẶP HỌC–CHƠI
          </p>
          <h2>
            Không phải làm bài cho xong.
            <br />
            <em>Là đi xa hơn vì hiểu hơn.</em>
          </h2>
        </div>
        <p>
          Math4Fun biến mỗi lần luyện tập thành một vòng lặp vừa sức: mở một
          trạm, giải mười câu, đón guardian mới và dùng hiểu biết để vượt thử
          thách lớn hơn.
        </p>
      </section>

      <div className="landing-main-grid">
        <WorldRoute
          signed={Boolean(profile)}
          nextTitle={next?.title}
          mastered={mastered}
        />
        <GuardianFeature
          signed={Boolean(profile)}
          onAuthenticate={() => openAuth("register")}
        />
      </div>

      <section
        className="landing-quest-loop"
        aria-labelledby="quest-loop-title"
      >
        <div className="landing-quest-copy">
          <p className="landing-eyebrow">
            <Shield size={14} /> QUEST SYSTEM
          </p>
          <h2 id="quest-loop-title">
            Toán có nhịp độ.
            <br />
            <em>Hành trình có phần thưởng.</em>
          </h2>
          <p>
            Mỗi tuần, học sinh tự mở tuyến, dùng Gold có chủ đích và nhìn thấy
            từng bước tiến trong sổ hành trình cá nhân.
          </p>
          {profile ? (
            <Link href="/stats" className="landing-text-cta">
              Mở sổ tiến độ
              <ArrowRight size={17} />
            </Link>
          ) : (
            <button
              onClick={() => openAuth("register")}
              className="landing-text-cta"
            >
              Tạo sổ hành trình
              <ArrowRight size={17} />
            </button>
          )}
        </div>
        <div className="landing-loop-artifacts">
          <article className="landing-loop-card landing-loop-card-one">
            <span>01</span>
            <BookOpen />
            <b>Mở trạm</b>
            <p>Chọn chủ đề để bắt đầu chuyến học.</p>
          </article>
          <article className="landing-loop-card landing-loop-card-two">
            <span>02</span>
            <Wand2 />
            <b>Giải & lên XP</b>
            <p>Mỗi đáp án là một kỹ năng được ghi nhận.</p>
          </article>
          <article className="landing-loop-card landing-loop-card-three">
            <span>03</span>
            <Trophy />
            <b>Mở khóa thử thách</b>
            <p>Guardian và Boss chờ em chinh phục.</p>
          </article>
          <svg
            className="landing-loop-thread"
            viewBox="0 0 600 130"
            aria-hidden="true"
          >
            <path
              d="M30 71 C126 16 187 124 278 64 S425 8 570 59"
              fill="none"
              stroke="currentColor"
              strokeDasharray="5 10"
              strokeWidth="2"
            />
          </svg>
        </div>
      </section>

      <section className="landing-final-cta">
        <div className="landing-final-stars" aria-hidden="true">
          ✦ · ✧ · ✦
        </div>
        <p className="landing-eyebrow">
          <Star size={14} fill="currentColor" /> BẢN ĐỒ ĐANG CHỜ
        </p>
        <h2>
          Trạm học đầu tiên
          <br />
          chỉ cách một dấu chân.
        </h2>
        <p>
          Khởi tạo hồ sơ riêng, chọn companion và bắt đầu chuyến phiêu lưu Toán
          của em hôm nay.
        </p>
        {profile ? (
          <Link href={primaryHref} className="landing-primary-cta">
            <Compass size={18} /> {primaryLabel} <ArrowRight size={17} />
          </Link>
        ) : (
          <button
            onClick={() => openAuth("register")}
            className="landing-primary-cta"
          >
            <Compass size={18} /> Ký tên vào nhật ký <ArrowRight size={17} />
          </button>
        )}
        <small>
          {isBossUnlocked
            ? "Boss Atlas đã mở: nhật ký của em đã đủ mạnh."
            : profile
              ? `${weeklyOpenCount}/2 lượt mở trạm miễn phí trong tuần này.`
              : "Không cần tải ứng dụng. Tiến độ được giữ trên thiết bị của em."}
        </small>
      </section>
    </div>
  );
}
