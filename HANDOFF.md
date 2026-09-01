# Clenny Workstation Handoff

Updated: 2026-09-02

## SHARED SECURITY AND SYNCHRONIZATION COMPLETED

The approved cross-app blocker repair was deployed on 2026-09-02.

- Workstation commit `1d04a18` requires an authorized Clenny Supabase session for protected reads and writes.
- Tracker commit `23be950` uses the same authenticated access boundary.
- Anonymous REST access is blocked by RLS; all four shared tables allow CRUD only to the authorized authenticated Clenny account.
- Both apps subscribe to Supabase Realtime for `shipments_v2`, `expenses`, `sales`, and `capital_adjustments`, with manual refresh and bounded polling as recovery paths.
- Migration `20260902_shared_sync_security.sql` is applied in project `njpkqemgpbstrbsaxpbz` and committed in the Tracker repository.
- The Shipment #4 to #5 difference is now one shared `capital_adjustments` row for `$50.63`, temporarily allocated to `Business`, with status `pending_partner_decision`.
- That classification does not change cash custody or partner ownership: `affects_cash = false` and `affects_ownership = false`.
- Existing source records were preserved. The verified baseline remains 5 shipments, 46 operations, 20 sales, and 1,620 cans remaining in SHP #5.

Fresh production sign-out screens and read security were verified in the Codex built-in browser with no console errors. Authenticated production mutations were deliberately not created; do not add test transactions without explicit approval at action time.

## DESIGN CORRECTIONS COMPLETED

The approved Clenny Workstation design pass was completed on 2026-09-01 without changing production records or accounting formulas.

- Repaired the conflicting tablet/mobile layout rules that collapsed the content column and caused page-level horizontal scrolling.
- Limited horizontal scrolling to comparison tables and added a visible mobile swipe hint.
- Put the active shipment, realized partner withdrawals, and next meeting decision ahead of lifetime totals.
- Moved the next-shipment planner ahead of historical ownership details, enlarged mobile inputs, added one-box shortcuts, persisted the meeting draft locally, and distinguished pending, ready, and capital-short states.
- Replaced false browser-only privacy and replacement-import wording with the actual shared Supabase data model; replacement imports remain unavailable.
- Replaced contradictory integrity indicators with named checks and exact shipment/delta explanations. The UI now surfaces the pre-existing SHP #1 investment-basis difference instead of implying that every check passes.
- Added visible session state, expiry context, explicit sign-out, and a clearer expired-session sign-in path; removed first-account creation from the normal production login flow.

The authoritative baseline remains 5 shipments, 46 operations, 20 sales, and 1,620 cans remaining in SHP #5. No production transaction was added, edited, imported, or deleted during this design work.

## NEXT SESSION

Sign in with the authorized Clenny account and verify the normal authenticated read flow in both deployed apps. Then Clenny and Clanny can decide whether the pending `$50.63` Business reserve should remain with the business or be finalized to Clenny or Clanny. Change the shared adjustment only after that decision; do not change historical shipment, expense, or sale rows to force the result.

Do not repeat the completed audit unless a later change affects calculations, shared data, security, or synchronization. Preserve authoritative Tracker records and verify affected workflows after each approved change.

### Objective

Prove that Clenny Workstation and CC Tobacco Tracker are synchronized, mathematically consistent, secure, visually correct, and functionally correct end to end.

### Completed audit scope — reference

Audit both repositories and deployed apps:

- Workstation: `AlgoCraftClen/clenny-workstation` — `https://algocraftclen.github.io/clenny-workstation/`
- Tracker: `AlgoCraftClen/tobacco-cc` — `https://algocraftclen.github.io/tobacco-cc/`
- Every directory, file, and line of source, configuration, documentation, migration, workflow, and asset—no sampling.
- GitHub Pages/Actions, deployed commit parity, Supabase schema/RLS/auth/session refresh, queries, mutations, mappings, and caches.
- Every page, tab, modal, form, table, card, button, link, dropdown, filter, import/export control, and navigation path.
- Loading, empty, error, validation, success, signed-in/out, expired-session, and responsive states.
- Every inventory, product-cost, operation, sale, ownership, reimbursement, withdrawal, settlement, rollover, projection, and company-reserve calculation.
- Cross-app synchronization and agreement with authoritative records.

