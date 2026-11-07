import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getSetupStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { createServerPublicSupabase } = await import("./supabase-public.server");
  const supabase = createServerPublicSupabase();
  const { data, error } = await supabase.rpc("get_setup_status" as never);
  if (error) throw error;
  const row = Array.isArray(data) ? (data[0] as any) : (data as any);
  return {
    integration_id: row?.integration_id ?? "25844",
    paynowConfigured: !!row?.paynow_configured,
    clientAdminActivated: !!row?.client_admin_activated,
    firstLoginCompleted: !!row?.first_login_completed,
  };
});

export const completePaynowSetup = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ integration_key: z.string().min(6) }).parse(d))
  .handler(async ({ data }) => {
    const { createServerPublicSupabase } = await import("./supabase-public.server");
    const supabase = createServerPublicSupabase();
    const { error } = await supabase.rpc("complete_paynow_setup" as never, { _integration_key: data.integration_key } as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const activateClientAdmin = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({
    email: z.string().email(),
    first_login_code: z.string().regex(/^\d{4}$/, "Verification code must be 4 digits"),
  }).parse(d))
  .handler(async ({ data }) => {
    const { createServerPublicSupabase } = await import("./supabase-public.server");
    const supabase = createServerPublicSupabase();
    const { error } = await supabase.rpc("begin_client_admin_activation" as never, {
      _email: data.email,
      _setup_code: data.first_login_code,
    } as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });