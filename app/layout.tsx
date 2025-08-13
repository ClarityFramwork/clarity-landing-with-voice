import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Clarity Agent Suite',
  description: 'Clarity Agent Suite Landing Page with voice-enabled chat',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-white text-black dark:bg-zinc-950 dark:text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
