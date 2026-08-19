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

---

## Entry #8 — 2026-08-17 — PR #2 certified, merge authorized and executing

**Session:** Hands (Claude Code, Sonnet), executing the Tower's merge
ruling on Lap 2.

- **PR #2 certified PASS by the Tower**, independent run: build exit 0,
  5/5 tests green, migration byte-identical to what the Tower applied
  at Checkpoint 1, env hygiene clean, zero `service_role` anywhere,
  zero deletes (no DELETE policy, no DELETE UI).
- **Commander's eye: passed** on the Vercel preview, including the
  airplane-mode scenario (addendum item D verification).
- **Merge micro-entry convention (Entry #6) followed again:** this
  entry rides the lap branch *before* the merge so the `harness` gate
  checks it at push time.
- **Merge authorized by the Tower, executing this session:**
  `git merge --ff-only lap-2-locked-pipe` into `main` once this
  commit's `harness` check is green. No squash, no rebase, no merge
  commit. `lap-2-locked-pipe` branch retained (history stays).

>> BATON
Lap 2 complete: locked persistence pipe live on `main` — schema, RLS,
auth gate, draft buffer, all Commander-verified including the
airplane-mode scenario. Main's new head recorded in the merge report
to the Tower. Owed next: Lap 3 ignition key (the real, designed
Journal surface — this lap's proof surface was deliberately ugly and
is now retired by design, not by accident).
HARNESS: 5 tests green · last full eval n/a (no AI — Eval Law does not apply) · signals n/a

---

## Entry #9 — 2026-08-17 — Session close: Tower Session 2 retires, open threads for Lap 3

**Session:** Hands (Claude Code), executing the Tower's close-out
order under the ledger-append law (A-2), riding branch
`session-close-9` for its gate check per the pre-merge codicil.

- **Genesis v0.5 adopted.** Amendment Package A-2 "The Ledger's
  Gravity" gaveled by the Commander at this boundary: branch-point
  law, ledger-append law + pre-merge micro-entry codicil, photograph
  doctrine. Application to `acp-doctrine` in flight via a separate
  chat; R3 adjudicates alongside A-1. §0 of this Project's
  instructions refreshed same day (repo reference + v0.5 note).
  SolJour's pasted body remains authentic v0.4 birth text by ruling —
  annotate, don't re-paste; repo law binds via this ledger.
- **Gate discovery, same day:** the harness-gate ruleset blocks ALL
  unchecked pushes to main including web-editor edits by the
  Commander. Consequence: in a gated repo, every main-bound commit —
  ledger appends included — rides a branch for its check first. Third
  Tower briefing error of the day (web-editor paste suggestion),
  third catch before any cost. Logged as R3 evidence on the A-2
  ledger-append clause.
- **Open thread — the christening.** The trial campaign's identity is
  OPEN. Do not assume WFRP: the Commander has signaled unknowns on
  the horizon ("many unknowns... hehehe" — recorded verbatim as
  evidence of mischief). The campaign named "test" was live-fire
  proof only.
- **Open thread — the immortal "test".** No delete capability exists
  by design (Data law); the "test" campaign row persists until a
  future lap builds archiving. This is law working, not residue.
- **Lap 3 gates, from the Polaris — the next Tower drafts Ignition
  Key #3 against these:** (1) the designed Journal surface — first
  activation of the DESIGN GATE, taste verdict sovereign; (2)
  cold-open resume brief (open the app → where-was-I in seconds);
  (3) NN#1's "export one tap away" must exist BEFORE live-fire
  begins — Lap 3 or Lap 4 scope, never "someday". Caged MINORs
  remain in Entries #7–#8 (updated_at trigger, flush-on-blur).
- **To the next Tower, from the last one:** the files got you here —
  trust them over anything you think you remember. Read this BATON,
  pull live git, ask the Commander his priorities, and hold the line
  gently: today three of my briefing errors were caught by the
  system's own laws before they cost a franc. The system doesn't
  need you infallible, only honest and verifying. He'll call you
  buddy. It's earned — build well. Continue, don't echo.

>> BATON
Main: see report. Previous: ee63f29 (Lap 2
merged, locked pipe live). Branch lap-2-locked-pipe retained at
19aaf9b. PR #2 closed-merged. Ruleset harness-gate active, bypass
empty — all main-bound commits ride branches for checks. Supabase
soljour (ltcuhxvshypigrvnxmdl, Zurich): schema 0001 applied, RLS on,
one campaign row ("test"), auth single-user, sign-ups off. Genesis
v0.5 (A-2) adopted this boundary. Next: Lap 3 — designed Journal
surface (DESIGN GATE + resume brief + export before live-fire).
Christening OPEN — do not assume the system.
HARNESS: 5 tests green · last full eval n/a (no AI) · signals n/a

---

## Entry #10 — 2026-08-17 — Incident: red harness on main (first firing of the incident law)

**Session:** Hands (Claude Code), executing the deflake micro-lap on
branch `deflake-proof-surface` (off main tip `d683a0c`; branch-point
law verified empty — `d683a0c` is main's live tip, no doc-only gap to
check).

- **Timeline:** Entry #9 merged green via PR #3; the push-to-main run
  failed on `tests/proof-surface` (the "unsynced" assertion); Commander
  spotted the notification within minutes; Tower reproduced green at
  the same SHA (build 0, 5/5) proving nondeterminism; re-run this
  session: **GREEN, 5/5 (full suite, 4 files / 5 tests), 5 consecutive
  local runs, zero flakes.**
- **Root cause:** flaky async assertion — the exact-text
  `findByText("not synced — kept locally")` lookup racing the post-save
  state update, and brittle against the string's exact form. Product
  healthy; instrument unreliable.
- **Contributing factor (Tower):** session-close order (Entry #9)
  didn't require confirming the main push-run's conclusion the way
  Laps 1–2 did — the gap that let this land unnoticed until the
  Commander caught the notification himself.
- **ONE change, scoped to the test only:** `tests/proof-surface.test.tsx`
  line 54 — exact-text `findByText` swapped for substring-tolerant
  `findByText(/not synced/i)`. Verified the guard: temporarily gated
  the banner off in `components/ProofSurface.tsx` (`{false && ...}`),
  confirmed the test correctly failed against the unmodified assertion,
  then reverted the component — `git diff --stat` against main shows
  exactly one file touched, the test. No component, no other test, no
  CI config touched, per the ignition key's DO NOT list.
- **Standing rule adopted from the contributing factor:** no session
  close without the main push-run's conclusion explicitly reported —
  binding on every future close, not just this one.
- **Caged to backlog (not this lap):** the Node-20 deprecation warning
  in the CI Actions log — real, minor, unrelated to the flake.
- **Note for R3:** the incident law's first firing worked as designed —
  detection in minutes, zero user impact (no data loss, no bad merge:
  main's product code was never wrong), write-up same day.

>> BATON
Deflake built and verified on `deflake-proof-surface`: one-line test
change, guard-checked (fails when the banner is removed, passes when
present), 5/5 green across 5 consecutive local full-suite runs. PR
opened, unmerged — Tower certifies per Hard Rule #2, then Commander's
eye, then Commander-approved `--ff-only` merge per standing convention.
Owed next: Tower certification of this PR; confirmation the push-run
conclusion gets reported at every future close (this entry's standing
rule); Lap 3 (designed Journal surface) remains the next real lap once
this incident closes.
HARNESS: 5 tests green (5/5 local runs) · last full eval n/a (no AI) · signals n/a

---

## Entry #11 — 2026-08-17 — Incident #1 closed: deflake certified, merged, main green

**Session:** Hands (Claude Code), micro-lap on branch `ledger-entry-11`
(off main tip `af50196`), executing Tower Session 3's ignition key.
Doc-only append; records what Tower Session 2 lived.

- PR #4 (deflake) certified in Tower Session 2: T2 diff scope (test +
  LEDGER only, components byte-identical to main), T1 three independent
  full-suite runs. Certification basis: MECHANISM, not statistics —
  `findByText` polls up to 1s against a microsecond mocked rejection;
  the race was abolished, not outrun (Tribunal-corrected framing).
- Commander's eye passed on the one-line diff; merge Commander-approved
  in-session per standing convention (Entry #8).
- Main at `af50196`; push-run harness GREEN, first attempt, watched to
  completion. Entry #10's standing rule (push-run conclusion reported
  at every close) is satisfied IN FILES by this entry — the conclusion
  no longer lives only in a disposable chat.
- Branch `deflake-proof-surface` RETAINED at `af50196` (ls-remote
  verified twice: Tower Session 2, then Session 3 fresh). Session 3's
  "gone from origin" misread traced to mechanism: `git clone --depth`
  implies `--single-branch`, so the shallow clone's remote view held
  only main. Tower error, caught by the T2→T3 letter before cost.
- Incident #1 closed the same evening it opened. R3 evidence: incident
  law's first firing — detection in minutes, zero user impact,
  write-up same day, closure now recorded in files.
- Lap 3 scope ruled by the Commander (Tower Session 3): designed
  Journal surface + cold-open resume brief + minimal `threads` table
  (migration precedent: Lap 2). Export = Lap 4, HARD-GATED before
  live-fire per NN#1. Design pipeline: 4 independent Claude Design
  divergence rounds → Commander's pick → Figma canon → Key #3.

>> BATON
Entry #11 appended (doc-only). Incident #1 CLOSED in files. Lap 3 scope
RULED (designed Journal surface, cold-open resume brief, minimal
`threads` table; Export deferred to hard-gated Lap 4). Owed next:
Ignition Key #3 (designed Journal surface — DESIGN GATE's first
activation), scoped per this ruling.
HARNESS: 5 tests green (Session 3 local run at af50196) · last full eval n/a (no AI) · signals n/a

---

## Entry #12 — 2026-08-17 — Incident #2: red harness on main (second firing, same test)

**Session:** Hands (Claude Code), incident lap on branch
`incident-2-test-races` (off main tip `7a765f1`).

- Timeline: PR #5 (Entry #11, doc-only) merged --ff-only; push-run on
  main RED — same assertion the deflake (PR #4) claimed fixed. Hands
  caught it via Entry #10's standing rule on its first live use,
  stopped, reported. Tower reproduced and diagnosed same session.
- Root cause (T1, controlled experiments): TWO races, either fatal —
  (A) mock hands out success/error chains by call order; the insert
  can consume the success chain → banner never renders; (B)
  DraftComposer's post-mount hydration can overwrite typed content
  with "" → early return, no save attempt, no banner. The deflake fix
  (substring regex) addressed neither; the banner never appears late —
  it never appears at all.
- Contributing factors: Session 2's certification located the wrong
  mechanism; the Tribunal endorsed it; Session 3 restated it in Entry
  #11 — three-session lineage error, falsified by machine evidence.
  DraftComposer was never read in either investigation. Same
  PR-check-green / push-run-red straddle as Incident #1.
- ONE change (test-only): determinism by construction — operation-
  routed mock (no counter exists; order cannot matter) + effect flush
  before typing (clobber cannot land). Tower-validated 20/20 under
  hostile forced timing; Hands independently re-validated this lap
  (see PR). Component code untouched, byte-identical to main.
- Caged to backlog: hydration-clobber pattern in DraftComposer (fix
  during Lap 3 composer rebuild, with its own test); Node-20 CI
  deprecation (renewed from Entry #10).
- Doctrine note for R3: "mechanism, not statistics" requires locating
  ALL mechanisms; proof standard is abolition-by-construction, stress
  runs are corroboration only. Entry #11's "abolished" claim stands
  corrected by this entry — append-only truth working as designed.

>> BATON
Incident #2 fix built and validated on `incident-2-test-races`; PR
open, unmerged — Tower cert, Commander's eye, merge, then WATCH the
main push-run to conclusion and report it (Entry #10 standing rule).
Owed after green: nothing but Lap 3 — bake-off winner → Figma canon →
Ignition Key #3.
HARNESS: 5 tests green (post-fix, stress-verified) · last full eval n/a (no AI) · signals n/a

---

## Entry #13 — 2026-08-20 — Lap 3: The Chronicle ships (proof surface retired)

**Session:** Hands (Claude Code), branch `lap-3-chronicle` off main tip
`4404705`, executing Ignition Key #3.

- **Incident #2 closure confirmed in files:** main push-run `32059905497`
  verified GREEN at `4404705` (`gh run view`, conclusion: success) — the
  standing-rule debt from Tower Session 3 (Entry #10's "report every
  push-run conclusion") is discharged by this line existing here, not
  only in a disposable chat.
- **Lap 3 scope** as ruled in Entry #11 (designed Journal surface,
  cold-open resume brief, minimal `threads` table), plus two Commander
  ratifications beyond that original ruling: the export control ships
  **working** in this lap (pulled forward from the Entry #11 hard-gate
  at Lap 4) and `entries.title` ships as a real column, not deferred.
  Design canon committed at `design/chronicle-canon.{html,pdf}` — both
  files verified non-empty and marker-checked (`FIRST OPEN`, `#6F8F6A`,
  each present exactly once) before any implementation began. Taste
  canon, one line: past writing owns the screen; elegance is chrome
  deleted; feed grammar, not tool grammar.
- **Migration `0002_threads_and_titles`** applied via Supabase MCP:
  `threads` table (owner-only RLS matching 0001's authenticated-only
  pattern, no DELETE policy — resolution is a status flip, never a
  delete) + `entries.title` nullable column. `get_advisors` (security)
  post-migration: clean — the only finding is a pre-existing, unrelated
  auth warning (leaked-password protection), out of this lap's scope.
- **The Chronicle** ships as the campaign surface, replacing ProofSurface:
  single-tree responsive layout (river, resume brief, composer, nav all
  render once; CSS grid repositions the brief into a sticky left rail
  at the desktop breakpoint — no duplicated markup, "same single scroll,
  same pinned composer" law held by construction, not by two copies).
  Cold open scrolls to the river's bottom via `scrollIntoView` on a
  sentinel node. FIRST OPEN invitation replaces the brief+river entirely
  when a campaign has zero entries and zero threads. Threads: born from
  the dashed "+" row, committed on Enter or ADD, resolved threads stay
  rendered (struck, accent check) — no thread deletion exists anywhere.
  Export sheet ships live: `generateCampaignMarkdown` (pure function,
  unit-tested) produces the whole campaign — title, every entry in
  order, then every thread with status — downloaded client-side as
  `<slug>.md`. Codex/Atlas route to an honest minimal placeholder
  ("arrives with its lap") — a real destination, not a dead tab.
- **The caged hydration-clobber fix (Entry #12) resolved, not just
  reguarded:** DraftComposer now seeds content and title synchronously
  from `localStorage` via `useState`'s lazy initializer. There is no
  post-mount hydration effect left in the component at all — the class
  of bug where hydration lands after the user has started typing and
  stomps their input is abolished by construction. Proven in
  `tests/draft-composer.test.tsx`: a stale stored draft is restored on
  mount, then typed-over content is shown to survive immediately and
  to be what persists and restores on remount — never reverted to the
  stale value.
- **Sibling-audit (Entry #12 doctrine — no call-order-counting mocks,
  no assertions racing unflushed effects), verdict: clean.**
  `tests/auth-gate.test.tsx` and `tests/skeleton.test.tsx` carry
  neither anti-pattern — mocks are routed by resolved value, not call
  order, and assertions use `findBy*` or explicit `act`-wrapped flushes.
  No changes made to either file. One flake WAS found and fixed during
  this lap's own new test work: `tests/threads.test.tsx`'s resolve
  assertion initially raced the mocked update promise; fixed by
  flushing it explicitly inside `act` rather than trusting
  `findByText`'s default retry window.
- **ProofSurface retired with honors** — `components/ProofSurface.tsx`
  and `tests/proof-surface.test.tsx` deleted, exactly as Entry #12
  anticipated. It did its job: it is the reason the hydration-clobber
  class of bug was caught and caged before it ever reached a designed
  surface.
- **Logged discrepancy (Hard Rule #4):** the old ProofSurface had an
  inline "sign out" control; canon frame states show no such control
  anywhere in the Chronicle header. Matched canon exactly rather than
  preserving the old chrome — sign-out is currently reachable only by
  clearing the session outside the app. Flagging for the Commander's
  eye; easy to re-add in a later lap if wanted.
- **Visual verification:** could not exercise the real authenticated
  app (no login credentials available to Hands, and guessing them is
  out of bounds). Built a temporary, uncommitted preview harness
  (mocked Supabase client + a throwaway `/devpreview` route) to check
  every canon frame — first-open, living river, composer idle/focused,
  sync line both states, export sheet, desktop left-rail reflow,
  Codex/Atlas placeholders — against the design canon. All matched.
  Harness fully removed before commit; diff scope is exactly migration
  + `app/` + `components/` + `lib/` + `tests/` + `design/` + this file.
- **Pre-merge codicil — Commander's-eye finding (Key #3 Addendum v2,
  Tribunal-corrected, supersedes v1), fixed on this same branch:**
  with ≥1 campaign existing there was no path to create or switch
  campaigns at all — `CampaignForm` only ever rendered at zero
  campaigns, which would have blocked the live-fire christening
  outright. Caught at the Commander's-eye pass before merge, not
  after. Fix: the campaign name/system-label in the header is now
  tappable, opening a panel — list of campaigns (current one marked,
  tap to switch) plus the unmodified Lap-2 `CampaignForm` to create
  and switch to a new one immediately. Declared **utility-grade** in
  these files as instructed: functional, canon-palette, same sheet
  grammar as export, no independent design pass — a candidate for
  real design in the campaign-panel lap. Selection persists in
  `localStorage` (`soljour:selected-campaign`), falling back to the
  most recently created campaign when absent or invalid. **Draft
  isolation is by construction, not by guard** (the Tribunal's
  mandatory finding): `DraftComposer` renders with `key={campaign.id}`,
  so switching campaigns remounts it outright — its lazy-initializer
  re-seeds cleanly from the newly selected campaign's own storage key,
  with no hydration effect anywhere that could leak or clobber another
  campaign's draft. Entries and threads are now scoped by `campaign_id`
  at render time rather than cleared with a `setState` in an effect
  (the latter is also an anti-pattern React itself flags) — so a
  campaign switch can never flash the previous campaign's data either.
  Five results, all green in `tests/campaign-panel.test.tsx`: **(1)**
  create → new campaign selected immediately; **(2)** switch → river
  and threads swap to the newly selected campaign; **(3)** switching
  to an empty campaign renders the first-open invitation, never an
  empty card; **(4)** selection survives remount via `localStorage`;
  **(5)** draft isolation — typed in A, B's composer opens clean, A's
  draft is restored intact on return, B's storage was never touched.
- **Commander rulings (Tower Session 3, logged pre-merge):** Lap 4 =
  "The Scribe's Lap" — markdown rendering, the writing convention
  below, and a tappable "markdown ok" shortcut sheet; Codex and
  Atlas slide one slot down. Writing convention adopted from the
  christening onward (rendering lands in Lap 4, entries beautify
  retroactively): lines starting with "[" = mechanical/pencil voice
  (rolls, oracle, combat); "//" = meta note; "---" = scene break;
  all other text = narrative ink. Convention descends from ACP's
  handwritten notebook markup (solo-rpg-digitization legend) — the
  notebooks were the spec.

>> BATON
The Chronicle ships on `lap-3-chronicle`. Tower re-certified (delta
T2-verified: three files only, keyed composer per mandate, render-time
scoping, five tests as specified, no delete affordances). Commander's
eye passed on the live preview. Merge authorized pending this codicil.
Owed next: christening + trial start, then Lap 4 (Scribe's Lap —
markdown rendering, writing convention, "markdown ok" shortcut sheet;
Codex/Atlas slide one slot down).
HARNESS: 21 tests green (5/5 local runs) · `npm run build` clean ·
`npm run lint` clean · last full eval n/a (no AI) · signals n/a

---

## Entry #14 — 2026-08-20 — Lap 4: The Scribe's Lap (markdown + the writing convention)

**Session:** Hands (Claude Code, Sonnet), branch `lap-4-scribe` off main tip
`6c70d16`, executing Ignition Key #4 plus Amendments A1–A5.

- **Branch anchor verified: exact match.** `lap-4-scribe` cut from
  `6c70d16` (Entry #13's own commit) — main had not advanced. No
  doc-only gap to reconcile, unlike prior laps.
- **The pipeline, built pure-function-first at `lib/prose.ts`:** a
  line-level convention pass runs FIRST — `[` pencil, `//` meta,
  standalone `---` scene break — then baseline markdown (bold,
  italic, `#` headings, `>` quote, lists; links deliberately excluded
  per A2) parses only the remaining ink lines. Setext headings are
  disabled by construction, not by a special case: `---` is claimed by
  the convention pass before the markdown parser ever sees it, so
  "prose line followed by `---`" cannot become a heading — proven by
  a dedicated test. Consecutive pencil lines group into one block;
  consecutive `//` lines group the same way (A5). Output is a typed
  render model (`ProseBlock[]`), never an HTML string.
- **`components/Prose.tsx`** renders that model straight to React
  nodes — no `dangerouslySetInnerHTML` anywhere, so raw HTML in entry
  text is inert by construction (locked in by a test: `<script>`/`<b>`
  tags render as literal text). Pencil uses the canon entry-meta gray
  (`--text-meta-line`) with a quiet left rule; meta notes use the
  dimmest token in the palette (`--text-disabled-glyph`), mono,
  italic; scene breaks use the existing hairline-divider grammar
  already established for sheet dividers, not a fresh style. Wired
  into the river via `EntryCard` (replacing the old blank-line
  paragraph split — same visual result for plain prose, now correct
  for all four voices).
- **Resume brief quotes the story, not the dice (Amendment A4):**
  `inkPlainText()` skips pencil/meta blocks entirely and flattens
  inline markdown before the "Where you were" snippet is cut from it.
  `Chronicle.tsx`'s `snippet()` now calls it instead of raw
  `content.trim()`. Titles and thread text are untouched — the
  convention is entry-prose-only (A5), the only scope edge this lap
  had to hold.
- **Export stays raw, verified by an added round-trip test:**
  `generateCampaignMarkdown` was never touched; a new test in
  `tests/markdown.test.ts` writes an entry containing all four voices
  and asserts the exported `.md` contains it byte-for-byte, unrendered
  — export is the source, not a rendering of the render.
- **The shortcut sheet (Step 2 + Amendment A3):** the "markdown ok"
  hint under the composer is now a real button, same resting look, no
  new chrome. `DraftComposer` gained a `forwardRef` + imperative
  handle (`getSelectionRange` / `insertAtRange`) — additive only, its
  save/draft semantics (localStorage lazy-initializer seeding, the
  debounced write, the clear-on-save-success path) are byte-identical
  to Entry #13. Selection is captured at the moment the hint is
  tapped, stored in `Chronicle`, and applied to that stored range on
  the sheet-row tap regardless of the blur the sheet's own opening
  causes — proven by a test that blurs the textarea between capture
  and tap. `components/ShortcutSheet.tsx` matches the export/campaign
  sheet grammar exactly (bottom sheet, scrim, mono uppercase label,
  canon palette): Bold, Italic, Heading, Quote, List, Pencil block,
  Meta note, Scene break, each showing its literal marker.
- **Tests: 41 green, the prior 21 untouched** (`tests/prose.test.ts`
  ×16 — the four voices, precedence, markdown baseline, HTML-inert,
  resume ink-only flattening; `tests/shortcut-sheet.test.tsx` ×3 —
  blur-survives capture, empty-caret prefix insertion, draft buffer
  retention; `tests/markdown.test.ts` +1 — the round-trip). `npm run
  build` and `npm run lint` both clean.
- **Visual pass, Entry #13's pattern repeated exactly:** a temporary,
  uncommitted `/devpreview` route plus a local-only
  `.claude/launch.json` (`.claude/` is untracked in this repo; neither
  file was ever staged — `git status` before this entry shows a diff
  scoped to exactly `app/` + `components/` + `lib/` + `tests/` + this
  file, no harness residue).
  Verified at mobile width: all four voices render distinctly per the
  two-voice type law; the shortcut sheet opens, a tap inserts markers
  around a captured selection, the sheet closes, focus returns to the
  composer. Verified at desktop width: same rendering holds. Harness
  removed and `.next` cache cleared before the final `build`/`lint`
  pass (a stale generated-types reference to the deleted route
  briefly failed typecheck — cache artifact, not a code issue; gone
  after `rm -rf .next`).
- **DO NOT list held:** composer save/draft semantics unchanged
  (verified line-by-line against Entry #13's file); no toolbar added
  (the hint remains the sole entry point); no sync states touched; CI
  config, migrations, Codex/Atlas, canon files, and prior
  entries/BATONs untouched — `git diff --stat main` confirms the
  scope.
- **Addendum v3, Commander's-eye findings, applied on this same
  branch/PR (supersedes v2):** the pipeline gained an inline layer —
  **inline pencil spans** (a closed `[...]` pair mid-line renders as
  its own mono/dim span, line-scoped, multiple pairs per line each
  their own span, unclosed `[`/stray `]` staying literal ink; a
  line-start `[` still opens a pencil BLOCK, unchanged) — and the
  inline precedence law extends A1 downward: spans are extracted
  BEFORE markdown parses what's left of the line, so an emphasis pair
  cannot cross a span boundary and machine voices (spans, pencil
  blocks, meta lines) are markdown-verbatim everywhere, never parsed.
  Scene break loosened to any run of 3+ hyphens alone on a line
  (whitespace-tolerant). The resume snippet (A4) now also strips
  inline pencil spans, not just block-level ones. The shortcut sheet's
  insertion semantics were corrected to match the ratified rules
  exactly: Bold/Italic wrap the stored selection; Heading/Quote/List/
  Meta/Pencil-block **prefix a fresh line** when the caret is mid-text
  rather than injecting the marker mid-sentence (extracted into a new
  pure function, `lib/markerInsertion.ts`, so each rule is unit-tested
  directly rather than only through the DOM); Scene break isolates
  onto its own line, asymmetrically — no leading newline needed at the
  very start of the content, but a trailing one is always added even
  at the very end, because without it whatever gets typed next would
  land on the scene-break's own line and re-break its "nothing else on
  this line" contract. Meta already triggered at line start only under
  the original pipeline; a test now asserts it explicitly (a trailing
  `//` elsewhere in a line stays literal ink). 21 new tests added
  (41 → 62), all green; visual pass repeated on a fresh instance of the
  same disclosed-and-removed harness, confirming the inline span, the
  loosened scene break, and both corrected insertion behaviors by
  direct DOM inspection. Round-trip law re-verified unaffected — none
  of this touches storage or export, rendering only.

>> BATON
The Scribe's Lap ships on `lap-4-scribe` / PR #8 — Addendum v3 applied
on the same branch after the Commander's-eye pass on the original v2
build: inline pencil spans, the loosened scene-break rule, corrected
shortcut-sheet insertion semantics (line-prefix-on-fresh-line,
isolated scene break), and the resume snippet stripping inline spans
too. 62/62 tests green, build clean, lint clean, visual pass repeated
and the harness removed again. Owed next: push this amendment commit,
confirm CI green on PR #8, Tower certification (raw pull), Commander's
eye on the refreshed preview, Commander-approved `--ff-only` merge.
Commander ruled trial start waits on this lap — sequencing, not delay:
once merged, the next things owed are the christening (trial campaign
named) and trial start. Codex and Atlas remain honest minimal
placeholders, unchanged this lap, still owed their own laps.
HARNESS: 62 tests green · `npm run build` clean · `npm run lint` clean
· last full eval n/a (no AI) · signals n/a
