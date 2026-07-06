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
    signals: ["8 cells wired", "Anatolian Crossroads published", "1 decision waiting"],
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
      { label: "Agents", value: "1" },
      { label: "Decisions open", value: "1" },
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
      stat: "9",
      statLabel: "pinned",
      description:
        "The system's long-term recall. Anything worth keeping — context, preferences, references, insight — lands here and resurfaces exactly when it becomes relevant.",
      details: [
        "Publication record: Anatolian Crossroads DOI",
        "Reach: 145+ organisations across 12 countries",
        "Recognition: 600k+ streams on the Seb Wildblood release",
        "Build memory: how this system itself was made",
      ],
      metrics: [
        { label: "Pinned", value: "9" },
        { label: "Build logs", value: "2" },
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
      stat: "1",
      statLabel: "in focus",
      description:
        "The execution queue. What is moving, what is blocked, and what ships next — for you and for the agents working beside you.",
      details: [
        "In focus: Anatolian Crossroads — next phase",
        "Queued: announce the DOI release",
        "Recently completed: the three micro modules",
        "Blocked on Decisions: project priority",
      ],
      metrics: [
        { label: "In focus", value: "1" },
        { label: "Queued", value: "1" },
        { label: "Shipped", value: "4" },
      ],
      relatedNodes: ["agents", "inbox", "decisions"],
      links: [{ label: "Open Task Board", url: "#" }],
      nextActions: [
        "Define the next Anatolian Crossroads phase",
        "Announce the release",
        "Resolve the priority decision",
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
      stat: "1",
      statLabel: "flagship live",
      description:
        "Where open questions become evidence. Sources are gathered, verified, compared, and distilled into findings ready to promote into Knowledge.",
      details: [
        "Anatolian Crossroads — memory graph, 9600–700 BCE, published with a DOI",
        "Completed micro modules: Sam'al, Göbekli Tepe, Kültepe-Kaneš",
        "Beginner handpan methodology — teaching research in progress",
        "Every claim carries a citation and a confidence rating",
      ],
      metrics: [
        { label: "Sites mapped", value: "10" },
        { label: "Micro modules", value: "3" },
        { label: "Open threads", value: "1" },
      ],
      relatedNodes: ["knowledge", "memory", "inbox"],
      links: [
        { label: "Anatolian Crossroads — live atlas", url: "https://dgnkaraca-hub.github.io/anatolian-crossroads/" },
      ],
      nextActions: ["Plan the next Anatolian Crossroads phase", "Announce the DOI release", "Advance the handpan methodology"],
      tags: ["digital humanities", "memory graph", "epigraphy"],
      lastUpdated: "This week",
      universeLink: { open: "action", node: "anatolian-crossroads", label: "Open Anatolian Crossroads in Universe" },
    },
    {
      id: "knowledge",
      title: "Knowledge",
      shortLabel: "Knowledge",
      category: "Intelligence",
      icon: "knowledge",
      accent: "violet",
      status: "online",
      stat: "36",
      statLabel: "facets",
      description:
        "The connected map of what the system knows — domains, entities, and the relations that make isolated facts useful.",
      details: [
        "Seven domains: Sound, Education, Film, Data, Digital Humanities, Media, International",
        "36 facets: practices, skills, projects, media work",
        "30 relation threads crossing the domains",
        "Six selected works, each with sources and confidence markers",
      ],
      metrics: [
        { label: "Facets", value: "36" },
        { label: "Threads", value: "30" },
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
      status: "active",
      stat: "6",
      statLabel: "published",
      description:
        "The creative production line. Work in every medium moves from idea to render to shipped — grounded in Knowledge, gated by Decisions.",
      details: [
        "Generative video — four published AI experiments",
        "Audiovisual pieces grown from live sound sets",
        "Cross-platform recaps (2024, 2025)",
        "Collaborative release with Seb Wildblood — 600k+ streams",
      ],
      metrics: [
        { label: "AI video works", value: "4" },
        { label: "Year recaps", value: "2" },
        { label: "Collab streams", value: "600k+" },
      ],
      relatedNodes: ["knowledge", "decisions", "tasks"],
      links: [{ label: "AI Generated I", url: "https://youtu.be/JFOCqtC82vo" }],
      nextActions: ["Publish the next AI video experiment", "Cut the 2026 recap", "Pair a live set with visuals"],
      tags: ["generative", "audiovisual", "sound"],
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
      stat: "1",
      statLabel: "waiting",
      description:
        "The judgment layer. Options are framed, tradeoffs weighed, and every call is logged — so direction never stalls on an unmade decision.",
      details: [
        "Open: project priority — which work gets the coming months",
        "Options: DH research · music & teaching · video/media",
        "Criteria: momentum after the Anatolian Crossroads release",
        "Resolved decisions land in the log",
      ],
      metrics: [
        { label: "Open", value: "1" },
        { label: "Resolved", value: "1" },
        { label: "Priority", value: "High" },
      ],
      relatedNodes: ["tasks", "studio", "research"],
      links: [{ label: "Open Decision Matrix", url: "#" }],
      nextActions: ["Frame the priority options", "Time-box the call", "Log the outcome"],
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
      stat: "1",
      statLabel: "running",
      description:
        "The autonomous workforce. Long-running jobs are delegated, supervised, and kept inside explicit guardrails — with every run logged.",
      details: [
        "Claude Code — builds and maintains this system",
        "Session memory persists across builds",
        "Guardrail: nothing external without approval",
        "Future: research and inbox routing agents",
      ],
      metrics: [
        { label: "Running", value: "1" },
        { label: "Planned", value: "2" },
        { label: "Guardrails", value: "On" },
      ],
      relatedNodes: ["tasks", "memory", "inbox"],
      links: [{ label: "Open Agent Fleet", url: "#" }],
      nextActions: ["Define the research agent's scope", "Sketch the inbox router", "Review session logs"],
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
      stat: "1",
      statLabel: "in progress",
      description:
        "The signal gate. Everything inbound is triaged once — routed to the right cell, answered with a draft, or archived deliberately.",
      details: [
        "Croatia Handpan Festival — invitation from Ivan Judas",
        "Passport details submitted for the invitation process",
        "Now waiting on the organizer's confirmation",
        "Universe sends land here (Send to Assist)",
      ],
      metrics: [
        { label: "In progress", value: "1" },
        { label: "Waiting on", value: "Organizer" },
        { label: "Flagged", value: "1" },
      ],
      relatedNodes: ["tasks", "research", "agents"],
      links: [{ label: "Open Inbox", url: "#" }],
      nextActions: [
        "Follow up with Ivan Judas if no confirmation arrives",
        "Prepare travel documents once confirmed",
        "Log festival dates when announced",
      ],
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
