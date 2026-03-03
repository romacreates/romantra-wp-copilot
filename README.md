# Romantra WP Copilot (MVP)
Private control-panel web app to edit your WordPress.com site with a **preview + diff + approve** workflow.

## What this MVP does
- Supabase Auth login (email/password or magic link)
- List WP pages
- Edit a WP page with:
  - Before/After preview
  - Diff view
  - "Approve & Publish" update
- Create a "Portfolio" draft post from a structured template (video/design/photo/animation)

## Stack
- Next.js (App Router)
- Supabase Auth
- WordPress.com REST API (OAuth2 token, using "Credentials Direct Token Exchange")

---

## Setup (local)

### 1) Create a Supabase project
- Enable Email auth (and optionally Magic Link)
- Add your own email user in Supabase Auth (or sign up from the app)

### 2) Create a WordPress.com Application (for client_id/secret)
WordPress.com → Developer tools → "Apps" (create a new app).  
You need the **Client ID** and **Client Secret**.

### 3) Create a WordPress.com Application Password
WordPress.com → Account Settings → Security → Application Passwords. (If you have 2FA enabled, this is the recommended path.) 

### 4) Create `.env.local`
Copy from `.env.example`.

### 5) Install + run
```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Deploy (Vercel)
- Import repo
- Add same env vars in Vercel project settings
- Deploy

---

## Notes
This is intentionally single-admin for now:
- Use `ADMIN_EMAIL_ALLOWLIST` to restrict access.
