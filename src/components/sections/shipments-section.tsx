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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppData } from "@/context/app-data";
import { Contract } from "@/types";
import { useToast } from "@/components/toast-provider";

const shipmentSchema = z.object({
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
  updatedIspPortal: z.string().min(1, "Updated ISP required"),
  comments: z.string().optional(),
  note: z.string().optional(),
  remark: z.string().optional()
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

export function ShipmentsSection({ contract, onAdvance }: { contract: Contract; onAdvance: () => void }) {
  const { shipments, addShipment, markShipmentShipped } = useAppData();
  const { pushToast } = useToast();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);

  const contractShipments = useMemo(
    () => shipments.filter((shipment) => shipment.contractNumber === contract.contractNumber),
    [shipments, contract.contractNumber]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema)
  });

  const handleCreateShipment = (values: ShipmentFormValues) => {
    addShipment({
      id: `s-${crypto.randomUUID()}`,
      contractNumber: contract.contractNumber,
      status: "Planned",
      ...values
    });
    pushToast({ title: "Shipment created", description: "Shipment advice saved." });
    setOpenDrawer(false);
    reset();
    onAdvance();
  };

  const selectedShipment = contractShipments.find((shipment) => shipment.id === selectedShipmentId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Shipment Advice</CardTitle>
          <Button onClick={() => setOpenDrawer(true)}>Create Shipment</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Container</TableHead>
              <TableHead>Vessel</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead>Qty Shipped</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contractShipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>{shipment.containerNumber}</TableCell>
                <TableCell>{shipment.vesselName}</TableCell>
                <TableCell>{shipment.estEtaDestination}</TableCell>
                <TableCell>{shipment.qtyShippedKgs} KGS</TableCell>
                <TableCell>{shipment.status}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedShipmentId(shipment.id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <DrawerForm open={openDrawer} title="Create Shipment" onOpenChange={setOpenDrawer}>
          <form className="space-y-4" onSubmit={handleSubmit(handleCreateShipment)}>
            <FormField label="Container Number" error={errors.containerNumber?.message}>
              <Input {...register("containerNumber")} />
            </FormField>
            <FormField label="Liner Seal Number" error={errors.linerSealNumber?.message}>
              <Input {...register("linerSealNumber")} />
            </FormField>
            <FormField label="Factory" error={errors.factory?.message}>
              <Input {...register("factory")} defaultValue={contract.factory} />
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
              <Input {...register("updatedIspPortal")} placeholder="Yes / No" />
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
                <p className="font-medium">{selectedShipment.updatedIspPortal}</p>
              </div>
              <Button
                onClick={() => {
                  markShipmentShipped(selectedShipment.id);
                  pushToast({ title: "Shipment marked shipped" });
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
