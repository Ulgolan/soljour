import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Chronicle } from "../components/Chronicle";

const SELECTED_KEY = "soljour:selected-campaign";

function makeChain(result: unknown) {
  const chain: Record<string, unknown> = {};
  const self = () => chain;
  chain.select = vi.fn(self);
  chain.order = vi.fn(self);
  chain.limit = vi.fn(self);
  chain.eq = vi.fn(self);
  chain.is = vi.fn(self);
  chain.insert = vi.fn(self);
  chain.update = vi.fn(self);
  chain.single = vi.fn(self);
  chain.then = (resolve: (value: unknown) => void) => Promise.resolve(result).then(resolve);
  return chain;
}

/**
 * A table mock that serves both list reads (`.select(cols).eq().is().order()`)
 * and head-count reads (`.select(cols, {head:true}).eq().is()`), routed by
 * campaign_id the way real RLS-scoped queries are — plus `.update().eq()`
 * for soft deletes and edit saves. Used for both "entries" and "threads":
 * campaign-delete counts must come from *this* live query, never from
 * `entries`/`threads` state, which only ever covers the selected campaign.
 */
function makeTableMock({
  dataByCampaignId = {},
  countByCampaignId = {},
  onUpdate,
}: {
  dataByCampaignId?: Record<string, unknown[]>;
  countByCampaignId?: Record<string, number>;
  onUpdate?: (id: string, payload: Record<string, unknown>) => unknown;
}) {
  return () => {
    const table: Record<string, unknown> = {};
    table.select = (_cols: string, opts?: { head?: boolean }) => {
      if (opts?.head) {
        const chain: Record<string, unknown> = {};
        let campaignId: string | undefined;
        chain.eq = (_c: string, v: string) => {
          campaignId = v;
          return chain;
        };
        chain.is = () => chain;
        chain.then = (resolve: (v: unknown) => void) =>
          Promise.resolve({ count: countByCampaignId[campaignId ?? ""] ?? 0 }).then(resolve);
        return chain;
      }
      const chain: Record<string, unknown> = {};
      let campaignId: string | undefined;
      chain.eq = (_c: string, v: string) => {
        campaignId = v;
        return chain;
      };
      chain.is = () => chain;
      chain.order = () => chain;
      chain.then = (resolve: (v: unknown) => void) =>
        Promise.resolve({ data: dataByCampaignId[campaignId ?? ""] ?? [] }).then(resolve);
      return chain;
    };
    table.update = (payload: Record<string, unknown>) => {
      const chain: Record<string, unknown> = {};
      chain.eq = (_c: string, id: string) => {
        const result = onUpdate ? onUpdate(id, payload) : { data: null, error: null };
        const resultChain: Record<string, unknown> = {};
        resultChain.select = () => resultChain;
        resultChain.single = () => resultChain;
        resultChain.then = (resolve: (v: unknown) => void) => Promise.resolve(result).then(resolve);
        return resultChain;
      };
      return chain;
    };
    table.insert = () => makeChain({ data: null, error: null });
    return table;
  };
}

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: { signOut: vi.fn() },
    from: fromMock,
  },
}));

