"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabaseAccessToken } from "@/components/useSupabaseAccessToken";

type WPPage = { id: number; title: { rendered: string }; slug: string; status: string; modified: string };

export default function PagesList() {
  const token = useSupabaseAccessToken();
  const [pages, setPages] = useState<WPPage[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch("/api/wp/pages", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then(setPages)
      .catch((e) => setErr(String(e.message ?? e)));
  }, [token]);

  return (
    <div className="card">
      <h2>WordPress Pages</h2>
      {err && <p className="small">{err}</p>}
      {!pages && !err && <p className="small">Loading…</p>}
      {pages && (
        <ul>
          {pages.map(p => (
            <li key={p.id}>
              <Link href={`/app/pages/${p.id}`}>{p.title?.rendered || "(untitled)"}</Link>{" "}
              <span className="small">({p.status}, slug: {p.slug})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
