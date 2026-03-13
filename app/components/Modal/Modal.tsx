'use client';

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from '@/app/components/Modal/Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'default' | 'appointment';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'default',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className={css.backdrop}
      onClick={onClose}
      role='presentation'
    >
      <section
        className={`${css.modal} ${size === 'appointment' ? css.modalAppointment : ''}`}
        role='dialog'
        aria-modal='true'
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className={css.closeButton}
          type='button'
          onClick={onClose}
          aria-label='Close modal'
        >
          ×
        </button>
        <h2 className={css.title}>{title}</h2>
        {children}
      </section>
    </div>,
    document.body
  );
}
