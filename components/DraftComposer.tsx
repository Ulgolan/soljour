"use client";

import { useRef, useState } from "react";

const DEBOUNCE_MS = 500;

function contentStorageKey(draftKey: string) {
  return `${draftKey}:content`;
}

function titleStorageKey(draftKey: string) {
  return `${draftKey}:title`;
}

/**
 * idle: 1 row, no title field, save disabled-styled.
 * focused or has text: 6 rows, optional title field above, save fills accent.
 *
 * Draft buffer law (NN#1): content and title are seeded synchronously from
 * localStorage via useState's lazy initializer, which runs once, before
 * first paint, before any event handler can fire. There is no post-mount
 * hydration effect that reads storage again later — the class of bug where
 * hydration lands after the user has started typing and stomps their input
 * back to the stored (or empty) value is abolished by construction, not
 * guarded against.
 */
export function DraftComposer({
  draftKey,
  placeholder,
  onSave,
}: {
  draftKey: string;
  placeholder: string;
  onSave: (content: string, title: string) => Promise<boolean>;
}) {
  const [content, setContent] = useState(
    () => window.localStorage.getItem(contentStorageKey(draftKey)) ?? "",
  );
  const [title, setTitle] = useState(
    () => window.localStorage.getItem(titleStorageKey(draftKey)) ?? "",
  );
  const [focused, setFocused] = useState(false);
  const [saving, setSaving] = useState(false);
  const contentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleContentChange(value: string) {
    setContent(value);
    if (contentTimer.current) clearTimeout(contentTimer.current);
    contentTimer.current = setTimeout(() => {
      window.localStorage.setItem(contentStorageKey(draftKey), value);
    }, DEBOUNCE_MS);
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (titleTimer.current) clearTimeout(titleTimer.current);
    titleTimer.current = setTimeout(() => {
      window.localStorage.setItem(titleStorageKey(draftKey), value);
    }, DEBOUNCE_MS);
  }

  async function handleSaveClick() {
    if (!content.trim() || saving) return;
    setSaving(true);
    const ok = await onSave(content, title);
    setSaving(false);
    if (ok) {
      setContent("");
      setTitle("");
      window.localStorage.removeItem(contentStorageKey(draftKey));
      window.localStorage.removeItem(titleStorageKey(draftKey));
    }
  }

  const expanded = focused || content.length > 0;
  const canSave = content.trim().length > 0 && !saving;

  return (
    <div className="flex flex-col gap-2">
      {expanded && (
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="TITLE (OPTIONAL)"
          className="border-0 border-b border-[var(--hairline)] bg-transparent px-0 pb-1.5 font-mono text-[11px] uppercase tracking-[.14em] text-[var(--text-quiet-button)] placeholder:text-[var(--text-meta-line)] focus:outline-none"
        />
      )}
      <div className="flex items-end gap-2">
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={expanded ? 6 : 1}
          placeholder={placeholder}
          className={`flex-1 resize-none rounded-xl border bg-[var(--input-fill)] px-3 py-2.5 font-serif text-[15.5px] leading-[1.6] text-[var(--text-typing)] placeholder:text-[var(--text-quiet-button)] focus:outline-none ${
            expanded ? "border-[var(--input-border-focus)]" : "border-[var(--input-border-idle)]"
          }`}
        />
        <button
          type="button"
          onClick={handleSaveClick}
          disabled={!canSave}
          aria-label="Save entry"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
            canSave
              ? "bg-[var(--accent)] text-[var(--canvas)]"
              : "bg-[var(--input-fill)] text-[var(--text-disabled-glyph)]"
          }`}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
