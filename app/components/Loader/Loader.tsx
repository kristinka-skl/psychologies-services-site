import css from './Loader.module.css';

type LoaderProps = {
  label?: string;
  size?: 'sm' | 'md';
  centered?: boolean;
};

export default function Loader({
  label = 'Loading...',
  size = 'md',
  centered = true,
}: LoaderProps) {
  const rootClassName = centered ? `${css.root} ${css.centered}` : css.root;
  const spinnerClassName =
    size === 'sm' ? `${css.spinner} ${css.spinnerSm}` : `${css.spinner} ${css.spinnerMd}`;

  return (
    <span className={rootClassName} role='status' aria-live='polite' aria-label={label}>
      <span className={spinnerClassName} aria-hidden='true' />
      <span className={css.visuallyHidden}>{label}</span>
    </span>
  );
}
