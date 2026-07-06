import { AnimatePresence, motion } from "framer-motion";
import type { ViewMode } from "../UniverseModule";

interface TopBarProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  showReset: boolean;
  onReset: () => void;
  /** Persistent way back to the Assist Intelligence home. */
  onExit: () => void;
}

const TABS: { id: ViewMode; label: string }[] = [
  { id: "map", label: "Map" },
  { id: "dash", label: "Dashboards" },
];

export default function TopBar({ mode, onModeChange, showReset, onReset, onExit }: TopBarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between px-[22px]">
      <div className="flex items-center gap-3.5">
        <button
          onClick={onExit}
          aria-label="Back to Assist"
          title="Back to Assist (Esc)"
          className="inline-flex items-center gap-2 rounded-full border border-u-hair bg-u-panel px-[13px] py-[8px] text-[10px] font-medium uppercase tracking-[0.18em] text-u-muted transition-colors hover:border-u-line hover:text-u-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-u-accent"
        >
          <span aria-hidden className="text-[12px] leading-none">←</span>
          Assist
        </button>
        <div className="hidden flex-col gap-0.5 leading-none md:flex">
          <span className="font-u-display text-[19px] tracking-[0.02em]">Doğan Karaca</span>
          <span className="hidden text-[9.5px] uppercase tracking-[0.22em] text-u-muted sm:block">
            Knowledge Universe
          </span>
        </div>
      </div>

      <nav
        className="absolute left-1/2 top-[14px] flex -translate-x-1/2 gap-0.5 rounded-full border border-u-hair bg-u-panel p-1"
        style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 8px 24px -18px rgba(0,0,0,0.25)" }}
        role="tablist"
        aria-label="View mode"
      >
        {TABS.map((tab) => {
          const selected = mode === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selected}
              onClick={() => onModeChange(tab.id)}
              className={`rounded-full px-[18px] py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ease-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-u-accent ${
                selected ? "bg-u-ink text-u-bg" : "bg-transparent text-u-muted hover:text-u-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <AnimatePresence>
        {showReset ? (
          <motion.button
            key="reset"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={onReset}
            aria-label="Return to overview"
            className="inline-flex items-center gap-2 rounded-full border border-u-hair bg-u-panel px-[14px] py-[9px] text-[10.5px] font-medium uppercase tracking-[0.18em] text-u-ink transition-colors hover:border-u-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-u-accent"
          >
            <span className="h-[5px] w-[5px] rounded-full bg-u-accent" />
            Overview
          </motion.button>
        ) : (
          // Keep layout balanced when the reset button is hidden.
          <span aria-hidden className="w-[1px]" />
        )}
      </AnimatePresence>
    </header>
  );
}
