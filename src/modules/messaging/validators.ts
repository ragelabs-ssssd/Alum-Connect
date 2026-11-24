import { z } from 'zod';

export const sendChatMessageSchema = z
  .object({
    threadId: z.string().trim().min(1).optional(),
    recipientUserId: z.string().trim().min(1).optional(),
    topic: z.string().trim().min(2).max(160).optional(),
    text: z
      .string()
      .trim()
      .min(1, 'Message cannot be empty.')
      .max(2000, 'Message cannot exceed 2000 characters.'),
    attachmentUrl: z.string().url().nullable().optional(),
  })
  .refine((data) => Boolean(data.threadId || data.recipientUserId), {
    message: 'Either threadId or recipientUserId must be provided.',
    path: ['threadId'],
  });

export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>;

export const markThreadReadSchema = z.object({
  threadId: z.string().trim().min(1, 'Thread ID is required.'),
});

export type MarkThreadReadInput = z.infer<typeof markThreadReadSchema>;

export const markNotificationReadSchema = z.object({
  notificationId: z.string().trim().min(1, 'Notification ID is required.'),
});

export type MarkNotificationReadInput = z.infer<typeof markNotificationReadSchema>;
