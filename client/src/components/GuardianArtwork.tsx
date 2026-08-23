import type { CSSProperties } from "react";

const GUARDIAN_ART_ORDER = [
  "pipra", "mimo", "voltix", "mossy", "coru",
  "aeris", "brix", "luma", "nori", "pavo",
  "soli", "dexo", "maru", "sena", "kora",
  "vexa", "runo", "tavi", "oryx", "nexa",
  "atlas", "myrion",
] as const;

type GuardianArtworkProps = {
  src?: string;
  alt: string;
  className?: string;
};

function artworkKey(src: string | undefined) {
  if (!src) return undefined;
  const match = src.match(/\/guardians\/([^/.#]+)\.(?:webp|svg)(?:[?#].*)?$/i);
  return match?.[1];
}

export default function GuardianArtwork({ src, alt, className = "" }: GuardianArtworkProps) {
  const key = artworkKey(src);
  const index = key ? GUARDIAN_ART_ORDER.indexOf(key as typeof GUARDIAN_ART_ORDER[number]) : -1;

  if (index < 0) {
    return <img src={src} alt={alt} className={className} />;
  }

  const col = index % 5;
  const row = Math.floor(index / 5);
  const style = {
    "--guardian-x": `${col * 25}%`,
    "--guardian-y": `${row * 25}%`,
  } as CSSProperties;

  return (
    <span
      role="img"
      aria-label={alt}
      className={`guardian-art-tile ${className}`}
      style={style}
    />
  );
}
