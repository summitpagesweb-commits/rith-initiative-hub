-- Harden subscriber deletion and expose an explicit admin RPC used by the dashboard.
DROP POLICY IF EXISTS "Admins can delete subscribers" ON public.email_subscribers;

CREATE POLICY "Admins can delete subscribers"
ON public.email_subscribers
FOR DELETE
TO authenticated
USING (public.is_admin_or_moderator(auth.uid()));

CREATE OR REPLACE FUNCTION public.remove_email_subscriber(_subscriber_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _deleted_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT public.is_admin_or_moderator(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can remove subscribers';
  END IF;

  DELETE FROM public.email_subscribers
  WHERE id = _subscriber_id
  RETURNING id INTO _deleted_id;

  IF _deleted_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Subscriber not found');
  END IF;

  RETURN jsonb_build_object('success', true, 'deleted_id', _deleted_id);
END;
$$;

REVOKE ALL ON FUNCTION public.remove_email_subscriber(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.remove_email_subscriber(UUID) TO authenticated;
