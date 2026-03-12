'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  signIn: (payload: AuthUser) => void;
  signUp: (payload: AuthUser) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (payload) => set({ user: payload }),
      signUp: (payload) => set({ user: payload }),
      signOut: () => set({ user: null }),
    }),
    {
      name: 'auth-store',
    }
  )
);
