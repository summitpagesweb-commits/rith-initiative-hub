-- Create table to store email subscribers
CREATE TABLE public.email_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT DEFAULT 'popup'
);

-- Enable RLS
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public signup)
CREATE POLICY "Anyone can subscribe"
ON public.email_subscribers
FOR INSERT
WITH CHECK (true);

-- Only admins can view subscribers
CREATE POLICY "Admins can view subscribers"
ON public.email_subscribers
FOR SELECT
USING (public.is_admin_or_moderator(auth.uid()));

-- Only admins can delete subscribers
CREATE POLICY "Admins can delete subscribers"
ON public.email_subscribers
FOR DELETE
USING (public.is_admin_or_moderator(auth.uid()));