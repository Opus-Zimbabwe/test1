ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS receipt_token text;

DROP FUNCTION IF EXISTS public.get_paynow_signature(jsonb);

CREATE OR REPLACE FUNCTION public.create_paynow_checkout(
  _customer_name text,
  _customer_email text,
  _customer_phone text,
  _method text,
  _items jsonb,
  _origin text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed_methods text[] := ARRAY['visa','mastercard','zimswitch','ecocash','onemoney','innbucks','banktransfer'];
  integration_id text;
  integration_key text;
  order_items jsonb;
  total numeric(10,2);
  order_id uuid;
  token text := encode(gen_random_bytes(16), 'hex');
  reference text;
  result_url text;
  return_url text;
  fields jsonb;
  field_values text[];
  signature text;
  safe_origin text := trim(trailing '/' from COALESCE(_origin, ''));
BEGIN
  IF _method <> ALL(allowed_methods) THEN
    RAISE EXCEPTION 'Unsupported payment method';
  END IF;

  IF _customer_name IS NULL OR length(trim(_customer_name)) < 1 THEN
    RAISE EXCEPTION 'Customer name is required';
  END IF;

  IF _customer_email IS NULL OR position('@' in _customer_email) <= 1 THEN
    RAISE EXCEPTION 'Valid email is required';
  END IF;

  IF _customer_phone IS NULL OR length(trim(_customer_phone)) < 3 THEN
    RAISE EXCEPTION 'Phone number is required';
  END IF;

  IF safe_origin !~ '^https?://[^/]+$' THEN
    RAISE EXCEPTION 'Invalid checkout origin';
  END IF;

  SELECT paynow_integration_id, paynow_integration_key
    INTO integration_id, integration_key
  FROM public.app_config
  WHERE id = 1
    AND paynow_key_configured = true
    AND paynow_integration_key IS NOT NULL;

  IF integration_id IS NULL OR integration_key IS NULL THEN
    RAISE EXCEPTION 'Paynow is not configured yet. Complete setup at /setup-paynow.';
  END IF;

  WITH requested AS (
    SELECT (item ->> 'book_id')::uuid AS book_id,
           GREATEST((item ->> 'qty')::int, 1) AS qty
    FROM jsonb_array_elements(_items) AS item
  ), priced AS (
    SELECT b.id AS book_id,
           b.title,
           b.price_usd::numeric(10,2) AS price_usd,
           r.qty
    FROM requested r
    JOIN public.books b ON b.id = r.book_id
    WHERE b.active = true
  )
  SELECT jsonb_agg(jsonb_build_object(
           'book_id', book_id,
           'title', title,
           'price_usd', price_usd,
           'qty', qty
         )),
         COALESCE(sum(price_usd * qty), 0)::numeric(10,2)
    INTO order_items, total
  FROM priced;

  IF order_items IS NULL OR jsonb_array_length(order_items) <> jsonb_array_length(_items) THEN
    RAISE EXCEPTION 'One or more books are unavailable';
  END IF;

  INSERT INTO public.orders (
    customer_name,
    customer_email,
    customer_phone,
    items,
    total_usd,
    method,
    status,
    receipt_token
  ) VALUES (
    trim(_customer_name),
    lower(trim(_customer_email)),
    trim(_customer_phone),
    order_items,
    total,
    _method,
    'pending',
    token
  ) RETURNING id INTO order_id;

  reference := 'GC-' || upper(left(order_id::text, 8));
  result_url := safe_origin || '/api/public/paynow-result?order_id=' || order_id::text;
  return_url := safe_origin || '/store/receipt/' || order_id::text || '?token=' || token;

  fields := jsonb_build_object(
    'id', integration_id,
    'reference', reference,
    'amount', to_char(total, 'FM9999999990.00'),
    'additionalinfo', 'Great Couples books (' || _method || ')',
    'returnurl', return_url,
    'resulturl', result_url,
    'authemail', lower(trim(_customer_email)),
    'status', 'Message'
  );

  field_values := ARRAY[
    fields ->> 'id',
    fields ->> 'reference',
    fields ->> 'amount',
    fields ->> 'additionalinfo',
    fields ->> 'returnurl',
    fields ->> 'resulturl',
    fields ->> 'authemail',
    fields ->> 'status'
  ];

  IF _method IN ('ecocash','onemoney','innbucks') THEN
    fields := fields || jsonb_build_object('phone', trim(_customer_phone), 'method', _method);
    field_values := ARRAY[
      fields ->> 'id',
      fields ->> 'reference',
      fields ->> 'amount',
      fields ->> 'additionalinfo',
      fields ->> 'returnurl',
      fields ->> 'resulturl',
      fields ->> 'authemail',
      fields ->> 'phone',
      fields ->> 'method',
      fields ->> 'status'
    ];
  END IF;

  signature := upper(encode(digest(array_to_string(field_values, '') || integration_key, 'sha512'), 'hex'));
  fields := fields || jsonb_build_object('hash', signature);

  UPDATE public.orders
  SET paynow_reference = reference
  WHERE id = order_id;

  RETURN jsonb_build_object(
    'order_id', order_id,
    'receipt_token', token,
    'receipt_url', '/store/receipt/' || order_id::text || '?token=' || token,
    'reference', reference,
    'total_usd', total,
    'method', _method,
    'fields', fields
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_paynow_checkout(text, text, text, text, jsonb, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_paynow_checkout(text, text, text, text, jsonb, text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_public_receipt(_order_id uuid, _receipt_token text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  order_row public.orders%ROWTYPE;
BEGIN
  SELECT * INTO order_row
  FROM public.orders
  WHERE id = _order_id
    AND receipt_token = _receipt_token;

  IF order_row.id IS NULL THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  RETURN jsonb_build_object(
    'order', to_jsonb(order_row) - 'receipt_token',
    'downloads', '[]'::jsonb
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_public_receipt(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_receipt(uuid, text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.apply_paynow_result(_order_id uuid, _fields jsonb, _field_values text[])
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  integration_key text;
  provided_hash text := upper(COALESCE(_fields ->> 'hash', ''));
  expected_hash text;
  status_raw text := lower(COALESCE(_fields ->> 'status', ''));
  normalized_status text;
  order_row public.orders%ROWTYPE;
BEGIN
  SELECT paynow_integration_key INTO integration_key
  FROM public.app_config
  WHERE id = 1
    AND paynow_key_configured = true
    AND paynow_integration_key IS NOT NULL;

  IF integration_key IS NULL THEN
    RAISE EXCEPTION 'Paynow is not configured';
  END IF;

  expected_hash := upper(encode(digest(array_to_string(_field_values, '') || integration_key, 'sha512'), 'hex'));
  IF provided_hash = '' OR provided_hash <> expected_hash THEN
    RAISE EXCEPTION 'Invalid hash';
  END IF;

  normalized_status := CASE
    WHEN status_raw IN ('paid', 'awaiting delivery', 'delivered') THEN 'paid'
    WHEN status_raw = 'cancelled' THEN 'cancelled'
    WHEN status_raw = 'failed' THEN 'failed'
    ELSE 'pending'
  END;

  UPDATE public.orders
  SET status = normalized_status,
      updated_at = now()
  WHERE id = _order_id
  RETURNING * INTO order_row;

  IF order_row.id IS NULL THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF normalized_status = 'paid' THEN
    INSERT INTO public.notifications (kind, title, body, meta)
    VALUES (
      'order_paid',
      'Payment received · $' || order_row.total_usd::text,
      order_row.customer_name || ' (' || order_row.customer_email || ') · ' || order_row.method || ' · Ref ' || COALESCE(order_row.paynow_reference, '—'),
      jsonb_build_object('order_id', order_row.id)
    );
  END IF;

  RETURN jsonb_build_object('ok', true, 'status', normalized_status);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.apply_paynow_result(uuid, jsonb, text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.apply_paynow_result(uuid, jsonb, text[]) TO anon, authenticated, service_role;