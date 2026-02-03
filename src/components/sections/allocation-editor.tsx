"use client";

import { useMemo, useState } from "react";
import { AllocationLine, Contract } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectViewport } from "@/components/ui/select";
import { FormField } from "@/components/form-field";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useAppData } from "@/context/app-data";
import { useToast } from "@/components/toast-provider";

const countryOptions: Array<"India" | "Vietnam"> = ["India", "Vietnam"];

export function AllocationEditor({ contract, onAdvance }: { contract: Contract; onAdvance: () => void }) {
  const { allocations, updateAllocation, confirmAllocation } = useAppData();
  const { pushToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [lines, setLines] = useState<AllocationLine[]>(() =>
    allocations.filter((line) => line.contractNumber === contract.contractNumber)
  );

  const totalAllocated = useMemo(
    () => lines.reduce((sum, line) => sum + line.allocatedQtyKgs, 0),
    [lines]
  );

  const isLocked = contract.allocationSummary === "Allocation confirmed";
  const hasError = totalAllocated !== contract.totalContractQuantityKgs;

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      {
        id: `alloc-${crypto.randomUUID()}`,
        contractNumber: contract.contractNumber,
        countryOfOrigin: "India",
        factory: "",
        allocatedQtyKgs: 0
      }
    ]);
  };

  const updateLine = (index: number, update: Partial<AllocationLine>) => {
    setLines((prev) => prev.map((line, idx) => (idx === index ? { ...line, ...update } : line)));
  };

  const handleConfirm = () => {
    if (hasError) {
      pushToast({
        title: "Allocation mismatch",
        description: "Total allocated quantity must match total contract quantity."
      });
      return;
    }
    updateAllocation(contract.contractNumber, lines);
    confirmAllocation(contract.contractNumber);
    setShowConfirm(false);
    pushToast({
      title: "Allocation confirmed",
      description: "Allocation locked and ready for shipment planning."
    });
    onAdvance();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Allocation editor</CardTitle>
          <Button variant="outline" onClick={addLine} disabled={isLocked}>
            Add line
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {lines.length === 0 ? <p className="text-sm text-muted-foreground">No allocations yet.</p> : null}
        {lines.map((line, index) => (
          <div key={line.id} className="grid gap-4 md:grid-cols-3">
            <FormField label="Country of Origin">
              <Select
                value={line.countryOfOrigin}
                onValueChange={(value) => updateLine(index, { countryOfOrigin: value as "India" | "Vietnam" })}
                disabled={isLocked}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectViewport>
                    {countryOptions.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectViewport>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Factory (optional)">
              <Input
                value={line.factory ?? ""}
                onChange={(event) => updateLine(index, { factory: event.target.value })}
                placeholder="Factory"
                disabled={isLocked}
              />
            </FormField>
            <FormField label="Allocated Qty (KGS)">
              <Input
                type="number"
                value={line.allocatedQtyKgs}
                onChange={(event) => updateLine(index, { allocatedQtyKgs: Number(event.target.value) })}
                disabled={isLocked}
              />
            </FormField>
          </div>
        ))}
        <div className="rounded-md bg-muted p-4 text-sm">
          <p>Total allocated: {totalAllocated.toLocaleString()} KGS</p>
          <p className={hasError ? "text-destructive" : "text-muted-foreground"}>
            Total contract qty: {contract.totalContractQuantityKgs.toLocaleString()} KGS
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            asChild
          >
            <a href={`/contracts/${contract.id}?tab=shipments`}>Next: Add Shipments</a>
          </Button>
          <Button onClick={() => setShowConfirm(true)} disabled={isLocked}>
            Confirm Allocation
          </Button>
        </div>
      </CardContent>
      <ConfirmDialog
        open={showConfirm}
        title="Confirm Allocation"
        description="Once confirmed, allocation lines will be locked for this contract."
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
      />
    </Card>
  );
}
