/* ============================================================
   AppShell.tsx
   ------------------------------------------------------------
   The one persistent frame around the two layers of the product:

     ASSIST    the operational command center (src/App.tsx) —
               always mounted, always the home.
     UNIVERSE  the living archive / knowledge map
               (src/features/universe) — a full-screen module
               entered from the Assist home.

   The URL hash is the single source of truth for which layer is
   visible: any #/universe... hash shows the Universe on top of
   the (still mounted) Assist home, so state survives the trip.
     #/universe                overview map
     #/universe/dash           dashboards reading
     #/universe/domain/<id>    focused domain
     #/universe/node/<id>      node opened in the detail drawer
   ============================================================ */
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import AssistHome from "../App";
import GlobalPalette from "../components/GlobalPalette";
import { addItemToCell } from "../lib/itemsStore";
import type { UniverseLink } from "../types";
import type { ChildNode } from "../data/universeData";

// The Universe (framer-motion + d3-force) loads only when entered.
const UniverseModule = lazy(() => import("../features/universe/UniverseModule"));

const inUniverse = () => window.location.hash.startsWith("#/universe");

export default function AppShell() {
  const [universeOpen, setUniverseOpen] = useState(inUniverse);
  const [paletteOpen, setPaletteOpen] = useState(false);
  /** A one-shot "select this cell" request for the Assist layer (n = nonce). */
  const [selectRequest, setSelectRequest] = useState<{ id: string; n: number } | null>(null);

  useEffect(() => {
    const onHash = () => setUniverseOpen(inUniverse());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // ⌘K / Ctrl+K toggles the ONE global palette, wherever you are. Capture
  // phase, so neither layer's own key handling ever sees it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        e.stopPropagation();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  /** Enter the Universe — pushes a history entry so Back returns home. */
  const openUniverse = useCallback((target?: Pick<UniverseLink, "domain" | "node">) => {
    const hash = target?.node
      ? `#/universe/node/${target.node}`
      : target?.domain
        ? `#/universe/domain/${target.domain}`
        : "#/universe";
    window.location.hash = hash;
  }, []);

  /** Return to the Assist home. */
  const exitUniverse = useCallback(() => {
    window.history.pushState(null, "", window.location.pathname + window.location.search);
    // pushState doesn't fire hashchange — sync the view ourselves.
    setUniverseOpen(false);
  }, []);

  /** Universe → Assist capture: a node becomes an Inbox record. */
  const sendToAssist = useCallback((node: ChildNode) => {
    addItemToCell("inbox", node.label, node.tip);
  }, []);

  /** Palette: jump to a #/universe... hash (enters the Universe if needed). */
  const paletteGoHash = useCallback((hash: string) => {
    window.location.hash = hash;
  }, []);

  /** Palette: return to Assist and optionally select a cell / sub-cell. */
  const paletteGoAssist = useCallback(
    (cellId?: string) => {
      if (inUniverse()) exitUniverse();
      if (cellId) setSelectRequest((prev) => ({ id: cellId, n: (prev?.n ?? 0) + 1 }));
    },
    [exitUniverse],
  );

  return (
    <MotionConfig reducedMotion="user">
      {/* The Assist home stays mounted underneath so its state survives. */}
      <AssistHome
        active={!universeOpen}
        onOpenUniverse={openUniverse}
        selectRequest={selectRequest}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <AnimatePresence>
        {universeOpen && (
          <motion.div
            key="universe"
            className="fixed inset-0 z-[60]"
            initial={{ opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Suspense fallback={<div className="fixed inset-0 bg-black" aria-hidden />}>
              <UniverseModule onExit={exitUniverse} onSendToAssist={sendToAssist} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <GlobalPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onGoHash={paletteGoHash}
        onGoAssist={paletteGoAssist}
      />
    </MotionConfig>
  );
}
