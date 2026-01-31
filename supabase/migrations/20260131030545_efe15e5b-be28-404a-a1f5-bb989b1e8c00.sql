-- Create a table for managing site-wide content like galleries and featured videos
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  content_type TEXT NOT NULL DEFAULT 'gallery', -- 'gallery', 'video', 'image'
  video_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active site content" 
ON public.site_content 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can view all site content" 
ON public.site_content 
FOR SELECT 
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can insert site content" 
ON public.site_content 
FOR INSERT 
WITH CHECK (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can update site content" 
ON public.site_content 
FOR UPDATE 
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can delete site content" 
ON public.site_content 
FOR DELETE 
USING (is_admin_or_moderator(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content sections
INSERT INTO public.site_content (section_key, title, content_type) VALUES
('event_highlights', 'Event Highlights', 'video'),
('home_gallery', 'Moments From Our Events', 'gallery');

-- Create a table for site gallery images (linked to site_content)
CREATE TABLE public.site_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL REFERENCES public.site_content(section_key) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS
ALTER TABLE public.site_gallery ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view gallery images" 
ON public.site_gallery 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert gallery images" 
ON public.site_gallery 
FOR INSERT 
WITH CHECK (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can update gallery images" 
ON public.site_gallery 
FOR UPDATE 
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can delete gallery images" 
ON public.site_gallery 
FOR DELETE 
USING (is_admin_or_moderator(auth.uid()));