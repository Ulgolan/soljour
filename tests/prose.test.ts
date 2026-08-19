import { describe, expect, it } from "vitest";
import { inkPlainText, parseInline, parseInlineWithPencil, parseProse, type InlineNode } from "../lib/prose";
import { applyMarkerInsertion } from "../lib/markerInsertion";

function flatten(nodes: InlineNode[]): string {
  return nodes
    .map((n) => {
      if (n.type === "text") return n.text;
      if (n.type === "pencil") return n.text;
      return flatten(n.children);
    })
    .join("");
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

  it("renders a line starting with // as a meta note, stripped of the marker and its one leading space", () => {
    const blocks = parseProse("// remember to bring this NPC back");
    expect(blocks).toEqual([{ kind: "meta", lines: ["remember to bring this NPC back"] }]);
  });

  it("groups consecutive // lines into one meta block", () => {
    const blocks = parseProse("// idea one\n// idea two");
    expect(blocks).toEqual([{ kind: "meta", lines: ["idea one", "idea two"] }]);
  });

  it("renders a standalone --- line as a scene break, never a heading", () => {
    const blocks = parseProse("The door closed behind them.\n---\nThree days later.");
    expect(blocks).toEqual([
      { kind: "paragraph", children: [{ type: "text", text: "The door closed behind them." }] },
      { kind: "scene-break" },
      { kind: "paragraph", children: [{ type: "text", text: "Three days later." }] },
    ]);
  });

  it("meta triggers at line start only — // elsewhere in a line is literal ink (F5)", () => {
    const blocks = parseProse("check the door // later");
    expect(blocks).toEqual([
      { kind: "paragraph", children: [{ type: "text", text: "check the door // later" }] },
    ]);
    expect(blocks.some((b) => b.kind === "meta")).toBe(false);
  });
});

describe("parseProse — pencil block closure and the meta space (Micro-key 4.1)", () => {
  it("strips a single trailing ] from a closed pencil block line", () => {
    const blocks = parseProse("[rolled 14 vs DC 12]");
    expect(blocks).toEqual([{ kind: "pencil", lines: ["rolled 14 vs DC 12"] }]);
  });

  it("renders an open pencil block line (no trailing ]) unchanged — both are legal", () => {
    const blocks = parseProse("[rolled 14 vs DC 12");
    expect(blocks).toEqual([{ kind: "pencil", lines: ["rolled 14 vs DC 12"] }]);
  });

  it("preserves interior ] characters, stripping only the one final ]", () => {
    const blocks = parseProse("[a [nested] note]");
    expect(blocks).toEqual([{ kind: "pencil", lines: ["a [nested] note"] }]);
  });

  it("// note and //note render identically — the one leading space is cosmetic", () => {
    expect(parseProse("// note")).toEqual(parseProse("//note"));
    expect(parseProse("//note")).toEqual([{ kind: "meta", lines: ["note"] }]);
  });
});

