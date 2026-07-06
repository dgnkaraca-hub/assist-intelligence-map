/* ============================================================
   coreData.ts
   ------------------------------------------------------------
   Every knowledge cell on the map, fully described. Clicking a
   cell opens a console-style detail panel rendered entirely from
   these objects — the components never hard-code a cell's content.

   The central Assist Core is itself a honeycomb (isCore) so it
   opens a "Main Console" detail view like any other cell. The
   drawing layer (lib/layout.ts) decides geometry; nothing here
   knows pixel positions.
   ============================================================ */
import type { ConsoleData } from "../types";

export const consoleData: ConsoleData = {
  core: {
    id: "core",
    title: "Assist Core",
    shortLabel: "Core",
    category: "Core System · Main Console",
    icon: "core",
    accent: "core",
    status: "active",
    stat: "8",
    statLabel: "cells wired",
    isCore: true,
    tagline: "Doğan Karaca · agent console",
    signals: ["8 cells wired", "3 agents running", "context window warm"],
    description:
      "The orchestration layer. Every cell reports here — context is routed where it helps, agents are supervised, and nothing falls through.",
    details: [
      "Live routing across all eight cells",
      "Agent supervision and spawning",
      "Context window + memory grounding",
      "System health and signal feed",
    ],
    metrics: [
      { label: "Cells", value: "8" },
      { label: "Agents", value: "3" },
      { label: "Uptime", value: "99.9%" },
    ],
    relatedNodes: ["memory", "tasks", "research", "knowledge", "studio", "decisions", "agents", "inbox"],
    links: [{ label: "Open System Console", url: "#" }],
    nextActions: [
      "Review today's signal feed",
      "Check agent health",
      "Re-balance context budget",
    ],
    tags: ["orchestration", "console", "second brain"],
    lastUpdated: "Just now",
  },

  // Eight cells, drawn as hex cells around the Core (array order = ring order,
  // index 0 at the top going clockwise).
  nodes: [
    {
      id: "memory",
      title: "Memory",
      shortLabel: "Memory",
      category: "Core System",
      icon: "memory",
      accent: "teal",
      status: "active",
      stat: "1,284",
      statLabel: "facts",
      description:
        "The system's long-term recall. Anything worth keeping — context, preferences, references, insight — lands here and resurfaces exactly when it becomes relevant.",
      details: [
        "Personal knowledge archive",
        "Project memory and context",
        "Creative references",
        "Saved insights and pinned facts",
      ],
      metrics: [
        { label: "Items", value: "1,284" },
        { label: "Recalled · 24h", value: "37" },
        { label: "Priority", value: "High" },
      ],
      relatedNodes: ["knowledge", "research", "agents"],
      links: [{ label: "Open Memory Archive", url: "#" }],
      nextActions: [
        "Review recent notes",
        "Connect memory items to active projects",
        "Summarize unfinished ideas",
      ],
      tags: ["archive", "context", "personal database"],
      lastUpdated: "Today",
    },
    {
      id: "tasks",
      title: "Tasks",
      shortLabel: "Tasks",
      category: "Execution",
      icon: "tasks",
      accent: "cyan",
      status: "active",
      stat: "12",
      statLabel: "in flight",
      description:
        "The execution queue. What is moving, what is blocked, and what ships next — for you and for the agents working beside you.",
      details: [
        "Active and queued work",
        "Blocked items awaiting input",
        "Recently completed tasks",
        "Scheduled / recurring jobs",
      ],
      metrics: [
        { label: "In flight", value: "12" },
        { label: "Queued", value: "5" },
        { label: "Done · 24h", value: "41" },
      ],
      relatedNodes: ["agents", "inbox", "decisions"],
      links: [{ label: "Open Task Board", url: "#" }],
      nextActions: [
        "Triage the queue",
        "Unblock 2 stalled tasks",
        "Schedule the weekly review",
      ],
      tags: ["queue", "execution", "workflow"],
      lastUpdated: "2m ago",
    },
    {
      id: "research",
      title: "Research",
      shortLabel: "Research",
      category: "Intelligence",
      icon: "research",
      accent: "purple",
      status: "active",
      stat: "6",
      statLabel: "threads",
      description:
        "Where open questions become evidence. Sources are gathered, verified, compared, and distilled into findings ready to promote into Knowledge.",
      details: [
        "Academic references",
        "Web research and sources",
        "Open questions",
        "Source comparison and synthesis",
      ],
      metrics: [
        { label: "Sources", value: "42" },
        { label: "Active threads", value: "6" },
        { label: "Priority", value: "Medium" },
      ],
      relatedNodes: ["knowledge", "memory", "inbox"],
      links: [{ label: "Open Research Board", url: "#" }],
      nextActions: ["Add a source", "Summarize findings", "Close the resolved threads"],
      tags: ["sources", "papers", "open questions"],
      lastUpdated: "1h ago",
      universeLink: { open: "action", domain: "dh", label: "Open Digital Humanities in Universe" },
    },
    {
      id: "knowledge",
      title: "Knowledge",
      shortLabel: "Knowledge",
      category: "Intelligence",
      icon: "knowledge",
      accent: "violet",
      status: "online",
      stat: "146",
      statLabel: "entities",
      description:
        "The connected map of what the system knows — domains, entities, and the relations that make isolated facts useful.",
      details: [
        "Top-level domains",
        "Entities: people, works, ideas",
        "Relations threading them together",
        "Saved maps and under-connected gaps",
      ],
      metrics: [
        { label: "Entities", value: "146" },
        { label: "Relations", value: "318" },
        { label: "Domains", value: "7" },
      ],
      relatedNodes: ["memory", "research", "studio"],
      links: [{ label: "Open Knowledge Map", url: "#" }],
      nextActions: ["Fill 11 gaps", "Promote verified research", "Merge duplicate entities"],
      tags: ["graph", "domains", "second brain"],
      lastUpdated: "Today",
      // The Knowledge cell IS the door into the Universe layer.
      universeLink: { open: "direct", label: "Enter the Universe" },
    },
    {
      id: "studio",
      title: "Studio",
      shortLabel: "Studio",
      category: "Creative",
      icon: "studio",
      accent: "purple",
      status: "idle",
      stat: "23",
      statLabel: "drafts",
      description:
        "The creative production line. Drafts in every medium move from idea to render to shipped — grounded in Knowledge, gated by Decisions.",
      details: [
        "Image stills and key frames",
        "Motion drafts and edits",
        "Score, sound design, voice",
        "Written drafts and captions",
      ],
      metrics: [
        { label: "Drafts", value: "23" },
        { label: "Renders", value: "8" },
        { label: "Shipped", value: "15" },
      ],
      relatedNodes: ["knowledge", "decisions", "tasks"],
      links: [{ label: "Open Studio", url: "#" }],
      nextActions: ["Render the queued stills", "Pick a video direction", "Ship 3 drafts"],
      tags: ["generative", "media", "drafts"],
      lastUpdated: "Yesterday",
      universeLink: { open: "action", domain: "film", label: "Open Film & Media in Universe" },
    },
    {
      id: "decisions",
      title: "Decisions",
      shortLabel: "Decisions",
      category: "Governance",
      icon: "decisions",
      accent: "amber",
      status: "alert",
      stat: "3",
      statLabel: "waiting",
      description:
        "The judgment layer. Options are framed, tradeoffs weighed, and every call is logged — so direction never stalls on an unmade decision.",
      details: [
        "Open decisions awaiting input",
        "Options weighed against each other",
        "Criteria each call is judged on",
        "Resolved decisions and full log",
      ],
      metrics: [
        { label: "Open", value: "3" },
        { label: "Resolved", value: "29" },
        { label: "Priority", value: "High" },
      ],
      relatedNodes: ["tasks", "studio", "research"],
      links: [{ label: "Open Decision Matrix", url: "#" }],
      nextActions: ["Resolve 3 open decisions", "Set criteria for the studio call", "Log the outcome"],
      tags: ["tradeoffs", "governance", "calls"],
      lastUpdated: "30m ago",
    },
    {
      id: "agents",
      title: "Agents",
      shortLabel: "Agents",
      category: "Execution",
      icon: "agents",
      accent: "violet",
      status: "active",
      stat: "3",
      statLabel: "running",
      description:
        "The autonomous workforce. Long-running jobs are delegated, supervised, and kept inside explicit guardrails — with every run logged.",
      details: [
        "Agents running right now",
        "Idle agents, warm and waiting",
        "Recently spawned workers",
        "Streamed logs and guardrails",
      ],
      metrics: [
        { label: "Running", value: "3" },
        { label: "Idle", value: "4" },
        { label: "Spawned · 24h", value: "18" },
      ],
      relatedNodes: ["tasks", "memory", "inbox"],
      links: [{ label: "Open Agent Fleet", url: "#" }],
      nextActions: ["Inspect the running agents", "Tune a policy", "Retire idle workers"],
      tags: ["autonomous", "workers", "fleet"],
      lastUpdated: "Just now",
    },
    {
      id: "inbox",
      title: "Inbox",
      shortLabel: "Inbox",
      category: "Signals",
      icon: "inbox",
      accent: "teal",
      status: "online",
      stat: "9",
      statLabel: "unread",
      description:
        "The signal gate. Everything inbound is triaged once — routed to the right cell, answered with a draft, or archived deliberately.",
      details: [
        "Unread signals to triage",
        "Routed to the right cell / agent",
        "Replies drafted for one-tap send",
        "Flagged and archived items",
      ],
      metrics: [
        { label: "Unread", value: "9" },
        { label: "Routed", value: "62" },
        { label: "Drafted", value: "11" },
      ],
      relatedNodes: ["tasks", "research", "agents"],
      links: [{ label: "Open Inbox", url: "#" }],
      nextActions: ["Triage 9 unread", "Send 11 drafts", "Archive the resolved"],
      tags: ["signals", "triage", "routing"],
      lastUpdated: "5m ago",
    },
  ],

  // Spokes wire every cell to the Core for the resting circuit look; a couple
  // of relations add cross-talk. The live related-node highlight is drawn
  // dynamically from each cell's relatedNodes when it is selected.
  edges: [
    { id: "s-memory", fromId: "core", toId: "memory", kind: "spoke" },
    { id: "s-tasks", fromId: "core", toId: "tasks", kind: "spoke" },
    { id: "s-research", fromId: "core", toId: "research", kind: "spoke" },
    { id: "s-knowledge", fromId: "core", toId: "knowledge", kind: "spoke" },
    { id: "s-studio", fromId: "core", toId: "studio", kind: "spoke" },
    { id: "s-decisions", fromId: "core", toId: "decisions", kind: "spoke" },
    { id: "s-agents", fromId: "core", toId: "agents", kind: "spoke" },
    { id: "s-inbox", fromId: "core", toId: "inbox", kind: "spoke" },
  ],
};

/** Flat lookup of every honeycomb (core + cells), by id. */
export const honeycombById = new Map<string, ConsoleData["nodes"][number]>(
  [consoleData.core, ...consoleData.nodes].map((h) => [h.id, h]),
);
