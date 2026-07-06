/* ============================================================
   items.ts
   ------------------------------------------------------------
   The actual data records, keyed by LEAF cell id (the Core and
   every sub-cell). Drilling a main cell reveals its sub-cells;
   clicking a sub-cell opens its records here. App seeds from this
   and lets the user add/remove (persisted to localStorage).
   ============================================================ */
import type { DataItem } from "../types";

export const seedItemsByCell: Record<string, DataItem[]> = {
  core: [
    { id: "core-1", title: "8 cells wired", note: "All knowledge cells online", tag: "system" },
    { id: "core-2", title: "3 agents running", tag: "system" },
    { id: "core-3", title: "Context budget 72%", tag: "system" },
  ],

  // memory
  "mem-episodic": [
    { id: "mem-ep-1", title: "Session 2026-06-30 · cockpit build", tag: "log" },
    { id: "mem-ep-1b", title: "Studio session notes", tag: "log" },
  ],
  "mem-semantic": [
    { id: "mem-se-1", title: "Doğan's tone preferences", note: "warm, analog, wide", tag: "fact" },
    { id: "mem-se-2", title: "Project goals · Q3", tag: "fact" },
  ],
  "mem-vectors": [{ id: "mem-ve-1", title: "1,284 embeddings indexed", tag: "store" }],
  "mem-pinned": [
    { id: "mem-pi-1", title: "Hex axial-snap trick", note: "claim() avoids collisions", tag: "pinned" },
  ],

  // tasks
  "tsk-queue": [
    { id: "tsk-q-1", title: "Triage inbox backlog", tag: "queued" },
    { id: "tsk-q-2", title: "Schedule weekly review", tag: "queued" },
  ],
  "tsk-active": [{ id: "tsk-a-1", title: "Render Studio stills", tag: "running" }],
  "tsk-blocked": [{ id: "tsk-b-1", title: "Unblock decision #2", note: "waiting on you", tag: "blocked" }],
  "tsk-done": [
    { id: "tsk-d-1", title: "Wire data console", tag: "done" },
    { id: "tsk-d-2", title: "Ship hexagon cells", tag: "done" },
  ],

  // research
  "rsc-sources": [
    { id: "rsc-so-1", title: "Hexagonal grids (redblobgames)", note: "axial / cube coords", tag: "source" },
    { id: "rsc-so-2", title: "Glassmorphism best practices", tag: "source" },
  ],
  "rsc-questions": [{ id: "rsc-qu-1", title: "Motion vs perf at 60fps?", tag: "open" }],
  "rsc-synth": [{ id: "rsc-sy-1", title: "Cockpit UX patterns", tag: "synthesis" }],
  "rsc-threads": [
    { id: "rsc-th-1", title: "Collaboration deep-dive", tag: "thread" },
    { id: "rsc-th-2", title: "Sound design references", tag: "thread" },
  ],

  // knowledge
  "knw-domains": [
    { id: "knw-do-1", title: "Sound", note: "handpan, field recording", tag: "domain" },
    { id: "knw-do-2", title: "Visual", tag: "domain" },
  ],
  "knw-entities": [{ id: "knw-en-1", title: "Doğan Karaca", tag: "entity" }],
  "knw-relations": [{ id: "knw-re-1", title: "Sound → Studio", tag: "edge" }],
  "knw-gaps": [{ id: "knw-ga-1", title: "Connect Research ↔ Knowledge", tag: "gap" }],

  // studio
  "std-image": [{ id: "std-im-1", title: "Cover art v3", note: "violet/cyan gradient", tag: "image" }],
  "std-video": [{ id: "std-vi-1", title: "Teaser cut 0:30", tag: "video" }],
  "std-audio": [{ id: "std-au-1", title: "Ambient bed loop", note: "72 BPM, Dm", tag: "audio" }],
  "std-copy": [
    { id: "std-co-1", title: "Launch caption draft", tag: "copy" },
    { id: "std-co-2", title: "About blurb", tag: "copy" },
  ],

  // decisions
  "dec-open": [
    { id: "dec-op-1", title: "Studio direction: A vs B", note: "time-boxed Friday", tag: "open" },
    { id: "dec-op-2", title: "Hosting: static vs SSR", tag: "open" },
  ],
  "dec-tradeoffs": [{ id: "dec-tr-1", title: "Motion richness vs battery", tag: "weigh" }],
  "dec-criteria": [{ id: "dec-cr-1", title: "Legibility first", tag: "rule" }],
  "dec-log": [{ id: "dec-lo-1", title: "Resolved: dev port 5190", tag: "resolved" }],

  // agents
  "agt-running": [
    { id: "agt-ru-1", title: "Research sweeper", note: "6 threads open", tag: "live" },
    { id: "agt-ru-2", title: "Inbox router", tag: "live" },
  ],
  "agt-idle": [{ id: "agt-id-1", title: "Nightly summarizer", note: "fires 02:00", tag: "idle" }],
  "agt-logs": [{ id: "agt-lo-1", title: "240 traces · 24h", tag: "stream" }],
  "agt-policies": [{ id: "agt-po-1", title: "No external sends", tag: "guardrail" }],

  // inbox
  "inb-unread": [
    { id: "inb-un-1", title: "Collab proposal — studio", tag: "unread" },
    { id: "inb-un-2", title: "Invoice #1182", tag: "unread" },
  ],
  "inb-routed": [{ id: "inb-ro-1", title: "Newsletter → Studio", tag: "routed" }],
  "inb-drafted": [{ id: "inb-dr-1", title: "Reply: collab proposal", tag: "drafted" }],
  "inb-flagged": [{ id: "inb-fl-1", title: "Contract review", tag: "flagged" }],
};
