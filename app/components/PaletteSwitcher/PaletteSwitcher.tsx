'use client';

import { type CSSProperties, useMemo, useState } from 'react';
import css from './PaletteSwitcher.module.css';
import { Palette, usePaletteStore } from '@/app/store/paletteStore';

const PALETTE_OPTIONS: Array<{ value: Palette; label: string }> = [
  { value: 'green', label: 'Green' },
  { value: 'orange', label: 'Orange' },
  { value: 'blue', label: 'Blue' },
];

export default function PaletteSwitcher() {
  const palette = usePaletteStore((state) => state.palette);
  const setPalette = usePaletteStore((state) => state.setPalette);
  const [isOpen, setIsOpen] = useState(false);

  const hiddenOptions = useMemo(
    () => PALETTE_OPTIONS.filter((option) => option.value !== palette),
    [palette]
  );

  const getSwatchClassName = (value: Palette) => {
    if (value === 'green') {
      return css.swatchGreen;
    }

    if (value === 'orange') {
      return css.swatchOrange;
    }

    return css.swatchBlue;
  };

  return (
    <section className={css.switcher} aria-label='Site color palette'>
      <div className={css.stack} role='group' aria-label='Color themes'>
        {hiddenOptions.map((option, index) => (
          <button
            key={option.value}
            type='button'
            aria-hidden={!isOpen}
            aria-label={`${option.label} color theme`}
            aria-pressed={false}
            className={`${css.circle} ${css.option} ${
              isOpen ? css.optionVisible : ''
            }`}
            tabIndex={isOpen ? 0 : -1}
            style={
              {
                '--option-offset': `${(index + 1) * 56}px`,
              } as CSSProperties
            }
            onClick={() => {
              setPalette(option.value);
              setIsOpen(false);
            }}
          >
            <span
              className={`${css.swatch} ${getSwatchClassName(option.value)}`}
              aria-hidden='true'
            />
          </button>
        ))}

        <button
          type='button'
          aria-expanded={isOpen}
          aria-label='Current color theme'
          aria-pressed={isOpen}
          className={`${css.circle} ${css.trigger}`}
          onClick={() => setIsOpen((open) => !open)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setIsOpen(false);
            }
          }}
        >
          <span className={`${css.swatch} ${getSwatchClassName(palette)}`} />
        </button>
      </div>
    </section>
  );
}
