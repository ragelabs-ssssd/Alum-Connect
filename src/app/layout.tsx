import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';

export const metadata: Metadata = {
  title: 'AlmaConnect — Proof-of-Work & Alumni Talent Network',
  description:
    'AlmaConnect: LinkedIn-style Alumni & Student Proof-of-Work Network with GitHub Repository Showcases, 5-Min Async Roasts, and Cryptographically Verified Vouches.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-[#09090B] dark:bg-[#09090B] dark:text-zinc-50 font-sans">
        <ThemeProvider>
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
