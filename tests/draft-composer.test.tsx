import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DraftComposer } from "../components/DraftComposer";

describe("DraftComposer — draft buffer (NN#1)", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    vi.useRealTimers();
  });

  it("persists draft to localStorage and restores on remount", () => {
    vi.useFakeTimers();
    const draftKey = "soljour:draft:test-campaign";

    const { unmount } = render(<DraftComposer draftKey={draftKey} />);
    const textarea = screen.getByPlaceholderText("What happened this session?");

    fireEvent.change(textarea, { target: { value: "the party enters the ruins" } });
    vi.advanceTimersByTime(500);

    expect(window.localStorage.getItem(draftKey)).toBe("the party enters the ruins");

    unmount();

    render(<DraftComposer draftKey={draftKey} />);
    expect(screen.getByPlaceholderText("What happened this session?")).toHaveValue(
      "the party enters the ruins",
    );
  });
});
