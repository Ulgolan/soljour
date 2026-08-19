/**
 * The Scribe's Lap — markdown + the writing convention, as one pure
 * pipeline: text in, a render model out. No HTML strings anywhere;
 * components consume the model and emit React nodes directly, so raw
 * HTML in user text is inert by construction, never by a filter.
 *
 * Pipeline order is architecture (Key #4 Amendment A1): a line-level
 * convention pass runs FIRST — "[" pencil, "//" meta, "---" scene
 * break — then baseline markdown parses only the remaining ink lines.
 * Setext headings are disabled: "---" is always and only a scene
 * break, because the convention pass claims every such line before
 * the markdown parser ever sees it.
 */

export type InlineNode =
  | { type: "text"; text: string }
  | { type: "bold"; children: InlineNode[] }
  | { type: "italic"; children: InlineNode[] };

export type InkBlock =
  | { kind: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: InlineNode[] }
  | { kind: "blockquote"; lines: InlineNode[][] }
  | { kind: "list"; ordered: boolean; items: InlineNode[][] }
  | { kind: "paragraph"; children: InlineNode[] };

export type ProseBlock =
  | { kind: "pencil"; lines: string[] }
  | { kind: "meta"; lines: string[] }
  | { kind: "scene-break" }
  | InkBlock;

type LineKind = "pencil" | "meta" | "scene-break" | "ink";

function classifyLine(line: string): LineKind {
  if (line.trim() === "---") return "scene-break";
  if (line.startsWith("[")) return "pencil";
  if (line.startsWith("//")) return "meta";
  return "ink";
}

/** Inline emphasis only — bold/italic, no links (Amendment A2). */
export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  const pattern = /\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|_(.+?)_/;
  let rest = text;
  while (rest.length > 0) {
    const m = pattern.exec(rest);
    if (!m) {
      nodes.push({ type: "text", text: rest });
      break;
    }
    if (m.index > 0) nodes.push({ type: "text", text: rest.slice(0, m.index) });
    if (m[1] !== undefined || m[2] !== undefined) {
      nodes.push({ type: "bold", children: parseInline(m[1] ?? m[2]) });
    } else {
      nodes.push({ type: "italic", children: parseInline(m[3] ?? m[4]) });
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return nodes;
}

const HEADING_RE = /^(#{1,6})\s+(.*)$/;
const QUOTE_RE = /^>\s?(.*)$/;
const UL_RE = /^[-*]\s+(.*)$/;
const OL_RE = /^\d+\.\s+(.*)$/;

/** Baseline markdown over one run of consecutive ink lines. */
function parseInkRun(lines: string[]): InkBlock[] {
  const blocks: InkBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    const heading = HEADING_RE.exec(line);
    if (heading) {
      blocks.push({
        kind: "heading",
        level: heading[1].length as 1 | 2 | 3 | 4 | 5 | 6,
        children: parseInline(heading[2]),
      });
      i++;
      continue;
    }

    const quote = QUOTE_RE.exec(line);
    if (quote) {
      const quoteLines: InlineNode[][] = [];
      while (i < lines.length) {
        const m = QUOTE_RE.exec(lines[i]);
        if (!m) break;
        quoteLines.push(parseInline(m[1]));
        i++;
      }
      blocks.push({ kind: "blockquote", lines: quoteLines });
      continue;
    }

    const ul = UL_RE.exec(line);
    const ol = OL_RE.exec(line);
    if (ul || ol) {
      const ordered = !!ol;
      const itemRe = ordered ? OL_RE : UL_RE;
      const items: InlineNode[][] = [];
      while (i < lines.length) {
        const m = itemRe.exec(lines[i]);
        if (!m) break;
        items.push(parseInline(m[1]));
        i++;
      }
      blocks.push({ kind: "list", ordered, items });
      continue;
    }

    // Paragraph: consume consecutive plain lines (lazy continuation).
    const paraLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      if (l.trim() === "") break;
      if (HEADING_RE.test(l) || QUOTE_RE.test(l) || UL_RE.test(l) || OL_RE.test(l)) break;
      paraLines.push(l);
      i++;
    }
    blocks.push({ kind: "paragraph", children: parseInline(paraLines.join(" ")) });
  }
  return blocks;
}

/** The full pipeline: convention pass first, then markdown on ink runs only. */
export function parseProse(text: string): ProseBlock[] {
  const lines = text.split("\n");
  const blocks: ProseBlock[] = [];
  let i = 0;
  let inkRun: string[] = [];

  function flushInk() {
    if (inkRun.length === 0) return;
    blocks.push(...parseInkRun(inkRun));
    inkRun = [];
  }

  while (i < lines.length) {
    const line = lines[i];
    const kind = classifyLine(line);

    if (kind === "scene-break") {
      flushInk();
      blocks.push({ kind: "scene-break" });
      i++;
      continue;
    }

    if (kind === "pencil") {
      flushInk();
      const group: string[] = [];
      while (i < lines.length && classifyLine(lines[i]) === "pencil") {
        group.push(lines[i].slice(1));
        i++;
      }
      blocks.push({ kind: "pencil", lines: group });
      continue;
    }

    if (kind === "meta") {
      flushInk();
      const group: string[] = [];
      while (i < lines.length && classifyLine(lines[i]) === "meta") {
        group.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ kind: "meta", lines: group });
      continue;
    }

    inkRun.push(line);
    i++;
  }
  flushInk();

  return blocks;
}

function flattenInline(nodes: InlineNode[]): string {
  return nodes.map((n) => (n.type === "text" ? n.text : flattenInline(n.children))).join("");
}

/**
 * Ink-only plain text for the resume snippet (Amendment A4): pencil
 * and meta blocks are skipped entirely, markers stripped, inline
 * markdown flattened. The resume brief quotes the story, never the
 * dice.
 */
export function inkPlainText(text: string): string {
  const blocks = parseProse(text);
  const parts: string[] = [];
  for (const block of blocks) {
    if (block.kind === "pencil" || block.kind === "meta" || block.kind === "scene-break") continue;
    if (block.kind === "heading" || block.kind === "paragraph") {
      parts.push(flattenInline(block.children));
    } else if (block.kind === "blockquote") {
      parts.push(block.lines.map(flattenInline).join(" "));
    } else if (block.kind === "list") {
      parts.push(block.items.map(flattenInline).join(" "));
    }
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}
