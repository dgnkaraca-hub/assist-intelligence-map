/* ============================================================
   HoneycombNode.tsx  (SystemNode)
   ------------------------------------------------------------
   A THIN holographic knowledge cell — a pointy-top hexagon that
   reads like a glass panel, not a physical block. ONE shared
   component for every cell (the 8 ring cells, the focus hub,
   and any future node).

   LAYER ARCHITECTURE — strict geometric nesting:
     · node-halo   selected-only ripple: an SVG hexagon OUTLINE
                   that expands and fades. A stroke, never a
                   filled plate, so no colored surface ever
                   travels outside the shell.
     · node-frame  the outer hexagon shell: accent-tinted clip,
                   carries the drop-shadow glow (glow hugs the
                   silhouette; only light leaves the shape).
     · node-face   the filled inner surface = the BUTTON (hit
                   area). Same clip-path, inset via
                   transform: scale(FACE_SCALE) — a scaled
                   similar polygon is mathematically CONCENTRIC,
                   so the face keeps a uniform perpendicular
                   inset from all six edges ((1−k)·0.866·s).
                   A box-inset + re-clip does NOT (slanted edges
                   end up thinner) — that was the old mismatch.
     · node-inner  the content safe area (inset 19% / 4%): icon,
                   label, value, unit — centered flex column, all
                   sizes derived from the hex radius `s` with px
                   floors, width-capped rows near the taper.
                   Stack height ≈ 1.22·s fits the 1.24·s band.

   Interaction: hover = 2px lift + 1.015 scale; selected = 1.04
   scale in place + brighter rim + faint inner glow + outline
   ripple. Detail opens in the right panel, never by inflating
   the node. Motion stays small (180ms) and calm.
   ============================================================ */
import { iconFor } from "../lib/icons";
import { accent } from "../lib/accents";
import type { MapCell } from "../types";

/** Regular pointy-top hexagon (bounding box ratio √3 : 2). */
const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
const NODE_BG = "rgba(18,26,46,0.44)";
/** Face inset as a similarity scale — uniform rim of (1−k)·0.866·s px. */
const FACE_SCALE = 0.963;

interface HoneycombNodeProps {
  cell: MapCell;
  /** Hex circumradius (px). */
  s: number;
  selected: boolean;
  related: boolean;
  hovered: boolean;
  dimmed: boolean;
  onClick: () => void;
  onHover: (id: string | null) => void;
}

