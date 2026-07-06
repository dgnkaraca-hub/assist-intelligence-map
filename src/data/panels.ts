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
    kicker: "1 waiting on you",
    title: "Project priority is undecided",
    detail: "DH research, music & teaching, or video — season planning is blocked on this call.",
    icon: "decisions",
    accent: "amber",
    nodeId: "decisions",
  },
  {
    id: "att-inbox",
    kicker: "waiting on organizer",
    title: "Croatia Handpan Festival",
    detail: "Invitation from Ivan Judas — passport details submitted; the process is in the organizer's hands now.",
    icon: "inbox",
    accent: "rose",
    nodeId: "inbox",
  },
  {
    id: "att-research",
    kicker: "published",
    title: "Anatolian Crossroads is live",
    detail: "DOI + live atlas with three completed modules — momentum worth using.",
    icon: "research",
    accent: "purple",
    nodeId: "research",
  },
];

/** Suggested next moves. */
export const recommendations: Recommendation[] = [
  {
    id: "rec1",
    title: "Decide the project priority",
    detail: "One open call is blocking season planning — time-box it and log the outcome.",
    accent: "amber",
    nodeId: "decisions",
  },
  {
    id: "rec2",
    title: "Announce Anatolian Crossroads",
    detail: "The DOI release and live atlas are ready to share — academic and public channels.",
    accent: "purple",
    nodeId: "research",
  },
  {
    id: "rec3",
    title: "Track the Croatia festival process",
    detail: "Passport submitted — set a follow-up with Ivan Judas and log the dates once confirmed.",
    accent: "teal",
    nodeId: "inbox",
  },
];
