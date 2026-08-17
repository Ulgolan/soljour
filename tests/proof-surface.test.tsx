import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ProofSurface } from "../components/ProofSurface";

function makeChain(result: unknown) {
  const chain: Record<string, unknown> = {};
  const self = () => chain;
  chain.select = vi.fn(self);
  chain.order = vi.fn(self);
  chain.limit = vi.fn(self);
  chain.eq = vi.fn(self);
  chain.insert = vi.fn(self);
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

describe("ProofSurface — honest failure state (no silent loss)", () => {
  afterEach(() => {
    cleanup();
    fromMock.mockReset();
  });

  it("failed save keeps the draft and shows the unsynced state", async () => {
    let entriesCalls = 0;
    fromMock.mockImplementation((table: string) => {
      if (table === "campaigns") {
        return makeChain({ data: [{ id: "c1", name: "Test Campaign", system_label: null }] });
      }
      entriesCalls += 1;
      if (entriesCalls === 1) return makeChain({ data: [] });
      return makeChain({ data: null, error: { message: "network error" } });
    });

    render(<ProofSurface />);

    const textarea = await screen.findByPlaceholderText("What happened this session?");
    fireEvent.change(textarea, { target: { value: "the tower falls" } });
    fireEvent.click(screen.getByRole("button", { name: "Save entry" }));

    expect(await screen.findByText(/not synced/i)).toBeInTheDocument();
    expect(textarea).toHaveValue("the tower falls");
  });
});
