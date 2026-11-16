'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Zap,
  Flame,
  Star,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { RoastAnnotation } from '../types';

export default function AsyncRoastModal() {
  const { activeModal, activeProductForModal, closeModal, addRoast, currentUser } = useApp();

  const [category, setCategory] = useState<RoastAnnotation['category']>('api_architecture');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(4);
  const [submitted, setSubmitted] = useState(false);

  if (activeModal !== 'roast' || !activeProductForModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    addRoast(activeProductForModal.id, {
      category,
      feedback: feedback.trim(),
      rating,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback('');
      closeModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-900 via-rose-900 to-slate-900 p-5 text-white relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded bg-pink-500/30 px-2 py-0.5 font-mono text-[11px] font-bold text-pink-200 border border-pink-400/30">
              5-MINUTE ASYNC ROAST ENGINE
            </span>
            <span className="text-xs text-pink-200">Zero-Meeting Feedback</span>
          </div>
          <h3 className="mt-1 text-lg font-bold tracking-tight">
            Reviewing: {activeProductForModal.title}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Squad: {activeProductForModal.squadMembers.map((m) => m.name.split(' ')[0]).join(', ')} ({activeProductForModal.squadMembers[0]?.year})
          </p>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Annotation Logged Successfully!</h4>
            <p className="text-xs text-slate-600">
              The student squad has been notified to iterate and mark this resolved within 7 days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
            {/* Category selection */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                Feedback Focus Area
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'api_architecture', label: 'API Architecture & Scalability', icon: '⚡' },
                  { id: 'ui_ux', label: 'UI/UX & Mobile Responsiveness', icon: '🎨' },
                  { id: 'performance', label: 'Performance & Database Indexing', icon: '🚀' },
                  { id: 'roadmap', label: 'Product Roadmap & Campus Traction', icon: '🎯' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as any)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      category === cat.id
                        ? 'border-pink-600 bg-pink-50/70 text-pink-900 font-bold ring-1 ring-pink-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="mr-1.5">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Engineering Execution Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">{rating} / 5 Stars</span>
              </div>
            </div>

            {/* Feedback textarea */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Your 2-Line Actionable Roast / Critique
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Ensure your Redis connection pool handles peak 9 PM dinner orders, or wrap the mobile drawer with touch-action: pan-y to prevent gesture conflicts..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Constructive feedback helps undergraduate squads level up to L4/L5 industry standards.
              </p>
            </div>

            {/* Author confirmation */}
            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-600">Reviewing as:</span>
              <span className="font-bold text-slate-900">
                {currentUser.name} ({currentUser.company || 'Alumni Reviewer'})
              </span>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-pink-600 hover:bg-pink-500 py-3 font-bold text-white shadow-md shadow-pink-600/30 text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Flame className="w-4 h-4" />
              Publish 5-Min Async Roast
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
