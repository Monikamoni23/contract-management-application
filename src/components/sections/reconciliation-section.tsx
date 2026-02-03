"use client";

import { useMemo, useState } from "react";
import { Contract } from "@/types";
import { useAppData } from "@/context/app-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploadMock } from "@/components/file-upload-mock";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/toast-provider";

export function ReconciliationSection({ contract }: { contract: Contract }) {
  const { reconciliations, resolveReconciliation } = useAppData();
  const { pushToast } = useToast();
  const [owner, setOwner] = useState("");

  const records = useMemo(
    () => reconciliations.filter((record) => record.contractNumber === contract.contractNumber),
    [reconciliations, contract.contractNumber]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reconciliation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUploadMock
          onUpload={(fileName) =>
            pushToast({ title: "Buyer file uploaded", description: `Processing ${fileName}` })
          }
        />
        <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Field mapping</p>
            <p className="text-xs text-muted-foreground">Map buyer columns to system fields.</p>
          </div>
          <div className="space-y-2">
            <Input value="Buyer Open Qty → Open Qty" readOnly />
            <Input value="Buyer Open Value → Open Value" readOnly />
            <Input value="Contract Number → Contract No" readOnly />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract</TableHead>
              <TableHead>Buyer Open Qty</TableHead>
              <TableHead>System Open Qty</TableHead>
              <TableHead>Variance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.contractNumber}</TableCell>
                <TableCell>{record.buyerOpenQty.toLocaleString()}</TableCell>
                <TableCell>{record.systemOpenQty.toLocaleString()}</TableCell>
                <TableCell>{record.varianceQty.toLocaleString()}</TableCell>
                <TableCell>
                  <StatusBadge status={record.status} />
                </TableCell>
                <TableCell>{record.owner}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Input
                      value={owner}
                      onChange={(event) => setOwner(event.target.value)}
                      placeholder="Assign owner"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        resolveReconciliation(record.id, owner || "Unassigned");
                        pushToast({ title: "Marked resolved" });
                      }}
                    >
                      Resolve
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
