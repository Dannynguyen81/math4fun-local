/**
 * Field Journal Quest shop art: original paper-cut specimen illustrations give every local-only item a child-readable physical identity.
 */
import { SHOP_ITEMS, type ShopItem } from "@/game/gameData";

type Props = { itemId: ShopItem["id"]; className?: string };

const paper = "#fffdf6";
const ink = "#172a48";

function Bottle({
  fill,
  shine,
  cap,
}: {
  fill: string;
  shine: string;
  cap: string;
}) {
  return (
    <svg viewBox="0 0 140 140" role="img" aria-label="Bình hồi phục">
      <defs>
        <linearGradient
          id={`bottle-${fill.slice(1)}`}
          x1="0"
          x2="1"
          y1="0"
          y2="1"
        >
          <stop stopColor={shine} />
          <stop offset=".62" stopColor={fill} />
          <stop offset="1" stopColor="#244e4a" />
        </linearGradient>
      </defs>
      <path
        d="M52 21h36l-3 18 13 15v50c0 10-8 18-18 18H60c-10 0-18-8-18-18V54l13-15-3-18Z"
        fill={paper}
        stroke={ink}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M55 22h30v12H55z" fill={cap} stroke={ink} strokeWidth="4" />
      <path
        d="M51 66h47v38c0 10-8 18-18 18H69c-10 0-18-8-18-18Z"
        fill={`url(#bottle-${fill.slice(1)})`}
        stroke={ink}
        strokeWidth="3"
      />
      <path d="M62 54h27" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      <path
        d="M65 80c5-7 15-9 22-4-3 6-8 15-19 19-5-3-7-9-3-15Z"
        fill={paper}
        opacity=".85"
      />
      <path
        d="M59 114c12 5 25 5 37 0"
        stroke={ink}
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".5"
      />
      <circle
        cx="108"
        cy="101"
        r="9"
        fill="#f6b73c"
        stroke={ink}
        strokeWidth="3"
      />
      <path
        d="m104 101 3 3 6-7"
        fill="none"
        stroke={ink}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IndigoJacket() {
  return (
    <svg viewBox="0 0 140 140" role="img" aria-label="Áo khoác Indigo">
      <path
        d="m43 42 19-13h16l19 13 15 25-16 10v42H44V77L28 67l15-25Z"
        fill="#57518d"
        stroke={ink}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M62 29 70 50l8-21M70 50v69"
        fill="none"
        stroke={paper}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="m44 78 16-8m36 8-16-8"
        stroke="#f6b73c"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M49 99h14m14 0h14"
        stroke={paper}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="70" cy="61" r="3" fill="#f6b73c" />
      <path
        d="m108 25 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"
        fill="#f6b73c"
        stroke={ink}
        strokeWidth="2"
      />
    </svg>
  );
}

function MarigoldScarf() {
  return (
    <svg viewBox="0 0 140 140" role="img" aria-label="Khăn choàng Marigold">
      <path
        d="M37 45c9-16 59-17 68 0l-8 25c-8 10-46 10-54 0l-6-25Z"
        fill="#f6b73c"
        stroke={ink}
        strokeWidth="4"
      />
      <path
        d="m51 66 9 54 15-13 12 11 2-52"
        fill="#e88931"
        stroke={ink}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M47 50c13 7 32 7 46 0"
        fill="none"
        stroke={ink}
        strokeWidth="3"
      />
      <path
        d="m63 38 7-8 7 8"
        fill="none"
        stroke={paper}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m59 87 28 0M63 99l20 0"
        stroke={paper}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="m49 119 4-7 6 6m25 0 6-6 4 7"
        fill="none"
        stroke={ink}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MossSatchel() {
  return (
    <svg viewBox="0 0 140 140" role="img" aria-label="Túi mẫu vật Moss">
      <path
        d="M37 57c0-25 66-25 66 0"
        fill="none"
        stroke={ink}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M35 58h70v55c0 7-6 12-12 12H47c-7 0-12-5-12-12Z"
        fill="#5f8a5e"
        stroke={ink}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M35 69h70v21H35z" fill="#9dba70" stroke={ink} strokeWidth="3" />
      <path d="M61 80h18v11H61z" fill="#f6b73c" stroke={ink} strokeWidth="3" />
      <path
        d="M51 102c9-12 21-13 37-3-7 11-20 15-33 12"
        fill="#e8f0e4"
        stroke={ink}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M58 109c8-2 15-7 20-13"
        fill="none"
        stroke="#4d8b67"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarTrail() {
  return (
    <svg viewBox="0 0 140 140" role="img" aria-label="Dấu chân sao">
      <path
        d="M28 105c23-34 39-27 55-48 9-12 20-20 34-20"
        fill="none"
        stroke="#9a77b8"
        strokeWidth="11"
        strokeLinecap="round"
        strokeDasharray="1 18"
      />
      <path
        d="m48 88 4 9 10 1-8 6 3 10-9-5-9 5 3-10-8-6 10-1Z"
        fill="#f6b73c"
        stroke={ink}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="m87 47 3 7 8 1-6 5 2 8-7-4-7 4 3-8-7-5 8-1Z"
        fill={paper}
        stroke={ink}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle
        cx="113"
        cy="31"
        r="7"
        fill="#f6b73c"
        stroke={ink}
        strokeWidth="3"
      />
    </svg>
  );
}

function LeafTrail() {
  return (
    <svg viewBox="0 0 140 140" role="img" aria-label="Dấu lá lộ trình">
      <path
        d="M24 108c24-35 47-31 71-59 7-7 13-14 22-20"
        fill="none"
        stroke="#4d8b67"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="2 12"
      />
      {[
        [42, 91, -30],
        [62, 74, 12],
        [83, 55, -18],
        [106, 36, 28],
      ].map(([x, y, rotate], index) => (
        <g key={index} transform={`translate(${x} ${y}) rotate(${rotate})`}>
          <path
            d="M0 13C-14 2-11-13 2-15 15-10 14 6 0 13Z"
            fill={index % 2 ? "#9dba70" : "#e8f0e4"}
            stroke={ink}
            strokeWidth="3"
          />
          <path
            d="M0 11V-9"
            stroke="#4d8b67"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
}

export function ShopItemIllustration({ itemId, className = "" }: Props) {
  const item = SHOP_ITEMS.find(entry => entry.id === itemId);
  if (item?.artwork) {
    return (
      <span
        className={`shop-item-artwork inline-grid place-items-center ${className}`}
      >
        <img src={item.artwork} alt="" aria-hidden="true" />
      </span>
    );
  }
  const art =
    itemId === "potion-25" ? (
      <Bottle fill="#55a9dd" shine="#d9f3ff" cap="#5a9cc4" />
    ) : itemId === "potion-50" ? (
      <Bottle fill="#3e9b7a" shine="#e8f6dc" cap="#4d8b67" />
    ) : itemId === "potion-100" ? (
      <Bottle fill="#e88931" shine="#fff0b6" cap="#d88900" />
    ) : itemId === "outfit-indigo" ? (
      <IndigoJacket />
    ) : itemId === "outfit-marigold" ? (
      <MarigoldScarf />
    ) : itemId === "outfit-moss" ? (
      <MossSatchel />
    ) : itemId === "trail-stars" ? (
      <StarTrail />
    ) : (
      <LeafTrail />
    );
  return (
    <span className={`inline-grid place-items-center ${className}`}>{art}</span>
  );
}
