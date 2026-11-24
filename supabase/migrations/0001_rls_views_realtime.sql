-- ============================================================================
-- AlmaConnect Migration 0001:
-- Full-Text & Trigram Search, Multi-Tenant RLS, Materialized Views,
-- Supabase Storage Buckets/Policies, and Scoped Realtime Broadcast Triggers
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Immutable helper so weighted tsvector GIN indexes can safely index text[]
CREATE OR REPLACE FUNCTION public.immutable_array_join(arr text[], sep text)
RETURNS text
LANGUAGE sql
IMMUTABLE
STRICT
PARALLEL SAFE
AS $$
  SELECT array_to_string(arr, sep);
$$;

-- ============================================================================
-- 1. Weighted tsvector GIN + pg_trgm Trigram Search Indexes
-- ============================================================================

-- Users (Students, Alumni, Dean)
CREATE INDEX IF NOT EXISTS gin_users_fts
ON public.users
USING gin (
  (
    setweight(to_tsvector('english', coalesce(full_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(headline, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(legacy_code, '')), 'C')
  )
);

CREATE INDEX IF NOT EXISTS gin_users_fullname_trgm
ON public.users
USING gin (full_name gin_trgm_ops);

-- Student Profiles
CREATE INDEX IF NOT EXISTS gin_student_profiles_fts
ON public.student_profiles
USING gin (
  (
    setweight(to_tsvector('english', coalesce(reg_no, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(branch, '') || ' ' || coalesce(academic_year, '')), 'B') ||
    setweight(to_tsvector('english', public.immutable_array_join(tech_stack, ' ')), 'B') ||
    setweight(to_tsvector('english', coalesce(bio, '')), 'C')
  )
);

-- Alumni Profiles
CREATE INDEX IF NOT EXISTS gin_alumni_profiles_fts
ON public.alumni_profiles
USING gin (
  (
    setweight(to_tsvector('english', coalesce(company, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(designation, '')), 'A') ||
    setweight(to_tsvector('english', public.immutable_array_join(tech_stack_expertise, ' ')), 'B') ||
    setweight(to_tsvector('english', coalesce(mentorship_scope, '')), 'C')
  )
);

CREATE INDEX IF NOT EXISTS gin_alumni_company_trgm
ON public.alumni_profiles
USING gin (company gin_trgm_ops);

-- Projects
CREATE INDEX IF NOT EXISTS gin_projects_fts
ON public.projects
USING gin (
  (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(pitch, '')), 'A') ||
    setweight(to_tsvector('english', public.immutable_array_join(tech_stack, ' ')), 'B') ||
    setweight(to_tsvector('english', coalesce(domain, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(short_desc, '') || ' ' || coalesce(detailed_desc, '')), 'C')
  )
);

CREATE INDEX IF NOT EXISTS gin_projects_name_trgm
ON public.projects
USING gin (name gin_trgm_ops);

-- Research Papers
CREATE INDEX IF NOT EXISTS gin_research_papers_fts
ON public.research_papers
USING gin (
  (
    setweight(to_tsvector('english', coalesce(topic, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(domain, '') || ' ' || coalesce(venue, '')), 'B') ||
    setweight(to_tsvector('english', public.immutable_array_join(tech_stack, ' ')), 'B') ||
    setweight(to_tsvector('english', coalesce(abstract, '')), 'C')
  )
);

CREATE INDEX IF NOT EXISTS gin_research_papers_topic_trgm
ON public.research_papers
USING gin (topic gin_trgm_ops);

-- Job Postings
CREATE INDEX IF NOT EXISTS gin_job_postings_fts
ON public.job_postings
USING gin (
  (
    setweight(to_tsvector('english', coalesce(role_title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(company, '')), 'A') ||
    setweight(to_tsvector('english', public.immutable_array_join(skills_required, ' ')), 'B') ||
    setweight(to_tsvector('english', coalesce(location, '') || ' ' || coalesce(jd_text, '')), 'C')
  )
);

CREATE INDEX IF NOT EXISTS gin_job_postings_role_trgm
ON public.job_postings
USING gin (role_title gin_trgm_ops);

-- ============================================================================
-- 2. RLS Helper Functions (Multi-Tenant & Role-Aware)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.current_user_institution_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT institution_id
  FROM public.users
  WHERE id = auth.uid()::text
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text
  FROM public.users
  WHERE id = auth.uid()::text
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_user_verification_status()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT verification_status::text
  FROM public.users
  WHERE id = auth.uid()::text
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_verified_alumni()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()::text
      AND role = 'alumni'
      AND verification_status = 'verified'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_dean()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()::text
      AND role = 'dean'
      AND verification_status = 'verified'
  );
$$;

-- ============================================================================
-- 3. Enable Row-Level Security & Policies Across All Tables
-- ============================================================================

ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_chat_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Institutions
DROP POLICY IF EXISTS institutions_select_tenant ON public.institutions;
CREATE POLICY institutions_select_tenant ON public.institutions
  FOR SELECT TO authenticated
  USING (id = public.current_user_institution_id());

-- Users
DROP POLICY IF EXISTS users_select_tenant ON public.users;
CREATE POLICY users_select_tenant ON public.users
  FOR SELECT TO authenticated
  USING (institution_id = public.current_user_institution_id());

DROP POLICY IF EXISTS users_update_self_or_dean ON public.users;
CREATE POLICY users_update_self_or_dean ON public.users
  FOR UPDATE TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND (id = auth.uid()::text OR public.is_dean())
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND (id = auth.uid()::text OR public.is_dean())
  );

-- Student Profiles
DROP POLICY IF EXISTS student_profiles_select_tenant ON public.student_profiles;
CREATE POLICY student_profiles_select_tenant ON public.student_profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = student_profiles.user_id
        AND u.institution_id = public.current_user_institution_id()
    )
  );

DROP POLICY IF EXISTS student_profiles_upsert_self ON public.student_profiles;
CREATE POLICY student_profiles_upsert_self ON public.student_profiles
  FOR ALL TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

-- Alumni Profiles
DROP POLICY IF EXISTS alumni_profiles_select_tenant ON public.alumni_profiles;
CREATE POLICY alumni_profiles_select_tenant ON public.alumni_profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = alumni_profiles.user_id
        AND u.institution_id = public.current_user_institution_id()
    )
  );

