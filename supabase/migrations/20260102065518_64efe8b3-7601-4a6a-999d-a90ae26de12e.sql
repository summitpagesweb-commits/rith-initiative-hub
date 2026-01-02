-- Create a table for storing additional media (photos, videos, links) for events and blog posts
CREATE TABLE public.media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL, -- 'event' or 'blog_post'
  entity_id UUID NOT NULL,
  media_type TEXT NOT NULL, -- 'image', 'video', 'link'
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Create policies for media access
CREATE POLICY "Anyone can view media"
ON public.media
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert media"
ON public.media
FOR INSERT
WITH CHECK (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can update media"
ON public.media
FOR UPDATE
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can delete media"
ON public.media
FOR DELETE
USING (is_admin_or_moderator(auth.uid()));

-- Create index for faster lookups
CREATE INDEX idx_media_entity ON public.media(entity_type, entity_id);