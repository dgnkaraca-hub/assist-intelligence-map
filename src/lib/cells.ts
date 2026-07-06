/* ============================================================
   cells.ts
   ------------------------------------------------------------
   Adapters between the data shapes and the views. A sub-cell is
   light ({id,label,icon}); the detail console expects a full
   Honeycomb. subCellToView() builds that Honeycomb-shaped view
   so a leaf sub-cell renders in the same console as a main cell.
   ============================================================ */
import type { Honeycomb, SubCell } from "../types";

/** Build a console view-model for a leaf sub-cell. */
export function subCellToView(sub: SubCell, parent: Honeycomb, itemCount: number): Honeycomb {
  return {
    id: sub.id,
    title: sub.label,
    shortLabel: sub.label,
    category: `${parent.title} · sub-cell`,
    icon: sub.icon,
    accent: parent.accent,
    status: "online",
    stat: String(itemCount),
    statLabel: "records",
    description: `${sub.label} records inside ${parent.title}. Browse and add below.`,
    details: [],
    metrics: [{ label: "Records", value: String(itemCount) }],
    relatedNodes: [],
    links: [{ label: `Open ${sub.label}`, url: "#" }],
    nextActions: [],
    tags: [parent.shortLabel.toLowerCase(), sub.label.toLowerCase()],
    lastUpdated: "live",
  };
}
