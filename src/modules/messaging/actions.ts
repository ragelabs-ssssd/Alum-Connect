'use server';

import { randomUUID } from 'node:crypto';
import { and, eq, isNull, ne, sql } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { getDb, isDatabaseConfigured } from '@/db';
import { getFallbackStore } from '@/db/fallbackStore';
import {
  alumniProfiles,
  chatMessages,
  chatThreads,
  notifications,
  studentProfiles,
  users,
} from '@/db/schema';
import { isAuthError, requireAuth, requireRole } from '@/lib/auth';
import type {
  ActionResult,
  ChatMessageDTO,
  ChatThreadDTO,
} from '@/types/domain';
import {
  markNotificationReadSchema,
  markThreadReadSchema,
  sendChatMessageSchema,
  type MarkNotificationReadInput,
  type MarkThreadReadInput,
  type SendChatMessageInput,
} from './validators';

function safeUpdateTags(tags: string[]): void {
  for (const tag of tags) {
    try {
      updateTag(tag);
    } catch {
      // Safe no-op outside Next.js Server Action context
    }
  }
}

export interface SendChatMessageResult {
  thread: ChatThreadDTO;
  message: ChatMessageDTO;
  recipientUserId: string;
}

/**
 * Sends a direct message in an existing thread or initializes a new thread
 * with `recipientUserId`, updates unread counts, and inserts a recipient notification.
 */
