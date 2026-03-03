"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSupabaseAccessToken } from "@/components/useSupabaseAccessToken";
import { DiffView } from "@/components/DiffView";

type WPPage = {
  id: number;
  title: { rendered: string };
  content: { rendered: string; raw?: string };
  status: string;
  link: string;
  modified: string;
};

export default function PageEditor() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const token = useSupabaseAccessToken();

  const [page, setPage] = useState<WPPage | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState(false);

  const originalTextForDiff = useMemo(() => page?.content?.rendered ?? "", [page]);
  const draftTextForDiff = draftContent;

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setErr(null);
    fetch(`/api/wp/pages/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data: WPPage) => {
        setPage(data);
        setDraftTitle(data.title?.rendered ?? "");
        setDraftContent(data.content?.rendered ?? "");
      })
      .catch((e) => setErr(String(e.message ?? e)))
      .finally(() => setLoading(false));
  }, [id, token]);

  async function approvePublish() {
    if (!token) return;
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch(`/api/wp/pages/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: draftTitle, content: draftContent, status: "publish" }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      const updated = JSON.parse(text) as WPPage;
      setPage(updated);
      alert("Published!");
    } catch (e: any) {
      setErr(String(e.message ?? e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h2>Page Editor</h2>
      {loading && <p className="small">Loading…</p>}
      {err && <p className="small">{err}</p>}
      {page && (
        <>
          <div className="small">
            Live URL: <a href={page.link} target="_blank" rel="noreferrer">{page.link}</a><br/>
            Last modified: {page.modified}
          </div>
          <hr />
          <div className="row">
            <div className="col">
              <label className="small">Title</label>
              <input value={draftTitle} onChange={(e)=>setDraftTitle(e.target.value)} />
              <div style={{ height: 10 }} />
              <label className="small">Content (HTML)</label>
              <textarea value={draftContent} onChange={(e)=>setDraftContent(e.target.value)} />
              <div style={{ height: 12 }} />
              <div className="row">
                <button onClick={() => setShowDiff(!showDiff)} className="secondary">
                  {showDiff ? "Hide Diff" : "Show Diff"}
                </button>
                <button onClick={approvePublish} disabled={saving}>
                  {saving ? "Publishing..." : "Approve & Publish"}
                </button>
              </div>
              <p className="small">
                Tip: This MVP edits the page as HTML. Later we can upgrade to block-based editing or structured fields.
              </p>
            </div>
            <div className="col">
              <h3 style={{ marginTop: 0 }}>Preview (Draft)</h3>
              <div className="card" style={{ borderRadius: 12 }}>
                <div dangerouslySetInnerHTML={{ __html: draftContent }} />
              </div>
              <div style={{ height: 12 }} />
              <h3>Preview (Current Live)</h3>
              <div className="card" style={{ borderRadius: 12 }}>
                <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
              </div>
            </div>
          </div>

          {showDiff && (
            <>
              <hr />
              <h3>Diff (Live → Draft)</h3>
              <DiffView before={originalTextForDiff} after={draftTextForDiff} />
            </>
          )}
        </>
      )}
    </div>
  );
}
