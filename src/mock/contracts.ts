import { MasterContract } from "@/types";
import { grades } from "@/mock/pricing";

const gradeByIndex = (index: number) => grades[index % grades.length];

export const masterContracts: MasterContract[] = Array.from({ length: 12 }).map((_, index) => {
  const contractIndex = index + 1;
  const grade = gradeByIndex(index);
  const totalQty = 18000 + index * 1200;
  return {
    id: `mc-${String(contractIndex).padStart(3, "0")}`,
    contractNumber: `MC-${String(contractIndex).padStart(3, "0")}`,
    rcnContractNumber: `RCN-${7400 + contractIndex}`,
    dateSigningContract: `2024-0${(index % 6) + 1}-12`,
    year: "2024",
    gradeId: grade.id,
    gradeName: grade.name,
    status: contractIndex % 5 === 0 ? "Closed" : contractIndex % 4 === 0 ? "Draft" : "Open",
    shipmentPeriod: "Jul-Sep 2024",
    incoterms: contractIndex % 2 === 0 ? "FOB" : "CIF",
    totalContractQuantityKgs: totalQty,
    totalContractValue: totalQty * 3.6,
    shippedQuantityKgs: totalQty * 0.35,
    openQty: totalQty * 0.65,
    openValue: totalQty * 0.65 * 3.6,
    openBookQty: totalQty * 0.6,
    openBookValue: totalQty * 0.6 * 3.6,
    allocationSummary: "India: 0 | Vietnam: 0"
  };
});
