-- Create updates table for the "Latest Updates" section on the homepage
CREATE TABLE public.updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'image', -- 'image', 'video', or 'link'
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;

-- Anyone can view published updates
CREATE POLICY "Anyone can view published updates"
ON public.updates
FOR SELECT
USING (is_published = true AND is_archived = false);

-- Admins can view all updates
CREATE POLICY "Admins can view all updates"
ON public.updates
FOR SELECT
USING (is_admin_or_moderator(auth.uid()));

-- Admins can insert updates
CREATE POLICY "Admins can insert updates"
ON public.updates
FOR INSERT
WITH CHECK (is_admin_or_moderator(auth.uid()));

-- Admins can update updates
CREATE POLICY "Admins can update updates"
ON public.updates
FOR UPDATE
USING (is_admin_or_moderator(auth.uid()));

-- Admins can delete updates
CREATE POLICY "Admins can delete updates"
ON public.updates
FOR DELETE
USING (is_admin_or_moderator(auth.uid()));

-- Add updated_at trigger
CREATE TRIGGER update_updates_updated_at
BEFORE UPDATE ON public.updates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();