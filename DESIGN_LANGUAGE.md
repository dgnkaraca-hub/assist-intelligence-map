# Assist Intelligence — Design Language

> **"Obsidian Atrium"** — the authoritative visual spec for Assist Intelligence.
> Tagline: *One Core, eight orbits, one console — a powered circuit board breathing slowly in the dark.*
>
> This is the single source of truth for the look. The build (see
> [`AGENT_HANDOFF_PROMPT.md`](AGENT_HANDOFF_PROMPT.md)) must follow it. A rendered
> reference of the hero screen lives in [`design-mockup.html`](design-mockup.html).

## Where it comes from
A fused common language of two existing projects (used only as design references —
do not touch their repos):
- **Second brain** — *Doğan Knowledge Map*: pure-black hex honeycomb circuit, 60°
  elbow traces, dashed flowing connectors, space-blue/star-white, glowing star-point nodes.
- **Third brain** — *Third Brain OS*: glowing central Core orb, intelligence nodes,
  glassmorphism panels, cyan/blue/amber neon, radial glows.

This direction (`editorial-restraint`) won a 4-way judged design study
(8.53/10 vs circuit-led 8.07 · equal-weave 7.97 · core-led 7.73).

## Design thesis
Both brains already speak one alphabet: a true-black void, a single glowing Core at
center, and a radial field of nodes wired by dashed flowing traces. Assist Intelligence
says that alphabet **once, with restraint** — the Third Brain's living orb is socketed
as a chip into the brightest cell of the Second Brain's hex-circuit board, every link is
a single `hexElbowPath` axial trace, and color rides **ONE power spectrum** (signal blue
*resting* → current cyan *live* → ice white-hot *peak*) with gold as the only rationed
accent. Calm reads as expensive: `hexPulse` is the board idling, `traceFlow` is the
board thinking, and ~70% of the canvas is deliberately empty so every lit pixel is earned.

## Color tokens
Define as CSS vars in `src/index.css`; mirror in `tailwind.config.js`.

| Token | Hex | Role |
|---|---|---|
| `--atrium-black` | `#000000` | true-black body behind everything — ~70% of pixels |
| `--void-navy` | `#04060f` | root canvas base where Core glow falls off |
| `--deep-navy-2` | `#070a14` | secondary depth field under console + node rims |
| `--panel-glass` | `rgba(10,15,28,0.55)` | console + node-detail fill; `backdrop-blur 20px` |
| `--panel-solid` | `#0c1322` | no-blur fallback for glass surfaces |
| `--hairline` | `rgba(120,140,180,0.12)` | the ONLY borders allowed (1px panel/cell/disc rings) |
| `--hex-field` | `rgba(110,145,220,0.06)` | background honeycomb lattice stroke, radial-masked |
| `--hex-pad-base` | `rgba(140,175,255,0.18)` | occupied node-cell hex stroke at rest (pulse low) |
| `--hex-pad-peak` | `rgba(178,206,255,0.40)` | occupied node-cell hex stroke at pulse peak |
| `--trace-rest` | `#3a4a6e` | resting circuit traces Core→node (dashed, no glow) |
| `--signal-blue` | `#5b8cff` | **primary accent** — Core ring, focus ring, active node, status dot |
| `--current-cyan` | `#22d3ee` | power spectrum mid — a trace going live / Core thinking |
| `--ice-peak` | `#a5f3fc` | power spectrum peak — Core specular rim + particle leading edge |
| `--core-teal` | `#0e3a52` | Core sphere mid-gradient |
| `--core-deep` | `#04222e` | Core sphere outer falloff into void |
| `--signal-amber` | `#facc15` | the ONLY warm accent, rationed — a node that needs you (≤1–2 on screen) |
| `--amber-light` | `#fde68a` | brighter gold for the crisp amber ring edge |
| `--ink` | `#e9eef9` | primary light text (Core label, headline, active node names) |
| `--ink-2` | `#aeb9d2` | console reply body, resting node labels |
| `--muted` | `#7a849c` | wide-tracked UPPERCASE mono micro-labels (eyebrows, status, timestamps) |
| `--accent-soft` | `rgba(91,140,255,0.14)` | the only fill-tint — hover halo, focused input ring |
| `--glow-bloom` | `rgba(91,140,255,0.45)` | box-shadow bloom reserved for Core + single active element |
| `--glow-cyan` | `rgba(34,211,238,0.35)` | stronger bloom on a live trace / thinking Core |
| `--glow-amber` | `rgba(250,204,21,0.30)` | soft bloom on the one amber priority node |

**The power-spectrum rule:** all "energy" reads on one axis —
`--signal-blue` (resting/live) → `--current-cyan` (going live) → `--ice-peak` (hottest
peak). `--signal-amber` is the *only* hue off this axis and must stay rationed to ≤1–2
elements on screen.

