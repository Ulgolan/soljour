import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DraftComposer } from "../components/DraftComposer";

const PLACEHOLDER = "Continue the chronicle…";

describe("DraftComposer — draft buffer (NN#1)", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    vi.useRealTimers();
  });

  it("persists draft to localStorage and restores on remount", () => {
    vi.useFakeTimers();
    const draftKey = "soljour:draft:test-campaign";
    const onSave = vi.fn();

    const { unmount } = render(
      <DraftComposer draftKey={draftKey} placeholder={PLACEHOLDER} onSave={onSave} />,
    );
    const textarea = screen.getByPlaceholderText(PLACEHOLDER);

    fireEvent.change(textarea, { target: { value: "the party enters the ruins" } });
    vi.advanceTimersByTime(500);

    expect(window.localStorage.getItem(`${draftKey}:content`)).toBe("the party enters the ruins");

    unmount();

    render(<DraftComposer draftKey={draftKey} placeholder={PLACEHOLDER} onSave={onSave} />);
    expect(screen.getByPlaceholderText(PLACEHOLDER)).toHaveValue("the party enters the ruins");
  });

  it("hydration restores a stored draft and never clobbers typed input", () => {
    vi.useFakeTimers();
    const draftKey = "soljour:draft:test-campaign";
    const onSave = vi.fn();
    window.localStorage.setItem(`${draftKey}:content`, "stale draft from last session");

    const { unmount } = render(
      <DraftComposer draftKey={draftKey} placeholder={PLACEHOLDER} onSave={onSave} />,
    );
    const textarea = screen.getByPlaceholderText(PLACEHOLDER);

    // Restoration: the stale draft is what the composer opens with.
    expect(textarea).toHaveValue("stale draft from last session");

    // The user immediately types over it — there is no mechanism (no
    // post-mount hydration effect exists) that can revert this back to the
    // stale value.
    fireEvent.change(textarea, { target: { value: "fresh typing wins" } });
    expect(textarea).toHaveValue("fresh typing wins");

    vi.advanceTimersByTime(500);
    expect(window.localStorage.getItem(`${draftKey}:content`)).toBe("fresh typing wins");

    unmount();
    render(<DraftComposer draftKey={draftKey} placeholder={PLACEHOLDER} onSave={onSave} />);
    expect(screen.getByPlaceholderText(PLACEHOLDER)).toHaveValue("fresh typing wins");
  });

  it("saves with the title left blank", async () => {
    const draftKey = "soljour:draft:test-campaign";
    const onSave = vi.fn().mockResolvedValue(true);
    render(<DraftComposer draftKey={draftKey} placeholder={PLACEHOLDER} onSave={onSave} />);

    fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), {
      target: { value: "a short session" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save entry" }));

    await vi.waitFor(() => expect(onSave).toHaveBeenCalledWith("a short session", ""));
  });

  it("saves with a title when one is provided", async () => {
    const draftKey = "soljour:draft:test-campaign";
    const onSave = vi.fn().mockResolvedValue(true);
    render(<DraftComposer draftKey={draftKey} placeholder={PLACEHOLDER} onSave={onSave} />);

    fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), {
      target: { value: "the ferryman's price" },
    });
    fireEvent.change(screen.getByPlaceholderText("TITLE (OPTIONAL)"), {
      target: { value: "The Ferryman's Price" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save entry" }));

    await vi.waitFor(() =>
      expect(onSave).toHaveBeenCalledWith("the ferryman's price", "The Ferryman's Price"),
    );
  });

  it("clears the draft on confirmed save success, keeps it on failure", async () => {
    const draftKey = "soljour:draft:test-campaign";
    const onSave = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    render(<DraftComposer draftKey={draftKey} placeholder={PLACEHOLDER} onSave={onSave} />);
    const textarea = screen.getByPlaceholderText(PLACEHOLDER);
    const saveButton = () => screen.getByRole("button", { name: "Save entry" });

    fireEvent.change(textarea, { target: { value: "attempt one" } });

    // First attempt fails — explicitly flush the save promise before
    // asserting, rather than racing the mock's call count.
    await act(async () => {
      fireEvent.click(saveButton());
      await Promise.resolve();
    });
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveValue("attempt one");

    // Second attempt succeeds.
    await act(async () => {
      fireEvent.click(saveButton());
      await Promise.resolve();
    });
    expect(onSave).toHaveBeenCalledTimes(2);
    expect(textarea).toHaveValue("");
  });

  it("flushes to localStorage on blur, without waiting out the debounce", () => {
    vi.useFakeTimers();
    const draftKey = "soljour:draft:test-campaign";
    const onSave = vi.fn();
    render(<DraftComposer draftKey={draftKey} placeholder={PLACEHOLDER} onSave={onSave} />);
    const textarea = screen.getByPlaceholderText(PLACEHOLDER);

    fireEvent.change(textarea, { target: { value: "the storm breaks" } });
    // No vi.advanceTimersByTime — the 500ms debounce has not fired.
    expect(window.localStorage.getItem(`${draftKey}:content`)).toBeNull();

    fireEvent.blur(textarea);
    expect(window.localStorage.getItem(`${draftKey}:content`)).toBe("the storm breaks");
  });

  it("flushes to localStorage on visibilitychange → hidden, without waiting out the debounce", () => {
    vi.useFakeTimers();
    const draftKey = "soljour:draft:test-campaign";
    const onSave = vi.fn();
    render(<DraftComposer draftKey={draftKey} placeholder={PLACEHOLDER} onSave={onSave} />);
    const textarea = screen.getByPlaceholderText(PLACEHOLDER);

    fireEvent.change(textarea, { target: { value: "the lantern goes out" } });
    expect(window.localStorage.getItem(`${draftKey}:content`)).toBeNull();

    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });

    expect(window.localStorage.getItem(`${draftKey}:content`)).toBe("the lantern goes out");
  });
});
