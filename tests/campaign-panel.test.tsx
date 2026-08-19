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
  chain.insert = vi.fn(self);
  chain.update = vi.fn(self);
  chain.single = vi.fn(self);
  chain.then = (resolve: (value: unknown) => void) => Promise.resolve(result).then(resolve);
  return chain;
}

/** Routes entries/threads reads by the campaign_id passed to .eq(), like real RLS-scoped queries would. */
function makeScopedReadChain(dataByCampaignId: Record<string, unknown[]>) {
  const chain: Record<string, unknown> = {};
  let campaignId: string | undefined;
  chain.select = () => chain;
  chain.order = () => chain;
  chain.eq = (_col: string, val: string) => {
    campaignId = val;
    return chain;
  };
  chain.then = (resolve: (value: unknown) => void) =>
    Promise.resolve({ data: dataByCampaignId[campaignId ?? ""] ?? [] }).then(resolve);
  return chain;
}

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: { signOut: vi.fn() },
    from: fromMock,
  },
}));

const CAMPAIGN_A = { id: "a1", name: "Campaign A", system_label: null };
const CAMPAIGN_B = { id: "b1", name: "Campaign B", system_label: null };
const CAMPAIGN_C = { id: "c1", name: "Campaign C", system_label: null };
const ENTRY_A = {
  id: "ea1",
  campaign_id: "a1",
  title: null,
  content: "An entry that lives in campaign A",
  created_at: "2026-07-28T10:00:00Z",
};
const ENTRY_C = {
  id: "ec1",
  campaign_id: "c1",
  title: null,
  content: "An entry that lives in campaign C",
  created_at: "2026-07-29T10:00:00Z",
};

function mockTwoCampaigns() {
  fromMock.mockImplementation((table: string) => {
    if (table === "campaigns") return makeChain({ data: [CAMPAIGN_A, CAMPAIGN_B] });
    if (table === "entries") return makeScopedReadChain({ a1: [ENTRY_A], b1: [] });
    return makeScopedReadChain({ a1: [], b1: [] }); // threads
  });
}

function mockThreeCampaigns() {
  fromMock.mockImplementation((table: string) => {
    if (table === "campaigns") return makeChain({ data: [CAMPAIGN_A, CAMPAIGN_B, CAMPAIGN_C] });
    if (table === "entries") return makeScopedReadChain({ a1: [ENTRY_A], b1: [], c1: [ENTRY_C] });
    return makeScopedReadChain({ a1: [], b1: [], c1: [] }); // threads
  });
}

describe("Campaign selection and creation panel", () => {
  afterEach(() => {
    cleanup();
    fromMock.mockReset();
    window.localStorage.clear();
  });

  it("creating a campaign selects it immediately", async () => {
    const created = { id: "c1", name: "New Campaign", system_label: null };
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") {
        const chain = makeChain({ data: [CAMPAIGN_A] });
        chain.insert = vi.fn(() => makeChain({ data: created, error: null }));
        return chain;
      }
      if (table === "entries") return makeScopedReadChain({ a1: [ENTRY_A], c1: [] });
      return makeScopedReadChain({ a1: [], c1: [] });
    });

    render(<Chronicle />);
    await act(async () => {});

    fireEvent.click(await screen.findByText("Campaign A"));
    fireEvent.change(await screen.findByLabelText(/campaign name/i), {
      target: { value: "New Campaign" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /create campaign/i }));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(await screen.findByText("Nothing written yet")).toBeInTheDocument();
    expect(window.localStorage.getItem(SELECTED_KEY)).toBe("c1");
  });

  it("switching campaigns swaps the river and threads to the newly selected campaign", async () => {
    mockThreeCampaigns();
    window.localStorage.setItem(SELECTED_KEY, "a1");

    render(<Chronicle />);
    await act(async () => {});

    expect(
      await screen.findByText("An entry that lives in campaign A"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Campaign A"));
    await act(async () => {
      fireEvent.click(await screen.findByText("Campaign C"));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(await screen.findByText("An entry that lives in campaign C")).toBeInTheDocument();
    expect(screen.queryByText("An entry that lives in campaign A")).not.toBeInTheDocument();
  });

  it("a newly switched-to empty campaign shows the first-open invitation, not an empty card", async () => {
    mockTwoCampaigns();
    window.localStorage.setItem(SELECTED_KEY, "a1");

    render(<Chronicle />);
    await act(async () => {});
    expect(
      await screen.findByText("An entry that lives in campaign A"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Campaign A"));
    await act(async () => {
      fireEvent.click(await screen.findByText("Campaign B"));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(await screen.findByText("Nothing written yet")).toBeInTheDocument();
    expect(screen.queryByText("An entry that lives in campaign A")).not.toBeInTheDocument();
  });

  it("selection survives remount via localStorage", async () => {
    mockTwoCampaigns();
    // Explicitly start on A — the fallback (most recently created) is B,
    // so this proves the switch persists rather than just re-landing on
    // the default.
    window.localStorage.setItem(SELECTED_KEY, "a1");

    const { unmount } = render(<Chronicle />);
    await act(async () => {});
    fireEvent.click(await screen.findByText("Campaign A"));
    await act(async () => {
      fireEvent.click(await screen.findByText("Campaign B"));
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(await screen.findByText("Nothing written yet")).toBeInTheDocument();
    unmount();

    render(<Chronicle />);
    await act(async () => {});
    expect(await screen.findByText("Campaign B")).toBeInTheDocument();
    expect(screen.queryByText("An entry that lives in campaign A")).not.toBeInTheDocument();
  });

  it("keeps each campaign's draft isolated — switching never leaks or clobbers another campaign's draft", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockTwoCampaigns();
    window.localStorage.setItem(SELECTED_KEY, "a1");

    render(<Chronicle />);
    await act(async () => {});

    const composerA = await screen.findByPlaceholderText("Continue the chronicle…");
    fireEvent.change(composerA, { target: { value: "a draft only for campaign A" } });
    await act(async () => {
      vi.advanceTimersByTime(500); // let the debounced write land before switching away
    });

    fireEvent.click(screen.getByText("Campaign A"));
    await act(async () => {
      fireEvent.click(await screen.findByText("Campaign B"));
    });

    // Campaign B's composer is clean — A's typed draft did not leak in.
    const composerB = await screen.findByPlaceholderText("Begin the chronicle…");
    expect(composerB).toHaveValue("");

    fireEvent.click(screen.getByText("Campaign B"));
    await act(async () => {
      fireEvent.click(await screen.findByText("Campaign A"));
    });

    // Back on A — the draft is restored intact, and B's storage was never written.
    const composerAAgain = await screen.findByPlaceholderText("Continue the chronicle…");
    expect(composerAAgain).toHaveValue("a draft only for campaign A");
    expect(window.localStorage.getItem("soljour:draft:b1:content")).toBeNull();

    vi.useRealTimers();
  });
});
