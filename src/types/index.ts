export type ContractStatus = "Open" | "Closed" | "Draft" | "In Progress";

export interface Contract {
  id: string;
  contractNumber: string;
  rcnContractNumber: string;
  dateSigningContract: string;
  year: string;
  grade: string;
  status: ContractStatus;
  shipmentPeriod: string;
  incoterms: string;
  contractPriceUsdMt: number;
  contractPriceUsdLbs: number;
  contractPriceUsdKgs: number;
  totalContractQuantityKgs: number;
  totalContractValue: number;
  shippedQuantityKgs: number;
  openQty: number;
  openValue: number;
  openBookQty: number;
  openBookValue: number;
  countryOfOrigin: string;
  factory: string;
  allocationSummary: string;
}

export interface ShipmentAdvice {
  id: string;
  contractNumber: string;
  containerNumber: string;
  linerSealNumber: string;
  factory: string;
  shippedDate: string;
  blNo: string;
  vesselName: string;
  voyageDetails: string;
  scacCode: string;
  bookingNumber: string;
  estEtaDestination: string;
  qtyShippedKgs: number;
  updatedIspPortal: string;
  comments: string;
  note: string;
  remark: string;
  status: "Planned" | "Shipped";
}

export interface AllocationLine {
  id: string;
  contractNumber: string;
  countryOfOrigin: "India" | "Vietnam";
  factory?: string;
  allocatedQtyKgs: number;
}

export interface ReconciliationRecord {
  id: string;
  contractNumber: string;
  buyerOpenQty: number;
  buyerOpenValue: number;
  systemOpenQty: number;
  systemOpenValue: number;
  varianceQty: number;
  varianceValue: number;
  status: "Matched" | "Mismatch" | "Resolved";
  owner: string;
  lastUpdated: string;
}

export interface EmailLogEntry {
  id: string;
  buyer: string;
  fileName: string;
  date: string;
  status: "Success" | "Failed";
  retryCount: number;
}
