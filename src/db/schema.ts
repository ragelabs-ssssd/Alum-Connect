import { relations } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// ============================================================================
// Enums
// ============================================================================

export const userRoleEnum = pgEnum('user_role', ['student', 'alumni', 'dean']);

export const verificationStatusEnum = pgEnum('verification_status', [
  'unverified',
  'pending_review',
  'verified',
  'rejected',
]);

export const verificationRequestStatusEnum = pgEnum('verification_request_status', [
  'pending',
  'approved',
  'rejected',
]);

export const buildStatusEnum = pgEnum('build_status', [
  'draft',
  'published',
  'verified',
]);

export const paperStatusEnum = pgEnum('paper_status', [
  'Draft',
  'Under Peer Review',
  'Accepted',
  'Published',
]);

export const collaborationModeEnum = pgEnum('collaboration_mode', [
  'Solo',
  'Group',
]);

export const authorModeEnum = pgEnum('author_mode', ['Solo', 'Dual']);

export const endorsementTargetEnum = pgEnum('endorsement_target', [
  'project',
  'paper',
]);

export const endorsementKindEnum = pgEnum('endorsement_kind', [
  'endorsement',
  'roast',
  'vouch',
]);

export const likeTargetTypeEnum = pgEnum('like_target_type', [
  'project',
  'paper',
]);

export const savedItemTypeEnum = pgEnum('saved_item_type', [
  'project',
  'paper',
  'job',
]);

export const jobTypeEnum = pgEnum('job_type', [
  'Full-Time',
  'Internship',
  'Paid Bounty',
]);

export const jobStatusEnum = pgEnum('job_status', ['open', 'closed']);

export const jobApplicationStatusEnum = pgEnum('job_application_status', [
  'applied',
  'under_review',
  'shortlisted',
  'offered',
  'rejected',
]);

export const coffeeChatStatusEnum = pgEnum('coffee_chat_status', [
  'pending',
  'accepted',
  'declined',
]);

export const offerTypeEnum = pgEnum('offer_type', ['PPO', 'Internship']);

export const offerStatusEnum = pgEnum('offer_status', ['Accepted', 'Joined']);

export const auditCategoryEnum = pgEnum('audit_category', [
  'verification',
  'vouch',
  'job_post',
  'offer_verified',
  'mvp_ship',
]);

export const chatSenderRoleEnum = pgEnum('chat_sender_role', [
  'student',
  'alumni',
]);

// ============================================================================
// 1. Multi-Tenant Institutions & Identity
// ============================================================================

export const institutions = pgTable('institutions', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  allowedStudentDomains: text('allowed_student_domains')
    .array()
    .notNull()
    .default([]),
  regNoPattern: text('reg_no_pattern').notNull(),
  settingsJson: jsonb('settings_json')
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    legacyCode: text('legacy_code'),
    email: text('email').notNull(),
    fullName: text('full_name').notNull(),
    role: userRoleEnum('role').notNull().default('student'),
    verificationStatus: verificationStatusEnum('verification_status')
      .notNull()
      .default('unverified'),
    verifiedBy: text('verified_by'),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    avatarUrl: text('avatar_url').notNull().default(''),
    bannerUrl: text('banner_url').notNull().default(''),
    linkedinUrl: text('linkedin_url'),
    githubHandle: text('github_handle'),
    headline: text('headline').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex('uidx_users_institution_email').on(t.institutionId, t.email),
    index('idx_users_institution_role_status').on(
      t.institutionId,
      t.role,
      t.verificationStatus
    ),
    index('idx_users_legacy_code').on(t.institutionId, t.legacyCode),
  ]
);

export const studentProfiles = pgTable(
  'student_profiles',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    regNo: text('reg_no').notNull(),
    academicYear: text('academic_year').notNull(),
    branch: text('branch').notNull(),
    cgpa: doublePrecision('cgpa').notNull().default(8.5),
    bio: text('bio').notNull().default(''),
    techStack: text('tech_stack').array().notNull().default([]),
    academicsJson: jsonb('academics_json')
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    isResearchAuthor: boolean('is_research_author').notNull().default(false),
  },
  (t) => [
    index('idx_student_profiles_reg_no').on(t.regNo),
    index('idx_student_profiles_branch_year').on(t.branch, t.academicYear),
    index('gin_student_profiles_tech_stack').using('gin', t.techStack),
  ]
);

