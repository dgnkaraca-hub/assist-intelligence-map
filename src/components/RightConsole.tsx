/* ============================================================
   RightConsole.tsx
   ------------------------------------------------------------
   The operational command panel. Shown in Overview (when no cell
   is open). It answers "what needs attention today?", surfaces
   suggested next moves, and provides the capture bar. Each item
   points at a cell — clicking it selects that cell.
   ============================================================ */
import { ChevronRight } from "lucide-react";
import { iconFor } from "../lib/icons";
import { accent } from "../lib/accents";
import AddToCoreInput from "./AddToCoreInput";
import type { CoreData } from "../types";
import type { AttentionItem } from "../data/panels";
import type { Recommendation } from "../types";

interface RightConsoleProps {
  core: CoreData;
  attention: AttentionItem[];
  recommendations: Recommendation[];
  targets: Array<{ id: string; label: string }>;
  onPick: (nodeId: string) => void;
  onAdd: (cellId: string, text: string) => void;
}

export default function RightConsole({
  core,
  attention,
  recommendations,
  targets,
  onPick,
  onAdd,
}: RightConsoleProps) {
  return (
    <div className="glass flex h-full min-h-0 flex-col rounded-2xl">
      {/* status header */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <div className="kicker">Console</div>
          <div className="text-[0.95rem] font-semibold tracking-tight text-ink">{core.title}</div>
        </div>
        <span className="flex items-center gap-1.5 text-[0.72rem] text-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-statusBlink" />
          online
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
        {/* attention */}
        <section>
          <h3 className="mb-2.5 text-[0.9rem] font-semibold text-ink">What needs attention today?</h3>
          <ul className="space-y-2">
            {attention.map((item) => {
              const a = accent(item.accent);
              const Icon = iconFor(item.icon);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onPick(item.nodeId)}
                    className="surface group flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors duration-200 hover:border-line-strong"
                  >
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${a.soft}`}>
                      <Icon className={`h-4 w-4 ${a.text}`} strokeWidth={1.7} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`kicker ${a.text}`}>{item.kicker}</span>
                      <span className="mt-0.5 block truncate text-[0.86rem] font-medium text-ink">{item.title}</span>
                      <span className="mt-0.5 block text-[0.76rem] leading-snug text-muted">{item.detail}</span>
                    </span>
                    <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={1.8} />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* suggested next */}
        <section>
          <h3 className="mb-2.5 text-[0.9rem] font-semibold text-ink">Suggested next moves</h3>
          <ul className="space-y-2">
            {recommendations.map((r) => {
              const a = accent(r.accent);
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => r.nodeId && onPick(r.nodeId)}
                    className="surface flex w-full items-center gap-2.5 rounded-xl p-3 text-left transition-colors duration-200 hover:border-line-strong"
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${a.dot}`} style={{ boxShadow: `0 0 6px ${a.hex}` }} />
                    <span className="min-w-0">
                      <span className="block text-[0.84rem] font-medium text-ink">{r.title}</span>
                      <span className="mt-0.5 block text-[0.74rem] leading-snug text-muted">{r.detail}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* capture bar */}
      <div className="border-t border-line p-3">
        <AddToCoreInput targets={targets} onAdd={onAdd} />
      </div>
    </div>
  );
}
