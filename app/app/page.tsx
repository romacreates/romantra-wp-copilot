"use client";

export default function AppHome() {
  return (
    <div className="card">
      <h2>What you can do</h2>
      <ol>
        <li>Edit your WordPress pages with preview + diff + approve.</li>
        <li>Create a portfolio draft post from a template.</li>
      </ol>
      <p className="small">
        If API calls fail, double-check env vars and your WordPress.com App credentials.
      </p>
    </div>
  );
}
