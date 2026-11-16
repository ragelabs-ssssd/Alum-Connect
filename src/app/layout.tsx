import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { ThemeProvider } from '../context/ThemeContext';
import OnboardingModal from '../components/OnboardingModal';
import AsyncRoastModal from '../components/AsyncRoastModal';
import VouchCardModal from '../components/VouchCardModal';
import DealRoomModal from '../components/DealRoomModal';
import LiveDemoModal from '../components/LiveDemoModal';

export const metadata: Metadata = {
  title: "AlmaConnect — Proof-of-Work & Alumni Talent Network",
  description: "AlmaConnect: LinkedIn-style Alumni & Student Proof-of-Work Network with GitHub Repository Showcases, 5-Min Async Roasts, and Verified Vouches.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#F4F2EE] text-[#191919] dark:bg-[#0B0F17] dark:text-slate-100 font-sans">
        <ThemeProvider>
          <AppProvider>
            <main className="flex-1">{children}</main>
            
            {/* Universal Interactive Modals */}
            <OnboardingModal />
            <AsyncRoastModal />
            <VouchCardModal />
            <DealRoomModal />
            <LiveDemoModal />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
