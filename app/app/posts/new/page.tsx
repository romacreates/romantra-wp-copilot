"use client";

import { useState } from "react";
import { useSupabaseAccessToken } from "@/components/useSupabaseAccessToken";

const TEMPLATE: Record<string, (args: {
  title: string;
  client: string;
  roles: string;
  collaborators: string;
  link: string;
  notes: string;
}) => string> = {
  video: ({ title, client, roles, collaborators, link, notes }) => `
<h2>${title}</h2>
<p><strong>Type:</strong> Video</p>
<p><strong>Client:</strong> ${client || "—"}</p>
<p><strong>My roles:</strong> ${roles || "—"}</p>
<p><strong>Collaborators:</strong> ${collaborators || "—"}</p>
<p><strong>Link:</strong> <a href="${link}">${link}</a></p>
<h3>Notes</h3>
<p>${notes || ""}</p>
`.trim(),
  design: ({ title, client, roles, collaborators, link, notes }) => `
<h2>${title}</h2>
<p><strong>Type:</strong> Design</p>
<p><strong>Client:</strong> ${client || "—"}</p>
<p><strong>My roles:</strong> ${roles || "Designer"}</p>
<p><strong>Collaborators:</strong> ${collaborators || "—"}</p>
<p><strong>Link:</strong> <a href="${link}">${link}</a></p>
<h3>Notes</h3>
<p>${notes || ""}</p>
`.trim(),
  photo: ({ title, client, roles, collaborators, link, notes }) => `
<h2>${title}</h2>
<p><strong>Type:</strong> Photography</p>
<p><strong>Client:</strong> ${client || "—"}</p>
<p><strong>My roles:</strong> ${roles || "Photographer"}</p>
<p><strong>Collaborators:</strong> ${collaborators || "—"}</p>
<p><strong>Link:</strong> <a href="${link}">${link}</a></p>
<h3>Notes</h3>
<p>${notes || ""}</p>
`.trim(),
  animation: ({ title, client, roles, collaborators, link, notes }) => `
<h2>${title}</h2>
<p><strong>Type:</strong> Animation</p>
<p><strong>Client:</strong> ${client || "—"}</p>
<p><strong>My roles:</strong> ${roles || "Animator"}</p>
<p><strong>Collaborators:</strong> ${collaborators || "—"}</p>
<p><strong>Link:</strong> <a href="${link}">${link}</a></p>
<h3>Notes</h3>
<p>${notes || ""}</p>
`.trim(),
};

export default function NewPortfolioDraft() {
  const token = useSupabaseAccessToken();
  const [kind, setKind] = useState<"video"|"design"|"photo"|"animation">("video");
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [roles, setRoles] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function createDraft() {
    if (!token) { setMsg("Not logged in."); return; }
    setBusy(true);
    setMsg(null);
    try {
      const content = TEMPLATE[kind]({ title, client, roles, collaborators, link, notes });
      const res = await fetch("/api/wp/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: title || "(untitled)", content, status: "draft" }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      const data = JSON.parse(text);
      setMsg(`Draft created! Post ID: ${data.id} — ${data.link}`);
    } catch (e: any) {
      setMsg(String(e.message ?? e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h2>New Portfolio Draft</h2>
      <p className="small">Creates a WordPress draft post with a structured template.</p>

      <label className="small">Type</label>
      <select value={kind} onChange={(e)=>setKind(e.target.value as any)}>
        <option value="video">Video</option>
        <option value="design">Design</option>
        <option value="photo">Photography</option>
        <option value="animation">Animation</option>
      </select>
      <div style={{ height: 10 }} />
      <label className="small">Title</label>
      <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Project title" />

      <div style={{ height: 10 }} />
      <label className="small">Client</label>
      <input value={client} onChange={(e)=>setClient(e.target.value)} placeholder="Client name (optional)" />

      <div style={{ height: 10 }} />
      <label className="small">My roles (comma-separated)</label>
      <input value={roles} onChange={(e)=>setRoles(e.target.value)} placeholder="e.g., Director, Editor" />

      <div style={{ height: 10 }} />
      <label className="small">Collaborators (comma-separated)</label>
      <input value={collaborators} onChange={(e)=>setCollaborators(e.target.value)} placeholder="e.g., DP: Name, Talent: Name" />

      <div style={{ height: 10 }} />
      <label className="small">Link</label>
      <input value={link} onChange={(e)=>setLink(e.target.value)} placeholder="https://..." />

      <div style={{ height: 10 }} />
      <label className="small">Notes</label>
      <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Any details you want to remember" />

      <div style={{ height: 12 }} />
      <div className="row">
        <button onClick={createDraft} disabled={busy}>{busy ? "Creating..." : "Create Draft Post"}</button>
      </div>

      {msg && <p className="small" style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
