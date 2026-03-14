'use client';

import { useState } from 'react';
import Image from 'next/image';
import AppointmentModal from '@/app/components/AppointmentModal/AppointmentModal';
import { notifyError, notifyInfo } from '@/app/lib/notifications';
import { Psychologist } from '@/app/types/psychologist';
import { useAuthStore } from '@/app/store/authStore';
import { useFavoritesStore } from '@/app/store/favoritesStore';
import { useUiStore } from '@/app/store/uiStore';
import css from '@/app/components/PsychologistCard/PsychologistCard.module.css';

interface PsychologistCardProps {
  psychologist: Psychologist;
}

export default function PsychologistCard({ psychologist }: PsychologistCardProps) {
  const user = useAuthStore((state) => state.user);
  const isFavorite = useFavoritesStore((state) =>
    state.isFavorite(psychologist.id)
  );
  const toggleFavoriteForUser = useFavoritesStore(
    (state) => state.toggleFavoriteForUser
  );
  const openAuthModal = useUiStore((state) => state.openAuthModal);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isFavoriteUpdating, setIsFavoriteUpdating] = useState(false);

  const onFavoriteClick = async () => {
    if (isFavoriteUpdating) {
      return;
    }

    if (!user) {
      notifyInfo('favoritesRequireAuth');
      openAuthModal('login');
      return;
    }

    setIsFavoriteUpdating(true);
    try {
      await toggleFavoriteForUser(user.uid, psychologist.id);
    } catch (error: unknown) {
      notifyError(error, 'favoritesToggle');
    } finally {
      setIsFavoriteUpdating(false);
    }
  };

  return (
    <article className={css.card}>
      <div className={css.avatarWrap}>
        <Image
          className={css.avatar}
          src={psychologist.avatar_url}
          alt={`${psychologist.name} avatar`}
          width={96}
          height={96}
          unoptimized
        />
      </div>

      <div className={css.content}>
        <div className={css.topRow}>
          <div>
            <p className={css.role}>Psychologist</p>
            <h3 className={css.name}>{psychologist.name}</h3>
          </div>

          <div className={css.metaBlock}>
            <p className={css.metaText}>
              <svg
                className={css.ratingIcon}
                width='18'
                height='18'
                aria-hidden='true'
              >
                <use href='/sprite.svg#icon-star' />
              </svg>
              Rating: {psychologist.rating.toFixed(2)}
            </p>
            <span className={css.metaDivider} aria-hidden='true' />
            <p className={css.metaText}>
              Price / 1 hour:{' '}
              <span className={css.price}>{psychologist.price_per_hour}$</span>
            </p>
            <button
              className={`${isFavorite ? css.favoriteButtonActive : css.favoriteButton} ${isFavoriteUpdating ? css.favoriteButtonLoading : ''}`}
              type='button'
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-busy={isFavoriteUpdating}
              onClick={onFavoriteClick}
            >
              <svg
                className={`${css.favoriteIcon} ${isFavoriteUpdating ? css.favoriteIconLoading : ''}`}
                width='22'
                height='22'
                aria-hidden='true'
              >
                <use
                  href={
                    isFavorite
                      ? '/sprite.svg#icon-heart-filled'
                      : '/sprite.svg#icon-heart'
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        <div className={css.chips}>
          <p className={css.chip}>
            Experience: <span>{psychologist.experience}</span>
          </p>
          <p className={css.chip}>
            License: <span>{psychologist.license}</span>
          </p>
          <p className={css.chip}>
            Specialization: <span>{psychologist.specialization}</span>
          </p>
          <p className={css.chip}>
            Initial consultation: <span>{psychologist.initial_consultation}</span>
          </p>
        </div>

        <p className={isExpanded ? css.aboutExpanded : css.about}>
          {psychologist.about}
        </p>

        {isExpanded ? (
          <div className={css.reviews}>
            <h4 className={css.reviewsTitle}>Reviews</h4>
            <div className={css.reviewsList}>
              {psychologist.reviews.map((review) => (
                <div key={review.reviewer} className={css.reviewItem}>
                  <div className={css.reviewTop}>
                    <span className={css.reviewerBadge} aria-hidden='true'>
                      {review.reviewer.charAt(0)}
                    </span>
                    <div>
                      <p className={css.reviewerName}>{review.reviewer}</p>
                      <p className={css.reviewRating}>
                        <svg
                          className={css.reviewRatingIcon}
                          width='16'
                          height='16'
                          aria-hidden='true'
                        >
                          <use href='/sprite.svg#icon-star' />
                        </svg>
                        {review.rating.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <p className={css.reviewComment}>{review.comment}</p>
                </div>
              ))}
            </div>
            <button
              className={css.appointmentButton}
              type='button'
              aria-label={`Make an appointment with ${psychologist.name}`}
              onClick={() => setIsAppointmentOpen(true)}
            >
              Make an appointment
            </button>
          </div>
        ) : null}

        <button
          className={css.readMore}
          type='button'
          onClick={() => setIsExpanded((prevState) => !prevState)}
        >
          {isExpanded ? 'Hide details' : 'Read more'}
        </button>
      </div>

      <AppointmentModal
        isOpen={isAppointmentOpen}
        psychologistName={psychologist.name}
        psychologistAvatarUrl={psychologist.avatar_url}
        onClose={() => setIsAppointmentOpen(false)}
      />
    </article>
  );
}
