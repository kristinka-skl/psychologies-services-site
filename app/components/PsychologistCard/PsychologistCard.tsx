'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import AppointmentModal from '@/app/components/AppointmentModal/AppointmentModal';
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
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const openAuthModal = useUiStore((state) => state.openAuthModal);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);

  const onFavoriteClick = () => {
    if (!user) {
      toast.error('Favorites are available only for authorized users');
      openAuthModal('login');
      return;
    }

    toggleFavorite(psychologist.id);
  };

  return (
    <article className={css.card}>
      <div className={css.topRow}>
        <div className={css.profileBlock}>
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
          <div>
            <p className={css.role}>Psychologist</p>
            <h3 className={css.name}>{psychologist.name}</h3>
          </div>
        </div>

        <div className={css.metaBlock}>
          <p className={css.metaText}>Rating: {psychologist.rating.toFixed(2)}</p>
          <p className={css.metaText}>
            Price / 1 hour: <span className={css.price}>{psychologist.price_per_hour}$</span>
          </p>
          <button
            className={isFavorite ? css.favoriteButtonActive : css.favoriteButton}
            type='button'
            aria-label='Add to favorites'
            onClick={onFavoriteClick}
          >
            ♥
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

      <p className={isExpanded ? css.aboutExpanded : css.about}>{psychologist.about}</p>

      {isExpanded ? (
        <div className={css.reviews}>
          <h4 className={css.reviewsTitle}>Reviews</h4>
          {psychologist.reviews.map((review) => (
            <div key={review.reviewer} className={css.reviewItem}>
              <p className={css.reviewHead}>
                {review.reviewer} · {review.rating}
              </p>
              <p>{review.comment}</p>
            </div>
          ))}
          <button
            className={css.appointmentButton}
            type='button'
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

      <AppointmentModal
        isOpen={isAppointmentOpen}
        psychologistName={psychologist.name}
        onClose={() => setIsAppointmentOpen(false)}
      />
    </article>
  );
}
