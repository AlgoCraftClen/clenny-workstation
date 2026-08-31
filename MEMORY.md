# Clenny Workstation Memory

Updated: 2026-08-31

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
