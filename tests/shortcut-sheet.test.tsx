import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Chronicle } from "../components/Chronicle";

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

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: { signOut: vi.fn() },
    from: fromMock,
  },
}));

describe("the tappable shortcut sheet (Step 2 + Amendment A3)", () => {
  afterEach(() => {
    cleanup();
    fromMock.mockReset();
    window.localStorage.clear();
    vi.useRealTimers();
  });

  async function renderChronicleWithEmptyCampaign() {
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") {
        return makeChain({ data: [{ id: "c1", name: "Test Campaign", system_label: null }] });
      }
      return makeChain({ data: [] });
    });
    render(<Chronicle />);
    const textarea = await screen.findByPlaceholderText("Begin the chronicle…");
    await act(async () => {});
    return textarea as HTMLTextAreaElement;
  }

  it("wraps the range captured on open even though the textarea blurred when the sheet opened", async () => {
    const textarea = await renderChronicleWithEmptyCampaign();

    fireEvent.change(textarea, { target: { value: "the ferryman waited" } });
    const start = "the ".length;
    const end = start + "ferryman".length;
    textarea.setSelectionRange(start, end);
    fireEvent.blur(textarea); // sheet opening blurs the composer — capture must survive this

    fireEvent.click(screen.getByText("markdown ok"));
    expect(await screen.findByText("Shortcuts")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Bold"));

    expect(textarea).toHaveValue("the **ferryman** waited");
    expect(screen.queryByText("Shortcuts")).not.toBeInTheDocument(); // sheet closes
    expect(document.activeElement).toBe(textarea); // focus returns to the textarea
  });

  it("inserts a prefix marker at an empty caret", async () => {
    const textarea = await renderChronicleWithEmptyCampaign();

    fireEvent.change(textarea, { target: { value: "" } });
    textarea.setSelectionRange(0, 0);

    fireEvent.click(screen.getByText("markdown ok"));
    fireEvent.click(await screen.findByText("Pencil block"));

    expect(textarea).toHaveValue("[");
  });

  it("keeps the draft buffer holding the inserted result (NN#1 unaffected)", async () => {
    const textarea = await renderChronicleWithEmptyCampaign();
    vi.useFakeTimers();

    fireEvent.change(textarea, { target: { value: "the ferryman waited" } });
    textarea.setSelectionRange(4, 12);

    fireEvent.click(screen.getByText("markdown ok"));
    fireEvent.click(screen.getByText("Bold"));

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(window.localStorage.getItem("soljour:draft:c1:content")).toBe(
      "the **ferryman** waited",
    );
  });
});
