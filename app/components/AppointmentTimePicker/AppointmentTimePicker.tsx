'use client';

import { useEffect, useRef, useState } from 'react';
import css from './AppointmentTimePicker.module.css';

interface AppointmentTimePickerProps {
  value: string;
  error?: string;
  hasError?: boolean;
  options: string[];
  onSelect: (value: string) => void;
}

export default function AppointmentTimePicker({
  value,
  error,
  hasError = false,
  options,
  onSelect,
}: AppointmentTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onDocumentPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!pickerRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onDocumentPointerDown);
    document.addEventListener('touchstart', onDocumentPointerDown);

    return () => {
      document.removeEventListener('mousedown', onDocumentPointerDown);
      document.removeEventListener('touchstart', onDocumentPointerDown);
    };
  }, [isOpen]);

  const focusOption = (index: number) => {
    optionRefs.current[index]?.focus();
  };

  const openDropdown = () => {
    setIsOpen(true);
    const selectedIndex = Math.max(0, options.indexOf(value || ''));
    window.requestAnimationFrame(() => {
      focusOption(selectedIndex);
    });
  };

  return (
    <div className={css.wrapper} ref={pickerRef}>
      <button
        ref={buttonRef}
        className={`${css.button} ${hasError ? css.buttonError : ''}`}
        type='button'
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-label='Open meeting time options'
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            return;
          }
          openDropdown();
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!isOpen) {
              openDropdown();
            }
          }
        }}
      >
        {value || '00:00'}
        <svg
          className={css.icon}
          width='20'
          height='20'
          viewBox='0 0 20 20'
          aria-hidden='true'
        >
          <path
            d='M10 2.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15Zm0 1.5a6 6 0 1 1 0 12a6 6 0 0 1 0-12Zm-.75 2.25h1.5v3.4l2.42 1.45l-.77 1.29L9.25 10.5V6.25Z'
            fill='currentColor'
          />
        </svg>
      </button>

      <span className={css.error}>{error}</span>

      {isOpen ? (
        <div className={css.dropdown} role='listbox' aria-label='Meeting time'>
          <p className={css.dropdownTitle}>Meeting time</p>
          <ul className={css.list}>
            {options.map((time, index) => (
              <li key={time}>
                <button
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  className={`${css.option} ${value === time ? css.optionActive : ''}`}
                  type='button'
                  role='option'
                  aria-selected={value === time}
                  onClick={() => {
                    onSelect(time);
                    setIsOpen(false);
                    buttonRef.current?.focus();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      event.preventDefault();
                      setIsOpen(false);
                      buttonRef.current?.focus();
                      return;
                    }

                    if (event.key === 'ArrowDown') {
                      event.preventDefault();
                      focusOption((index + 1) % options.length);
                      return;
                    }

                    if (event.key === 'ArrowUp') {
                      event.preventDefault();
                      focusOption((index - 1 + options.length) % options.length);
                    }
                  }}
                >
                  {time.replace(':', ' : ')}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
