export function isAllowedEmail(email: string | null | undefined): boolean {
  const raw = process.env.ADMIN_EMAIL_ALLOWLIST || "";
  const allow = raw.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  if (allow.length === 0) return true; // if unset, allow any authenticated user
  if (!email) return false;
  return allow.includes(email.toLowerCase());
}
