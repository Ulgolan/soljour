"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { applyMarkerInsertion, type MarkerInsertion, type SelectionRange } from "@/lib/markerInsertion";

const DEBOUNCE_MS = 500;

function contentStorageKey(draftKey: string) {
  return `${draftKey}:content`;
}

function titleStorageKey(draftKey: string) {
  return `${draftKey}:title`;
}

export type { SelectionRange };

export type DraftComposerHandle = {
  /** Captures the textarea's current selection — call before it can blur. */
  getSelectionRange(): SelectionRange;
  /** Applies a shortcut-sheet marker to the stored `range` (Addendum v3 F5). */
  insertMarker(range: SelectionRange, insertion: MarkerInsertion): void;
};

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
export const DraftComposer = forwardRef<DraftComposerHandle, {
  draftKey: string;
  placeholder: string;
  onSave: (content: string, title: string) => Promise<boolean>;
}>(function DraftComposer({ draftKey, placeholder, onSave }, ref) {
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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pendingCaretRef = useRef<number | null>(null);

  function handleContentChange(value: string) {
    setContent(value);
    if (contentTimer.current) clearTimeout(contentTimer.current);
    contentTimer.current = setTimeout(() => {
      window.localStorage.setItem(contentStorageKey(draftKey), value);
    }, DEBOUNCE_MS);
  }

  // Write-through flush (Commander pull, Lap 5): a debounce timer is a bet
  // that more keystrokes are coming. Blur and tab-hide are exactly the
  // moments that bet can be wrong — connection loss, browser close, and
  // backend outage all funnel through one of these two events, so the
  // pending timer (if any) is cancelled and the current values are
  // written immediately instead of waiting out the remaining debounce.
  const flushDraft = useCallback(() => {
    if (contentTimer.current) {
      clearTimeout(contentTimer.current);
      contentTimer.current = null;
    }
    if (titleTimer.current) {
      clearTimeout(titleTimer.current);
      titleTimer.current = null;
    }
    window.localStorage.setItem(contentStorageKey(draftKey), content);
    window.localStorage.setItem(titleStorageKey(draftKey), title);
  }, [content, title, draftKey]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") flushDraft();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [flushDraft]);

  // Runs after `content` (and the textarea's DOM value) has committed a
  // shortcut-sheet insertion, so the caret lands in the already-updated
  // text rather than racing the pending re-render.
  useEffect(() => {
    if (pendingCaretRef.current === null) return;
    const caret = pendingCaretRef.current;
    pendingCaretRef.current = null;
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(caret, caret);
  }, [content]);

  useImperativeHandle(ref, () => ({
    getSelectionRange() {
      const el = textareaRef.current;
      const fallback = { start: content.length, end: content.length };
      if (!el) return fallback;
      return {
        start: el.selectionStart ?? fallback.start,
        end: el.selectionEnd ?? fallback.end,
      };
    },
    insertMarker(range, insertion) {
      const { content: newContent, caret } = applyMarkerInsertion(content, range, insertion);
      pendingCaretRef.current = caret;
      handleContentChange(newContent);
    },
  }));

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

  // Auto-grow (A4): the textarea's own scrollHeight, not field-sizing
  // (unsupported on Safari) — reset to auto first so shrinking (e.g. a
  // paste undone) is measured correctly, not stuck at its tallest past
  // height. CSS max-h-[45dvh] + overflow-y-auto below caps the visible
  // growth and hands off to internal scroll; the dvh unit keeps the cap
  // keyboard-safe on mobile, where the keyboard eats static vh.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    if (!expanded) {
      el.style.height = "";
      return;
    }
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [content, expanded]);

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
          ref={textareaRef}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            flushDraft();
          }}
          rows={expanded ? 6 : 1}
          placeholder={placeholder}
          className={`max-h-[45dvh] flex-1 resize-none overflow-y-auto rounded-xl border bg-[var(--input-fill)] px-3 py-2.5 font-serif text-[15.5px] leading-[1.6] text-[var(--text-typing)] placeholder:text-[var(--text-quiet-button)] focus:outline-none ${
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
});
