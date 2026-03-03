import { requiredEnv } from "@/lib/env";

type TokenCache = { token: string; expiresAt: number } | null;
let cache: TokenCache = null;

export async function getWpToken(): Promise<string> {
  const now = Date.now();
  if (cache && cache.expiresAt > now + 30_000) return cache.token;

  const client_id = requiredEnv("WP_CLIENT_ID");
  const client_secret = requiredEnv("WP_CLIENT_SECRET");
  const username = requiredEnv("WP_USERNAME");
  const password = requiredEnv("WP_APP_PASSWORD");

  const body = new URLSearchParams();
  body.set("client_id", client_id);
  body.set("client_secret", client_secret);
  body.set("grant_type", "password");
  body.set("username", username);
  body.set("password", password);

  const res = await fetch("https://public-api.wordpress.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`WP token error: ${res.status} ${t}`);
  }
  const data = await res.json() as { access_token: string; token_type: string; expires_in?: number };
  const expiresIn = (data.expires_in ?? 3600);
  cache = { token: data.access_token, expiresAt: now + expiresIn * 1000 };
  return data.access_token;
}

export function wpSiteDomain(): string {
  return requiredEnv("WP_SITE_DOMAIN");
}

export async function wpFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = await getWpToken();
  const url = `https://public-api.wordpress.com${path}`;
  return fetch(url, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
}
