'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BadgeCheck,
  CheckCheck,
  FolderGit2,
  MessageSquare,
  Plus,
  Radio,
  Search,
  Send,
  Video,
} from 'lucide-react';
import { sendChatMessageAction, markThreadReadAction } from '@/modules/messaging/actions';
import {
  useRealtimeChannel,
  type RealtimeChatPayload,
} from '@/modules/messaging/useRealtimeChannel';
import type { ChatMessageDTO, ChatThreadDTO } from '@/types/domain';
import {
  ALUMNI_DATA,
  PROJECTS_DATA,
  STUDENTS_DATA,
  getIndianAvatar,
} from '../data/alumConnectData';

export interface ChatMessage {
  id: string;
  senderRole: 'student' | 'alumni';
  senderName: string;
  senderUserId?: string;
  time: string;
  text: string;
  attachment?: string;
}

export interface ChatThread {
  id: string;
  studentUserId?: string;
  studentName: string;
  studentMeta: string;
  studentAvatar: string;
  alumniUserId?: string;
  alumniName: string;
  alumniMeta: string;
  alumniAvatar: string;
  topic: string;
  online: boolean;
  unreadForStudent: number;
  unreadForAlumni: number;
  isLocalDraft?: boolean;
  messages: ChatMessage[];
}

export const CHAT_STORAGE_KEY = 'alum_connect_chat_threads_v1';
const STORAGE_KEY = CHAT_STORAGE_KEY;

