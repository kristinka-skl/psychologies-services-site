import Link from 'next/link';
import css from './not-found.module.css';

const NotFound = () => {
  return (
    <main className={css.container}>
      <h1 className={css.title}>404 - Page Not Found</h1>
      <p className={css.text}>
        Sorry, the page you&#39;re looking for doesn&#39;t exist. It might have
        been moved or deleted.
      </p>
      <Link href='/' className={css.button}>
        Go back home
      </Link>
    </main>
  );
};

export default NotFound;
