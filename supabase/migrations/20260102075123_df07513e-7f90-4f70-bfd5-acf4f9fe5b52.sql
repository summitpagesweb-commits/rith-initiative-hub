-- Create a table for blog post likes
CREATE TABLE public.blog_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, session_id)
);

-- Enable Row Level Security
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can view likes count
CREATE POLICY "Anyone can view likes"
ON public.blog_likes
FOR SELECT
USING (true);

-- Anyone can insert a like (using session_id for anonymous likes)
CREATE POLICY "Anyone can like posts"
ON public.blog_likes
FOR INSERT
WITH CHECK (true);

-- Anyone can remove their like (using session_id)
CREATE POLICY "Anyone can unlike posts"
ON public.blog_likes
FOR DELETE
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_blog_likes_post_id ON public.blog_likes(post_id);
CREATE INDEX idx_blog_likes_session ON public.blog_likes(session_id);