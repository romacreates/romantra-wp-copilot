import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Romantra WP Copilot",
  description: "Private control panel to update WordPress with preview + diff + approve."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
