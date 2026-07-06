/* ============================================================
   AddToCoreInput.tsx
   ------------------------------------------------------------
   "Ask the core…" — the system's capture bar. Type a note,
   decision, task, research item, or memory. The target cell is
   inferred from the wording (auto) or picked explicitly. On
   submit the item is added to that cell's records.
   ============================================================ */
import { useState, type FormEvent } from "react";
import { ArrowUp } from "lucide-react";

interface Target {
  id: string;
  label: string;
}

interface AddToCoreInputProps {
  targets: Target[];
  onAdd: (cellId: string, text: string) => void;
}

/** Infer the target cell from the wording. */
function inferTarget(text: string, targets: Target[]): string {
  const t = text.toLowerCase();
  const has = (...words: string[]) => words.some((w) => t.includes(w));
  const pick = (id: string) => (targets.some((x) => x.id === id) ? id : targets[0]?.id);
  if (has("decide", "decision", "should i", "vs ", "or ")) return pick("decisions");
  if (has("task", "todo", "to-do", "do ", "ship", "finish")) return pick("tasks");
  if (has("research", "read", "paper", "source", "study", "look into")) return pick("research");
  if (has("remember", "note", "recall", "keep", "save")) return pick("memory");
  if (has("idea", "concept", "domain", "entity", "connect")) return pick("knowledge");
  if (has("draft", "render", "video", "image", "audio", "copy")) return pick("studio");
  if (has("agent", "spawn", "run ")) return pick("agents");
  if (has("reply", "email", "message", "inbox")) return pick("inbox");
  return pick("memory");
}

export default function AddToCoreInput({ targets, onAdd }: AddToCoreInputProps) {
  const [text, setText] = useState("");
  const [target, setTarget] = useState("auto");
  const [flash, setFlash] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    const cellId = target === "auto" ? inferTarget(value, targets) : target;
    const label = targets.find((t) => t.id === cellId)?.label ?? "Memory";
    onAdd(cellId, value);
    setText("");
    setFlash(`Added to ${label}`);
    window.setTimeout(() => setFlash(null), 1800);
  };

  return (
    <form onSubmit={submit} className="surface rounded-xl p-2.5">
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Ask the core or capture an item"
          placeholder="Ask the core…"
          className="min-w-0 flex-1 bg-transparent px-1.5 text-[0.86rem] text-ink outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Add to the core"
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
            text.trim() ? "bg-cyan text-bg-void hover:brightness-110" : "bg-line text-muted"
          }`}
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2 px-0.5">
        <label className="kicker">Route to</label>
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          aria-label="Target cell"
          className="rounded-md border border-line bg-bg-deep/60 px-2 py-1 text-[0.72rem] text-ink-2 outline-none focus-visible:border-cyan/50"
        >
          <option value="auto">Auto</option>
          {targets.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        {flash && <span className="ml-auto text-[0.72rem] text-cyan">{flash}</span>}
      </div>
    </form>
  );
}
