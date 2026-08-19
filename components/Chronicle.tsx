"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { DraftComposer } from "./DraftComposer";
import { SyncLine } from "./SyncLine";
import { ThreadList } from "./ThreadList";
import { CampaignForm } from "./CampaignForm";
import {
  generateCampaignMarkdown,
  exportFilename,
  formatEntryMeta,
  type Campaign,
  type Entry,
  type Thread,
} from "@/lib/markdown";

export function Chronicle() {
  const [campaign, setCampaign] = useState<Campaign | null | undefined>(undefined);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [syncState, setSyncState] = useState<"synced" | "unsynced">("synced");
  const [whereYouWereExpanded, setWhereYouWereExpanded] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const riverEndRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

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
      .select("id, campaign_id, title, content, created_at")
      .eq("campaign_id", campaign.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (active && data) setEntries(data);
      });
    supabase
      .from("threads")
      .select("id, campaign_id, text, status, created_at, resolved_at")
      .eq("campaign_id", campaign.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (active && data) setThreads(data);
      });
    return () => {
      active = false;
    };
  }, [campaign]);

  useEffect(() => {
    if (hasScrolledRef.current || !riverEndRef.current || entries.length === 0) return;
    riverEndRef.current.scrollIntoView({ block: "end" });
    hasScrolledRef.current = true;
  }, [entries]);

  async function handleCreateCampaign(name: string, systemLabel: string) {
    const { data, error } = await supabase
      .from("campaigns")
      .insert({ name, system_label: systemLabel || null })
      .select("id, name, system_label")
      .single();
    if (!error && data) setCampaign(data);
  }

  async function handleSave(content: string, title: string): Promise<boolean> {
    if (!campaign) return false;
    const { data, error } = await supabase
      .from("entries")
      .insert({ campaign_id: campaign.id, content, title: title.trim() || null })
      .select("id, campaign_id, title, content, created_at")
      .single();
    if (error || !data) {
      setSyncState("unsynced");
      return false;
    }
    setEntries((prev) => [...prev, data]);
    setSyncState("synced");
    return true;
  }

  async function handleAddThread(text: string) {
    if (!campaign) return;
    const { data, error } = await supabase
      .from("threads")
      .insert({ campaign_id: campaign.id, text })
      .select("id, campaign_id, text, status, created_at, resolved_at")
      .single();
    if (!error && data) setThreads((prev) => [...prev, data]);
  }

  async function handleResolveThread(id: string) {
    const { data, error } = await supabase
      .from("threads")
      .update({ status: "resolved", resolved_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, campaign_id, text, status, created_at, resolved_at")
      .single();
    if (!error && data) setThreads((prev) => prev.map((t) => (t.id === id ? data : t)));
  }

  function handleExportDownload() {
    if (!campaign) return;
    const markdown = generateCampaignMarkdown(campaign, entries, threads);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportFilename(campaign);
    a.click();
    URL.revokeObjectURL(url);
  }

  if (campaign === undefined) {
    return (
      <p className="px-6 py-10 text-center font-mono text-xs text-[var(--text-inactive-nav)]">
        loading…
      </p>
    );
  }

  if (campaign === null) {
    return <CampaignForm onCreate={handleCreateCampaign} />;
  }

  const isEmpty = entries.length === 0 && threads.length === 0;
  const lastEntry = entries[entries.length - 1];
  const placeholder = entries.length === 0 ? "Begin the chronicle…" : "Continue the chronicle…";

  const whereYouWere = !isEmpty && (
    <WhereYouWere
      expanded={whereYouWereExpanded}
      onToggle={() => setWhereYouWereExpanded((v) => !v)}
      lastEntry={lastEntry}
      threads={threads}
      onResolve={handleResolveThread}
      onAdd={handleAddThread}
    />
  );

  // Single tree, CSS-only reflow: on mobile everything stacks in DOM order
  // (header, brief, river, composer); at the desktop breakpoint the brief
  // moves into a sticky left rail via grid placement. Same single scroll,
  // same pinned composer, never two copies of the same control.
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col lg:grid lg:max-w-4xl lg:grid-cols-[16rem_1fr] lg:gap-x-8 lg:gap-y-6 lg:px-6 lg:py-6">
      <ChronicleHeader campaign={campaign} onExport={() => setExportOpen(true)} className="lg:col-span-2" />

      {whereYouWere && (
        <div className="px-5 pt-4 lg:col-start-1 lg:row-start-2 lg:self-start lg:px-0 lg:pt-0 lg:sticky lg:top-6">
          {whereYouWere}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-6 px-5 py-4 lg:col-start-2 lg:row-start-2 lg:mx-auto lg:w-full lg:max-w-[68ch] lg:px-0 lg:py-0">
        {isEmpty ? (
          <FirstOpenInvitation />
        ) : (
          entries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
        )}
        <div ref={riverEndRef} />
      </div>

      <div className="sticky bottom-0 flex flex-col gap-2 border-t border-[var(--structural-border)] bg-[var(--surface)] px-5 py-2.5 lg:col-start-2 lg:row-start-3 lg:mx-auto lg:w-full lg:max-w-[68ch] lg:rounded-xl lg:border">
        <DraftComposer
          draftKey={`soljour:draft:${campaign.id}`}
          placeholder={placeholder}
          onSave={handleSave}
        />
        <div className="flex items-center justify-between">
          <SyncLine state={syncState} />
          <span className="font-mono text-[10px] text-[var(--text-meta-line)]">markdown ok</span>
        </div>
      </div>

      {exportOpen && (
        <ExportSheet
          campaign={campaign}
          entries={entries}
          threads={threads}
          onClose={() => setExportOpen(false)}
          onDownload={handleExportDownload}
        />
      )}
    </div>
  );
}

function ChronicleHeader({
  campaign,
  onExport,
  className = "",
}: {
  campaign: Campaign;
  onExport: () => void;
  className?: string;
}) {
  return (
    <header
      className={`flex flex-col gap-3 border-b border-[var(--structural-border)] bg-[var(--surface)] px-5 pb-3 pt-4 lg:rounded-xl lg:border ${className}`}
    >

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-[20px] tracking-[.005em] text-[var(--text-primary)]">
            {campaign.name}
          </h1>
          {campaign.system_label && (
            <div className="font-mono text-[10px] uppercase tracking-[.16em] text-[var(--text-system-label)]">
              {campaign.system_label}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onExport}
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--input-fill)] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[.14em] text-[var(--text-quiet-button)]"
        >
          ↧ Export
        </button>
      </div>
      <nav className="flex gap-1 rounded-lg bg-[var(--nav-track)] p-1">
        <NavTab href="/" label="Journal" active />
        <NavTab href="/codex" label="Codex" />
        <NavTab href="/atlas" label="Atlas" />
      </nav>
    </header>
  );
}

function NavTab({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex-1 rounded-md py-1.5 text-center font-mono text-[10px] uppercase tracking-[.12em] ${
        active
          ? "bg-[var(--active-pill)] font-medium text-[var(--text-primary)]"
          : "text-[var(--text-inactive-nav)]"
      }`}
    >
      {label}
    </Link>
  );
}

function FirstOpenInvitation() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-2 py-10 text-center">
      <div className="font-mono text-[10px] uppercase tracking-[.14em] text-[var(--text-secondary-prose)]">
        Nothing written yet
      </div>
      <p className="font-serif text-[19px] leading-[1.6] text-[var(--text-primary)]">
        The river starts with one sentence. Write where you are, who is with you, and what you are
        afraid of — the rest of the campaign will hang off it.
      </p>
      <p className="font-serif text-[14.5px] leading-[1.62] text-[var(--text-secondary-prose)]">
        Threads and titles come later, from what you write. Nothing here is required.
      </p>
    </div>
  );
}

function snippet(content: string, maxLen = 140): string {
  const trimmed = content.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `…${trimmed.slice(-maxLen).trimStart()}`;
}

function relativeDaysAgo(dateStr: string): string {
  const days = Math.max(0, Math.round((Date.now() - new Date(dateStr).getTime()) / 86_400_000));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function WhereYouWere({
  expanded,
  onToggle,
  lastEntry,
  threads,
  onResolve,
  onAdd,
}: {
  expanded: boolean;
  onToggle: () => void;
  lastEntry: Entry | undefined;
  threads: Thread[];
  onResolve: (id: string) => void;
  onAdd: (text: string) => void;
}) {
  const openCount = threads.filter((t) => t.status === "open").length;
  return (
    <div className="rounded-xl bg-[var(--brief-card)] px-[13px] py-[14px]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-[.14em] text-[var(--text-secondary-prose)]"
      >
        <span>Where you were</span>
        <span className="flex items-center gap-2">
          {!expanded && <span>{openCount} open</span>}
          <span>{expanded ? "▲" : "▼"}</span>
        </span>
      </button>
      {expanded && (
        <div className="mt-3 flex flex-col gap-4">
          {lastEntry && (
            <p className="font-serif text-[14.5px] italic leading-[1.62] text-[var(--text-resume-snippet)]">
              “{snippet(lastEntry.content)}”
              <span className="ml-2 font-mono text-[10px] not-italic text-[var(--text-meta-line)]">
                — {relativeDaysAgo(lastEntry.created_at)}
              </span>
            </p>
          )}
          <ThreadList threads={threads} onResolve={onResolve} onAdd={onAdd} />
        </div>
      )}
    </div>
  );
}

function EntryCard({ entry }: { entry: Entry }) {
  const paragraphs = entry.content.split(/\n{2,}/).filter(Boolean);
  return (
    <article className="flex flex-col gap-2">
      <div className="font-mono text-[10px] uppercase tracking-[.14em] text-[var(--text-meta-line)]">
        {formatEntryMeta(entry)}
      </div>
      {paragraphs.map((p, i) => (
        <p key={i} className="font-serif text-[15.5px] leading-[1.72] text-[var(--text-entry-body)]">
          {p}
        </p>
      ))}
    </article>
  );
}

function ExportSheet({
  campaign,
  entries,
  threads,
  onClose,
  onDownload,
}: {
  campaign: Campaign;
  entries: Entry[];
  threads: Thread[];
  onClose: () => void;
  onDownload: () => void;
}) {
  const markdown = useMemo(
    () => generateCampaignMarkdown(campaign, entries, threads),
    [campaign, entries, threads],
  );
  const sizeKb = Math.max(1, Math.round(new Blob([markdown]).size / 1024));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--sheet-scrim)]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-[18px] bg-[var(--nav-track)] px-5 py-6"
      >
        <div className="font-mono text-[10px] uppercase tracking-[.14em] text-[var(--text-secondary-prose)]">
          Export
        </div>
        <h2 className="mt-1 font-serif text-[17px] leading-[1.35] text-[var(--text-primary)]">
          {campaign.name}
        </h2>
        <p className="mt-2 font-serif text-[14.5px] leading-[1.62] text-[var(--text-secondary-prose)]">
          Every entry and every thread, in order, as one plain Markdown file. Nothing is left behind
          and nothing is changed here.
        </p>
        <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-[var(--text-meta-line)]">
          <span>{exportFilename(campaign)}</span>
          <span>~{sizeKb} KB</span>
        </div>
        <button
          type="button"
          onClick={onDownload}
          className="mt-4 w-full rounded-xl bg-[var(--accent)] py-3 text-center font-mono text-[11px] uppercase tracking-[.14em] text-[var(--canvas)]"
        >
          Save markdown file
        </button>
      </div>
    </div>
  );
}