export default function HoneycombNode({
  cell,
  s,
  selected,
  related,
  hovered,
  dimmed,
  onClick,
  onHover,
}: HoneycombNodeProps) {
  const Icon = iconFor(cell.icon);
  const a = accent(cell.accent);
  const width = Math.sqrt(3) * s;
  const height = 2 * s;
  const urgent = cell.status === "alert";
  const edgeHex = urgent && !selected && !hovered ? "#FB7185" : a.hex;

  // Proportional interior sizing — everything derives from the hex radius so
  // the stack scales with the cell (viewport size, browser zoom, focus hub).
  const iconPx = s * 0.3;
  const labelPx = Math.max(8.5, s * 0.22);
  const valuePx = Math.max(10, s * 0.28);
  const unitPx = Math.max(6.5, s * 0.15);
  const gapPx = Math.max(1.5, s * 0.05);

  // Frame opacity + glow radius, kept small at every state. The resting frame
  // is strong enough that the hexagon silhouette stays legible against the
  // dark field (identity first, glow second).
  const borderAlpha = selected ? "8c" : hovered ? "66" : related ? "52" : urgent ? "5c" : "42";
  const glow = selected
    ? `drop-shadow(0 0 16px ${a.hex}26)`
    : hovered
      ? `drop-shadow(0 0 10px ${a.hex}20)`
      : related
        ? `drop-shadow(0 0 8px ${a.hex}18)`
        : urgent
          ? "drop-shadow(0 0 8px rgba(251,113,133,0.16))"
          : `drop-shadow(0 0 5px ${a.hex}12)`;

  // Hexagon vertices in px, for the SVG outline halo.
  const haloPoints = `${width / 2},0 ${width},${height / 4} ${width},${(height * 3) / 4} ${width / 2},${height} 0,${(height * 3) / 4} 0,${height / 4}`;

  return (
    <div
      className={`group relative transition-[transform,opacity] duration-[180ms] ease-soft ${
        selected
          ? "-translate-y-[2px] scale-[1.04]"
          : "hover:-translate-y-[2px] hover:scale-[1.015]"
      } ${dimmed && !related ? "opacity-45" : "opacity-100"}`}
      style={{ width, height }}
    >
      {/* node-halo — selected ripple as a pure OUTLINE (no filled surface) */}
      {selected && (
        <svg
          aria-hidden
          viewBox={`0 0 ${width} ${height}`}
          className="pointer-events-none absolute inset-0 origin-center animate-haloPulse"
          style={{ overflow: "visible" }}
        >
          <polygon points={haloPoints} fill="none" stroke={a.hex} strokeWidth={1} opacity={0.6} />
        </svg>
      )}

      {/* node-frame — the hexagon shell; glow hugs its silhouette */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-[background,filter] duration-[180ms]"
        style={{ clipPath: HEX_CLIP, background: `${edgeHex}${borderAlpha}`, filter: glow }}
      />

      {/* node-face — the filled surface = the button. Concentric inner hexagon
          via scale, so the colored area is inscribed in the shell everywhere. */}
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => onHover(cell.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(cell.id)}
        onBlur={() => onHover(null)}
        aria-pressed={selected}
        aria-label={cell.drillable ? `${cell.label} — open cell` : `${cell.label} — open records`}
        // NO backdrop-filter here: combining clip-path + backdrop-filter +
        // transform on one element makes Chromium paint the blurred backdrop as
        // the un-clipped BOUNDING BOX (the face renders as a block, not a
        // hexagon). The glass read comes from the translucent fill instead.
        className="absolute inset-0 origin-center outline-none transition-shadow duration-[180ms] focus-visible:shadow-[inset_0_0_0_2px_rgba(248,250,252,0.9)]"
        style={{
          clipPath: HEX_CLIP,
          transform: `scale(${FACE_SCALE})`,
          background: NODE_BG,
          boxShadow: selected ? `inset 0 0 16px ${a.hex}1c` : undefined,
        }}
      >
        {/* status light seated just below the hexagon's top vertex (at the vertex
            itself the clip-path width is zero, so 9% keeps the dot inside) */}
        <span
          aria-hidden
          className={`absolute left-1/2 top-[9%] h-[5px] w-[5px] -translate-x-1/2 rounded-full ${urgent ? "bg-rose" : a.dot} ${
            cell.status === "active" || urgent ? "animate-statusBlink" : ""
          }`}
          style={{ boxShadow: `0 0 6px ${urgent ? "#FB7185" : a.hex}` }}
        />

        {/* node-inner — the shared content safe area, inscribed in the face.
            One centered flex column; no per-row margins or manual offsets. */}
        <span
          className="absolute flex flex-col items-center justify-center text-center"
          style={{ inset: "19% 4%", gap: gapPx }}
        >
          <Icon
            className={`${a.text} shrink-0 opacity-90 transition-transform duration-[180ms] ease-soft group-hover:scale-105`}
            style={{ width: iconPx, height: iconPx }}
            strokeWidth={1.5}
          />
          <span
            className="min-w-0 max-w-[92%] truncate font-medium leading-tight tracking-tight"
            style={{ color: "rgba(235,248,255,0.88)", fontSize: labelPx }}
          >
            {cell.label}
          </span>
          <span
            className="min-w-0 max-w-[92%] truncate font-mono font-semibold leading-none tracking-tight"
            style={{ color: "rgba(255,255,255,0.95)", fontSize: valuePx }}
          >
            {cell.stat}
          </span>
          {cell.statLabel && (
            <span
              className="min-w-0 max-w-[78%] truncate uppercase leading-none tracking-[0.1em] text-muted"
              style={{ fontSize: unitPx }}
            >
              {cell.statLabel}
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
