import Link from "next/link";

/** Honest minimal placeholder — a truthful destination, not a dead tab. */
export function SurfacePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[var(--canvas)] px-6 py-10 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[.14em] text-[var(--text-inactive-nav)]">
        {label} — arrives with its lap
      </p>
      <Link
        href="/"
        className="font-mono text-[10px] uppercase tracking-[.14em] text-[var(--accent)]"
      >
        ← Journal
      </Link>
    </div>
  );
}
