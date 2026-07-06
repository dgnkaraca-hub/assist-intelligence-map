/* ============================================================
   types.ts
   ------------------------------------------------------------
   The shared vocabulary for Assist Intelligence. All content
   lives in src/data/* and is typed against these shapes, so the
   visual layer (components) never invents structure of its own.

   A "honeycomb" is one knowledge cell on the map. Clicking it
   opens a console-style detail panel rendered entirely from the
   data below — nothing about a cell's content is hard-coded in
   the components.
   ============================================================ */

/** Accent token. Drives edge color, glow, badge tint per cell. */
export type Accent =
  | "core"
  | "cyan"
  | "teal"
  | "violet"
  | "purple"
  | "amber"
  | "rose"
  // legacy aliases (mapped onto the new palette in accents.ts)
  | "blue"
  | "star";

/** A lucide icon key, resolved to a component by lib/icons.tsx. */
export type IconKey =
  // core + the eight intelligence cells
  | "core"
  | "memory"
  | "tasks"
  | "research"
  | "knowledge"
  | "studio"
  | "decisions"
  | "agents"
  | "inbox"
  // generic glyphs (tags, metrics, fallbacks)
  | "spark"
  | "pulse"
  | "signal"
  | "shield"
  | "clock"
  | "history"
  | "network"
  | "vector"
  | "bookmark"
  | "queue"
  | "lock"
  | "check"
  | "calendar"
  | "branch"
  | "doc"
  | "link"
  | "layers"
  | "target"
  | "route"
  | "map"
  | "alert"
  | "image"
  | "video"
  | "audio"
  | "pen"
  | "scale"
  | "mail"
  | "archive"
  | "flag";

/** A status pip rendered on a cell / in the panel header. */
export type NodeStatus = "active" | "online" | "idle" | "alert";

/** A single metric, rendered as a MetricCard in the detail panel. */
export interface Metric {
  label: string;
  value: string;
}

/** A data record held inside a cell — browsable and add/removable in the panel. */
export interface DataItem {
  id: string;
  title: string;
  note?: string;
  tag?: string;
}

/** A sub-cell: what a main cell splits into when you drill into it. */
export interface SubCell {
  id: string;
  label: string;
  icon: IconKey;
}

/**
 * The minimal shape the map needs to draw a cell, whether it's a main cell or a
 * sub-cell. `drillable` cells split into more cells on click; leaf cells open
 * the data console instead.
 */
export interface MapCell {
  id: string;
  label: string;
  icon: IconKey;
  accent: Accent;
  stat: string;
  /** What the stat counts (e.g. "facts", "in flight") — shown under the value. */
  statLabel?: string;
  status: NodeStatus;
  drillable: boolean;
}

/** An outbound link shown in the detail panel / action row. */
export interface NodeLink {
  label: string;
  url: string;
}

/**
 * A bridge from an Assist cell into the Universe layer (the Doğan Karaca
 * knowledge map living at src/features/universe).
 */
export interface UniverseLink {
  /** Universe domain id to focus (e.g. "dh", "film"); omit for the overview. */
  domain?: string;
  /** Universe node id to open in the detail drawer. */
  node?: string;
  /**
   * "direct"  — clicking the cell on the map enters the Universe immediately.
   * "action"  — the cell opens normally; the Universe is offered as an action.
   */
  open: "direct" | "action";
  /** Label for the action button (defaults to "Open in Universe"). */
  label?: string;
}

/**
 * A honeycomb — one clickable knowledge cell. Its position on the
 * hex lattice is decided geometrically by lib/layout.ts (array
 * order = ring order); everything else here is content/identity.
 */
export interface Honeycomb {
  id: string;
  title: string;
  /** Compact name shown on the hex chip. */
  shortLabel: string;
  category: string;
  icon: IconKey;
  accent: Accent;
  status: NodeStatus;
  /** Headline figure shown large on the map chip (e.g. "128"). */
  stat: string;
  /** Caption under the headline figure. */
  statLabel: string;
  /** One-line summary. */
  description: string;
  /** Bullet points expanding on the cell. */
  details: string[];
  /** Key metrics, rendered as cards. */
  metrics: Metric[];
  /** Ids of related honeycombs (light up + connect on the map). */
  relatedNodes: string[];
  /** Outbound links / destinations. */
  links: NodeLink[];
  /** Suggested next actions. */
  nextActions: string[];
  tags: string[];
  lastUpdated: string;
  /** Marks the central console cell (rendered as the glowing orb). */
  isCore?: boolean;
  /** Optional bridge into the Universe layer (knowledge map). */
  universeLink?: UniverseLink;
}

/** The central Assist Core cell — a honeycomb with map extras. */
export interface CoreData extends Honeycomb {
  /** Sub-title shown under the orb. */
  tagline: string;
  /** Live status lines shown in the top status bar. */
  signals: string[];
}

/**
 * A base edge in the circuit. Spokes wire every cell to the Core
 * for the resting circuit look; the live "related" highlight is
 * drawn dynamically from each cell's relatedNodes when selected.
 */
export interface Edge {
  id: string;
  fromId: string;
  toId: string;
  kind: "spoke" | "relation";
  active?: boolean;
}

/** A line in the Assist Console transcript. */
export interface ConsoleLine {
  id: string;
  role: "assist" | "user" | "system";
  text: string;
  nodeId?: string;
}

/** A recommendation / next-action card in the default rail. */
export interface Recommendation {
  id: string;
  title: string;
  detail: string;
  accent: Accent;
  nodeId?: string;
}

/** Top-level data bundle for the console. */
export interface ConsoleData {
  core: CoreData;
  nodes: Honeycomb[];
  edges: Edge[];
}