DROP POLICY IF EXISTS alumni_profiles_upsert_self ON public.alumni_profiles;
CREATE POLICY alumni_profiles_upsert_self ON public.alumni_profiles
  FOR ALL TO authenticated
  USING (user_id = auth.uid()::text OR public.is_dean())
  WITH CHECK (user_id = auth.uid()::text OR public.is_dean());

-- Alumni Verification Requests
DROP POLICY IF EXISTS verif_requests_select ON public.alumni_verification_requests;
CREATE POLICY verif_requests_select ON public.alumni_verification_requests
  FOR SELECT TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND (alumni_user_id = auth.uid()::text OR public.is_dean())
  );

DROP POLICY IF EXISTS verif_requests_insert_self ON public.alumni_verification_requests;
CREATE POLICY verif_requests_insert_self ON public.alumni_verification_requests
  FOR INSERT TO authenticated
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND alumni_user_id = auth.uid()::text
  );

DROP POLICY IF EXISTS verif_requests_update_dean ON public.alumni_verification_requests;
CREATE POLICY verif_requests_update_dean ON public.alumni_verification_requests
  FOR UPDATE TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND public.is_dean()
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND public.is_dean()
  );

-- Research Papers
DROP POLICY IF EXISTS papers_select_tenant ON public.research_papers;
CREATE POLICY papers_select_tenant ON public.research_papers
  FOR SELECT TO authenticated
  USING (institution_id = public.current_user_institution_id());

DROP POLICY IF EXISTS papers_insert_author ON public.research_papers;
CREATE POLICY papers_insert_author ON public.research_papers
  FOR INSERT TO authenticated
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND lead_author_id = auth.uid()::text
  );

DROP POLICY IF EXISTS papers_update_author_or_dean ON public.research_papers;
CREATE POLICY papers_update_author_or_dean ON public.research_papers
  FOR UPDATE TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND (lead_author_id = auth.uid()::text OR co_author_id = auth.uid()::text OR public.is_dean())
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND (lead_author_id = auth.uid()::text OR co_author_id = auth.uid()::text OR public.is_dean())
  );

-- Projects
DROP POLICY IF EXISTS projects_select_tenant ON public.projects;
CREATE POLICY projects_select_tenant ON public.projects
  FOR SELECT TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND (status <> 'draft' OR lead_student_id = auth.uid()::text OR public.is_dean())
  );

DROP POLICY IF EXISTS projects_insert_student ON public.projects;
CREATE POLICY projects_insert_student ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND lead_student_id = auth.uid()::text
  );

