'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Briefcase,
  Award,
  Users,
  Shield,
  Plus,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Bookmark,
  Building,
  Terminal,
} from 'lucide-react';

export default function LeftProfileRail() {
  const { currentUser, openOnboardingModal, setActiveTab, setFeedFilter } = useApp();

  return (
    <aside className="w-full lg:w-72 space-y-4 shrink-0">
      {/* Profile Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Banner Cover */}
        <div className="h-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 relative">
          <div className="absolute top-2 right-2">
            <span className="rounded bg-black/40 px-2 py-0.5 text-[9px] font-mono text-white backdrop-blur-xs">
              SOA ITER
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="px-4 pb-4 -mt-10 relative">
          <div className="flex items-end justify-between">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-18 w-18 rounded-2xl border-4 border-white object-cover shadow-md"
              />
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"></span>
            </div>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-[10px] font-bold text-blue-700">
              {currentUser.role === 'student' ? 'Student Builder' : currentUser.role === 'alumni' ? 'Verified Alumni' : 'T&P Dean'}
            </span>
          </div>

          <div className="mt-2.5">
            <h3 className="font-bold text-slate-900 text-sm">{currentUser.name}</h3>
            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-snug">
              {currentUser.headline}
            </p>
          </div>

          {/* Cohort Badge / Auto-Routed Role Tag */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">
              Auto-Routed Cohort Tag
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-1 text-xs font-bold text-blue-800">
                <Sparkles className="w-3 h-3 text-blue-600" />
                {currentUser.cohortTag || `${currentUser.designation} (${currentUser.alumniTier} yrs)`}
              </span>
            </div>
          </div>

          {/* Squad Membership (For Students) or Bandwidth Shield (For Alumni) */}
          {currentUser.role === 'student' && currentUser.squadName ? (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">
                Squad Membership
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  {currentUser.squadName}
                </span>
                <span className="text-[10px] text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.5 rounded">
                  {currentUser.squadRole}
                </span>
              </div>
            </div>
          ) : currentUser.bandwidthShield ? (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">
                Bandwidth Shield
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md font-semibold">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                {currentUser.bandwidthShield}
              </div>
            </div>
          ) : null}

          {/* Endorsed Skills */}
          {currentUser.skillsEndorsed && currentUser.skillsEndorsed.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">
                <span>Verified Endorsements</span>
                <span className="text-blue-600 font-bold">{currentUser.vouchCardsCount || 3} Vouches</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {currentUser.skillsEndorsed.map((skill, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="font-medium text-slate-700 text-[11px] truncate">{skill.name}</span>
                    <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-700">
                      +{skill.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Navigation Filter Pills */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-2">
        <div className="text-[11px] font-bold text-slate-900 uppercase font-mono tracking-wider">
          Quick Filters
        </div>
        <div className="space-y-1 text-xs">
          <button
            onClick={() => {
              setActiveTab('feed');
              setFeedFilter('products');
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-blue-600" />
              Campus Product Ships
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">4 Live</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('feed');
              setFeedFilter('bounties');
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              Alum Bounties & Tasks
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">₹55k Active</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('feed');
              setFeedFilter('spotlights');
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Alum Job Switch & Spotlights
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">3 New</span>
          </button>
        </div>
      </div>

      {/* Institutional Placement Office Callout */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 shadow-xs">
        <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
          <Building className="w-4 h-4 text-blue-700" />
          <span>T&P Cell Verification</span>
        </div>
        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
          All Vouch Cards generated on ITER Alum Connect are recognized by SOA Training & Placement Cell for direct corporate drive bypass.
        </p>
        <button
          onClick={() => setActiveTab('tp_admin')}
          className="mt-3 w-full rounded-lg bg-blue-600 hover:bg-blue-500 py-1.5 text-xs font-bold text-white transition-colors flex items-center justify-center gap-1 shadow-xs"
        >
          View Placement Analytics <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
