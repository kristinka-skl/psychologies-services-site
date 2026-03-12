'use client';

import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import AuthModal from '@/app/components/AuthModal/AuthModal';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <AuthModal />
      <Toaster position='top-right' />
    </>
  );
}
