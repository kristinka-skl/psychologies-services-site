'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import AuthModal from '@/app/components/AuthModal/AuthModal';
import PaletteSwitcher from '@/app/components/PaletteSwitcher/PaletteSwitcher';
import { auth } from '@/app/lib/firebaseSdk';
import { getUserFavoriteIds } from '@/app/lib/favoritesApi';
import { notifyError } from '@/app/lib/notifications';
import { useAuthStore } from '@/app/store/authStore';
import { useFavoritesStore } from '@/app/store/favoritesStore';
import { usePaletteStore } from '@/app/store/paletteStore';

interface ProvidersProps {
  children: ReactNode;
}

function AuthListener() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setFavorites = useFavoritesStore((state) => state.setFavorites);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const hasShownFavoritesLoadError = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let authEventId = 0;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const currentEventId = ++authEventId;

      if (!firebaseUser) {
        setUser(null);
        clearFavorites();
        hasShownFavoritesLoadError.current = false;
        setLoading(false);
        return;
      }

      setUser({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName ?? firebaseUser.email ?? '',
        email: firebaseUser.email ?? '',
      });

      try {
        const favoriteIds = await getUserFavoriteIds(firebaseUser.uid);

        if (!isMounted || currentEventId !== authEventId) {
          return;
        }

        setFavorites(favoriteIds);
        hasShownFavoritesLoadError.current = false;
      } catch (error: unknown) {
        if (!isMounted || currentEventId !== authEventId) {
          return;
        }

        if (!hasShownFavoritesLoadError.current) {
          notifyError(error, 'favoritesLoad', {
            toastId: 'favorites-load-sync-error',
          });
          hasShownFavoritesLoadError.current = true;
        }
        clearFavorites();
      } finally {
        if (!isMounted || currentEventId !== authEventId) {
          return;
        }

        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [setUser, setLoading, setFavorites, clearFavorites]);

  return null;
}

function PaletteThemeSync() {
  const palette = usePaletteStore((state) => state.palette);

  useEffect(() => {
    document.documentElement.dataset.theme = palette;
  }, [palette]);

  return null;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthListener />
      <PaletteThemeSync />
      {children}
      <PaletteSwitcher />
      <AuthModal />
      <Toaster position='top-right' />
    </QueryClientProvider>
  );
}
