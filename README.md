# Contract Management Application (Phase-1 UI Prototype)

This is a **UI-only** clickable prototype for the Contract Management Application Phase-1 workflow.
It is built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui-style components**.

## Features

- Mock authentication flow (`/login`)
- Dashboard with KPI cards and quick links
- Contracts list, creation, and detail views with tabs
- Allocation editor with confirmation lock
- Shipment advice with drawer create/edit flow
- Weekly shipment CSV generator and email log
- Reconciliation workflow with variance management
- Master data settings

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Script (Client Walkthrough)

1. **Login**
   - Navigate to `/login` and click **Sign in**.
2. **Dashboard**
   - Review KPI cards and use quick links.
3. **Create Contract**
   - Go to **Contracts → Create Contract**.
   - Fill in the form, submit to create a new contract.
4. **Allocate**
   - In the contract details, switch to **Allocation**.
   - Add allocation lines and click **Confirm Allocation** (locks the editor).
5. **Add Shipments**
   - Move to **Shipments** tab and click **Create Shipment**.
   - Fill out the form and save; open qty auto-updates.
6. **Weekly CSV**
   - Go to **Weekly Shipment CSV**.
   - Toggle “Include updated only” and click **Generate CSV Now**.
   - Observe the email log update.
7. **Reconciliation**
   - Go to **Reconciliation**.
   - Mock upload a buyer file, then mark a variance row as resolved.

## Folder Structure (Key Areas)

```
src/
  app/
    (auth)/login
    (app)/dashboard
    (app)/contracts
    (app)/reports/weekly-shipments
    (app)/reconciliation
    (app)/settings/master-data
  components/
    sections/ (Allocation, Shipments, Reconciliation, Activity)
    ui/ (shadcn/ui style primitives)
  context/ (app data provider)
  mock/ (seed data)
  types/ (TypeScript interfaces)
```

## Notes

- All data is seeded in `/src/mock/seed-data.ts`.
- All validation is client-side using **zod**.
- This project is UI-only with no backend integration.
