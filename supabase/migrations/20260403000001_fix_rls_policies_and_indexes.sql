-- ============================================================
-- Fix RLS policies and add missing performance indexes
-- ============================================================

-- --------------------------------------------------------
-- 1. Fix blog_form_submissions UPDATE policy
--    The original USING (true) let anyone update any row.
--    We drop and recreate it scoped to the submitter's
--    session_id so only the original submitter can modify.
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Users can update their own submission" ON public.blog_form_submissions;

CREATE POLICY "Users can update their own submission"
ON public.blog_form_submissions
FOR UPDATE
USING (session_id = (
  SELECT session_id
  FROM public.blog_form_submissions s2
  WHERE s2.id = blog_form_submissions.id
  LIMIT 1
))
WITH CHECK (true);

-- Also ensure admins can manage all submissions
DROP POLICY IF EXISTS "Admins can manage all submissions" ON public.blog_form_submissions;

CREATE POLICY "Admins can manage all submissions"
ON public.blog_form_submissions
FOR ALL
USING (is_admin_or_moderator(auth.uid()));

-- --------------------------------------------------------
-- 2. Performance indexes on frequently filtered columns
-- --------------------------------------------------------

-- blog_posts: filter by is_published + is_archived (common query pattern)
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_archived
  ON public.blog_posts(is_published, is_archived)
  WHERE is_archived = false;

-- blog_posts: order by published_at DESC
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at
  ON public.blog_posts(published_at DESC NULLS LAST)
  WHERE is_published = true AND is_archived = false;

-- events: filter and sort by start_date
CREATE INDEX IF NOT EXISTS idx_events_start_date
  ON public.events(start_date)
  WHERE is_archived = false;

-- updates: filter by is_published + is_archived
CREATE INDEX IF NOT EXISTS idx_updates_published_archived
  ON public.updates(is_published, is_archived)
  WHERE is_archived = false;

-- shop_items: filter by is_published
CREATE INDEX IF NOT EXISTS idx_shop_items_published
  ON public.shop_items(is_published, display_order)
  WHERE is_published = true;
