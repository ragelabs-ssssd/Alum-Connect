'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TP_ANALYTICS } from '../../data/seedData';
import type { InstitutionalAuditLog } from './db';
import {
  ShieldCheck,
  Lock,
  Unlock,
  ArrowLeft,
  Download,
  BarChart3,
  Briefcase,
  Award,
  Building2,
  Layers,
  ExternalLink,
  FileCheck2,
  PlusCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Database,
  LogOut,
} from 'lucide-react';

interface DeanPortalProps {
  onBackToGateway?: () => void;
}

type GovernanceTab = 'kpi_funnel' | 'deal_ledger' | 'vouch_registry' | 'partners_audit';

const ACTION_TYPE_LABELS: Record<string, string> = {
  acqui_hire: 'Acqui-Hire Offer',
  paid_gig: 'Paid Sprint / Gig',
  fast_track_interview: 'Fast-Track Interview',
  campus_shortlist: 'Campus Shortlist',
};

const AUDIT_CATEGORY_LABELS: Record<InstitutionalAuditLog['category'], string> = {
  vouch: 'Vouch Registry',
  deal_room: 'Deal Room',
  mvp_ship: 'MVP Ship',
  drive_slot: 'Drive Slot',
};

export default function DeanPortal({ onBackToGateway }: DeanPortalProps) {
  const {
    currentUser,
    setCurrentUser,
    products,
    bounties,
    dealRooms,
    openVouchCardViewModal,
    openLiveDemoModal,
  } = useApp();

  // Auth & DB 3 State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('dean.placement@soa.ac.in');
  const [clearanceCode, setClearanceCode] = useState('SOA-TP-2026-DEAN');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // UI 3 State
  const [activeTab, setActiveTab] = useState<GovernanceTab>('kpi_funnel');
  const [auditLogs, setAuditLogs] = useState<InstitutionalAuditLog[]>([]);
  const [analytics, setAnalytics] = useState(TP_ANALYTICS);
  const [csvExported, setCsvExported] = useState(false);

  // Audit Log Form State
  const [auditCategory, setAuditCategory] =
    useState<InstitutionalAuditLog['category']>('drive_slot');
  const [auditTitle, setAuditTitle] = useState('');
  const [auditActor, setAuditActor] = useState('Prof. Sujit Kumar Patra (Dean T&P)');
  const [auditImpact, setAuditImpact] = useState('');
  const [isSubmittingAudit, setIsSubmittingAudit] = useState(false);
  const [auditFeedback, setAuditFeedback] = useState<string | null>(null);

  // Fetch DB 3 state once authenticated
  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;

    async function loadDB3() {
      try {
        const res = await fetch('/api/dean');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.status === 'ok') {
          if (Array.isArray(data.auditLogs)) {
            setAuditLogs(data.auditLogs);
          }
          if (data.analytics) {
            setAnalytics(data.analytics);
          }
        }
      } catch {
        // Fallback to seed analytics if offline
      }
    }

    loadDB3();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const totalLiveVouches = useMemo(
    () => products.reduce((sum, p) => sum + p.vouches.length, 0),
    [products]
  );

  const allVouchEntries = useMemo(
    () =>
      products.flatMap((product) =>
        product.vouches.map((vouch) => ({
          product,
          vouch,
        }))
      ),
    [products]
  );

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      const res = await fetch('/api/dean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          payload: {
            email: email.trim() || 'dean.placement@soa.ac.in',
            clearanceCode: clearanceCode.trim(),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== 'ok' || !data.user) {
        setAuthError(data?.message || 'Unable to authorize Dean session with DB 3.');
        return;
      }
      setCurrentUser(data.user);
      setIsLoggedIn(true);
    } catch {
      setAuthError('Network error while connecting to DB 3 (/api/dean).');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLockSession = () => {
    setIsLoggedIn(false);
    setAuditFeedback(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'Product',
      'Hiring Alum',
      'Company',
      'Action Type',
      'Compensation',
      'Status',
      'Timestamp',
    ];
    const rows = dealRooms.map((d) => [
      `"${d.productTitle.replace(/"/g, '""')}"`,
      `"${d.senderName.replace(/"/g, '""')}"`,
      `"${d.senderCompany.replace(/"/g, '""')}"`,
      `"${ACTION_TYPE_LABELS[d.actionType] || d.actionType}"`,
      `"${(d.proposedCompensation || 'N/A').replace(/"/g, '""')}"`,
      `"${d.status}"`,
      `"${d.timestamp}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `soa-tp-institutional-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Ignore blob download errors in restricted environments
    }

    setCsvExported(true);
    setTimeout(() => setCsvExported(false), 2500);
  };

  const handleCreateAuditLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditTitle.trim()) return;
    setIsSubmittingAudit(true);
    setAuditFeedback(null);

    try {
      const res = await fetch('/api/dean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log_audit',
          payload: {
            category: auditCategory,
            title: auditTitle.trim(),
            actor: auditActor.trim() || currentUser.name,
            impact: auditImpact.trim() || 'Recorded in SOA Institutional T&P Ledger',
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'ok' && data.log) {
        setAuditLogs((prev) => [data.log, ...prev]);
        setAuditTitle('');
        setAuditImpact('');
        setAuditFeedback('Institutional audit entry persisted to DB 3.');
        setTimeout(() => setAuditFeedback(null), 3000);
      } else {
        setAuditFeedback(data?.message || 'Failed to record audit entry.');
      }
    } catch {
      setAuditFeedback('Network error while saving to DB 3.');
    } finally {
      setIsSubmittingAudit(false);
    }
  };

  // ============================================================================
  // LOGIN 3 • SOA UNIVERSITY PLACEMENT DEAN PORTAL
  // ============================================================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg rounded-2xl border border-emerald-500/30 bg-slate-900/90 shadow-2xl shadow-emerald-950/50 overflow-hidden">
          {/* Top Executive Strip */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-emerald-500/20 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-300 uppercase">
                LOGIN 3 • SOA UNIVERSITY PLACEMENT DEAN PORTAL
              </span>
            </div>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-300">
              Connected to DB 3
            </span>
          </div>

          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white">
                  Training &amp; Placement Executive Gate
                </h1>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Authorized institutional access for ITER, SOA University Dean of Placements. Inspect live Deal Rooms, Vouch Certificates, and Cohort Funnels.
                </p>
              </div>
            </div>

            {authError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200">
                {authError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="dean-email"
                  className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Institutional Email
                </label>
                <input
                  id="dean-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dean.placement@soa.ac.in"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="dean-clearance"
                  className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Clearance Code
                </label>
                <div className="relative">
                  <input
                    id="dean-clearance"
                    type="password"
                    value={clearanceCode}
                    onChange={(e) => setClearanceCode(e.target.value)}
                    placeholder="Enter T&P clearance code"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                {isAuthenticating
                  ? 'Verifying DB 3 Clearance...'
                  : 'Authorize & Enter UI 3 (Dean Command Center)'}
              </button>

              {onBackToGateway && (
                <button
                  type="button"
                  onClick={onBackToGateway}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  ← Back to System Gateway
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================================
  // UI 3 • PLACEMENT DEAN EXECUTIVE COMMAND CENTER
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Dedicated Emerald/Slate Executive Header */}
      <header className="bg-slate-900 border-b border-emerald-500/30 text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-black tracking-tight text-white">
                  UI 3 • Placement Dean Executive Command Center
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-300">
                  <Database className="w-3 h-3" />
                  DB 3: Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentUser.name} • {currentUser.designation || 'Dean & Head of Placement Operations'} • {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {csvExported ? 'Institutional CSV Exported ✓' : 'Export Institutional CSV Report'}
            </button>

            <button
              type="button"
              onClick={handleLockSession}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-amber-400" />
              Lock Session (Login 3)
            </button>

            {onBackToGateway && (
              <button
                type="button"
                onClick={onBackToGateway}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
              >
                ← Gateway
              </button>
            )}
          </div>
        </div>

        {/* Governance Tabs Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 overflow-x-auto pb-2.5">
          {[
            { id: 'kpi_funnel' as const, label: 'Executive KPI & Cohort Funnel', icon: BarChart3 },
            { id: 'deal_ledger' as const, label: `Live Deal Room & Acqui-Hire Ledger (${dealRooms.length})`, icon: Briefcase },
            { id: 'vouch_registry' as const, label: `Verified Vouch Registry & Squads (${allVouchEntries.length})`, icon: Award },
            { id: 'partners_audit' as const, label: `Corporate Partners & Audit Log (${auditLogs.length})`, icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* TAB A: Executive KPI & Cohort Funnel */}
        {activeTab === 'kpi_funnel' && (
          <div className="space-y-6">
            {/* 6 Live KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  Live Campus MVPs
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {products.length}
                </div>
                <div className="text-[11px] font-semibold text-emerald-700 mt-1">
                  {analytics.totalLiveMVPs} cohort total
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-xs">
                <div className="text-[10px] font-mono font-bold uppercase text-emerald-800">
                  Verified Vouches
                </div>
                <div className="text-2xl font-black text-emerald-950 mt-1">
                  {totalLiveVouches}
                </div>
                <div className="text-[11px] font-semibold text-emerald-700 mt-1">
                  +{analytics.vouchCardsIssued} historical cards
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  Active Deal Rooms
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {dealRooms.length}
                </div>
                <div className="text-[11px] font-semibold text-indigo-700 mt-1">
                  {analytics.squadsHired} squads acqui-hired
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  Open Bounties
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {bounties.length}
                </div>
                <div className="text-[11px] font-semibold text-slate-600 mt-1">
                  10-day paid sprints
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  Alumni Reviewers
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {analytics.alumniReviewsCount}
                </div>
                <div className="text-[11px] font-semibold text-slate-600 mt-1">
                  {analytics.activeCompanies} partner firms
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-300 bg-slate-900 p-4 shadow-xs text-white">
                <div className="text-[10px] font-mono font-bold uppercase text-emerald-300">
                  Vouched Conversion
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  {analytics.placementConversionRate}
                </div>
                <div className="text-[11px] font-semibold text-emerald-300 mt-1">
                  Offer-to-Vouch ratio
                </div>
              </div>
            </div>

            {/* 1st–4th Year Cohort Progression Funnel */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-sm font-bold text-slate-900">
                    1st–4th Year Cohort Progression Funnel
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  SOA (ITER) Institutional Pipeline
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.cohortBreakdown.map((cohort) => {
                  const pct = Math.min(100, Math.round((cohort.activeCount / 200) * 100));
                  return (
                    <div
                      key={cohort.year}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-slate-900 text-white px-2 py-0.5 text-[11px] font-mono font-bold">
                            {cohort.year}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{cohort.label}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-700">
                          {cohort.activeCount} Active
                        </span>
                      </div>

                      <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>Function: {cohort.role}</span>
                        <span className="font-mono font-semibold text-emerald-800">
                          {cohort.verifiedBadges} Vouch Badges
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB B: Live Deal Room & Acqui-Hire Ledger */}
        {activeTab === 'deal_ledger' && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Live Deal Room &amp; Acqui-Hire Ledger
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time off-campus &amp; alumni-sponsored offers tracked by the T&amp;P Cell.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-[11px] font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                {dealRooms.length} Active Deal Rooms
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                    <th className="py-3 px-4 font-bold">Product</th>
                    <th className="py-3 px-4 font-bold">Hiring Alum &amp; Company</th>
                    <th className="py-3 px-4 font-bold">Action Type</th>
                    <th className="py-3 px-4 font-bold">Compensation</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {dealRooms.map((deal) => (
                    <tr key={deal.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{deal.productTitle}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                          {deal.message}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{deal.senderName}</div>
                        <div className="text-[11px] text-slate-500">
                          {deal.senderRole} • <span className="font-semibold text-slate-700">{deal.senderCompany}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[11px] font-mono font-semibold text-slate-800">
                          {ACTION_TYPE_LABELS[deal.actionType] || deal.actionType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                        {deal.proposedCompensation || 'TBD'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            deal.status === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : deal.status === 'Interview Scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {deal.status === 'Accepted' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {deal.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {dealRooms.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-slate-500">
                        No active Deal Room records in session.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB C: Verified Vouch Registry & Squad Directory */}
        {activeTab === 'vouch_registry' && (
          <div className="space-y-6">
            {/* Verified Vouch Certificates */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Verified Vouch Certificates Registry
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {allVouchEntries.length} Live Certificates
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allVouchEntries.map(({ product, vouch }) => (
                  <div
                    key={vouch.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-mono font-bold">
                          {vouch.vouchCode}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">{vouch.date}</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{product.title}</div>
                      <p className="text-xs text-slate-600 italic">&ldquo;{vouch.quote}&rdquo;</p>
                      <div className="text-[11px] text-slate-700">
                        Issued by <strong>{vouch.alumName}</strong> ({vouch.alumRole} @ {vouch.alumCompany}, Batch &apos;{String(vouch.alumBatch).slice(-2)})
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {vouch.certifiedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/70">
                      <button
                        type="button"
                        onClick={() => openVouchCardViewModal(vouch, product)}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white transition-all cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        Inspect Vouch Card
                      </button>
                      <button
                        type="button"
                        onClick={() => openLiveDemoModal(product)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-700 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Demo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Squad Directory */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-700" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Active Campus Squad Directory
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {products.length} Shipping Squads
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{product.title}</div>
                        <div className="text-[11px] text-emerald-700 font-semibold">
                          {product.hiringStatus}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openLiveDemoModal(product)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        Demo
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {product.squadMembers.map((member, mIdx) => (
                        <div
                          key={`${product.id}-m-${mIdx}`}
                          className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px]"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{member.name}</span>
                            <span className="text-slate-500"> • {member.role}</span>
                          </div>
                          <span className="font-mono text-[10px] font-semibold text-slate-600">
                            {member.year} ({member.branch})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB D: Corporate Partners & Institutional Audit Log */}
        {activeTab === 'partners_audit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Hiring Partners */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Top Hiring Corporate Partners
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-400">2026–27 Cycle</span>
              </div>

              <div className="space-y-2.5">
                {analytics.topHiringPartners.map((partner) => (
                  <div
                    key={partner.name}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-emerald-300 font-mono font-bold text-[10px]">
                        {partner.logo}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{partner.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {partner.avgPackage} avg package
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-mono font-bold">
                      {partner.hires} Hires
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* DB 3 Institutional Audit Log + Form */}
            <div className="lg:col-span-7 space-y-5">
              <form
                onSubmit={handleCreateAuditLog}
                className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Record Institutional Audit Note (DB 3)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">
                    POST /api/dean (log_audit)
                  </span>
                </div>

                {auditFeedback && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800">
                    {auditFeedback}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">
                      Category
                    </label>
                    <select
                      value={auditCategory}
                      onChange={(e) =>
                        setAuditCategory(e.target.value as InstitutionalAuditLog['category'])
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="drive_slot">Drive Slot</option>
                      <option value="deal_room">Deal Room</option>
                      <option value="vouch">Vouch Registry</option>
                      <option value="mvp_ship">MVP Ship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">
                      Authorizing Actor
                    </label>
                    <input
                      type="text"
                      value={auditActor}
                      onChange={(e) => setAuditActor(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">
                    Audit Title
                  </label>
                  <input
                    type="text"
                    value={auditTitle}
                    onChange={(e) => setAuditTitle(e.target.value)}
                    placeholder="e.g., Razorpay Fast-Track Campus Drive Approved"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">
                    Institutional Impact
                  </label>
                  <input
                    type="text"
                    value={auditImpact}
                    onChange={(e) => setAuditImpact(e.target.value)}
                    placeholder="e.g., 18 vouched 4th-year builders shortlisted for final round"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAudit || !auditTitle.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                  {isSubmittingAudit ? 'Recording to DB 3...' : 'Persist Audit Entry'}
                </button>
              </form>

              {/* Audit Log Stream */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    DB 3 Institutional Audit Log Stream
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {auditLogs.length} Entries
                  </span>
                </div>

                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-slate-900 text-emerald-300 px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                          {AUDIT_CATEGORY_LABELS[log.category] || log.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {log.timestamp}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 pt-0.5">{log.title}</div>
                      <div className="text-[11px] text-slate-600">{log.impact}</div>
                      <div className="text-[10px] font-mono text-slate-500 pt-0.5">
                        Actor: {log.actor}
                      </div>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <div className="text-xs text-slate-500 py-4 text-center">
                      Loading DB 3 institutional audit stream...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
