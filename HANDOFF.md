# Clenny Workstation Handoff

Updated: 2026-08-31

## NEXT SESSION — MANDATORY FULL AUDIT

Begin the next session with a full audit before coding, correcting data, or writing to production.

### Objective

Prove that Clenny Workstation and CC Tobacco Tracker are synchronized, mathematically consistent, secure, visually correct, and functionally correct end to end.

### Scope: “Everything”

Audit both repositories and deployed apps:

- Workstation: `AlgoCraftClen/clenny-workstation` — `https://algocraftclen.github.io/clenny-workstation/`
- Tracker: `AlgoCraftClen/tobacco-cc` — `https://algocraftclen.github.io/tobacco-cc/`
- Every directory, file, and line of source, configuration, documentation, migration, workflow, and asset—no sampling.
- GitHub Pages/Actions, deployed commit parity, Supabase schema/RLS/auth/session refresh, queries, mutations, mappings, and caches.
- Every page, tab, modal, form, table, card, button, link, dropdown, filter, import/export control, and navigation path.
- Loading, empty, error, validation, success, signed-in/out, expired-session, and responsive states.
- Every inventory, product-cost, operation, sale, ownership, reimbursement, withdrawal, settlement, rollover, projection, and company-reserve calculation.
- Cross-app synchronization and agreement with authoritative records.

### Required method and safeguards

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
- Current projected baseline after sellout and reserving the next equal shipment: Clenny $2,732.57; Clanny $5,614.43. Independently verify it.
- Recent relevant commits: `5d2ae43` and `13d95f4`.

## Next Session Priority — Bidirectional Shared-Database Synchronization

The mobile CC Tracker and Clenny Workstation are two interfaces over one authoritative Supabase ledger. The next session must audit first, then design and implement complete bidirectional synchronization:

- Mobile entries must update the workstation automatically.
- Workstation entries must update the mobile tracker automatically.
- Shipments, sales, operations, withdrawals, reimbursements, and capital adjustments must be first-class shared database records—not hard-coded in one app or stored only in browser preferences.
- Replace the workstation-only Shipment #4 → #5 $50.63 classification with a shared, auditable capital-adjustment record while preserving all existing tracker-entered data.
- Add secure real-time subscriptions for both apps, with manual refresh and bounded polling as recovery fallbacks.
- Audit RLS, authentication, session refresh, validation, duplicate prevention, conflict behavior, offline/error states, and deployed-version parity.
- Test read-only first. Do not create production test transactions or alter authoritative records without Clenny’s explicit approval at action time.
- Prove both directions end to end: mobile → database → workstation and workstation → database → mobile.

