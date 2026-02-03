"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StatusBadge } from "@/components/status-badge";
import { Stepper } from "@/components/stepper";
import { useAppData } from "@/context/app-data";
import { AllocationEditor } from "@/components/sections/allocation-editor";
import { ShipmentsSection } from "@/components/sections/shipments-section";
import { ReconciliationSection } from "@/components/sections/reconciliation-section";
import { ActivityLog } from "@/components/sections/activity-log";

export default function ContractDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { contracts } = useAppData();
  const [currentStep, setCurrentStep] = useState(1);

  const contract = contracts.find((item) => item.id === params.id);
  const activeTab = searchParams.get("tab") ?? "overview";

  const stepIndex = useMemo(() => {
    if (!contract) return 0;
    if (contract.status === "Draft") return 0;
    if (contract.status === "In Progress") return 1;
    return 2;
  }, [contract]);

  if (!contract) {
    return <p>Contract not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Contracts", href: "/contracts" },
          { label: contract.contractNumber }
        ]}
      />
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{contract.contractNumber}</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Grade: {contract.grade}</span>
            <span>Factory: {contract.factory}</span>
            <span>Shipment period: {contract.shipmentPeriod}</span>
          </div>
          <StatusBadge status={contract.status} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button asChild>
            <Link href={`/contracts/${contract.id}?tab=allocation`}>Next: Allocate</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/contracts">Back to Contracts</Link>
          </Button>
        </div>
      </div>

      <Stepper currentStep={Math.max(stepIndex, currentStep)} />

      <Tabs value={activeTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview" asChild>
            <Link href={`/contracts/${contract.id}?tab=overview`}>Overview</Link>
          </TabsTrigger>
          <TabsTrigger value="allocation" asChild>
            <Link href={`/contracts/${contract.id}?tab=allocation`}>Allocation</Link>
          </TabsTrigger>
          <TabsTrigger value="shipments" asChild>
            <Link href={`/contracts/${contract.id}?tab=shipments`}>Shipments</Link>
          </TabsTrigger>
          <TabsTrigger value="reconciliation" asChild>
            <Link href={`/contracts/${contract.id}?tab=reconciliation`}>Reconciliation</Link>
          </TabsTrigger>
          <TabsTrigger value="activity" asChild>
            <Link href={`/contracts/${contract.id}?tab=activity`}>Activity Log</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Contract summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Total Contract Quantity</p>
                <p className="text-lg font-semibold">{contract.totalContractQuantityKgs.toLocaleString()} KGS</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Open Qty</p>
                <p className="text-lg font-semibold">{contract.openQty.toLocaleString()} KGS</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Open Value</p>
                <p className="text-lg font-semibold">${contract.openValue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Incoterms</p>
                <p className="text-sm font-medium">{contract.incoterms}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Country of Origin</p>
                <p className="text-sm font-medium">{contract.countryOfOrigin}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Allocation Summary</p>
                <p className="text-sm font-medium">{contract.allocationSummary}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation">
          <AllocationEditor contract={contract} onAdvance={() => setCurrentStep(2)} />
        </TabsContent>

        <TabsContent value="shipments">
          <ShipmentsSection contract={contract} onAdvance={() => setCurrentStep(3)} />
        </TabsContent>

        <TabsContent value="reconciliation">
          <ReconciliationSection contract={contract} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityLog contract={contract} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
