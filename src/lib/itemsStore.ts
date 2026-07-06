/* ============================================================
   itemsStore.ts
   ------------------------------------------------------------
   The single localStorage-backed record store shared by the
   Assist layer (App.tsx capture/remove) and the Universe layer
   ("Send to Assist" in the detail drawer). Both must read and
   write through here so neither clobbers the other.
   ============================================================ */
import { seedItemsByCell } from "../data/items";
import type { DataItem } from "../types";

export const ITEMS_KEY = "assist-intelligence:items.v1";

export function loadItems(): Record<string, DataItem[]> {
  const seed: Record<string, DataItem[]> = { ...seedItemsByCell };
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    if (raw) return { ...seed, ...(JSON.parse(raw) as Record<string, DataItem[]>) };
  } catch {
    /* ignore */
  }
  return seed;
}

export function persistItems(next: Record<string, DataItem[]>): void {
  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

/** Append a record to a cell directly in storage (used outside App state). */
export function addItemToCell(cellId: string, title: string, note?: string, tag = "universe"): void {
  const all = loadItems();
  const item: DataItem = { id: `${cellId}-${Date.now()}`, title, note, tag };
  persistItems({ ...all, [cellId]: [item, ...(all[cellId] ?? [])] });
}
