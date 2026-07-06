/* ============================================================
   layout.ts
   ------------------------------------------------------------
   Pure hex geometry for the Assist Intelligence circuit field.
   No React, no DOM — the components read these helpers to place
   the Core and its intelligence nodes on a pointy-top hexagonal
   lattice and to route connectors as hex-aligned "elbow" traces
   (current-on-circuit), the way the second-brain map does.

   layoutCircuit places the Core on the center cell and the eight
   knowledge cells snapped to cells around an inner ring.

   Coordinate model: axial (q, r) over a pointy-top lattice;
   connectors travel along the six 60° hex axes so they read as
   circuit traces, not arbitrary diagonals.
   ============================================================ */

const TAU = Math.PI * 2;
const SQRT3 = Math.sqrt(3);

export interface Area {
  w: number;
  h: number;
  cx: number;
  cy: number;
  /** Working radius the layout fans nodes across. */
  rd: number;
}

export interface Point {
  x: number;
  y: number;
}

/** A placed node: its pixel center plus the hex cell it claimed. */
export interface PlacedNode {
  id: string;
  x: number;
  y: number;
  q: number;
  r: number;
}

export interface CircuitLayout {
  core: Point;
  /** Hex cell circumradius used for this area. */
  s: number;
  /** The orbit radius the ring cells sit on (drawn as a faint guide). */
  ringR: number;
  nodes: Record<string, PlacedNode>;
}

export function computeArea(width: number, height: number): Area {
  const cx = width / 2;
  const cy = height / 2;
  const rd = Math.max(150, Math.min(width / 2 - 80, height / 2 - 80, 360));
  return { w: width, h: height, cx, cy, rd };
}

/** Hex circumradius for the current area. Cells are spread into a constellation
 *  (not packed), so they stay modest to leave room for the glowing web + drift. */
export function hexSize(area: Area): number {
  return Math.max(34, area.rd / 6);
}

/** Axial (q, r) hex cell -> pixel center (pointy-top). */
export function axialToPixel(q: number, r: number, s: number, cx: number, cy: number): Point {
  return { x: cx + s * SQRT3 * (q + r / 2), y: cy + s * 1.5 * r };
}

/** Round fractional cube coords to the nearest hex cell. */
function axialRound(qf: number, rf: number): [number, number] {
  const x = qf;
  const z = rf;
  const y = -x - z;
  let rx = Math.round(x);
  let ry = Math.round(y);
  let rz = Math.round(z);
  const dx = Math.abs(rx - x);
  const dy = Math.abs(ry - y);
  const dz = Math.abs(rz - z);
  if (dx > dy && dx > dz) rx = -ry - rz;
  else if (dy > dz) ry = -rx - rz;
  else rz = -rx - ry;
  return [rx, rz];
}

/** Pixel point -> nearest hex cell (axial). */
export function pixelToAxial(px: number, py: number, s: number, cx: number, cy: number): [number, number] {
  const x = px - cx;
  const y = py - cy;
  const qf = ((SQRT3 / 3) * x - y / 3) / s;
  const rf = ((2 / 3) * y) / s;
  return axialRound(qf, rf);
}

/** SVG path for a pointy-top hexagon centered at (x, y) with circumradius s. */
export function hexPath(x: number, y: number, s: number): string {
  let d = "";
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 90);
    d += `${i ? "L" : "M"}${(x + s * Math.cos(a)).toFixed(1)} ${(y + s * Math.sin(a)).toFixed(1)} `;
  }
  return d + "Z";
}

/** Every hex-cell center whose hexagon touches the area (the honeycomb field). */
export function honeycombCells(area: Area, s: number): Point[] {
  const cells: Point[] = [];
  const reach = Math.ceil(Math.max(area.w, area.h) / (s * 1.5)) + 2;
  for (let r = -reach; r <= reach; r++) {
    for (let q = -reach; q <= reach; q++) {
      const p = axialToPixel(q, r, s, area.cx, area.cy);
      if (p.x > -s && p.x < area.w + s && p.y > -s && p.y < area.h + s) cells.push(p);
    }
  }
  return cells;
}

/** Unit vectors along the six hex axes (0/60/120/180/240/300 degrees). */
const HEX_UNIT: ReadonlyArray<readonly [number, number]> = [0, 60, 120, 180, 240, 300].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return [Math.cos(a), Math.sin(a)] as const;
});

/**
 * Route A->B as two straight segments along hex axes (multiples of 60°), so the
 * connectors read like circuit traces on the lattice. The two axes bracketing
 * the A->B direction are chosen so both legs head toward B (no backtracking).
 */
export function hexElbowPath(ax: number, ay: number, bx: number, by: number): string {
  const dx = bx - ax;
  const dy = by - ay;
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return `M${ax.toFixed(1)} ${ay.toFixed(1)}`;
  let ang = Math.atan2(dy, dx);
  if (ang < 0) ang += TAU;
  const i = Math.floor(ang / (Math.PI / 3)) % 6;
  const u = HEX_UNIT[i];
  const w = HEX_UNIT[(i + 1) % 6];
  const det = u[0] * w[1] - w[0] * u[1];
  const a = (dx * w[1] - w[0] * dy) / det; // length along the first axis
  const px = ax + a * u[0];
  const py = ay + a * u[1];
  return `M${ax.toFixed(1)} ${ay.toFixed(1)} L${px.toFixed(1)} ${py.toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)}`;
}

/** Angle for slot i of n, evenly spaced with index 0 at the top. */
function ringAngle(i: number, n: number): number {
  return -Math.PI / 2 + (i * TAU) / n;
}

/**
 * OVERVIEW. A deliberate, symmetric composition: the Core sits at the exact
 * center and the cells occupy a perfect orbit around it — equal angles, equal
 * radius, index 0 at the top. No lattice snapping (snapping produced uneven
 * radii/angles that read as accidental); the honeycomb field stays a quiet
 * backdrop while each cell gets its own hexagonal "seat" drawn by the map.
 */
export function layoutCircuit(area: Area, nodeIds: string[]): CircuitLayout {
  const s = hexSize(area);
  const core = { x: area.cx, y: area.cy };

  const n = Math.max(1, nodeIds.length);
  // Fewer cells (a focused sub-ring) sit on a tighter orbit so the composition
  // stays dense and deliberate instead of stranding four cells on a wide circle.
  const base = Math.max(s * 2.9, area.rd * 0.8);
  const ringR = n <= 5 ? Math.max(s * 2.9, base * 0.72) : base;

  const nodes: Record<string, PlacedNode> = {};
  nodeIds.forEach((id, i) => {
    const ang = ringAngle(i, n);
    nodes[id] = {
      id,
      x: area.cx + ringR * Math.cos(ang),
      y: area.cy + ringR * Math.sin(ang),
      q: 0,
      r: 0,
    };
  });

  return { core, s, ringR, nodes };
}
