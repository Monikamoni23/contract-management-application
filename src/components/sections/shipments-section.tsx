"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DrawerForm } from "@/components/drawer-form";
import { FormField } from "@/components/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppData } from "@/context/app-data";
import { MasterContract, Shipment } from "@/types";
import { useToast } from "@/components/toast-provider";
import { StatusBadge } from "@/components/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectViewport } from "@/components/ui/select";
import { DataTable } from "@/components/data-table";

const shipmentSchema = z.object({
  subContractId: z.string().min(1, "Sub-contract required"),
  containerNumber: z.string().min(1, "Container number required"),
  linerSealNumber: z.string().min(1, "Liner seal required"),
  factory: z.string().min(1, "Factory required"),
  shippedDate: z.string().min(1, "Shipped date required"),
  blNo: z.string().min(1, "BL No required"),
  vesselName: z.string().min(1, "Vessel name required"),
  voyageDetails: z.string().min(1, "Voyage details required"),
  scacCode: z.string().min(1, "SCAC code required"),
  bookingNumber: z.string().min(1, "Booking number required"),
  estEtaDestination: z.string().min(1, "ETA required"),
  qtyShippedKgs: z.coerce.number().min(1, "Qty shipped required"),
  updatedIspPortal: z.boolean(),
  comments: z.string().optional(),
  note: z.string().optional(),
  remark: z.string().optional()
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

export function ShipmentsSection({ contract, onAdvance }: { contract: MasterContract; onAdvance: () => void }) {
  const { shipments, addShipment, markShipmentShipped, subContracts } = useAppData();
  const { pushToast } = useToast();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);

  const contractShipments = useMemo(
    () => shipments.filter((shipment) => shipment.masterContractId === contract.id),
    [shipments, contract.id]
  );
  const contractSubContracts = useMemo(
    () => subContracts.filter((line) => line.masterContractId === contract.id),
    [subContracts, contract.id]
  );

  const tableData = useMemo(
    () =>
      contractShipments.map((shipment) => {
        const line = contractSubContracts.find((item) => item.id === shipment.subContractId);
        return {
          ...shipment,
          subContractNumber: line?.subContractNumber ?? shipment.subContractId,
          countryOfOrigin: shipment.countryOfOrigin,
          factory: shipment.factory
        };
      }),
    [contractShipments, contractSubContracts]
  );

  const allShipmentsCompleted =
    contractShipments.length > 0 &&
    contractShipments.every((shipment) => ["Shipped", "Completed"].includes(shipment.shipmentStatus));

  const handleDownloadInvoice = () => {
    if (!allShipmentsCompleted) return;
    const invoiceDate = new Date().toLocaleDateString("en-GB");
    const invoiceWindow = window.open("", "_blank", "width=900,height=1000");
    if (!invoiceWindow) {
      pushToast({ title: "Popup blocked", description: "Allow popups to preview and download the invoice." });
      return;
    }
    const invoiceHtml = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Invoice ${contract.contractNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #111; }
            h1 { margin: 0 0 8px; font-size: 22px; }
            h2 { margin: 0; font-size: 16px; }
            .row { display: flex; justify-content: space-between; }
            .muted { color: #555; font-size: 12px; }
            .invoice { border: 1px solid #ddd; padding: 24px; border-radius: 8px; }
            .toolbar { display: flex; gap: 12px; justify-content: flex-end; margin-bottom: 12px; }
            .btn { padding: 8px 12px; border: 1px solid #222; border-radius: 6px; background: #fff; cursor: pointer; }
            .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; font-size: 13px; text-align: left; }
            .total { text-align: right; margin-top: 12px; font-weight: bold; }
            .editable { outline: none; }
            @media print {
              .toolbar { display: none; }
              body { margin: 0; }
              .invoice { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <button class="btn" onclick="window.print()">Download PDF</button>
          </div>
          <div class="invoice editable" contenteditable="true">
            <div class="row">
              <div>
                <h1>[Company Logo]</h1>
                <div class="muted">Seller Name</div>
                <div class="muted">[Address]</div>
                <div class="muted">[Contact Info]</div>
                <div class="muted">GSTIN: XXXXXXXXXXXXXX</div>
              </div>
              <div>
                <h2>TAX INVOICE</h2>
                <div class="muted">Invoice #: ${contract.contractNumber}</div>
                <div class="muted">Date: ${invoiceDate}</div>
              </div>
            </div>
            <hr />
            <div class="muted">Bill To: [Buyer Name/Address]</div>
            <div class="muted">Commodity: Raw Cashew Nuts (Origin: XXXXX)</div>
            <div class="muted">Quality: Outturn 48 lbs, Nut Count 190/kg, Moisture 10% max.</div>
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cashew W320</td>
                  <td>500 kg</td>
                  <td>₹650</td>
                  <td>₹3,25,000</td>
                </tr>
              </tbody>
            </table>
            <div class="total">Subtotal: ₹3,25,000</div>
            <div class="total">GST (5%): ₹16,250</div>
            <div class="total">Total Payable: ₹3,41,250</div>
            <p class="muted">Declaration: We declare that this invoice shows the actual price of the goods.</p>
            <p class="muted">[Authorized Signatory]</p>
            <p class="muted">Product: Cashew Nuts</p>
          </div>
        </body>
      </html>`;
    invoiceWindow.document.open();
    invoiceWindow.document.write(invoiceHtml);
    invoiceWindow.document.close();
    pushToast({ title: "Invoice ready", description: "Edit the invoice and click Download PDF." });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      updatedIspPortal: false
    }
  });

  const handleCreateShipment = (values: ShipmentFormValues) => {
    const selectedSub = contractSubContracts.find((line) => line.id === values.subContractId);
    if (!selectedSub) {
      pushToast({ title: "Select a sub-contract" });
      return;
    }
    if (values.qtyShippedKgs > selectedSub.allocatedQtyKgs) {
      pushToast({ title: "Qty exceeds allocation", description: "Reduce shipment qty." });
      return;
    }
    const newShipment: Shipment = {
      id: `s-${crypto.randomUUID()}`,
      masterContractId: contract.id,
      subContractId: values.subContractId,
      countryOfOrigin: selectedSub.countryOfOrigin,
      factory: values.factory,
      shipmentStatus: "Draft",
      containerNumber: values.containerNumber,
      linerSealNumber: values.linerSealNumber,
      shippedDate: values.shippedDate,
      blNo: values.blNo,
      vesselName: values.vesselName,
      voyageDetails: values.voyageDetails,
      scacCode: values.scacCode,
      bookingNumber: values.bookingNumber,
      estEtaDestination: values.estEtaDestination,
      qtyShippedKgs: values.qtyShippedKgs,
      updatedIspPortal: values.updatedIspPortal,
      comments: values.comments ?? "",
      note: values.note ?? "",
      remark: values.remark ?? ""
    };
    addShipment(newShipment);
    pushToast({ title: "Shipment created", description: "Shipment advice saved." });
    setOpenDrawer(false);
    reset();
    onAdvance();
  };

  const selectedShipment = contractShipments.find((shipment) => shipment.id === selectedShipmentId);
  const selectedSub = contractSubContracts.find((line) => line.id === selectedShipment?.subContractId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Shipment Advice</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={!allShipmentsCompleted}
              onClick={handleDownloadInvoice}
            >
              Download Invoice (PDF)
            </Button>
            <Button onClick={() => setOpenDrawer(true)}>Create Shipment</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTable
          data={tableData}
          searchPlaceholder="Search shipments"
          filters={[
            {
              key: "countryOfOrigin",
              label: "Country",
              options: ["India", "Vietnam"]
            },
            {
              key: "factory",
              label: "Factory",
              options: Array.from(new Set(tableData.map((row) => row.factory)))
            },
            {
              key: "shipmentStatus",
              label: "Status",
              options: ["Draft", "In Progress", "Shipped", "Completed"]
            }
          ]}
          columns={[
            { key: "subContractNumber", header: "Sub-Contract" },
            { key: "containerNumber", header: "Container" },
            { key: "vesselName", header: "Vessel" },
            { key: "estEtaDestination", header: "ETA" },
            {
              key: "qtyShippedKgs",
              header: "Qty Shipped",
              cell: (row) => `${row.qtyShippedKgs} KGS`
            },
            {
              key: "shipmentStatus",
              header: "Status",
              cell: (row) => <StatusBadge status={row.shipmentStatus} />
            },
            {
              key: "action",
              header: "Action",
              cell: (row) => (
                <Button variant="ghost" size="sm" onClick={() => setSelectedShipmentId(row.id)}>
                  View
                </Button>
              )
            }
          ]}
        />

        <DrawerForm open={openDrawer} title="Create Shipment" onOpenChange={setOpenDrawer}>
          <form className="space-y-4" onSubmit={handleSubmit(handleCreateShipment)}>
            <FormField label="Sub-Contract" error={errors.subContractId?.message}>
              <Select
                onValueChange={(value) => setValue("subContractId", value)}
                defaultValue={contractSubContracts[0]?.id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-contract" />
                </SelectTrigger>
                <SelectContent>
                  <SelectViewport>
                    {contractSubContracts.map((line) => (
                      <SelectItem key={line.id} value={line.id}>
                        {line.subContractNumber} · {line.countryOfOrigin}
                      </SelectItem>
                    ))}
                  </SelectViewport>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("subContractId")} />
            </FormField>
            <FormField label="Container Number" error={errors.containerNumber?.message}>
              <Input {...register("containerNumber")} />
            </FormField>
            <FormField label="Liner Seal Number" error={errors.linerSealNumber?.message}>
              <Input {...register("linerSealNumber")} />
            </FormField>
            <FormField label="Factory" error={errors.factory?.message}>
              <Input {...register("factory")} defaultValue={contractSubContracts[0]?.factory ?? ""} />
            </FormField>
            <FormField label="Shipped Date" error={errors.shippedDate?.message}>
              <Input type="date" {...register("shippedDate")} />
            </FormField>
            <FormField label="BL No" error={errors.blNo?.message}>
              <Input {...register("blNo")} />
            </FormField>
            <FormField label="Vessel Name" error={errors.vesselName?.message}>
              <Input {...register("vesselName")} />
            </FormField>
            <FormField label="Voyage Details" error={errors.voyageDetails?.message}>
              <Input {...register("voyageDetails")} />
            </FormField>
            <FormField label="SCAC Code" error={errors.scacCode?.message}>
              <Input {...register("scacCode")} />
            </FormField>
            <FormField label="Booking Number" error={errors.bookingNumber?.message}>
              <Input {...register("bookingNumber")} />
            </FormField>
            <FormField label="Est. ETA Destination" error={errors.estEtaDestination?.message}>
              <Input type="date" {...register("estEtaDestination")} />
            </FormField>
            <FormField label="Qty Shipped (KGS)" error={errors.qtyShippedKgs?.message}>
              <Input type="number" {...register("qtyShippedKgs")} />
            </FormField>
            <FormField label="Updated ISP Portal" error={errors.updatedIspPortal?.message}>
              <Select onValueChange={(value) => setValue("updatedIspPortal", value === "true")} defaultValue="false">
                <SelectTrigger>
                  <SelectValue placeholder="Updated ISP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectViewport>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectViewport>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("updatedIspPortal")} />
            </FormField>
            <FormField label="Comments">
              <Textarea {...register("comments")} />
            </FormField>
            <FormField label="Note">
              <Textarea {...register("note")} />
            </FormField>
            <FormField label="Remark">
              <Textarea {...register("remark")} />
            </FormField>
            <div className="flex justify-end">
              <Button type="submit">Save Shipment</Button>
            </div>
          </form>
        </DrawerForm>

        <DrawerForm
          open={Boolean(selectedShipmentId)}
          title="Shipment Details"
          onOpenChange={(open) => !open && setSelectedShipmentId(null)}
        >
          {selectedShipment ? (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Sub-Contract</p>
                <p className="font-medium">{selectedSub?.subContractNumber ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Container</p>
                <p className="font-medium">{selectedShipment.containerNumber}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vessel</p>
                <p className="font-medium">{selectedShipment.vesselName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Qty Shipped</p>
                <p className="font-medium">{selectedShipment.qtyShippedKgs} KGS</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Updated ISP Portal</p>
                <p className="font-medium">{selectedShipment.updatedIspPortal ? "Yes" : "No"}</p>
              </div>
              <Button
                onClick={() => {
                  markShipmentShipped(selectedShipment.id);
                  pushToast({ title: "Shipment marked as shipped" });
                }}
              >
                Mark Shipped
              </Button>
            </div>
          ) : null}
        </DrawerForm>
      </CardContent>
    </Card>
  );
}
