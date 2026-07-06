/* ============================================================
   HoneycombMap.tsx  (GraphCanvas)
   ------------------------------------------------------------
   The calm, static knowledge graph. It draws the CURRENT level:
     · overview — the Core hub + the main cells
     · focus    — the focused cell as hub + its sub-cells
   Node positions are STATIC (no ambient drift). The only motion
   is a gentle line pulse on the selected cell's connections and a
   soft lift on hover. Edges are meaningful:
     · solid  = direct relationship (a cell wired to the hub)
     · dashed = inferred / semantic relationship (cell ↔ cell)
   Edge color follows the flow (cyan/teal memory·knowledge,
   purple·violet research·agents, amber decisions…).
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from "react";
import AssistCore from "./AssistCore";
import HoneycombNode from "./HoneycombNode";
import { computeArea, honeycombCells, hexPath, layoutCircuit, hexSize } from "../lib/layout";
import { accent } from "../lib/accents";
import type { Accent, CoreData, MapCell } from "../types";

interface HoneycombMapProps {
  core: CoreData;
  centerKind: "core" | "cell";
  centerCell?: MapCell;
  cells: MapCell[];
  relations: Array<[string, string]>;
  /** The selected cell id (its edges + node light up). */
  selectedId: string | null;
  /** Cells related to the selection (softly highlighted). */
  relatedIds?: string[];
  onCellClick: (cell: MapCell) => void;
  onCenterClick: () => void;
  onClear: () => void;
}

interface Pt {
  x: number;
  y: number;
}

const CENTER = "@center";

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (r) setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

/**
 * Trim a segment so it starts/ends at the node boundaries instead of running
 * underneath the shapes — connections read as precise, intentional links.
 * Returns null when the nodes are too close for a visible segment.
 */
function trimSegment(a: Pt, b: Pt, ta: number, tb: number): [Pt, Pt] | null {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len <= ta + tb + 6) return null;
  const ux = dx / len;
  const uy = dy / len;
  return [
    { x: a.x + ux * ta, y: a.y + uy * ta },
    { x: b.x - ux * tb, y: b.y - uy * tb },
  ];
}

/** Gently-bowed connector path between two (already trimmed) points. */
function curvePath(a: Pt, b: Pt): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const bow = Math.min(16, len * 0.07);
  const cx = (a.x + b.x) / 2 - (dy / len) * bow;
  const cy = (a.y + b.y) / 2 + (dx / len) * bow;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

