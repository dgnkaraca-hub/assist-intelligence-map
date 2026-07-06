/* ============================================================
   icons.tsx
   ------------------------------------------------------------
   Resolves an IconKey to a lucide-react icon component. Keeping
   this map separate from the data files lets content stay purely
   about words, while the visual layer decides how each node is
   drawn. Falls back to a neutral spark when a key is unknown.
   ============================================================ */
import {
  BrainCircuit,
  Database,
  ListChecks,
  FlaskConical,
  Network,
  Clapperboard,
  Scale,
  Bot,
  Inbox,
  Sparkles,
  Activity,
  Radio,
  ShieldCheck,
  Clock,
  History,
  Boxes,
  Bookmark,
  ListOrdered,
  Lock,
  CheckCircle2,
  CalendarClock,
  GitBranch,
  FileText,
  Link2,
  Layers,
  Target,
  Route,
  Map as MapIcon,
  TriangleAlert,
  Image as ImageIcon,
  Video,
  AudioLines,
  PenLine,
  Mail,
  Archive,
  Flag,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "../types";

const ICONS: Record<IconKey, LucideIcon> = {
  // core + nodes
  core: BrainCircuit,
  memory: Database,
  tasks: ListChecks,
  research: FlaskConical,
  knowledge: Network,
  studio: Clapperboard,
  decisions: Scale,
  agents: Bot,
  inbox: Inbox,
  // generic / sub-node glyphs
  spark: Sparkles,
  pulse: Activity,
  signal: Radio,
  shield: ShieldCheck,
  clock: Clock,
  history: History,
  network: Network,
  vector: Boxes,
  bookmark: Bookmark,
  queue: ListOrdered,
  lock: Lock,
  check: CheckCircle2,
  calendar: CalendarClock,
  branch: GitBranch,
  doc: FileText,
  link: Link2,
  layers: Layers,
  target: Target,
  route: Route,
  map: MapIcon,
  alert: TriangleAlert,
  image: ImageIcon,
  video: Video,
  audio: AudioLines,
  pen: PenLine,
  scale: Scale,
  mail: Mail,
  archive: Archive,
  flag: Flag,
};

/** Resolve an icon key to its lucide component (spark fallback). */
export function iconFor(key: IconKey | undefined): LucideIcon {
  return ICONS[key ?? "spark"] ?? Sparkles;
}
