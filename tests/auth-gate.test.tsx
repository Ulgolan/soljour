import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AuthGate } from "../components/AuthGate";

const { getSessionMock, onAuthStateChangeMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  onAuthStateChangeMock: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: getSessionMock,
      onAuthStateChange: onAuthStateChangeMock,
    },
  },
}));

describe("AuthGate — the gate's decision (no navigation asserted)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("mocked no-session renders the login form", async () => {
    getSessionMock.mockResolvedValue({ data: { session: null } });
    onAuthStateChangeMock.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    render(
      <AuthGate>
        <div>proof surface</div>
      </AuthGate>,
    );

    expect(await screen.findByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.queryByText("proof surface")).not.toBeInTheDocument();
  });

  it("mocked session renders the proof surface", async () => {
    getSessionMock.mockResolvedValue({
      data: { session: { access_token: "t", user: { id: "u1" } } },
    });
    onAuthStateChangeMock.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    render(
      <AuthGate>
        <div>proof surface</div>
      </AuthGate>,
    );

    expect(await screen.findByText("proof surface")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /sign in/i })).not.toBeInTheDocument();
  });
});
