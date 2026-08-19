"use client";

import type { MarkerInsertion } from "@/lib/markerInsertion";

/**
 * The tappable "markdown ok" hint's destination. Same sheet grammar as
 * export/campaign panels, canon palette, mono labels.
 *
 * Insertion semantics (Addendum v3 F5): Bold/Italic WRAP the stored
 * selection (empty selection: insert the pair, caret between).
 * Heading/Quote/List/Meta/Pencil block PREFIX the line — a fresh
 * prefixed line is started when the caret is mid-text, never a
 * trailing marker. Scene break is isolated onto its own line.
 */
export type Shortcut = {
  name: string;
  marker: string;
  insertion: MarkerInsertion;
};

export const SHORTCUTS: Shortcut[] = [
  { name: "Bold", marker: "**", insertion: { kind: "wrap", before: "**", after: "**" } },
  { name: "Italic", marker: "*", insertion: { kind: "wrap", before: "*", after: "*" } },
  { name: "Heading", marker: "#", insertion: { kind: "linePrefix", prefix: "# " } },
  { name: "Quote", marker: ">", insertion: { kind: "linePrefix", prefix: "> " } },
  { name: "List", marker: "-", insertion: { kind: "linePrefix", prefix: "- " } },
  { name: "Pencil block", marker: "[", insertion: { kind: "linePrefix", prefix: "[" } },
  { name: "Meta note", marker: "//", insertion: { kind: "linePrefix", prefix: "// " } },
  { name: "Scene break", marker: "---", insertion: { kind: "isolatedLine", text: "---" } },
];

export function ShortcutSheet({
  onPick,
  onClose,
}: {
  onPick: (shortcut: Shortcut) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--sheet-scrim)]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-[18px] bg-[var(--nav-track)] px-5 py-6"
      >
        <div className="font-mono text-[10px] uppercase tracking-[.14em] text-[var(--text-secondary-prose)]">
          Shortcuts
        </div>
        <div className="mt-3 flex flex-col">
          {SHORTCUTS.map((shortcut) => (
            <button
              key={shortcut.name}
              type="button"
              onClick={() => onPick(shortcut)}
              className="flex items-center justify-between rounded-lg px-2.5 py-2.5 text-left"
            >
              <span className="font-serif text-[15px] text-[var(--text-primary)]">
                {shortcut.name}
              </span>
              <span className="font-mono text-[11px] text-[var(--text-meta-line)]">
                {shortcut.marker}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
