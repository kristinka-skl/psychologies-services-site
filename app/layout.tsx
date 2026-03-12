import type { Metadata } from 'next';
import AppHeader from '@/app/components/AppHeader/AppHeader';
import Providers from '@/app/providers/Providers';
import './globals.css';

export const metadata: Metadata = {
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
      <body>
        <Providers>
          <AppHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
