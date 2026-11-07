CREATE OR REPLACE FUNCTION public.update_checkout_paynow_details(
  _order_id uuid,
  _receipt_token text,
  _poll_url text DEFAULT NULL,
  _instructions text DEFAULT NULL,
  _status text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  safe_status text;
BEGIN
  IF _status IS NOT NULL AND _status NOT IN ('pending', 'failed') THEN
    RAISE EXCEPTION 'Invalid checkout status';
  END IF;

  safe_status := COALESCE(_status, 'pending');

  UPDATE public.orders
  SET paynow_poll_url = _poll_url,
      paynow_instructions = _instructions,
      status = safe_status,
      updated_at = now()
  WHERE id = _order_id
    AND receipt_token = _receipt_token;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_checkout_paynow_details(uuid, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_checkout_paynow_details(uuid, text, text, text, text) TO anon, authenticated, service_role;