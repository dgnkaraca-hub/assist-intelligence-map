/* ============================================================
   HoneycombDetailPanel.tsx  (CellDetailPanel)
   ------------------------------------------------------------
   Opening a knowledge cell — a calm, tabbed cell layer, not a
   generic modal. Rendered entirely from data.

     Overview   description · key metrics · what's inside
     Items      the cell's records — browse · add · remove
     Relations  related cells
     Actions    open · focus this cell · connect · next moves

   Desktop = the right column (variant "panel", non-modal, sits
   beside the graph). Mobile = a bottom sheet (variant "sheet",
   modal: focus-trapped, Esc/X/backdrop close).
   ============================================================ */
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Clock, Crosshair, Orbit, Plus, Trash2, X } from "lucide-react";
import { iconFor } from "../lib/icons";
import { accent } from "../lib/accents";
import MetricCard from "./MetricCard";
import RelatedNodeList from "./RelatedNodeList";
import NodeActionButtons from "./NodeActionButtons";
import type { DataItem, Honeycomb, UniverseLink } from "../types";

type Tab = "overview" | "items" | "relations" | "actions";

interface CellDetailPanelProps {
  node: Honeycomb;
  variant: "panel" | "sheet";
  items: DataItem[];
  onAdd: (title: string, note?: string) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
  onSelectRelated: (id: string) => void;
  /** Enter Focus Mode on this cell (only for cells that split). */
  onFocus?: () => void;
  canFocus: boolean;
  /** Enter the Universe layer (only for cells with a universeLink). */
  onOpenUniverse?: (target?: Pick<UniverseLink, "domain" | "node">) => void;
}

const STATUS_TEXT: Record<Honeycomb["status"], string> = {
  active: "Active",
  online: "Online",
  idle: "Idle",
  alert: "Needs you",
};

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "items", label: "Items" },
  { id: "relations", label: "Relations" },
  { id: "actions", label: "Actions" },
];

