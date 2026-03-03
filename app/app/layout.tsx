"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      if (!session) router.replace("/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [router, supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <div className="container">
      <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: "0 0 6px 0" }}>Control Panel</h1>
          <div className="small">Logged in as: {email ?? "…"}</div>
        </div>
        <div className="row">
          <Link className="badge" href="/app">Home</Link>
          <Link className="badge" href="/app/pages">Pages</Link>
          <Link className="badge" href="/app/posts/new">New Portfolio Draft</Link>
          <button className="secondary" onClick={signOut}>Sign out</button>
        </div>
      </div>
      <hr />
      {children}
    </div>
  );
}
