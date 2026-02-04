"use client";

import * as React from "react";
import {
  EmailLogEntry,
  MasterContract,
  PricingMaster,
  ReconciliationRow,
  Shipment,
  SubContract,
  WeeklyReportLog
} from "@/types";
import { masterContracts as seedContracts } from "@/mock/contracts";
import { subContracts as seedSubContracts } from "@/mock/subContracts";
import { shipments as seedShipments } from "@/mock/shipments";
import { pricingMaster as seedPricing } from "@/mock/pricing";
import { reconciliationRows } from "@/mock/reconciliation";
import { emailLogs as seedEmailLogs } from "@/mock/email-logs";
import { weeklyReports as seedWeeklyReports } from "@/mock/weekly-reports";

export type AppDataContextValue = {
  contracts: MasterContract[];
  subContracts: SubContract[];
  shipments: Shipment[];
  pricing: PricingMaster[];
  reconciliations: ReconciliationRow[];
  emailLogs: EmailLogEntry[];
  weeklyReports: WeeklyReportLog[];
  addContract: (contract: MasterContract) => void;
  updateSubContracts: (contractId: string, lines: SubContract[]) => void;
  confirmAllocation: (contractId: string, lines?: SubContract[]) => void;
  addShipment: (shipment: Shipment) => void;
  markShipmentShipped: (shipmentId: string) => void;
  addEmailLog: (entry: EmailLogEntry) => void;
  addWeeklyReports: (entries: WeeklyReportLog[]) => void;
  resolveReconciliation: (recordId: string, owner: string, notes: string) => void;
};

const AppDataContext = React.createContext<AppDataContextValue | undefined>(undefined);

export function useAppData() {
  const context = React.useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
}

const buildAllocationSummary = (lines: SubContract[]) => {
  const india = lines.find((line) => line.countryOfOrigin === "India")?.allocatedQtyKgs ?? 0;
  const vietnam = lines.find((line) => line.countryOfOrigin === "Vietnam")?.allocatedQtyKgs ?? 0;
  return `India: ${india.toLocaleString()} | Vietnam: ${vietnam.toLocaleString()}`;
};

const calculateTotals = (contract: MasterContract, lines: SubContract[], shipments: Shipment[]) => {
  const totalValue = lines.reduce((sum, line) => sum + line.subContractValue, 0);
  const shippedEntries = shipments.filter(
    (shipment) => shipment.masterContractId === contract.id && ["Shipped", "Completed"].includes(shipment.shipmentStatus)
  );
  const shippedQty = shippedEntries.reduce((sum, shipment) => sum + shipment.qtyShippedKgs, 0);
  const shippedValue = shippedEntries.reduce((sum, shipment) => {
    const price = lines.find((line) => line.id === shipment.subContractId)?.contractPriceUsdKgs ?? 0;
    return sum + shipment.qtyShippedKgs * price;
  }, 0);
  const openQty = Math.max(contract.totalContractQuantityKgs - shippedQty, 0);
  const openValue = Math.max(totalValue - shippedValue, 0);
  return { totalValue, shippedQty, openQty, openValue };
};