export const alumniProfiles = pgTable(
  'alumni_profiles',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    batchYear: integer('batch_year').notNull(),
    company: text('company').notNull(),
    workEmail: text('work_email'),
    workEmailVerified: boolean('work_email_verified').notNull().default(false),
    designation: text('designation').notNull(),
    personaCategory: text('persona_category').notNull(),
    mentorshipScope: text('mentorship_scope').notNull().default(''),
    bandwidthShield: text('bandwidth_shield')
      .notNull()
      .default('2 chats / week'),
    totalExpYears: integer('total_exp_years').notNull().default(0),
    techStackExpertise: text('tech_stack_expertise')
      .array()
      .notNull()
      .default([]),
    careerJson: jsonb('career_json')
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    canPostJobs: boolean('can_post_jobs').notNull().default(false),
  },
  (t) => [
    index('idx_alumni_profiles_company_batch').on(t.company, t.batchYear),
    index('gin_alumni_profiles_tech_stack').using('gin', t.techStackExpertise),
  ]
);

export const alumniVerificationRequests = pgTable(
  'alumni_verification_requests',
  {
    id: text('id').primaryKey(),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    alumniUserId: text('alumni_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    linkedinUrl: text('linkedin_url').notNull().default(''),
    workEmail: text('work_email').notNull().default(''),
    company: text('company').notNull(),
    domainAutoMatched: boolean('domain_auto_matched').notNull().default(false),
    proofNote: text('proof_note').notNull().default(''),
    status: verificationRequestStatusEnum('status')
      .notNull()
      .default('pending'),
    reviewedByDeanId: text('reviewed_by_dean_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    reviewNote: text('review_note'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  },
  (t) => [
    index('idx_alumni_verif_inst_status_created').on(
      t.institutionId,
      t.status,
      t.createdAt
    ),
    index('idx_alumni_verif_user').on(t.alumniUserId),
  ]
);

// ============================================================================
// 2. Research Papers, Projects & Endorsements
// ============================================================================

export const researchPapers = pgTable(
  'research_papers',
  {
    id: text('id').primaryKey(),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    code: text('code').notNull(),
    slug: text('slug').notNull(),
    topic: text('topic').notNull(),
    abstract: text('abstract').notNull(),
    domain: text('domain').notNull(),
    venue: text('venue').notNull(),
    status: paperStatusEnum('status').notNull().default('Under Peer Review'),
    authorMode: authorModeEnum('author_mode').notNull().default('Solo'),
    leadAuthorId: text('lead_author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    coAuthorId: text('co_author_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    preprintUrl: text('preprint_url').notNull().default(''),
    pdfStoragePath: text('pdf_storage_path'),
    codeRepoUrl: text('code_repo_url').notNull().default(''),
    liveDemoUrl: text('live_demo_url').notNull().default(''),
    guidanceNeeded: text('guidance_needed').array().notNull().default([]),
    techStack: text('tech_stack').array().notNull().default([]),
    coverImageUrl: text('cover_image_url').notNull().default(''),
    likesCount: integer('likes_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex('uidx_papers_inst_slug').on(t.institutionId, t.slug),
    index('idx_papers_feed_keyset').on(
      t.institutionId,
      t.status,
      t.createdAt,
      t.id
    ),
    index('gin_papers_tech_stack').using('gin', t.techStack),
  ]
);

export const projects = pgTable(
  'projects',
  {
    id: text('id').primaryKey(),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    code: text('code').notNull(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    pitch: text('pitch').notNull(),
    shortDesc: text('short_desc').notNull(),
    detailedDesc: text('detailed_desc').notNull(),
    domain: text('domain').notNull().default('Systems & AI'),
    collaborationMode: collaborationModeEnum('collaboration_mode')
      .notNull()
      .default('Solo'),
    teamSize: integer('team_size').notNull().default(1),
    leadStudentId: text('lead_student_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    academicYears: text('academic_years').notNull(),
    techStack: text('tech_stack').array().notNull().default([]),
    liveUrl: text('live_url').notNull().default(''),
    hostingPlatform: text('hosting_platform').notNull().default('Vercel'),
    githubUrl: text('github_url').notNull().default(''),
    demoVideoUrl: text('demo_video_url').notNull().default(''),
    pitchVideoUrl: text('pitch_video_url').notNull().default(''),
    coverImageUrl: text('cover_image_url').notNull().default(''),
    linkedPaperId: text('linked_paper_id').references(
      () => researchPapers.id,
      { onDelete: 'set null' }
    ),
    status: buildStatusEnum('status').notNull().default('published'),
    likesCount: integer('likes_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex('uidx_projects_inst_slug').on(t.institutionId, t.slug),
    index('idx_projects_feed_keyset').on(
      t.institutionId,
      t.status,
      t.createdAt,
      t.id
    ),
    index('gin_projects_tech_stack').using('gin', t.techStack),
  ]
);

export const projectContributors = pgTable(
  'project_contributors',
  {
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    studentUserId: text('student_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    contributorName: text('contributor_name').notNull(),
    regNo: text('reg_no').notNull(),
    academicYear: text('academic_year').notNull().default(''),
  },
  (t) => [
    primaryKey({
      name: 'pk_project_contributors',
      columns: [t.projectId, t.regNo],
    }),
    index('idx_project_contributors_student').on(t.studentUserId),
  ]
);

export const endorsements = pgTable(
  'endorsements',
  {
    id: text('id').primaryKey(),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    alumniUserId: text('alumni_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    targetType: endorsementTargetEnum('target_type')
      .notNull()
      .default('project'),
    projectId: text('project_id').references(() => projects.id, {
      onDelete: 'cascade',
    }),
    paperId: text('paper_id').references(() => researchPapers.id, {
      onDelete: 'cascade',
    }),
    kind: endorsementKindEnum('kind').notNull().default('endorsement'),
    vouchCode: text('vouch_code').unique(),
    category: text('category').notNull(),
    quote: text('quote').notNull(),
    certifiedSkills: text('certified_skills').array().notNull().default([]),
    rating: integer('rating').notNull().default(5),
    resolved: boolean('resolved').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('idx_endorsements_inst_project').on(t.institutionId, t.projectId),
    index('idx_endorsements_inst_paper').on(t.institutionId, t.paperId),
    index('idx_endorsements_alumni_created').on(t.alumniUserId, t.createdAt),
    index('gin_endorsements_skills').using('gin', t.certifiedSkills),
  ]
);

// ============================================================================
// 3. Social Graph (Follows, Likes, Saved Items)
// ============================================================================

export const socialFollows = pgTable(
  'social_follows',
  {
    followerUserId: text('follower_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    followingUserId: text('following_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({
      name: 'pk_social_follows',
      columns: [t.followerUserId, t.followingUserId],
    }),
    index('idx_social_follows_following').on(t.followingUserId),
  ]
);

export const postLikes = pgTable(
  'post_likes',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    targetType: likeTargetTypeEnum('target_type').notNull(),
    targetId: text('target_id').notNull(),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({
      name: 'pk_post_likes',
      columns: [t.userId, t.targetType, t.targetId],
    }),
    index('idx_post_likes_target').on(t.targetType, t.targetId),
  ]
);

export const savedItems = pgTable(
  'saved_items',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    itemType: savedItemTypeEnum('item_type').notNull(),
    itemId: text('item_id').notNull(),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({
      name: 'pk_saved_items',
      columns: [t.userId, t.itemType, t.itemId],
    }),
    index('idx_saved_items_user_type').on(t.userId, t.itemType),
  ]
);

// ============================================================================
// 4. Jobs, Applications, Coffee Chats, Placements & Institutional Audit
// ============================================================================

export const jobPostings = pgTable(
  'job_postings',
  {
    id: text('id').primaryKey(),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    postedByAlumniId: text('posted_by_alumni_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleTitle: text('role_title').notNull(),
    company: text('company').notNull(),
    jobType: jobTypeEnum('job_type').notNull().default('Full-Time'),
    location: text('location').notNull(),
    compensation: text('compensation').notNull(),
    slots: integer('slots').notNull().default(1),
    eligibility: text('eligibility').notNull(),
    skillsRequired: text('skills_required').array().notNull().default([]),
    jdText: text('jd_text').notNull(),
    deadline: text('deadline').notNull(),
    status: jobStatusEnum('status').notNull().default('open'),
    applicationsCount: integer('applications_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('idx_job_postings_feed_keyset').on(
      t.institutionId,
      t.status,
      t.createdAt,
      t.id
    ),
    index('gin_job_postings_skills').using('gin', t.skillsRequired),
  ]
);

export const jobApplications = pgTable(
  'job_applications',
  {
    id: text('id').primaryKey(),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    jobId: text('job_id')
      .notNull()
      .references(() => jobPostings.id, { onDelete: 'cascade' }),
    studentUserId: text('student_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    showcaseProjectId: text('showcase_project_id').references(
      () => projects.id,
      { onDelete: 'set null' }
    ),
    note: text('note').notNull().default(''),
    status: jobApplicationStatusEnum('status').notNull().default('applied'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex('uidx_job_applications_job_student').on(
      t.jobId,
      t.studentUserId
    ),
    index('idx_job_applications_student').on(t.studentUserId, t.createdAt),
  ]
);

export const coffeeChatRequests = pgTable(
  'coffee_chat_requests',
  {
    id: text('id').primaryKey(),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    studentUserId: text('student_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    alumniUserId: text('alumni_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    projectId: text('project_id').references(() => projects.id, {
      onDelete: 'set null',
    }),
    topic: text('topic').notNull(),
    status: coffeeChatStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('idx_coffee_chats_alumni_status').on(
      t.institutionId,
      t.alumniUserId,
      t.status
    ),
    index('idx_coffee_chats_student_created').on(
      t.institutionId,
      t.studentUserId,
      t.createdAt
    ),
  ]
);

export const placementOffers = pgTable(
  'placement_offers',
  {
    id: text('id').primaryKey(),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    code: text('code').notNull(),
    studentUserId: text('student_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    academicYearBranch: text('academic_year_branch').notNull(),
    company: text('company').notNull(),
    jobRole: text('job_role').notNull(),
    packageStr: text('package_str').notNull(),
    packageLpa: doublePrecision('package_lpa').notNull().default(0),
    offerType: offerTypeEnum('offer_type').notNull(),
    referringAlumniId: text('referring_alumni_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    status: offerStatusEnum('status').notNull().default('Accepted'),
    verifiedByDean: boolean('verified_by_dean').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('idx_placement_offers_inst_type_created').on(
      t.institutionId,
      t.offerType,
      t.createdAt
    ),
    index('idx_placement_offers_student').on(t.studentUserId),
  ]
);

export const institutionalAuditLogs = pgTable(
  'institutional_audit_logs',
  {
    id: text('id').primaryKey(),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    actorUserId: text('actor_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    actorName: text('actor_name').notNull(),
    category: auditCategoryEnum('category').notNull(),
    title: text('title').notNull(),
    impact: text('impact').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('idx_audit_logs_inst_created').on(
      t.institutionId,
      t.createdAt,
      t.id
    ),
  ]
);

// ============================================================================
// 5. Real-Time Messaging & Notifications
// ============================================================================

export const chatThreads = pgTable(
  'chat_threads',
  {
    id: text('id').primaryKey(),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    studentUserId: text('student_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    alumniUserId: text('alumni_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    topic: text('topic').notNull(),
    studentUnreadCount: integer('student_unread_count').notNull().default(0),
    alumniUnreadCount: integer('alumni_unread_count').notNull().default(0),
    lastMessageAt: timestamp('last_message_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('idx_chat_threads_student_last').on(
      t.institutionId,
      t.studentUserId,
      t.lastMessageAt
    ),
    index('idx_chat_threads_alumni_last').on(
      t.institutionId,
      t.alumniUserId,
      t.lastMessageAt
    ),
  ]
);

export const chatMessages = pgTable(
  'chat_messages',
  {
    id: text('id').primaryKey(),
    threadId: text('thread_id')
      .notNull()
      .references(() => chatThreads.id, { onDelete: 'cascade' }),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    senderUserId: text('sender_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    senderRole: chatSenderRoleEnum('sender_role').notNull(),
    senderName: text('sender_name').notNull(),
    text: text('text').notNull(),
    attachmentUrl: text('attachment_url'),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('idx_chat_messages_thread_created').on(
      t.threadId,
      t.createdAt,
      t.id
    ),
  ]
);

export const notifications = pgTable(
  'notifications',
  {
    id: text('id').primaryKey(),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    recipientUserId: text('recipient_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    actorUserId: text('actor_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    category: text('category').notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    targetSection: text('target_section').notNull(),
    targetEntityId: text('target_entity_id'),
    actionLabel: text('action_label').notNull().default('View'),
    isRead: boolean('is_read').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('idx_notifications_recipient_read_created').on(
      t.recipientUserId,
      t.isRead,
      t.createdAt
    ),
  ]
);

// ============================================================================
// Drizzle Relations
// ============================================================================

export const institutionsRelations = relations(institutions, ({ many }) => ({
  users: many(users),
  projects: many(projects),
  researchPapers: many(researchPapers),
  jobPostings: many(jobPostings),
  placementOffers: many(placementOffers),
  verificationRequests: many(alumniVerificationRequests),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [users.institutionId],
    references: [institutions.id],
  }),
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
  alumniProfile: one(alumniProfiles, {
    fields: [users.id],
    references: [alumniProfiles.userId],
  }),
  leadProjects: many(projects),
  leadPapers: many(researchPapers),
  postedJobs: many(jobPostings),
  notifications: many(notifications),
}));

export const studentProfilesRelations = relations(
  studentProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [studentProfiles.userId],
      references: [users.id],
    }),
  })
);

export const alumniProfilesRelations = relations(alumniProfiles, ({ one }) => ({
  user: one(users, {
    fields: [alumniProfiles.userId],
    references: [users.id],
  }),
}));

export const alumniVerificationRequestsRelations = relations(
  alumniVerificationRequests,
  ({ one }) => ({
    institution: one(institutions, {
      fields: [alumniVerificationRequests.institutionId],
      references: [institutions.id],
    }),
    alumni: one(users, {
      fields: [alumniVerificationRequests.alumniUserId],
      references: [users.id],
    }),
    reviewedByDean: one(users, {
      fields: [alumniVerificationRequests.reviewedByDeanId],
      references: [users.id],
    }),
  })
);

export const researchPapersRelations = relations(
  researchPapers,
  ({ one, many }) => ({
    institution: one(institutions, {
      fields: [researchPapers.institutionId],
      references: [institutions.id],
    }),
    leadAuthor: one(users, {
      fields: [researchPapers.leadAuthorId],
      references: [users.id],
    }),
    coAuthor: one(users, {
      fields: [researchPapers.coAuthorId],
      references: [users.id],
    }),
    linkedProjects: many(projects),
    endorsements: many(endorsements),
  })
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [projects.institutionId],
    references: [institutions.id],
  }),
  leadStudent: one(users, {
    fields: [projects.leadStudentId],
    references: [users.id],
  }),
  linkedPaper: one(researchPapers, {
    fields: [projects.linkedPaperId],
    references: [researchPapers.id],
  }),
  contributors: many(projectContributors),
  endorsements: many(endorsements),
}));

export const projectContributorsRelations = relations(
  projectContributors,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectContributors.projectId],
      references: [projects.id],
    }),
    student: one(users, {
      fields: [projectContributors.studentUserId],
      references: [users.id],
    }),
  })
);

export const endorsementsRelations = relations(endorsements, ({ one }) => ({
  institution: one(institutions, {
    fields: [endorsements.institutionId],
    references: [institutions.id],
  }),
  alumni: one(users, {
    fields: [endorsements.alumniUserId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [endorsements.projectId],
    references: [projects.id],
  }),
  paper: one(researchPapers, {
    fields: [endorsements.paperId],
    references: [researchPapers.id],
  }),
}));

export const jobPostingsRelations = relations(jobPostings, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [jobPostings.institutionId],
    references: [institutions.id],
  }),
  postedByAlumni: one(users, {
    fields: [jobPostings.postedByAlumniId],
    references: [users.id],
  }),
  applications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(
  jobApplications,
  ({ one }) => ({
    job: one(jobPostings, {
      fields: [jobApplications.jobId],
      references: [jobPostings.id],
    }),
    student: one(users, {
      fields: [jobApplications.studentUserId],
      references: [users.id],
    }),
    showcaseProject: one(projects, {
      fields: [jobApplications.showcaseProjectId],
      references: [projects.id],
    }),
  })
);

export const coffeeChatRequestsRelations = relations(
  coffeeChatRequests,
  ({ one }) => ({
    student: one(users, {
      fields: [coffeeChatRequests.studentUserId],
      references: [users.id],
    }),
    alumni: one(users, {
      fields: [coffeeChatRequests.alumniUserId],
      references: [users.id],
    }),
    project: one(projects, {
      fields: [coffeeChatRequests.projectId],
      references: [projects.id],
    }),
  })
);

export const placementOffersRelations = relations(
  placementOffers,
  ({ one }) => ({
    student: one(users, {
      fields: [placementOffers.studentUserId],
      references: [users.id],
    }),
    referringAlumni: one(users, {
      fields: [placementOffers.referringAlumniId],
      references: [users.id],
    }),
  })
);

export const chatThreadsRelations = relations(chatThreads, ({ one, many }) => ({
  student: one(users, {
    fields: [chatThreads.studentUserId],
    references: [users.id],
  }),
  alumni: one(users, {
    fields: [chatThreads.alumniUserId],
    references: [users.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  thread: one(chatThreads, {
    fields: [chatMessages.threadId],
    references: [chatThreads.id],
  }),
  sender: one(users, {
    fields: [chatMessages.senderUserId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  recipient: one(users, {
    fields: [notifications.recipientUserId],
    references: [users.id],
  }),
  actor: one(users, {
    fields: [notifications.actorUserId],
    references: [users.id],
  }),
}));
