'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Palette = 'green' | 'orange' | 'blue';

interface PaletteState {
  palette: Palette;
  setPalette: (palette: Palette) => void;
}

export const usePaletteStore = create<PaletteState>()(
  persist(
    (set) => ({
      palette: 'green',
      setPalette: (palette) => set({ palette }),
    }),
    {
      name: 'palette-preference',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
