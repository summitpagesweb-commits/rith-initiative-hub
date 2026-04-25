-- Fix administrator removal for accounts missing profiles,
-- and unblock Auth user deletion by making referencing FKs nullable on delete.

DROP FUNCTION IF EXISTS public.remove_admin_by_email(text);

CREATE OR REPLACE FUNCTION public.remove_admin_by_email(_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _normalized_email text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized: Only admins can remove other admins');
  END IF;

  _normalized_email := lower(trim(_email));

  -- Prefer auth.users lookup so this still works even if a profile row is missing.
  SELECT au.id
  INTO _user_id
  FROM auth.users au
  WHERE lower(au.email) = _normalized_email
  LIMIT 1;

  -- Fallback for legacy rows if needed.
  IF _user_id IS NULL THEN
    SELECT p.user_id
    INTO _user_id
    FROM public.profiles p
    WHERE lower(p.email) = _normalized_email
    LIMIT 1;
  END IF;

  -- If no account exists, try cancelling a pending invitation.
  IF _user_id IS NULL THEN
    DELETE FROM public.admin_invitations WHERE lower(email) = _normalized_email;
    IF FOUND THEN
      RETURN json_build_object('success', true, 'message', 'Invitation cancelled');
    END IF;
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;

  IF _user_id = auth.uid() THEN
    RETURN json_build_object('success', false, 'error', 'Cannot remove your own admin role');
  END IF;

  DELETE FROM public.user_roles WHERE user_id = _user_id AND role = 'admin';
  DELETE FROM public.admin_invitations WHERE lower(email) = _normalized_email;

  RETURN json_build_object('success', true, 'message', 'Admin role removed successfully');
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_admin_by_email(text) TO authenticated;

-- Allow deleting auth users even if they authored content or sent invitations.
ALTER TABLE public.events
  DROP CONSTRAINT IF EXISTS events_created_by_fkey;
ALTER TABLE public.events
  ADD CONSTRAINT events_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_created_by_fkey;
ALTER TABLE public.blog_posts
  ADD CONSTRAINT blog_posts_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.admin_invitations
  DROP CONSTRAINT IF EXISTS admin_invitations_invited_by_fkey;
ALTER TABLE public.admin_invitations
  ADD CONSTRAINT admin_invitations_invited_by_fkey
  FOREIGN KEY (invited_by) REFERENCES auth.users(id) ON DELETE SET NULL;