## Typography
Three-register dual-voice carried from both DNAs, used with editorial generosity (large
sizes, vast leading, sparse placement). Most of the canvas carries **no type at all**.

- **Display serif** — `Instrument Serif` (Georgia/Times fallback). The Second Brain
  signature, reserved for exactly two things: the Core identity word **"Assist"** as a
  quiet wordmark beneath the orb (`clamp(28px,3vw,40px)`, line-height 0.9), and the single
  huge **ghost watermark** of the active node's name behind the field on select
  (`clamp(90px,18vw,220px)`, ~5% opacity).
- **Display sans** — `Space Grotesk` (Third Brain voice). Node names (16–18px, 500–600,
  tracking -0.01em), the one console headline, the Assist reply heading.
- **Mono** — `JetBrains Mono`. Every "OS signal": eyebrow/kicker UPPERCASE
  (`0.66rem`, letter-spacing `0.24em`, `--muted`), status pill (`CORE ONLINE · v0.1`),
  console placeholder (`Ask Assist…`), timestamps.
- Density lever: `html{font-size:14px}`; antialiased, `optimizeLegibility`.
- **Discipline:** serif names + spaced-caps mono meta is the shared handwriting both
  projects already declare.

## Layout (one full-viewport black stage — not an app shell, not a scroll)
Three z-layers.

- **Core** — dead-center horizontally, a touch above midline: `CX=50vw, CY=46vh`, orb
  `r≈76`. Socketed into the single brightest center hex cell (chip-in-socket).
- **Node hex-cell ring** — 8 nodes on ONE trig-computed ellipse `RX≈360 / RY≈250`
  (never DOM-measured). Upper arc: Memory · Tasks · Research · Knowledge. Lower arc:
  Studio · Decisions · Agents · Inbox. Each center **snapped to the nearest pointy-top
  hex cell** (`axialToPixel`) so it seats inside exactly one brighter occupied cell.
  Wide black gaps between nodes.
- **Hex lattice** — pointy-top honeycomb
  (`x=cx+s·√3·(q+r/2)`, `y=cy+s·1.5·r`; `s≈maxR/8`, min 26px) at `--hex-field` ~6%,
  **radial-masked** so cells fade to pure black before the frame edges — a halo of
  structure around the Core, not wallpaper.
- **Circuit traces** — every Core→node link is `hexElbowPath(CX,CY,nx,ny)`: two straight
  segments along the two hex axes bracketing the direction (60° elbow, no backtracking),
  snapped to the lattice, vertex softened by a short fillet arc. **ONE connector type, no
  exceptions.** Resting: `--trace-rest`, dashed (`3 7`), static.
- **Glass console** — single `AssistConsole` docked bottom-center, max-width 640px,
  ~24px clear of the bottom; one mono input line + most recent exchange above it;
  `backdrop-blur 20px`, 1px `--hairline`, no chrome; docked ONTO a hex-pad footprint.
- **Top hairline bar** — height ~48px, 1px `--hairline` bottom. Left: mono eyebrow
  `ASSIST INTELLIGENCE`. Right: blinking `--signal-blue` dot + `CORE ONLINE · v0.1`.
  No nav, no tabs.
- **Node select state** — field dims to ~25%, the node's name rises as the 5% serif
  ghost watermark, one glass `NodeDetailCard` floats up 8px, its trace goes live
  (`traceFlow` + brighten through the spectrum). Dismiss returns to the calm field.
- **Mobile (<768px)** — drop the ellipse; stack 8 hex-cell chips in a single column
  under a shrunken Core (`r≈54`) pinned top-center; traces become short vertical elbow
  stubs; console pinned full-width at bottom; watermark + detail card become a bottom sheet.

## Motion (CSS keyframes only; all respect `prefers-reduced-motion`)
| Keyframe | Timing | What it does | Reduced-motion |
|---|---|---|---|
| `core-breathe` | 6s ease-in-out ∞ | Core scales 1→1.035, `--glow-bloom` opacity 0.7↔1 — one slow heartbeat, the only thing moving at rest | frozen at scale 1, glow 0.85 |
| `hex-pulse` | 5s ease-in-out ∞, staggered `(i*0.83 % 4)s` | ONLY the 8 node pads breathe stroke base→peak→base in a shimmer wave; background lattice stays still; whisper, never strobe | held mid-amplitude, no anim |
| `trace-flow` | 2.6s linear ∞, **on demand** | resting traces static; the hovered/active trace's dashoffset flows (→-40) and brightens `--signal-blue→--current-cyan` — the board *thinking* | live trace full cyan, dash still |
| `glow-pulse` | 6s ease-in-out ∞ | central radial navy pool + Core halo fade 0.55↔1 in sympathy with breathe — void lit from within | held at 0.8 |
| `particle-stream` | ~3s single pass (SMIL `animateMotion`) | when Core is *thinking*, EXACTLY ONE `--ice-peak` particle (trailing `--current-cyan`) travels Core→active-node along the filleted path, `rotate=auto` | particle hidden; active trace stays lit |
| `status-blink` | 2.4s ease-in-out ∞ | the single `CORE ONLINE` `--signal-blue` dot blinks 1→0.35; nothing else blinks | dot solid |
| `focus-settle` | 0.6s cubic-bezier(.22,1,.36,1) | on node select: field dims to 25%, ghost watermark rises 0→5%, detail card floats up 8px — slow, expensive | instant state swap |

