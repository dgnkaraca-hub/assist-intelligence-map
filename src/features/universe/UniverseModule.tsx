/* ============================================================
   UniverseModule.tsx
   ------------------------------------------------------------
   The dogan-knowledge-map app, hosted as a full-screen feature
   module inside the Assist Intelligence shell. Its styles are
   scoped under .universe-root (universe.css) and its deep links
   live in the #/universe/... hash namespace owned by AppShell.
   ============================================================ */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KIND_LABEL, mapData, type ChildNode, type Domain } from "../../data/universeData";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import TopBar from "./components/TopBar";
import MapView from "./components/MapView";
import Dashboards from "./components/Dashboards";
import DetailDrawer, { type RelatedItem } from "./components/DetailDrawer";
import "./universe.css";

export type ViewMode = "map" | "dash";

/** The node currently shown in the detail drawer, with its domain context. */
export interface Selection {
  domainLabel: string;
  node: ChildNode;
}

interface UniverseModuleProps {
  /** Leave the Universe and return to the Assist home. */
  onExit: () => void;
  /** Capture a Universe node into an Assist cell ("Send to Assist"). */
  onSendToAssist?: (node: ChildNode) => void;
}

export default function UniverseModule({ onExit, onSendToAssist }: UniverseModuleProps) {
  const reduceMotion = usePrefersReducedMotion();

  const [mode, setMode] = useState<ViewMode>("map");
  const [focus, setFocus] = useState<string | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);

  const closeDrawer = useCallback(() => setSelection(null), []);

  const resetFocus = useCallback(() => {
    setFocus(null);
    setSelection(null);
  }, []);

  const handleModeChange = useCallback(
    (next: ViewMode) => {
      setMode(next);
      if (next !== "map") {
        setSelection(null);
      }
    },
    [],
  );

  const handleFocusDomain = useCallback((id: string) => {
    setSelection(null);
    setFocus((prev) => (prev === id ? null : id));
  }, []);

  const handleSetFocus = useCallback((id: string) => {
    setSelection(null);
    setFocus(id);
  }, []);

  const handleOpenChild = useCallback((domain: Domain, child: ChildNode) => {
    setSelection({ domainLabel: domain.label, node: child });
  }, []);

  /** id -> { domain, child } for every leaf, used by palette + related nodes. */
  const childById = useMemo(() => {
    const m = new Map<string, { domain: Domain; child: ChildNode }>();
    mapData.domains.forEach((d) => d.children.forEach((c) => m.set(c.id, { domain: d, child: c })));
    return m;
  }, []);

  /** Open a node's drawer by id (used by the palette and related-node links). */
  const openNodeById = useCallback(
    (id: string) => {
      const rec = childById.get(id);
      if (!rec) return;
      setMode("map");
      setSelection({ domainLabel: rec.domain.label, node: rec.child });
    },
    [childById],
  );

  /** Related nodes for the drawer, derived from the relation threads. */
  const related = useMemo<RelatedItem[]>(() => {
    const node = selection?.node;
    if (!node) return [];
    const out: RelatedItem[] = [];
    const seen = new Set<string>();
    mapData.relations.forEach((r) => {
      let otherId: string | null = null;
      if (r.from === node.id) otherId = r.to;
      else if (r.to === node.id) otherId = r.from;
      if (!otherId || seen.has(otherId)) return;
      const rec = childById.get(otherId);
      if (!rec) return;
      seen.add(otherId);
      out.push({
        id: otherId,
        label: rec.child.label,
        domainLabel: rec.domain.label,
        kindLabel: KIND_LABEL[rec.child.type],
        relationLabel: r.label,
        relationType: r.type,
      });
    });
    // Explicit relatedIds from the data, after the thread-derived ones.
    (node.relatedIds ?? []).forEach((id) => {
      if (seen.has(id)) return;
      const rec = childById.get(id);
      if (!rec) return;
      seen.add(id);
      out.push({
        id,
        label: rec.child.label,
        domainLabel: rec.domain.label,
        kindLabel: KIND_LABEL[rec.child.type],
      });
    });
    return out;
  }, [selection, childById]);

  // Global keys: Esc closes the drawer, then the focused branch, then exits
  // to Assist. Arrows cycle domains while focused. (⌘K lives in AppShell.)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selection) setSelection(null);
        else if (focus) resetFocus();
        else onExit(); // nothing open — leave the Universe
        return;
      }
      if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && focus && !selection) {
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const i = mapData.domains.findIndex((d) => d.id === focus);
        if (i < 0) return;
        const next = (i + dir + mapData.domains.length) % mapData.domains.length;
        setFocus(mapData.domains[next].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selection, focus, resetFocus, onExit]);

  // Deep-linking: read the view (#/universe/dash), focused domain
  // (#/universe/domain/<id>) or node (#/universe/node/<id>) from the URL hash
  // on load and on back/forward, so all are shareable and survive reload.
  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith("#/universe")) return; // shell is taking us elsewhere
      if (hash === "#/universe/dash") {
        setMode("dash");
        setSelection(null);
        setFocus(null);
        return;
      }
      const node = hash.match(/^#\/universe\/node\/(.+)$/)?.[1];
      if (node && childById.has(node)) {
        const rec = childById.get(node)!;
        setMode("map");
        setSelection({ domainLabel: rec.domain.label, node: rec.child });
        return;
      }
      const id = hash.match(/^#\/universe\/domain\/(.+)$/)?.[1];
      if (id && mapData.domains.some((d) => d.id === id)) {
        setMode("map");
        setSelection(null);
        setFocus(id);
      } else {
        setFocus(null);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [childById]);

  // Reflect view + focus back into the hash (replaceState avoids history spam
  // and any feedback loop). The first run is skipped so the read above wins.
  const hashSyncedRef = useRef(false);
  useEffect(() => {
    if (!hashSyncedRef.current) {
      hashSyncedRef.current = true;
      return;
    }
    const current = window.location.hash;
    if (!current.startsWith("#/universe")) return; // exiting — leave the hash alone
    const next =
      mode === "dash" ? "#/universe/dash" : focus ? `#/universe/domain/${focus}` : "#/universe";
    // A resting map must not clobber a node deep-link (drawer state isn't
    // reflected in the hash — only the palette / deep links write node URLs).
    if (next === "#/universe" && current.startsWith("#/universe/node/")) return;
    if (current !== next) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search + next);
    }
  }, [focus, mode]);

  return (
    <div className="universe-root fixed inset-0 z-[60]">
      <TopBar
        mode={mode}
        onModeChange={handleModeChange}
        showReset={mode === "map" && focus !== null}
        onReset={resetFocus}
        onExit={onExit}
      />

      {/* Map stays mounted so the animation engine keeps its state. */}
      <MapView
        data={mapData}
        focus={focus}
        selectedId={selection?.node.id ?? null}
        reduceMotion={reduceMotion}
        active={mode === "map"}
        onFocusDomain={handleFocusDomain}
        onSetFocus={handleSetFocus}
        onOpenChild={handleOpenChild}
        onResetFocus={resetFocus}
      />

      {/* Dashboards overlay the map and replay their entrance on each visit. */}
      <AnimatePresence>
        {mode === "dash" ? (
          <motion.div
            key="dash"
            className="fixed inset-0 z-20 bg-u-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Dashboards data={mapData} onOpenMap={() => handleModeChange("map")} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <DetailDrawer
        selection={selection}
        related={related}
        onOpenNode={openNodeById}
        onClose={closeDrawer}
        onSendToAssist={onSendToAssist}
      />
    </div>
  );
}
