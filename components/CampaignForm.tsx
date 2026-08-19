"use client";

import { useState } from "react";

/** Lap-2 form, unchanged — restyling is out of scope for Lap 3. */
export function CampaignForm({
  onCreate,
}: {
  onCreate: (name: string, systemLabel: string) => void;
}) {
  const [name, setName] = useState("");
  const [systemLabel, setSystemLabel] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim()) onCreate(name.trim(), systemLabel.trim());
      }}
      className="mx-auto flex w-full max-w-xs flex-col gap-3 px-6 py-10"
    >
      <label className="flex flex-col gap-1 text-sm">
        Campaign name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        System label (optional)
        <input
          value={systemLabel}
          onChange={(e) => setSystemLabel(e.target.value)}
          className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
      </label>
      <button type="submit" className="rounded bg-zinc-100 px-3 py-2 text-black">
        Create campaign
      </button>
    </form>
  );
}
