/* ============================================================
   subcells.ts
   ------------------------------------------------------------
   What each main cell splits into when you drill into it. Each
   sub-cell is a leaf that holds data records (see items.ts).
   Kept separate so coreData stays about the eight main cells.
   ============================================================ */
import type { SubCell } from "../types";

export const childrenByCell: Record<string, SubCell[]> = {
  memory: [
    { id: "mem-episodic", label: "Episodic", icon: "history" },
    { id: "mem-semantic", label: "Semantic", icon: "network" },
    { id: "mem-vectors", label: "Vectors", icon: "vector" },
    { id: "mem-pinned", label: "Pinned", icon: "bookmark" },
  ],
  tasks: [
    { id: "tsk-queue", label: "Queue", icon: "queue" },
    { id: "tsk-active", label: "Active", icon: "pulse" },
    { id: "tsk-blocked", label: "Blocked", icon: "lock" },
    { id: "tsk-done", label: "Done", icon: "check" },
  ],
  research: [
    { id: "rsc-sources", label: "Sources", icon: "doc" },
    { id: "rsc-questions", label: "Questions", icon: "branch" },
    { id: "rsc-synth", label: "Syntheses", icon: "layers" },
    { id: "rsc-threads", label: "Threads", icon: "route" },
  ],
  knowledge: [
    { id: "knw-domains", label: "Domains", icon: "network" },
    { id: "knw-entities", label: "Entities", icon: "target" },
    { id: "knw-relations", label: "Relations", icon: "route" },
    { id: "knw-gaps", label: "Gaps", icon: "alert" },
  ],
  studio: [
    { id: "std-image", label: "Image", icon: "image" },
    { id: "std-video", label: "Video", icon: "video" },
    { id: "std-audio", label: "Audio", icon: "audio" },
    { id: "std-copy", label: "Copy", icon: "pen" },
  ],
  decisions: [
    { id: "dec-open", label: "Open", icon: "flag" },
    { id: "dec-tradeoffs", label: "Tradeoffs", icon: "scale" },
    { id: "dec-criteria", label: "Criteria", icon: "target" },
    { id: "dec-log", label: "Log", icon: "history" },
  ],
  agents: [
    { id: "agt-running", label: "Running", icon: "pulse" },
    { id: "agt-idle", label: "Idle", icon: "clock" },
    { id: "agt-logs", label: "Logs", icon: "doc" },
    { id: "agt-policies", label: "Policies", icon: "shield" },
  ],
  inbox: [
    { id: "inb-unread", label: "Unread", icon: "mail" },
    { id: "inb-routed", label: "Routed", icon: "route" },
    { id: "inb-drafted", label: "Drafted", icon: "pen" },
    { id: "inb-flagged", label: "Flagged", icon: "flag" },
  ],
};

/** Flat lookup of every sub-cell by id, with its parent main-cell id. */
export const subCellParent = new Map<string, string>();
for (const [parentId, subs] of Object.entries(childrenByCell)) {
  for (const sub of subs) subCellParent.set(sub.id, parentId);
}
