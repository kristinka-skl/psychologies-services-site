import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AppHeader from '@/app/components/AppHeader/AppHeader';
import Providers from '@/app/providers/Providers';
import './globals.css';

const interSans = Inter({
  variable: '--font-inter-sans',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Psychologists Services',
  description:
    'Find experienced psychologists and book your personal consultation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${interSans.className} ${interSans.variable}`}>
        <Providers>
          <AppHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
