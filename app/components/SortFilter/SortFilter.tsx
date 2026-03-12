'use client';

import css from '@/app/components/SortFilter/SortFilter.module.css';

export type SortValue =
  | 'a-z'
  | 'z-a'
  | 'price-low'
  | 'price-high'
  | 'rating-low'
  | 'rating-high';

interface SortFilterProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
}

export default function SortFilter({ value, onChange }: SortFilterProps) {
  return (
    <label className={css.wrapper}>
      <span className={css.label}>Filters</span>
      <select
        className={css.select}
        value={value}
        onChange={(event) => onChange(event.target.value as SortValue)}
      >
        <option value='a-z'>A to Z</option>
        <option value='z-a'>Z to A</option>
        <option value='price-low'>Price: low to high</option>
        <option value='price-high'>Price: high to low</option>
        <option value='rating-low'>Rating: low to high</option>
        <option value='rating-high'>Rating: high to low</option>
      </select>
    </label>
  );
}
