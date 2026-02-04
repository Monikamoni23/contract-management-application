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
          <Button onClick={() => setOpenDrawer(true)}>Create Shipment</Button>
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
