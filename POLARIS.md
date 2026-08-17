# POLARIS — SolJour
*Sealed by the Commander on 2026-08-17. This file is the founding intent.
Audits run against this text and nothing else. Changes require a formally
updated brief, dated and logged — no silent drift.*

```
=== POLARIS BRIEF ===
Project: SolJour (solo journaling)
Date: 2026-08-17
Class: OPERATOR TOOL — ACP is the sole user, declared.

GOAL
A browser-based, mobile-and-desktop campaign chronicle that lets ACP
journal solo TTRPG sessions in any system, recall every person, place,
and object on click, and track movement on annotated maps — so that an
interrupted campaign can be resumed cold, weeks later, without losing
a single thread.

AUDIENCE / BENEFICIARY
ACP alone — the solo player at the table on desktop, on the couch with
a tablet, or in bed with a phone, playing in interrupted fragments.

NON-NEGOTIABLES
1. Nothing is ever lost — a session entry, once typed, survives
   connection loss, browser close, and backend outage (local draft
   buffer, sync on reconnect). Durable backend storage (own Supabase)
   + campaign export (JSON/Markdown + assets) always one tap away.
   Decided at architecture level, day one.
2. System-agnostic — no rules, no stats, no sheets, no system-specific
   content anywhere in the tool. Journaling primitives only.
3. Entities are first-class — people, places, objects are clickable
   records with image + description, reachable from journal and map.

OUT-OF-SCOPE
- VTT features: tokens, grids, 3D dice, initiative, fog of war
- Character sheets, stat tracking, rules content of any system
- Oracle/dice tools (Mythic 2 Companion app owns that seat)
- Any internal AI — background or on-demand
- Accounts, multi-user, monetization

SUCCESS CRITERIA
Live-fire. Trial clock starts the day the Journal surface is usable
(not full V1); Codex and Atlas land during the trial. A "session" =
any play sitting that produces ≥1 journal entry, fragments included.
Target: 3 sessions/week × 4 weeks; cold-open-to-writing in seconds;
entity recall replaces re-reading old notes; zero lost words. It
worked when the paper notebook stays closed.

=== END BRIEF ===
```

## The three surfaces (interpretation of GOAL, for briefing Hands)
1. **Journal** — session entries, running narrative, "where was I" resume state.
2. **Codex** — people / places / objects as linked records: image + description.
3. **Atlas** — interactive maps: annotations, markers, position tracking,
   attached images and descriptions for locations.

## Logged deviations from the source research (conscious, Commander-ruled)
- **Oracle excised** (research JTBD #1): Mythic 2 Companion app owns the
  oracle seat; rebuilding it is waste. **Dated revisit trigger:** the
  app-switch friction is formally assessed at trial week 2; verdict
  logged to LEDGER (keep / V2 candidate). Not vibes — a checkpoint.
- **Offline law partially relaxed** (research pain #3): full
  offline-first is not required, but NN#1 (as amended) hard-codes the
  survivable-writing guarantee: local draft buffer, sync on reconnect.
  The spirit of the law — writing is never lost, a copy always exists
  in a format/location ACP controls — is binding architecture law.

## Rulings outside the brief
- **Backlog migration: OUT of V1.** The handwritten-session backlog
  enters via the existing `solo-rpg-digitization` pipeline + paste-in;
  no migration tooling gets built. (Ruled 2026-08-17.)
- **Trial campaign: TBD** — owed before the trial clock starts. Live
  fire needs live ammo.

## Amendments log
- **2026-08-17 (same-day re-seal):** Tribunal run (verdict Amber)
  produced three amendments — NN#1 survivable-writing guarantee,
  success-criteria start line + session definition, dated oracle
  revisit trigger. Re-sealed by the Commander 2026-08-17.

*Source research: `solo-companion-research-conclusions.md` (Gemini Deep
Research, Aug 2026), held in the Claude Project files.*