export async function sendChatMessageAction(
  input: SendChatMessageInput
): Promise<ActionResult<SendChatMessageResult>> {
  try {
    const sender = await requireRole(['student', 'alumni']);
    const parsed = sendChatMessageSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        error: parsed.error.issues[0]?.message ?? 'Invalid chat message.',
      };
    }

    const data = parsed.data;
    const senderRole: 'student' | 'alumni' =
      sender.role === 'alumni' ? 'alumni' : 'student';
    const messageId = `msg_${randomUUID().slice(0, 12)}`;
    const now = new Date();
    const nowIso = now.toISOString();

    if (!isDatabaseConfigured()) {
      const store = getFallbackStore();
      let thread = data.threadId
        ? store.chatThreads.find((t) => t.id === data.threadId)
        : undefined;

      if (data.threadId && !thread) {
        return { ok: false, code: 'NOT_FOUND', error: 'Chat thread not found.' };
      }

      if (thread) {
        if (
          thread.studentUserId !== sender.id &&
          thread.alumniUserId !== sender.id
        ) {
          return {
            ok: false,
            code: 'FORBIDDEN',
            error: 'You are not a participant in this conversation.',
          };
        }
      } else if (data.recipientUserId) {
        const recipient = store.users.find((u) => u.id === data.recipientUserId);
        if (!recipient) {
          return { ok: false, code: 'NOT_FOUND', error: 'Recipient user not found.' };
        }
        if (recipient.id === sender.id) {
          return {
            ok: false,
            code: 'VALIDATION_ERROR',
            error: 'Cannot open a direct thread with yourself.',
          };
        }

        const studentUser = senderRole === 'student' ? sender : recipient;
        const alumniUser = senderRole === 'alumni' ? sender : recipient;

        thread = store.chatThreads.find(
          (t) =>
            t.studentUserId === studentUser.id && t.alumniUserId === alumniUser.id
        );

        if (!thread) {
          thread = {
            id: `thread_${randomUUID().slice(0, 10)}`,
            studentUserId: studentUser.id,
            studentName: studentUser.fullName,
            studentMeta: `${studentUser.academicYear ?? 'ITER'} ${
              studentUser.branch ?? 'CSE'
            }${studentUser.regNo ? ` • ${studentUser.regNo}` : ''}`,
            studentAvatar: studentUser.avatarUrl,
            alumniUserId: alumniUser.id,
            alumniName: alumniUser.fullName,
            alumniMeta: `${alumniUser.designation ?? 'Alumni Mentor'} @ ${
              alumniUser.company ?? 'Industry'
            }`,
            alumniAvatar: alumniUser.avatarUrl,
            topic: data.topic?.trim() || 'Direct Mentorship & Referral Chat',
            studentUnreadCount: 0,
            alumniUnreadCount: 0,
            lastMessageAt: nowIso,
            messages: [],
          };
          store.chatThreads.unshift(thread);
        }
      }

      if (!thread) {
        return { ok: false, code: 'NOT_FOUND', error: 'Unable to resolve thread.' };
      }

      const msg: ChatMessageDTO = {
        id: messageId,
        threadId: thread.id,
        senderUserId: sender.id,
        senderRole,
        senderName: sender.fullName,
        text: data.text,
        attachmentUrl: data.attachmentUrl ?? null,
        readAt: null,
        createdAt: nowIso,
      };

      thread.messages.push(msg);
      thread.lastMessageAt = nowIso;
      if (senderRole === 'student') {
        thread.alumniUnreadCount += 1;
      } else {
        thread.studentUnreadCount += 1;
      }

      const recipientUserId =
        sender.id === thread.studentUserId
          ? thread.alumniUserId
          : thread.studentUserId;

      store.notifications.unshift({
        id: `notif_${randomUUID().slice(0, 10)}`,
        recipientUserId,
        actorUserId: sender.id,
        category: 'chat',
        title: `New message from ${sender.fullName}`,
        message: data.text.slice(0, 140),
        targetSection: 'chat',
        targetEntityId: thread.id,
        actionLabel: 'Reply',
        isRead: false,
        createdAt: nowIso,
      });

      safeUpdateTags(['chat', 'notifications']);
      return {
        ok: true,
        data: {
          thread: { ...thread, messages: [...thread.messages] },
          message: msg,
          recipientUserId,
        },
      };
    }

    const db = getDb();
    let threadRow = data.threadId
      ? (
          await db
            .select()
            .from(chatThreads)
            .where(eq(chatThreads.id, data.threadId))
            .limit(1)
        )[0]
      : undefined;

    if (data.threadId && !threadRow) {
      return { ok: false, code: 'NOT_FOUND', error: 'Chat thread not found.' };
    }

    if (threadRow) {
      if (
        threadRow.studentUserId !== sender.id &&
        threadRow.alumniUserId !== sender.id
      ) {
        return {
          ok: false,
          code: 'FORBIDDEN',
          error: 'You are not a participant in this conversation.',
        };
      }
    } else if (data.recipientUserId) {
      const [recipient] = await db
        .select()
        .from(users)
        .where(eq(users.id, data.recipientUserId))
        .limit(1);
      if (!recipient) {
        return { ok: false, code: 'NOT_FOUND', error: 'Recipient user not found.' };
      }

      const studentUserId = senderRole === 'student' ? sender.id : recipient.id;
      const alumniUserId = senderRole === 'alumni' ? sender.id : recipient.id;

      const [existing] = await db
        .select()
        .from(chatThreads)
        .where(
          and(
            eq(chatThreads.studentUserId, studentUserId),
            eq(chatThreads.alumniUserId, alumniUserId)
          )
        )
        .limit(1);

      if (existing) {
        threadRow = existing;
      } else {
        const newThreadId = `thread_${randomUUID().slice(0, 10)}`;
        const [inserted] = await db
          .insert(chatThreads)
          .values({
            id: newThreadId,
            institutionId: sender.institutionId,
            studentUserId,
            alumniUserId,
            topic: data.topic?.trim() || 'Direct Mentorship & Referral Chat',
            studentUnreadCount: 0,
            alumniUnreadCount: 0,
            lastMessageAt: now,
            createdAt: now,
          })
          .returning();
        threadRow = inserted;
      }
    }

    if (!threadRow) {
      return { ok: false, code: 'NOT_FOUND', error: 'Unable to resolve thread.' };
    }

    await db.insert(chatMessages).values({
      id: messageId,
      threadId: threadRow.id,
      institutionId: sender.institutionId,
      senderUserId: sender.id,
      senderRole,
      senderName: sender.fullName,
      text: data.text,
      attachmentUrl: data.attachmentUrl ?? null,
      readAt: null,
      createdAt: now,
    });

    await db
      .update(chatThreads)
      .set({
        lastMessageAt: now,
        alumniUnreadCount:
          senderRole === 'student'
            ? sql`${chatThreads.alumniUnreadCount} + 1`
            : threadRow.alumniUnreadCount,
        studentUnreadCount:
          senderRole === 'alumni'
            ? sql`${chatThreads.studentUnreadCount} + 1`
            : threadRow.studentUnreadCount,
      })
      .where(eq(chatThreads.id, threadRow.id));

    const recipientUserId =
      sender.id === threadRow.studentUserId
        ? threadRow.alumniUserId
        : threadRow.studentUserId;

    await db.insert(notifications).values({
      id: `notif_${randomUUID().slice(0, 10)}`,
      institutionId: sender.institutionId,
      recipientUserId,
      actorUserId: sender.id,
      category: 'chat',
      title: `New message from ${sender.fullName}`,
      message: data.text.slice(0, 140),
      targetSection: 'chat',
      targetEntityId: threadRow.id,
      actionLabel: 'Reply',
      isRead: false,
      createdAt: now,
    });

    const [stuUser, stuProf, alumUser, alumProf, threadMsgs] = await Promise.all([
      db.select().from(users).where(eq(users.id, threadRow.studentUserId)).limit(1),
      db
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, threadRow.studentUserId))
        .limit(1),
      db.select().from(users).where(eq(users.id, threadRow.alumniUserId)).limit(1),
      db
        .select()
        .from(alumniProfiles)
        .where(eq(alumniProfiles.userId, threadRow.alumniUserId))
        .limit(1),
      db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.threadId, threadRow.id)),
    ]);

    const msg: ChatMessageDTO = {
      id: messageId,
      threadId: threadRow.id,
      senderUserId: sender.id,
      senderRole,
      senderName: sender.fullName,
      text: data.text,
      attachmentUrl: data.attachmentUrl ?? null,
      readAt: null,
      createdAt: nowIso,
    };

    const hydratedThread: ChatThreadDTO = {
      id: threadRow.id,
      studentUserId: threadRow.studentUserId,
      studentName: stuUser[0]?.fullName ?? 'Student',
      studentMeta: stuProf[0]
        ? `${stuProf[0].academicYear} ${stuProf[0].branch} • ${stuProf[0].regNo}`
        : 'ITER Student',
      studentAvatar: stuUser[0]?.avatarUrl ?? '',
      alumniUserId: threadRow.alumniUserId,
      alumniName: alumUser[0]?.fullName ?? 'Alumni Mentor',
      alumniMeta: alumProf[0]
        ? `${alumProf[0].designation} @ ${alumProf[0].company}`
        : 'ITER Alumnus',
      alumniAvatar: alumUser[0]?.avatarUrl ?? '',
      topic: threadRow.topic,
      studentUnreadCount:
        senderRole === 'alumni'
          ? threadRow.studentUnreadCount + 1
          : threadRow.studentUnreadCount,
      alumniUnreadCount:
        senderRole === 'student'
          ? threadRow.alumniUnreadCount + 1
          : threadRow.alumniUnreadCount,
      lastMessageAt: nowIso,
      messages: threadMsgs
        .map((m) => ({
          id: m.id,
          threadId: m.threadId,
          senderUserId: m.senderUserId,
          senderRole: m.senderRole,
          senderName: m.senderName,
          text: m.text,
          attachmentUrl: m.attachmentUrl,
          readAt: m.readAt ? m.readAt.toISOString() : null,
          createdAt: m.createdAt.toISOString(),
        }))
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    };

    safeUpdateTags(['chat', 'notifications']);
    return {
      ok: true,
      data: { thread: hydratedThread, message: msg, recipientUserId },
    };
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, code: err.code, error: err.message };
    }
    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      error: err instanceof Error ? err.message : 'Failed to send message.',
    };
  }
}

