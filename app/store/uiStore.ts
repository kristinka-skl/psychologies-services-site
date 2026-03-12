'use client';

import { create } from 'zustand';

type AuthModalMode = 'login' | 'register';

interface UiState {
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode: AuthModalMode) => void;
  closeAuthModal: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isAuthModalOpen: false,
  authModalMode: 'login',
  openAuthModal: (mode) => set({ isAuthModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));
