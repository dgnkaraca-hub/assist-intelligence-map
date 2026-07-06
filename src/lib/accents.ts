/* ============================================================
   accents.ts
   ------------------------------------------------------------
   Maps an Accent token to a set of *complete* Tailwind class
   strings plus a raw hex (for SVG strokes/fills and inline
   styles). Class names are written out in full so Tailwind's
   content scanner keeps them — never build accent classes by
   string concatenation, or the purge will drop them.

   Calm premium palette: color signals identity + activity, used
   sparingly (a hairline, a dot, a metric, a soft wash).
   ============================================================ */
import type { Accent } from "../types";

export interface AccentStyle {
  /** Raw hex, for SVG strokes/fills and inline styles. */
  hex: string;
  /** Accent text color. */
  text: string;
  /** Hairline -> accent border used on hover/active. */
  border: string;
  /** Outer glow shadow (restrained). */
  glow: string;
  /** Glow on hover (full class string for Tailwind). */
  hoverGlow: string;
  /** Small status/indicator dot background. */
  dot: string;
  /** Pill badge: subtle tinted background + accent text + border. */
  badge: string;
  /** Soft translucent background wash for icon chips. */
  soft: string;
  /** Gradient used for progress / meter fills. */
  meter: string;
}

export const accentStyles: Record<Accent, AccentStyle> = {
  core: {
    hex: "#5EEAD4",
    text: "text-cyan",
    border: "border-cyan/40",
    glow: "shadow-glow",
    hoverGlow: "hover:shadow-glow-strong",
    dot: "bg-cyan",
    badge: "bg-cyan/10 text-cyan border border-cyan/25",
    soft: "bg-cyan/10",
    meter: "from-cyan to-teal",
  },
  cyan: {
    hex: "#5EEAD4",
    text: "text-cyan",
    border: "border-cyan/40",
    glow: "shadow-glow",
    hoverGlow: "hover:shadow-glow",
    dot: "bg-cyan",
    badge: "bg-cyan/10 text-cyan border border-cyan/25",
    soft: "bg-cyan/10",
    meter: "from-cyan to-teal",
  },
  teal: {
    hex: "#2DD4BF",
    text: "text-teal",
    border: "border-teal/40",
    glow: "shadow-glow-teal",
    hoverGlow: "hover:shadow-glow-teal",
    dot: "bg-teal",
    badge: "bg-teal/10 text-teal border border-teal/25",
    soft: "bg-teal/10",
    meter: "from-teal to-cyan",
  },
  violet: {
    hex: "#8B5CF6",
    text: "text-violet",
    border: "border-violet/40",
    glow: "shadow-glow-violet",
    hoverGlow: "hover:shadow-glow-violet",
    dot: "bg-violet",
    badge: "bg-violet/10 text-violet border border-violet/25",
    soft: "bg-violet/10",
    meter: "from-violet to-purple",
  },
  purple: {
    hex: "#A78BFA",
    text: "text-purple",
    border: "border-purple/40",
    glow: "shadow-glow-purple",
    hoverGlow: "hover:shadow-glow-purple",
    dot: "bg-purple",
    badge: "bg-purple/10 text-purple border border-purple/25",
    soft: "bg-purple/10",
    meter: "from-purple to-violet",
  },
  amber: {
    hex: "#FACC15",
    text: "text-amber",
    border: "border-amber/40",
    glow: "shadow-glow-amber",
    hoverGlow: "hover:shadow-glow-amber",
    dot: "bg-amber",
    badge: "bg-amber/10 text-amber border border-amber/25",
    soft: "bg-amber/10",
    meter: "from-amber to-rose",
  },
  rose: {
    hex: "#FB7185",
    text: "text-rose",
    border: "border-rose/40",
    glow: "shadow-glow-rose",
    hoverGlow: "hover:shadow-glow-rose",
    dot: "bg-rose",
    badge: "bg-rose/10 text-rose border border-rose/25",
    soft: "bg-rose/10",
    meter: "from-rose to-amber",
  },
  // legacy aliases
  blue: {
    hex: "#5EEAD4",
    text: "text-cyan",
    border: "border-cyan/40",
    glow: "shadow-glow",
    hoverGlow: "hover:shadow-glow",
    dot: "bg-cyan",
    badge: "bg-cyan/10 text-cyan border border-cyan/25",
    soft: "bg-cyan/10",
    meter: "from-cyan to-teal",
  },
  star: {
    hex: "#F8FAFC",
    text: "text-star",
    border: "border-star/40",
    glow: "shadow-glow",
    hoverGlow: "hover:shadow-glow",
    dot: "bg-star",
    badge: "bg-star/10 text-star border border-star/25",
    soft: "bg-star/10",
    meter: "from-star to-cyan",
  },
};

/** Convenience accessor with a cyan fallback. */
export function accent(a: Accent | undefined): AccentStyle {
  return accentStyles[a ?? "cyan"];
}
