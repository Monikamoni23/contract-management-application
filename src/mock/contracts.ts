import { MasterContract } from "@/types";
import { grades } from "@/mock/pricing";

const sampleGrade = grades.find((grade) => grade.id === "grade-sw320-sw360") ?? grades[0];

const sampleContracts = ["412382", "412383", "412384", "412385"];

export const masterContracts: MasterContract[] = sampleContracts.map((contractNumber) => ({
  id: `mc-${contractNumber}`,
  contractNumber,
  rcnContractNumber: "XX its for future",
  dateSigningContract: "2025-12-10",
  year: "2025",
  gradeId: sampleGrade.id,
  gradeName: sampleGrade.name,
  status: "Open",
  shipmentPeriod: "May-26",
  incoterms: "FOB",
  totalContractQuantityKgs: 99792,
  totalContractValue: 997920,
  shippedQuantityKgs: 0,
  openQty: 99792,
  openValue: 997920,
  openBookQty: 99792,
  openBookValue: 997920,
  allocationSummary: "India: 0 | Vietnam: 0"
}));
