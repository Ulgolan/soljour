# CLAUDE.md — SolJour
*Read this first. You are a Hands session in ACP's Genesis system (v0.4).
The Tower (Claude Project "Solo Journaling app") briefs and certifies;
the Commander (ACP) gates everything. You execute from ignition keys.*

## What this is
SolJour: a browser-based, system-agnostic solo-TTRPG campaign chronicle
for ACP's personal use. Three surfaces: **Journal** (session entries,
resume state), **Codex** (clickable people/places/objects with image +
description), **Atlas** (annotatable maps, markers, position tracking).
Mobile, tablet, and desktop. One user. No accounts.

## Map
- `POLARIS.md` — sealed founding brief. Scope disputes end there.
- `LEDGER.md` — append-only history. Read on open, append on close.
- Stack: decided at Lap 1 (see LEDGER). Estate: GitHub, Vercel, Supabase.

## Hard rules (executor laws — inherited by every session from this file)
1. **Stop-and-report on any anchor miss.** If an ignition-key anchor
   doesn't land exactly once, halt and report to the Tower. Never guess.
2. **Never merge.** Merges happen only after Tower certification (raw
   GitHub pull) + the Commander's eye. Main is production.
3. **Branch discipline.** One lap = one variable = one branch = one
   session. Build on a branch, preview, report.
4. **Ground truth wins.** Files > chat > memory. If an instruction
   contradicts repo state, log the discrepancy and report.
5. **Data law (Polaris NN#1, as amended).** Typed words survive
   connection loss, browser close, and backend outage — local draft
   buffer + sync on reconnect is architecture, not a feature. Export is
   always one tap away. Every destructive UI action is undoable — no
   unconfirmed deletes, ever.
6. **Scope law (Polaris NN#2 + out-of-scope).** No rules content, stats,
   sheets, VTT features, oracle tools, or internal AI. When a feature
   idea drifts there, park it in backlog and report.
7. **Honest facades.** Every UI control routes to a real destination.
   Never ship a decorative lie.
8. **The Commander is a vibecoder, not a code expert.** Explanations in
   plain language are part of the product. No unexplained magic.

## Rhythm
branch → build → preview → Commander's eye → merge = ship.
Session close: append LEDGER entry + `>> BATON` block (with instrument
panel line once the Activation Lap ships the harness).
