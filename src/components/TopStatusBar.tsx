/* ============================================================
   TopStatusBar.tsx
   ------------------------------------------------------------
   A slim, elegant top bar. Left: product identity. Right: live
   system status indicators. Quiet by design.
   ============================================================ */
import { Cpu, Boxes, BrainCircuit, Search } from "lucide-react";
import type { CoreData } from "../types";

interface TopStatusBarProps {
  core: CoreData;
  /** Open the global ⌘K palette. */
  onOpenPalette?: () => void;
}

export default function TopStatusBar({ core, onOpenPalette }: TopStatusBarProps) {
  const [cells, agents, context] = core.signals;
  const items = [
    { icon: Boxes, text: cells, tint: "text-cyan" },
    { icon: Cpu, text: agents, tint: "text-violet" },
    { icon: BrainCircuit, text: context, tint: "text-teal" },
  ];
  return (
    <header className="flex items-center gap-4 border-b border-line px-5 py-3">
      <div className="flex items-baseline gap-2">
        <span className="h-2 w-2 rounded-full bg-cyan shadow-glow" />
        <span className="text-[0.95rem] font-semibold tracking-tight text-ink">Assist Intelligence</span>
        <span className="kicker hidden sm:inline">Agent Console</span>
      </div>
      <div className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-1">
        {items.map(({ icon: Icon, text, tint }, i) => (
          <span
            key={i}
            className={`flex items-center gap-1.5 text-[0.76rem] text-muted ${i === 2 ? "hidden md:flex" : ""}`}
          >
            <Icon className={`h-3.5 w-3.5 ${tint}`} strokeWidth={1.6} />
            {text}
          </span>
        ))}
        {onOpenPalette && (
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Search everything (⌘K)"
            className="surface flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] text-muted outline-none transition-colors duration-200 hover:border-line-strong hover:text-ink focus-visible:ring-2 focus-visible:ring-cyan/50"
          >
            <Search className="h-3 w-3" strokeWidth={1.8} />
            <span className="font-mono">⌘K</span>
          </button>
        )}
      </div>
    </header>
  );
}
