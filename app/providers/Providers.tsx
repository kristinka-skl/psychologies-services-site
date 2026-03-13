'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import AuthModal from '@/app/components/AuthModal/AuthModal';
import { auth } from '@/app/lib/firebaseSdk';
import { getUserFavoriteIds } from '@/app/lib/favoritesApi';
import { useAuthStore } from '@/app/store/authStore';
import { useFavoritesStore } from '@/app/store/favoritesStore';

interface ProvidersProps {
  children: ReactNode;
}

function AuthListener() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setFavorites = useFavoritesStore((state) => state.setFavorites);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);

  useEffect(() => {
    let isMounted = true;
    let authEventId = 0;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const currentEventId = ++authEventId;

      if (!firebaseUser) {
        setUser(null);
        clearFavorites();
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
      } catch {
        if (!isMounted || currentEventId !== authEventId) {
          return;
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

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthListener />
      {children}
      <AuthModal />
      <Toaster position='top-right' />
    </QueryClientProvider>
  );
}
