// Paynow result URL — Paynow POSTs the payment status here.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/paynow-result")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const orderId = url.searchParams.get("order_id");
        if (!orderId) return new Response("Missing order_id", { status: 400 });

        const body = await request.text();
        const { parsePaynowResultBody } = await import("@/lib/paynow.server");
        const { createServerPublicSupabase } = await import("@/lib/supabase-public.server");
        const { fields, fieldValues } = parsePaynowResultBody(body);
        const supabase = createServerPublicSupabase();
        const { error } = await supabase.rpc("apply_paynow_result", {
          _order_id: orderId,
          _fields: fields,
          _field_values: fieldValues,
        });
        if (error) return new Response(error.message, { status: error.message.includes("Invalid hash") ? 401 : 400 });
        return new Response("ok");
      },
      GET: async () => new Response("ok"),
    },
  },
});
