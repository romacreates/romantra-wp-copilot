import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // We keep MVP simple: server routes rely on allowlist,
  // client routes are gated by UI checks.
  // (You can harden this later with cookies/JWT verification.)
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/api/:path*"],
};
