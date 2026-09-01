# Clenny Workstation Handoff

Updated: 2026-09-01

## NEXT SESSION — DESIGN FLAWS

The full read-only audit was completed on 2026-09-01. The next session should begin with the Workstation design flaws already identified, especially responsive layout, horizontal scrolling, misleading privacy/import copy, integrity-status clarity, authentication/session controls, and the information hierarchy around ownership and capital.

Do not repeat the full audit unless a design change alters calculations, shared data, security, or synchronization. Explain proposed design corrections before implementation, preserve authoritative Tracker records, and verify affected workflows after each approved change.

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
- Tables: `shipments_v2`, `expenses`, `sales`
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

## Following Priority — Bidirectional Shared-Database Synchronization

The mobile CC Tracker and Clenny Workstation are two interfaces over one authoritative Supabase ledger. The next session must audit first, then design and implement complete bidirectional synchronization:

- Mobile entries must update the workstation automatically.
- Workstation entries must update the mobile tracker automatically.
- Shipments, sales, operations, withdrawals, reimbursements, and capital adjustments must be first-class shared database records—not hard-coded in one app or stored only in browser preferences.
- Replace the workstation-only Shipment #4 → #5 $50.63 classification with a shared, auditable capital-adjustment record while preserving all existing tracker-entered data.
- Add secure real-time subscriptions for both apps, with manual refresh and bounded polling as recovery fallbacks.
- Audit RLS, authentication, session refresh, validation, duplicate prevention, conflict behavior, offline/error states, and deployed-version parity.
- Test read-only first. Do not create production test transactions or alter authoritative records without Clenny’s explicit approval at action time.
- Prove both directions end to end: mobile → database → workstation and workstation → database → mobile.

