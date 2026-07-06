/* ============================================================
   App.tsx  (AppShell)
   ------------------------------------------------------------
   The calm personal-AI operating system.

   OVERVIEW  the Assist Core + eight cells, quiet and static.
             The Right Console answers "what needs attention?".
   SELECT    click a cell -> it highlights, its connections light
             up, and its Cell layer opens on the right (tabs:
             Overview / Items / Relations / Actions).
   FOCUS     "Focus this cell" (or the view toggle) centers the
             cell and reveals its sub-cells around it.
   CAPTURE   "Ask the core…" adds a note/decision/task to the
             inferred (or chosen) cell, saved to localStorage.
   ============================================================ */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import TopStatusBar from "./components/TopStatusBar";
import HoneycombMap from "./components/HoneycombMap";
import HoneycombDetailPanel from "./components/HoneycombDetailPanel";
import RightConsole from "./components/RightConsole";
import ViewModeToggle from "./components/ViewModeToggle";
import { iconFor } from "./lib/icons";
import { accent } from "./lib/accents";
import { subCellToView } from "./lib/cells";
import { consoleData, honeycombById } from "./data/coreData";
import { childrenByCell, subCellParent } from "./data/subcells";
import { attention, recommendations } from "./data/panels";
import { loadItems, persistItems } from "./lib/itemsStore";
import type { Accent, CoreData, DataItem, MapCell, UniverseLink } from "./types";

const MOBILE_BREAKPOINT = 980;

interface AppProps {
  /** False while the Universe layer covers the shell — mutes global keys. */
  active?: boolean;
  /** Enter the Universe layer (full overview, a domain, or a node). */
  onOpenUniverse?: (target?: Pick<UniverseLink, "domain" | "node">) => void;
  /** One-shot select request from the global palette (n = nonce). */
  selectRequest?: { id: string; n: number } | null;
  /** Open the global ⌘K palette (rendered by AppShell). */
  onOpenPalette?: () => void;
}