## Components
- **AssistCore** — single luminous anchor, socketed center hex cell. Radial-gradient
  sphere `r≈76`: `--ice-peak` specular upper-left → `--signal-blue` → `--core-teal` →
  `--core-deep` into black; soft pulsing center spark (`r 6→9`, `--ice-peak`); ONE 1px
  `--signal-blue` ring with `--glow-bloom`. Borrows the Third Brain orb but **strips the
  ~40 spinning filaments to ~8 faint radial hairlines** (ice @0.10) and **drops the gold
  torus** — restraint. Beneath: serif `Assist` wordmark + mono `CORE ONLINE` kicker. No
  text inside the orb. When thinking, the ring brightens toward `--current-cyan`.
- **IntelligenceNodeHexCell** — brighter occupied hex pad (`--hex-pad-base`, `hex-pulse`)
  framing a small glowing disc (`r≈16`, `--deep-navy-2`, 1px `--hairline`), a lucide icon
  (`--ink-2`), a Space Grotesk name outside the disc (away from Core), a mono kicker above
  (`--muted`). Hover: `--accent-soft` halo, ring → `--signal-blue`, trace goes live. The
  **Decisions** node (needs-you) wears a hollow `--signal-amber` ring + `--glow-amber`
  bloom — the lone warm note. Encode priority with ring SHAPE + icon, never hue alone.
- **CircuitMap** — wiring layer: per node, `hexElbowPath(CX,CY,nx,ny)` 60°-elbow trace,
  filleted vertex. ONE connector type. Rest: `--trace-rest` dashed, static. Active:
  `trace-flow`, brighten `--signal-blue→--current-cyan`, carries the one particle when
  thinking. A powered trace is ONE object, not two layered effects.
- **GlassPanel** — shared surface for console + detail card: `--panel-glass` +
  `backdrop-blur(20px)` + 1px `--hairline`; `--panel-solid` fallback. Sits ON a hex-pad
  footprint (soldered, not floating). Focus upgrades border toward `--signal-blue` with a
  restrained `--glow-bloom`. No heavy chrome, no shadows beyond a single soft bloom.
- **AssistConsole** — single GlassPanel docked bottom-center, max-w 640px: one-line mono
  input (`Ask Assist…`, `--muted`) with `--accent-soft` focus ring + most recent exchange
  above (user line `--ink-2` mono; Assist reply with serif lead-in then `--ink-2` body).
  Thinking lights the Core ring toward `--current-cyan` and fires the one particle. Enter
  submits — no send button chrome.
- **TopHairlineBar** — 1px `--hairline` frame line. Left: mono `ASSIST INTELLIGENCE`.
  Right: `status-blink` dot + `CORE ONLINE · v0.1`. A frame line, not a toolbar.
- **NodeDetailCard / GhostWatermark** — on select, field dims to 25%, the node name rises
  as a huge ~5% Instrument Serif watermark behind the board, one GlassPanel floats up
  (`focus-settle`) with count + recent items + a single action. Esc / click-away returns.
  The watermark is how a near-empty screen reads as composed rather than sparse.

## Accessibility
- Contrast: `--ink` on black ≈18:1, `--ink-2` ≈9:1 (both AAA); `--muted` ≈4.6:1 (AA, for
  large/uppercase meta only — never primary reading copy).
- Never color alone: the amber needs-you node carries a ring SHAPE + icon state too.
- Focus: visible 2px `--signal-blue` ring + `--accent-soft` fill on every interactive
  element. Full keyboard path: Tab cycles the 8 nodes in ellipse order, Enter opens the
  detail card, Esc dismisses, console input reachable + labeled.
- ARIA: CircuitMap SVG `role=img` with label "Assist Core wired to eight intelligence
  nodes"; each node an accessible name (e.g. "Decisions, needs attention"); decorative
  lattice + particles `aria-hidden`.
- Motion: `prefers-reduced-motion` freezes all keyframes to ≈0.001ms while keeping every
  lit trace/pad/glow + the composed still frame — **the static frame is the hero**.
- Hit targets ≥44px; legible at 200% zoom; console reply area `aria-live=polite`.
