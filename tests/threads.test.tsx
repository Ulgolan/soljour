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
  chain.is = vi.fn(self);
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

describe("Threads — created via the + row, resolved threads stay rendered", () => {
  afterEach(() => {
    cleanup();
    fromMock.mockReset();
    window.localStorage.clear();
  });

  it("creates a thread, then resolves it, and the resolved thread remains visible", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") {
        return makeChain({ data: [{ id: "c1", name: "Test Campaign", system_label: null }] });
      }
      if (table === "entries") {
        return makeChain({
          data: [
            {
              id: "e1",
              campaign_id: "c1",
              title: null,
              content: "an existing entry",
              created_at: "2026-07-28T10:00:00Z",
            },
          ],
        });
      }
      // threads
      const chain = makeChain({ data: [] });
      chain.insert = vi.fn((row: Record<string, unknown>) =>
        makeChain({
          data: {
            id: "t1",
            campaign_id: "c1",
            text: row.text,
            status: "open",
            created_at: "2026-07-28T10:00:00Z",
            resolved_at: null,
          },
          error: null,
        }),
      );
      chain.update = vi.fn(() =>
        makeChain({
          data: {
            id: "t1",
            campaign_id: "c1",
            text: "who paid the ferryman?",
            status: "resolved",
            created_at: "2026-07-28T10:00:00Z",
            resolved_at: "2026-07-29T10:00:00Z",
          },
          error: null,
        }),
      );
      return chain;
    });

    render(<Chronicle />);
    await act(async () => {});

    const newThreadInput = await screen.findByPlaceholderText("a loose end, one line…");
    fireEvent.change(newThreadInput, { target: { value: "who paid the ferryman?" } });
    fireEvent.keyDown(newThreadInput, { key: "Enter" });

    const threadButton = await screen.findByRole("button", { name: "who paid the ferryman?" });
    // Resolve is async (a real Supabase round trip in production); flush it
    // explicitly rather than racing findByText's own retry timing.
    await act(async () => {
      fireEvent.click(threadButton);
      await Promise.resolve();
      await Promise.resolve();
    });

    const resolved = await screen.findByText("who paid the ferryman?");
    expect(resolved).toBeInTheDocument();
    expect(resolved.tagName).not.toBe("BUTTON");
    expect(screen.queryByRole("button", { name: "who paid the ferryman?" })).not.toBeInTheDocument();
  });
});
