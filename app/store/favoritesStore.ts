'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (id) =>
        set((state) => {
          if (state.favoriteIds.includes(id)) {
            return {
              favoriteIds: state.favoriteIds.filter(
                (favoriteId) => favoriteId !== id
              ),
            };
          }

          return {
            favoriteIds: [...state.favoriteIds, id],
          };
        }),
      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    {
      name: 'favorites-store',
    }
  )
);
