import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getServerQueryClient } from '@/app/lib/reactQuery/getServerQueryClient';
import { psychologistsInfiniteQueryOptions } from '@/app/lib/reactQuery/psychologistsInfiniteQuery';
import PsychologistsClientPage from '@/app/psychologists/psychologists.client';

export default async function PsychologistsPage() {
  const queryClient = getServerQueryClient();
  await queryClient.prefetchInfiniteQuery(psychologistsInfiniteQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PsychologistsClientPage />
    </HydrationBoundary>
  );
}