describe("Entry edit — the collision law (Lap 6)", () => {
  afterEach(() => {
    cleanup();
    fromMock.mockReset();
    window.localStorage.clear();
    vi.useRealTimers();
  });

  const CAMPAIGN = { id: "c1", name: "Test Campaign", system_label: null };
  const ENTRY = {
    id: "e1",
    campaign_id: "c1",
    title: null,
    content: "original text",
    created_at: "2026-07-28T10:00:00Z",
  };

  it("edit save updates content and updated_at, never touches created_at, entry keeps its river position", async () => {
    const updateCalls: Array<{ id: string; payload: Record<string, unknown> }> = [];
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") return makeChain({ data: [CAMPAIGN] });
      if (table === "entries") {
        return makeTableMock({
          dataByCampaignId: { c1: [ENTRY] },
          onUpdate: (id, payload) => {
            updateCalls.push({ id, payload });
            return { data: { ...ENTRY, ...payload }, error: null };
          },
        })();
      }
      return makeChain({ data: [] });
    });

    render(<Chronicle />);
    await screen.findByText("original text");
    expect(screen.getByText("28 JUL")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Entry actions"));
    fireEvent.click(screen.getByText("Edit"));

    const textarea = await screen.findByPlaceholderText("Continue the chronicle…");
    expect(textarea).toHaveValue("original text");
    fireEvent.change(textarea, { target: { value: "edited text" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Save edit" }));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(updateCalls).toHaveLength(1);
    expect(updateCalls[0].payload).toMatchObject({ content: "edited text" });
    expect(updateCalls[0].payload).toHaveProperty("updated_at");
    expect(updateCalls[0].payload).not.toHaveProperty("created_at");

    expect(screen.getByText("edited text")).toBeInTheDocument();
    expect(screen.getByText("28 JUL")).toBeInTheDocument();
    expect(screen.queryByText("Editing entry")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save entry" })).toBeInTheDocument();
  });

  it("blocks edit save with empty content — the Save control is disabled", async () => {
    const updateCalls: Array<unknown> = [];
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") return makeChain({ data: [CAMPAIGN] });
      if (table === "entries") {
        return makeTableMock({
          dataByCampaignId: { c1: [ENTRY] },
          onUpdate: (id, payload) => {
            updateCalls.push({ id, payload });
            return { data: { ...ENTRY, ...payload }, error: null };
          },
        })();
      }
      return makeChain({ data: [] });
    });

    render(<Chronicle />);
    await screen.findByText("original text");
    fireEvent.click(screen.getByLabelText("Entry actions"));
    fireEvent.click(screen.getByText("Edit"));

    const textarea = await screen.findByPlaceholderText("Continue the chronicle…");
    fireEvent.change(textarea, { target: { value: "" } });

    expect(screen.getByRole("button", { name: "Save edit" })).toBeDisabled();
    expect(updateCalls).toHaveLength(0);
  });

  it("cancel restores an emptied edit — pencil-only content stays legal (not treated as delete)", async () => {
    const PENCIL_ENTRY = { ...ENTRY, content: "[rolled 14 vs DC 12]" };
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") return makeChain({ data: [CAMPAIGN] });
      if (table === "entries") {
        return makeTableMock({ dataByCampaignId: { c1: [PENCIL_ENTRY] } })();
      }
      return makeChain({ data: [] });
    });

    render(<Chronicle />);
    // Pencil block rendering strips the brackets in the river (Micro-key
    // 4.1) — the raw source with brackets is what the composer must seed.
    await screen.findByText("rolled 14 vs DC 12");
    fireEvent.click(screen.getByLabelText("Entry actions"));
    fireEvent.click(screen.getByText("Edit"));

    const textarea = await screen.findByPlaceholderText("Continue the chronicle…");
    expect(textarea).toHaveValue("[rolled 14 vs DC 12]");
    expect(screen.getByRole("button", { name: "Save edit" })).not.toBeDisabled();
  });

  it("THE COLLISION TEST: editing an entry never reads or writes the new-entry draft keys", async () => {
    // No shouldAdvanceTime: the fake clock only moves on an explicit
    // vi.advanceTimersByTime — with it, the clock also creeps forward
    // with real wall time, so a slower machine (a CI runner under load)
    // could let a debounce timer fire for real between two fireEvents
    // that read as adjacent in the test source. That's what turned this
    // test flaky on the Tower's independent run while staying green
    // here: the race was real, the test just wasn't holding the clock
    // still enough to make it deterministic either way.
    vi.useFakeTimers();
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") return makeChain({ data: [CAMPAIGN] });
      if (table === "entries") return makeTableMock({ dataByCampaignId: { c1: [ENTRY] } })();
      return makeChain({ data: [] });
    });

    // findBy*'s internal wait/poll leans on real setTimeout, which never
    // fires while the fake clock is frozen and un-advanced — so this test
    // flushes the initial (Promise-based, not timer-based) data load with
    // an explicit microtask drain and uses only synchronous queries from
    // here on, exactly like the other fake-timer tests in this file.
    render(<Chronicle />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByText("original text")).toBeInTheDocument();

    // Type a new-entry draft and let it flush.
    const newEntryTextarea = screen.getByPlaceholderText("Continue the chronicle…");
    fireEvent.change(newEntryTextarea, { target: { value: "original new-entry draft" } });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(window.localStorage.getItem("soljour:draft:c1:content")).toBe("original new-entry draft");

    // Enter edit mode on the existing entry.
    fireEvent.click(screen.getByLabelText("Entry actions"));
    fireEvent.click(screen.getByText("Edit"));
    const editTextarea = screen.getByPlaceholderText("Continue the chronicle…");
    expect(editTextarea).toHaveValue("original text");

    fireEvent.change(editTextarea, { target: { value: "edited text mid-flight" } });

    // Blur AND visibilitychange->hidden both fire during the edit.
    fireEvent.blur(editTextarea);
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });

    // The edit buffer took the flush; the new-entry draft is untouched.
    expect(window.localStorage.getItem("soljour:edit:e1:content")).toBe("edited text mid-flight");
    expect(window.localStorage.getItem("soljour:draft:c1:content")).toBe("original new-entry draft");

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    // Edit buffer cleared; new-entry draft still holds the untouched original.
    expect(window.localStorage.getItem("soljour:edit:e1:content")).toBeNull();
    expect(window.localStorage.getItem("soljour:draft:c1:content")).toBe("original new-entry draft");

    const restoredComposer = screen.getByPlaceholderText("Continue the chronicle…");
    expect(restoredComposer).toHaveValue("original new-entry draft");
    expect(screen.getByText("original text")).toBeInTheDocument();
  });
});

