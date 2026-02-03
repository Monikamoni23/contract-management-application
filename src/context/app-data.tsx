"use client";

import * as React from "react";
import { AllocationLine, Contract, EmailLogEntry, ReconciliationRecord, ShipmentAdvice } from "@/types";
import { allocationLines, contracts as seedContracts, emailLogs as seedEmailLogs, reconciliationRecords, shipments as seedShipments } from "@/mock/seed-data";

export type AppDataContextValue = {
  contracts: Contract[];
  shipments: ShipmentAdvice[];
  allocations: AllocationLine[];
  reconciliations: ReconciliationRecord[];
  emailLogs: EmailLogEntry[];
  addContract: (contract: Contract) => void;
  updateAllocation: (contractNumber: string, lines: AllocationLine[]) => void;
  confirmAllocation: (contractNumber: string) => void;
  addShipment: (shipment: ShipmentAdvice) => void;
  markShipmentShipped: (shipmentId: string) => void;
  addEmailLog: (entry: EmailLogEntry) => void;
  resolveReconciliation: (recordId: string, owner: string) => void;
};

const AppDataContext = React.createContext<AppDataContextValue | undefined>(undefined);

export function useAppData() {
  const context = React.useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [contracts, setContracts] = React.useState<Contract[]>(seedContracts);
  const [shipments, setShipments] = React.useState<ShipmentAdvice[]>(seedShipments);
  const [allocations, setAllocations] = React.useState<AllocationLine[]>(allocationLines);
  const [reconciliations, setReconciliations] = React.useState<ReconciliationRecord[]>(reconciliationRecords);
  const [emailLogs, setEmailLogs] = React.useState<EmailLogEntry[]>(seedEmailLogs);

  const addContract = (contract: Contract) => {
    setContracts((prev) => [contract, ...prev]);
  };

  const updateAllocation = (contractNumber: string, lines: AllocationLine[]) => {
    setAllocations((prev) => [...prev.filter((line) => line.contractNumber !== contractNumber), ...lines]);
  };

  const confirmAllocation = (contractNumber: string) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.contractNumber === contractNumber
          ? {
              ...contract,
              allocationSummary: "Allocation confirmed",
              status: contract.status === "Draft" ? "In Progress" : contract.status
            }
          : contract
      )
    );
  };

  const addShipment = (shipment: ShipmentAdvice) => {
    setShipments((prev) => [shipment, ...prev]);
    setContracts((prev) =>
      prev.map((contract) => {
        if (contract.contractNumber !== shipment.contractNumber) return contract;
        const newShipped = contract.shippedQuantityKgs + shipment.qtyShippedKgs;
        const newOpen = Math.max(contract.totalContractQuantityKgs - newShipped, 0);
        return {
          ...contract,
          shippedQuantityKgs: newShipped,
          openQty: newOpen,
          openValue: newOpen * contract.contractPriceUsdKgs
        };
      })
    );
  };

  const markShipmentShipped = (shipmentId: string) => {
    setShipments((prev) =>
      prev.map((shipment) => (shipment.id === shipmentId ? { ...shipment, status: "Shipped" } : shipment))
    );
  };

  const addEmailLog = (entry: EmailLogEntry) => {
    setEmailLogs((prev) => [entry, ...prev]);
  };

  const resolveReconciliation = (recordId: string, owner: string) => {
    setReconciliations((prev) =>
      prev.map((record) =>
        record.id === recordId
          ? { ...record, status: "Resolved", owner, lastUpdated: new Date().toISOString().split("T")[0] }
          : record
      )
    );
  };

  return (
    <AppDataContext.Provider
      value={{
        contracts,
        shipments,
        allocations,
        reconciliations,
        emailLogs,
        addContract,
        updateAllocation,
        confirmAllocation,
        addShipment,
        markShipmentShipped,
        addEmailLog,
        resolveReconciliation
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
