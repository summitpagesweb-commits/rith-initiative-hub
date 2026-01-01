-- Function to add admin by email (only callable by existing admins)
CREATE OR REPLACE FUNCTION public.add_admin_by_email(_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _profile_id uuid;
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized: Only admins can add other admins');
  END IF;

  -- Find user by email in profiles table
  SELECT user_id INTO _user_id FROM public.profiles WHERE email = _email;
  
  IF _user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not found. They must sign up first.');
  END IF;

  -- Check if already admin
  IF public.has_role(_user_id, 'admin') THEN
    RETURN json_build_object('success', false, 'error', 'User is already an admin');
  END IF;

  -- Add admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN json_build_object('success', true, 'message', 'Admin role added successfully');
END;
$$;

-- Function to remove admin by email (only callable by existing admins)
CREATE OR REPLACE FUNCTION public.remove_admin_by_email(_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized: Only admins can remove other admins');
  END IF;

  -- Find user by email in profiles table
  SELECT user_id INTO _user_id FROM public.profiles WHERE email = _email;
  
  IF _user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;

  -- Prevent removing yourself
  IF _user_id = auth.uid() THEN
    RETURN json_build_object('success', false, 'error', 'Cannot remove your own admin role');
  END IF;

  -- Remove admin role
  DELETE FROM public.user_roles WHERE user_id = _user_id AND role = 'admin';

  RETURN json_build_object('success', true, 'message', 'Admin role removed successfully');
END;
$$;

-- Function to get all admins with their emails
CREATE OR REPLACE FUNCTION public.get_all_admins()
RETURNS TABLE(user_id uuid, email text, full_name text, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT ur.user_id, p.email, p.full_name, ur.created_at
  FROM public.user_roles ur
  JOIN public.profiles p ON p.user_id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at;
END;
$$;

-- Trigger function to auto-assign admin to specific email
CREATE OR REPLACE FUNCTION public.auto_assign_initial_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Auto-assign admin role to the initial admin email
  IF NEW.email = 'summitpages.web@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users for auto-admin assignment
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_initial_admin();

-- Add unique constraint if not exists (for ON CONFLICT to work)
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);