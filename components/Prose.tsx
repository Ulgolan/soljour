import {
  parseProse,
  type InkBlock,
  type InlineNode,
  type ProseBlock,
} from "@/lib/prose";

/**
 * Renders the render model from `parseProse` to React nodes directly —
 * never through an HTML string, so raw HTML in entry text is inert by
 * construction. Ink (Spectral) is the river as it reads today; pencil
 * and meta are the machine voice (IBM Plex Mono) per the two-voice
 * type law.
 */
export function Prose({ content }: { content: string }) {
  const blocks = parseProse(content);
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block, i) => (
        <ProseBlockView key={i} block={block} />
      ))}
    </div>
  );
}

function ProseBlockView({ block }: { block: ProseBlock }) {
  switch (block.kind) {
    case "scene-break":
      return <hr className="my-2 border-0 border-t border-[var(--hairline)]" />;
    case "pencil":
      return (
        <div className="border-l-2 border-[var(--hairline)] py-0.5 pl-3 font-mono text-[12px] leading-[1.6] text-[var(--text-meta-line)]">
          {block.lines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      );
    case "meta":
      return (
        <div className="font-mono text-[11.5px] italic leading-[1.6] text-[var(--text-disabled-glyph)]">
          {block.lines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      );
    default:
      return <InkBlockView block={block} />;
  }
}

function InkBlockView({ block }: { block: InkBlock }) {
  switch (block.kind) {
    case "heading": {
      const sizes: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
        1: "text-[19px]",
        2: "text-[17.5px]",
        3: "text-[16.5px]",
        4: "text-[15.5px]",
        5: "text-[15.5px]",
        6: "text-[15.5px]",
      };
      return (
        <p className={`font-serif ${sizes[block.level]} leading-[1.5] text-[var(--text-primary)]`}>
          <InlineView nodes={block.children} />
        </p>
      );
    }
    case "blockquote":
      return (
        <div className="border-l-2 border-[var(--structural-border)] pl-3">
          {block.lines.map((line, i) => (
            <p
              key={i}
              className="font-serif text-[15.5px] italic leading-[1.72] text-[var(--text-resume-snippet)]"
            >
              <InlineView nodes={line} />
            </p>
          ))}
        </div>
      );
    case "list":
      return (
        <ul
          className={`flex flex-col gap-1 pl-5 font-serif text-[15.5px] leading-[1.72] text-[var(--text-entry-body)] ${
            block.ordered ? "list-decimal" : "list-disc"
          }`}
        >
          {block.items.map((item, i) => (
            <li key={i}>
              <InlineView nodes={item} />
            </li>
          ))}
        </ul>
      );
    case "paragraph":
      return (
        <p className="font-serif text-[15.5px] leading-[1.72] text-[var(--text-entry-body)]">
          <InlineView nodes={block.children} />
        </p>
      );
  }
}

function InlineView({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        if (node.type === "text") return <span key={i}>{node.text}</span>;
        if (node.type === "pencil")
          return (
            <span key={i} className="font-mono text-[0.92em] text-[var(--text-meta-line)]">
              {node.text}
            </span>
          );
        if (node.type === "bold")
          return (
            <strong key={i} className="font-semibold">
              <InlineView nodes={node.children} />
            </strong>
          );
        return (
          <em key={i}>
            <InlineView nodes={node.children} />
          </em>
        );
      })}
    </>
  );
}