function formatMessageTime(iso?: string): string {
  if (!iso) {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function mapDtoMessageToChatMessage(m: ChatMessageDTO): ChatMessage {
  return {
    id: m.id,
    senderRole: m.senderRole,
    senderName: m.senderName,
    senderUserId: m.senderUserId,
    time: formatMessageTime(m.createdAt),
    text: m.text,
    attachment: m.attachmentUrl ?? undefined,
  };
}

export function mapDtoThreadToChatThread(t: ChatThreadDTO): ChatThread {
  return {
    id: t.id,
    studentUserId: t.studentUserId,
    studentName: t.studentName,
    studentMeta: t.studentMeta,
    studentAvatar: t.studentAvatar || getIndianAvatar(t.studentName),
    alumniUserId: t.alumniUserId,
    alumniName: t.alumniName,
    alumniMeta: t.alumniMeta,
    alumniAvatar: t.alumniAvatar || getIndianAvatar(t.alumniName),
    topic: t.topic,
    online: true,
    unreadForStudent: t.studentUnreadCount,
    unreadForAlumni: t.alumniUnreadCount,
    messages: t.messages.map(mapDtoMessageToChatMessage),
  };
}

export const buildInitialThreads = (): ChatThread[] => {
  const s1 = STUDENTS_DATA[0];
  const s2 = STUDENTS_DATA[1];
  const s3 = STUDENTS_DATA[2];
  const s4 = STUDENTS_DATA[3];
  const a1 = ALUMNI_DATA[0];
  const a4 = ALUMNI_DATA[3] || ALUMNI_DATA[1];
  const a5 = ALUMNI_DATA[4] || ALUMNI_DATA[2];
  const a8 = ALUMNI_DATA[7] || ALUMNI_DATA[0];

  return [
    {
      id: 'thread-1',
      studentName: s1?.fullName || 'Aarav Mohanty',
      studentMeta: `${s1?.branch || 'CSE'} • ${s1?.academicYear || '4th Year'}`,
      studentAvatar: getIndianAvatar(s1?.fullName || 'Aarav Mohanty'),
      alumniName: a1?.fullName || 'Debadatta Rath',
      alumniMeta: `${a1?.designation || 'CTO'} @ ${a1?.company || 'HyperScale Labs'}`,
      alumniAvatar: getIndianAvatar(a1?.fullName || 'Debadatta Rath'),
      topic: `${PROJECTS_DATA[0]?.id || 'PRJ-01'} • ${PROJECTS_DATA[0]?.name || 'Distributed Raft KV Store'}`,
      online: true,
      unreadForStudent: 1,
      unreadForAlumni: 0,
      messages: [
        {
          id: 'm-101',
          senderRole: 'student',
          senderName: s1?.fullName || 'Aarav Mohanty',
          time: '11:40 AM',
          text: `Hi ${a1?.fullName?.split(' ')[0] || 'Debadatta'} sir! I just shipped ${PROJECTS_DATA[0]?.name || 'our distributed KV store'} with Jepsen-style partition tests. Would love your feedback on the log compaction path.`,
          attachment: PROJECTS_DATA[0]?.githubUrl || 'https://github.com/iter-soa/alum-connect-build',
        },
        {
          id: 'm-102',
          senderRole: 'alumni',
          senderName: a1?.fullName || 'Debadatta Rath',
          time: '11:44 AM',
          text: 'Checked your repo — clean snapshot chunking. Your leader election benchmark looks solid. Free for a 15-min systems chat tomorrow?',
        },
      ],
    },
    {
      id: 'thread-2',
      studentName: s1?.fullName || 'Aarav Mohanty',
      studentMeta: `${s1?.branch || 'CSE'} • ${s1?.academicYear || '4th Year'}`,
      studentAvatar: getIndianAvatar(s1?.fullName || 'Aarav Mohanty'),
      alumniName: a4?.fullName || 'Soumya Ranjan Panigrahi',
      alumniMeta: `${a4?.designation || 'Staff SWE'} @ ${a4?.company || 'Google'}`,
      alumniAvatar: getIndianAvatar(a4?.fullName || 'Soumya Ranjan Panigrahi'),
      topic: 'Referral • Backend / Systems Engineering',
      online: true,
      unreadForStudent: 1,
      unreadForAlumni: 0,
      messages: [
        {
          id: 'm-201',
          senderRole: 'alumni',
          senderName: a4?.fullName || 'Soumya Ranjan Panigrahi',
          time: '10:20 AM',
          text: 'Drop your GitHub + live Vercel demo link here — I have 2 referral slots left for the 2026 graduating batch.',
        },
      ],
    },
    {
      id: 'thread-3',
      studentName: s2?.fullName || 'Ananya Senapati',
      studentMeta: `${s2?.branch || 'CSE'} • ${s2?.academicYear || '4th Year'}`,
      studentAvatar: getIndianAvatar(s2?.fullName || 'Ananya Senapati'),
      alumniName: a5?.fullName || 'Priya Das',
      alumniMeta: `${a5?.designation || 'Senior ML Engineer'} @ ${a5?.company || 'Razorpay'}`,
      alumniAvatar: getIndianAvatar(a5?.fullName || 'Priya Das'),
      topic: 'Mock Interview & ML Portfolio Review',
      online: true,
      unreadForStudent: 0,
      unreadForAlumni: 1,
      messages: [
        {
          id: 'm-301',
          senderRole: 'alumni',
          senderName: a5?.fullName || 'Priya Das',
          time: 'Yesterday',
          text: 'Highlight p99 latency numbers right at the top of your ML inference project bullet.',
        },
        {
          id: 'm-302',
          senderRole: 'student',
          senderName: s2?.fullName || 'Ananya Senapati',
          time: '09:15 AM',
          text: 'Updated the benchmark README and added ONNX quantization numbers (p99 down from 42ms to 16ms). Thank you!',
        },
      ],
    },
    {
      id: 'thread-4',
      studentName: s3?.fullName || 'Rohan Mishra',
      studentMeta: `${s3?.branch || 'CSIT'} • ${s3?.academicYear || '3rd Year'}`,
      studentAvatar: getIndianAvatar(s3?.fullName || 'Rohan Mishra'),
      alumniName: a8?.fullName || 'Rohan Patnaik',
      alumniMeta: `${a8?.designation || 'Principal Architect'} @ ${a8?.company || 'Microsoft'}`,
      alumniAvatar: getIndianAvatar(a8?.fullName || 'Rohan Patnaik'),
      topic: `${PROJECTS_DATA[2]?.id || 'PRJ-03'} • Architecture Review`,
      online: false,
      unreadForStudent: 0,
      unreadForAlumni: 0,
      messages: [
        {
          id: 'm-401',
          senderRole: 'student',
          senderName: s3?.fullName || 'Rohan Mishra',
          time: '2d ago',
          text: 'Sir, we published our Edge Telemetry gateway on Vercel. Would love any scaling tips for WebSocket fan-out.',
        },
      ],
    },
    {
      id: 'thread-5',
      studentName: s4?.fullName || 'Ishita Mohanty',
      studentMeta: `${s4?.branch || 'ECE'} • ${s4?.academicYear || '4th Year'}`,
      studentAvatar: getIndianAvatar(s4?.fullName || 'Ishita Mohanty'),
      alumniName: a1?.fullName || 'Debadatta Rath',
      alumniMeta: `${a1?.designation || 'CTO'} @ ${a1?.company || 'HyperScale Labs'}`,
      alumniAvatar: getIndianAvatar(a1?.fullName || 'Debadatta Rath'),
      topic: 'Paid Bounty • Real-time Observability UI',
      online: true,
      unreadForStudent: 0,
      unreadForAlumni: 1,
      messages: [
        {
          id: 'm-501',
          senderRole: 'student',
          senderName: s4?.fullName || 'Ishita Mohanty',
          time: '1h ago',
          text: 'Submitted our PR for the streaming metrics chart component. Ready for review!',
        },
      ],
    },
  ];
};

export interface ChatPeerOption {
  userId?: string;
  name: string;
  meta: string;
  avatarUrl?: string;
}

interface AlumStudentChatSectionProps {
  viewerRole: 'student' | 'alumni';
  viewerName: string;
  initialTargetName?: string | null;
  initialThreadId?: string | null;
  currentUserId?: string;
  initialThreads?: ChatThreadDTO[];
  availablePeers?: ChatPeerOption[];
}

function buildThreadForTarget(
  targetName: string,
  viewerRole: 'student' | 'alumni',
  viewerName: string,
  currentUserId?: string,
  peerOption?: ChatPeerOption
): ChatThread {
  const normalized = targetName.trim().toLowerCase();
  const counterpartAlum = ALUMNI_DATA.find(
    (a) => a.fullName.toLowerCase() === normalized
  );
  const counterpartStudent = STUDENTS_DATA.find(
    (s) => s.fullName.toLowerCase() === normalized
  );

  return {
    id: `local-${targetName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    isLocalDraft: true,
    studentUserId:
      viewerRole === 'student' ? currentUserId : peerOption?.userId,
    studentName:
      viewerRole === 'student'
        ? viewerName
        : counterpartStudent?.fullName || targetName,
    studentMeta:
      viewerRole === 'student'
        ? 'ITER Student Builder'
        : peerOption?.meta ||
          `${counterpartStudent?.branch || 'CSE'} • ${counterpartStudent?.academicYear || '4th Year'}`,
    studentAvatar: getIndianAvatar(
      viewerRole === 'student'
        ? viewerName
        : counterpartStudent?.fullName || targetName
    ),
    alumniUserId:
      viewerRole === 'alumni' ? currentUserId : peerOption?.userId,
    alumniName:
      viewerRole === 'alumni'
        ? viewerName
        : counterpartAlum?.fullName || targetName,
    alumniMeta:
      viewerRole === 'alumni'
        ? 'ITER Alumni Mentor'
        : peerOption?.meta ||
          `${counterpartAlum?.designation || 'Senior Engineer'} @ ${counterpartAlum?.company || 'Tech Partner'}`,
    alumniAvatar: getIndianAvatar(
      viewerRole === 'alumni'
        ? viewerName
        : counterpartAlum?.fullName || targetName
    ),
    topic: 'Direct Mentorship & Project Collaboration',
    online: true,
    unreadForStudent: 0,
    unreadForAlumni: 0,
    messages: [],
  };
}

export default function AlumStudentChatSection({
  viewerRole,
  viewerName,
  initialTargetName,
  initialThreadId,
  currentUserId,
  initialThreads,
  availablePeers,
}: AlumStudentChatSectionProps) {
  const isServerBacked = Boolean(currentUserId || initialThreads);
  const idCounterRef = useRef(1);

  const [threads, setThreads] = useState<ChatThread[]>(() => {
    let base: ChatThread[] = [];
    if (initialThreads && initialThreads.length > 0) {
      base = initialThreads.map(mapDtoThreadToChatThread);
    } else if (!currentUserId && typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as ChatThread[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            base = parsed;
          }
        }
      } catch {
        // ignore malformed storage
      }
    }

    if (base.length === 0 && !currentUserId) {
      base = buildInitialThreads();
    }

    if (initialTargetName) {
      const normalized = initialTargetName.trim().toLowerCase();
      const existing = base.find((t) =>
        viewerRole === 'student'
          ? t.alumniName.toLowerCase() === normalized
          : t.studentName.toLowerCase() === normalized
      );
      if (!existing) {
        const peerMatch = availablePeers?.find(
          (p) => p.name.toLowerCase() === normalized
        );
        base = [
          buildThreadForTarget(
            initialTargetName,
            viewerRole,
            viewerName,
            currentUserId,
            peerMatch
          ),
          ...base,
        ];
      }
    }

    return base;
  });

  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    if (initialThreadId) return initialThreadId;
    if (initialTargetName) {
      const normalized = initialTargetName.trim().toLowerCase();
      const match = threads.find((t) =>
        viewerRole === 'student'
          ? t.alumniName.toLowerCase() === normalized
          : t.studentName.toLowerCase() === normalized
      );
      if (match) return match.id;
    }
    return threads[0]?.id || 'thread-1';
  });

  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');
  const [draft, setDraft] = useState('');
  const [attachRepo, setAttachRepo] = useState(false);
  const [sending, setSending] = useState(false);
  const [callToast, setCallToast] = useState<string | null>(null);
  const [showNewPicker, setShowNewPicker] = useState(false);

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeThreadId) || threads[0],
    [threads, activeThreadId]
  );

  // Realtime incoming message handler
  const handleIncomingRealtimeMessage = useCallback(
    (payload: RealtimeChatPayload) => {
      const incomingMsg = mapDtoMessageToChatMessage(payload.message);

      setThreads((prev) => {
        const exists = prev.some((t) => t.id === payload.threadId);
        if (!exists) {
          return prev;
        }
        return prev.map((t) => {
          if (t.id !== payload.threadId) return t;
          if (t.messages.some((m) => m.id === incomingMsg.id)) {
            return t;
          }
          const isCurrentlyViewing = activeThread?.id === t.id;
          const isIncomingForMe = payload.senderUserId !== currentUserId;
          return {
            ...t,
            unreadForStudent:
              viewerRole === 'student' && isIncomingForMe && !isCurrentlyViewing
                ? t.unreadForStudent + 1
                : t.unreadForStudent,
            unreadForAlumni:
              viewerRole === 'alumni' && isIncomingForMe && !isCurrentlyViewing
                ? t.unreadForAlumni + 1
                : t.unreadForAlumni,
            messages: [...t.messages, incomingMsg],
          };
        });
      });
    },
    [activeThread?.id, currentUserId, viewerRole]
  );

  const { mode, connected, onlineUsers, publishMessage } = useRealtimeChannel({
    userId: currentUserId,
    userName: viewerName,
    userRole: viewerRole,
    threadId: activeThread?.id,
    onMessage: handleIncomingRealtimeMessage,
  });

  const onlineUserIds = useMemo(
    () => new Set(onlineUsers.map((u) => u.userId)),
    [onlineUsers]
  );

  // Sync localStorage when in unauthenticated legacy mode
  useEffect(() => {
    if (isServerBacked || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
    } catch {
      // ignore quota errors
    }
  }, [isServerBacked, threads]);

  // Listen for legacy cross-tab storage updates when not server-backed
  useEffect(() => {
    if (isServerBacked) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as ChatThread[];
          if (Array.isArray(parsed)) setThreads(parsed);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [isServerBacked]);

  const filteredThreads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return threads.filter((t) => {
      const peerName = viewerRole === 'student' ? t.alumniName : t.studentName;
      const peerMeta = viewerRole === 'student' ? t.alumniMeta : t.studentMeta;
      const unread =
        viewerRole === 'student' ? t.unreadForStudent : t.unreadForAlumni;
      if (filterMode === 'unread' && unread === 0) return false;
      if (!q) return true;
      return (
        peerName.toLowerCase().includes(q) ||
        peerMeta.toLowerCase().includes(q) ||
        t.topic.toLowerCase().includes(q)
      );
    });
  }, [threads, search, filterMode, viewerRole]);

  const selectThread = (id: string) => {
    setActiveThreadId(id);
    setThreads((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              unreadForStudent: viewerRole === 'student' ? 0 : t.unreadForStudent,
              unreadForAlumni: viewerRole === 'alumni' ? 0 : t.unreadForAlumni,
            }
          : t
      )
    );

    const target = threads.find((t) => t.id === id);
    if (currentUserId && target && !target.isLocalDraft) {
      void markThreadReadAction({ threadId: id });
    }
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !activeThread || sending) return;

    const attachmentUrl = attachRepo
      ? PROJECTS_DATA[0]?.githubUrl || 'https://github.com/iter-soa/alum-connect'
      : undefined;

    if (currentUserId) {
      const peerUserId =
        viewerRole === 'student'
          ? activeThread.alumniUserId
          : activeThread.studentUserId;

      setSending(true);
      try {
        const res = await sendChatMessageAction({
          threadId: activeThread.isLocalDraft ? undefined : activeThread.id,
          recipientUserId: peerUserId,
          topic: activeThread.topic,
          text,
          attachmentUrl: attachmentUrl ?? null,
        });

        if (res.ok) {
          const { thread: savedThread, message: savedMessage, recipientUserId } =
            res.data;
          const mappedThread = mapDtoThreadToChatThread(savedThread);

          setThreads((prev) => {
            const hasExisting = prev.some(
              (t) => t.id === activeThread.id || t.id === mappedThread.id
            );
            if (!hasExisting) return [mappedThread, ...prev];
            return prev.map((t) =>
              t.id === activeThread.id || t.id === mappedThread.id
                ? mappedThread
                : t
            );
          });
          setActiveThreadId(mappedThread.id);
          setDraft('');
          setAttachRepo(false);

          await publishMessage({
            threadId: mappedThread.id,
            message: savedMessage,
            senderUserId: currentUserId,
            recipientUserId,
            topic: mappedThread.topic,
          });
          return;
        }
      } finally {
        setSending(false);
      }
    }

    // Fallback local mode (when unauthenticated or legacy demo)
    idCounterRef.current += 1;
    const newMessage: ChatMessage = {
      id: `m-local-${idCounterRef.current}`,
      senderRole: viewerRole,
      senderName: viewerName,
      senderUserId: currentUserId,
      time: formatMessageTime(),
      text,
      attachment: attachmentUrl,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              unreadForStudent:
                viewerRole === 'alumni' ? t.unreadForStudent + 1 : 0,
              unreadForAlumni:
                viewerRole === 'student' ? t.unreadForAlumni + 1 : 0,
              messages: [...t.messages, newMessage],
            }
          : t
      )
    );
    setDraft('');
    setAttachRepo(false);
  };

  const quickChips =
    viewerRole === 'student'
      ? ['Share Project Link', 'Request Referral', 'Book 15-Min Office Hours']
      : ['Ask for Live Demo', 'Offer Referral Slot', 'Schedule 15m Critique'];

  const directoryPeers = useMemo<ChatPeerOption[]>(() => {
    if (availablePeers && availablePeers.length > 0) {
      return availablePeers;
    }
    if (viewerRole === 'student') {
      return ALUMNI_DATA.slice(0, 8).map((a) => ({
        name: a.fullName,
        meta: `${a.designation} @ ${a.company}`,
      }));
    }
    return STUDENTS_DATA.slice(0, 8).map((s) => ({
      name: s.fullName,
      meta: `${s.branch} • ${s.academicYear}`,
    }));
  }, [availablePeers, viewerRole]);

  const startNewChatWith = (peer: ChatPeerOption) => {
    const existing = threads.find((t) =>
      viewerRole === 'student'
        ? t.alumniName.toLowerCase() === peer.name.toLowerCase() ||
          (peer.userId && t.alumniUserId === peer.userId)
        : t.studentName.toLowerCase() === peer.name.toLowerCase() ||
          (peer.userId && t.studentUserId === peer.userId)
    );
    if (existing) {
      selectThread(existing.id);
      setShowNewPicker(false);
      return;
    }

    const newThread = buildThreadForTarget(
      peer.name,
      viewerRole,
      viewerName,
      currentUserId,
      peer
    );
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    setShowNewPicker(false);
  };

  const activePeerName = activeThread
    ? viewerRole === 'student'
      ? activeThread.alumniName
      : activeThread.studentName
    : '';
  const activePeerMeta = activeThread
    ? viewerRole === 'student'
      ? activeThread.alumniMeta
      : activeThread.studentMeta
    : '';
  const activePeerAvatar = activeThread
    ? viewerRole === 'student'
      ? activeThread.alumniAvatar
      : activeThread.studentAvatar
    : '';
  const activePeerUserId = activeThread
    ? viewerRole === 'student'
      ? activeThread.alumniUserId
      : activeThread.studentUserId
    : undefined;
  const activePeerOnline = Boolean(
    activeThread &&
      ((activePeerUserId && onlineUserIds.has(activePeerUserId)) ||
        activeThread.online)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="font-luma-title text-xl sm:text-2xl leading-snug tracking-tight text-zinc-900 dark:text-zinc-100">
            Alumni ↔ Student Direct Chat
          </h2>
          {currentUserId && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                connected
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-[#34D399]'
                  : 'border-zinc-300 dark:border-zinc-700 text-zinc-500'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>
                {mode === 'supabase' ? 'Supabase Realtime' : 'Cross-Tab Sync'}
              </span>
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowNewPicker((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          New {viewerRole === 'student' ? 'Alumni' : 'Student'} Chat
        </button>
      </div>

      {showNewPicker && (
        <div className="rounded-2xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2.5">
          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
            Start a direct thread with an ITER{' '}
            {viewerRole === 'student' ? 'Alumnus' : 'Student'}:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {directoryPeers.map((peer) => (
              <button
                key={peer.userId || peer.name}
                type="button"
                onClick={() => startNewChatWith(peer)}
                className="text-left rounded-xl border border-[#E4E4E7] dark:border-slate-800 px-3 py-2 hover:border-[#0891B2] dark:hover:border-[#22D3EE] transition-colors"
              >
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {peer.name}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {peer.meta}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {callToast && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/50 px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span>{callToast}</span>
          <button
            type="button"
            onClick={() => setCallToast(null)}
            className="underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[540px]">
        {/* Left Thread List */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[#E4E4E7] dark:border-slate-800 flex flex-col bg-[#FCFCFD] dark:bg-slate-950/60 min-h-0">
          <div className="p-3 border-b border-[#E4E4E7] dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 rounded-xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs">
              <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${viewerRole === 'student' ? 'alumni' : 'students'} or projects...`}
                className="w-full bg-transparent outline-none text-xs text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {(['all', 'unread'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFilterMode(m)}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                    filterMode === m
                      ? 'bg-[#0F172A] dark:bg-zinc-100 text-white dark:text-zinc-950'
                      : 'bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-[#F4F4F5] dark:divide-slate-800/70">
            {filteredThreads.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500">
                No conversations match your filter.
              </div>
            ) : (
              filteredThreads.map((t) => {
                const peerName =
                  viewerRole === 'student' ? t.alumniName : t.studentName;
                const peerMeta =
                  viewerRole === 'student' ? t.alumniMeta : t.studentMeta;
                const peerAvatar =
                  viewerRole === 'student' ? t.alumniAvatar : t.studentAvatar;
                const peerId =
                  viewerRole === 'student' ? t.alumniUserId : t.studentUserId;
                const isOnline =
                  (peerId && onlineUserIds.has(peerId)) || t.online;
                const unread =
                  viewerRole === 'student'
                    ? t.unreadForStudent
                    : t.unreadForAlumni;
                const last = t.messages[t.messages.length - 1];

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => selectThread(t.id)}
                    className={`w-full text-left p-3 flex items-start gap-2.5 transition-colors ${
                      activeThread?.id === t.id
                        ? 'bg-[#0891B2]/10 dark:bg-[#22D3EE]/10'
                        : 'hover:bg-zinc-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={peerAvatar}
                        alt={peerName}
                        className="h-9 w-9 rounded-full object-cover border border-[#E4E4E7] dark:border-slate-700"
                      />
                      {isOnline && (
                        <span
                          title="Online"
                          className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {peerName}
                        </span>
                        <span className="text-[10px] text-zinc-400 shrink-0">
                          {last?.time || 'New'}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-[#0891B2] dark:text-[#22D3EE] truncate">
                        {peerMeta}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {last?.text || t.topic}
                      </p>
                    </div>
                    {unread > 0 && (
                      <span className="h-4 min-w-4 px-1 rounded-full bg-[#0891B2] dark:bg-[#22D3EE] text-[10px] font-bold text-white dark:text-[#041E24] flex items-center justify-center shrink-0">
                        {unread}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Conversation Pane */}
        <div className="md:col-span-8 flex flex-col bg-white dark:bg-slate-900 min-h-0">
          {activeThread ? (
            <>
              <div className="px-4 py-3 border-b border-[#E4E4E7] dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={activePeerAvatar}
                      alt={activePeerName}
                      className="h-9 w-9 rounded-full object-cover border border-[#E4E4E7] dark:border-slate-700"
                    />
                    {activePeerOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {activePeerName}
                      </span>
                      <BadgeCheck className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE] shrink-0" />
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {activePeerMeta} • {activeThread.topic}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCallToast(
                      `15-min video call invite sent to ${activePeerName} via AlmaConnect Meet.`
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E4E4E7] dark:border-slate-700 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-slate-800 shrink-0"
                >
                  <Video className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" /> 15m Call
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3 bg-[#FAFAFA]/70 dark:bg-slate-950/40">
                {activeThread.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-xs text-zinc-500 gap-2">
                    <MessageSquare className="w-6 h-6 text-zinc-400" />
                    <p>
                      Start the conversation with {activePeerName} using a
                      quick-reply chip or message below.
                    </p>
                  </div>
                ) : (
                  activeThread.messages.map((m) => {
                    const isMine = currentUserId
                      ? m.senderUserId === currentUserId ||
                        m.senderRole === viewerRole
                      : m.senderRole === viewerRole;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                            isMine
                              ? 'bg-[#0F172A] dark:bg-[#0891B2] text-white rounded-br-sm'
                              : 'bg-white dark:bg-slate-800 border border-[#E4E4E7] dark:border-slate-700 text-zinc-900 dark:text-zinc-100 rounded-bl-sm'
                          }`}
                        >
                          <p>{m.text}</p>
                          {m.attachment && (
                            <a
                              href={m.attachment}
                              target="_blank"
                              rel="noreferrer"
                              className={`mt-2 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-mono underline ${
                                isMine
                                  ? 'bg-white/10 text-white'
                                  : 'bg-zinc-100 dark:bg-slate-900 text-[#0891B2] dark:text-[#22D3EE]'
                              }`}
                            >
                              <FolderGit2 className="w-3 h-3 shrink-0" />{' '}
                              {m.attachment}
                            </a>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-400 mt-1 px-1 flex items-center gap-1">
                          {m.time}{' '}
                          {isMine && (
                            <CheckCheck className="w-3 h-3 text-[#0891B2] dark:text-[#22D3EE]" />
                          )}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-3 border-t border-[#E4E4E7] dark:border-slate-800 space-y-2 bg-white dark:bg-slate-900">
                <div className="flex flex-wrap items-center gap-1.5">
                  {quickChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        if (chip === 'Share Project Link') {
                          setAttachRepo(true);
                          setDraft(
                            'Here is my latest build & GitHub repo for review: '
                          );
                        } else {
                          setDraft(
                            `Hi ${activePeerName.split(' ')[0]}, I would like to ${chip.toLowerCase()}.`
                          );
                        }
                      }}
                      className="rounded-full border border-[#E4E4E7] dark:border-slate-700 bg-zinc-50 dark:bg-slate-800 hover:bg-zinc-100 dark:hover:bg-slate-700 px-2.5 py-0.5 text-[10px] font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      + {chip}
                    </button>
                  ))}
                  {attachRepo && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 px-2.5 py-0.5 text-[10px] font-semibold text-[#0891B2] dark:text-[#22D3EE]">
                      <FolderGit2 className="w-3 h-3" /> Repo Attached
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        void handleSend();
                      }
                    }}
                    placeholder={`Message ${activePeerName}...`}
                    className="flex-1 rounded-xl border border-[#E4E4E7] dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:border-[#0891B2] dark:focus:border-[#22D3EE]"
                  />
                  <button
                    type="button"
                    disabled={sending || !draft.trim()}
                    onClick={() => void handleSend()}
                    className="inline-flex items-center gap-1 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] disabled:opacity-50 px-3.5 py-2 text-xs font-semibold transition-all"
                  >
                    <Send className="w-3.5 h-3.5" /> {sending ? 'Sending' : 'Send'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-xs text-zinc-500 gap-2">
              <MessageSquare className="w-7 h-7 text-zinc-400" />
              <p>Select a thread or start a new conversation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
