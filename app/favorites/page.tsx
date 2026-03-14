'use client';

import { useEffect, useMemo, useRef, useState, type TransitionEvent } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import SortFilter from '@/app/components/SortFilter/SortFilter';
import { useAuthStore } from '@/app/store/authStore';
import { getPsychologistsByIds } from '@/app/lib/psychologistsApi';
import { sortPsychologists, SortValue } from '@/app/lib/sortPsychologists';
import { useFavoritesStore } from '@/app/store/favoritesStore';
import PsychologistCard from '@/app/components/PsychologistCard/PsychologistCard';
import { Psychologist } from '@/app/types/psychologist';
import css from '@/app/favorites/page.module.css';

const STEP_ITEMS = 3;
const REMOVE_CARD_ANIMATION_MS = 240;

interface RemovingFavoriteCard {
  psychologist: Psychologist;
  index: number;
}

export default function FavoritesPage() {
  const [sortValue, setSortValue] = useState<SortValue>('a-z');
  const [sortedCount, setSortedCount] = useState(STEP_ITEMS);
  const [removingIds, setRemovingIds] = useState<string[]>([]);
  const [removingCards, setRemovingCards] = useState<
    Record<string, RemovingFavoriteCard>
  >({});
  const removeTimersRef = useRef<
    Partial<Record<string, ReturnType<typeof window.setTimeout>>>
  >({});
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavoriteForUser = useFavoritesStore(
    (state) => state.toggleFavoriteForUser
  );
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
    placeholderData: (previousData) => previousData,
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
  const renderedFavoritePsychologists = useMemo(() => {
    const cards = [...visibleFavoritePsychologists];
    const insertingCards = Object.entries(removingCards)
      .filter(([id]) => !cards.some((card) => card.id === id))
      .map(([id, card]) => ({ id, ...card }))
      .sort((first, second) => first.index - second.index);

    let insertedCount = 0;

    insertingCards.forEach((card) => {
      const insertAt = Math.min(card.index + insertedCount, cards.length);
      cards.splice(insertAt, 0, card.psychologist);
      insertedCount += 1;
    });

    return cards;
  }, [removingCards, visibleFavoritePsychologists]);
  const removingIdSet = useMemo(() => new Set(removingIds), [removingIds]);

  useEffect(() => {
    return () => {
      Object.values(removeTimersRef.current).forEach((timerId) => {
        if (timerId) {
          window.clearTimeout(timerId);
        }
      });
    };
  }, []);

  function finalizeRemovingCard(id: string) {
    const timerId = removeTimersRef.current[id];

    if (timerId) {
      window.clearTimeout(timerId);
      delete removeTimersRef.current[id];
    }

    setRemovingIds((prevState) =>
      prevState.filter((removingId) => removingId !== id)
    );
    setRemovingCards((prevState) => {
      if (!prevState[id]) {
        return prevState;
      }

      const nextState = { ...prevState };
      delete nextState[id];
      return nextState;
    });
  }

  async function handleRequestUnfavorite(id: string) {
    if (!user || removingIdSet.has(id)) {
      return;
    }

    const cardIndex = visibleFavoritePsychologists.findIndex(
      (psychologist) => psychologist.id === id
    );
    const psychologistCard = visibleFavoritePsychologists[cardIndex];

    if (cardIndex !== -1 && psychologistCard) {
      setRemovingCards((prevState) => ({
        ...prevState,
        [id]: {
          psychologist: psychologistCard,
          index: cardIndex,
        },
      }));
    }

    setRemovingIds((prevState) =>
      prevState.includes(id) ? prevState : [...prevState, id]
    );

    try {
      await toggleFavoriteForUser(user.uid, id);
      removeTimersRef.current[id] = window.setTimeout(
        () => finalizeRemovingCard(id),
        REMOVE_CARD_ANIMATION_MS
      );
    } catch (error) {
      finalizeRemovingCard(id);
      throw error;
    }
  }

  function handleCardTransitionEnd(
    event: TransitionEvent<HTMLDivElement>,
    id: string
  ) {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (!removingIdSet.has(id)) {
      return;
    }

    if (event.propertyName === 'max-height') {
      finalizeRemovingCard(id);
    }
  }

  function handleSortChange(nextSortValue: SortValue) {
    setSortValue(nextSortValue);
    setSortedCount(Math.max(loadedFavoritePsychologists.length, STEP_ITEMS));
  }

  if (loading || (isLoading && !data)) {
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

        {renderedFavoritePsychologists.length ? (
          <div className={css.cards}>
            {renderedFavoritePsychologists.map((psychologist) => (
              <div
                key={psychologist.id}
                className={`${css.cardItem} ${removingIdSet.has(psychologist.id) ? css.cardItemRemoving : ''}`}
                onTransitionEnd={(event) =>
                  handleCardTransitionEnd(event, psychologist.id)
                }
              >
                <PsychologistCard
                  psychologist={psychologist}
                  isRemoving={removingIdSet.has(psychologist.id)}
                  onRequestUnfavorite={handleRequestUnfavorite}
                />
              </div>
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
