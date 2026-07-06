/* ============================================================
   ViewModeToggle.tsx
   ------------------------------------------------------------
   Segmented Overview / Focus control. Overview shows every cell
   around the Core; Focus centers the selected cell and reveals
   its sub-cells. Focus is disabled until a focusable cell is
   selected.
   ============================================================ */
import { LayoutGrid, Crosshair } from "lucide-react";

interface ViewModeToggleProps {
  mode: "overview" | "focus";
  canFocus: boolean;
  onOverview: () => void;
  onFocus: () => void;
}

export default function ViewModeToggle({ mode, canFocus, onOverview, onFocus }: ViewModeToggleProps) {
  return (
    <div className="glass inline-flex items-center gap-0.5 rounded-full p-0.5 text-[0.76rem]">
      <button
        type="button"
        onClick={onOverview}
        aria-pressed={mode === "overview"}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors duration-200 ${
          mode === "overview" ? "bg-cyan/15 text-cyan" : "text-muted hover:text-ink"
        }`}
      >
        <LayoutGrid className="h-3.5 w-3.5" strokeWidth={1.8} />
        Overview
      </button>
      <button
        type="button"
        onClick={onFocus}
        disabled={!canFocus && mode !== "focus"}
        aria-pressed={mode === "focus"}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors duration-200 ${
          mode === "focus"
            ? "bg-cyan/15 text-cyan"
            : canFocus
              ? "text-muted hover:text-ink"
              : "cursor-not-allowed text-muted/40"
        }`}
      >
        <Crosshair className="h-3.5 w-3.5" strokeWidth={1.8} />
        Focus
      </button>
    </div>
  );
}
