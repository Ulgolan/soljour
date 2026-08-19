/** Exactly two states, no others — never claims more than it knows (canon frame D). */
export function SyncLine({ state }: { state: "synced" | "unsynced" }) {
  if (state === "synced") {
    return (
      <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-[.1em] text-[var(--text-synced-label)]">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--synced-dot)]" />
        synced
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-[.1em] text-[var(--text-unsynced-label)]">
      <span
        className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[var(--accent)]"
        style={{ animationDuration: "2.6s" }}
      />
      not synced — kept locally
    </div>
  );
}
