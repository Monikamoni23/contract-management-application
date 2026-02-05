"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploadMock } from "@/components/file-upload-mock";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast-provider";
import { useAppData } from "@/context/app-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/select";

const mappingFields = [
  "Contract Number",
  "Buyer Open Qty",
  "Buyer Open Value",
  "Buyer Asked Value",
  "Buyer Received Qty",
  "Seller Sent Qty",
  "Product Origin",
  "Contract Details",
  "Buyer Status",
];

export default function ReconciliationPage() {
  const { reconciliations, resolveReconciliation } = useAppData();
  const { pushToast } = useToast();
  const [ownerById, setOwnerById] = useState<Record<string, string>>({});
  const [notesById, setNotesById] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Reconciliation" }]} />
      <div>
        <h2 className="text-2xl font-semibold">
          Contract Alignment & Reconciliation
        </h2>
        <p className="text-sm text-muted-foreground">
          Align buyer open quantities with system records.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload buyer file</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUploadMock
            onUpload={(fileName) =>
              pushToast({ title: "File uploaded", description: fileName })
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
            {mappingFields.map((field) => (
              <div key={field}>
                <p className="text-xs text-muted-foreground">
                  Map buyer field: {field}
                </p>
                <Select defaultValue="Column A">
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectViewport>
                      {["Column A", "Column B", "Column C", "Column D"].map(
                        (col) => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ),
                      )}
                    </SelectViewport>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
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
                <TableHead>Buyer Open Value</TableHead>
                <TableHead>Buyer Asked Value</TableHead>
                <TableHead>Buyer Received</TableHead>
                <TableHead>Seller Sent</TableHead>
                <TableHead>Product Origin</TableHead>
                <TableHead>Contract Details</TableHead>
                <TableHead>System Open Qty</TableHead>
                <TableHead>System Open Value</TableHead>
                <TableHead>Variance Qty</TableHead>
                <TableHead>Variance Value</TableHead>
                {/* <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Action</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reconciliations.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.contractNumber}</TableCell>
                  <TableCell>{record.buyerOpenQty.toLocaleString()}</TableCell>
                  <TableCell>
                    ${record.buyerOpenValue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    ${record.buyerAskedValue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {record.buyerReceivedQty.toLocaleString()} KGS
                  </TableCell>
                  <TableCell>
                    {record.sellerSentQty.toLocaleString()} KGS
                  </TableCell>
                  <TableCell>{record.productOrigin}</TableCell>
                  <TableCell>{record.contractDetails}</TableCell>
                  <TableCell>{record.systemOpenQty.toLocaleString()}</TableCell>
                  <TableCell>
                    ${record.systemOpenValue.toLocaleString()}
                  </TableCell>
                  <TableCell>{record.varianceQty.toLocaleString()}</TableCell>
                  <TableCell>
                    ${record.varianceValue.toLocaleString()}
                  </TableCell>
                  {/* <TableCell>
                    <StatusBadge status={record.status} />
                  </TableCell> */}
                  {/* <TableCell>
                    <Input
                      placeholder="Owner"
                      className="w-32"
                      value={ownerById[record.id] ?? record.owner}
                      onChange={(event) =>
                        setOwnerById((prev) => ({
                          ...prev,
                          [record.id]: event.target.value
                        }))
                      }
                    />
                  </TableCell> */}
                  {/* <TableCell>
                    <Input
                      placeholder="Notes"
                      className="w-40"
                      value={notesById[record.id] ?? record.notes}
                      onChange={(event) =>
                        setNotesById((prev) => ({
                          ...prev,
                          [record.id]: event.target.value
                        }))
                      }
                    />
                  </TableCell> */}
                  {/* <TableCell>
                    <Button
                      size="sm"
                      onClick={() => {
                        resolveReconciliation(
                          record.id,
                          ownerById[record.id] ?? record.owner,
                          notesById[record.id] ?? record.notes
                        );
                        pushToast({ title: "Record resolved" });
                      }}
                    >
                      Mark Resolved
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