export default function HoneycombMap({
  core,
  centerKind,
  centerCell,
  cells,
  relations,
  selectedId,
  relatedIds,
  onCellClick,
  onCenterClick,
  onClear,
}: HoneycombMapProps) {
  const [stageRef, stageSize] = useSize<HTMLDivElement>();
  const [hovered, setHovered] = useState<string | null>(null);
  const related = useMemo(() => new Set(relatedIds ?? []), [relatedIds]);

  const cellIds = useMemo(() => cells.map((c) => c.id), [cells]);
  const area = useMemo(
    () => computeArea(stageSize.w || 800, stageSize.h || 600),
    [stageSize.w, stageSize.h],
  );
  const layout = useMemo(() => layoutCircuit(area, cellIds), [area, cellIds]);
  const s = hexSize(area);
  const ready = stageSize.w > 0 && stageSize.h > 0;
  // The background lattice uses a clearly SMALLER module than the nodes: since
  // the ring no longer snaps to the lattice, same-size field cells right next
  // to a node read as a misaligned "ghost" of its shell. A distinct module
  // keeps the field as texture, never as a competing node outline.
  const fieldS = s * 0.62;
  const field = useMemo(() => honeycombCells(area, fieldS), [area, fieldS]);

  const pos = useMemo(() => {
    const m = new Map<string, Pt>();
    m.set(CENTER, { x: layout.core.x, y: layout.core.y });
    cells.forEach((c) => {
      const p = layout.nodes[c.id];
      if (p) m.set(c.id, { x: p.x, y: p.y });
    });
    return m;
  }, [layout, cells]);

  const accentOf = useMemo(() => {
    const m = new Map<string, Accent>(cells.map((c) => [c.id, c.accent]));
    return (id: string) => (id === CENTER ? core.accent : m.get(id) ?? core.accent);
  }, [cells, core.accent]);

  // Edges: hub→cell spokes (solid) + cell↔cell relations (dashed).
  const edges = useMemo(() => {
    const list: Array<{ id: string; from: string; to: string; dashed: boolean; accentId: string }> = [];
    cells.forEach((c) => list.push({ id: `s-${c.id}`, from: CENTER, to: c.id, dashed: false, accentId: c.id }));
    relations.forEach(([x, y], i) =>
      list.push({ id: `r-${i}-${x}-${y}`, from: x, to: y, dashed: true, accentId: x }),
    );
    return list;
  }, [cells, relations]);

  const hi = selectedId ?? hovered;
  const hoveredCell = hovered ? cells.find((c) => c.id === hovered) : null;
  const hoveredPos = hovered ? pos.get(hovered) : null;

  return (
    <div ref={stageRef} className="absolute inset-0" onClick={() => onClear()}>
      {ready && (
        <>
          <svg className="hex-svg" viewBox={`0 0 ${area.w} ${area.h}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
            {/* subtle honeycomb field — fades away from the center for depth */}
            <g
              style={{
                maskImage: "radial-gradient(58% 58% at 50% 50%, #000 34%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(58% 58% at 50% 50%, #000 34%, transparent 100%)",
              }}
            >
              {field.map((c, i) => (
                <path key={`f${i}`} className="hex-cell" d={hexPath(c.x, c.y, fieldS)} />
              ))}
            </g>
            {/* orbit guide — makes the ring read as deliberate structure */}
            <circle
              cx={layout.core.x}
              cy={layout.core.y}
              r={layout.ringR}
              className="orbit-guide"
            />

            {/* NOTE: the decorative hexagonal "seats" that used to sit under
                every node were REMOVED — Chromium rendered the style-overridden
                seat paths displaced from their coordinates, which read as a
                colored hexagon spilling outside the node (the exact reported
                bug). The orbit guide + node frames carry the structure. */}

            {/* meaningful edges, trimmed to the node boundaries */}
            <g>
              {edges.map((e) => {
                const a = pos.get(e.from);
                const b = pos.get(e.to);
                if (!a || !b) return null;
                // Edges stop just outside each position's SEAT hexagon (cells:
                // seat 1.16s → trim 1.2s; center: seat 1.24s → trim 1.28s), so
                // every connector lands on the same visual boundary.
                const trimA = e.from === CENTER ? s * 1.28 : s * 1.2;
                const seg = trimSegment(a, b, trimA, s * 1.2);
                if (!seg) return null;
                const litE = !!hi && (e.from === hi || e.to === hi);
                let opacity: number;
                if (litE) opacity = 0.62;
                else if (selectedId) opacity = 0.1;
                else opacity = e.dashed ? 0.16 : 0.32;
                return (
                  <path
                    key={e.id}
                    className={`edge ${e.dashed ? "edge-dashed" : ""} ${litE ? "edge-active" : ""}`}
                    d={curvePath(seg[0], seg[1])}
                    style={{ stroke: accent(accentOf(e.accentId)).hex, opacity }}
                  />
                );
              })}
            </g>
          </svg>

          {/* center: Core hub (overview) or focused-cell hub (focus) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute"
            style={{ left: layout.core.x, top: layout.core.y }}
          >
            {centerKind === "core" ? (
              <AssistCore
                core={core}
                x={0}
                y={0}
                size={s * 1.42}
                selected={selectedId === "core"}
                related={false}
                dimmed={!!selectedId && selectedId !== "core"}
                onClick={onCenterClick}
                onHover={setHovered}
              />
            ) : centerCell ? (
              <div className="absolute -translate-x-1/2 -translate-y-1/2">
                <HoneycombNode
                  cell={centerCell}
                  s={s * 1.18}
                  selected
                  related={false}
                  hovered={false}
                  dimmed={false}
                  onClick={onCenterClick}
                  onHover={setHovered}
                />
              </div>
            ) : null}
          </div>

          {/* cells */}
          {cells.map((cell) => {
            const p = pos.get(cell.id);
            if (!p) return null;
            return (
              <div
                key={cell.id}
                onClick={(e) => e.stopPropagation()}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: p.x, top: p.y, zIndex: hovered === cell.id ? 30 : 10 }}
              >
                <HoneycombNode
                  cell={cell}
                  s={s}
                  selected={selectedId === cell.id}
                  related={related.has(cell.id)}
                  hovered={hovered === cell.id}
                  dimmed={!!selectedId && selectedId !== cell.id && !related.has(cell.id)}
                  onClick={() => onCellClick(cell)}
                  onHover={setHovered}
                />
              </div>
            );
          })}

          {/* hover micro-tooltip */}
          {hoveredCell && hoveredPos && hovered !== selectedId && (
            <div
              className="pointer-events-none absolute z-40 -translate-x-1/2 animate-fadeIn"
              style={{ left: hoveredPos.x, top: hoveredPos.y - s * 1.35 }}
            >
              <div className="glass whitespace-nowrap rounded-lg px-2.5 py-1.5 text-center shadow-lift">
                <div className="text-[0.78rem] font-semibold text-ink">{hoveredCell.label}</div>
                <div className="kicker mt-0.5">
                  {hoveredCell.drillable ? "Open cell" : `${hoveredCell.stat} records`}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
