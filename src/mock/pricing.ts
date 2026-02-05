import { PricingMaster } from "@/types";

export const grades = [{ id: "grade-sw320-sw360", name: "SW320/SW360" }];

export const countries: Array<"India" | "Vietnam"> = ["India", "Vietnam"];

export const pricingMaster: PricingMaster[] = [
  {
    id: "price-000",
    gradeId: "grade-sw320-sw360",
    countryId: "India",
    contractPriceUsdKgs: 10,
    contractPriceUsdMt: 10000,
    contractPriceUsdLbs: 4.54,
    effectiveFrom: "2025-12-10",
    isActive: true,
    notes: "Excel sample price"
  },
  {
    id: "price-000-vnm",
    gradeId: "grade-sw320-sw360",
    countryId: "Vietnam",
    contractPriceUsdKgs: 10,
    contractPriceUsdMt: 10000,
    contractPriceUsdLbs: 4.54,
    effectiveFrom: "2025-12-10",
    isActive: true,
    notes: "Excel sample price"
  }
];