/**
 * Resets unread count for the authenticated participant in `threadId` and marks
 * incoming messages as read.
 */
export async function markThreadReadAction(
  input: MarkThreadReadInput
): Promise<ActionResult<{ threadId: string }>> {
  try {
    const user = await requireAuth();
    const parsed = markThreadReadSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        error: parsed.error.issues[0]?.message ?? 'Invalid thread ID.',
      };
    }

    const { threadId } = parsed.data;
    const now = new Date();
    const nowIso = now.toISOString();

    if (!isDatabaseConfigured()) {
      const store = getFallbackStore();
      const thread = store.chatThreads.find((t) => t.id === threadId);
      if (!thread) {
        return { ok: false, code: 'NOT_FOUND', error: 'Chat thread not found.' };
      }
      if (thread.studentUserId !== user.id && thread.alumniUserId !== user.id) {
        return { ok: false, code: 'FORBIDDEN', error: 'Not a thread participant.' };
      }

      if (user.id === thread.studentUserId) {
        thread.studentUnreadCount = 0;
      } else {
        thread.alumniUnreadCount = 0;
      }

      for (const msg of thread.messages) {
        if (msg.senderUserId !== user.id && !msg.readAt) {
          msg.readAt = nowIso;
        }
      }

      safeUpdateTags(['chat']);
      return { ok: true, data: { threadId } };
    }

    const db = getDb();
    const [thread] = await db
      .select()
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);

    if (!thread) {
      return { ok: false, code: 'NOT_FOUND', error: 'Chat thread not found.' };
    }
    if (thread.studentUserId !== user.id && thread.alumniUserId !== user.id) {
      return { ok: false, code: 'FORBIDDEN', error: 'Not a thread participant.' };
    }

    await db
      .update(chatThreads)
      .set(
        user.id === thread.studentUserId
          ? { studentUnreadCount: 0 }
          : { alumniUnreadCount: 0 }
      )
      .where(eq(chatThreads.id, threadId));

    await db
      .update(chatMessages)
      .set({ readAt: now })
      .where(
        and(
          eq(chatMessages.threadId, threadId),
          ne(chatMessages.senderUserId, user.id),
          isNull(chatMessages.readAt)
        )
      );

    safeUpdateTags(['chat']);
    return { ok: true, data: { threadId } };
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, code: err.code, error: err.message };
    }
    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      error: err instanceof Error ? err.message : 'Failed to mark thread read.',
    };
  }
}

