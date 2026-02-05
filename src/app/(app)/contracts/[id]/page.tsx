"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StatusBadge } from "@/components/status-badge";
import { Stepper } from "@/components/stepper";
import { useAppData } from "@/context/app-data";
import { ShipmentsSection } from "@/components/sections/shipments-section";
import { ActivityLog } from "@/components/sections/activity-log";
import { SubContractsSection } from "@/components/sections/sub-contracts-section";
import { WeeklyReportsSection } from "@/components/sections/weekly-reports-section";
import { ContractOverview } from "@/components/sections/contract-overview";
import { ContractReconciliationSection } from "@/components/sections/contract-reconciliation-section";

const steps = [
  "Create Master Contract",
  "Auto Create Sub-Contracts",
  "Allocate Qty per Sub-Contract",
  "Add Shipments",
  "Weekly Report",
  "Reconcile",
];

export default function ContractDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { contracts } = useAppData();
  const [currentStep, setCurrentStep] = useState(2);

  const contract = contracts.find((item) => item.id === params.id);
  const activeTab = searchParams.get("tab") ?? "overview";

  const stepIndex = useMemo(() => {
    if (!contract) return 0;
    if (contract.status === "Draft") return 1;
    if (contract.openQty === 0) return 5;
    return 3;
  }, [contract]);

  if (!contract) {
    return <p>Contract not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Contracts", href: "/contracts" },
          { label: contract.contractNumber },
        ]}
      />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{contract.contractNumber}</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Grade: {contract.gradeName}</span>
            <span>RCN: {contract.rcnContractNumber}</span>
            <span>Shipment period: {contract.shipmentPeriod}</span>
          </div>
          <StatusBadge status={contract.status} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button variant={"outline"} asChild>
            <Link href={`/contracts/${contract.id}?tab=sub-contracts`}>
              Next: Sub-Contracts
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/contracts">Back to Contracts</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Contract Value</p>
          <p className="text-lg font-semibold">
            ${contract.totalContractValue.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Shipped Quantity</p>
          <p className="text-lg font-semibold">
            {contract.shippedQuantityKgs.toLocaleString()} KGS
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Open Quantity</p>
          <p className="text-lg font-semibold">
            {contract.openQty.toLocaleString()} KGS
          </p>
        </div>
      </div>

      <Stepper currentStep={Math.max(stepIndex, currentStep)} steps={steps} />

      <Tabs value={activeTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview" asChild>
            <Link href={`/contracts/${contract.id}?tab=overview`}>
              Overview
            </Link>
          </TabsTrigger>
          <TabsTrigger value="sub-contracts" asChild>
            <Link href={`/contracts/${contract.id}?tab=sub-contracts`}>
              Sub-Contracts
            </Link>
          </TabsTrigger>
          <TabsTrigger value="shipments" asChild>
            <Link href={`/contracts/${contract.id}?tab=shipments`}>
              Shipments
            </Link>
          </TabsTrigger>
          <TabsTrigger value="weekly-reports" asChild>
            <Link href={`/contracts/${contract.id}?tab=weekly-reports`}>
              Weekly Reports
            </Link>
          </TabsTrigger>
          <TabsTrigger value="reconciliation" asChild>
            <Link href={`/contracts/${contract.id}?tab=reconciliation`}>
              Reconciliation
            </Link>
          </TabsTrigger>
          <TabsTrigger value="activity" asChild>
            <Link href={`/contracts/${contract.id}?tab=activity`}>
              Activity Log
            </Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ContractOverview contract={contract} />
        </TabsContent>

        <TabsContent value="sub-contracts">
          <SubContractsSection
            contract={contract}
            onAdvance={() => setCurrentStep(3)}
          />
        </TabsContent>

        <TabsContent value="shipments">
          <ShipmentsSection
            contract={contract}
            onAdvance={() => setCurrentStep(4)}
          />
        </TabsContent>

        <TabsContent value="weekly-reports">
          <WeeklyReportsSection contractId={contract.id} />
        </TabsContent>

        <TabsContent value="reconciliation">
          <ContractReconciliationSection contract={contract} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityLog contract={contract} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