export default function HoneycombDetailPanel({
  node,
  variant,
  items,
  onAdd,
  onRemove,
  onClose,
  onSelectRelated,
  onFocus,
  canFocus,
  onOpenUniverse,
}: CellDetailPanelProps) {
  const Icon = iconFor(node.icon);
  const a = accent(node.accent);
  const [tab, setTab] = useState<Tab>("overview");
  const [flash, setFlash] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const panelRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const descId = `hc-desc-${node.id}`;
  const sheet = variant === "sheet";

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 1900);
    return () => clearTimeout(t);
  }, [flash]);

  // On open / switch cell: reset to overview, clear drafts, focus in, scroll top.
  useEffect(() => {
    setTab("overview");
    setFlash(null);
    setDraftTitle("");
    setDraftNote("");
    bodyRef.current?.scrollTo({ top: 0 });
    panelRef.current?.focus({ preventScroll: true });
  }, [node.id]);

  // Trap Tab only when modal (mobile sheet).
  const onTrapKeyDown = (e: ReactKeyboardEvent) => {
    if (!sheet || e.key !== "Tab") return;
    const root = panelRef.current;
    if (!root) return;
    const f = Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const handleOpen = () => {
    const url = node.links[0]?.url;
    if (url && url !== "#") window.open(url, "_blank", "noopener,noreferrer");
    else setFlash(`${node.links[0]?.label ?? "Open"} — demo destination`);
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const title = draftTitle.trim();
    if (!title) return;
    onAdd(title, draftNote.trim() || undefined);
    setDraftTitle("");
    setDraftNote("");
    setFlash("Added to this cell");
  };

  const card = (
    <section
      ref={panelRef}
      tabIndex={-1}
      onKeyDown={onTrapKeyDown}
      role={sheet ? "dialog" : "region"}
      aria-modal={sheet ? true : undefined}
      aria-label={`${node.title} cell`}
      aria-describedby={descId}
      className={`glass flex min-h-0 w-full flex-col overflow-hidden outline-none ${
        sheet ? "max-h-[88vh] rounded-t-2xl animate-sheetUp" : "h-full rounded-2xl animate-drawerIn"
      }`}
    >
      {/* header */}
      <header className="border-b border-line px-4 pt-3.5">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.soft}`}
            style={{ boxShadow: `0 0 16px ${a.hex}22` }}
          >
            <Icon className={`h-5 w-5 ${a.text}`} strokeWidth={1.6} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="kicker">{node.category}</div>
            <h2 className="truncate text-[1.05rem] font-semibold tracking-tight text-ink">{node.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider ${a.badge}`}>
                {STATUS_TEXT[node.status]}
              </span>
              <span className="flex items-center gap-1 text-[0.7rem] text-muted">
                <Clock className="h-3 w-3" strokeWidth={1.6} />
                {node.lastUpdated}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cell"
            className="shrink-0 rounded-lg border border-line bg-bg-deep/50 p-1.5 text-muted outline-none transition-colors duration-200 hover:border-line-strong hover:text-ink focus-visible:ring-2 focus-visible:ring-cyan/50"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        {/* tabs */}
        <nav className="-mb-px mt-3 flex gap-4" role="tablist" aria-label="Cell sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`border-b-2 pb-2 text-[0.8rem] font-medium outline-none transition-colors duration-200 ${
                tab === t.id ? `${a.text} border-current` : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* body */}
      <div ref={bodyRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
        {sheet && <div aria-hidden className="mx-auto -mt-1 mb-1 h-1 w-10 rounded-full bg-line" />}

        {tab === "overview" && (
          <div className="animate-riseIn space-y-5">
            <p id={descId} className="text-[0.88rem] leading-relaxed text-ink-2">
              {node.description}
            </p>
            {node.metrics.length > 0 && (
              <div>
                <div className="kicker mb-2">Key metrics</div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {node.metrics.map((m) => (
                    <MetricCard key={m.label} metric={m} accentKey={node.accent} />
                  ))}
                </div>
              </div>
            )}
            {node.details.length > 0 && (
              <div>
                <div className="kicker mb-2">What's inside</div>
                <ul className="space-y-1.5">
                  {node.details.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-[0.84rem] text-ink-2">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${a.dot}`} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tab === "items" && (
          <div className="animate-riseIn">
            <div className="kicker mb-2 flex items-center justify-between">
              <span>Records</span>
              <span className={`font-mono ${a.text}`}>{items.length}</span>
            </div>
            <ul className="space-y-1.5">
              {items.length === 0 && (
                <li className="rounded-lg border border-dashed border-line px-3 py-3 text-center text-[0.76rem] text-muted">
                  No records yet — add the first below.
                </li>
              )}
              {items.map((it) => (
                <li key={it.id} className="surface group/item flex items-start gap-2 rounded-lg px-3 py-2">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${a.dot}`} style={{ boxShadow: `0 0 6px ${a.hex}` }} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[0.84rem] font-medium text-ink">{it.title}</div>
                    {it.note && <div className="text-[0.74rem] leading-snug text-muted">{it.note}</div>}
                  </div>
                  {it.tag && (
                    <span className="shrink-0 rounded-full border border-line px-1.5 py-0.5 text-[0.58rem] uppercase tracking-wider text-muted">
                      {it.tag}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemove(it.id)}
                    aria-label={`Remove ${it.title}`}
                    className="shrink-0 rounded-md p-1 text-muted opacity-0 outline-none transition-opacity duration-150 hover:text-rose focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-rose/50 group-hover/item:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.7} />
                  </button>
                </li>
              ))}
            </ul>

            <form onSubmit={handleAdd} className="surface mt-2.5 space-y-2 rounded-xl p-2.5">
              <input
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                aria-label={`Add a ${node.title} record`}
                placeholder={`Add to ${node.title}…`}
                className="w-full rounded-lg border border-line bg-bg-void/60 px-3 py-2 text-[0.84rem] text-ink outline-none transition-colors placeholder:text-muted focus-visible:border-cyan/50"
              />
              <div className="flex gap-2">
                <input
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  aria-label="Optional note"
                  placeholder="Note (optional)"
                  className="min-w-0 flex-1 rounded-lg border border-line bg-bg-void/60 px-3 py-2 text-[0.78rem] text-ink-2 outline-none transition-colors placeholder:text-muted focus-visible:border-cyan/50"
                />
                <button
                  type="submit"
                  disabled={!draftTitle.trim()}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[0.78rem] font-semibold transition-all duration-200 ${
                    draftTitle.trim() ? "bg-cyan text-bg-void hover:brightness-110" : "cursor-not-allowed bg-line text-muted"
                  }`}
                >
                  <Plus className="h-4 w-4" strokeWidth={2.2} />
                  Add
                </button>
              </div>
            </form>
          </div>
        )}

        {tab === "relations" && (
          <div className="animate-riseIn space-y-3">
            {node.relatedNodes.length > 0 ? (
              <>
                <div className="kicker">Related cells</div>
                <RelatedNodeList relatedIds={node.relatedNodes} onSelect={onSelectRelated} />
              </>
            ) : (
              <p className="text-[0.82rem] text-muted">
                This cell has no cross-links yet. It lives inside its parent cell.
              </p>
            )}
            {node.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {node.tags.map((t) => (
                  <span key={t} className="rounded-full border border-line bg-bg-deep/40 px-2 py-0.5 text-[0.66rem] text-muted">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "actions" && (
          <div className="animate-riseIn space-y-4">
            {node.universeLink && onOpenUniverse && (
              <button
                type="button"
                onClick={() =>
                  onOpenUniverse({ domain: node.universeLink!.domain, node: node.universeLink!.node })
                }
                className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-[0.84rem] font-medium transition-colors duration-200 ${a.badge}`}
              >
                <Orbit className="h-4 w-4" strokeWidth={1.8} />
                {node.universeLink.label ?? "Open in Universe"}
              </button>
            )}
            {canFocus && onFocus && (
              <button
                type="button"
                onClick={onFocus}
                className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-[0.84rem] font-medium transition-colors duration-200 ${a.badge}`}
              >
                <Crosshair className="h-4 w-4" strokeWidth={1.8} />
                Focus this cell — reveal its sub-cells
              </button>
            )}
            <NodeActionButtons
              accentKey={node.accent}
              links={node.links}
              onOpen={handleOpen}
              onConnect={() => setFlash("Connect mode — pick a related cell")}
            />
            {flash && (
              <p className={`text-[0.72rem] ${a.text}`} role="status">
                {flash}
              </p>
            )}
            {node.nextActions.length > 0 && (
              <div>
                <div className="kicker mb-2">Suggested next</div>
                <ul className="space-y-1.5">
                  {node.nextActions.map((act, i) => (
                    <li key={act} className="surface flex items-center gap-2 rounded-lg px-3 py-2 text-[0.82rem] text-ink-2">
                      <span className="font-mono text-[0.7rem] text-muted">{i + 1}</span>
                      {act}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );

  if (!sheet) return card;

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-black/55 backdrop-blur-sm animate-fadeIn" />
      <div className="relative min-h-0 w-full">{card}</div>
    </div>,
    document.body,
  );
}
