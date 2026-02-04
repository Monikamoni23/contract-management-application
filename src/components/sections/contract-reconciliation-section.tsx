"use client";

import { useMemo, useState } from "react";
import { MasterContract } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/context/app-data";
import { useToast } from "@/components/toast-provider";
import { StatusBadge } from "@/components/status-badge";

export function ContractReconciliationSection({ contract }: { contract: MasterContract }) {
  const { reconciliations, resolveReconciliation } = useAppData();
  const { pushToast } = useToast();
  const record = useMemo(
    () => reconciliations.find((row) => row.contractNumber === contract.contractNumber),
    [reconciliations, contract.contractNumber]
  );
  const [owner, setOwner] = useState(record?.owner ?? "");
  const [notes, setNotes] = useState(record?.notes ?? "");

  if (!record) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reconciliation</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">No reconciliation record yet.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reconciliation Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Buyer Open Qty</p>
            <p className="text-sm font-medium">{record.buyerOpenQty.toLocaleString()} KGS</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">System Open Qty</p>
            <p className="text-sm font-medium">{record.systemOpenQty.toLocaleString()} KGS</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Variance Qty</p>
            <p className="text-sm font-medium">{record.varianceQty.toLocaleString()} KGS</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <StatusBadge status={record.status} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Owner</p>
            <Input value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="Assign owner" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Notes</p>
            <Input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add notes" />
          </div>
        </div>
        <Button
          onClick={() => {
            resolveReconciliation(record.id, owner || "Reconciliation Team", notes);
            pushToast({ title: "Reconciliation updated" });
          }}
        >
          Mark Resolved
        </Button>
      </CardContent>
    </Card>
  );
}
