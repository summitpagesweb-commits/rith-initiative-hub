-- Ensure administrator listing works reliably from the dashboard.
-- This migration:
-- 1) recreates get_all_admins with robust joins
-- 2) restores get_admin_invitations definition for consistency
-- 3) grants execute permissions explicitly to authenticated users
-- 4) allows admin/moderator roles to read profiles for admin tooling fallbacks

DROP FUNCTION IF EXISTS public.get_all_admins();

CREATE OR REPLACE FUNCTION public.get_all_admins()
RETURNS TABLE(user_id uuid, email text, full_name text, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin_or_moderator(auth.uid()) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    ur.user_id,
    COALESCE(p.email, au.email)::text AS email,
    NULLIF(p.full_name, '')::text AS full_name,
    ur.created_at
  FROM public.user_roles ur
  LEFT JOIN public.profiles p ON p.user_id = ur.user_id
  LEFT JOIN auth.users au ON au.id = ur.user_id
  WHERE ur.role = 'admin'::public.app_role
  ORDER BY ur.created_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_invitations()
RETURNS TABLE(id uuid, email text, invited_by_email text, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    ai.id,
    ai.email,
    p.email AS invited_by_email,
    ai.created_at
  FROM public.admin_invitations ai
  LEFT JOIN public.profiles p ON p.user_id = ai.invited_by
  ORDER BY ai.created_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_all_admins() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_invitations() TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_admin_by_email(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_admin_by_email(text) TO authenticated;

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_admin_or_moderator(auth.uid()));