/**
 * Marks a single notification owned by the authenticated user as read.
 */
export async function markNotificationReadAction(
  input: MarkNotificationReadInput
): Promise<ActionResult<{ notificationId: string }>> {
  try {
    const user = await requireAuth();
    const parsed = markNotificationReadSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        error: parsed.error.issues[0]?.message ?? 'Invalid notification ID.',
      };
    }

    const { notificationId } = parsed.data;

    if (!isDatabaseConfigured()) {
      const store = getFallbackStore();
      const notif = store.notifications.find((n) => n.id === notificationId);
      if (!notif) {
        return { ok: false, code: 'NOT_FOUND', error: 'Notification not found.' };
      }
      if (notif.recipientUserId !== user.id) {
        return { ok: false, code: 'FORBIDDEN', error: 'Cannot modify this notification.' };
      }
      notif.isRead = true;
      safeUpdateTags(['notifications']);
      return { ok: true, data: { notificationId } };
    }

    const db = getDb();
    const [notif] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, notificationId))
      .limit(1);

    if (!notif) {
      return { ok: false, code: 'NOT_FOUND', error: 'Notification not found.' };
    }
    if (notif.recipientUserId !== user.id) {
      return { ok: false, code: 'FORBIDDEN', error: 'Cannot modify this notification.' };
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId));

    safeUpdateTags(['notifications']);
    return { ok: true, data: { notificationId } };
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, code: err.code, error: err.message };
    }
    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      error: err instanceof Error ? err.message : 'Failed to mark notification read.',
    };
  }
}

/**
 * Marks all unread notifications for the authenticated user as read.
 */
export async function markAllNotificationsReadAction(): Promise<
  ActionResult<{ updatedCount: number }>
> {
  try {
    const user = await requireAuth();

    if (!isDatabaseConfigured()) {
      const store = getFallbackStore();
      let updatedCount = 0;
      for (const n of store.notifications) {
        if (n.recipientUserId === user.id && !n.isRead) {
          n.isRead = true;
          updatedCount += 1;
        }
      }
      safeUpdateTags(['notifications']);
      return { ok: true, data: { updatedCount } };
    }

    const db = getDb();
    const updated = await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.recipientUserId, user.id),
          eq(notifications.isRead, false)
        )
      )
      .returning({ id: notifications.id });

    safeUpdateTags(['notifications']);
    return { ok: true, data: { updatedCount: updated.length } };
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, code: err.code, error: err.message };
    }
    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      error: err instanceof Error ? err.message : 'Failed to mark notifications read.',
    };
  }
}
