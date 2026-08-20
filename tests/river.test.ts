import { describe, expect, it } from "vitest";
import { groupEntriesByDay } from "../lib/river";
import type { Entry } from "../lib/markdown";

function entry(partial: Partial<Entry> & { id: string; created_at: string }): Entry {
  return {
    campaign_id: "c1",
    title: null,
    content: "",
    ...partial,
  };
}

describe("groupEntriesByDay", () => {
  it("puts a single day's entries into one group", () => {
    const entries = [
      entry({ id: "1", created_at: "2026-08-19T09:00:00Z" }),
      entry({ id: "2", created_at: "2026-08-19T14:00:00Z" }),
    ];
    const groups = groupEntriesByDay(entries);
    expect(groups).toHaveLength(1);
    expect(groups[0].entries.map((e) => e.id)).toEqual(["1", "2"]);
  });

  it("splits entries across multiple days into separate groups, in order", () => {
    const entries = [
      entry({ id: "1", created_at: "2026-08-18T09:00:00Z" }),
      entry({ id: "2", created_at: "2026-08-19T09:00:00Z" }),
      entry({ id: "3", created_at: "2026-08-19T20:00:00Z" }),
      entry({ id: "4", created_at: "2026-08-20T08:00:00Z" }),
    ];
    const groups = groupEntriesByDay(entries);
    expect(groups).toHaveLength(3);
    expect(groups[0].entries.map((e) => e.id)).toEqual(["1"]);
    expect(groups[1].entries.map((e) => e.id)).toEqual(["2", "3"]);
    expect(groups[2].entries.map((e) => e.id)).toEqual(["4"]);
  });

  it("mixes titled and untitled entries within one group without splitting it", () => {
    const entries = [
      entry({ id: "1", created_at: "2026-08-19T09:00:00Z", title: "Arrival" }),
      entry({ id: "2", created_at: "2026-08-19T10:00:00Z" }),
      entry({ id: "3", created_at: "2026-08-19T11:00:00Z" }),
      entry({ id: "4", created_at: "2026-08-19T12:00:00Z", title: "The Ambush" }),
    ];
    const groups = groupEntriesByDay(entries);
    expect(groups).toHaveLength(1);
    expect(groups[0].entries.map((e) => e.title)).toEqual(["Arrival", null, null, "The Ambush"]);
  });

  it("treats a local-midnight boundary as a new day even a minute apart", () => {
    // 2026-08-19T23:59 and 2026-08-20T00:01 local time (no TZ suffix —
    // the Date constructor parses these as local, matching the device
    // clock groupEntriesByDay is meant to read).
    const entries = [
      entry({ id: "1", created_at: "2026-08-19T23:59:00" }),
      entry({ id: "2", created_at: "2026-08-20T00:01:00" }),
    ];
    const groups = groupEntriesByDay(entries);
    expect(groups).toHaveLength(2);
  });

  it("does not merge two same-calendar-day runs separated by a different day", () => {
    const entries = [
      entry({ id: "1", created_at: "2026-08-19T09:00:00" }),
      entry({ id: "2", created_at: "2026-08-20T09:00:00" }),
      entry({ id: "3", created_at: "2026-08-19T09:00:00" }),
    ];
    const groups = groupEntriesByDay(entries);
    expect(groups).toHaveLength(3);
    expect(groups.map((g) => g.entries.map((e) => e.id))).toEqual([["1"], ["2"], ["3"]]);
  });

  it("returns no groups for no entries", () => {
    expect(groupEntriesByDay([])).toEqual([]);
  });

  it("labels each group with the local day-month, mono meta format", () => {
    const groups = groupEntriesByDay([entry({ id: "1", created_at: "2026-08-19T09:00:00" })]);
    expect(groups[0].label).toBe("19 AUG");
  });
});