DROP POLICY IF EXISTS projects_update_owner_or_dean ON public.projects;
CREATE POLICY projects_update_owner_or_dean ON public.projects
  FOR UPDATE TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND (lead_student_id = auth.uid()::text OR public.is_dean())
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND (lead_student_id = auth.uid()::text OR public.is_dean())
  );

-- Project Contributors
DROP POLICY IF EXISTS project_contributors_select_tenant ON public.project_contributors;
CREATE POLICY project_contributors_select_tenant ON public.project_contributors
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_contributors.project_id
        AND p.institution_id = public.current_user_institution_id()
    )
  );

DROP POLICY IF EXISTS project_contributors_write_lead ON public.project_contributors;
CREATE POLICY project_contributors_write_lead ON public.project_contributors
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_contributors.project_id
        AND p.institution_id = public.current_user_institution_id()
        AND (p.lead_student_id = auth.uid()::text OR public.is_dean())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_contributors.project_id
        AND p.institution_id = public.current_user_institution_id()
        AND (p.lead_student_id = auth.uid()::text OR public.is_dean())
    )
  );

-- Endorsements (Public read for vouch verification + tenant read; verified alumni only write)
DROP POLICY IF EXISTS endorsements_select_public_vouch ON public.endorsements;
CREATE POLICY endorsements_select_public_vouch ON public.endorsements
  FOR SELECT TO anon, authenticated
  USING (
    vouch_code IS NOT NULL
    OR institution_id = public.current_user_institution_id()
  );

DROP POLICY IF EXISTS endorsements_insert_verified_alumni ON public.endorsements;
CREATE POLICY endorsements_insert_verified_alumni ON public.endorsements
  FOR INSERT TO authenticated
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND alumni_user_id = auth.uid()::text
    AND public.is_verified_alumni()
  );

DROP POLICY IF EXISTS endorsements_update_author_or_lead ON public.endorsements;
CREATE POLICY endorsements_update_author_or_lead ON public.endorsements
  FOR UPDATE TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND (alumni_user_id = auth.uid()::text OR public.is_dean())
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND (alumni_user_id = auth.uid()::text OR public.is_dean())
  );

-- Social Follows, Post Likes, Saved Items (Self-owned within tenant)
DROP POLICY IF EXISTS social_follows_select_tenant ON public.social_follows;
CREATE POLICY social_follows_select_tenant ON public.social_follows
  FOR SELECT TO authenticated
  USING (institution_id = public.current_user_institution_id());

DROP POLICY IF EXISTS social_follows_write_self ON public.social_follows;
CREATE POLICY social_follows_write_self ON public.social_follows
  FOR ALL TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND follower_user_id = auth.uid()::text
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND follower_user_id = auth.uid()::text
  );

DROP POLICY IF EXISTS post_likes_select_tenant ON public.post_likes;
CREATE POLICY post_likes_select_tenant ON public.post_likes
  FOR SELECT TO authenticated
  USING (institution_id = public.current_user_institution_id());

DROP POLICY IF EXISTS post_likes_write_self ON public.post_likes;
CREATE POLICY post_likes_write_self ON public.post_likes
  FOR ALL TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND user_id = auth.uid()::text
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND user_id = auth.uid()::text
  );

DROP POLICY IF EXISTS saved_items_select_self ON public.saved_items;
CREATE POLICY saved_items_select_self ON public.saved_items
  FOR ALL TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND user_id = auth.uid()::text
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND user_id = auth.uid()::text
  );

-- Job Postings (Verified Alumni can post; all tenant members read)
DROP POLICY IF EXISTS job_postings_select_tenant ON public.job_postings;
CREATE POLICY job_postings_select_tenant ON public.job_postings
  FOR SELECT TO authenticated
  USING (institution_id = public.current_user_institution_id());

DROP POLICY IF EXISTS job_postings_insert_verified_alumni ON public.job_postings;
CREATE POLICY job_postings_insert_verified_alumni ON public.job_postings
  FOR INSERT TO authenticated
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND posted_by_alumni_id = auth.uid()::text
    AND public.is_verified_alumni()
  );

DROP POLICY IF EXISTS job_postings_update_owner_or_dean ON public.job_postings;
CREATE POLICY job_postings_update_owner_or_dean ON public.job_postings
  FOR UPDATE TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND (posted_by_alumni_id = auth.uid()::text OR public.is_dean())
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND (posted_by_alumni_id = auth.uid()::text OR public.is_dean())
  );

