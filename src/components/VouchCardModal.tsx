'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  X,
  Award,
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
  Share2,
  Sparkles,
  ExternalLink,
  QrCode,
  Building,
} from 'lucide-react';
import { VouchEndorsement } from '../types';

export default function VouchCardModal() {
  const {
    activeModal,
    activeProductForModal,
    activeVouchCardForView,
    closeModal,
    addVouch,
    currentUser,
  } = useApp();

  const isViewMode = activeModal === 'vouch_card_view';
  const isCreateMode = activeModal === 'vouch';

  const [quote, setQuote] = useState(
    'Inspected the codebase and live user traction. The architecture, clean component separation, and turnaround speed are on par with L4 industry standards. I vouch for this squad for direct interviews.'
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Production Next.js',
    'Microservice Scalability',
    'High Coachability',
  ]);
  const [generatedVouch, setGeneratedVouch] = useState<VouchEndorsement | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if ((!isCreateMode && !isViewMode) || !activeProductForModal) return null;

  const currentVouchToDisplay = isViewMode ? activeVouchCardForView : generatedVouch;

  const availableSkills = [
    'Production Next.js',
    'FastAPI Microservices',
    'Redis Geo-Matching',
    'Microservice Scalability',
    'PostgreSQL Tuning',
    'High Coachability',
    'Rapid Turnaround Speed',
    'Distributed Systems',
    'Clean Component Architecture',
    'pgvector AI Embeddings',
  ];

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleCreateVouch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim()) return;

    const newVouch = addVouch(activeProductForModal.id, {
      quote: quote.trim(),
      certifiedSkills: selectedSkills,
    });

    setGeneratedVouch(newVouch);

    // Fire confetti celebration!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.log('Confetti trigger');
    }
  };

  const handleCopyLink = () => {
    const code = currentVouchToDisplay?.vouchCode || 'SOA-VOUCH-2026-9481';
    navigator.clipboard?.writeText(`https://alumconnect.soa.ac.in/vouch/${code.toLowerCase()}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-xs font-bold text-emerald-300">
              {currentVouchToDisplay ? 'VERIFIED VOUCH CERTIFICATE' : 'ENDORSE & GENERATE VOUCH CARD'}
            </span>
          </div>
          <button
            onClick={() => {
              setGeneratedVouch(null);
              closeModal();
            }}
            className="rounded-full bg-white/10 p-1 text-white/80 hover:bg-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          {!currentVouchToDisplay ? (
            /* Creation Form */
            <form onSubmit={handleCreateVouch} className="space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Endorse Squad: {activeProductForModal.title}
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Your verified endorsement produces a public certificate recognized by SOA T&P Cell for corporate referrals.
                </p>
              </div>

              {/* Skills to Certify */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Select Certified Skills to Endorse
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableSkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSkill(skill)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quote from Alumnus */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Official Endorsement Quote (Visible on Public Vouch Card)
                </label>
                <textarea
                  required
                  rows={4}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Reviewer signature notice */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{currentUser.name}</div>
                    <div className="text-slate-500">
                      {currentUser.designation} • {currentUser.company} (ITER '{currentUser.batchYear})
                    </div>
                  </div>
                </div>
                <span className="rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold px-2 py-0.5">
                  Verified Alum
                </span>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 font-bold text-white shadow-lg shadow-emerald-600/30 text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                Sign & Generate Verified Vouch Card
              </button>
            </form>
          ) : (
            /* Cryptographic Public Vouch Card View */
            <div className="space-y-4">
              <div className="relative rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-6 text-white shadow-2xl overflow-hidden">
                {/* Holographic Watermark Border */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>

                {/* University Brand Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-black text-xs">
                        SOA
                      </div>
                      <span className="text-[11px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
                        Siksha 'O' Anusandhan • ITER
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-black tracking-tight text-white">
                      Verified Proof-of-Work Vouch Card
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold px-2 py-0.5">
                      {currentVouchToDisplay.vouchCode}
                    </span>
                    <div className="text-[9px] text-slate-400 mt-1 font-mono">
                      Issued: {currentVouchToDisplay.date}
                    </div>
                  </div>
                </div>

                {/* Squad & Project Section */}
                <div className="mt-4 space-y-2">
                  <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider font-semibold">
                    Certified Build & Squad:
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-white">
                        {activeProductForModal.title}
                      </div>
                      <div className="text-xs text-blue-300">
                        {activeProductForModal.tagline}
                      </div>
                    </div>
                    <div className="text-right font-mono text-[11px]">
                      <span className="text-emerald-400 font-bold">{activeProductForModal.userTraction}+</span> SOA Users
                    </div>
                  </div>

                  {/* Squad members */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeProductForModal.squadMembers.map((m, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-slate-800/80 border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300"
                      >
                        {m.name} ({m.year})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Endorser Quote */}
                <div className="mt-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 p-3.5 space-y-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={currentVouchToDisplay.alumAvatar}
                      alt={currentVouchToDisplay.alumName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-400"
                    />
                    <div>
                      <div className="font-bold text-xs text-white">
                        {currentVouchToDisplay.alumName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {currentVouchToDisplay.alumRole} @ {currentVouchToDisplay.alumCompany} (ITER '{currentVouchToDisplay.alumBatch})
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-200 italic leading-relaxed">
                    "{currentVouchToDisplay.quote}"
                  </p>
                </div>

                {/* Certified Skills */}
                <div className="mt-4 space-y-1.5">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                    Certified Capabilities:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentVouchToDisplay.certifiedSkills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-mono text-emerald-300"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Seal & Verification Footer */}
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cryptographically Authenticated by SOA T&P Cell</span>
                  </div>
                  <span>Immutable Record</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Public Link Copied!' : 'Copy Shareable Vouch Link'}
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-2 text-xs font-bold text-white shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share on LinkedIn
                  </a>
                  <button
                    onClick={() => {
                      setGeneratedVouch(null);
                      closeModal();
                    }}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-bold text-white"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
