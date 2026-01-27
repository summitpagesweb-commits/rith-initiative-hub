-- Create table for blog post forms
CREATE TABLE public.blog_post_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  UNIQUE(post_id) -- One form per blog post
);

-- Create table for form fields
CREATE TABLE public.blog_form_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.blog_post_forms(id) ON DELETE CASCADE,
  field_type TEXT NOT NULL, -- 'multiple_choice', 'date', 'text', 'checkbox'
  label TEXT NOT NULL,
  description TEXT,
  options JSONB, -- For multiple choice: ["Option A", "Option B"]
  is_required BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for form submissions (one per session per form)
CREATE TABLE public.blog_form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.blog_post_forms(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}', -- { "field_id": "value" }
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(form_id, session_id) -- One submission per session per form
);

-- Enable RLS on all tables
ALTER TABLE public.blog_post_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_form_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_post_forms
CREATE POLICY "Anyone can view active forms" 
ON public.blog_post_forms 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can view all forms" 
ON public.blog_post_forms 
FOR SELECT 
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can insert forms" 
ON public.blog_post_forms 
FOR INSERT 
WITH CHECK (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can update forms" 
ON public.blog_post_forms 
FOR UPDATE 
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can delete forms" 
ON public.blog_post_forms 
FOR DELETE 
USING (is_admin_or_moderator(auth.uid()));

-- RLS Policies for blog_form_fields
CREATE POLICY "Anyone can view form fields" 
ON public.blog_form_fields 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert fields" 
ON public.blog_form_fields 
FOR INSERT 
WITH CHECK (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can update fields" 
ON public.blog_form_fields 
FOR UPDATE 
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can delete fields" 
ON public.blog_form_fields 
FOR DELETE 
USING (is_admin_or_moderator(auth.uid()));

-- RLS Policies for blog_form_submissions
CREATE POLICY "Anyone can view their own submission" 
ON public.blog_form_submissions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert submissions" 
ON public.blog_form_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own submission" 
ON public.blog_form_submissions 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete submissions" 
ON public.blog_form_submissions 
FOR DELETE 
USING (is_admin_or_moderator(auth.uid()));

-- Add indexes for performance
CREATE INDEX idx_blog_form_fields_form_id ON public.blog_form_fields(form_id);
CREATE INDEX idx_blog_form_submissions_form_id ON public.blog_form_submissions(form_id);
CREATE INDEX idx_blog_form_submissions_session ON public.blog_form_submissions(session_id);