describe("parseProse — scene break loosened to 3+ hyphens (Addendum v3 F1)", () => {
  it("renders ----- (5 hyphens) as a scene break", () => {
    const blocks = parseProse("Before.\n-----\nAfter.");
    expect(blocks).toEqual([
      { kind: "paragraph", children: [{ type: "text", text: "Before." }] },
      { kind: "scene-break" },
      { kind: "paragraph", children: [{ type: "text", text: "After." }] },
    ]);
  });

  it("tolerates surrounding whitespace but nothing else on the line", () => {
    expect(parseProse("  ---  ")).toEqual([{ kind: "scene-break" }]);
    expect(parseProse("-- not enough")).toEqual([
      { kind: "paragraph", children: [{ type: "text", text: "-- not enough" }] },
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

describe("parseInlineWithPencil — inline pencil spans (Addendum v3 F2)", () => {
  it("renders a mid-sentence closed [...] pair as an inline pencil span", () => {
    const nodes = parseInlineWithPencil("the roll was [rolled 14, success] and the door opened");
    expect(nodes).toEqual([
      { type: "text", text: "the roll was " },
      { type: "pencil", text: "rolled 14, success" },
      { type: "text", text: " and the door opened" },
    ]);
  });

  it("renders multiple pairs on one line as separate spans", () => {
    const nodes = parseInlineWithPencil("a [x] b [y]");
    expect(nodes).toEqual([
      { type: "text", text: "a " },
      { type: "pencil", text: "x" },
      { type: "text", text: " b " },
      { type: "pencil", text: "y" },
    ]);
  });

  it("leaves an unclosed [ as literal ink", () => {
    const nodes = parseInlineWithPencil("the door [creaked open");
    expect(flatten(nodes)).toBe("the door [creaked open");
    expect(nodes.some((n) => n.type === "pencil")).toBe(false);
  });

  it("leaves a stray ] as literal ink", () => {
    const nodes = parseInlineWithPencil("that was odd] indeed");
    expect(flatten(nodes)).toBe("that was odd] indeed");
    expect(nodes.some((n) => n.type === "pencil")).toBe(false);
  });

  it("pairs never match across lines — line-start [ still opens a pencil BLOCK, unchanged", () => {
    const blocks = parseProse("[unclosed on this line\nclosed] on the next");
    expect(blocks).toEqual([
      { kind: "pencil", lines: ["unclosed on this line"] },
      { kind: "paragraph", children: [{ type: "text", text: "closed] on the next" }] },
    ]);
  });
});

describe("inline pipeline order — pencil spans extracted before markdown (Addendum v3 F3)", () => {
  it("an emphasis pair cannot cross a span boundary", () => {
    const nodes = parseInlineWithPencil("**bold [roll] more**");
    expect(nodes).toEqual([
      { type: "text", text: "**bold " },
      { type: "pencil", text: "roll" },
      { type: "text", text: " more**" },
    ]);
    expect(nodes.some((n) => n.type === "bold")).toBe(false);
  });
});

describe("inline pencil spans are verbatim — no markdown inside (Addendum v3 F4)", () => {
  it("shows the literal asterisks inside a span, unrendered", () => {
    const nodes = parseInlineWithPencil("The oracle said [Fate → **yes**] and nothing more.");
    const span = nodes.find((n) => n.type === "pencil");
    expect(span).toEqual({ type: "pencil", text: "Fate → **yes**" });
  });

  it("pencil BLOCK lines are verbatim too (markdown-inert; the closing ] is stripped per Micro-key 4.1)", () => {
    const blocks = parseProse("[Fate → **yes**]");
    expect(blocks).toEqual([{ kind: "pencil", lines: ["Fate → **yes**"] }]);
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

describe("inkPlainText — the resume brief quotes the story, never the dice (Amendment A4, Addendum v3 F6)", () => {
  it("skips pencil and meta blocks entirely", () => {
    const text = inkPlainText("The stair went down.\n[rolled 14 vs DC 12\n// remember this NPC\nThey found the landing.");
    expect(text).toBe("The stair went down. They found the landing.");
  });

  it("strips scene breaks and flattens inline markdown to plain text", () => {
    const text = inkPlainText("**Bold** words and *italic* ones.\n---\nAfter the break.");
    expect(text).toBe("Bold words and italic ones. After the break.");
  });

  it("strips inline pencil spans from the excerpt (F6)", () => {
    const text = inkPlainText("The door opened [rolled 14, success] and they stepped through.");
    expect(text).toBe("The door opened and they stepped through.");
  });
});

describe("applyMarkerInsertion — shortcut sheet semantics (Addendum v3 F5)", () => {
  it("Bold/Italic wrap a non-empty selection", () => {
    const { content, caret } = applyMarkerInsertion(
      "the ferryman waited",
      { start: 4, end: 12 },
      { kind: "wrap", before: "**", after: "**" },
    );
    expect(content).toBe("the **ferryman** waited");
    expect(caret).toBe(4 + "**ferryman**".length);
  });

  it("Bold/Italic insert the pair with the caret between, on an empty selection", () => {
    const { content, caret } = applyMarkerInsertion("", { start: 0, end: 0 }, {
      kind: "wrap",
      before: "**",
      after: "**",
    });
    expect(content).toBe("****");
    expect(caret).toBe(2);
  });

  it("Heading/Quote/List/Meta/Pencil block prefix a fresh line when the caret is mid-text", () => {
    const { content } = applyMarkerInsertion("some text", { start: 9, end: 9 }, {
      kind: "linePrefix",
      prefix: "# ",
    });
    expect(content).toBe("some text\n# ");
  });

  it("prefixes directly, with no extra newline, when the caret is already at a line start", () => {
    const { content } = applyMarkerInsertion("first\n", { start: 6, end: 6 }, {
      kind: "linePrefix",
      prefix: "> ",
    });
    expect(content).toBe("first\n> ");
  });

  it("List prefixes the same way", () => {
    const { content } = applyMarkerInsertion("a rope", { start: 6, end: 6 }, {
      kind: "linePrefix",
      prefix: "- ",
    });
    expect(content).toBe("a rope\n- ");
  });

  it("Pencil block prefixes the same way", () => {
    const { content } = applyMarkerInsertion("mid text", { start: 8, end: 8 }, {
      kind: "linePrefix",
      prefix: "[",
    });
    expect(content).toBe("mid text\n[");
  });

  it("Meta note prefixes and never produces a trailing // pair", () => {
    const { content } = applyMarkerInsertion("mid text", { start: 8, end: 8 }, {
      kind: "linePrefix",
      prefix: "// ",
    });
    expect(content).toBe("mid text\n// ");
    expect(content.endsWith("//")).toBe(false);
  });

  it("Scene break isolates onto its own line, adding newlines on both sides as needed", () => {
    const { content } = applyMarkerInsertion("some text", { start: 9, end: 9 }, {
      kind: "isolatedLine",
      text: "---",
    });
    expect(content).toBe("some text\n---\n");
  });

  it("Scene break needs no leading newline when already at a line start", () => {
    const { content } = applyMarkerInsertion("first\n", { start: 6, end: 6 }, {
      kind: "isolatedLine",
      text: "---",
    });
    expect(content).toBe("first\n---\n");
  });
});
