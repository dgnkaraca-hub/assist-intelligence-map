/* ============================================================
   panels.ts
   ------------------------------------------------------------
   Operational content for the Right Console: what needs
   attention today, and suggested next moves. Placeholder copy
   with a real shape — each item points at the cell it concerns.
   ============================================================ */
import type { Accent, IconKey, Recommendation } from "../types";

export interface AttentionItem {
  id: string;
  /** Short status tag, e.g. "3 waiting", "running", "surfaced". */
  kicker: string;
  title: string;
  detail: string;
  icon: IconKey;
  accent: Accent;
  nodeId: string;
}

/** "What needs attention today?" — the console's primary feed. */
export const attention: AttentionItem[] = [
  {
    id: "att-decisions",
    kicker: "3 waiting on you",
    title: "Decisions awaiting input",
    detail: "Two are time-boxed; the studio direction unblocks four tasks.",
    icon: "decisions",
    accent: "amber",
    nodeId: "decisions",
  },
  {
    id: "att-research",
    kicker: "running",
    title: "Research agent · 6 threads",
    detail: "Citing as it goes — findings will route into Knowledge.",
    icon: "research",
    accent: "purple",
    nodeId: "research",
  },
  {
    id: "att-memory",
    kicker: "surfaced",
    title: "Memory recalled 37 facts",
    detail: "Grounding the running agents; nothing stale surfaced.",
    icon: "memory",
    accent: "teal",
    nodeId: "memory",
  },
];

/** Suggested next moves. */
export const recommendations: Recommendation[] = [
  {
    id: "rec1",
    title: "Resolve 3 open decisions",
    detail: "Two are time-boxed; the studio direction unblocks four downstream tasks.",
    accent: "amber",
    nodeId: "decisions",
  },
  {
    id: "rec2",
    title: "Promote verified research",
    detail: "42 sources gathered — fold the confirmed findings into the Knowledge map.",
    accent: "purple",
    nodeId: "research",
  },
  {
    id: "rec3",
    title: "Clear the inbox backlog",
    detail: "9 unread signals; 11 drafts ready for a one-tap send.",
    accent: "teal",
    nodeId: "inbox",
  },
];
