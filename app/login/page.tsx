"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function LoginPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin"|"signup">("signin");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/app");
    });
  }, [router, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Signed up. If email confirmation is enabled, check your inbox. Then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace("/app");
      }
    } catch (err: any) {
      setMsg(err?.message ?? "Login error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <h1>Login</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label className="small">Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
          <div style={{ height: 10 }} />
          <label className="small">Password</label>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
          <div style={{ height: 14 }} />
          <div className="row">
            <button type="submit" disabled={busy}>
              {busy ? "Working..." : (mode === "signin" ? "Sign in" : "Sign up")}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              disabled={busy}
            >
              Switch to {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </div>
          {msg && <p className="small" style={{ marginTop: 12 }}>{msg}</p>}
        </form>
      </div>
      <p className="small" style={{ marginTop: 12 }}>
        After login you’ll be redirected to the private control panel.
      </p>
    </div>
  );
}
