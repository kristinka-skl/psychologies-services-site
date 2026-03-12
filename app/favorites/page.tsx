'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore';
import { useFavoritesStore } from '@/app/store/favoritesStore';
import { psychologists } from '@/app/constants/psychologists';
import PsychologistCard from '@/app/components/PsychologistCard/PsychologistCard';
import css from '@/app/favorites/page.module.css';

export default function FavoritesPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);

  const favoritePsychologists = useMemo(
    () => psychologists.filter((psychologist) => favoriteIds.includes(psychologist.id)),
    [favoriteIds]
  );

  if (!user) {
    return (
      <main className={css.page}>
        <section className={css.container}>
          <h1 className={css.title}>Favorites</h1>
          <p className={css.emptyText}>
            This page is available only for authorized users.
          </p>
          <div className={css.actions}>
            <button className={css.primaryButton} type='button' onClick={() => router.push('/')}>
              Go to Home
            </button>
            <Link className={css.secondaryLink} href='/psychologists'>
              Open Psychologists
            </Link>
          </div>
        </section>
      </main>
    );
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
