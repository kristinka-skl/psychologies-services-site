'use client';

import { useEffect, useRef, useState } from 'react';
import css from '@/app/components/SortFilter/SortFilter.module.css';
import { SortValue } from '@/app/lib/sortPsychologists';

interface SortFilterProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
}

const SORT_OPTIONS: Array<{ value: SortValue; label: string }> = [
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'rating-low', label: 'Rating: low to high' },
  { value: 'rating-high', label: 'Rating: high to low' },
  { value: 'show-all', label: 'Show all' },
];

export default function SortFilter({ value, onChange }: SortFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedIndex = Math.max(
    0,
    SORT_OPTIONS.findIndex((option) => option.value === value)
  );
  const selectedLabel = SORT_OPTIONS[selectedIndex]?.label || 'Show all';

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onDocumentPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!wrapperRef.current?.contains(target)) {
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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    window.requestAnimationFrame(() => {
      optionRefs.current[selectedIndex]?.focus();
    });
  }, [isOpen, selectedIndex]);

  const focusOption = (index: number) => {
    const nextIndex = (index + SORT_OPTIONS.length) % SORT_OPTIONS.length;
    optionRefs.current[nextIndex]?.focus();
  };

  const closeDropdown = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div className={css.wrapper}>
      <span className={css.label}>Filters</span>
      <div className={css.selectWrapper} ref={wrapperRef}>
        <button
          ref={buttonRef}
          className={css.selectButton}
          type='button'
          aria-haspopup='listbox'
          aria-expanded={isOpen}
          aria-label='Sort psychologists'
          onClick={() => setIsOpen((open) => !open)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              setIsOpen(false);
              return;
            }

            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setIsOpen(true);
            }
          }}
        >
          {selectedLabel}
          <span
            className={`${css.chevron} ${isOpen ? css.chevronOpen : ''}`}
            aria-hidden='true'
          />
        </button>

        {isOpen ? (
          <ul
            className={css.dropdown}
            role='listbox'
            aria-label='Sort options'
          >
            {SORT_OPTIONS.map((option, index) => (
              <li key={option.value}>
                <button
                  id={`sort-option-${option.value}`}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  className={`${css.option} ${
                    value === option.value ? css.optionActive : ''
                  }`}
                  type='button'
                  role='option'
                  aria-selected={value === option.value}
                  onClick={() => {
                    onChange(option.value);
                    closeDropdown();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      event.preventDefault();
                      closeDropdown();
                      return;
                    }

                    if (event.key === 'ArrowDown') {
                      event.preventDefault();
                      focusOption(index + 1);
                      return;
                    }

                    if (event.key === 'ArrowUp') {
                      event.preventDefault();
                      focusOption(index - 1);
                    }
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
