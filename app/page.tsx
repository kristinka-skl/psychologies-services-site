import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import css from '@/app/page.module.css';

export const metadata: Metadata = {
  title: 'Psychologists Services',
  description:
    'Find experienced psychologists and book your personal consultation.',
  openGraph: {
    title: 'Psychologists Services',
    description:
      'Find experienced psychologists and book your personal consultation.',
    url: '/',
    siteName: 'Psychologists Services',
    images: [
      {
        url: '/og-psychology.webp',
        width: 1200,
        height: 630,
        alt: 'Psychologists Services - professional mental health support',
      },
    ],
    type: 'website',
  },
};

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
            <span>Get started</span>
            <span className={css.ctaIcon} aria-hidden='true'>
              ↗
            </span>
          </Link>
        </div>

        <section className={css.heroMedia} aria-labelledby='home-hero-media-title'>
          <h2 id='home-hero-media-title' className={css.visuallyHidden}>
            Hero illustration
          </h2>
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
                <use href='/sprite.svg#icon-users' />
              </svg>
            </div>

            <div className={css.statCard}>
              <div className={css.statIcon} aria-hidden='true'>
                <svg viewBox='0 0 24 24' role='img' aria-hidden='true'>
                  <use href='/sprite.svg#icon-check' />
                </svg>
              </div>
              <div>
                <p className={css.statLabel}>Experienced psychologists</p>
                <p className={css.statValue}>15,000</p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
