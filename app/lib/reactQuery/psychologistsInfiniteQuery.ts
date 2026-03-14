import { infiniteQueryOptions } from '@tanstack/react-query';
import { getPsychologistsPage } from '@/app/lib/psychologistsApi';

export const PSYCHOLOGISTS_STEP_ITEMS = 3;

export function psychologistsInfiniteQueryOptions() {
  return infiniteQueryOptions({
    queryKey: ['psychologists', 'infinite'] as const,
    queryFn: ({ pageParam }) =>
      getPsychologistsPage({
        cursor: pageParam,
        limit: PSYCHOLOGISTS_STEP_ITEMS,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  });
}
