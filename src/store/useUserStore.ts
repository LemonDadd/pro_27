import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserState } from "@/types";

interface UserStore extends UserState {
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleVisited: (id: string) => void;
  hasVisited: (id: string) => boolean;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  clearVisited: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      visited: [],

      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((x) => x !== id)
            : [...s.wishlist, id],
        })),

      isInWishlist: (id) => get().wishlist.includes(id),

      toggleVisited: (id) =>
        set((s) => ({
          visited: s.visited.includes(id)
            ? s.visited.filter((x) => x !== id)
            : [...s.visited, id],
        })),

      hasVisited: (id) => get().visited.includes(id),

      removeFromWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.filter((x) => x !== id),
        })),

      clearWishlist: () => set({ wishlist: [] }),
      clearVisited: () => set({ visited: [] }),
    }),
    {
      name: "wander-user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
