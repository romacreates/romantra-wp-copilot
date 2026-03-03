"use client";

import { diffLines } from "diff";

export function DiffView({ before, after }: { before: string; after: string }) {
  const changes = diffLines(before, after);
  return (
    <pre>
      {changes.map((part, idx) => {
        const prefix = part.added ? "+ " : part.removed ? "- " : "  ";
        const text = part.value.replace(/\n$/, "");
        const lines = text.split("\n");
        return (
          <span key={idx}>
            {lines.map((line, j) => (
              <span key={j}>
                {prefix}{line}{"\n"}
              </span>
            ))}
          </span>
        );
      })}
    </pre>
  );
}
