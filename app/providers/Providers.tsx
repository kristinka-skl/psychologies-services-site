'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import AuthModal from '@/app/components/AuthModal/AuthModal';
import { auth } from '@/app/lib/firebaseClient';
import { useAuthStore } from '@/app/store/authStore';

interface ProvidersProps {
  children: ReactNode;
}

function AuthListener() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName ?? firebaseUser.email ?? '',
          email: firebaseUser.email ?? '',
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setLoading]);

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
