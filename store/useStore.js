// Global state with Zustand (persisted to localStorage)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_ITEMS } from "../data/blocks";

const today = () => new Date().toISOString().slice(0, 10);

export const useItemStore = create(
  persist(
    (set) => ({
      items: INITIAL_ITEMS,
      addItem: (item) => set((s) => ({ items: [{ ...item, id: "item-" + Date.now(), date: today(), resolved: false }, ...s.items] })),
      updateItem: (id, patch) => set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: "cc_lost_found_v2" }
  )
);

export const useClassStore = create(
  persist(
    (set) => ({
      classes: [],
      addClass: (c) => set((s) => ({ classes: [...s.classes, { ...c, id: "cls-" + Date.now() }] })),
      updateClass: (id, patch) => set((s) => ({ classes: s.classes.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      removeClass: (id) => set((s) => ({ classes: s.classes.filter((c) => c.id !== id) })),
    }),
    { name: "cc_classes_v1" }
  )
);

export const useBookmarkStore = create(
  persist(
    (set) => ({
      saved: [],
      toggle: (id) => set((s) => ({ saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id] })),
    }),
    { name: "cc_saved_notices_v1" }
  )
);
