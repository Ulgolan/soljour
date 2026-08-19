/**
 * Pure function first: the shortcut sheet's insertion semantics
 * (Addendum v3 F5), independent of the composer's DOM/state plumbing.
 *
 * - wrap: Bold/Italic — wraps the stored selection; an empty selection
 *   gets the marker pair inserted with the caret left between them.
 * - linePrefix: Heading/Quote/List/Meta/Pencil block — prefixes the
 *   line at the selection start. A fresh line is started first when
 *   the caret isn't already at a line start, so the prefix never lands
 *   mid-sentence. The prefix never carries a trailing marker.
 * - isolatedLine: Scene break — always ends up alone on its own line,
 *   with a newline inserted before and/or after wherever one is
 *   missing.
 */

export type SelectionRange = { start: number; end: number };

export type MarkerInsertion =
  | { kind: "wrap"; before: string; after: string }
  | { kind: "linePrefix"; prefix: string }
  | { kind: "isolatedLine"; text: string };

export function applyMarkerInsertion(
  content: string,
  range: SelectionRange,
  insertion: MarkerInsertion,
): { content: string; caret: number } {
  const { start, end } = range;

  if (insertion.kind === "wrap") {
    const selected = content.slice(start, end);
    const inserted = insertion.before + selected + insertion.after;
    const next = content.slice(0, start) + inserted + content.slice(end);
    const caret = selected.length > 0 ? start + inserted.length : start + insertion.before.length;
    return { content: next, caret };
  }

  if (insertion.kind === "linePrefix") {
    const selected = content.slice(start, end);
    const atLineStart = start === 0 || content[start - 1] === "\n";
    const leading = atLineStart ? "" : "\n";
    const inserted = leading + insertion.prefix + selected;
    const next = content.slice(0, start) + inserted + content.slice(end);
    return { content: next, caret: start + inserted.length };
  }

  // isolatedLine — asymmetric on purpose: the start of the content needs
  // no separator (there's nothing before it to collide with), but the
  // end of the content does — without a trailing newline, whatever the
  // user types next would land on the scene-break's own line and break
  // its "nothing else on the line" contract (F1).
  const beforeChar = content[start - 1];
  const afterChar = content[end];
  const leading = beforeChar === undefined || beforeChar === "\n" ? "" : "\n";
  const trailing = afterChar === "\n" ? "" : "\n";
  const inserted = leading + insertion.text + trailing;
  const next = content.slice(0, start) + inserted + content.slice(end);
  return { content: next, caret: start + inserted.length };
}
