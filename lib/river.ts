import type { Entry } from "./markdown";

/**
 * Local-device day grouping for the river (Lap 5) — deliberately diverges
 * from the export header's UTC day (lib/markdown.ts formatEntryMeta): the
 * river is read on the device it was written on, so "today" should match
 * the writer's clock, not the server's. Export keeps UTC this lap
 * (Commander-ruled, reconciliation caged for a later lap).
 */

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

export type DayGroup = {
  key: string;
  label: string;
  entries: Entry[];
};

function localDayKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function localDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/**
 * Buckets entries into consecutive same-local-day runs, preserving input
 * order within and across groups — entries are assumed pre-sorted
 * chronologically (as they arrive from the campaign query).
 */
export function groupEntriesByDay(entries: Entry[]): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const entry of entries) {
    const key = localDayKey(entry.created_at);
    const current = groups[groups.length - 1];
    if (current && current.key === key) {
      current.entries.push(entry);
    } else {
      groups.push({ key, label: localDayLabel(entry.created_at), entries: [entry] });
    }
  }
  return groups;
}