-- Job Applications (Student applicant, job-posting alumni, or Dean)
DROP POLICY IF EXISTS job_applications_select_participants ON public.job_applications;
CREATE POLICY job_applications_select_participants ON public.job_applications
  FOR SELECT TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND (
      student_user_id = auth.uid()::text
      OR public.is_dean()
      OR EXISTS (
        SELECT 1 FROM public.job_postings jp
        WHERE jp.id = job_applications.job_id
          AND jp.posted_by_alumni_id = auth.uid()::text
      )
    )
  );

DROP POLICY IF EXISTS job_applications_insert_student ON public.job_applications;
CREATE POLICY job_applications_insert_student ON public.job_applications
  FOR INSERT TO authenticated
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND student_user_id = auth.uid()::text
    AND public.current_user_role() = 'student'
  );

DROP POLICY IF EXISTS job_applications_update_alumni_or_dean ON public.job_applications;
CREATE POLICY job_applications_update_alumni_or_dean ON public.job_applications
  FOR UPDATE TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND (
      public.is_dean()
      OR EXISTS (
        SELECT 1 FROM public.job_postings jp
        WHERE jp.id = job_applications.job_id
          AND jp.posted_by_alumni_id = auth.uid()::text
      )
    )
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND (
      public.is_dean()
      OR EXISTS (
        SELECT 1 FROM public.job_postings jp
        WHERE jp.id = job_applications.job_id
          AND jp.posted_by_alumni_id = auth.uid()::text
      )
    )
  );

-- Coffee Chat Requests
DROP POLICY IF EXISTS coffee_chats_select_participants ON public.coffee_chat_requests;
CREATE POLICY coffee_chats_select_participants ON public.coffee_chat_requests
  FOR SELECT TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND (
      student_user_id = auth.uid()::text
      OR alumni_user_id = auth.uid()::text
      OR public.is_dean()
    )
  );

DROP POLICY IF EXISTS coffee_chats_insert_student ON public.coffee_chat_requests;
CREATE POLICY coffee_chats_insert_student ON public.coffee_chat_requests
  FOR INSERT TO authenticated
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND student_user_id = auth.uid()::text
  );

DROP POLICY IF EXISTS coffee_chats_update_alumni ON public.coffee_chat_requests;
CREATE POLICY coffee_chats_update_alumni ON public.coffee_chat_requests
  FOR UPDATE TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND (alumni_user_id = auth.uid()::text OR public.is_dean())
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND (alumni_user_id = auth.uid()::text OR public.is_dean())
  );

-- Placement Offers (Tenant read; Dean writes/verifies)
DROP POLICY IF EXISTS placement_offers_select_tenant ON public.placement_offers;
CREATE POLICY placement_offers_select_tenant ON public.placement_offers
  FOR SELECT TO authenticated
  USING (institution_id = public.current_user_institution_id());

DROP POLICY IF EXISTS placement_offers_write_dean ON public.placement_offers;
CREATE POLICY placement_offers_write_dean ON public.placement_offers
  FOR ALL TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND public.is_dean()
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND public.is_dean()
  );

-- Institutional Audit Logs
DROP POLICY IF EXISTS audit_logs_select_tenant ON public.institutional_audit_logs;
CREATE POLICY audit_logs_select_tenant ON public.institutional_audit_logs
  FOR SELECT TO authenticated
  USING (institution_id = public.current_user_institution_id());

DROP POLICY IF EXISTS audit_logs_insert_verified_member ON public.institutional_audit_logs;
CREATE POLICY audit_logs_insert_verified_member ON public.institutional_audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND actor_user_id = auth.uid()::text
  );

-- Chat Threads & Chat Messages (Strictly scoped to thread participants)
DROP POLICY IF EXISTS chat_threads_select_participants ON public.chat_threads;
CREATE POLICY chat_threads_select_participants ON public.chat_threads
  FOR ALL TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND (student_user_id = auth.uid()::text OR alumni_user_id = auth.uid()::text)
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND (student_user_id = auth.uid()::text OR alumni_user_id = auth.uid()::text)
  );

