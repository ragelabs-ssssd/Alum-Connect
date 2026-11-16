'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Search,
  Compass,
  Award,
  Zap,
  Briefcase,
  BarChart3,
  UserCheck,
  ChevronDown,
  Shield,
  Layers,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';

export default function Navbar() {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    openOnboardingModal,
    dealRooms,
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Top SOA Brand Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-4 py-1.5 text-xs text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center rounded bg-blue-500/30 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-blue-200">
              SOA DEEMED TO BE UNIVERSITY
            </span>
            <span className="hidden text-slate-300 md:inline">
              Institute of Technical Education and Research (ITER) • Official Alumni-Student Proof-of-Work Network
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="hidden items-center gap-1 text-emerald-300 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              28 Live Campus MVPs Active
            </span>
            <button
              onClick={() => setActiveTab('tp_admin')}
              className="text-blue-200 hover:text-white underline underline-offset-2 flex items-center gap-1"
            >
              <BarChart3 className="w-3 h-3" /> T&P Institutional View
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
        {/* Left: Brand Logo & Search */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-2.5 text-left group shrink-0"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-extrabold tracking-tight text-sm">iT</span>
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-300" />
            </div>
            <div className="whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900">
                  ITER <span className="text-blue-600 font-extrabold">Alum Connect</span>
                </span>
                <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200 leading-none">
                  v2.0
                </span>
              </div>
              <p className="hidden xl:block text-[10px] text-slate-500 font-medium leading-tight">
                Cohort Journey & Proof-of-Work Network
              </p>
            </div>
          </button>

          {/* Search Input */}
          <div className="relative hidden md:block w-48 xl:w-60 shrink">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search MVPs, squads, skills..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'feed'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
          >
            <Compass className="h-3.5 w-3.5 shrink-0" />
            <span>
              {currentUser.role === 'student'
                ? 'Studio'
                : currentUser.role === 'alumni'
                ? 'Marketplace'
                : 'Feed'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('journey_map')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'journey_map'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
          >
            <Layers className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            <span>Journey Map</span>
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'radar'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
          >
            <Award className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span>Talent Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('roasts')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'roasts'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
          >
            <Zap className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            <span>Async Roast</span>
          </button>

          <button
            onClick={() => setActiveTab('bounties')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'bounties'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5 shrink-0 text-indigo-600" />
            <span>Bounties</span>
          </button>

          <button
            onClick={() => setActiveTab('tp_admin')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'tp_admin'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 shrink-0 text-slate-700" />
            <span>T&P Office</span>
          </button>
        </nav>

        {/* Right: Active Profile & Action CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Dual Onboarding Wizard Button */}
          <button
            onClick={openOnboardingModal}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-xs whitespace-nowrap shrink-0"
          >
            <UserCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span>Onboarding</span>
          </button>

          {/* Current Persona Badge & Avatar */}
          <div className="flex items-center gap-2 pl-2.5 border-l border-slate-200 shrink-0">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"></span>
            </div>

            <div className="hidden sm:block text-left whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 uppercase leading-none">
                  {currentUser.role === 'student' ? currentUser.cohort?.replace('_', ' ') : currentUser.alumniPersona || currentUser.role}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {currentUser.company || currentUser.branch || 'ITER SOA'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
