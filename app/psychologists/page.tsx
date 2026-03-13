'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PsychologistCard from '@/app/components/PsychologistCard/PsychologistCard';
import SortFilter from '@/app/components/SortFilter/SortFilter';
import { getPsychologists } from '@/app/lib/psychologistsApi';
import { sortPsychologists, SortValue } from '@/app/lib/sortPsychologists';
import css from '@/app/psychologists/page.module.css';

const INITIAL_ITEMS = 3;
const STEP_ITEMS = 3;

export default function PsychologistsPage() {
  const [sortValue, setSortValue] = useState<SortValue>('a-z');
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['psychologists'],
    queryFn: getPsychologists,
  });

  if (isError) {
    throw error;
  }

  const sortedPsychologists = useMemo(
    () => sortPsychologists(sortValue, data || []),
    [data, sortValue]
  );

  const visiblePsychologists = sortedPsychologists.slice(0, visibleCount);
  const hasMore = visibleCount < sortedPsychologists.length;

  return (
    <main className={css.page}>
      <section className={css.container}>
        <SortFilter value={sortValue} onChange={setSortValue} />

        {isLoading ? (
          <p>Loading psychologists...</p>
        ) : (
          <div className={css.cards}>
            {visiblePsychologists.map((psychologist) => (
              <PsychologistCard key={psychologist.id} psychologist={psychologist} />
            ))}
          </div>
        )}

        {!isLoading && hasMore ? (
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
