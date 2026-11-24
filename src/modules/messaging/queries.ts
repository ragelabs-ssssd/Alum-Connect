import { asc, desc, eq, inArray, or } from 'drizzle-orm';
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
import type {
  ChatMessageDTO,
  ChatThreadDTO,
  NotificationDTO,
} from '@/types/domain';

/**
 * Lists all direct chat threads involving `userId`, ordered by most recent message.
 */
export async function listMyThreadsQuery(
  userId: string
): Promise<ChatThreadDTO[]> {
  if (!isDatabaseConfigured()) {
    const store = getFallbackStore();
    return store.chatThreads
      .filter((t) => t.studentUserId === userId || t.alumniUserId === userId)
      .map((t) => ({
        ...t,
        messages: [...t.messages],
      }))
      .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
  }

  const db = getDb();
  const threadRows = await db
    .select()
    .from(chatThreads)
    .where(
      or(
        eq(chatThreads.studentUserId, userId),
        eq(chatThreads.alumniUserId, userId)
      )
    )
    .orderBy(desc(chatThreads.lastMessageAt));

  if (threadRows.length === 0) return [];

  const threadIds = threadRows.map((t) => t.id);
  const participantIds = Array.from(
    new Set(threadRows.flatMap((t) => [t.studentUserId, t.alumniUserId]))
  );

  const [msgRows, userRows, stuRows, alumRows] = await Promise.all([
    db
      .select()
      .from(chatMessages)
      .where(inArray(chatMessages.threadId, threadIds))
      .orderBy(asc(chatMessages.createdAt)),
    db.select().from(users).where(inArray(users.id, participantIds)),
    db.select().from(studentProfiles).where(inArray(studentProfiles.userId, participantIds)),
    db.select().from(alumniProfiles).where(inArray(alumniProfiles.userId, participantIds)),
  ]);

  const userMap = new Map(userRows.map((u) => [u.id, u]));
  const stuMap = new Map(stuRows.map((s) => [s.userId, s]));
  const alumMap = new Map(alumRows.map((a) => [a.userId, a]));

  const msgsByThread = new Map<string, ChatMessageDTO[]>();
  for (const m of msgRows) {
    const list = msgsByThread.get(m.threadId) ?? [];
    list.push({
      id: m.id,
      threadId: m.threadId,
      senderUserId: m.senderUserId,
      senderRole: m.senderRole,
      senderName: m.senderName,
      text: m.text,
      attachmentUrl: m.attachmentUrl,
      readAt: m.readAt ? m.readAt.toISOString() : null,
      createdAt: m.createdAt.toISOString(),
    });
    msgsByThread.set(m.threadId, list);
  }

  return threadRows.map((t) => {
    const stu = userMap.get(t.studentUserId);
    const stuProf = stuMap.get(t.studentUserId);
    const alum = userMap.get(t.alumniUserId);
    const alumProf = alumMap.get(t.alumniUserId);

    return {
      id: t.id,
      studentUserId: t.studentUserId,
      studentName: stu?.fullName ?? 'Student',
      studentMeta: stuProf
        ? `${stuProf.academicYear} ${stuProf.branch} • ${stuProf.regNo}`
        : stu?.headline ?? 'ITER Student',
      studentAvatar: stu?.avatarUrl ?? '',
      alumniUserId: t.alumniUserId,
      alumniName: alum?.fullName ?? 'Alumni Mentor',
      alumniMeta: alumProf
        ? `${alumProf.designation} @ ${alumProf.company}`
        : alum?.headline ?? 'ITER Alumnus',
      alumniAvatar: alum?.avatarUrl ?? '',
      topic: t.topic,
      studentUnreadCount: t.studentUnreadCount,
      alumniUnreadCount: t.alumniUnreadCount,
      lastMessageAt: t.lastMessageAt.toISOString(),
      messages: msgsByThread.get(t.id) ?? [],
    };
  });
}

/**
 * Fetches a single chat thread by ID if `userId` is one of its participants.
 */
export async function getThreadByIdQuery(
  threadId: string,
  userId: string
): Promise<ChatThreadDTO | null> {
  if (!isDatabaseConfigured()) {
    const store = getFallbackStore();
    const thread = store.chatThreads.find(
      (t) =>
        t.id === threadId &&
        (t.studentUserId === userId || t.alumniUserId === userId)
    );
    if (!thread) return null;
    return {
      ...thread,
      messages: [...thread.messages],
    };
  }

  const threads = await listMyThreadsQuery(userId);
  return threads.find((t) => t.id === threadId) ?? null;
}

/**
 * Lists priority notifications for `userId`, ordered newest first.
 */
export async function listMyNotificationsQuery(
  userId: string
): Promise<NotificationDTO[]> {
  if (!isDatabaseConfigured()) {
    const store = getFallbackStore();
    return store.notifications
      .filter((n) => n.recipientUserId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.recipientUserId, userId))
    .orderBy(desc(notifications.createdAt));

  return rows.map((n) => ({
    id: n.id,
    recipientUserId: n.recipientUserId,
    actorUserId: n.actorUserId,
    category: n.category,
    title: n.title,
    message: n.message,
    targetSection: n.targetSection,
    targetEntityId: n.targetEntityId,
    actionLabel: n.actionLabel,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  }));
}
