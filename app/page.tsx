import Link from 'next/link';
import Image from 'next/image';
import css from '@/app/page.module.css';

export default function HomePage() {
  return (
    <main className={css.page}>
      <section className={css.container}>
        <div className={css.heroContent}>
          <h1 className={css.title}>
            The road to the <span className={css.titleAccent}>depths</span> of the
            human soul
          </h1>
          <p className={css.description}>
            We help you reveal your potential, overcome challenges and find your
            own life guide with experienced psychologists.
          </p>
          <Link className={css.cta} href='/psychologists'>
            Get started
          </Link>
        </div>

        <div className={css.heroMedia}>
          <Image
            className={css.heroImage}
            src='https://images.unsplash.com/photo-1551843073-4a9a5b6fcd5f?auto=format&fit=crop&w=900&q=80'
            alt='Psychologist during consultation'
            width={464}
            height={526}
            unoptimized
          />
          <div className={css.statCard}>
            <p className={css.statLabel}>Experienced psychologists</p>
            <p className={css.statValue}>15,000</p>
          </div>
        </div>
      </section>
    </main>
  );
}