DROP POLICY IF EXISTS chat_messages_participants ON public.chat_messages;
CREATE POLICY chat_messages_participants ON public.chat_messages
  FOR ALL TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND EXISTS (
      SELECT 1 FROM public.chat_threads t
      WHERE t.id = chat_messages.thread_id
        AND (t.student_user_id = auth.uid()::text OR t.alumni_user_id = auth.uid()::text)
    )
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
    AND sender_user_id = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM public.chat_threads t
      WHERE t.id = chat_messages.thread_id
        AND (t.student_user_id = auth.uid()::text OR t.alumni_user_id = auth.uid()::text)
    )
  );

-- Notifications (Recipient-scoped)
DROP POLICY IF EXISTS notifications_recipient_rw ON public.notifications;
CREATE POLICY notifications_recipient_rw ON public.notifications
  FOR ALL TO authenticated
  USING (
    institution_id = public.current_user_institution_id()
    AND recipient_user_id = auth.uid()::text
  )
  WITH CHECK (
    institution_id = public.current_user_institution_id()
  );

-- ============================================================================
-- 4. Materialized Views for Dean Analytics & Campus Leaderboards
-- ============================================================================

DROP MATERIALIZED VIEW IF EXISTS public.mv_institution_placement_kpis;
CREATE MATERIALIZED VIEW public.mv_institution_placement_kpis AS
SELECT
  i.id AS institution_id,
  count(DISTINCT CASE WHEN u.role = 'student' THEN u.id END)::int AS total_students,
  count(DISTINCT CASE WHEN u.role = 'alumni' THEN u.id END)::int AS total_alumni,
  count(DISTINCT CASE WHEN u.role = 'alumni' AND u.verification_status = 'verified' THEN u.id END)::int AS verified_alumni_count,
  count(DISTINCT CASE WHEN avr.status = 'pending' THEN avr.id END)::int AS pending_verifications_count,
  count(DISTINCT p.id)::int AS total_projects,
  count(DISTINCT rp.id)::int AS total_papers,
  count(DISTINCT CASE WHEN jp.status = 'open' THEN jp.id END)::int AS total_openings,
  count(DISTINCT po.id)::int AS total_offers,
  count(DISTINCT CASE WHEN po.offer_type = 'PPO' THEN po.id END)::int AS ppo_count,
  count(DISTINCT CASE WHEN po.offer_type = 'Internship' THEN po.id END)::int AS internship_count,
  coalesce(round(avg(sp.cgpa)::numeric, 2), 0)::double precision AS avg_cgpa,
  coalesce(sum(DISTINCT ap.total_exp_years), 0)::int AS total_alum_exp_years,
  coalesce(round(avg(po.package_lpa)::numeric, 2), 0)::double precision AS avg_package_lpa
FROM public.institutions i
LEFT JOIN public.users u ON u.institution_id = i.id
LEFT JOIN public.student_profiles sp ON sp.user_id = u.id
LEFT JOIN public.alumni_profiles ap ON ap.user_id = u.id
LEFT JOIN public.alumni_verification_requests avr ON avr.institution_id = i.id
LEFT JOIN public.projects p ON p.institution_id = i.id
LEFT JOIN public.research_papers rp ON rp.institution_id = i.id
LEFT JOIN public.job_postings jp ON jp.institution_id = i.id
LEFT JOIN public.placement_offers po ON po.institution_id = i.id
GROUP BY i.id;

CREATE UNIQUE INDEX IF NOT EXISTS uidx_mv_institution_placement_kpis
ON public.mv_institution_placement_kpis (institution_id);

DROP MATERIALIZED VIEW IF EXISTS public.mv_campus_leaderboards;
CREATE MATERIALIZED VIEW public.mv_campus_leaderboards AS
SELECT
  u.institution_id,
  'student'::text AS entity_type,
  u.id AS user_id,
  coalesce(u.legacy_code, u.id) AS code,
  u.full_name,
  u.avatar_url,
  sp.branch,
  sp.academic_year,
  sp.cgpa,
  NULL::text AS company,
  NULL::text AS designation,
  NULL::int AS batch_year,
  count(DISTINCT p.id)::int AS projects_count,
  count(DISTINCT rp.id)::int AS papers_count,
  0::int AS openings_count,
  0::int AS endorsed_count,
  (
    (coalesce(sp.cgpa, 8.0) * 10) +
    (count(DISTINCT p.id) * 12) +
    (count(DISTINCT rp.id) * 20)
  )::double precision AS impact_score
FROM public.users u
JOIN public.student_profiles sp ON sp.user_id = u.id
LEFT JOIN public.projects p ON p.lead_student_id = u.id
LEFT JOIN public.research_papers rp ON rp.lead_author_id = u.id OR rp.co_author_id = u.id
WHERE u.role = 'student'
GROUP BY u.institution_id, u.id, u.legacy_code, u.full_name, u.avatar_url, sp.branch, sp.academic_year, sp.cgpa

