'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Coffee,
  MessageSquare,
  Search,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { AlumniVerificationBadge } from '@/components/shared/VerificationBadge';
import type { NetworkDirectoryEntry } from '@/modules/identity/queries';
import type { ProjectCardDTO } from '@/types/domain';

interface StudentExploreViewProps {
  directory: NetworkDirectoryEntry[];
  myProjects: ProjectCardDTO[];
  onToggleFollow: (targetUserId: string) => void;
  onRequestCoffeeChat: (input: {
    alumniUserId: string;
    projectId?: string | null;
    topic: string;
  }) => Promise<boolean>;
  onMessageMentor: (alumniName: string) => void;
}

export function StudentExploreView({
  directory,
  myProjects,
  onToggleFollow,
  onRequestCoffeeChat,
  onMessageMentor,
}: StudentExploreViewProps) {
  const [scope, setScope] = useState<'all' | 'alumni' | 'students'>('alumni');
  const [query, setQuery] = useState('');
  const [chatTarget, setChatTarget] = useState<NetworkDirectoryEntry | null>(
    null,
  );
  const [chatTopic, setChatTopic] = useState('');
  const [chatProjectId, setChatProjectId] = useState<string>('');
  const [submittingChat, setSubmittingChat] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return directory.filter((entry) => {
      if (scope === 'alumni' && entry.user.role !== 'alumni') return false;
      if (scope === 'students' && entry.user.role !== 'student') return false;
      if (!q) return true;
      const hay = [
        entry.user.fullName,
        entry.user.headline,
        entry.user.company ?? '',
        entry.user.designation ?? '',
        entry.user.branch ?? '',
        ...entry.user.techStack,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [directory, scope, query]);

  const handleCoffeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatTarget || chatTopic.trim().length < 5) return;
    setSubmittingChat(true);
    try {
      const ok = await onRequestCoffeeChat({
        alumniUserId: chatTarget.user.id,
        projectId: chatProjectId || null,
        topic: chatTopic.trim(),
      });
      if (ok) {
        setChatTarget(null);
        setChatTopic('');
        setChatProjectId('');
      }
    } finally {
      setSubmittingChat(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Scope Controls */}
      <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'alumni', label: 'Alumni Mentors' },
              { id: 'students', label: 'Student Builders' },
              { id: 'all', label: 'Entire Network' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setScope(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                scope === tab.id
                  ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24]'
                  : 'border border-slate-200 dark:border-white/10 text-[#475569] dark:text-[#94A3B8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by company, skill, branch..."
            className="w-full rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] pl-10 pr-4 py-2 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30"
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((entry) => {
          const { user } = entry;
          return (
            <article
              key={user.id}
              className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 flex flex-col justify-between gap-4 hover:border-[#0891B2]/50 dark:hover:border-[#22D3EE]/45 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {user.avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="h-12 w-12 rounded-2xl object-cover border border-slate-200 dark:border-white/15 shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-2xl bg-[#0891B2]/15 text-[#0891B2] flex items-center justify-center font-bold shrink-0">
                        {user.fullName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Link
                          href={`/u/${encodeURIComponent(user.id)}`}
                          className="font-luma-title text-sm hover:text-[#0891B2] dark:hover:text-[#22D3EE] truncate"
                        >
                          {user.fullName}
                        </Link>
                        {user.role === 'alumni' && (
                          <AlumniVerificationBadge
                            status={user.verificationStatus}
                            compact
                          />
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                        {user.headline}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleFollow(user.id)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors cursor-pointer shrink-0 ${
                      entry.isFollowedByMe
                        ? 'border border-[#0891B2]/35 bg-[#0891B2]/10 text-[#0891B2] dark:text-[#22D3EE]'
                        : 'bg-[#0F172A] text-white dark:bg-white/10 dark:text-white'
                    }`}
                  >
                    {entry.isFollowedByMe ? (
                      <>
                        <UserCheck className="w-3 h-3" /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3" /> Follow
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {user.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <Link
                  href={`/u/${encodeURIComponent(user.id)}`}
                  className="inline-flex items-center gap-1 font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline"
                >
                  Portfolio <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                {user.role === 'alumni' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onMessageMentor(user.fullName)}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/15 px-3 py-1 text-[11px] font-semibold hover:border-[#0891B2] cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" /> Message
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatTarget(entry)}
                      className="inline-flex items-center gap-1 rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-3 py-1 text-[11px] font-semibold cursor-pointer"
                    >
                      <Coffee className="w-3 h-3" /> Coffee Chat
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Coffee Chat Request Modal */}
      {chatTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setChatTarget(null);
          }}
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#121620] p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-luma-title text-base">
                  Request 15-Min Coffee Chat
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  With {chatTarget.user.fullName} (
                  {chatTarget.user.bandwidthShield ?? '2 chats / week'})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setChatTarget(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCoffeeSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label
                  htmlFor="coffee-project"
                  className="block text-xs font-semibold"
                >
                  Attach Showcase Build (optional)
                </label>
                <select
                  id="coffee-project"
                  value={chatProjectId}
                  onChange={(e) => setChatProjectId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-2 text-xs"
                >
                  <option value="">No project attached</option>
                  {myProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} • {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="coffee-topic"
                  className="block text-xs font-semibold"
                >
                  Specific Question / Agenda
                </label>
                <textarea
                  id="coffee-topic"
                  rows={3}
                  required
                  minLength={5}
                  value={chatTopic}
                  onChange={(e) => setChatTopic(e.target.value)}
                  placeholder="e.g. Looking for architecture feedback on our distributed KV snapshot pipeline & referral fit..."
                  className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setChatTarget(null)}
                  className="rounded-full border border-slate-300 dark:border-white/20 px-4 py-2 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingChat}
                  className="rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-5 py-2 text-xs font-semibold cursor-pointer disabled:opacity-60"
                >
                  {submittingChat ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
