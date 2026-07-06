/* ============================================================
   MetricCard.tsx
   ------------------------------------------------------------
   A single key-metric card for the detail panel: a big mono
   value over an uppercase label, on a rounded dark surface.
   ============================================================ */
import { accent } from "../lib/accents";
import type { Accent, Metric } from "../types";

interface MetricCardProps {
  metric: Metric;
  accentKey: Accent;
}

export default function MetricCard({ metric, accentKey }: MetricCardProps) {
  const a = accent(accentKey);
  return (
    <div className="rounded-xl border border-line bg-bg-deep/50 px-3 py-2.5">
      <div className={`font-mono text-lg font-semibold leading-tight ${a.text}`}>
        {metric.value}
      </div>
      <div className="mt-0.5 text-[0.62rem] uppercase tracking-wider text-muted">
        {metric.label}
      </div>
    </div>
  );
}
