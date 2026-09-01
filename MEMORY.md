# Clenny Workstation Memory

Updated: 2026-09-02

## Workstation Design Contract

- The responsive shell must never create page-level horizontal scrolling. On small screens, only wide comparison tables may scroll inside their own clearly labeled container.
- The overview leads with the active shipment, realized “can withdraw now” amounts, and the next meeting decision. Lifetime totals are secondary.
- The meeting case mix is a local draft, not a production record. Preserve it across refreshes, show each partner's reserve/shortage/excess, and do not call the decision ready unless both partners have a nonzero affordable mix.
- Describe storage accurately: Supabase holds shared business records; GitHub hosts application code; local browser storage holds the session, meeting draft, and preferences.
- Replacement imports are disabled. Refresh and backup must never overwrite authoritative Tracker records.
- Integrity status must name every check and expose the affected shipment and numerical delta when a check fails. Never show green checks beside a generic “Review” badge.
- Production access must show session state and provide sign-out and expired-session recovery. First-account creation is not part of the normal production login screen.

These are durable rules unless Clenny explicitly changes them.

## Current Secure Baseline

- Cross-app auth, RLS, Realtime, polling fallback, and shared capital-adjustment work was deployed on 2026-09-02.
- Workstation commit: `1d04a18`; Tracker commit: `23be950`.
- Core shared tables are `shipments_v2`, `expenses`, `sales`, and `capital_adjustments`.
- Anonymous ledger access is blocked. Protected reads and writes require the authorized authenticated Clenny account.
- Retained legacy tables are protected by the same authenticated Clenny-only boundary; no legacy row was deleted.
- The `$50.63` Shipment #4 to #5 difference is recorded once as a `Business` adjustment with `pending_partner_decision`; it affects neither ownership nor cash.
- Finalizing that allocation requires a partner decision. Do not rewrite historical source records.
- Supabase leaked-password protection remains the sole advisor warning and requires a paid Pro plan; never upgrade without explicit approval.

## People

- Clenny and Clanny are different people; preserve both spellings exactly.
- Clenny is the workstation owner/bookkeeper, receiver, and seller.
- Clanny purchases and sends product.

## Data Authority

- Tracker-entered production records are authoritative and must not be changed or lost.
- Workstation displays and calculations derive from the shared data without silently rewriting it.
- Supabase project: `njpkqemgpbstrbsaxpbz`; core tables: `shipments_v2`, `expenses`, `sales`, `capital_adjustments`.
- Audit baseline: 5 shipments, 46 operations, 20 sales; SHP #1–#4 have zero remaining cans; SHP #5 has 1,620.
- Trace mismatches to source, mapping, classification, cache, or math. Never “fix” them by modifying authoritative tracker records.

## Accounting Law

### Verified 2026-09-01 bottom line

- SHP #5 current safe withdrawal is $0.00 for Clenny and $0.00 for Clanny because no sales are recorded.
- Projected rolled capital is $5,714.57 for Clenny and $11,578.43 for Clanny; company reserve is $12.00.
- Projected reinvestment capital is $5,714.57 for Clenny and $11,578.43 for Clanny. Excess remains pending until the next three product boxes are chosen together.
- The meeting planner accepts adjustable whole-case quantities for each partner and product; six cases equal one box. Reserve is the actual cost of each partner's selected Grizzly and Copenhagen cases, allowing either partner's box count to increase and mixed shipments such as 15 Grizzly + 3 Copenhagen cases.
- SHP #4 must use actual recorded product sale prices: $2,905.22 / $13,785.96 / $23.81 company. The difference to SHP #5's Clenny basis is $50.63 of additional capital.

- Product cost is separate from shipping, fuel, salaries, handling, and other operations.
- Each shipment uses its own original product-investment percentages.
- Whole-can ownership is calculated per shipment and product; leftover cans belong to the company.
- Clenny’s capital grows as prior payout rolls into the next shipment. Do not use a constant historical one-third share.
- Operations are allocated by each shipment’s investment percentages.
- Personally funded business operations are reimbursed to the payer.
- Shared/sales-funded operations are not reimbursed twice.
- Personal withdrawals reduce only the withdrawing partner’s capital.
- Payout/rolled capital = product revenue − operations responsibility + personal reimbursement − personal withdrawal.
- Clenny’s rolled capital funds Clenny’s next shipment share; Clanny pays the remaining product cost.
- Show separate, auditable amounts for Clenny and Clanny.
- “Can withdraw now” uses realized recorded sales after costs and prior withdrawals.
- Unsold-inventory projections must be labeled projected and reserve the next shipment obligation and company inventory.

## Application Contract

- Workstation: `https://algocraftclen.github.io/clenny-workstation/`
- Tracker: `https://algocraftclen.github.io/tobacco-cc/`
- Both use shared Supabase data.
- Audit authentication, expired-session refresh, row security, import/export, responsive layout, every calculation, and every synchronization path.
- Verify deployed behavior after every approved fix.

## Durable Synchronization Rule

- CC Tracker and Clenny Workstation are two interfaces over one authoritative Supabase ledger.
- Any business record entered in either app must become visible in the other automatically.
- Shared record types include shipments, sales, operations, withdrawals, reimbursements, and capital adjustments.
- Business facts must not exist only in application code, local browser storage, or a workstation-only calculation.
- The Shipment #4 → #5 $50.63 difference is a first-class shared capital-adjustment record allocated to Business pending the partners' decision; preserve all tracker source data.
- Prefer secure Supabase real-time subscriptions, retaining manual refresh and bounded polling as recovery fallbacks.
- Every synchronization change requires RLS/auth/session, validation, duplication, conflict, offline/error, and deployed-version verification in both directions.

