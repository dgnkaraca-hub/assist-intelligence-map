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
    { id: "core-2", title: "Anatolian Crossroads published", note: "DOI 10.5281/zenodo.21158715", tag: "milestone" },
    { id: "core-3", title: "1 decision waiting", note: "project priority", tag: "attention" },
  ],

  // memory — pinned facts about the practice + how this system was built
  "mem-episodic": [
    { id: "mem-ep-1", title: "2026-07-06 · assist ⇄ universe merge shipped", note: "one product, two layers", tag: "log" },
    { id: "mem-ep-2", title: "2026-07-02 · anatolian-crossroads repo created", note: "published within the week", tag: "log" },
  ],
  "mem-semantic": [
    { id: "mem-se-1", title: "Anatolian Crossroads DOI", note: "10.5281/zenodo.21158715 · Zenodo", tag: "fact" },
    { id: "mem-se-2", title: "Outreach: 145+ organisations, 12 countries", tag: "fact" },
    { id: "mem-se-3", title: "Seb Wildblood release · 600k+ streams", tag: "fact" },
    { id: "mem-se-4", title: "No-continuity rule", note: "cross-site relations only via corridors, comparisons, shared concepts", tag: "fact" },
  ],
  "mem-vectors": [{ id: "mem-ve-1", title: "36 universe facets · 30 threads indexed", tag: "store" }],
  "mem-pinned": [
    { id: "mem-pi-1", title: "Content lives in data files, never components", note: "universeData.ts + coreData.ts + items.ts", tag: "pinned" },
    { id: "mem-pi-2", title: "Combined network ships as GEXF open data", tag: "pinned" },
  ],

  // tasks — the real queue (interview 2026-07-06)
  "tsk-queue": [
    { id: "tsk-q-1", title: "Announce the Anatolian Crossroads release", note: "DOI + live atlas are ready to share", tag: "queued" },
  ],
  "tsk-active": [
    { id: "tsk-a-1", title: "Anatolian Crossroads — define the next phase", note: "scope after the v1 publication", tag: "running" },
  ],
  "tsk-blocked": [
    { id: "tsk-b-1", title: "Season planning", note: "waiting on the project-priority decision", tag: "blocked" },
  ],
  "tsk-done": [
    { id: "tsk-d-1", title: "Sam'al Epigraphic Network", note: "completed · live module", tag: "done" },
    { id: "tsk-d-2", title: "Göbekli Tepe Iconography", note: "completed · live module", tag: "done" },
    { id: "tsk-d-3", title: "Kültepe-Kaneš Network", note: "completed · live module", tag: "done" },
    { id: "tsk-d-4", title: "Anatolian Crossroads v1", note: "published with DOI", tag: "done" },
  ],

  // research — the real digital-humanities threads (see universeData: dh domain)
  "rsc-sources": [
    { id: "rsc-so-1", title: "Sam'al network — 14 sources cited", note: "every entity and relation carries a citation", tag: "source" },
    { id: "rsc-so-2", title: "Göbekli Tepe pillar iconography corpus", note: "40 nodes · 62 edges mapped", tag: "source" },
  ],
  "rsc-questions": [
    { id: "rsc-qu-1", title: "Scholarly disagreements in the Zincirli dynasty line", note: "recorded in notes, not hidden", tag: "open" },
    { id: "rsc-qu-2", title: "How to sequence a beginner handpan method?", tag: "open" },
  ],
  "rsc-synth": [
    { id: "rsc-sy-1", title: "Graph methods power both epigraphy and iconography", note: "shared network-analysis backbone", tag: "synthesis" },
  ],
  "rsc-threads": [
    { id: "rsc-th-0", title: "Anatolian Crossroads", note: "published · DOI 10.5281/zenodo.21158715 · next phase in planning", tag: "flagship" },
    { id: "rsc-th-1", title: "Sam'al Epigraphic Network", note: "completed — micro module of Anatolian Crossroads", tag: "done" },
    { id: "rsc-th-2", title: "Göbekli Tepe Iconography", note: "completed — micro module of Anatolian Crossroads", tag: "done" },
    { id: "rsc-th-3", title: "Kültepe-Kaneš Network", note: "completed — micro module of Anatolian Crossroads", tag: "done" },
    { id: "rsc-th-4", title: "Beginner handpan methodology", tag: "research" },
  ],

  // knowledge — the real universe structure (see universeData)
  "knw-domains": [
    { id: "knw-do-1", title: "Sound", note: "handpan, sound art, live sessions, deep listening", tag: "domain" },
    { id: "knw-do-2", title: "Education", note: "workshops, private lessons, methodology", tag: "domain" },
    { id: "knw-do-3", title: "Film", note: "visual storytelling, generative video", tag: "domain" },
    { id: "knw-do-4", title: "Data", note: "network analysis, text mining, GIS", tag: "domain" },
    { id: "knw-do-5", title: "Digital Humanities", note: "Sam'al, Göbekli Tepe, archiving", tag: "domain" },
    { id: "knw-do-6", title: "Media", note: "TRT, Habertürk, Disney+ Türkiye", tag: "domain" },
    { id: "knw-do-7", title: "International", note: "145+ organisations, 12 countries", tag: "domain" },
  ],
  "knw-entities": [
    { id: "knw-en-0", title: "Anatolian Crossroads", note: "10 sites · 9 concepts · 3 modules · DOI", tag: "entity" },
    { id: "knw-en-1", title: "Sam'al Epigraphic Network", note: "32 entities · 68 relations", tag: "entity" },
    { id: "knw-en-2", title: "TRT Müzik — Sesler Âlemi performance", tag: "entity" },
    { id: "knw-en-3", title: "Release with Seb Wildblood", note: "600k+ streams", tag: "entity" },
  ],
  "knw-relations": [
    { id: "knw-re-1", title: "Network analysis → Sam'al & Göbekli Tepe", note: "graph methods power both", tag: "edge" },
    { id: "knw-re-2", title: "Stage practice → workshops", note: "what's performed is what's taught", tag: "edge" },
    { id: "knw-re-3", title: "Sound textures → generative imagery", tag: "edge" },
  ],
  "knw-gaps": [{ id: "knw-ga-1", title: "Data domain has no public case study yet", tag: "gap" }],

  // studio — real published output (see universeData: film/media/international)
  "std-image": [{ id: "std-im-1", title: "Generative stills from the AI video series", tag: "image" }],
  "std-video": [
    { id: "std-vi-1", title: "AI Generated I–IV", note: "four published experiments (YouTube)", tag: "video" },
    { id: "std-vi-2", title: "2024 & 2025 recaps", note: "cross-platform year films", tag: "video" },
  ],
  "std-audio": [
    { id: "std-au-1", title: "Release with Seb Wildblood", note: "600k+ streams", tag: "audio" },
    { id: "std-au-2", title: "High Vibe Collective — Prince's Palace set", tag: "audio" },
  ],
  "std-copy": [
    { id: "std-co-1", title: "Selected-works blurbs", note: "six works written for the Universe dashboards", tag: "copy" },
  ],

  // decisions — the real open call (interview 2026-07-06)
  "dec-open": [
    { id: "dec-op-1", title: "Project priority for the coming months", note: "DH research vs music & teaching vs video/media", tag: "open" },
  ],
  "dec-tradeoffs": [
    { id: "dec-tr-1", title: "Research momentum vs performance income", note: "Anatolian Crossroads just shipped — ride it or rebalance?", tag: "weigh" },
  ],
  "dec-criteria": [
    { id: "dec-cr-1", title: "Follow the published momentum", note: "a DOI release opens academic doors now", tag: "rule" },
  ],
  "dec-log": [
    { id: "dec-lo-1", title: "Resolved: merge assist + knowledge map into one product", note: "2026-07-06", tag: "resolved" },
  ],

  // agents — honest fleet: one real agent today, two planned
  "agt-running": [
    { id: "agt-ru-1", title: "Claude Code", note: "builds and maintains this system; persistent session memory", tag: "live" },
  ],
  "agt-idle": [
    { id: "agt-id-1", title: "Research agent (planned)", note: "source-sweeping for open threads", tag: "idle" },
    { id: "agt-id-2", title: "Inbox router (planned)", tag: "idle" },
  ],
  "agt-logs": [{ id: "agt-lo-1", title: "Build sessions logged in project memory", tag: "stream" }],
  "agt-policies": [{ id: "agt-po-1", title: "Nothing external without approval", tag: "guardrail" }],

  // inbox — the real signal (interview 2026-07-06)
  "inb-unread": [
    { id: "inb-un-1", title: "Festival / event invitation", note: "performance opportunity — needs an answer", tag: "unread" },
  ],
  "inb-routed": [],
  "inb-drafted": [],
  "inb-flagged": [
    { id: "inb-fl-1", title: "Festival invitation — follow up", note: "deadline unknown; confirm dates", tag: "flagged" },
  ],
};
