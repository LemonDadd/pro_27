import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const MAX_COMPARE = 4;

interface CompareStore {
  ids: string[];
  drawerOpen: boolean;
  toggle: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  canAdd: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      ids: [],
      drawerOpen: false,
      canAdd: true,

      toggle: (id) => {
        const current = get().ids;
        if (current.includes(id)) {
          set({ ids: current.filter((x) => x !== id) });
        } else if (current.length < MAX_COMPARE) {
          set({ ids: [...current, id] });
        }
      },

      add: (id) => {
        const current = get().ids;
        if (current.length >= MAX_COMPARE || current.includes(id)) return;
        set({ ids: [...current, id] });
      },

      remove: (id) =>
        set((s) => ({ ids: s.ids.filter((x) => x !== id) })),

      clear: () => set({ ids: [] }),

      has: (id) => get().ids.includes(id),

      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
    }),
    {
      name: "wander-compare-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ ids: s.ids }),
    },
  ),
);