UNION ALL

SELECT
  u.institution_id,
  'alumni'::text AS entity_type,
  u.id AS user_id,
  coalesce(u.legacy_code, u.id) AS code,
  u.full_name,
  u.avatar_url,
  NULL::text AS branch,
  NULL::text AS academic_year,
  NULL::double precision AS cgpa,
  ap.company,
  ap.designation,
  ap.batch_year,
  0::int AS projects_count,
  0::int AS papers_count,
  count(DISTINCT jp.id)::int AS openings_count,
  count(DISTINCT e.id)::int AS endorsed_count,
  (
    (count(DISTINCT jp.id) * 15) +
    (count(DISTINCT e.id) * 18) +
    (count(DISTINCT cc.id) * 10)
  )::double precision AS impact_score
FROM public.users u
JOIN public.alumni_profiles ap ON ap.user_id = u.id
LEFT JOIN public.job_postings jp ON jp.posted_by_alumni_id = u.id AND jp.status = 'open'
LEFT JOIN public.endorsements e ON e.alumni_user_id = u.id
LEFT JOIN public.coffee_chat_requests cc ON cc.alumni_user_id = u.id AND cc.status = 'accepted'
WHERE u.role = 'alumni' AND u.verification_status = 'verified'
GROUP BY u.institution_id, u.id, u.legacy_code, u.full_name, u.avatar_url, ap.company, ap.designation, ap.batch_year;

CREATE UNIQUE INDEX IF NOT EXISTS uidx_mv_campus_leaderboards
ON public.mv_campus_leaderboards (institution_id, entity_type, user_id);

-- ============================================================================
-- 5. Storage Buckets & Object Policies
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'avatars',
    'avatars',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'project-media',
    'project-media',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4']
  ),
  (
    'research-pdfs',
    'research-pdfs',
    false,
    20971520,
    ARRAY['application/pdf']
  )
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS storage_avatars_public_read ON storage.objects;
CREATE POLICY storage_avatars_public_read ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS storage_avatars_owner_write ON storage.objects;
CREATE POLICY storage_avatars_owner_write ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS storage_project_media_public_read ON storage.objects;
CREATE POLICY storage_project_media_public_read ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-media');

DROP POLICY IF EXISTS storage_project_media_auth_write ON storage.objects;
CREATE POLICY storage_project_media_auth_write ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'project-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS storage_research_pdfs_auth_read ON storage.objects;
CREATE POLICY storage_research_pdfs_auth_read ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'research-pdfs');

DROP POLICY IF EXISTS storage_research_pdfs_owner_write ON storage.objects;
CREATE POLICY storage_research_pdfs_owner_write ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'research-pdfs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- 6. Scoped Realtime Broadcast Trigger Functions
-- ============================================================================

CREATE OR REPLACE FUNCTION public.broadcast_chat_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, realtime
AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'id', NEW.id,
    'threadId', NEW.thread_id,
    'senderUserId', NEW.sender_user_id,
    'senderRole', NEW.sender_role,
    'senderName', NEW.sender_name,
    'text', NEW.text,
    'attachmentUrl', NEW.attachment_url,
    'createdAt', NEW.created_at
  );

  PERFORM realtime.send(
    payload,
    'new_message',
    'thread:' || NEW.thread_id,
    true
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_chat_messages_broadcast ON public.chat_messages;
CREATE TRIGGER trg_chat_messages_broadcast
AFTER INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.broadcast_chat_message();

CREATE OR REPLACE FUNCTION public.broadcast_user_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, realtime
AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'id', NEW.id,
    'recipientUserId', NEW.recipient_user_id,
    'actorUserId', NEW.actor_user_id,
    'category', NEW.category,
    'title', NEW.title,
    'message', NEW.message,
    'targetSection', NEW.target_section,
    'targetEntityId', NEW.target_entity_id,
    'actionLabel', NEW.action_label,
    'isRead', NEW.is_read,
    'createdAt', NEW.created_at
  );

  PERFORM realtime.send(
    payload,
    'new_notification',
    'inbox:' || NEW.recipient_user_id,
    true
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notifications_broadcast ON public.notifications;
CREATE TRIGGER trg_notifications_broadcast
AFTER INSERT ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.broadcast_user_notification();
