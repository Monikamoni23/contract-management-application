import { ReconciliationRow } from "@/types";

export const reconciliationRows: ReconciliationRow[] = [
  {
    id: "rec-001",
    contractNumber: "MC-001",
    buyerOpenQty: 9800,
    buyerOpenValue: 34500,
    systemOpenQty: 10200,
    systemOpenValue: 35600,
    varianceQty: -400,
    varianceValue: -1100,
    status: "Mismatch",
    owner: "",
    lastUpdated: "2024-07-18",
    notes: "Awaiting buyer confirmation"
  },
  {
    id: "rec-002",
    contractNumber: "MC-002",
    buyerOpenQty: 11200,
    buyerOpenValue: 39800,
    systemOpenQty: 11200,
    systemOpenValue: 39800,
    varianceQty: 0,
    varianceValue: 0,
    status: "Matched",
    owner: "",
    lastUpdated: "2024-07-18",
    notes: ""
  },
  {
    id: "rec-003",
    contractNumber: "MC-003",
    buyerOpenQty: 8900,
    buyerOpenValue: 32900,
    systemOpenQty: 9100,
    systemOpenValue: 33500,
    varianceQty: -200,
    varianceValue: -600,
    status: "Mismatch",
    owner: "Priya",
    lastUpdated: "2024-07-19",
    notes: "Buyer file shows split shipment"
  },
  {
    id: "rec-004",
    contractNumber: "MC-004",
    buyerOpenQty: 10400,
    buyerOpenValue: 36500,
    systemOpenQty: 10100,
    systemOpenValue: 35850,
    varianceQty: 300,
    varianceValue: 650,
    status: "Mismatch",
    owner: "Raj",
    lastUpdated: "2024-07-20",
    notes: ""
  },
  {
    id: "rec-005",
    contractNumber: "MC-005",
    buyerOpenQty: 12600,
    buyerOpenValue: 42400,
    systemOpenQty: 12600,
    systemOpenValue: 42400,
    varianceQty: 0,
    varianceValue: 0,
    status: "Matched",
    owner: "",
    lastUpdated: "2024-07-20",
    notes: ""
  },
  {
    id: "rec-006",
    contractNumber: "MC-006",
    buyerOpenQty: 9750,
    buyerOpenValue: 35200,
    systemOpenQty: 10150,
    systemOpenValue: 36200,
    varianceQty: -400,
    varianceValue: -1000,
    status: "Mismatch",
    owner: "",
    lastUpdated: "2024-07-21",
    notes: "Pending buyer ETA update"
  }
];