export default function App({ active = true, onOpenUniverse, selectRequest, onOpenPalette }: AppProps) {
  const { core, nodes } = consoleData;

  /** Focus Mode: which main cell is centered (its sub-cells shown). */
  const [focusId, setFocusId] = useState<string | null>(null);
  const focusRef = useRef<string | null>(null);
  focusRef.current = focusId;
  /** The cell whose detail layer is open on the right. */
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  selectedRef.current = selectedId;
  const triggerRef = useRef<HTMLElement | null>(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false,
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // --- data records ---
  const [itemsByCell, setItemsByCell] = useState<Record<string, DataItem[]>>(loadItems);
  // Coming back from the Universe: pick up anything it sent to a cell.
  useEffect(() => {
    if (active) setItemsByCell(loadItems());
  }, [active]);
  const addItem = useCallback((cellId: string, title: string, note?: string) => {
    setItemsByCell((prev) => {
      const item: DataItem = { id: `${cellId}-${Date.now()}`, title, note, tag: "added" };
      const next = { ...prev, [cellId]: [item, ...(prev[cellId] ?? [])] };
      persistItems(next);
      return next;
    });
  }, []);
  const removeItem = useCallback((cellId: string, itemId: string) => {
    setItemsByCell((prev) => {
      const next = { ...prev, [cellId]: (prev[cellId] ?? []).filter((i) => i.id !== itemId) };
      persistItems(next);
      return next;
    });
  }, []);

  // --- selection / focus ---
  const select = useCallback((id: string) => {
    if (selectedRef.current === null) triggerRef.current = (document.activeElement as HTMLElement) ?? null;
    setSelectedId(id);
  }, []);
  const closeDetail = useCallback(() => {
    setSelectedId(null);
    const t = triggerRef.current;
    triggerRef.current = null;
    if (t && document.body.contains(t)) requestAnimationFrame(() => t.focus());
  }, []);
  const enterFocus = useCallback((id: string) => {
    if (!childrenByCell[id]) return;
    setFocusId(id);
    setSelectedId(id);
  }, []);
  const exitFocus = useCallback(() => {
    setFocusId(null);
    setSelectedId(null);
  }, []);

  const onCellClick = useCallback(
    (cell: MapCell) => {
      // Cells marked "direct" are doors into the Universe layer.
      const link = honeycombById.get(cell.id)?.universeLink;
      if (link?.open === "direct" && onOpenUniverse) {
        onOpenUniverse({ domain: link.domain, node: link.node });
        return;
      }
      select(cell.id);
    },
    [select, onOpenUniverse],
  );
  const onCenterClick = useCallback(() => {
    if (focusRef.current) exitFocus();
    else select("core");
  }, [exitFocus, select]);
  const onSelectRelated = useCallback(
    (id: string) => {
      if (focusRef.current) setFocusId(null);
      select(id);
    },
    [select],
  );

  // Global palette: select a cell / sub-cell on request.
  useEffect(() => {
    if (!selectRequest) return;
    const { id } = selectRequest;
    if (id === "core" || honeycombById.has(id)) {
      setFocusId(null);
      setSelectedId(id);
    } else if (subCellParent.has(id)) {
      setFocusId(subCellParent.get(id)!);
      setSelectedId(id);
    }
  }, [selectRequest]);

  // Deep-link ?node=<id>
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("node");
    if (!id) return;
    if (id === "core" || honeycombById.has(id)) setSelectedId(id);
    else if (subCellParent.has(id)) {
      setFocusId(subCellParent.get(id)!);
      setSelectedId(id);
    }
  }, []);

  // Escape: close the cell layer, else exit focus. Muted under the Universe.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selectedRef.current) closeDetail();
      else if (focusRef.current) exitFocus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDetail, exitFocus, active]);

  // --- current graph level ---
  const rootRelations = useMemo<Array<[string, string]>>(() => {
    const seen = new Set<string>();
    const out: Array<[string, string]> = [];
    nodes.forEach((n) =>
      n.relatedNodes.forEach((r) => {
        if (r === "core" || !honeycombById.has(r)) return;
        const key = [n.id, r].sort().join("|");
        if (seen.has(key)) return;
        seen.add(key);
        out.push([n.id, r]);
      }),
    );
    return out;
  }, [nodes]);

  const level = useMemo(() => {
    if (!focusId) {
      const cells: MapCell[] = nodes.map((n) => ({
        id: n.id,
        label: n.shortLabel,
        icon: n.icon,
        accent: n.accent,
        stat: n.stat,
        statLabel: n.statLabel,
        status: n.status,
        drillable: true,
      }));
      return { drilled: false, centerKind: "core" as const, centerCell: undefined, cells, relations: rootRelations, parent: null };
    }
    const parent = honeycombById.get(focusId);
    const subs = childrenByCell[focusId] ?? [];
    const cells: MapCell[] = subs.map((sub) => ({
      id: sub.id,
      label: sub.label,
      icon: sub.icon,
      accent: parent?.accent ?? "cyan",
      stat: String((itemsByCell[sub.id] ?? []).length),
      statLabel: "records",
      status: "online" as const,
      drillable: false,
    }));
    const relations: Array<[string, string]> = subs.map((s, i) => [s.id, subs[(i + 1) % subs.length].id]);
    const centerCell: MapCell | undefined = parent
      ? { id: parent.id, label: parent.title, icon: parent.icon, accent: parent.accent, stat: parent.stat, statLabel: parent.statLabel, status: parent.status, drillable: false }
      : undefined;
    return { drilled: true, centerKind: "cell" as const, centerCell, cells, relations, parent: parent ?? null };
  }, [focusId, nodes, rootRelations, itemsByCell]);

  // Related cells to highlight in overview (the selected main cell's links).
  const relatedIds = useMemo(() => {
    if (focusId || !selectedId || selectedId === "core") return [];
    return honeycombById.get(selectedId)?.relatedNodes ?? [];
  }, [focusId, selectedId]);

  // --- open cell view ---
  const detail = useMemo(() => {
    if (!selectedId) return null;
    if (selectedId === "core") return core;
    if (honeycombById.has(selectedId)) return honeycombById.get(selectedId)!;
    const parentId = subCellParent.get(selectedId);
    const parent = parentId ? honeycombById.get(parentId) : undefined;
    const sub = parentId ? childrenByCell[parentId]?.find((s) => s.id === selectedId) : undefined;
    if (parent && sub) return subCellToView(sub, parent, (itemsByCell[selectedId] ?? []).length);
    return null;
  }, [selectedId, core, itemsByCell]);

  const detailCanFocus =
    !!selectedId && selectedId !== "core" && !!childrenByCell[selectedId] && !focusId;

  const targets = useMemo(() => nodes.map((n) => ({ id: n.id, label: n.title })), [nodes]);
  const canFocusSelected = !!selectedId && !!childrenByCell[selectedId];

  return (
    <div className="flex min-h-screen flex-col">
      <TopStatusBar core={core} onOpenPalette={onOpenPalette} />

      <main className="flex min-h-0 flex-1 flex-col gap-4 p-4 cockpit:flex-row">
        {/* graph canvas */}
        <div className="relative min-h-[62vh] flex-1 overflow-hidden rounded-2xl border border-line cockpit:min-h-0">
          {/* breadcrumb (focus) */}
          {level.drilled && level.parent && (
            <div className="absolute left-4 top-4 z-30 flex items-center gap-1.5">
              <button
                type="button"
                onClick={exitFocus}
                className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.78rem] text-muted outline-none transition-colors duration-200 hover:text-ink focus-visible:ring-2 focus-visible:ring-cyan/50"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
                Assist Core
              </button>
              <ChevronRight className="h-3.5 w-3.5 text-muted/50" strokeWidth={1.8} />
              <span className={`rounded-full px-2.5 py-1 text-[0.78rem] font-medium ${accent(level.parent.accent).badge}`}>
                {level.parent.title}
              </span>
            </div>
          )}

          {/* view toggle */}
          {!isMobile && (
            <div className="absolute right-4 top-4 z-30">
              <ViewModeToggle
                mode={level.drilled ? "focus" : "overview"}
                canFocus={canFocusSelected}
                onOverview={exitFocus}
                onFocus={() => selectedId && enterFocus(selectedId)}
              />
            </div>
          )}

          {isMobile ? (
            <MobileGrid level={level} core={core} onCellClick={onCellClick} onCenterClick={onCenterClick} onBack={exitFocus} />
          ) : (
            <HoneycombMap
              core={core}
              centerKind={level.centerKind}
              centerCell={level.centerCell}
              cells={level.cells}
              relations={level.relations}
              selectedId={selectedId}
              relatedIds={relatedIds}
              onCellClick={onCellClick}
              onCenterClick={onCenterClick}
              onClear={() => selectedId && !isMobile && closeDetail()}
            />
          )}
        </div>

        {/* right column: cell layer (when selected) or operational console */}
        <aside className="flex min-h-0 w-full shrink-0 flex-col cockpit:w-[24rem]">
          {detail && !isMobile ? (
            <HoneycombDetailPanel
              node={detail}
              variant="panel"
              items={itemsByCell[detail.id] ?? []}
              onAdd={(title, note) => addItem(detail.id, title, note)}
              onRemove={(itemId) => removeItem(detail.id, itemId)}
              onClose={closeDetail}
              onSelectRelated={onSelectRelated}
              onFocus={() => enterFocus(detail.id)}
              canFocus={detailCanFocus}
              onOpenUniverse={onOpenUniverse}
            />
          ) : (
            <RightConsole
              core={core}
              attention={attention}
              recommendations={recommendations}
              targets={targets}
              onPick={select}
              onAdd={addItem}
            />
          )}
        </aside>
      </main>

      {/* mobile cell sheet */}
      {detail && isMobile && (
        <HoneycombDetailPanel
          node={detail}
          variant="sheet"
          items={itemsByCell[detail.id] ?? []}
          onAdd={(title, note) => addItem(detail.id, title, note)}
          onRemove={(itemId) => removeItem(detail.id, itemId)}
          onClose={closeDetail}
          onSelectRelated={onSelectRelated}
          onFocus={() => enterFocus(detail.id)}
          canFocus={detailCanFocus}
          onOpenUniverse={onOpenUniverse}
        />
      )}
    </div>
  );
}

