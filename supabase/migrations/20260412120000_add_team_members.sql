-- Team members for About page and admin management
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  section TEXT NOT NULL CHECK (section IN ('board', 'advisory')),
  photo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view team members"
ON public.team_members
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert team members"
ON public.team_members
FOR INSERT
WITH CHECK (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can update team members"
ON public.team_members
FOR UPDATE
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can delete team members"
ON public.team_members
FOR DELETE
USING (is_admin_or_moderator(auth.uid()));

CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX team_members_section_display_order_idx
ON public.team_members (section, display_order, created_at);

INSERT INTO public.team_members (name, role, section, display_order)
VALUES
  ('Ruchi Gupta', 'President', 'board', 0),
  ('Prabir Mehta', 'Vice President', 'board', 1),
  ('Sumeet Gupta', 'Treasurer', 'board', 2),
  ('Priti Patil', NULL, 'advisory', 0),
  ('Niraj Verma', NULL, 'advisory', 1);
