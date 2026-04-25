-- Admin invitations table: allows pre-inviting someone before they sign up
CREATE TABLE IF NOT EXISTS public.admin_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT admin_invitations_email_unique UNIQUE (email)
);

ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage invitations"
ON public.admin_invitations FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop existing functions so we can change signatures/return types
DROP FUNCTION IF EXISTS public.add_admin_by_email(text);
DROP FUNCTION IF EXISTS public.remove_admin_by_email(text);
DROP FUNCTION IF EXISTS public.get_admin_invitations();
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Updated add_admin_by_email:
-- If the user already has an account → grant admin role immediately
-- If the user hasn't signed up yet → create an invitation so they get admin on signup
CREATE OR REPLACE FUNCTION public.add_admin_by_email(_email text)
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
    RETURN json_build_object('success', false, 'error', 'Unauthorized: Only admins can add other admins');
  END IF;

  _normalized_email := lower(trim(_email));

  -- Find existing user by email (case-insensitive)
  SELECT user_id INTO _user_id FROM public.profiles WHERE lower(email) = _normalized_email;

  IF _user_id IS NULL THEN
    -- User hasn't signed up yet — store an invitation
    INSERT INTO public.admin_invitations (email, invited_by)
    VALUES (_normalized_email, auth.uid())
    ON CONFLICT (email) DO UPDATE SET invited_by = auth.uid(), created_at = now();

    RETURN json_build_object(
      'success', true,
      'message', 'Invitation saved. When this person creates an account they will automatically receive admin access.'
    );
  END IF;

  IF public.has_role(_user_id, 'admin') THEN
    RETURN json_build_object('success', false, 'error', 'User is already an admin');
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN json_build_object('success', true, 'message', 'Admin role added successfully');
END;
$$;

-- Updated remove_admin_by_email: also cancels pending invitations
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

  SELECT user_id INTO _user_id FROM public.profiles WHERE lower(email) = _normalized_email;

  -- If no account exists, try cancelling a pending invitation
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
  -- Also remove any stale invitation for this email
  DELETE FROM public.admin_invitations WHERE lower(email) = _normalized_email;

  RETURN json_build_object('success', true, 'message', 'Admin role removed successfully');
END;
$$;

-- Function for admins to list pending invitations
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

-- Updated handle_new_user: checks admin_invitations on signup and auto-grants role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _normalized_email text;
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );

  _normalized_email := lower(trim(NEW.email));

  -- Auto-grant admin if this email was pre-invited
  IF EXISTS (SELECT 1 FROM public.admin_invitations WHERE lower(email) = _normalized_email) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    DELETE FROM public.admin_invitations WHERE lower(email) = _normalized_email;
  END IF;

  RETURN NEW;
END;
$$;

-- Recreate the trigger that was dropped above
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
