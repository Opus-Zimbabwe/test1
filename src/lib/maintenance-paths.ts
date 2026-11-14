export function maintenanceExempt(path: string, method = "GET") {
  return (
    path === "/admin" ||
    path === "/auth" ||
    path === "/client-admin" ||
    path.startsWith("/client-admin/") ||
    path.startsWith("/_serverFn/") ||
    (path === "/api/public/paynow-result" && method === "POST") ||
    path.startsWith("/assets/") ||
    path.startsWith("/fonts/") ||
    path.startsWith("/images/") ||
    path.startsWith("/cdn/") ||
    /\.(?:png|svg|ico|webmanifest)$/.test(path)
  );
}
