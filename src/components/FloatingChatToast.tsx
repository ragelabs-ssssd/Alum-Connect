'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Maximize2,
  MessageSquare,
  Send,
  X,
} from 'lucide-react';
import {
  CHAT_STORAGE_KEY,
  ChatMessage,
  ChatThread,
  buildInitialThreads,
} from './AlumStudentChatSection';

interface FloatingChatToastProps {
  viewerRole: 'student' | 'alumni';
  viewerName: string;
  isChatOpen: boolean;
  onExpandToChat: (threadId?: string) => void;
}

export default function FloatingChatToast({
  viewerRole,
  viewerName,
  isChatOpen,
  onExpandToChat,
}: FloatingChatToastProps) {
  const [incoming, setIncoming] = useState<{
    thread: ChatThread;
    message: ChatMessage;
  } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sentToast, setSentToast] = useState(false);
  const lastSeenCountRef = useRef<Record<string, number>>({});

  // Initialize baseline message counts so seed messages don't auto-popup on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
      const list: ChatThread[] = raw ? JSON.parse(raw) : buildInitialThreads();
      const counts: Record<string, number> = {};
      list.forEach((t) => {
        counts[t.id] = t.messages.length;
      });
      lastSeenCountRef.current = counts;
    } catch {
      // ignore
    }
  }, []);

  // Listen for incoming messages from another tab/portal when Chat tab is closed
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== CHAT_STORAGE_KEY || !e.newValue) return;
      try {
        const updated = JSON.parse(e.newValue) as ChatThread[];
        if (!Array.isArray(updated)) return;

        for (const t of updated) {
          const prevCount = lastSeenCountRef.current[t.id] ?? 0;
          if (t.messages.length > prevCount) {
            const latest = t.messages[t.messages.length - 1];
            lastSeenCountRef.current[t.id] = t.messages.length;
            if (!isChatOpen && latest && latest.senderRole !== viewerRole) {
              setIncoming({ thread: t, message: latest });
              setSentToast(false);
              setReplyText('');
              break;
            }
          }
        }
      } catch {
        // ignore malformed JSON
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [isChatOpen, viewerRole]);

  // Hide popup if user opens the full Chat section
  if (isChatOpen) return null;

  const handleInstantReply = () => {
    const text = replyText.trim();
    if (!text || !incoming) return;

    try {
      const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
      const threads: ChatThread[] = raw ? JSON.parse(raw) : buildInitialThreads();
      const newMessage: ChatMessage = {
        id: `m-${Date.now()}`,
        senderRole: viewerRole,
        senderName: viewerName,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        text,
      };

      const next = threads.map((t) =>
        t.id === incoming.thread.id
          ? {
              ...t,
              unreadForStudent:
                viewerRole === 'alumni' ? t.unreadForStudent + 1 : 0,
              unreadForAlumni:
                viewerRole === 'student' ? t.unreadForAlumni + 1 : 0,
              messages: [...t.messages, newMessage],
            }
          : t
      );

      lastSeenCountRef.current[incoming.thread.id] =
        (lastSeenCountRef.current[incoming.thread.id] ?? 0) + 1;
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(next));
      setReplyText('');
      setSentToast(true);
      setTimeout(() => {
        setIncoming(null);
        setSentToast(false);
      }, 1100);
    } catch {
      // ignore storage errors
    }
  };

  // Compact launcher pill when no popup is active so user can also preview/open chat anytime
  if (!incoming) {
    return (
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            try {
              const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
              const list: ChatThread[] = raw
                ? JSON.parse(raw)
                : buildInitialThreads();
              const target =
                list.find((t) =>
                  t.messages.some((m) => m.senderRole !== viewerRole)
                ) || list[0];
              if (target) {
                const msg =
                  [...target.messages]
                    .reverse()
                    .find((m) => m.senderRole !== viewerRole) ||
                  target.messages[target.messages.length - 1];
                if (msg) {
                  setIncoming({ thread: target, message: msg });
                  setSentToast(false);
                }
              }
            } catch {
              // ignore
            }
          }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#14171E]/95 text-white px-4 py-2.5 text-xs font-semibold shadow-lg backdrop-blur-xl hover:border-[#22D3EE] transition-colors"
          title="Preview incoming message quick-reply popup"
        >
          <span className="h-2 w-2 rounded-full bg-[#22D3EE] animate-pulse" />
          <MessageSquare className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>Quick Reply</span>
        </button>
      </div>
    );
  }

  const peerName =
    viewerRole === 'student'
      ? incoming.thread.alumniName
      : incoming.thread.studentName;
  const peerMeta =
    viewerRole === 'student'
      ? incoming.thread.alumniMeta
      : incoming.thread.studentMeta;
  const peerAvatar =
    viewerRole === 'student'
      ? incoming.thread.alumniAvatar
      : incoming.thread.studentAvatar;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[350px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/20 bg-[#14171E]/95 text-white shadow-2xl backdrop-blur-xl">
      {/* Top Bar with Expand & Close */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5 bg-white/[0.04]">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={peerAvatar}
            alt={peerName}
            className="h-8 w-8 rounded-full object-cover border border-white/20 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold truncate">{peerName}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            </div>
            <p className="text-[10px] text-zinc-400 truncate">{peerMeta}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              const id = incoming.thread.id;
              setIncoming(null);
              onExpandToChat(id);
            }}
            className="inline-flex items-center gap-1 rounded-full border border-cyan-500/35 bg-cyan-500/15 px-2.5 py-1 text-[10px] font-semibold text-[#22D3EE] hover:bg-cyan-500/25 transition-colors"
            title="Expand full chat section"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Expand</span>
          </button>
          <button
            type="button"
            onClick={() => setIncoming(null)}
            className="rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Dismiss message popup"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Incoming Message Body */}
      <div className="p-3.5 space-y-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span className="font-mono text-[#22D3EE]">New Message</span>
            <span>{incoming.message.time}</span>
          </div>
          <p className="text-xs text-zinc-100 leading-relaxed">
            {incoming.message.text}
          </p>
        </div>

        {sentToast ? (
          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 py-2 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Instant reply sent!</span>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleInstantReply();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write an instant reply..."
              className="flex-1 rounded-full border border-white/15 bg-black/40 px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#22D3EE]"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] disabled:opacity-40 transition-opacity"
              aria-label="Send instant reply"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
