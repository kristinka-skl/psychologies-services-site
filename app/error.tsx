'use client';

import css from './not-found.module.css';

type Props = {
  error: Error;
  reset: () => void;
};

const Error = ({ error, reset }: Props) => {
  return (
    <main className={css.container}>
      <h2 className={css.title}>Помилка при завантаженні</h2>
      <p className={css.text}>{error.message || 'Сталася непередбачувана помилка.'}</p>
      <button className={css.button} type='button' onClick={reset}>
        Спробувати знову
      </button>
    </main>
  );
};

export default Error;
