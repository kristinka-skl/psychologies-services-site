'use client';

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from '@/app/components/Modal/Modal.module.css';

let openModalCount = 0;
let previousBodyOverflow = '';
let previousHtmlOverflow = '';

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

    if (openModalCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      previousHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    openModalCount += 1;
    window.addEventListener('keydown', onKeyDown);

    return () => {
      openModalCount = Math.max(0, openModalCount - 1);
      if (openModalCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
        document.documentElement.style.overflow = previousHtmlOverflow;
      }
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
          <svg className={css.closeIcon} width='20' height='20' aria-hidden='true'>
            <use href='/sprite.svg#icon-close' />
          </svg>
        </button>
        <h2 className={css.title}>{title}</h2>
        {children}
      </section>
    </div>,
    document.body
  );
}
