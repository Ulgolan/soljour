import { describe, expect, it } from "vitest";
import { inkPlainText, parseInline, parseProse, type InlineNode } from "../lib/prose";

function flatten(nodes: InlineNode[]): string {
  return nodes.map((n) => (n.type === "text" ? n.text : flatten(n.children))).join("");
}

describe("parseProse — the four voices", () => {
  it("renders a plain line as ink (paragraph)", () => {
    const blocks = parseProse("We went down because the water was going down.");
    expect(blocks).toEqual([
      { kind: "paragraph", children: [{ type: "text", text: "We went down because the water was going down." }] },
    ]);
  });

  it("renders a line starting with [ as pencil, stripped of the marker", () => {
    const blocks = parseProse("[rolled 14 vs DC 12, success");
    expect(blocks).toEqual([{ kind: "pencil", lines: ["rolled 14 vs DC 12, success"] }]);
  });

  it("groups consecutive pencil lines into one block", () => {
    const blocks = parseProse("[rolled 14 vs DC 12\n[dealt 6 damage");
    expect(blocks).toEqual([
      { kind: "pencil", lines: ["rolled 14 vs DC 12", "dealt 6 damage"] },
    ]);
  });

  it("renders a line starting with // as a meta note, stripped of the marker", () => {
    const blocks = parseProse("// remember to bring this NPC back");
    expect(blocks).toEqual([{ kind: "meta", lines: [" remember to bring this NPC back"] }]);
  });

  it("groups consecutive // lines into one meta block", () => {
    const blocks = parseProse("// idea one\n// idea two");
    expect(blocks).toEqual([{ kind: "meta", lines: [" idea one", " idea two"] }]);
  });

  it("renders a standalone --- line as a scene break, never a heading", () => {
    const blocks = parseProse("The door closed behind them.\n---\nThree days later.");
    expect(blocks).toEqual([
      { kind: "paragraph", children: [{ type: "text", text: "The door closed behind them." }] },
      { kind: "scene-break" },
      { kind: "paragraph", children: [{ type: "text", text: "Three days later." }] },
    ]);
  });
});

describe("parseProse — convention precedence over markdown (Amendment A1)", () => {
  it("prose line followed by --- renders as ink + scene break, never a setext heading", () => {
    const blocks = parseProse("A Title Line\n---");
    expect(blocks).toEqual([
      { kind: "paragraph", children: [{ type: "text", text: "A Title Line" }] },
      { kind: "scene-break" },
    ]);
    expect(blocks.some((b) => b.kind === "heading")).toBe(false);
  });

  it("a line starting with [ is pencil even though it opens like a markdown link", () => {
    const blocks = parseProse("[not a link](nowhere)");
    expect(blocks).toEqual([{ kind: "pencil", lines: ["not a link](nowhere)"] }]);
  });
});

describe("parseProse — markdown baseline", () => {
  it("parses a heading", () => {
    const blocks = parseProse("## The Salt-Bound Year");
    expect(blocks).toEqual([
      { kind: "heading", level: 2, children: [{ type: "text", text: "The Salt-Bound Year" }] },
    ]);
  });

  it("parses a blockquote across consecutive lines", () => {
    const blocks = parseProse("> the water rises\n> and does not stop");
    expect(blocks).toEqual([
      {
        kind: "blockquote",
        lines: [
          [{ type: "text", text: "the water rises" }],
          [{ type: "text", text: "and does not stop" }],
        ],
      },
    ]);
  });

  it("parses an unordered list", () => {
    const blocks = parseProse("- a lantern\n- a rope");
    expect(blocks).toEqual([
      {
        kind: "list",
        ordered: false,
        items: [[{ type: "text", text: "a lantern" }], [{ type: "text", text: "a rope" }]],
      },
    ]);
  });

  it("parses bold and italic inline", () => {
    const nodes = parseInline("the **ferryman** was *not* pleased");
    expect(flatten(nodes)).toBe("the ferryman was not pleased");
    expect(nodes.some((n) => n.type === "bold")).toBe(true);
    expect(nodes.some((n) => n.type === "italic")).toBe(true);
  });

  it("excludes link syntax from the baseline — mid-line [ is a literal character", () => {
    const nodes = parseInline("see [the map](nowhere) for details");
    expect(flatten(nodes)).toBe("see [the map](nowhere) for details");
  });
});

describe("parseProse — raw HTML is inert", () => {
  it("renders HTML tags in entry text as literal text, not markup", () => {
    const blocks = parseProse('<script>alert(1)</script> and <b>bold</b>');
    expect(blocks).toEqual([
      {
        kind: "paragraph",
        children: [{ type: "text", text: "<script>alert(1)</script> and <b>bold</b>" }],
      },
    ]);
  });
});

describe("inkPlainText — the resume brief quotes the story, never the dice (Amendment A4)", () => {
  it("skips pencil and meta blocks entirely", () => {
    const text = inkPlainText("The stair went down.\n[rolled 14 vs DC 12\n// remember this NPC\nThey found the landing.");
    expect(text).toBe("The stair went down. They found the landing.");
  });

  it("strips scene breaks and flattens inline markdown to plain text", () => {
    const text = inkPlainText("**Bold** words and *italic* ones.\n---\nAfter the break.");
    expect(text).toBe("Bold words and italic ones. After the break.");
  });
});
