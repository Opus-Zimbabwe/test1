import "./admin-experience.css";
import { useRouterState } from "@tanstack/react-router";
import { useSiteExperience } from "@/lib/use-site-experience";
import { maintenanceExempt } from "@/lib/maintenance-paths";
import type { ReactNode } from "react";
export function SiteAvailabilityGate({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const { settings } = useSiteExperience();
  if (maintenanceExempt(path) || !settings.maintenance.enabled) return children;
  return (
    <main className="gc-maintenance-screen">
      <img src="/images/gc-logo-transparent.png" alt="Great Couples" />
      <h1>We’ll be back soon.</h1>
      <p>{settings.maintenance.message}</p>
      <a href="/admin">Admin sign in</a>
    </main>
  );
}
