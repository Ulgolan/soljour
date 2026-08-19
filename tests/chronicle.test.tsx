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

const { fromMock, signOutMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  signOutMock: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: { signOut: signOutMock },
    from: fromMock,
  },
}));

describe("Chronicle — honest failure state (no silent loss)", () => {
  afterEach(() => {
    cleanup();
    fromMock.mockReset();
    window.localStorage.clear();
  });

  it("failed save keeps the draft and title, and shows the unsynced state", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") {
        return makeChain({ data: [{ id: "c1", name: "Test Campaign", system_label: null }] });
      }
      if (table === "entries") {
        const readChain = makeChain({ data: [] });
        readChain.insert = vi.fn(() =>
          makeChain({ data: null, error: { message: "network error" } }),
        );
        return readChain;
      }
      return makeChain({ data: [] });
    });

    render(<Chronicle />);

    const textarea = await screen.findByPlaceholderText("Begin the chronicle…");
    await act(async () => {}); // flush pending effects (data load) before typing
    fireEvent.change(textarea, { target: { value: "the tower falls" } });
    fireEvent.change(screen.getByPlaceholderText("TITLE (OPTIONAL)"), {
      target: { value: "The Fall" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save entry" }));

    expect(await screen.findByText(/not synced/i)).toBeInTheDocument();
    expect(textarea).toHaveValue("the tower falls");
    expect(screen.getByPlaceholderText("TITLE (OPTIONAL)")).toHaveValue("The Fall");
  });

  it("saves an entry with a title, and one without", async () => {
    const inserted: Array<Record<string, unknown>> = [];
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") {
        return makeChain({ data: [{ id: "c1", name: "Test Campaign", system_label: null }] });
      }
      if (table === "entries") {
        const readChain = makeChain({ data: [] });
        readChain.insert = vi.fn((row: Record<string, unknown>) => {
          inserted.push(row);
          return makeChain({
            data: { id: `e${inserted.length}`, campaign_id: "c1", created_at: "2026-07-28T10:00:00Z", ...row },
            error: null,
          });
        });
        return readChain;
      }
      return makeChain({ data: [] });
    });

    render(<Chronicle />);
    const textarea = await screen.findByPlaceholderText("Begin the chronicle…");
    await act(async () => {});

    fireEvent.change(textarea, { target: { value: "a titled entry" } });
    fireEvent.change(screen.getByPlaceholderText("TITLE (OPTIONAL)"), {
      target: { value: "A Title" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save entry" }));
    await vi.waitFor(() => expect(inserted).toHaveLength(1));
    expect(inserted[0]).toMatchObject({ content: "a titled entry", title: "A Title" });

    const nextTextarea = await screen.findByPlaceholderText("Continue the chronicle…");
    fireEvent.change(nextTextarea, { target: { value: "an untitled entry" } });
    fireEvent.click(screen.getByRole("button", { name: "Save entry" }));
    await vi.waitFor(() => expect(inserted).toHaveLength(2));
    expect(inserted[1]).toMatchObject({ content: "an untitled entry", title: null });
  });
});
