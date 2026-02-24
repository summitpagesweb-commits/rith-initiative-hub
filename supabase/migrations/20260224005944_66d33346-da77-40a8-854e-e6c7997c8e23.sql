
-- Create shop_items table
CREATE TABLE public.shop_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  purchase_link TEXT,
  category TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view published shop items"
ON public.shop_items FOR SELECT
USING (is_published = true AND is_archived = false);

CREATE POLICY "Admins can view all shop items"
ON public.shop_items FOR SELECT
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can insert shop items"
ON public.shop_items FOR INSERT
WITH CHECK (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can update shop items"
ON public.shop_items FOR UPDATE
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can delete shop items"
ON public.shop_items FOR DELETE
USING (is_admin_or_moderator(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_shop_items_updated_at
BEFORE UPDATE ON public.shop_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
