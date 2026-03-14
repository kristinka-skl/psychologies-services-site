import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getServerQueryClient } from '@/app/lib/reactQuery/getServerQueryClient';
import { psychologistsInfiniteQueryOptions } from '@/app/lib/reactQuery/psychologistsInfiniteQuery';
import PsychologistsClientPage from '@/app/psychologists/psychologists.client';

export const metadata: Metadata = {
  title: 'Psychologists - Psychologists Services',
  description:
    'Browse psychologists, compare profiles, and choose a specialist for your consultation.',
  openGraph: {
    title: 'Psychologists - Psychologists Services',
    description:
      'Browse psychologists, compare profiles, and choose a specialist for your consultation.',
    url: '/psychologists',
    siteName: 'Psychologists Services',
    images: [
      {
        url: '/og-psychology.webp',
        width: 1200,
        height: 630,
        alt: 'Psychologists directory in Psychologists Services',
      },
    ],
    type: 'website',
  },
};

export default async function PsychologistsPage() {
  const queryClient = getServerQueryClient();
  await queryClient.prefetchInfiniteQuery(psychologistsInfiniteQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PsychologistsClientPage />
    </HydrationBoundary>
  );
}
