'use client';

import { useMemo, useState } from 'react';
import PsychologistCard from '@/app/components/PsychologistCard/PsychologistCard';
import SortFilter, { SortValue } from '@/app/components/SortFilter/SortFilter';
import { psychologists } from '@/app/constants/psychologists';
import css from '@/app/psychologists/page.module.css';

const INITIAL_ITEMS = 3;
const STEP_ITEMS = 3;

function sortPsychologists(value: SortValue) {
  const data = [...psychologists];

  switch (value) {
    case 'a-z':
      return data.sort((a, b) => a.name.localeCompare(b.name));
    case 'z-a':
      return data.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-low':
      return data.sort((a, b) => a.price_per_hour - b.price_per_hour);
    case 'price-high':
      return data.sort((a, b) => b.price_per_hour - a.price_per_hour);
    case 'rating-low':
      return data.sort((a, b) => a.rating - b.rating);
    case 'rating-high':
      return data.sort((a, b) => b.rating - a.rating);
    default:
      return data;
  }
}

export default function PsychologistsPage() {
  const [sortValue, setSortValue] = useState<SortValue>('a-z');
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS);

  const sortedPsychologists = useMemo(
    () => sortPsychologists(sortValue),
    [sortValue]
  );

  const visiblePsychologists = sortedPsychologists.slice(0, visibleCount);
  const hasMore = visibleCount < sortedPsychologists.length;

  return (
    <main className={css.page}>
      <section className={css.container}>
        <SortFilter value={sortValue} onChange={setSortValue} />

        <div className={css.cards}>
          {visiblePsychologists.map((psychologist) => (
            <PsychologistCard key={psychologist.id} psychologist={psychologist} />
          ))}
        </div>

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
