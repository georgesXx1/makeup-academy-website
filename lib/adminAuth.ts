import { NextRequest } from "next/server";

// TODO: Set ADMIN_PASSWORD in your hosting/local environment before launch.
// Temporary development fallback only. Change/remove this before going live.
export const DEVELOPMENT_ADMIN_PASSWORD = "beauty-admin-2026";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || DEVELOPMENT_ADMIN_PASSWORD;
}

export function isAdminRequest(request: NextRequest) {
  const submittedPassword = request.headers.get("x-admin-password");
  return Boolean(submittedPassword && submittedPassword === getAdminPassword());
}
