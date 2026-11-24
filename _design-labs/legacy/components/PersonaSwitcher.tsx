'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Briefcase,
  GraduationCap,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Building,
  Terminal,
  Zap,
} from 'lucide-react';

export default function PersonaSwitcher() {
  const { currentUser, setCurrentUser, allPresetUsers, openOnboardingModal } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const studentPersonas = allPresetUsers.filter((u) => u.role === 'student');
  const alumniPersonas = allPresetUsers.filter((u) => u.role === 'alumni');
  const tpAdmin = allPresetUsers.find((u) => u.role === 'tp_admin');

  // Role action summary for current user
  const getRoleCapabilities = () => {
    if (currentUser.role === 'student') {
      if (currentUser.cohort === '1st_year') {
        return '1st Yr Ops Scout: Can beta-test MVPs, upvote builds, log campus traction & claim testing bounties.';
      }
      if (currentUser.cohort === '2nd_year') {
        return '2nd Yr Core Builder: Can ship new MVPs, form squads, resolve async roasts & receive Verified Vouch Cards.';
      }
      if (currentUser.cohort === '3rd_year') {
        return '3rd Yr Bounty Sprinter: Can apply to paid 10-day sprints, architect microservices & pitch to founders.';
      }
      return '4th Yr Lead: Can receive internal MNC referrals, fast-track interview bypasses & acqui-hire offers.';
    }
    if (currentUser.role === 'alumni') {
      if (currentUser.alumniPersona === 'ic') {
        return '0–5 Yr MNC IC: Unlocks "Issue Verified Vouch Card" and "Internal MNC Referral" direct submission.';
      }
      if (currentUser.alumniPersona === 'manager') {
        return '5–15 Yr Manager: Unlocks "5-Min Async Roast" annotations and "Fast-Track Interview (Skip Resume Screen)".';
      }
      if (currentUser.alumniPersona === 'founder') {
        return 'Startup Founder: Unlocks "Direct Deal Room: Acqui-Hire Squad" and "Assign Paid Freelance Module".';
      }
      return 'CHRO / Recruiter: Unlocks "Shortlist to Vouched Directory" and "Book Campus Drive Slot".';
    }
    return 'T&P Placement Dean: Full institutional access to placement conversion metrics, student squads, and recruiter analytics.';
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Active Persona Indicator */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Viewing as:</span>
            <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1.5">
              {currentUser.name}
              <span className="text-blue-400 font-mono text-[11px]">
                ({currentUser.role === 'student' ? currentUser.cohortTag : currentUser.designation || currentUser.role})
              </span>
            </span>
            <span className="hidden xl:inline text-slate-400 text-[11px] pl-2 border-l border-slate-800">
              {getRoleCapabilities()}
            </span>
          </div>

          {/* Quick Switch Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* 1-Click 3-Dashboard Switcher */}
            <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700 mr-1">
              <button
                onClick={() => {
                  const firstStudent = studentPersonas[0];
                  if (firstStudent) setCurrentUser(firstStudent);
                }}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition-colors ${
                  currentUser.role === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3 h-3" />
                Student Side
              </button>
              <button
                onClick={() => {
                  const firstAlum = alumniPersonas[0];
                  if (firstAlum) setCurrentUser(firstAlum);
                }}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition-colors ${
                  currentUser.role === 'alumni'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                Alumni Marketplace
              </button>
              <button
                onClick={() => {
                  if (tpAdmin) setCurrentUser(tpAdmin);
                }}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition-colors ${
                  currentUser.role === 'tp_admin'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Building className="w-3 h-3" />
                Placement Dean
              </button>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 text-xs font-semibold text-white shadow-xs transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              {isOpen ? 'Close' : 'All Personas'}
            </button>
            <button
              onClick={openOnboardingModal}
              className="text-xs text-slate-400 hover:text-white underline underline-offset-2 ml-1"
            >
              Simulate New Signup
            </button>
          </div>
        </div>

        {/* Dropdown / Modal Grid of All Personas */}
        {isOpen && (
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 pb-2 text-xs">
            {/* Student Cohorts */}
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold mb-2">
                <GraduationCap className="w-4 h-4" />
                <span>Student Progression (4 Cohorts)</span>
              </div>
              <div className="space-y-1.5">
                {studentPersonas.map((student) => {
                  const isSelected = currentUser.id === student.id;
                  return (
                    <button
                      key={student.id}
                      onClick={() => {
                        setCurrentUser(student);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-1.5 rounded transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-600/30 border border-blue-500 text-white font-medium'
                          : 'hover:bg-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold leading-tight">{student.name}</div>
                          <div className="text-[10px] text-blue-300">{student.cohortTag}</div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alumni & Industry Tiers */}
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-2">
                <Briefcase className="w-4 h-4" />
                <span>Alumni & Industry Router (4 Personas)</span>
              </div>
              <div className="space-y-1.5">
                {alumniPersonas.map((alum) => {
                  const isSelected = currentUser.id === alum.id;
                  return (
                    <button
                      key={alum.id}
                      onClick={() => {
                        setCurrentUser(alum);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-1.5 rounded transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600/30 border border-indigo-500 text-white font-medium'
                          : 'hover:bg-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={alum.avatar}
                          alt={alum.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold leading-tight">{alum.name}</div>
                          <div className="text-[10px] text-indigo-300">
                            {alum.company} • {alum.designation}
                          </div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Institutional Placement Admin */}
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-2">
                  <Building className="w-4 h-4" />
                  <span>Institutional Oversight</span>
                </div>
                {tpAdmin && (
                  <button
                    onClick={() => {
                      setCurrentUser(tpAdmin);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded transition-all flex items-center justify-between ${
                      currentUser.id === tpAdmin.id
                        ? 'bg-emerald-600/30 border border-emerald-500 text-white'
                        : 'hover:bg-slate-700/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={tpAdmin.avatar}
                        alt={tpAdmin.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold">{tpAdmin.name}</div>
                        <div className="text-[10px] text-emerald-300">T&P Placement Dean • SOA ITER</div>
                      </div>
                    </div>
                    {currentUser.id === tpAdmin.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </button>
                )}
                <div className="mt-3 p-2 bg-slate-900/60 rounded text-[11px] text-slate-400 space-y-1">
                  <div className="font-medium text-slate-300">Bandwidth Shield Protection:</div>
                  <p>Alumni set limits like "2 async reviews/mo" or "5-min async roast" so they aren't spammed with cold DMs.</p>
                </div>
              </div>

              <div className="mt-2 text-right">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close Tray ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
