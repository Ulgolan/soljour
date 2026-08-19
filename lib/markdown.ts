export type Campaign = {
  id: string;
  name: string;
  system_label: string | null;
};

export type Entry = {
  id: string;
  campaign_id: string;
  title: string | null;
  content: string;
  created_at: string;
};

export type Thread = {
  id: string;
  campaign_id: string;
  text: string;
  status: "open" | "resolved";
  created_at: string;
  resolved_at: string | null;
};

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

/** "28 JUL" or "28 JUL · TITLE" — the one meta-line format, canon frame F. */
export function formatEntryMeta(entry: Pick<Entry, "title" | "created_at">): string {
  const date = new Date(entry.created_at);
  const dateLabel = `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
  return entry.title ? `${dateLabel} · ${entry.title}` : dateLabel;
}

export function slugifyCampaignName(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "campaign";
}

export function exportFilename(campaign: Pick<Campaign, "name">): string {
  return `${slugifyCampaignName(campaign.name)}.md`;
}

/** Whole campaign as one plain Markdown file — title, every entry in order, then threads with status. */
export function generateCampaignMarkdown(
  campaign: Campaign,
  entries: Entry[],
  threads: Thread[],
): string {
  const lines: string[] = [`# ${campaign.name}`, ""];

  for (const entry of entries) {
    lines.push(`## ${formatEntryMeta(entry)}`, "", entry.content, "");
  }

  lines.push("## Threads", "");
  if (threads.length === 0) {
    lines.push("_none yet_", "");
  } else {
    for (const thread of threads) {
      const box = thread.status === "resolved" ? "[x]" : "[ ]";
      lines.push(`- ${box} ${thread.text}`);
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}
