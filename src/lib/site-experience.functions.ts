import { createServerFn } from "@tanstack/react-start";
export const getSiteExperience = createServerFn({ method: "GET" }).handler(async () => {
  const { loadSiteExperience } = await import("./site-experience.server");
  const state = await loadSiteExperience();
  return {
    settings: {
      ...state.settings,
      maintenance: {
        ...state.settings.maintenance,
        enabled:
          process.env["SITE_MAINTENANCE_MODE"] === "true" || state.settings.maintenance.enabled,
      },
    },
    available: state.available,
  };
});