describe("Entry delete — soft, confirmed, undoable (Lap 6)", () => {
  afterEach(() => {
    cleanup();
    fromMock.mockReset();
    window.localStorage.clear();
  });

  const CAMPAIGN = { id: "c1", name: "Test Campaign", system_label: null };
  const ENTRY_A = {
    id: "e1",
    campaign_id: "c1",
    title: null,
    content: "the entry that stays",
    created_at: "2026-07-28T10:00:00Z",
  };
  const ENTRY_B = {
    id: "e2",
    campaign_id: "c1",
    title: null,
    content: "the entry that leaves",
    created_at: "2026-07-29T10:00:00Z",
  };

  it("delete requires a confirm step in the same sheet before the update fires", async () => {
    const updateCalls: Array<{ id: string; payload: Record<string, unknown> }> = [];
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") return makeChain({ data: [CAMPAIGN] });
      if (table === "entries") {
        return makeTableMock({
          dataByCampaignId: { c1: [ENTRY_A, ENTRY_B] },
          onUpdate: (id, payload) => {
            updateCalls.push({ id, payload });
            return { error: null };
          },
        })();
      }
      return makeChain({ data: [] });
    });

    render(<Chronicle />);
    await screen.findByText("the entry that leaves");

    const glyphs = screen.getAllByLabelText("Entry actions");
    fireEvent.click(glyphs[1]); // the second entry, "the entry that leaves"
    fireEvent.click(screen.getByText("Delete"));

    // Confirm step reached, but nothing has been sent yet.
    expect(await screen.findByText("Delete entry")).toBeInTheDocument();
    expect(updateCalls).toHaveLength(0);
    expect(screen.getByText("the entry that leaves")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Confirm delete" }));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(updateCalls).toHaveLength(1);
    expect(updateCalls[0]).toMatchObject({ id: "e2" });
    expect(updateCalls[0].payload).toHaveProperty("deleted_at");

    // Leaves the river; the other entry is untouched.
    expect(screen.queryByText("the entry that leaves")).not.toBeInTheDocument();
    expect(screen.getByText("the entry that stays")).toBeInTheDocument();
  });

  it("cancel at the sheet or the confirm step never calls update", async () => {
    const updateCalls: Array<unknown> = [];
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") return makeChain({ data: [CAMPAIGN] });
      if (table === "entries") {
        return makeTableMock({
          dataByCampaignId: { c1: [ENTRY_A] },
          onUpdate: (id, payload) => {
            updateCalls.push({ id, payload });
            return { error: null };
          },
        })();
      }
      return makeChain({ data: [] });
    });

    render(<Chronicle />);
    await screen.findByText("the entry that stays");

    fireEvent.click(screen.getByLabelText("Entry actions"));
    fireEvent.click(screen.getByText("Delete"));
    await screen.findByText("Delete entry");
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByText("Delete entry")).not.toBeInTheDocument();
    expect(updateCalls).toHaveLength(0);
    expect(screen.getByText("the entry that stays")).toBeInTheDocument();
  });
});

