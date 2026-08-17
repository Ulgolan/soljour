"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DraftComposer, type DraftComposerHandle } from "./DraftComposer";

type Campaign = {
  id: string;
  name: string;
  system_label: string | null;
};

type Entry = {
  id: string;
  campaign_id: string;
  content: string;
  created_at: string;
};

export function ProofSurface() {
  const [campaign, setCampaign] = useState<Campaign | null | undefined>(undefined);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [syncState, setSyncState] = useState<"idle" | "saving" | "unsynced">("idle");
  const composerRef = useRef<DraftComposerHandle>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("campaigns")
      .select("id, name, system_label")
      .order("created_at", { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (active) setCampaign(data?.[0] ?? null);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!campaign) return;
    let active = true;
    supabase
      .from("entries")
      .select("id, campaign_id, content, created_at")
      .eq("campaign_id", campaign.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (active && data) setEntries(data);
      });
    return () => {
      active = false;
    };
  }, [campaign]);

  async function handleCreateCampaign(name: string, systemLabel: string) {
    const { data, error } = await supabase
      .from("campaigns")
      .insert({ name, system_label: systemLabel || null })
      .select("id, name, system_label")
      .single();
    if (!error && data) setCampaign(data);
  }

  async function handleSave() {
    const content = composerRef.current?.getContent() ?? "";
    if (!campaign || !content.trim()) return;
    setSyncState("saving");
    const { data, error } = await supabase
      .from("entries")
      .insert({ campaign_id: campaign.id, content })
      .select("id, campaign_id, content, created_at")
      .single();
    if (error || !data) {
      setSyncState("unsynced");
      return;
    }
    setEntries((prev) => [data, ...prev]);
    composerRef.current?.clear();
    setSyncState("idle");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <button
        onClick={() => supabase.auth.signOut()}
        className="self-end text-xs text-zinc-500 underline"
      >
        sign out
      </button>

      {campaign === undefined && <p className="text-center text-sm text-zinc-500">loading…</p>}

      {campaign === null && <CampaignForm onCreate={handleCreateCampaign} />}

      {campaign && (
        <>
          <DraftComposer ref={composerRef} draftKey={`soljour:draft:${campaign.id}`} />
          <button
            onClick={handleSave}
            disabled={syncState === "saving"}
            className="rounded bg-zinc-100 px-3 py-2 text-black"
          >
            Save entry
          </button>
          {syncState === "unsynced" && (
            <div className="rounded border border-amber-700 bg-amber-950 px-3 py-2 text-sm text-amber-300">
              not synced — kept locally
              <button onClick={handleSave} className="ml-2 underline">
                retry
              </button>
            </div>
          )}
          <ul className="flex flex-col gap-3">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="whitespace-pre-wrap rounded border border-zinc-800 px-3 py-2 text-sm"
              >
                {entry.content}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function CampaignForm({
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
      className="mx-auto flex w-full max-w-xs flex-col gap-3"
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
