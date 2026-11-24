'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CampusProduct, RoastAnnotation, VouchEndorsement } from '../types';
import { GithubIcon } from './BrandIcons';
import {
  CheckCircle,
  ExternalLink,
  Play,
  Award,
  Zap,
  Briefcase,
  Users,
  GitBranch,
  CheckCircle2,
  Share2,
  Sparkles,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Code2,
  Clock,
  ArrowRight,
  Flame,
} from 'lucide-react';

export default function ProductCard({ product }: { product: CampusProduct }) {
  const {
    currentUser,
    openLiveDemoModal,
    openRoastModal,
    openVouchModal,
    openDealRoomModal,
    openVouchCardViewModal,
    toggleRoastResolved,
  } = useApp();

  const [showAllRoasts, setShowAllRoasts] = useState(false);
  const [showCommitDetails, setShowCommitDetails] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(product.userTraction);

  const handleUpvote = () => {
    if (!upvoted) {
      setUpvoteCount((prev) => prev + 1);
      setUpvoted(true);
    } else {
      setUpvoteCount((prev) => prev - 1);
      setUpvoted(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(product.liveDemoUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Determine what role actions to show based on viewing persona
  const renderRoleActions = () => {
    // 1. Alumni IC (0-5 Yrs)
    if (currentUser.role === 'alumni' && currentUser.alumniPersona === 'ic') {
      return (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold">
            MNC IC Actions:
          </span>
          <button
            onClick={() => openVouchModal(product)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            Issue Verified Vouch Card
          </button>
          <button
            onClick={() => openDealRoomModal(product, 'campus_shortlist')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-indigo-50/70 hover:bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-800 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            Internal {currentUser.company || 'MNC'} Referral
          </button>
        </div>
      );
    }

    // 2. Alumni Manager (5-15 Yrs)
    if (currentUser.role === 'alumni' && currentUser.alumniPersona === 'manager') {
      return (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-mono text-pink-700 bg-pink-50 px-2 py-0.5 rounded font-bold">
            Hiring Manager Actions:
          </span>
          <button
            onClick={() => openDealRoomModal(product, 'fast_track_interview')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Fast-Track Interview (Skip Resume)
          </button>
          <button
            onClick={() => openRoastModal(product)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-pink-300 bg-pink-50/70 hover:bg-pink-100 px-3 py-1.5 text-xs font-bold text-pink-800 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-pink-600" />
            Leave 5-Min Async Roast
          </button>
        </div>
      );
    }

    // 3. Alumni Founder
    if (currentUser.role === 'alumni' && currentUser.alumniPersona === 'founder') {
      return (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
            Founder Deal Room:
          </span>
          <button
            onClick={() => openDealRoomModal(product, 'acqui_hire')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5" />
            Direct Deal Room: Acqui-Hire Squad
          </button>
          <button
            onClick={() => openDealRoomModal(product, 'paid_gig')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-600" />
            Assign Paid Freelance Module
          </button>
        </div>
      );
    }

    // 4. CHRO / Recruiter
    if (currentUser.role === 'alumni' && currentUser.alumniPersona === 'chro') {
      return (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
            Recruiter Actions:
          </span>
          <button
            onClick={() => openDealRoomModal(product, 'campus_shortlist')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            Shortlist to Vouched Directory
          </button>
          <button
            onClick={() => openDealRoomModal(product, 'fast_track_interview')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-300 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 text-xs font-bold text-purple-800 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Schedule Campus Drive Loop
          </button>
        </div>
      );
    }

    // 5. Student View
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpvote}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
              upvoted
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            {upvoted ? 'Upvoted' : 'Upvote Traction'} ({upvoteCount})
          </button>
          <button
            onClick={() => openLiveDemoModal(product)}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1 text-xs font-semibold"
          >
            <Play className="w-3.5 h-3.5" />
            Test Live
          </button>
        </div>

        <div className="text-[11px] text-slate-500">
          {product.hiringStatus}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all space-y-4">
      {/* Top Header: Squad Info & Status Badges */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2 overflow-hidden">
            {product.squadMembers.slice(0, 3).map((member, i) => (
              <img
                key={i}
                src={member.avatar}
                alt={member.name}
                title={`${member.name} (${member.role})`}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
              />
            ))}
            {product.squadMembers.length > 3 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 ring-2 ring-white">
                +{product.squadMembers.length - 3}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                {product.squadMembers[0]?.name}'s Squad
              </span>
              <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600 font-mono">
                {product.squadMembers[0]?.year}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              SOA ITER • {product.squadMembers[0]?.branch} • Published {product.publishedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {product.status === 'verified' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              Verified Build
            </span>
          )}
          <button
            onClick={handleShare}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-50"
            title="Share Project"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {copiedLink && (
            <span className="text-[10px] text-emerald-600 font-semibold">Copied!</span>
          )}
        </div>
      </div>

      {/* Main Title, Tagline & Description */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            {product.title}
          </h3>
          <span className="rounded bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-bold uppercase font-mono border border-blue-200/60">
            {product.category.replace('_', ' ')}
          </span>
        </div>
        <p className="mt-1 text-xs font-semibold text-blue-700">
          {product.tagline}
        </p>
        <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Highlight Metrics Strip from PRD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <div>
            <div className="font-bold text-slate-900">{product.userTraction}+ Users</div>
            <div className="text-[10px] text-slate-500 truncate">SOA Campus Traction</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GithubIcon className="w-4 h-4 text-slate-800" />
          <div>
            <div className="font-bold text-slate-900">{product.commitsCount} Commits</div>
            <div className="text-[10px] text-slate-500">Verified GitHub</div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-600" />
          <div>
            <div className="font-bold text-slate-900">{product.vouches.length} Vouch Cards</div>
            <div className="text-[10px] text-slate-500">Alumni Certified</div>
          </div>
        </div>
      </div>

      {/* Interactive Live Demo Preview Box */}
      <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-950 group">
        <img
          src={product.previewImage}
          alt={product.title}
          className="w-full h-44 object-cover opacity-60 group-hover:opacity-75 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-3.5">
          <div className="flex justify-between items-center">
            <span className="rounded bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
              ● Live Working Prototype
            </span>
            <span className="text-[10px] text-slate-300 font-mono bg-black/60 px-2 py-0.5 rounded">
              {product.liveDemoUrl.replace('https://', '')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-sm">{product.title}</div>
              <div className="text-slate-300 text-[11px]">{product.tractionLabel}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openLiveDemoModal(product)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-blue-600/40 transition-transform active:scale-95"
              >
                <Play className="w-3.5 h-3.5" />
                Watch 60s Demo
              </button>
              <a
                href={product.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md px-2.5 py-1.5 text-xs font-medium text-white transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                Repo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Commits Visual Graph */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
            <span>GitHub Commit Activity (Branch: main)</span>
          </div>
          <button
            onClick={() => setShowCommitDetails(!showCommitDetails)}
            className="text-[11px] text-blue-600 hover:underline"
          >
            {showCommitDetails ? 'Hide Log' : `View ${product.recentCommits.length} Commits`}
          </button>
        </div>

        {/* Branch Graph representation */}
        <div className="space-y-1.5">
          {product.recentCommits.slice(0, showCommitDetails ? 5 : 1).map((commit, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-[11px] font-mono bg-white p-2 rounded-lg border border-slate-200"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0"></span>
                <span className="text-blue-700 font-bold">{commit.hash}</span>
                <span className="text-slate-700 truncate">{commit.message}</span>
              </div>
              <span className="text-slate-400 text-[10px] shrink-0 ml-2">{commit.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Squad Breakdown (3-4 Person Squad) */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-bold uppercase font-mono text-slate-400 mb-2">
          <span>Building Squad Credits ({product.squadMembers.length} Members)</span>
          <span className="text-blue-600">Cross-Cohort Collaborative</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {product.squadMembers.map((member, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
            >
              <div className="flex items-center gap-2">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 leading-tight">
                    {member.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{member.role}</div>
                </div>
              </div>
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-800">
                {member.year}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Alumni Vouch Stamps Section */}
      {product.vouches.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Alumni Vouch Stamp ({product.vouches.length})</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
              Cryptographically Certified
            </span>
          </div>

          {product.vouches.map((vouch) => (
            <div
              key={vouch.id}
              className="bg-white rounded-lg p-3 border border-emerald-100 shadow-2xs space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={vouch.alumAvatar}
                    alt={vouch.alumName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900">{vouch.alumName}</span>
                    <span className="text-[10px] text-slate-500 ml-1">
                      ('{String(vouch.alumBatch).slice(2)} • {vouch.alumRole} @ {vouch.alumCompany})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => openVouchCardViewModal(vouch, product)}
                  className="text-[10px] font-mono font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 flex items-center gap-0.5"
                >
                  View Vouch Card <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>

              <p className="text-xs text-slate-700 italic leading-snug">
                "{vouch.quote}"
              </p>

              <div className="flex flex-wrap gap-1">
                {vouch.certifiedSkills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-mono text-emerald-800 font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5-Minute Async Roast Section */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>5-Minute Async Roast Annotations ({product.roasts.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openRoastModal(product)}
              className="text-[11px] font-bold text-pink-600 hover:text-pink-700"
            >
              + Drop Annotation
            </button>
            {product.roasts.length > 1 && (
              <button
                onClick={() => setShowAllRoasts(!showAllRoasts)}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center"
              >
                {showAllRoasts ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>

        {product.roasts.length === 0 ? (
          <div className="text-[11px] text-slate-500 italic py-1">
            No async roasts yet. Alumni: drop a 5-minute architectural or UX critique to help the squad level up!
          </div>
        ) : (
          <div className="space-y-1.5">
            {product.roasts
              .slice(0, showAllRoasts ? product.roasts.length : 1)
              .map((roast) => (
                <div
                  key={roast.id}
                  className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900">{roast.alumName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({roast.category.replace('_', ' ').toUpperCase()})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{roast.timestamp}</span>
                      <button
                        onClick={() => toggleRoastResolved(product.id, roast.id)}
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border transition-colors ${
                          roast.resolved
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {roast.resolved ? 'Resolved ✓' : 'Mark Resolved'}
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {roast.feedback}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Tech Tags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {product.tags.map((tag, i) => (
          <span
            key={i}
            className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 font-mono"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Dynamic Role-Based Action Router Footer */}
      {renderRoleActions()}
    </div>
  );
}
