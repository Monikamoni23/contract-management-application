export type ContractStatus = "Draft" | "Open" | "Closed";
export type ShipmentStatus = "Draft" | "In Progress" | "Shipped" | "Completed";

export interface MasterContract {
  id: string;
  contractNumber: string;
  rcnContractNumber: string;
  dateSigningContract: string;
  year: string;
  gradeId: string;
  gradeName: string;
  status: ContractStatus;
  shipmentPeriod: string;
  incoterms: string;
  totalContractQuantityKgs: number;
  totalContractValue: number;
  shippedQuantityKgs: number;
  openQty: number;
  openValue: number;
  openBookQty: number;
  openBookValue: number;
  allocationSummary: string;
}

export interface SubContract {
  id: string;
  masterContractId: string;
  subContractNumber: string;
  gradeId?: string;
  gradeName?: string;
  countryOfOrigin: "India" | "Vietnam";
  factory?: string;
  allocatedQtyKgs: number;
  contractPriceUsdKgs: number;
  subContractValue: number;
  status: "Open" | "Closed";
  isAllocationConfirmed: boolean;
}

export interface Shipment {
  id: string;
  masterContractId: string;
  subContractId: string;
  countryOfOrigin: "India" | "Vietnam";
  factory: string;
  shipmentStatus: ShipmentStatus;
  containerNumber: string;
  linerSealNumber: string;
  shippedDate: string;
  blNo: string;
  vesselName: string;
  voyageDetails: string;
  scacCode: string;
  bookingNumber: string;
  estEtaDestination: string;
  qtyShippedKgs: number;
  updatedIspPortal: boolean;
  comments: string;
  note: string;
  remark: string;
}

export interface PricingMaster {
  id: string;
  gradeId: string;
  countryId: "India" | "Vietnam";
  contractPriceUsdKgs: number;
  contractPriceUsdMt?: number;
  contractPriceUsdLbs?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  notes?: string;
}

export interface ReconciliationRow {
  id: string;
  contractNumber: string;
  buyerOpenQty: number;
  buyerOpenValue: number;
  buyerAskedValue: number;
  buyerReceivedQty: number;
  sellerSentQty: number;
  productOrigin: string;
  contractDetails: string;
  systemOpenQty: number;
  systemOpenValue: number;
  varianceQty: number;
  varianceValue: number;
  status: "Matched" | "Mismatch" | "Resolved";
  owner: string;
  lastUpdated: string;
  notes: string;
}

export interface EmailLogEntry {
  id: string;
  buyer: string;
  fileName: string;
  date: string;
  status: "Success" | "Failed";
  retryCount: number;
}

export interface WeeklyReportLog {
  id: string;
  contractId: string;
  contractNumber: string;
  fileName: string;
  runDate: string;
  status: "Success" | "Failed";
}
