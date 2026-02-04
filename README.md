# Contract Management Application (Phase-1 Prototype)

UI-only clickable prototype built with Next.js App Router, TypeScript, Tailwind, and shadcn/ui.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and sign in from the mock login screen.

## Demo walkthrough

1. **Create contract**: Go to **Contracts → Create Master Contract**. Fill required fields and submit. You will land on the contract detail page.
2. **Allocate sub-contracts**: Open the **Sub-Contracts** tab, enter allocated quantities for India + Vietnam, and click **Confirm Allocation**.
3. **Add shipment**: Navigate to **Shipments**, create a shipment advice record, and mark it as shipped from the shipment drawer.
4. **Weekly CSV**: Visit **Reports → Weekly Shipment CSV**, toggle “Include updated shipments only”, and click **Generate CSV Now** to download.
5. **Reconcile**: Go to **Reconciliation**, mock upload a buyer file, map fields, and mark a variance row as resolved.

## Folder structure (highlights)

```
src/
  app/
    (app)/
      contracts/
      dashboard/
      reconciliation/
      reports/
      settings/
  components/
    sections/
  context/
  mock/
  types/
```

## Mock data files

- `src/mock/contracts.ts`
- `src/mock/subContracts.ts`
- `src/mock/shipments.ts`
- `src/mock/pricing.ts`
- `src/mock/reconciliation.ts`
- `src/mock/email-logs.ts`
- `src/mock/weekly-reports.ts`

## Notes

- This is a UI-only prototype. State is stored in React context and resets on refresh.
- Pricing master data (grade × country) powers auto-created sub-contract prices.
