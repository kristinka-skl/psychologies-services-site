'use client';

import { create } from 'zustand';
import {
  addUserFavorite,
  removeUserFavorite,
} from '@/app/lib/favoritesApi';

interface FavoritesState {
  favoriteIds: string[];
  setFavorites: (ids: string[]) => void;
  clearFavorites: () => void;
  toggleFavoriteForUser: (uid: string, id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  favoriteIds: [],
  setFavorites: (ids) => set({ favoriteIds: ids }),
  clearFavorites: () => set({ favoriteIds: [] }),
  toggleFavoriteForUser: async (uid, id) => {
    const previousIds = get().favoriteIds;
    const wasFavorite = previousIds.includes(id);
    const nextIds = wasFavorite
      ? previousIds.filter((favoriteId) => favoriteId !== id)
      : [...previousIds, id];

    set({ favoriteIds: nextIds });

    try {
      if (wasFavorite) {
        await removeUserFavorite(uid, id);
        return;
      }

      await addUserFavorite(uid, id);
    } catch (error) {
      set({ favoriteIds: previousIds });
      throw error;
    }
  },
  isFavorite: (id) => get().favoriteIds.includes(id),
}));
