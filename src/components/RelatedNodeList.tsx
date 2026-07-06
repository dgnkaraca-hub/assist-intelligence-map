/* ============================================================
   RelatedNodeList.tsx
   ------------------------------------------------------------
   The related-cells row in the detail panel. Each chip resolves
   a related id to its honeycomb (icon + title + accent). Clicking
   one switches the open panel to that cell.
   ============================================================ */
import { iconFor } from "../lib/icons";
import { accent } from "../lib/accents";
import { honeycombById } from "../data/coreData";

interface RelatedNodeListProps {
  relatedIds: string[];
  onSelect: (id: string) => void;
  /** Highlight the related cell currently hovered on the map. */
  onHover?: (id: string | null) => void;
}

export default function RelatedNodeList({ relatedIds, onSelect, onHover }: RelatedNodeListProps) {
  const related = relatedIds
    .map((id) => honeycombById.get(id))
    .filter((n): n is NonNullable<typeof n> => !!n);

  if (related.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {related.map((n) => {
        const Icon = iconFor(n.icon);
        const a = accent(n.accent);
        return (
          <button
            key={n.id}
            type="button"
            onClick={() => onSelect(n.id)}
            onMouseEnter={() => onHover?.(n.id)}
            onMouseLeave={() => onHover?.(null)}
            aria-label={`Open ${n.title}`}
            className="group flex items-center gap-1.5 rounded-lg border border-line bg-bg-deep/40 px-2.5 py-1.5 text-[0.74rem] text-ink-2 transition-colors duration-200 hover:border-border-glow"
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-md ${a.soft}`}>
              <Icon className={`h-3 w-3 ${a.text}`} strokeWidth={1.7} />
            </span>
            <span className="font-medium text-ink">{n.title}</span>
          </button>
        );
      })}
    </div>
  );
}
