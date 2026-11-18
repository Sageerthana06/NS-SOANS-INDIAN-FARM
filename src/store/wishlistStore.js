import { create } from 'zustand';

const WISHLIST_STORAGE_KEY = 'ns_soans_wishlist_v1';

const getInitialWishlist = () => {
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const useWishlistStore = create((set, get) => ({
  items: getInitialWishlist(),

  toggleWishlist: (productId) => {
    set((state) => {
      const exists = state.items.includes(productId);
      const updated = exists
        ? state.items.filter((id) => id !== productId)
        : [...state.items, productId];

      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }

      return { items: updated };
    });
  },

  isInWishlist: (productId) => {
    return get().items.includes(productId);
  },

  clearWishlist: () => {
    try {
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    set({ items: [] });
  }
}));

