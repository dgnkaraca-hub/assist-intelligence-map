/* ============================================================
   GlobalPalette.tsx
   ------------------------------------------------------------
   The ONE ⌘K palette for the whole product, mounted by AppShell
   above both layers. It searches:

     · Assist cells and sub-cells        → select on the map
     · Assist records (localStorage)     → open the owning cell
     · Universe domains and nodes        → deep-link into #/universe
     · Selected works                    → open the external link
     · Views (home / map / dashboards)   → switch layers

   Escape/arrow keys are handled here in the CAPTURE phase so the
   layer-level key handlers underneath never see them while the
   palette is open.
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { consoleData } from "../data/coreData";
import { childrenByCell } from "../data/subcells";
import { KIND_LABEL, mapData } from "../data/universeData";
import { loadItems } from "../lib/itemsStore";

interface PaletteItem {
  key: string;
  label: string;
  sub: string;
  /** Lowercased haystack the query is matched against. */
  haystack: string;
  /** Tie-breaker: records (1) sort after structural results (0). */
  weight?: number;
  run: () => void;
}

interface GlobalPaletteProps {
  open: boolean;
  onClose: () => void;
  /** Navigate to a #/universe... hash (enters the Universe if needed). */
  onGoHash: (hash: string) => void;
  /** Return to the Assist home and (optionally) select a cell / sub-cell. */
  onGoAssist: (cellId?: string) => void;
}

export default function GlobalPalette({ open, onClose, onGoHash, onGoAssist }: GlobalPaletteProps) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Reset on open; focus the input once it exists.
  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Escape closes the palette before any layer underneath reacts.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  const items = useMemo<PaletteItem[]>(() => {
    if (!open) return [];
    const out: PaletteItem[] = [
      {
        key: "view-assist",
        label: "Assist home",
        sub: "View",
        haystack: "assist home command center console core overview",
        run: () => onGoAssist(),
      },
      {
        key: "view-universe",
        label: "Universe — overview map",
        sub: "View",
        haystack: "universe map knowledge overview honeycomb constellation",
        run: () => onGoHash("#/universe"),
      },
      {
        key: "view-dash",
        label: "Universe — Dashboards",
        sub: "View",
        haystack: "universe dashboards reading works skills contact",
        run: () => onGoHash("#/universe/dash"),
      },
    ];

    // Assist cells + sub-cells.
    const cells = [consoleData.core, ...consoleData.nodes];
    cells.forEach((c) => {
      out.push({
        key: `cell-${c.id}`,
        label: c.title,
        sub: `Cell · ${c.category}`,
        haystack: `${c.title} ${c.category} ${c.description} ${c.tags.join(" ")}`.toLowerCase(),
        run: () => onGoAssist(c.id),
      });
      (childrenByCell[c.id] ?? []).forEach((sub) => {
        out.push({
          key: `sub-${sub.id}`,
          label: sub.label,
          sub: `Sub-cell · ${c.title}`,
          haystack: `${sub.label} ${c.title}`.toLowerCase(),
          run: () => onGoAssist(sub.id),
        });
      });
    });

    // Assist records (re-read on every open so fresh sends are searchable).
    const itemsByCell = loadItems();
    Object.entries(itemsByCell).forEach(([cellId, records]) => {
      records.forEach((r) => {
        out.push({
          key: `rec-${r.id}`,
          label: r.title,
          sub: `Record · ${cellId}`,
          haystack: `${r.title} ${r.note ?? ""} ${r.tag ?? ""}`.toLowerCase(),
          weight: 1,
          run: () => onGoAssist(cellId),
        });
      });
    });

    // Universe domains + nodes.
    mapData.domains.forEach((d) => {
      out.push({
        key: `udom-${d.id}`,
        label: d.label,
        sub: `Universe · Domain · ${d.children.length} facets`,
        haystack: `${d.label} ${d.blurb} universe domain`.toLowerCase(),
        run: () => onGoHash(`#/universe/domain/${d.id}`),
      });
      d.children.forEach((c) => {
        out.push({
          key: `unode-${c.id}`,
          label: c.label,
          sub: `Universe · ${d.label} · ${KIND_LABEL[c.type]}`,
          haystack: `${c.label} ${c.tip} ${d.label} ${KIND_LABEL[c.type]} ${(c.tags ?? []).join(" ")}`.toLowerCase(),
          run: () => onGoHash(`#/universe/node/${c.id}`),
        });
      });
    });

    // Selected works with external links.
    mapData.selectedWorks.forEach((w) => {
      if (!w.url) return;
      const url = w.url;
      out.push({
        key: `work-${w.title}`,
        label: w.title,
        sub: `Selected work · ${w.meta}`,
        haystack: `${w.title} ${w.meta} ${w.desc} selected work`.toLowerCase(),
        run: () => window.open(url, "_blank", "noopener,noreferrer"),
      });
    });

    return out;
  }, [open, onGoAssist, onGoHash]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 12);
    const words = q.split(/\s+/);
    const hits = items.filter((it) => words.every((w) => it.haystack.includes(w)));
    // Exact label > label prefix > the rest; within a tier, structural results
    // (cells, universe nodes, views) come before loose records.
    const score = (it: PaletteItem) => {
      const l = it.label.toLowerCase();
      return l === q ? 2 : l.startsWith(q) ? 1 : 0;
    };
    hits.sort((a, b) => score(b) - score(a) || (a.weight ?? 0) - (b.weight ?? 0));
    return hits.slice(0, 12);
  }, [items, query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [index, results]);

  if (!open) return null;

  const pick = (it: PaletteItem) => {
    onClose();
    it.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Keep arrows/enter away from the layer-level key handlers.
    if (e.key === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      const it = results[Math.min(index, results.length - 1)];
      if (it) pick(it);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.stopPropagation(); // don't cycle Universe domains while typing
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 px-4 pb-4 pt-[14vh] backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="glass w-full max-w-[560px] overflow-hidden rounded-2xl shadow-lift"
        role="dialog"
        aria-modal="true"
        aria-label="Search Assist and the Universe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 border-b border-line px-4">
          <Search className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.8} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search cells, records, universe nodes…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onKeyDown}
            aria-label="Search Assist and the Universe"
            className="w-full bg-transparent py-3.5 text-[0.95rem] text-ink outline-none placeholder:text-muted"
          />
          <span className="kicker shrink-0">⌘K</span>
        </div>

        <div ref={listRef} className="max-h-[min(46vh,380px)] overflow-y-auto p-1.5" role="listbox" aria-label="Results">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-center text-[0.84rem] text-muted">Nothing matches “{query}”.</div>
          ) : (
            results.map((it, i) => (
              <button
                key={it.key}
                data-active={i === index}
                role="option"
                aria-selected={i === index}
                onMouseEnter={() => setIndex(i)}
                onClick={() => pick(it)}
                className={`flex w-full items-baseline justify-between gap-3 rounded-lg px-3 py-2.5 text-left ${
                  i === index ? "bg-cyan/10 text-ink" : "text-ink-2"
                }`}
              >
                <span className="truncate text-[0.88rem]">{it.label}</span>
                <span className="kicker shrink-0 normal-case tracking-[0.08em]">{it.sub}</span>
              </button>
            ))
          )}
        </div>

        <div className="flex gap-4 border-t border-line px-4 py-2.5" aria-hidden>
          <span className="kicker">↑↓ navigate</span>
          <span className="kicker">↵ open</span>
          <span className="kicker">esc close</span>
        </div>
      </div>
    </div>
  );
}