const hydrateContracts = (
  contracts: MasterContract[],
  subContracts: SubContract[],
  shipments: Shipment[]
): MasterContract[] =>
  contracts.map((contract) => {
    const lines = subContracts.filter((line) => line.masterContractId === contract.id);
    const totals = calculateTotals(contract, lines, shipments);
    return {
      ...contract,
      totalContractValue: totals.totalValue,
      shippedQuantityKgs: totals.shippedQty,
      openQty: totals.openQty,
      openValue: totals.openValue,
      allocationSummary: buildAllocationSummary(lines)
    };
  });

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [subContracts, setSubContracts] = React.useState<SubContract[]>(seedSubContracts);
  const [shipments, setShipments] = React.useState<Shipment[]>(seedShipments);
  const [contracts, setContracts] = React.useState<MasterContract[]>(
    () => hydrateContracts(seedContracts, seedSubContracts, seedShipments)
  );
  const [pricing] = React.useState<PricingMaster[]>(seedPricing);
  const [reconciliations, setReconciliations] = React.useState<ReconciliationRow[]>(reconciliationRows);
  const [emailLogs, setEmailLogs] = React.useState<EmailLogEntry[]>(seedEmailLogs);
  const [weeklyReports, setWeeklyReports] = React.useState<WeeklyReportLog[]>(seedWeeklyReports);

  const addContract = (contract: MasterContract) => {
    const indiaPrice = pricing.find((price) => price.gradeId === contract.gradeId && price.countryId === "India")
      ?.contractPriceUsdKgs;
    const vietnamPrice = pricing.find((price) => price.gradeId === contract.gradeId && price.countryId === "Vietnam")
      ?.contractPriceUsdKgs;
    const newLines: SubContract[] = [
      {
        id: `${contract.id}-ind`,
        masterContractId: contract.id,
        subContractNumber: `${contract.contractNumber}-IND`,
        countryOfOrigin: "India",
        factory: "Blue River Plant",
        allocatedQtyKgs: 0,
        contractPriceUsdKgs: indiaPrice ?? 3.5,
        subContractValue: 0,
        status: "Open",
        isAllocationConfirmed: false
      },
      {
        id: `${contract.id}-vnm`,
        masterContractId: contract.id,
        subContractNumber: `${contract.contractNumber}-VNM`,
        countryOfOrigin: "Vietnam",
        factory: "Saigon Export Hub",
        allocatedQtyKgs: 0,
        contractPriceUsdKgs: vietnamPrice ?? 3.4,
        subContractValue: 0,
        status: "Open",
        isAllocationConfirmed: false
      }
    ];
    setSubContracts((prev) => [...newLines, ...prev]);
    setContracts((prev) => [
      {
        ...contract,
        totalContractValue: 0,
        shippedQuantityKgs: 0,
        openQty: contract.totalContractQuantityKgs,
        openValue: 0,
        allocationSummary: buildAllocationSummary(newLines)
      },
      ...prev
    ]);
  };

  const updateSubContracts = (contractId: string, lines: SubContract[]) => {
    setSubContracts((prev) => [
      ...prev.filter((line) => line.masterContractId !== contractId),
      ...lines
    ]);
  };

  const confirmAllocation = (contractId: string, linesOverride?: SubContract[]) => {
    setSubContracts((prev) =>
      prev.map((line) =>
        line.masterContractId === contractId ? { ...line, isAllocationConfirmed: true } : line
      )
    );
    setContracts((prev) =>
      prev.map((contract) => {
        if (contract.id !== contractId) return contract;
        const lines = (linesOverride ?? subContracts)
          .filter((line) => line.masterContractId === contractId)
          .map((line) => ({ ...line, isAllocationConfirmed: true }));
        const totals = calculateTotals(contract, lines, shipments);
        return {
          ...contract,
          status: "Open",
          totalContractValue: totals.totalValue,
          shippedQuantityKgs: totals.shippedQty,
          openQty: totals.openQty,
          openValue: totals.openValue,
          allocationSummary: buildAllocationSummary(lines)
        };
      })
    );
  };

  const addShipment = (shipment: Shipment) => {
    setShipments((prev) => [shipment, ...prev]);
  };

  const markShipmentShipped = (shipmentId: string) => {
    setShipments((prev) =>
      prev.map((shipment) =>
        shipment.id === shipmentId ? { ...shipment, shipmentStatus: "Shipped" } : shipment
      )
    );
    const shipment = shipments.find((item) => item.id === shipmentId);
    if (!shipment) return;
    const contractId = shipment.masterContractId;
    const nextShipments = shipments.map((item) =>
      item.id === shipmentId ? { ...item, shipmentStatus: "Shipped" } : item
    );
    const lines = subContracts.filter((line) => line.masterContractId === contractId);
    setContracts((prev) =>
      prev.map((contract) => {
        if (contract.id !== contractId) return contract;
        const totals = calculateTotals(contract, lines, nextShipments);
        return {
          ...contract,
          status: totals.openQty === 0 ? "Closed" : contract.status,
          totalContractValue: totals.totalValue,
          shippedQuantityKgs: totals.shippedQty,
          openQty: totals.openQty,
          openValue: totals.openValue
        };
      })
    );
  };

  const addEmailLog = (entry: EmailLogEntry) => {
    setEmailLogs((prev) => [entry, ...prev]);
  };

  const addWeeklyReports = (entries: WeeklyReportLog[]) => {
    setWeeklyReports((prev) => [...entries, ...prev]);
  };

  const resolveReconciliation = (recordId: string, owner: string, notes: string) => {
    setReconciliations((prev) =>
      prev.map((record) =>
        record.id === recordId
          ? {
              ...record,
              status: "Resolved",
              owner,
              notes,
              lastUpdated: new Date().toISOString().split("T")[0]
            }
          : record
      )
    );
  };

  return (
    <AppDataContext.Provider
      value={{
        contracts,
        subContracts,
        shipments,
        pricing,
        reconciliations,
        emailLogs,
        weeklyReports,
        addContract,
        updateSubContracts,
        confirmAllocation,
        addShipment,
        markShipmentShipped,
        addEmailLog,
        addWeeklyReports,
        resolveReconciliation
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
