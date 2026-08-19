import { describe, expect, it } from "vitest";
import {
  formatEntryMeta,
  exportFilename,
  generateCampaignMarkdown,
  type Campaign,
  type Entry,
  type Thread,
} from "../lib/markdown";

const campaign: Campaign = { id: "c1", name: "The Salt-Bound Year", system_label: "Homebrew" };

describe("formatEntryMeta", () => {
  it("is date-only when there is no title", () => {
    expect(formatEntryMeta({ title: null, created_at: "2026-07-28T10:00:00Z" })).toBe("28 JUL");
  });

  it("appends the title when present", () => {
    expect(
      formatEntryMeta({ title: "The Weeping Stair", created_at: "2026-07-28T10:00:00Z" }),
    ).toBe("28 JUL · The Weeping Stair");
  });
});

describe("exportFilename", () => {
  it("slugifies the campaign name", () => {
    expect(exportFilename({ name: "The Salt-Bound Year" })).toBe("the-salt-bound-year.md");
  });
});

describe("generateCampaignMarkdown", () => {
  const entries: Entry[] = [
    {
      id: "e1",
      campaign_id: "c1",
      title: null,
      content: "We went down because the water was going down.",
      created_at: "2026-07-28T10:00:00Z",
    },
    {
      id: "e2",
      campaign_id: "c1",
      title: "The Ferryman's Price",
      content: "There is a landing at the bottom of the stair.",
      created_at: "2026-07-29T10:00:00Z",
    },
  ];
  const threads: Thread[] = [
    {
      id: "t1",
      campaign_id: "c1",
      text: "Who paid the ferryman?",
      status: "open",
      created_at: "2026-07-28T10:00:00Z",
      resolved_at: null,
    },
    {
      id: "t2",
      campaign_id: "c1",
      text: "Forty marks owed to the Lantern Guild",
      status: "resolved",
      created_at: "2026-07-27T10:00:00Z",
      resolved_at: "2026-07-29T10:00:00Z",
    },
  ];

  it("contains the campaign title, every entry, and every thread in order", () => {
    const markdown = generateCampaignMarkdown(campaign, entries, threads);

    expect(markdown).toContain("# The Salt-Bound Year");

    const idxE1 = markdown.indexOf("28 JUL");
    const idxE2 = markdown.indexOf("29 JUL · The Ferryman's Price");
    expect(idxE1).toBeGreaterThan(-1);
    expect(idxE2).toBeGreaterThan(idxE1);
    expect(markdown).toContain(entries[0].content);
    expect(markdown).toContain(entries[1].content);

    const idxOpen = markdown.indexOf("[ ] Who paid the ferryman?");
    const idxResolved = markdown.indexOf("[x] Forty marks owed to the Lantern Guild");
    expect(idxOpen).toBeGreaterThan(-1);
    expect(idxResolved).toBeGreaterThan(-1);
  });

  it("produces a stated-empty threads section when there are no threads", () => {
    const markdown = generateCampaignMarkdown(campaign, entries, []);
    expect(markdown).toContain("## Threads");
    expect(markdown).toContain("_none yet_");
  });
});
