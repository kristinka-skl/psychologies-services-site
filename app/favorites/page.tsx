'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import SortFilter from '@/app/components/SortFilter/SortFilter';
import { useAuthStore } from '@/app/store/authStore';
import { getPsychologists } from '@/app/lib/psychologistsApi';
import { sortPsychologists, SortValue } from '@/app/lib/sortPsychologists';
import { useFavoritesStore } from '@/app/store/favoritesStore';
import PsychologistCard from '@/app/components/PsychologistCard/PsychologistCard';
import css from '@/app/favorites/page.module.css';

const INITIAL_ITEMS = 3;
const STEP_ITEMS = 3;

export default function FavoritesPage() {
  const [sortValue, setSortValue] = useState<SortValue>('a-z');
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['psychologists'],
    queryFn: getPsychologists,
    enabled: Boolean(user),
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

  const favoritePsychologists = useMemo(
    () => (data || []).filter((psychologist) => favoriteIds.includes(psychologist.id)),
    [data, favoriteIds]
  );
  const sortedFavoritePsychologists = useMemo(
    () => sortPsychologists(sortValue, favoritePsychologists),
    [favoritePsychologists, sortValue]
  );
  const visibleFavoritePsychologists = sortedFavoritePsychologists.slice(
    0,
    visibleCount
  );
  const hasMore = visibleCount < sortedFavoritePsychologists.length;

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
        <SortFilter value={sortValue} onChange={setSortValue} />

        {sortedFavoritePsychologists.length ? (
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

        {hasMore ? (
          <button
            className={css.loadMoreButton}
            type='button'
            onClick={() => setVisibleCount((count) => count + STEP_ITEMS)}
          >
            Load more
          </button>
        ) : null}
      </section>
    </main>
  );
}
