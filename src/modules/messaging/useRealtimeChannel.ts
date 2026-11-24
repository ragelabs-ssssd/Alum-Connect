'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '@/lib/env';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { ChatMessageDTO, NotificationDTO } from '@/types/domain';

const BROADCAST_CHANNEL_NAME = 'almaconnect-realtime';

export interface RealtimePresenceUser {
  userId: string;
  fullName: string;
  role: string;
  onlineAt: string;
}

export interface RealtimeChatPayload {
  type: 'chat:message';
  threadId: string;
  message: ChatMessageDTO;
  senderUserId: string;
  recipientUserId: string;
  topic?: string;
}

export interface RealtimeNotificationPayload {
  type: 'inbox:notification';
  recipientUserId: string;
  notification: NotificationDTO;
}

export type RealtimeEventEnvelope =
  | RealtimeChatPayload
  | RealtimeNotificationPayload;

export interface UseRealtimeChannelOptions {
  userId?: string | null;
  userName?: string;
  userRole?: string;
  threadId?: string | null;
  onMessage?: (payload: RealtimeChatPayload) => void;
  onNotification?: (payload: RealtimeNotificationPayload) => void;
  onPresenceChange?: (users: RealtimePresenceUser[]) => void;
}

/**
 * Dual-mode realtime hook:
 * - Subscribes to Supabase Realtime private Broadcast channels (`thread:<id>`, `inbox:<userId>`)
 *   + Presence when Supabase credentials are configured.
 * - Seamlessly falls back to browser `BroadcastChannel('almaconnect-realtime')` for instant
 *   cross-tab chat & floating toast alerts in local/demo mode.
 */
export function useRealtimeChannel({
  userId,
  userName = 'AlmaConnect Member',
  userRole = 'student',
  threadId,
  onMessage,
  onNotification,
  onPresenceChange,
}: UseRealtimeChannelOptions) {
  const [onlineUsers, setOnlineUsers] = useState<RealtimePresenceUser[]>([]);
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  const supabaseEnabled = isSupabaseConfigured();
  const mode: 'supabase' | 'broadcast-channel' = supabaseEnabled
    ? 'supabase'
    : 'broadcast-channel';
  const connected = supabaseEnabled ? supabaseConnected : Boolean(userId);

  const onMessageRef = useRef(onMessage);
  const onNotificationRef = useRef(onNotification);
  const onPresenceRef = useRef(onPresenceChange);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const threadChannelRef = useRef<RealtimeChannel | null>(null);
  const inboxChannelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    onPresenceRef.current = onPresenceChange;
  }, [onPresenceChange]);

  // Always attach browser BroadcastChannel as zero-latency local bus / fallback
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') {
      return;
    }

    const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    bcRef.current = bc;

    bc.onmessage = (event: MessageEvent<RealtimeEventEnvelope>) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'chat:message') {
        if (
          (threadId && data.threadId === threadId) ||
          (userId &&
            (data.recipientUserId === userId || data.senderUserId === userId))
        ) {
          onMessageRef.current?.(data);
        }
      } else if (data.type === 'inbox:notification') {
        if (userId && data.recipientUserId === userId) {
          onNotificationRef.current?.(data);
        }
      }
    };

    return () => {
      bcRef.current = null;
      bc.close();
    };
  }, [threadId, userId]);

  // Supabase Realtime Private Broadcast + Presence
  useEffect(() => {
    if (!supabaseEnabled || !userId) return;

    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const channels: RealtimeChannel[] = [];

    const inboxChannel = supabase.channel(`inbox:${userId}`, {
      config: {
        private: true,
        broadcast: { self: false },
        presence: { key: userId },
      },
    });

    inboxChannel
      .on('broadcast', { event: 'chat:message' }, ({ payload }) => {
        if (payload) {
          onMessageRef.current?.(payload as RealtimeChatPayload);
        }
      })
      .on('broadcast', { event: 'inbox:notification' }, ({ payload }) => {
        if (payload) {
          onNotificationRef.current?.(payload as RealtimeNotificationPayload);
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = inboxChannel.presenceState<RealtimePresenceUser>();
        const usersList: RealtimePresenceUser[] = Object.values(state)
          .flat()
          .map((entry) => ({
            userId: entry.userId,
            fullName: entry.fullName,
            role: entry.role,
            onlineAt: entry.onlineAt,
          }));
        setOnlineUsers(usersList);
        onPresenceRef.current?.(usersList);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setSupabaseConnected(true);
          await inboxChannel.track({
            userId,
            fullName: userName,
            role: userRole,
            onlineAt: new Date().toISOString(),
          });
        }
      });

    inboxChannelRef.current = inboxChannel;
    channels.push(inboxChannel);

    if (threadId) {
      const threadChannel = supabase.channel(`thread:${threadId}`, {
        config: {
          private: true,
          broadcast: { self: false },
        },
      });

      threadChannel
        .on('broadcast', { event: 'chat:message' }, ({ payload }) => {
          if (payload) {
            onMessageRef.current?.(payload as RealtimeChatPayload);
          }
        })
        .subscribe();

      threadChannelRef.current = threadChannel;
      channels.push(threadChannel);
    }

    return () => {
      inboxChannelRef.current = null;
      threadChannelRef.current = null;
      setSupabaseConnected(false);
      for (const ch of channels) {
        void supabase.removeChannel(ch);
      }
    };
  }, [supabaseEnabled, threadId, userId, userName, userRole]);

  const publishMessage = useCallback(
    async (payload: Omit<RealtimeChatPayload, 'type'>) => {
      const envelope: RealtimeChatPayload = {
        type: 'chat:message',
        ...payload,
      };

      bcRef.current?.postMessage(envelope);

      if (supabaseEnabled) {
        if (threadChannelRef.current) {
          await threadChannelRef.current.send({
            type: 'broadcast',
            event: 'chat:message',
            payload: envelope,
          });
        }
        const supabase = createSupabaseBrowserClient();
        if (supabase && payload.recipientUserId) {
          const targetInbox = supabase.channel(`inbox:${payload.recipientUserId}`, {
            config: { private: true },
          });
          await targetInbox.send({
            type: 'broadcast',
            event: 'chat:message',
            payload: envelope,
          });
          void supabase.removeChannel(targetInbox);
        }
      }
    },
    [supabaseEnabled]
  );

  const publishNotification = useCallback(
    async (payload: Omit<RealtimeNotificationPayload, 'type'>) => {
      const envelope: RealtimeNotificationPayload = {
        type: 'inbox:notification',
        ...payload,
      };

      bcRef.current?.postMessage(envelope);

      if (supabaseEnabled && payload.recipientUserId) {
        const supabase = createSupabaseBrowserClient();
        if (supabase) {
          const targetInbox = supabase.channel(`inbox:${payload.recipientUserId}`, {
            config: { private: true },
          });
          await targetInbox.send({
            type: 'broadcast',
            event: 'inbox:notification',
            payload: envelope,
          });
          void supabase.removeChannel(targetInbox);
        }
      }
    },
    [supabaseEnabled]
  );

  return {
    mode,
    connected,
    onlineUsers,
    publishMessage,
    publishNotification,
  };
}
