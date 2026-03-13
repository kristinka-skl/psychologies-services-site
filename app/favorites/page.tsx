'use client';

import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore';
import { getPsychologists } from '@/app/lib/psychologistsApi';
import { useFavoritesStore } from '@/app/store/favoritesStore';
import PsychologistCard from '@/app/components/PsychologistCard/PsychologistCard';
import css from '@/app/favorites/page.module.css';

export default function FavoritesPage() {
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

  if (loading || isLoading) {
    return (
      <main className={css.page}>
        <section className={css.container}>
          <h1 className={css.title}>Favorites</h1>
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
        <h1 className={css.title}>Favorites</h1>

        {favoritePsychologists.length ? (
          <div className={css.cards}>
            {favoritePsychologists.map((psychologist) => (
              <PsychologistCard key={psychologist.id} psychologist={psychologist} />
            ))}
          </div>
        ) : (
          <p className={css.emptyText}>
            You have no favorite psychologists yet. Add them from the Psychologists page.
          </p>
        )}
      </section>
    </main>
  );
}
