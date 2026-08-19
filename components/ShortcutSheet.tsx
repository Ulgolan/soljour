"use client";

/**
 * The tappable "markdown ok" hint's destination. Same sheet grammar as
 * export/campaign panels, canon palette, mono labels. Each row inserts
 * its literal marker at the composer's stored selection (wrapping it
 * where non-empty) via the row's own `before`/`after` pair.
 */
export type Shortcut = {
  name: string;
  marker: string;
  before: string;
  after: string;
};

export const SHORTCUTS: Shortcut[] = [
  { name: "Bold", marker: "**", before: "**", after: "**" },
  { name: "Italic", marker: "*", before: "*", after: "*" },
  { name: "Heading", marker: "#", before: "# ", after: "" },
  { name: "Quote", marker: ">", before: "> ", after: "" },
  { name: "List", marker: "-", before: "- ", after: "" },
  { name: "Pencil block", marker: "[", before: "[", after: "" },
  { name: "Meta note", marker: "//", before: "// ", after: "" },
  { name: "Scene break", marker: "---", before: "---", after: "" },
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
