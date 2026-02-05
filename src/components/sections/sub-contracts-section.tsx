"use client";

import { useEffect, useMemo, useState } from "react";
import { MasterContract, SubContract } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/form-field";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useAppData } from "@/context/app-data";
import { useToast } from "@/components/toast-provider";

export function SubContractsSection({ contract, onAdvance }: { contract: MasterContract; onAdvance: () => void }) {
  const { subContracts, updateSubContracts, confirmAllocation } = useAppData();
  const { pushToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  const lines = useMemo(
    () => subContracts.filter((line) => line.masterContractId === contract.id),
    [subContracts, contract.id]
  );

  const [draftLines, setDraftLines] = useState<SubContract[]>(lines);

  useEffect(() => {
    setDraftLines(lines);
  }, [lines]);

  const totalAllocated = draftLines.reduce((sum, line) => sum + line.allocatedQtyKgs, 0);
  const isLocked = draftLines.every((line) => line.isAllocationConfirmed);
  const hasError = totalAllocated !== contract.totalContractQuantityKgs;

  const updateLine = (id: string, update: Partial<SubContract>) => {
    setDraftLines((prev) =>
      prev.map((line) =>
        line.id === id
          ? {
              ...line,
              ...update,
              subContractValue: Number(
                ((update.allocatedQtyKgs ?? line.allocatedQtyKgs) * (update.contractPriceUsdKgs ?? line.contractPriceUsdKgs)).toFixed(2)
              )
            }
          : line
      )
    );
  };

  const handleConfirm = () => {
    if (hasError) {
      pushToast({
        title: "Allocation mismatch",
        description: "Sum allocated qty must equal master total quantity."
      });
      return;
    }
    updateSubContracts(contract.id, draftLines);
    confirmAllocation(contract.id, draftLines);
    setShowConfirm(false);
    pushToast({
      title: "Allocation Confirmed",
      description: "Sub-contract quantities locked."
    });
    onAdvance();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sub-Contracts Allocation</CardTitle>
            <p className="text-sm text-muted-foreground">Auto-created for India + Vietnam with pricing from master.</p>
          </div>
          <Button onClick={() => setShowConfirm(true)} disabled={isLocked}>
            Confirm Allocation
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {draftLines.map((line) => (
            <div key={line.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-5">
              <div className="md:col-span-1">
                <p className="text-xs text-muted-foreground">Country</p>
                <p className="text-sm font-medium">{line.countryOfOrigin}</p>
                <p className="text-xs text-muted-foreground">{line.subContractNumber}</p>
                <p className="text-xs text-muted-foreground">Grade</p>
                <p className="text-sm font-medium">{line.gradeName ?? "-"}</p>
              </div>
              <FormField label="Factory" className="md:col-span-1">
                <Input
                  value={line.factory ?? ""}
                  onChange={(event) => updateLine(line.id, { factory: event.target.value })}
                  disabled={isLocked}
                />
              </FormField>
              <FormField label="Price / KG (USD)" className="md:col-span-1">
                <Input
                  type="number"
                  step="0.01"
                  value={line.contractPriceUsdKgs}
                  onChange={(event) => updateLine(line.id, { contractPriceUsdKgs: Number(event.target.value) })}
                  disabled={isLocked}
                />
              </FormField>
              <FormField label="Allocated Qty (KGS)" className="md:col-span-1">
                <Input
                  type="number"
                  value={line.allocatedQtyKgs}
                  onChange={(event) => updateLine(line.id, { allocatedQtyKgs: Number(event.target.value) })}
                  disabled={isLocked}
                />
              </FormField>
              <div>
                <p className="text-xs text-muted-foreground">Value</p>
                <p className="text-sm font-medium">${line.subContractValue.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-md bg-muted p-4 text-sm">
          <p>Total allocated: {totalAllocated.toLocaleString()} KGS</p>
          <p className={hasError ? "text-destructive" : "text-muted-foreground"}>
            Master total: {contract.totalContractQuantityKgs.toLocaleString()} KGS
          </p>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" asChild>
            <a href={`/contracts/${contract.id}?tab=shipments`}>Next: Add Shipments</a>
          </Button>
        </div>
      </CardContent>
      <ConfirmDialog
        open={showConfirm}
        title="Confirm Allocation"
        description="Once confirmed, allocation quantities will be locked for this contract."
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
      />
    </Card>
  );
}
