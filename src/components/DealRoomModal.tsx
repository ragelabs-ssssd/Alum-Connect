'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Briefcase,
  Zap,
  Users,
  Building,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { DealRoomAction } from '../types';

export default function DealRoomModal() {
  const {
    activeModal,
    activeProductForModal,
    dealRoomInitialType,
    closeModal,
    submitDealRoomAction,
    currentUser,
  } = useApp();

  const [actionType, setActionType] = useState<DealRoomAction['actionType']>(dealRoomInitialType || 'acqui_hire');
  const [message, setMessage] = useState('');
  const [compensation, setCompensation] = useState('₹14 LPA per squad member + Summer PPO');
  const [submitted, setSubmitted] = useState(false);

  if (activeModal !== 'deal_room' || !activeProductForModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDealRoomAction({
      productId: activeProductForModal.id,
      productTitle: activeProductForModal.title,
      actionType,
      message:
        message.trim() ||
        `Connecting directly with ${activeProductForModal.title} squad regarding ${actionType.replace('_', ' ')}. Verified GitHub commits and campus traction confirmed.`,
      proposedCompensation: compensation.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeModal();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-500/30 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-200 border border-indigo-400/30">
              DIRECT DEAL ROOM
            </span>
            <span className="text-xs text-indigo-200">Outcome Conversion Engine</span>
          </div>
          <h3 className="mt-1 text-lg font-bold tracking-tight">
            Target Squad: {activeProductForModal.title}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Squad Members: {activeProductForModal.squadMembers.map((m) => m.name).join(', ')}
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Deal Room Offer Dispatched!</h4>
            <p className="text-xs text-slate-600">
              The student squad and SOA Training & Placement cell have received your direct offer. You will be scheduled for an expedited connection loop.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
            {/* Action Type selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                Outcome Conversion Action
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'acqui_hire', label: 'Acqui-Hire Entire Squad', desc: 'Direct team hire for venture/incubation' },
                  { id: 'paid_gig', label: 'Assign Paid Freelance Module', desc: '₹20k–₹50k sprint scoped module' },
                  { id: 'fast_track_interview', label: 'Fast-Track Interview', desc: 'Skip cold resume screening' },
                  { id: 'campus_shortlist', label: 'Campus Drive Shortlist', desc: 'Direct corporate interview loop' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => {
                      setActionType(act.id as any);
                      if (act.id === 'acqui_hire') setCompensation('₹14 LPA per member + Equity + Summer PPO');
                      if (act.id === 'paid_gig') setCompensation('₹25,000 / 10-day module');
                      if (act.id === 'fast_track_interview') setCompensation('SDE-1 Opening (Direct Director Loop)');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      actionType === act.id
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold">{act.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{act.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Compensation / Offer Details */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Proposed Compensation / Stipend / Level
              </label>
              <input
                type="text"
                required
                value={compensation}
                onChange={(e) => setCompensation(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Note to Squad */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Direct Deal Message
              </label>
              <textarea
                rows={3}
                placeholder="We loved your 148 verified commits and 420+ daily active campus user traction. We want to bring your 3-person squad to build our new fintech vertical..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Verification assurance */}
            <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-600">Sending offer from:</span>
              <span className="font-bold text-slate-900">
                {currentUser.name} ({currentUser.company || 'Enterprise Partner'})
              </span>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 font-bold text-white shadow-md shadow-indigo-600/30 text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              Dispatch Deal Room Offer to Squad
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
