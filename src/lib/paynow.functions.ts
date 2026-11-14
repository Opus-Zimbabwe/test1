// Client-callable server functions for Paynow checkout.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const checkoutSchema = z.object({
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  customer_phone: z.string().min(3),
  method: z.enum(["visa", "zimswitch", "ecocash", "onemoney", "innbucks", "banktransfer"]),
  items: z.array(z.object({ book_id: z.string(), qty: z.number().int().positive() })).min(1),
});

function originFromRequest(req: Request): string {
  try {
    const u = new URL(req.url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return "";
  }
}

export const startCheckout = createServerFn({ method: "POST" })
  .inputValidator((d) => checkoutSchema.parse(d))
  .handler(async ({ data }) => {
    const { assertWebsiteOpen } = await import("./site-experience.server");
    await assertWebsiteOpen();
    const { getRequest } = await import("@tanstack/react-start/server");
    const { createServerPublicSupabase } = await import("./supabase-public.server");
    const request = getRequest();
    const origin = request ? originFromRequest(request) : "";
    const supabase = createServerPublicSupabase();
    const { data: checkout, error: checkoutError } = await supabase.rpc("create_paynow_checkout", {
      _customer_name: data.customer_name,
      _customer_email: data.customer_email,
      _customer_phone: data.customer_phone,
      _method: data.method,
      _items: data.items,
      _origin: origin,
    });
    if (checkoutError) throw new Error(checkoutError.message);

    const order = checkout as any;
    const orderId = String(order.order_id);
    const receiptToken = String(order.receipt_token);
    const receiptUrl = String(order.receipt_url);
    const fields = order.fields as Record<string, string>;

    const paynow = await import("./paynow.server");
    try {
      if (data.method === "ecocash" || data.method === "onemoney" || data.method === "innbucks") {
        const r = await paynow.initiateMobilePayment(fields);
        await supabase.rpc("update_checkout_paynow_details", {
          _order_id: orderId,
          _receipt_token: receiptToken,
          _poll_url: r.pollUrl,
          _instructions: r.instructions,
          _status: "pending",
        });
        return {
          order_id: orderId,
          kind: "mobile" as const,
          instructions: r.instructions,
          receipt_url: receiptUrl,
        };
      }
      const r = await paynow.initiateWebPayment(fields);
      await supabase.rpc("update_checkout_paynow_details", {
        _order_id: orderId,
        _receipt_token: receiptToken,
        _poll_url: r.pollUrl,
        _instructions: undefined,
        _status: "pending",
      });
      return {
        order_id: orderId,
        kind: "web" as const,
        redirect_url: r.browserUrl,
        receipt_url: receiptUrl,
      };
    } catch (e) {
      await supabase.rpc("update_checkout_paynow_details", {
        _order_id: orderId,
        _receipt_token: receiptToken,
        _poll_url: undefined,
        _instructions: undefined,
        _status: "failed",
      });
      throw e;
    }
  });

export const getReceipt = createServerFn({ method: "GET" })
  .inputValidator((d) =>
    z.object({ order_id: z.string().uuid(), token: z.string().min(16) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { assertWebsiteOpen } = await import("./site-experience.server");
    await assertWebsiteOpen();
    const { createServerPublicSupabase } = await import("./supabase-public.server");
    const supabase = createServerPublicSupabase();
    const { data: receipt, error } = await supabase.rpc("get_public_receipt", {
      _order_id: data.order_id,
      _receipt_token: data.token,
    });
    if (error || !receipt) throw new Error(error?.message || "Order not found");
    return receipt as { order: any; downloads: { title: string; url: string | null }[] };
  });
