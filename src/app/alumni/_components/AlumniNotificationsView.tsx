'use client';

import React, { useState } from 'react';
import { Bell, CheckCheck, Sparkles } from 'lucide-react';
import { formatShortDate } from '@/components/shared/DomainUtils';
import type { NotificationDTO } from '@/types/domain';

export interface AlumniNotificationsViewProps {
  notifications: NotificationDTO[];
  onMarkRead: (notificationId: string) => Promise<void>;
  onMarkAllRead: () => Promise<void>;
  onNavigateSection: (targetSection: string, targetEntityId?: string | null) => void;
}

/**
 * Priority inbox for alumni showing student job applications, coffee chat requests,
 * verification updates, and direct message alerts.
 */
export function AlumniNotificationsView({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigateSection,
}: AlumniNotificationsViewProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [busyAll, setBusyAll] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const visible = notifications.filter((n) => (filter === 'unread' ? !n.isRead : true));

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(226,232,240,0.18)] bg-[#0C0F16] text-white p-6 space-y-3 shadow-md">
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br from-cyan-500/20 via-emerald-500/10 to-transparent blur-3xl" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/15 px-3 py-0.5 text-[11px] font-semibold text-[#22D3EE]">
              <Bell className="w-3.5 h-3.5" />
              <span>PRIORITY INBOX</span>
            </span>
            <h1 className="font-luma-title text-xl sm:text-2xl tracking-tight">
              Alerts &amp; Candidate Updates ({unreadCount} unread)
            </h1>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              disabled={busyAll}
              onClick={async () => {
                setBusyAll(true);
                try {
                  await onMarkAllRead();
                } finally {
                  setBusyAll(false);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-4 py-1.5 text-xs font-semibold disabled:opacity-50"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{busyAll ? 'Marking...' : 'Mark All Read'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {(['all', 'unread'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
              filter === f
                ? 'bg-[#0F172A] dark:bg-[#22D3EE] text-white dark:text-[#041E24]'
                : 'bg-[#F4F4F5] dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 text-[#52525B] dark:text-zinc-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#E4E4E7] dark:border-zinc-800 p-8 text-center space-y-2">
          <Sparkles className="w-6 h-6 mx-auto text-[#0891B2] dark:text-[#22D3EE]" />
          <p className="text-sm font-semibold">Inbox is all caught up.</p>
          <p className="text-xs text-[#52525B] dark:text-zinc-400">
            New student applications, coffee chat requests, and messages appear here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((notif) => (
            <div
              key={notif.id}
              className={`rounded-2xl border p-4 space-y-2 transition-colors ${
                notif.isRead
                  ? 'border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/85'
                  : 'border-[#0891B2]/45 dark:border-[#22D3EE]/40 bg-[#0891B2]/5 dark:bg-[#22D3EE]/10'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!notif.isRead && (
                    <span className="h-2 w-2 rounded-full bg-[#0891B2] dark:bg-[#22D3EE]" />
                  )}
                  <span className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-[#52525B] dark:text-zinc-300">
                    {notif.category.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-[#52525B] dark:text-zinc-400">
                    {formatShortDate(notif.createdAt)}
                  </span>
                </div>

                {!notif.isRead && (
                  <button
                    type="button"
                    onClick={() => void onMarkRead(notif.id)}
                    className="text-[11px] font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <h2 className="text-sm font-bold text-[#09090B] dark:text-white">
                {notif.title}
              </h2>
              <p className="text-xs text-[#52525B] dark:text-zinc-300 leading-relaxed">
                {notif.message}
              </p>

              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!notif.isRead) void onMarkRead(notif.id);
                    onNavigateSection(notif.targetSection, notif.targetEntityId);
                  }}
                  className="rounded-full bg-[#0F172A] dark:bg-zinc-100 text-white dark:text-zinc-950 px-3.5 py-1 text-[11px] font-semibold hover:opacity-90"
                >
                  {notif.actionLabel || 'Open'} →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
