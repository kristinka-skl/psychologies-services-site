'use client';

import { useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import PsychologistCard from '@/app/components/PsychologistCard/PsychologistCard';
import SortFilter from '@/app/components/SortFilter/SortFilter';
import Loader from '@/app/components/Loader/Loader';
import { getPsychologistsPage } from '@/app/lib/psychologistsApi';
import { sortPsychologists, SortValue } from '@/app/lib/sortPsychologists';
import css from '@/app/psychologists/page.module.css';

const STEP_ITEMS = 3;

export default function PsychologistsPage() {
  const [sortValue, setSortValue] = useState<SortValue>('a-z');
  const [sortedCount, setSortedCount] = useState(STEP_ITEMS);
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['psychologists', 'infinite'],
    queryFn: ({ pageParam }) =>
      getPsychologistsPage({ cursor: pageParam, limit: STEP_ITEMS }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  if (isError) {
    throw error;
  }

  const loadedPsychologists = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );
  const visiblePsychologists = useMemo(() => {
    const normalizedSortedCount = Math.min(sortedCount, loadedPsychologists.length);
    const sortedPart = sortPsychologists(
      sortValue,
      loadedPsychologists.slice(0, normalizedSortedCount)
    );
    const appendedPart = loadedPsychologists.slice(normalizedSortedCount);

    return [...sortedPart, ...appendedPart];
  }, [loadedPsychologists, sortedCount, sortValue]);

  function handleSortChange(nextSortValue: SortValue) {
    setSortValue(nextSortValue);
    setSortedCount(Math.max(loadedPsychologists.length, STEP_ITEMS));
  }

  return (
    <main className={css.page}>
      <section className={css.container}>
        <SortFilter value={sortValue} onChange={handleSortChange} />

        {isLoading ? (
          <Loader label='Loading psychologists' />
        ) : (
          <div className={css.cards}>
            {visiblePsychologists.map((psychologist) => (
              <PsychologistCard key={psychologist.id} psychologist={psychologist} />
            ))}
          </div>
        )}

        {!isLoading && hasNextPage ? (
          <button
            className={css.loadMoreButton}
            type='button'
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load more'}
          </button>
        ) : null}
      </section>
    </main>
  );
}
