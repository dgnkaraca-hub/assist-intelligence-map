/* ============================================================
   NodeActionButtons.tsx
   ------------------------------------------------------------
   The action row in the detail panel: a primary "Open" that
   follows the cell's first real link, plus "Connect Node". Adding
   data is handled by the inline data form, not here.
   ============================================================ */
import { ArrowUpRight, Link2 } from "lucide-react";
import { accent } from "../lib/accents";
import type { Accent, NodeLink } from "../types";

interface NodeActionButtonsProps {
  accentKey: Accent;
  links: NodeLink[];
  onOpen: () => void;
  onConnect: () => void;
}

export default function NodeActionButtons({ accentKey, links, onOpen, onConnect }: NodeActionButtonsProps) {
  const a = accent(accentKey);
  const openLabel = links[0]?.label ?? "Open";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onOpen}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.8rem] font-semibold text-bg-void outline-none transition-transform duration-200 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-star/70 ${a.dot}`}
        style={{ boxShadow: `0 0 20px ${a.hex}55` }}
      >
        <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        {openLabel}
      </button>
      <button
        type="button"
        onClick={onConnect}
        className="flex items-center gap-1.5 rounded-lg border border-line bg-bg-deep/50 px-3 py-2 text-[0.8rem] font-medium text-ink-2 outline-none transition-colors duration-200 hover:border-border-glow hover:text-ink focus-visible:ring-2 focus-visible:ring-core/60"
      >
        <Link2 className="h-4 w-4" strokeWidth={1.7} />
        Connect Node
      </button>
    </div>
  );
}
