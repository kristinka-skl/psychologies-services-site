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
          <div className={css.heroImageWrap}>
            <Image
              className={css.heroImage}
              src='/images/hero/psychologist-hero.png'
              alt='Psychologist in glasses during a consultation'
              width={464}
              height={526}
              priority
              quality={90}
              sizes='(min-width: 1440px) 464px, (min-width: 768px) 42vw, 92vw'
            />

            <div className={css.questionBadge} aria-hidden='true'>
              ?
            </div>

            <div className={css.usersBadge} aria-hidden='true'>
              <svg viewBox='0 0 24 24' role='img' aria-hidden='true'>
                <path d='M16 11c1.66 0 3-1.79 3-4s-1.34-4-3-4-3 1.79-3 4 1.34 4 3 4Z' />
                <path d='M8 11c1.66 0 3-1.79 3-4S9.66 3 8 3 5 4.79 5 7s1.34 4 3 4Z' />
                <path d='M8 13c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z' />
                <path d='M16 13c-.29 0-.62.02-.97.05 1.33.96 2.97 2.36 2.97 3.95v2h6v-2c0-2.66-5.33-4-8-4Z' />
              </svg>
            </div>

            <div className={css.statCard}>
              <div className={css.statIcon} aria-hidden='true'>
                <svg viewBox='0 0 24 24' role='img' aria-hidden='true'>
                  <path d='M9.55 17.42 4.8 12.67l1.41-1.42 3.34 3.34 8.24-8.24 1.41 1.42-9.65 9.65Z' />
                </svg>
              </div>
              <div>
                <p className={css.statLabel}>Experienced psychologists</p>
                <p className={css.statValue}>15,000</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