/* ---------- mobile: level-aware cell grid ---------- */
interface Level {
  drilled: boolean;
  cells: MapCell[];
  parent: { title: string; accent: Accent } | null;
}
function MobileGrid({
  level,
  core,
  onCellClick,
  onCenterClick,
  onBack,
}: {
  level: Level;
  core: CoreData;
  onCellClick: (cell: MapCell) => void;
  onCenterClick: () => void;
  onBack: () => void;
}) {
  const CoreIcon = iconFor("core");
  return (
    <div className="absolute inset-0 overflow-y-auto p-4">
      {level.drilled && level.parent ? (
        <button type="button" onClick={onBack} className="surface mb-4 flex w-full items-center gap-3 rounded-2xl p-4 text-left">
          <ArrowLeft className="h-5 w-5 text-muted" strokeWidth={1.8} />
          <div>
            <div className="kicker">Back to Assist Core</div>
            <div className={`text-[1rem] font-semibold ${accent(level.parent.accent).text}`}>{level.parent.title}</div>
          </div>
        </button>
      ) : (
        <button type="button" onClick={onCenterClick} className="glass mb-4 flex w-full items-center gap-3 rounded-2xl p-4 text-left">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ background: "radial-gradient(circle at 50% 34%, rgba(94,234,212,0.24), rgba(16,22,38,0.96) 62%)", border: "1px solid rgba(94,234,212,0.32)" }}
          >
            <CoreIcon className="h-5 w-5 text-cyan" strokeWidth={1.5} />
          </span>
          <div>
            <div className="text-[1rem] font-semibold text-ink">{core.title}</div>
            <div className="kicker mt-0.5">Context Orchestration Hub</div>
          </div>
        </button>
      )}

      <div className="grid grid-cols-2 gap-3">
        {level.cells.map((cell) => {
          const Icon = iconFor(cell.icon);
          const a = accent(cell.accent);
          return (
            <button
              key={cell.id}
              type="button"
              onClick={() => onCellClick(cell)}
              className="surface flex flex-col items-start gap-1 rounded-xl p-3 text-left transition-colors duration-200 hover:border-line-strong"
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${a.soft}`}>
                <Icon className={`h-4 w-4 ${a.text}`} strokeWidth={1.6} />
              </span>
              <span className="mt-1 text-[0.9rem] font-semibold text-ink">{cell.label}</span>
              <span className="font-mono text-[0.95rem] font-semibold text-ink">{cell.stat}</span>
              <span className="kicker">{cell.statLabel ?? (cell.drillable ? "open" : "records")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
