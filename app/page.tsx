import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <h1>Romantra WP Copilot</h1>
      <p className="small">
        Private control panel to update your WordPress.com site with a preview + diff + approve workflow.
      </p>

      <div className="card">
        <h2>Start</h2>
        <p>
          <Link href="/login">Go to Login</Link>
        </p>
        <p className="small">
          After you login, you will be routed to <code>/app</code>.
        </p>
      </div>

      <hr />
      <div className="small">
        Tip: set <code>ADMIN_EMAIL_ALLOWLIST</code> in env vars to restrict access.
      </div>
    </div>
  );
}
