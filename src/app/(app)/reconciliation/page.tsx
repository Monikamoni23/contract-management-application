"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploadMock } from "@/components/file-upload-mock";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast-provider";
import { useAppData } from "@/context/app-data";

export default function ReconciliationPage() {
  const { reconciliations, resolveReconciliation } = useAppData();
  const { pushToast } = useToast();

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Reconciliation" }]} />
      <div>
        <h2 className="text-2xl font-semibold">Contract Alignment & Reconciliation</h2>
        <p className="text-sm text-muted-foreground">Align buyer open quantities with system records.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload buyer file</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadMock onUpload={(fileName) => pushToast({ title: "File uploaded", description: fileName })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Variance table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract No</TableHead>
                <TableHead>Buyer Open Qty</TableHead>
                <TableHead>System Open Qty</TableHead>
                <TableHead>Variance Qty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reconciliations.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.contractNumber}</TableCell>
                  <TableCell>{record.buyerOpenQty}</TableCell>
                  <TableCell>{record.systemOpenQty}</TableCell>
                  <TableCell>{record.varianceQty}</TableCell>
                  <TableCell>
                    <StatusBadge status={record.status} />
                  </TableCell>
                  <TableCell>{record.owner}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Owner" className="w-32" />
                      <Button
                        size="sm"
                        onClick={() => {
                          resolveReconciliation(record.id, "Reconciliation Team");
                          pushToast({ title: "Record resolved" });
                        }}
                      >
                        Mark Resolved
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