### Safeguards retained for design work

1. Read both repositories’ HANDOFF, MEMORY, README, and repository instructions completely.
2. Inventory both repositories and read every line of every text/code file.
3. Audit the shared database and live records read-only first.
4. Use the Computer Use plugin in Chrome or BrowserOS. Do not use Edge or Playwright for the tracker.
5. Open every page and click every safe control, comparing visible state before and after.
6. Inspect destructive controls only to the confirmation boundary, then cancel. Never confirm deletion during an audit.
7. Do not submit test shipments, operations, sales, settlements, imports, or other live writes without Clenny’s explicit approval at the time.
8. Compare repository source, deployed source, rendered behavior, and database values.
9. Produce an evidence-backed findings report with severity, affected app/file, reproduction, expected/actual results, and proposed correction.
10. Explain corrections before coding. Implement only after approval, then re-audit both apps.

“Everything” means exhaustive inspection. It does not authorize deletion, changing source records, production test data, or exposing secrets.

## Source of Truth

Tracker-entered records are authoritative. Never alter or delete them merely to make workstation totals agree. Trace and correct derived mapping, classification, calculation, cache, or display behavior unless Clenny explicitly identifies a source record to change.

## Accounting Contract

- Each shipment has its own original product-investment percentages.
- Whole-can ownership is calculated per shipment and product; remainder cans belong to the company.
- Product cost is distinct from shipping, fuel, salaries, handling, and other operations.
- Operations are allocated by that shipment’s investment percentages.
- Personally funded business operations are reimbursed; shared/sales-funded operations are not reimbursed twice.
- Personal withdrawals reduce only that partner’s capital.
- Payout/rolled capital = product revenue − operations responsibility + personal reimbursement − personal withdrawal.
- Clenny’s rolled capital funds Clenny’s next shipment share; Clanny funds the remainder.
- Clenny’s share grows by shipment. Never apply a fixed historical one-third share.
- Show separate, traceable amounts for “Clenny can withdraw” and “Clanny can withdraw,” distinguishing realized from projected cash.

## Verified Baseline Entering Audit

- Supabase: `njpkqemgpbstrbsaxpbz`
- Tables: `shipments_v2`, `expenses`, `sales`, `capital_adjustments`
- Expected counts: 5 shipments, 46 operations, 20 sales
- Inventory: SHP #1–#4 = 0 remaining; SHP #5 = 1,620
- SHP #5: Clenny 33.04% / 535 cans; Clanny 66.96% / 1,084 cans; company 1 can
- SHP #5 has no sales, so current safe withdrawal is $0 for both.
- Current safe withdrawal: Clenny $0.00; Clanny $0.00.
- SHP #5 projected rolled capital: Clenny $5,714.57; Clanny $11,578.43; company $12.00.
- Projected reinvestment capital is $5,714.57 for Clenny and $11,578.43 for Clanny. Excess is not final until both partners choose the next shipment's three product boxes in a meeting.
- Meeting planning uses adjustable whole-case quantities for each partner and product; six cases equal one box. Reserve is the actual cost of each partner's selected Grizzly and Copenhagen cases, so partner box counts may increase and shipments may mix products (for example, 15 Grizzly cases plus 3 Copenhagen cases = 3 boxes). Excess remains pending until both partners enter a case mix.
- SHP #4 actual-price settlement: Clenny $2,905.22; Clanny $13,785.96; company $23.81. SHP #5 therefore includes $50.63 of additional Clenny capital.
- Recent relevant commits: `7ffd242` (adaptable case-mix planner), `72f6526` (initial whole-box planner), and `be9e8e3` (settlement math and live-entry safeguards).

## Remaining Administrative Hardening

Supabase's security advisor still reports leaked-password protection as disabled. Enabling that account-level Auth setting requires signing into the Supabase dashboard. It is recommended hardening, but it does not reopen anonymous ledger access or block the deployed applications.

