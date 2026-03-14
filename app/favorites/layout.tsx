import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Favorites - Psychologists Services',
  description: 'Your saved psychologists for future consultations.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function FavoritesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
