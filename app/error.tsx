'use client';

import css from './not-found.module.css';

type Props = {
  error: Error;
  reset: () => void;
};

const Error = ({ error: _error, reset }: Props) => {
  return (
    <main className={css.container}>
      <h2 className={css.title}>Loading error</h2>
      <p className={css.text}>Something went wrong while loading data.</p>
      <button className={css.button} type='button' onClick={reset}>
        Try again
      </button>
    </main>
  );
};

export default Error;
