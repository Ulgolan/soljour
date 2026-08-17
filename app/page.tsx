export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">SolJour</h1>
      <p className="mt-2 text-sm text-zinc-400">solo campaign chronicle</p>

      <div className="mt-12 flex w-full max-w-xs flex-col gap-4">
        <section className="rounded-lg border border-zinc-800 px-4 py-6">
          <h2 className="text-base font-medium">Journal</h2>
        </section>
        <section className="rounded-lg border border-zinc-800 px-4 py-6">
          <h2 className="text-base font-medium">Codex</h2>
        </section>
        <section className="rounded-lg border border-zinc-800 px-4 py-6">
          <h2 className="text-base font-medium">Atlas</h2>
        </section>
      </div>
    </div>
  );
}
