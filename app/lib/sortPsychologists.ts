import { Psychologist } from '@/app/types/psychologist';

export type SortValue =
  | 'show-all'
  | 'a-z'
  | 'z-a'
  | 'price-low'
  | 'price-high'
  | 'rating-low'
  | 'rating-high';

export function sortPsychologists(value: SortValue, source: Psychologist[]) {
  const data = [...source];

  switch (value) {
    case 'show-all':
      return data;
    case 'a-z':
      return data.sort((a, b) => a.name.localeCompare(b.name));
    case 'z-a':
      return data.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-low':
      return data.sort((a, b) => a.price_per_hour - b.price_per_hour);
    case 'price-high':
      return data.sort((a, b) => b.price_per_hour - a.price_per_hour);
    case 'rating-low':
      return data.sort((a, b) => a.rating - b.rating);
    case 'rating-high':
      return data.sort((a, b) => b.rating - a.rating);
    default:
      return data;
  }
}
