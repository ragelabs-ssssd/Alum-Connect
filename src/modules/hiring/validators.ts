import { z } from 'zod';

export const createJobPostingSchema = z.object({
  roleTitle: z.string().trim().min(3, 'Role title must be at least 3 characters.').max(120),
  company: z.string().trim().min(2, 'Company name is required.').max(100),
  jobType: z.enum(['Full-Time', 'Internship', 'Paid Bounty']),
  location: z.string().trim().min(2, 'Location is required.').max(100),
  compensation: z.string().trim().min(2, 'Compensation is required.').max(80),
  slots: z.coerce.number().int().min(1).max(100).default(1),
  eligibility: z.string().trim().min(2, 'Eligibility criteria is required.').max(200),
  skillsRequired: z
    .array(z.string().trim().min(1).max(60))
    .min(1, 'Select at least one required skill.')
    .max(12),
  jdText: z.string().trim().min(15, 'Job description must be at least 15 characters.').max(3000),
  deadline: z.string().trim().min(4, 'Application deadline is required.').max(40),
});

export type CreateJobPostingInput = z.infer<typeof createJobPostingSchema>;

export const applyToJobSchema = z.object({
  jobId: z.string().trim().min(1, 'Job ID is required.'),
  showcaseProjectId: z.string().trim().min(1).nullable().optional(),
  note: z.string().trim().max(1000).default(''),
});

export type ApplyToJobInput = z.infer<typeof applyToJobSchema>;

export const updateApplicationStatusSchema = z.object({
  applicationId: z.string().trim().min(1, 'Application ID is required.'),
  status: z.enum(['applied', 'under_review', 'shortlisted', 'offered', 'rejected']),
});

export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;

export const requestCoffeeChatSchema = z.object({
  alumniUserId: z.string().trim().min(1, 'Alumni recipient is required.'),
  projectId: z.string().trim().min(1).nullable().optional(),
  topic: z.string().trim().min(5, 'Please include a short discussion topic.').max(300),
});

export type RequestCoffeeChatInput = z.infer<typeof requestCoffeeChatSchema>;

export const respondCoffeeChatSchema = z.object({
  coffeeChatId: z.string().trim().min(1, 'Coffee chat ID is required.'),
  decision: z.enum(['accepted', 'declined']),
});

export type RespondCoffeeChatInput = z.infer<typeof respondCoffeeChatSchema>;
