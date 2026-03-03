import { NextResponse } from "next/server";
import { wpFetch, wpSiteDomain } from "@/lib/wp/wpClient";
import { isAllowedEmail } from "@/lib/auth/allowlist";
import { createClient } from "@supabase/supabase-js";
import { requiredEnv } from "@/lib/env";

function supabaseServer() {
  return createClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  );
}

async function getUserEmail(req: Request): Promise<string | null> {
  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/^Bearer (.+)$/);
  if (!m) return null;
  const token = m[1];
  const sb = supabaseServer();
  const { data } = await sb.auth.getUser(token);
  return data.user?.email ?? null;
}

export async function GET(req: Request) {
  const email = await getUserEmail(req);
  if (!isAllowedEmail(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const domain = wpSiteDomain();
  const res = await wpFetch(`/wp/v2/sites/${encodeURIComponent(domain)}/pages?per_page=100`);
  const text = await res.text();
  if (!res.ok) return NextResponse.json({ error: text }, { status: res.status });
  return new NextResponse(text, { status: 200, headers: { "Content-Type": "application/json" } });
}