describe("Campaign delete — live counts, fallback selection (Lap 6)", () => {
  afterEach(() => {
    cleanup();
    fromMock.mockReset();
    window.localStorage.clear();
  });

  const CAMPAIGN_A = { id: "a1", name: "Campaign A", system_label: null };
  const CAMPAIGN_B = { id: "b1", name: "Campaign B", system_label: null };
  const ENTRY_A = {
    id: "ea1",
    campaign_id: "a1",
    title: null,
    content: "An entry that lives in campaign A",
    created_at: "2026-07-28T10:00:00Z",
  };

  it("confirm counts come from a live head-count query, not from loaded state", async () => {
    // The selected campaign (A) has 1 loaded entry in state. Campaign B is
    // never loaded into state at all — its true counts only exist in the
    // live query, proving the confirm sheet cannot be reading from state.
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") return makeChain({ data: [CAMPAIGN_A, CAMPAIGN_B] });
      if (table === "entries") {
        return makeTableMock({
          dataByCampaignId: { a1: [ENTRY_A], b1: [] },
          countByCampaignId: { a1: 1, b1: 3 },
        })();
      }
      if (table === "threads") {
        return makeTableMock({
          dataByCampaignId: { a1: [], b1: [] },
          countByCampaignId: { a1: 0, b1: 2 },
        })();
      }
      return makeChain({ data: [] });
    });

    window.localStorage.setItem(SELECTED_KEY, "a1");
    render(<Chronicle />);
    await screen.findByText("An entry that lives in campaign A");

    fireEvent.click(screen.getByText("Campaign A")); // open campaign panel
    await screen.findByText("Campaign B");
    fireEvent.click(screen.getByLabelText("Delete Campaign B"));

    expect(await screen.findByText(/3 entries and 2 threads/i)).toBeInTheDocument();
  });

  function makeCampaignsMock(
    list: Array<{ id: string; name: string; system_label: string | null }>,
    onUpdate: (id: string, payload: Record<string, unknown>) => void,
  ) {
    return () => ({
      select: () => makeChain({ data: list }),
      update: (payload: Record<string, unknown>) => {
        const chain: Record<string, unknown> = {};
        chain.eq = (_c: string, id: string) => {
          onUpdate(id, payload);
          return makeChain({ error: null });
        };
        return chain;
      },
    });
  }

  it("deleting the selected campaign falls back to the most recent remaining campaign", async () => {
    const campaignUpdates: Array<{ id: string; payload: Record<string, unknown> }> = [];
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") {
        return makeCampaignsMock([CAMPAIGN_A, CAMPAIGN_B], (id, payload) =>
          campaignUpdates.push({ id, payload }),
        )();
      }
      if (table === "entries") return makeTableMock({ dataByCampaignId: { a1: [ENTRY_A], b1: [] } })();
      if (table === "threads") return makeTableMock({ dataByCampaignId: { a1: [], b1: [] } })();
      return makeChain({ data: [] });
    });

    window.localStorage.setItem(SELECTED_KEY, "b1"); // B (most recent) is selected
    render(<Chronicle />);
    await act(async () => {});
    expect(await screen.findByText("Nothing written yet")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Campaign B"));
    await screen.findByText("Campaign A");
    fireEvent.click(screen.getByLabelText("Delete Campaign B"));
    await screen.findByText("Delete campaign");
    await vi.waitFor(() => expect(screen.getByRole("button", { name: "Confirm delete" })).not.toBeDisabled());

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Confirm delete" }));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(campaignUpdates).toHaveLength(1);
    expect(campaignUpdates[0]).toMatchObject({ id: "b1" });
    expect(campaignUpdates[0].payload).toHaveProperty("deleted_at");

    // Falls back to the most recent remaining campaign — A.
    expect(await screen.findByText("An entry that lives in campaign A")).toBeInTheDocument();
    expect(window.localStorage.getItem(SELECTED_KEY)).toBe("a1");
  });

  it("deleting the only remaining campaign shows CampaignForm and clears the selection key", async () => {
    const campaignUpdates: Array<{ id: string; payload: Record<string, unknown> }> = [];
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") {
        return makeCampaignsMock([CAMPAIGN_A], (id, payload) => campaignUpdates.push({ id, payload }))();
      }
      if (table === "entries") return makeTableMock({ dataByCampaignId: { a1: [ENTRY_A] } })();
      if (table === "threads") return makeTableMock({ dataByCampaignId: { a1: [] } })();
      return makeChain({ data: [] });
    });

    render(<Chronicle />);
    await screen.findByText("An entry that lives in campaign A");

    fireEvent.click(screen.getByText("Campaign A"));
    await screen.findByText("Campaign A", { selector: "span" });
    fireEvent.click(screen.getByLabelText("Delete Campaign A"));
    await screen.findByText("Delete campaign");
    await vi.waitFor(() => expect(screen.getByRole("button", { name: "Confirm delete" })).not.toBeDisabled());

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Confirm delete" }));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(campaignUpdates).toHaveLength(1);
    expect(await screen.findByLabelText(/campaign name/i)).toBeInTheDocument();
    expect(window.localStorage.getItem(SELECTED_KEY)).toBeNull();
  });
});
