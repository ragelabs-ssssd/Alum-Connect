'use client';

import React from 'react';
import { Bell, CheckCheck, CircleDot } from 'lucide-react';
import { formatShortDate } from '@/components/shared/DomainUtils';
import type { NotificationDTO } from '@/types/domain';

interface StudentNotificationsViewProps {
  notifications: NotificationDTO[];
  onMarkRead: (notificationId: string) => void;
  onMarkAllRead: () => void;
  onOpenTarget: (section: string) => void;
}

export function StudentNotificationsView({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onOpenTarget,
}: StudentNotificationsViewProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#0891B2]/15 text-[#0891B2] dark:text-[#22D3EE] flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-luma-title text-base">Notifications</h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              {unreadCount} unread updates across endorsements, jobs, and chats
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-white/20 px-4 py-1.5 text-xs font-semibold hover:border-[#0891B2] dark:hover:border-[#22D3EE] cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/15 bg-white/70 dark:bg-[#14171E]/60 p-10 text-center space-y-2">
          <Bell className="w-8 h-8 text-[#0891B2] dark:text-[#22D3EE] mx-auto" />
          <div className="text-sm font-bold">You&apos;re all caught up</div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            New vouch certificates, application updates, and mentor replies will
            appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                item.isRead
                  ? 'border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#14171E]/75'
                  : 'border-[#0891B2]/40 dark:border-[#22D3EE]/35 bg-[#0891B2]/5 dark:bg-[#22D3EE]/10'
              }`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {!item.isRead && (
                    <CircleDot className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE] shrink-0" />
                  )}
                  <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold">{item.title}</span>
                  <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    {formatShortDate(item.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  {item.message}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!item.isRead && (
                  <button
                    type="button"
                    onClick={() => onMarkRead(item.id)}
                    className="rounded-full border border-slate-300 dark:border-white/20 px-3 py-1 text-[11px] font-semibold hover:border-[#0891B2] cursor-pointer"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (!item.isRead) onMarkRead(item.id);
                    onOpenTarget(item.targetSection);
                  }}
                  className="rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-3.5 py-1 text-[11px] font-semibold cursor-pointer"
                >
                  {item.actionLabel || 'Open'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
