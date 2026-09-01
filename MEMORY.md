# Clenny Workstation Memory

Updated: 2026-09-01

These are durable rules unless Clenny explicitly changes them.

## Mandatory Next Session

Begin with a full, read-only-first audit of both `AlgoCraftClen/clenny-workstation` and `AlgoCraftClen/tobacco-cc`, their deployed GitHub Pages apps, and shared Supabase backend.

“Full audit” means everything: every folder, file, line of code/config/docs, page, and safe control. Use Computer Use in Chrome or BrowserOS. Open every page and test every safe button. Stop destructive actions at the confirmation boundary and cancel. Do not submit live test data or production writes without explicit approval. Report evidence and proposed fixes before coding. See `HANDOFF.md` for the complete protocol.

## People

- Clenny and Clanny are different people; preserve both spellings exactly.
- Clenny is the workstation owner/bookkeeper, receiver, and seller.
- Clanny purchases and sends product.

## Data Authority

- Tracker-entered production records are authoritative and must not be changed or lost.
- Workstation displays and calculations derive from the shared data without silently rewriting it.
- Supabase project: `njpkqemgpbstrbsaxpbz`; core tables: `shipments_v2`, `expenses`, `sales`.
- Audit baseline: 5 shipments, 46 operations, 20 sales; SHP #1–#4 have zero remaining cans; SHP #5 has 1,620.
- Trace mismatches to source, mapping, classification, cache, or math. Never “fix” them by modifying authoritative tracker records.

## Accounting Law

### Verified 2026-09-01 bottom line

- SHP #5 current safe withdrawal is $0.00 for Clenny and $0.00 for Clanny because no sales are recorded.
- Projected rolled capital is $5,714.57 for Clenny and $11,578.43 for Clanny; company reserve is $12.00.
- Projected reinvestment capital is $5,714.57 for Clenny and $11,578.43 for Clanny. Excess remains pending until the next three product boxes are chosen together.
- Clenny reserves one complete selected box and Clanny reserves two complete selected boxes at actual product cost. Three Grizzly boxes produce $2,732.57 / $5,614.43 excess; three Copenhagen boxes produce $2,066.57 / $4,282.43. Mixed product decisions are calculated box by box.
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
- The Shipment #4 → #5 $50.63 Clenny additional-capital classification must become a first-class shared capital-adjustment record; preserve all tracker source data.
- Prefer secure Supabase real-time subscriptions, retaining manual refresh and bounded polling as recovery fallbacks.
- Every synchronization change requires RLS/auth/session, validation, duplication, conflict, offline/error, and deployed-version verification in both directions.

