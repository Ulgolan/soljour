"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const DEBOUNCE_MS = 500;

export type DraftComposerHandle = {
  getContent: () => string;
  clear: () => void;
};

export const DraftComposer = forwardRef<DraftComposerHandle, { draftKey: string }>(
  function DraftComposer({ draftKey }, ref) {
    const [content, setContent] = useState("");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      setContent(window.localStorage.getItem(draftKey) ?? "");
    }, [draftKey]);

    useImperativeHandle(
      ref,
      () => ({
        getContent: () => content,
        clear: () => {
          setContent("");
          window.localStorage.removeItem(draftKey);
        },
      }),
      [content, draftKey],
    );

    function handleChange(value: string) {
      setContent(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        window.localStorage.setItem(draftKey, value);
      }, DEBOUNCE_MS);
    }

    return (
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        rows={6}
        placeholder="What happened this session?"
        className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
      />
    );
  },
);
