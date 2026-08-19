"use client";

import { useState } from "react";
import type { Thread } from "@/lib/markdown";

/**
 * open: empty 15px box, border accent-focus, text entry-body.
 * resolved: accent-filled box with a check, struck text — present, never removed.
 * Born from the last row: a dashed "+" box and a one-line field, committed by Enter or ADD.
 */
export function ThreadList({
  threads,
  onResolve,
  onAdd,
}: {
  threads: Thread[];
  onResolve: (id: string) => void;
  onAdd: (text: string) => void;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-[var(--text-meta-line)]">
        Open threads
      </div>
      {threads.map((thread) =>
        thread.status === "resolved" ? (
          <div key={thread.id} className="flex items-center gap-2 py-1.5">
            <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded bg-[var(--accent)] text-[9px] leading-none text-[var(--canvas)]">
              ✓
            </span>
            <span className="font-serif text-[14px] leading-[1.5] text-[var(--text-inactive-nav)] line-through">
              {thread.text}
            </span>
          </div>
        ) : (
          <button
            key={thread.id}
            type="button"
            onClick={() => onResolve(thread.id)}
            className="flex items-center gap-2 py-1.5 text-left"
          >
            <span className="h-[15px] w-[15px] shrink-0 rounded border border-[var(--input-border-focus)]" />
            <span className="font-serif text-[14px] leading-[1.5] text-[var(--text-entry-body)]">
              {thread.text}
            </span>
          </button>
        ),
      )}
      <div className="flex items-center gap-2 py-1.5">
        <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded border border-dashed border-[var(--input-border-focus)] text-[10px] leading-none text-[var(--text-quiet-button)]">
          +
        </span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
          }}
          placeholder="a loose end, one line…"
          className="flex-1 bg-transparent font-serif text-[14px] leading-[1.5] text-[var(--text-typing)] placeholder:text-[var(--text-quiet-button)] focus:outline-none"
        />
        <button
          type="button"
          onClick={commit}
          className="shrink-0 font-mono text-[10px] uppercase tracking-[.14em] text-[var(--accent)]"
        >
          Add
        </button>
      </div>
    </div>
  );
}
