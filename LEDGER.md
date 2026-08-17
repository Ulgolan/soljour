# LEDGER — SolJour
*Append-only. Read on session open, append on session close. The files
are the institution; chats are disposable.*

---

## Entry #1 — 2026-08-17 — Project birth (Phase R complete)
**Session:** Tower (Claude Project "Solo Journaling app"), first chat.
**Genesis version at birth:** v0.4.

- Project born from `solo-companion-research-conclusions.md` (Gemini
  Deep Research, Aug 2026) + Commander rulings in-session.
- **Polaris brief sealed** by the Commander. Class: OPERATOR TOOL.
  Name ruled: **SolJour**. Success window ruled: 3 sessions/week × 4 weeks.
- **Shape ruled:** three surfaces — Journal, Codex, Atlas. Maps are
  V1 (annotation, markers, position, location images) — journaling
  feature, not VTT. System-agnostic in the broadest sense.
- **Deviations from research, logged consciously:**
  1. Oracle excised — Mythic 2 Companion app owns that seat.
  2. Offline-first relaxed — data law satisfied via owned Supabase +
     automated export instead. Spirit of the law intact.
- **Boundary ruled:** no crunch/rules anywhere (broader than the old
  Quartermaster-boundary question — SolJour knows no system at all).
- Trinity drafted this session: CLAUDE.md stub, LEDGER.md, POLARIS.md.
- **Repo:** does not exist yet. Lap 1 creates it with these three files
  as the founding commit.
- **Open for Lap 1:** stack/platform call (constrained by data law NN#1
  + browser-based + three form factors), scaffold, deploy pipeline.
- ⚙ clauses: dormant — no harness exists. Activation Lap owed after
  first working scaffold.

>> BATON (superseded by entry #2)
Phase R closed. Trinity exists (in Tower workspace, awaiting founding
commit). Brief sealed 2026-08-17. Next: Tower drafts Ignition Key #1 —
repo birth + stack decision + walking skeleton. No build has occurred.
HARNESS: n/a — pre-repo.

---

## Entry #2 — 2026-08-17 — Tribunal on the sealed brief → Amber → re-seal
**Session:** same Tower session as entry #1. Commander invoked
`red-team-protocol` on the Phase R output.

- **Verdict: AMBER.** Key findings: (Sniper) Supabase-only writes with
  no local buffer would reintroduce the category's #1 pain — words lost
  to a dropped connection — violating NN#1's spirit; (Architect)
  "automated export" was architecturally underspecified for a browser
  app, and "3 sessions/week" lacked a unit and a start line; (Advocate)
  trial clock tied to full V1 was a rabbit burrow — Journal-first ships
  the clock earlier.
- **Three amendments applied to POLARIS.md, re-sealed by the Commander
  same day:** NN#1 survivable-writing guarantee (local draft buffer,
  sync on reconnect, export one tap away); success criteria gained a
  start line (Journal usable) + session definition (any sitting with
  ≥1 entry); oracle deviation gained a dated revisit trigger (trial
  week 2, verdict to LEDGER).
- **Ruled:** backlog migration OUT of V1 (digitization pipeline +
  paste-in covers it). **Owed:** trial campaign named before the trial
  clock starts.
- Tower error, ledgered per §4: the original offline-law relaxation
  reasoning was seduced by available tooling (Supabase in the estate)
  and under-weighted the on-the-go writing scenario. Caught by the
  Tribunal, not by the Tower's first pass.

>> BATON
Phase R closed, brief tribunal-tested and re-sealed 2026-08-17. Trinity
current in Tower workspace, awaiting founding commit. Next: Ignition
Key #1 — repo birth (trinity as commit zero) + stack decision (must
satisfy amended NN#1: local draft buffer + sync) + walking skeleton
deployed. Journal surface is Lap-priority so the trial clock can start
early. No build has occurred.
HARNESS: n/a — pre-repo.

---

## Entry #3 — 2026-08-17 — Lap 1: repo birth + walking skeleton
**Session:** Hands (Claude Code, Sonnet), executing Ignition Key #1.

