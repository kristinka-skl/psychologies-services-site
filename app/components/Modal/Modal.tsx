'use client';

import { ReactNode, useEffect, useId, useRef } from 'react';
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
  const titleId = useId();
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) {
        return;
      }

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const focusable = Array.from(focusableElements).filter(
        (element) => !element.hasAttribute('disabled')
      );

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
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
    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

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
        ref={modalRef}
        className={`${css.modal} ${size === 'appointment' ? css.modalAppointment : ''}`}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          className={css.closeButton}
          type='button'
          onClick={onClose}
          aria-label='Close modal'
        >
          <svg className={css.closeIcon} width='20' height='20' aria-hidden='true'>
            <use href='/sprite.svg#icon-close' />
          </svg>
        </button>
        <h2 id={titleId} className={css.title}>
          {title}
        </h2>
        {children}
      </section>
    </div>,
    document.body
  );
}
