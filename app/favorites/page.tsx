'use client';

import { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import SortFilter from '@/app/components/SortFilter/SortFilter';
import { useAuthStore } from '@/app/store/authStore';
import { getPsychologistsByIds } from '@/app/lib/psychologistsApi';
import { sortPsychologists, SortValue } from '@/app/lib/sortPsychologists';
import { useFavoritesStore } from '@/app/store/favoritesStore';
import PsychologistCard from '@/app/components/PsychologistCard/PsychologistCard';
import css from '@/app/favorites/page.module.css';

const STEP_ITEMS = 3;

export default function FavoritesPage() {
  const [sortValue, setSortValue] = useState<SortValue>('a-z');
  const [sortedCount, setSortedCount] = useState(STEP_ITEMS);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['favorite-psychologists', favoriteIds],
    queryFn: async ({ pageParam }) => {
      const nextIds = favoriteIds.slice(pageParam, pageParam + STEP_ITEMS);
      const items = await getPsychologistsByIds(nextIds);
      const nextOffset = pageParam + nextIds.length;

      return {
        items,
        nextOffset,
        hasMore: nextOffset < favoriteIds.length,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
    enabled: Boolean(user) && favoriteIds.length > 0,
  });

  useEffect(() => {
    if (loading || user) {
      return;
    }

    router.replace('/');
  }, [loading, user, router]);

  if (isError) {
    throw error;
  }

  const loadedFavoritePsychologists = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );
  const visibleFavoritePsychologists = useMemo(() => {
    const normalizedSortedCount = Math.min(
      sortedCount,
      loadedFavoritePsychologists.length
    );
    const sortedPart = sortPsychologists(
      sortValue,
      loadedFavoritePsychologists.slice(0, normalizedSortedCount)
    );
    const appendedPart = loadedFavoritePsychologists.slice(normalizedSortedCount);

    return [...sortedPart, ...appendedPart];
  }, [loadedFavoritePsychologists, sortedCount, sortValue]);

  function handleSortChange(nextSortValue: SortValue) {
    setSortValue(nextSortValue);
    setSortedCount(Math.max(loadedFavoritePsychologists.length, STEP_ITEMS));
  }

  if (loading || isLoading) {
    return (
      <main className={css.page}>
        <section className={css.container}>
          <h1 className={css.visuallyHidden}>Favorites</h1>
          <p className={css.emptyText}>Loading favorites...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className={css.page}>
      <section className={css.container}>
        <h1 className={css.visuallyHidden}>Favorites</h1>
        <SortFilter value={sortValue} onChange={handleSortChange} />

        {visibleFavoritePsychologists.length ? (
          <div className={css.cards}>
            {visibleFavoritePsychologists.map((psychologist) => (
              <PsychologistCard key={psychologist.id} psychologist={psychologist} />
            ))}
          </div>
        ) : (
          <p className={css.emptyText}>
            You have no favorite psychologists yet. Add them from the Psychologists page.
          </p>
        )}

        {hasNextPage ? (
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