- All four anchors verified before start (folder contents; `POLARIS.md`
  Class: OPERATOR TOOL ×1; `CLAUDE.md` Stop-and-report ×1; `LEDGER.md`
  Entry #2 ×1). No improvisation needed.
- **Repo born.** `git init`, trinity committed alone as commit zero:
  `commit zero — the trinity (POLARIS, CLAUDE, LEDGER)`,
  SHA `ca97eb6ab67a69921fa919603538fc1f45d75c6d`.
- **GitHub:** private repo `Ulgolan/soljour` created (`gh repo create`),
  `main` set as default branch, commit zero pushed.
- **Stack scaffolded on branch `lap-1-skeleton`:** Next.js (App Router)
  + TypeScript + Tailwind, coexisting with the trinity at repo root.
  `create-next-app` refused to run in-place (trinity files read as
  conflicts), so the scaffold was generated in a scratch dir and
  merged in — its own generated `CLAUDE.md`/`README.md`/`AGENTS.md`
  were dropped so the sealed doctrine file was never at risk of being
  overwritten.
- Landing page replaced: dark-mode placeholder — "SolJour", subtitle
  "solo campaign chronicle", three inert sections (Journal · Codex ·
  Atlas). Verified rendering legibly at a 380px viewport via the
  in-app browser preview.
- `npm run build` exits 0. README.md added (5 lines, points to
  POLARIS.md, states main is production).
- Skeleton committed: `lap 1 — Next.js walking skeleton (App Router +
  TypeScript + Tailwind)`, SHA `a616ae2be14a7d951f23e282f4daf455cde3e5ba`.
  Branch pushed to origin.
- **Vercel:** CLI not present in this environment (`vercel` command not
  found). Per the ignition key's stated acceptable exit, stopped at the
  push — Commander connects the repo via the Vercel dashboard
  (Import Project → soljour).
- No merge performed. Main holds only commit zero.

>> BATON
Lap 1 walking skeleton exists and builds clean on `lap-1-skeleton`,
unmerged. Repo: github.com/Ulgolan/soljour (private). Commit zero
`ca97eb6a`, skeleton head `a616ae2b`. Vercel not connected — Commander
to Import Project in the Vercel dashboard, or provide `vercel` CLI
auth for a future lap to link/deploy. Next: Tower certifies (raw
GitHub pull) before any merge to main; then stack decision detail
(data layer / Supabase, satisfying amended NN#1) is Lap 2+ territory.
HARNESS: n/a — pre-harness (Activation Lap owed).

---

## Entry #4 — 2026-08-17 — Lap 1 merged: main is live production
**Session:** Hands (Claude Code, Sonnet), executing the merge micro-key
under Tower certification + Commander's eye.

- **Lap 1 certified by the Tower: PASS.** Trinity byte-identical at
  `ca97eb6`; branch diff clean; zero forbidden dependencies; build
  independently corroborated.
- One MINOR finding, T2, caged in backlog: `next/font/google` fetches
  fonts at build time (external build dependency); self-host during a
  future design pass.
- Repo flipped **PUBLIC** by the Commander (2026-08-17) to give the
  Tower raw-pull certification access — standing regime from now on.
- Vercel connected (project: soljour). Empty commit `8f671afe`
  triggered the branch preview; Commander's eye passed on the preview.
- **Merge authorized by the Tower, executed this session:**
  `git merge --ff-only lap-1-skeleton` into `main`. No squash, no
  rebase, no merge commit — clean fast-forward. `lap-1-skeleton`
  branch retained (history stays).
- Main's new head: `8f671afead46eddce132f030c81286382fa8f679`.

>> BATON
Lap 1 shipped, main is live production. Owed next: Lap 2 ignition key
(data layer / Supabase under amended NN#1 — Tower drafts), Activation
Lap (3–5 tests + CI, owed now that a buildable app exists), trial
campaign named before Journal goes live-fire.
HARNESS: n/a — pre-harness (Activation Lap owed).

---

## Entry #5 — 2026-08-17 — Activation Lap: the harness ships

**Session:** Hands (Claude Code, Sonnet), executing the Activation Lap
ignition key under Tower ruling.

- **Incident, first anchor miss of the project** (≤5 lines): the key's
  branch-point anchor was frozen at `8f671afe` (main's tip when the
  Tower drafted the key) rather than the live tip `935ffba` (main
  had since advanced by one doc-only commit — Entry #4 itself landing
  on main). Caught by Hard Rule #1 before any branch, build, or file
  touched. Zero cost. Root cause Tower-side, not Hands-side.
- **Tower ruling on resumption:** `git diff --stat 8f671afe..935ffba`
  verified as exactly one file, `LEDGER.md`, insertions only —
  `935ffba9c7de47f248e61b0c40953e0d5d7877c8` certified as true base.
  **RULING (Commander/Tower):** session-close LEDGER appends may land
  directly on `main` in this repo, certified post-hoc by the Tower —
  mirror of the Genesis doc-only exemption. This makes `935ffba`
  retroactively legal, not just tolerated.
- **Standing fix:** future ignition keys anchor the branch point as
  "current main tip, verified as doc-only ledger-append since the
  last certified SHA" — never a frozen SHA alone.
- **Harness shipped** on branch `activation-lap` (off `935ffba`):
  Vitest + `@testing-library/react` + jest-dom + jsdom as
  devDependencies only (no existing dependency bumped). 4 tests in
  `tests/skeleton.test.tsx` — h1 "SolJour", subtitle "solo campaign
  chronicle", exactly three sections headed Journal/Codex/Atlas in
  order, `package.json` identity (`name: soljour`, `next` dependency).
  `npm run test` and `npm run build` both green/exit-0 locally.
- **Separation law:** tests authored by this session; code under test
  (`app/page.tsx`) authored by the Lap 1 session; certification owed
  to the Tower before merge.
- **CI:** `.github/workflows/ci.yml`, job `harness`, triggers on
  `pull_request` to `main` and `push` to `main` — checkout, setup-node
  (LTS, npm cache), `npm ci`, `npm run build`, `npm run test`.
- **PR opened:** github.com/Ulgolan/soljour/pull/1, title `activation
  lap — harness (4 tests + CI, red blocks merge)`. CI run green on the
  PR (run 32025122878, job `harness`, ~31s). **Not merged** — Tower
  certifies from a raw pull, then Commander's eye, then merge.
- **Branch protection: NOT SET — blocked, handed to Commander.** `gh`
  token carries `admin:true` on the repo (scope was never the
  blocker), but the Claude Code auto-mode classifier refused the
  `PUT .../branches/main/protection` call as a security-setting
  change. Manual steps for the Commander (or run the `gh api` command
  below from a terminal you control):
  - GitHub UI: repo → Settings → Branches → Add branch ruleset (or
    "Add rule" under legacy protection) for `main` → require status
    checks to pass before merging → search/select `harness` → also
    enable "Do not allow bypassing the above settings" (admin-enforced)
    → no required approving reviews (solo operator) → Save.
  - Or via CLI:
    `gh api -X PUT repos/Ulgolan/soljour/branches/main/protection -f required_status_checks.strict=true -f 'required_status_checks.contexts[]=harness' -F enforce_admins=true -F required_pull_request_reviews=null -F restrictions=null`

>> BATON
Harness ships, unmerged, on `activation-lap` → PR #1, CI green. Owed
next: Tower certification of PR #1 (raw pull), Commander's eye, then
merge (Hands does not merge). Branch protection toggle owed to the
Commander (manual steps above) — until set, red does not yet
mechanically block the merge button. After that: Lap 2 ignition key
(data layer / Supabase under amended NN#1).
HARNESS: 4 tests green · last full eval n/a (no AI — Eval Law does not apply) · signals n/a

---

## Entry #6 — 2026-08-17 — PR #1 certified, merge authorized and executing

**Session:** Hands (Claude Code, Sonnet), executing the Tower's merge
ruling on the Activation Lap.

- **PR #1 certified PASS by the Tower**, independent run: build exit 0,
  4/4 tests green, diff clean, trinity untouched.
- **Commander's eye: passed.**
- **Branch protection: ACTIVE.** Ruleset `harness-gate` on `main` —
  required check `harness`, empty bypass list (admin-enforced). Set
  via the GitHub UI/ruleset path, not the CLI — the `gh api` command
  logged in Entry #5 was wrong: dotted keys (e.g.
  `required_status_checks.strict=true`) don't nest into the JSON body
  the classic-protection endpoint expects; that call would have needed
  a JSON payload (`--input`) or the newer rulesets API, not flat `-f`
  dot-paths. Correction logged here for the next session that reaches
  for it.
- **New convention:** the gate checks commits at push time, so a
  merge micro-entry (this one) rides the lap branch *before* the
  merge, not after — pushing straight to `main` post-merge would land
  an unchecked commit and the gate would reject it. Session-close
  ledger appends that land *after* a merge is complete (as in Entry #4
  under the doc-only exemption) are a different case from a ledger
  commit that is itself part of what gets merged.
- **Merge authorized by the Tower, executing this session:**
  `git merge --ff-only activation-lap` into `main` once this commit's
  `harness` check is green. No squash, no rebase, no merge commit.
  `activation-lap` branch retained (history stays).

>> BATON
Activation Lap complete: harness live, CI enforced, main gated.
Main's new head recorded in the merge report to the Tower. Owed next:
Lap 2 ignition key (data layer / Supabase under amended NN#1 — Tower
drafts).
HARNESS: 4 tests green · last full eval n/a (no AI — Eval Law does not apply) · signals n/a

---

## Entry #7 — 2026-08-17 — Lap 2: locked pipe (schema + auth gate + draft buffer)

**Session:** Hands (Claude Code, Sonnet), executing Ignition Key #2
plus the Tower Addendum, on branch `lap-2-locked-pipe` (off main tip
`226636b`; branch-point law verified empty, all 3 anchors landed
exactly once).

- **Checkpoint 1 (migration SQL): PASS.** `supabase/migrations/
  0001_campaigns_entries.sql` reported verbatim, certified and applied
  live by the Tower to project `ltcuhxvshypigrvnxmdl`. Tower-verified:
  `campaigns` + `entries` exist, RLS on both, FK `entries.campaign_id`
  → `campaigns.id` present, schema matches the in-repo file exactly.
  One MINOR caged for a future lap (T2): `updated_at` has no
  auto-update trigger — irrelevant while the UI only inserts.
- **Dependency + env:** `@supabase/supabase-js` (^2) added.
  `.env.local` created (gitignored, verified absent from `git status`)
  with the two provisioned publishable values. `.env.example`
  committed with names only; `.gitignore` gained a `!.env.example`
  exception per addendum item C.
- **Auth gate + proof surface, built at root `/`** (not a side route):
  `lib/supabaseClient.ts` (browser client), `components/LoginForm.tsx`,
  `components/AuthGate.tsx` (session check via `getSession` +
  `onAuthStateChange`, no router redirect — renders the login form or
  its children directly), `app/login/page.tsx` (standalone route for
  direct navigation), `components/DraftComposer.tsx` (draft buffer,
  ref-exposed `getContent`/`clear`, ≤1s-debounced localStorage write
  keyed `soljour:draft:<campaignId>`, restores on mount),
  `components/ProofSurface.tsx` (first-load campaign creator; composer
  + Save entry + newest-first plain-text list; failed save keeps the
  draft and shows an honest "not synced — kept locally" state with a
  retry button; visible "sign out" link). No DELETE anywhere in the UI.
- **Mid-lap contradiction, ruled by the Commander standing in as
  Tower (2026-08-17):** step 5 ("root layout/page: unauthenticated →
  /login; authenticated → proof surface") and steps 8–9's arithmetic
  ("+3 tests → 7 total," "harness runs 7/7 green") cannot both hold —
  the ignition key's own math assumed Lap 1's walking skeleton
  (h1 + subtitle + Journal/Codex/Atlas cards, `tests/skeleton.test.tsx`,
  4 tests) survives a step that orders its replacement. Flagged via a
  stop-and-report rather than guessed, per the executor laws (never
  guess; log the discrepancy and report). **Ruling: Option 1 — replace
  root.** Root belongs to the app (cold-open-to-writing; a decorative
  lobby is an honest-facades smell). **Test doctrine set for the
  record:** the harness photographs certified current behavior; a
  certified lap that changes that behavior retakes the photograph —
  it does not carry the old photograph forward as a "+" on top of new
  behavior. **Retired with the feature:** the 3 skeleton-UI assertions
  (h1 "SolJour" alone, subtitle "solo campaign chronicle", exactly
  three Journal/Codex/Atlas sections) — all false of the new root page.
  **Kept:** the package.json identity assertion (still true, page-
  independent). This is Tower arithmetic error #2 logged against this
  project (Entry #5 logged the first, on the `gh api` protection call).
- **Harness (Tower-amended count — 5, not 7):** `tests/skeleton.test.tsx`
  (package.json identity, kept), `tests/auth-gate.test.tsx` (mocked
  no-session renders the login form; mocked session renders the proof
  surface — addendum item B: the gate's rendering decision is asserted
  directly, no `next/navigation` mock, because `AuthGate` renders
  inline rather than redirecting), `tests/draft-composer.test.tsx`
  (persists to localStorage, restores on remount, jsdom, fake timers),
  `tests/proof-surface.test.tsx` (failed save keeps the draft, shows
  the unsynced state; Supabase client fully mocked, no network).
  5/5 green locally. `npm run build` exit 0, `npm run lint` clean.
- **Toolchain snag, fixed, unrelated to app code:** Node 25's built-in
  `localStorage` global shadows jsdom's in this Vitest environment
  (`window.localStorage.getItem is not a function`). Fixed with a
  small in-memory `Storage` shim installed in `tests/setup.ts`
  (`vitest.config.mts` gained `setupFiles` + a `@` → repo-root
  `resolve.alias`, since Vitest doesn't read `tsconfig.json` paths on
  its own). No production code touched by this fix.
- **CI env (addendum item A):** job-level `env:` added to the
  `harness` job in `.github/workflows/ci.yml` with the two publishable
  values — client-safe by design, needed because `next build`
  server-renders the client-component tree once and the runner has no
  `.env.local`.
- **ff-merge convention, reconfirmed:** Entry #6's "no merge commit"
  held — the Tower certified from a raw pull, the Commander approved
  the merge prompts in-session, the Hands executed `git merge
  --ff-only`. Standing convention: merges are Commander-approved
  in-session; the Hands never merges unprompted. This lap follows the
  same shape — PR opened, not merged.
- **Commander-at-keyboard verification (addendum item D): HANDED OFF,
  outcome pending.** The Hands built the mocked/unit-level proof (the
  failed-save test above) but the *live* proof — log in as the
  Commander, type → reload → draft survives, Save → row exists,
  airplane-mode save → honest unsynced state — needs the Commander's
  own hands and his own credentials, which the Hands never holds or
  requests. Local steps handed to him in-session (see chat).

>> BATON
Locked pipe built and pushed on `lap-2-locked-pipe`, PR opened,
unmerged. Owed next: the Commander's live airplane-mode verification
(steps handed to him this session); Tower/Commander review of the mid-
lap root-replacement ruling once they see the diff; then Tower
certification → Commander's eye on the Vercel preview → Commander-
approved `--ff-only` merge, per standing convention. After that: Lap 3
(the real, designed Journal surface — this lap's proof surface was
deliberately ugly and was never meant to survive it).
HARNESS: 5 tests green · last full eval n/a (no AI — Eval Law does not apply) · signals n/a
