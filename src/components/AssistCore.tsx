/* ============================================================
   AssistCore.tsx  (AssistCoreNode)
   ------------------------------------------------------------
   The orchestration hub at the center of the graph — calm and
   deliberate, not a spinning neon orb. A single controlled radial
   glow, one still ring, a frosted disc with the mark, and a clear
   two-line label ("Assist Core" / "Context Orchestration Hub").
   Itself a clickable cell (opens the Main Console).
   ============================================================ */
import { iconFor } from "../lib/icons";
import type { CoreData } from "../types";

interface AssistCoreProps {
  core: CoreData;
  x: number;
  y: number;
  /** Disc diameter in px. */
  size: number;
  selected: boolean;
  related: boolean;
  dimmed: boolean;
  onClick: () => void;
  onHover: (id: string | null) => void;
}

export default function AssistCore({
  core,
  x,
  y,
  size,
  selected,
  related,
  dimmed,
  onClick,
  onHover,
}: AssistCoreProps) {
  const Icon = iconFor("core");
  const halo = size * 2.15;
  const active = selected || related;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => onHover("core")}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover("core")}
      onBlur={() => onHover(null)}
      aria-pressed={selected}
      aria-label={`${core.title} — ${core.description}`}
      className={`group absolute z-20 -translate-x-1/2 -translate-y-1/2 outline-none transition-opacity duration-500 ease-soft ${
        dimmed ? "opacity-55" : "opacity-100"
      }`}
      style={{ left: x, top: y, width: size, height: size }}
    >
      {/* controlled radial glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-corePulse"
        style={{
          width: halo,
          height: halo,
          background:
            "radial-gradient(circle, rgba(94,234,212,0.16) 0%, rgba(139,92,246,0.08) 45%, transparent 70%)",
          opacity: active ? 0.95 : 0.7,
        }}
      />

      {/* one still ring */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size * 1.42,
          height: size * 1.42,
          border: `1px solid ${active ? "rgba(94,234,212,0.4)" : "rgba(148,163,184,0.18)"}`,
        }}
      />

      {/* frosted disc */}
      <span
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-500 ease-soft group-hover:scale-[1.03]"
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at 50% 34%, rgba(94,234,212,0.22) 0%, rgba(16,22,38,0.96) 62%)",
          border: "1px solid rgba(94,234,212,0.28)",
          boxShadow: active
            ? "0 0 24px rgba(94,234,212,0.2), inset 0 0 20px rgba(94,234,212,0.08)"
            : "0 0 14px rgba(94,234,212,0.1), inset 0 0 16px rgba(94,234,212,0.05)",
        }}
      >
        <Icon
          className="text-cyan"
          style={{ width: size * 0.4, height: size * 0.4 }}
          strokeWidth={1.4}
        />
      </span>

      {/* two-line label */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-full mt-2.5 -translate-x-1/2 whitespace-nowrap text-center"
      >
        <span className="block text-[0.92rem] font-semibold tracking-tight text-ink">{core.title}</span>
        <span className="kicker mt-0.5 block">Context Orchestration Hub</span>
      </span>
    </button>
  );
}
