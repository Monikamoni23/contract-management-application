import { PricingMaster } from "@/types";

export const grades = [
  { id: "grade-arabica-1", name: "Arabica Grade 1" },
  { id: "grade-arabica-2", name: "Arabica Grade 2" },
  { id: "grade-robusta-premium", name: "Robusta Premium" },
  { id: "grade-robusta-standard", name: "Robusta Standard" },
  { id: "grade-blend-espresso", name: "Espresso Blend" }
];

export const countries: Array<"India" | "Vietnam"> = ["India", "Vietnam"];

export const pricingMaster: PricingMaster[] = [
  {
    id: "price-001",
    gradeId: "grade-arabica-1",
    countryId: "India",
    contractPriceUsdKgs: 4.25,
    contractPriceUsdMt: 4250,
    contractPriceUsdLbs: 1.93,
    effectiveFrom: "2024-01-01",
    isActive: true,
    notes: "Premium harvest window"
  },
  {
    id: "price-002",
    gradeId: "grade-arabica-1",
    countryId: "Vietnam",
    contractPriceUsdKgs: 4.1,
    contractPriceUsdMt: 4100,
    contractPriceUsdLbs: 1.86,
    effectiveFrom: "2024-01-01",
    isActive: true
  },
  {
    id: "price-003",
    gradeId: "grade-arabica-2",
    countryId: "India",
    contractPriceUsdKgs: 3.85,
    contractPriceUsdMt: 3850,
    contractPriceUsdLbs: 1.75,
    effectiveFrom: "2024-02-01",
    isActive: true
  },
  {
    id: "price-004",
    gradeId: "grade-arabica-2",
    countryId: "Vietnam",
    contractPriceUsdKgs: 3.72,
    contractPriceUsdMt: 3720,
    contractPriceUsdLbs: 1.69,
    effectiveFrom: "2024-02-01",
    isActive: true
  },
  {
    id: "price-005",
    gradeId: "grade-robusta-premium",
    countryId: "India",
    contractPriceUsdKgs: 3.45,
    contractPriceUsdMt: 3450,
    contractPriceUsdLbs: 1.57,
    effectiveFrom: "2024-03-01",
    isActive: true
  },
  {
    id: "price-006",
    gradeId: "grade-robusta-premium",
    countryId: "Vietnam",
    contractPriceUsdKgs: 3.28,
    contractPriceUsdMt: 3280,
    contractPriceUsdLbs: 1.49,
    effectiveFrom: "2024-03-01",
    isActive: true
  },
  {
    id: "price-007",
    gradeId: "grade-robusta-standard",
    countryId: "India",
    contractPriceUsdKgs: 3.05,
    contractPriceUsdMt: 3050,
    contractPriceUsdLbs: 1.38,
    effectiveFrom: "2024-01-15",
    isActive: true
  },
  {
    id: "price-008",
    gradeId: "grade-robusta-standard",
    countryId: "Vietnam",
    contractPriceUsdKgs: 2.92,
    contractPriceUsdMt: 2920,
    contractPriceUsdLbs: 1.32,
    effectiveFrom: "2024-01-15",
    isActive: true
  },
  {
    id: "price-009",
    gradeId: "grade-blend-espresso",
    countryId: "India",
    contractPriceUsdKgs: 4.6,
    contractPriceUsdMt: 4600,
    contractPriceUsdLbs: 2.09,
    effectiveFrom: "2024-04-01",
    isActive: true
  },
  {
    id: "price-010",
    gradeId: "grade-blend-espresso",
    countryId: "Vietnam",
    contractPriceUsdKgs: 4.4,
    contractPriceUsdMt: 4400,
    contractPriceUsdLbs: 2.0,
    effectiveFrom: "2024-04-01",
    isActive: true
  }
];
