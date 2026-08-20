"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { DraftComposer, type DraftComposerHandle, type SelectionRange } from "./DraftComposer";
import { Prose } from "./Prose";
import { ShortcutSheet, type Shortcut } from "./ShortcutSheet";
import { SyncLine } from "./SyncLine";
import { ThreadList } from "./ThreadList";
import { CampaignForm } from "./CampaignForm";
import { inkPlainText } from "@/lib/prose";
import { groupEntriesByDay } from "@/lib/river";
import {
  generateCampaignMarkdown,
  exportFilename,
  type Campaign,
  type Entry,
  type Thread,
} from "@/lib/markdown";

const SELECTED_CAMPAIGN_KEY = "soljour:selected-campaign";

export function Chronicle() {
  const [campaigns, setCampaigns] = useState<Campaign[] | undefined>(undefined);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [campaignPanelOpen, setCampaignPanelOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [syncState, setSyncState] = useState<"synced" | "unsynced">("synced");
  const [whereYouWereExpanded, setWhereYouWereExpanded] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const [shortcutSheetOpen, setShortcutSheetOpen] = useState(false);
  const [entrySheetEntryId, setEntrySheetEntryId] = useState<string | null>(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [campaignPendingDeleteId, setCampaignPendingDeleteId] = useState<string | null>(null);
  const riverEndRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);
  const composerRef = useRef<DraftComposerHandle>(null);
  const shortcutSelectionRef = useRef<SelectionRange>({ start: 0, end: 0 });

  const campaign = campaigns?.find((c) => c.id === selectedCampaignId) ?? null;

  useEffect(() => {
    let active = true;
    supabase
      .from("campaigns")
      .select("id, name, system_label")
      .is("deleted_at", null)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!active) return;
        const list = data ?? [];
        setCampaigns(list);
        if (list.length === 0) return;
        const stored = window.localStorage.getItem(SELECTED_CAMPAIGN_KEY);
        const mostRecent = list[list.length - 1].id;
        setSelectedCampaignId(stored && list.some((c) => c.id === stored) ? stored : mostRecent);
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
      .is("deleted_at", null)
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
    hasScrolledRef.current = false;
  }, [campaign?.id]);

  useEffect(() => {
    if (hasScrolledRef.current || !riverEndRef.current || entries.length === 0) return;
    riverEndRef.current.scrollIntoView({ block: "end" });
    hasScrolledRef.current = true;
  }, [entries]);

  function selectCampaign(id: string) {
    setSelectedCampaignId(id);
    window.localStorage.setItem(SELECTED_CAMPAIGN_KEY, id);
    setCampaignPanelOpen(false);
  }

  async function handleCreateCampaign(name: string, systemLabel: string) {
    const { data, error } = await supabase
      .from("campaigns")
      .insert({ name, system_label: systemLabel || null })
      .select("id, name, system_label")
      .single();
    if (!error && data) {
      setCampaigns((prev) => [...(prev ?? []), data]);
      selectCampaign(data.id);
    }
  }

  async function handleDeleteCampaign(campaignId: string) {
    const { error } = await supabase
      .from("campaigns")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", campaignId);
    if (error) return;
    const remaining = (campaigns ?? []).filter((c) => c.id !== campaignId);
    setCampaigns(remaining);
    setCampaignPendingDeleteId(null);
    setCampaignPanelOpen(false);
    if (campaignId === selectedCampaignId) {
      if (remaining.length > 0) {
        selectCampaign(remaining[remaining.length - 1].id);
      } else {
        setSelectedCampaignId(null);
        window.localStorage.removeItem(SELECTED_CAMPAIGN_KEY);
      }
    }
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

  // Edit save: explicit updated_at (schema has no touch trigger), never
  // created_at — the entry keeps its day and river position. Clearing
  // editingEntryId here (not in the composer) is what swaps the bottom
  // composer back to new-entry mode on success.
  async function handleEditSave(entryId: string, content: string, title: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("entries")
      .update({ content, title: title.trim() || null, updated_at: new Date().toISOString() })
      .eq("id", entryId)
      .select("id, campaign_id, title, content, created_at")
      .single();
    if (error || !data) return false;
    setEntries((prev) => prev.map((e) => (e.id === entryId ? data : e)));
    setEditingEntryId(null);
    return true;
  }

  function handleCancelEdit() {
    setEditingEntryId(null);
  }

  async function handleDeleteEntry(id: string) {
    setEntrySheetEntryId(null);
    const { error } = await supabase
      .from("entries")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (!error) setEntries((prev) => prev.filter((e) => e.id !== id));
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

  function handleOpenShortcutSheet() {
    // Captured now, before the sheet steals focus and blurs the textarea
    // (Amendment A3) — the tap that follows applies to this stored range.
    shortcutSelectionRef.current = composerRef.current?.getSelectionRange() ?? { start: 0, end: 0 };
    setShortcutSheetOpen(true);
  }

  function handlePickShortcut(shortcut: Shortcut) {
    composerRef.current?.insertMarker(shortcutSelectionRef.current, shortcut.insertion);
    setShortcutSheetOpen(false);
  }

  function handleExportDownload() {
    if (!campaign) return;
    const markdown = generateCampaignMarkdown(
      campaign,
      entries.filter((e) => e.campaign_id === campaign.id),
      threads.filter((t) => t.campaign_id === campaign.id),
    );
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportFilename(campaign);
    a.click();
    URL.revokeObjectURL(url);
  }

  if (campaigns === undefined) {
    return (
      <p className="px-6 py-10 text-center font-mono text-xs text-[var(--text-inactive-nav)]">
        loading…
      </p>
    );
  }

  if (campaigns.length === 0 || !campaign) {
    return <CampaignForm onCreate={handleCreateCampaign} />;
  }

  // Scoped by campaign_id at render time rather than cleared in an effect:
  // switching campaigns can never flash the previous campaign's data,
  // because a stale entry/thread simply fails the filter until the fresh
  // fetch for the newly selected campaign lands.
  const visibleEntries = entries.filter((e) => e.campaign_id === campaign.id);
  const visibleThreads = threads.filter((t) => t.campaign_id === campaign.id);
  const editingEntry = editingEntryId ? (visibleEntries.find((e) => e.id === editingEntryId) ?? null) : null;
  const entrySheetEntry = entrySheetEntryId
    ? (visibleEntries.find((e) => e.id === entrySheetEntryId) ?? null)
    : null;

  const isEmpty = visibleEntries.length === 0 && visibleThreads.length === 0;
  const lastInkEntry = lastEntryWithInk(visibleEntries);
  const placeholder =
    visibleEntries.length === 0 ? "Begin the chronicle…" : "Continue the chronicle…";

  const whereYouWere = !isEmpty && (
    <WhereYouWere
      expanded={whereYouWereExpanded}
      onToggle={() => setWhereYouWereExpanded((v) => !v)}
      hasEntries={visibleEntries.length > 0}
      lastInkEntry={lastInkEntry}
      threads={visibleThreads}
      onResolve={handleResolveThread}
      onAdd={handleAddThread}
    />
  );

  // Day-group membership, precomputed once per render: the river below
  // still walks visibleEntries directly (A1) rather than nesting group
  // loops, so this is a lookup, not a second render pass.
  const dayGroups = groupEntriesByDay(visibleEntries);
  const dayLabelByEntryId = new Map<string, string>();
  const hairlineBeforeEntryId = new Set<string>();
  for (const group of dayGroups) {
    group.entries.forEach((entry, i) => {
      if (i === 0) {
        dayLabelByEntryId.set(entry.id, group.label);
      } else if (!entry.title) {
        hairlineBeforeEntryId.add(entry.id);
      }
    });
  }

  // Single tree, CSS-only reflow: on mobile everything stacks in DOM order
  // (header, brief, river, composer); at the desktop breakpoint the brief
  // moves into a sticky left rail via grid placement. Same single scroll,
  // same pinned composer, never two copies of the same control.
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col lg:grid lg:max-w-4xl lg:grid-cols-[16rem_1fr] lg:gap-x-8 lg:gap-y-6 lg:px-6 lg:py-6">
      <ChronicleHeader
        campaign={campaign}
        onExport={() => setExportOpen(true)}
        onOpenCampaigns={() => setCampaignPanelOpen(true)}
        className="lg:col-span-2"
      />

      {whereYouWere && (
        <div className="px-5 pt-4 lg:col-start-1 lg:row-start-2 lg:self-start lg:px-0 lg:pt-0 lg:sticky lg:top-6">
          {whereYouWere}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 px-5 py-4 lg:col-start-2 lg:row-start-2 lg:mx-auto lg:w-full lg:max-w-[68ch] lg:px-0 lg:py-0">
        {isEmpty ? (
          <FirstOpenInvitation />
        ) : (
          visibleEntries.map((entry) => {
            const dayLabel = dayLabelByEntryId.get(entry.id);
            return (
              <Fragment key={entry.id}>
                {dayLabel && <DayHeader label={dayLabel} />}
                {hairlineBeforeEntryId.has(entry.id) && <DayHairline />}
                <EntryCard entry={entry} onOpenActions={setEntrySheetEntryId} />
              </Fragment>
            );
          })
        )}
        <div ref={riverEndRef} />
      </div>

      <div className="sticky bottom-0 flex flex-col gap-2 border-t border-[var(--structural-border)] bg-[var(--surface)] px-5 py-2.5 lg:col-start-2 lg:row-start-3 lg:mx-auto lg:w-full lg:max-w-[68ch] lg:rounded-xl lg:border">
        {editingEntry ? (
          <DraftComposer
            key={`edit:${editingEntry.id}`}
            ref={composerRef}
            draftKey={`soljour:edit:${editingEntry.id}`}
            placeholder={placeholder}
            initialContent={editingEntry.content}
            initialTitle={editingEntry.title ?? undefined}
            onSave={(content, title) => handleEditSave(editingEntry.id, content, title)}
            onCancel={handleCancelEdit}
          />
        ) : (
          <DraftComposer
            key={campaign.id}
            ref={composerRef}
            draftKey={`soljour:draft:${campaign.id}`}
            placeholder={placeholder}
            onSave={handleSave}
          />
        )}
        <div className="flex items-center justify-between">
          <SyncLine state={syncState} />
          <button
            type="button"
            onClick={handleOpenShortcutSheet}
            className="font-mono text-[10px] text-[var(--text-meta-line)]"
          >
            markdown ok
          </button>
        </div>
      </div>

      {shortcutSheetOpen && (
        <ShortcutSheet onPick={handlePickShortcut} onClose={() => setShortcutSheetOpen(false)} />
      )}

      {exportOpen && (
        <ExportSheet
          campaign={campaign}
          entries={visibleEntries}
          threads={visibleThreads}
          onClose={() => setExportOpen(false)}
          onDownload={handleExportDownload}
        />
      )}

      {campaignPanelOpen && (
        <CampaignPanel
          campaigns={campaigns}
          selectedId={campaign.id}
          onSelect={selectCampaign}
          onCreate={handleCreateCampaign}
          onDeleteRequest={setCampaignPendingDeleteId}
          onClose={() => setCampaignPanelOpen(false)}
        />
      )}

      {entrySheetEntry && (
        <EntrySheet
          entry={entrySheetEntry}
          onEdit={(id) => {
            setEditingEntryId(id);
            setEntrySheetEntryId(null);
          }}
          onDelete={handleDeleteEntry}
          onClose={() => setEntrySheetEntryId(null)}
        />
      )}

      {campaignPendingDeleteId && (
        <CampaignDeleteConfirm
          campaign={campaigns.find((c) => c.id === campaignPendingDeleteId)!}
          onConfirm={() => handleDeleteCampaign(campaignPendingDeleteId)}
          onClose={() => setCampaignPendingDeleteId(null)}
        />
      )}
    </div>
  );
}

function ChronicleHeader({
  campaign,
  onExport,
  onOpenCampaigns,
  className = "",
}: {
  campaign: Campaign;
  onExport: () => void;
  onOpenCampaigns: () => void;
  className?: string;
}) {
  return (
    <header
      className={`flex flex-col gap-3 border-b border-[var(--structural-border)] bg-[var(--surface)] px-5 pb-3 pt-4 lg:rounded-xl lg:border ${className}`}
    >

      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={onOpenCampaigns} className="text-left">
          <h1 className="font-serif text-[20px] tracking-[.005em] text-[var(--text-primary)]">
            {campaign.name}
          </h1>
          {campaign.system_label && (
            <div className="font-mono text-[10px] uppercase tracking-[.16em] text-[var(--text-system-label)]">
              {campaign.system_label}
            </div>
          )}
        </button>
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
  // Ink only (Amendment A4) — pencil and meta blocks never surface here,
  // and inline markdown is flattened: the resume brief quotes the story,
  // never the dice.
  const trimmed = inkPlainText(content);
  if (trimmed.length <= maxLen) return trimmed;
  return `…${trimmed.slice(-maxLen).trimStart()}`;
}

function relativeDaysAgo(dateStr: string): string {
  const days = Math.max(0, Math.round((Date.now() - new Date(dateStr).getTime()) / 86_400_000));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

/**
 * Walks backward to the newest entry with any ink at all (Lap 5): a
 * pencil/meta-only entry doesn't have a story to quote, so newer such
 * entries are skipped in favor of an older one that does. The date shown
 * is that entry's own age, not "now" — the resume beat is intentionally
 * as old as the last real writing.
 */
function lastEntryWithInk(entries: Entry[]): Entry | undefined {
  for (let i = entries.length - 1; i >= 0; i--) {
    if (inkPlainText(entries[i].content)) return entries[i];
  }
  return undefined;
}

function WhereYouWere({
  expanded,
  onToggle,
  hasEntries,
  lastInkEntry,
  threads,
  onResolve,
  onAdd,
}: {
  expanded: boolean;
  onToggle: () => void;
  hasEntries: boolean;
  lastInkEntry: Entry | undefined;
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
          {lastInkEntry ? (
            <p className="font-serif text-[14.5px] italic leading-[1.62] text-[var(--text-resume-snippet)]">
              “{snippet(lastInkEntry.content)}”
              <span className="ml-2 font-mono text-[10px] not-italic text-[var(--text-meta-line)]">
                — {relativeDaysAgo(lastInkEntry.created_at)}
              </span>
            </p>
          ) : (
            hasEntries && (
              <p className="font-mono text-[11px] uppercase tracking-[.1em] text-[var(--text-meta-line)]">
                Only dice and notes so far — no story written yet
              </p>
            )
          )}
          <ThreadList threads={threads} onResolve={onResolve} onAdd={onAdd} />
        </div>
      )}
    </div>
  );
}

/**
 * The day header (rendered once per group) already carries the date, so
 * a titled entry shows only its title as the mono line; an untitled
 * entry shows no label at all and relies on the day-group hairline for
 * separation instead.
 */
function EntryCard({ entry, onOpenActions }: { entry: Entry; onOpenActions: (id: string) => void }) {
  return (
    <article className="relative flex flex-col gap-2">
      <button
        type="button"
        onClick={() => onOpenActions(entry.id)}
        aria-label="Entry actions"
        className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center font-mono text-[13px] text-[var(--text-meta-line)]"
      >
        ⋯
      </button>
      {entry.title && (
        <div className="pr-8 font-mono text-[10px] uppercase tracking-[.14em] text-[var(--text-meta-line)]">
          {entry.title}
        </div>
      )}
      <Prose content={entry.content} />
    </article>
  );
}

/**
 * The glyph is the only tap target on an entry — the reading surface
 * (title, Prose) stays inert by design. EDIT / DELETE / cancel, same
 * sheet grammar as export/campaigns; DELETE steps to a confirm inside
 * this same sheet rather than opening a second one.
 */
function EntrySheet({
  entry,
  onEdit,
  onDelete,
  onClose,
}: {
  entry: Entry;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--sheet-scrim)]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-[18px] bg-[var(--nav-track)] px-5 py-6"
      >
        {confirmingDelete ? (
          <>
            <div className="font-mono text-[10px] uppercase tracking-[.14em] text-[var(--text-secondary-prose)]">
              Delete entry
            </div>
            <p className="mt-2 font-serif text-[14.5px] leading-[1.62] text-[var(--text-secondary-prose)]">
              This entry leaves the river.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="flex-1 rounded-xl bg-[var(--input-fill)] py-3 text-center font-mono text-[11px] uppercase tracking-[.14em] text-[var(--text-quiet-button)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                className="flex-1 rounded-xl bg-[var(--accent)] py-3 text-center font-mono text-[11px] uppercase tracking-[.14em] text-[var(--canvas)]"
              >
                Confirm delete
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="font-mono text-[10px] uppercase tracking-[.14em] text-[var(--text-secondary-prose)]">
              Entry
            </div>
            <div className="mt-3 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => onEdit(entry.id)}
                className="rounded-lg px-2.5 py-2.5 text-left font-mono text-[12px] uppercase tracking-[.12em] text-[var(--text-primary)]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="rounded-lg px-2.5 py-2.5 text-left font-mono text-[12px] uppercase tracking-[.12em] text-[var(--text-primary)]"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-2.5 py-2.5 text-left font-mono text-[12px] uppercase tracking-[.12em] text-[var(--text-quiet-button)]"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DayHeader({ label }: { label: string }) {
  return (
    <div className="mt-4 font-mono text-[10px] uppercase tracking-[.14em] text-[var(--text-meta-line)] first:mt-0">
      {label}
    </div>
  );
}

/**
 * Quieter than the in-prose scene break (Prose.tsx's full-width `<hr>`):
 * short and centered, so the two never read as the same signal.
 */
function DayHairline() {
  return <hr className="mx-auto my-0 h-px w-8 border-0 bg-[var(--hairline)]" />;
}

/**
 * Utility-grade: bottom sheet on mobile, small anchored dropdown on
 * desktop — same sheet grammar as export, no independent design pass.
 * Candidate for a proper design in the campaign-panel lap.
 */
function CampaignPanel({
  campaigns,
  selectedId,
  onSelect,
  onCreate,
  onDeleteRequest,
  onClose,
}: {
  campaigns: Campaign[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCreate: (name: string, systemLabel: string) => void;
  onDeleteRequest: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--sheet-scrim)] lg:items-start lg:justify-start lg:bg-transparent"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-[18px] bg-[var(--nav-track)] px-5 py-6 lg:ml-6 lg:mt-24 lg:w-72 lg:rounded-xl lg:border lg:border-[var(--structural-border)] lg:py-4"
      >
        <div className="font-mono text-[10px] uppercase tracking-[.14em] text-[var(--text-secondary-prose)]">
          Campaigns
        </div>
        <div className="mt-3 flex flex-col gap-1">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className={`flex items-center rounded-lg px-2.5 py-2 ${
                c.id === selectedId ? "bg-[var(--active-pill)]" : ""
              }`}
            >
              <button type="button" onClick={() => onSelect(c.id)} className="flex flex-1 flex-col text-left">
                <span className="font-serif text-[15px] text-[var(--text-primary)]">{c.name}</span>
                {c.system_label && (
                  <span className="font-mono text-[9.5px] uppercase tracking-[.14em] text-[var(--text-system-label)]">
                    {c.system_label}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => onDeleteRequest(c.id)}
                aria-label={`Delete ${c.name}`}
                className="shrink-0 pl-2 font-mono text-[10px] uppercase tracking-[.14em] text-[var(--text-quiet-button)]"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-[var(--hairline)] pt-2">
          <CampaignForm onCreate={onCreate} />
        </div>
      </div>
    </div>
  );
}

/**
 * Counts are fetched live for the campaign being deleted, never read from
 * `entries`/`threads` state — that state only ever covers the currently
 * selected campaign, and the campaign being deleted here need not be it.
 */
function CampaignDeleteConfirm({
  campaign,
  onConfirm,
  onClose,
}: {
  campaign: Campaign;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [counts, setCounts] = useState<{ entries: number; threads: number } | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      supabase
        .from("entries")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaign.id)
        .is("deleted_at", null),
      supabase.from("threads").select("id", { count: "exact", head: true }).eq("campaign_id", campaign.id),
    ]).then(([entriesRes, threadsRes]) => {
      if (!active) return;
      setCounts({ entries: entriesRes.count ?? 0, threads: threadsRes.count ?? 0 });
    });
    return () => {
      active = false;
    };
  }, [campaign.id]);

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
          Delete campaign
        </div>
        <h2 className="mt-1 font-serif text-[17px] leading-[1.35] text-[var(--text-primary)]">
          {campaign.name}
        </h2>
        <p className="mt-2 font-serif text-[14.5px] leading-[1.62] text-[var(--text-secondary-prose)]">
          {counts
            ? `${counts.entries} ${counts.entries === 1 ? "entry" : "entries"} and ${counts.threads} ${
                counts.threads === 1 ? "thread" : "threads"
              } leave the journal with it.`
            : "Counting…"}
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-[var(--input-fill)] py-3 text-center font-mono text-[11px] uppercase tracking-[.14em] text-[var(--text-quiet-button)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!counts}
            className="flex-1 rounded-xl bg-[var(--accent)] py-3 text-center font-mono text-[11px] uppercase tracking-[.14em] text-[var(--canvas)] disabled:opacity-50"
          >
            Confirm delete
          </button>
        </div>
      </div>
    </div>
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
