'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import AlumniPortal from '../../portals/alumni/AlumniPortal';
import AlumniFeedSection from './AlumniFeedSection';
import ThemeToggle from '../../components/ThemeToggle';
import { ArrowLeft, Compass, Store } from 'lucide-react';

export default function AlumniPage() {
  const router = useRouter();
  const { currentUser, setCurrentUser, allPresetUsers } = useApp();
  const [viewMode, setViewMode] = useState<'feed' | 'portal'>('feed');

  // Ensure an alumni persona is active when opening /alumni directly so Roast/Vouch/Deal Room actions work immediately
  useEffect(() => {
    if (currentUser.role !== 'alumni') {
      const firstAlum = allPresetUsers.find((u) => u.role === 'alumni');
      if (firstAlum) setCurrentUser(firstAlum);
    }
  }, [currentUser.role, allPresetUsers, setCurrentUser]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#09090B] text-[#09090B] dark:text-slate-100 transition-colors">
      {/* LinkedIn-style Sticky Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#E4E4E7] dark:border-slate-800 bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-slate-700 bg-[#F4F4F5] dark:bg-slate-800/80 hover:bg-[#F4F4F5] dark:hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Gateway
            </button>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-white dark:bg-slate-800 border border-[#E4E4E7] dark:border-slate-700 flex items-center justify-center p-0.5 overflow-hidden">
                <img src="/logo.png" alt="AlmaConnect" className="h-full w-full object-contain dark:invert" />
              </div>
              <span className="text-sm font-bold tracking-tight text-[#09090B] dark:text-white hidden sm:inline">
                AlmaConnect
              </span>
              <span className="text-xs font-medium text-stone-400 dark:text-slate-500 hidden md:inline">
                / Alumni &amp; Hiring
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 rounded-full bg-[#F4F4F5] dark:bg-slate-800/90 p-1 border border-[#E4E4E7] dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => setViewMode('feed')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  viewMode === 'feed'
                    ? 'bg-white dark:bg-slate-950 text-[#2563EB] dark:text-sky-400 shadow-2xs'
                    : 'text-[#52525B] dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Talent Feed
              </button>
              <button
                type="button"
                onClick={() => setViewMode('portal')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  viewMode === 'portal'
                    ? 'bg-white dark:bg-slate-950 text-[#2563EB] dark:text-sky-400 shadow-2xs'
                    : 'text-[#52525B] dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                Hiring Portal
              </button>
            </div>

            <ThemeToggle compact />
          </div>
        </div>
      </header>

      {viewMode === 'feed' ? (
        <AlumniFeedSection onOpenPortal={() => setViewMode('portal')} />
      ) : (
        <AlumniPortal onBackToGateway={() => router.push('/')} />
      )}
    </div>
  );
}
