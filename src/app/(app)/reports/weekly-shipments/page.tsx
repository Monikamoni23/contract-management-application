"use client";

import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CsvDownloadButton } from "@/components/csv-download-button";
import { useAppData } from "@/context/app-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/toast-provider";
import { StatusBadge } from "@/components/status-badge";

export default function WeeklyShipmentsPage() {
  const { shipments, emailLogs, addEmailLog, addWeeklyReports, contracts, subContracts } = useAppData();
  const { pushToast } = useToast();
  const [includeUpdatedOnly, setIncludeUpdatedOnly] = useState(true);

  const filteredShipments = useMemo(() => {
    return includeUpdatedOnly ? shipments.filter((s) => s.updatedIspPortal) : shipments;
  }, [shipments, includeUpdatedOnly]);

  const csvString = useMemo(() => {
    const headers = [
      "Contract Number",
      "Sub-Contract",
      "Country",
      "Factory",
      "Container Number",
      "Liner Seal Number",
      "Shipped Date",
      "BLNo",
      "Vessel Name",
      "Voyage Details",
      "SCAC Code",
      "Booking Number",
      "Est. ETA Destination",
      "Qty Shipped (Kgs)",
      "Updated ISP Portal"
    ];
    const rows = filteredShipments.map((shipment) => {
      const contract = contracts.find((item) => item.id === shipment.masterContractId);
      const subContract = subContracts.find((item) => item.id === shipment.subContractId);
      return [
        contract?.contractNumber ?? "",
        subContract?.subContractNumber ?? shipment.subContractId,
        shipment.countryOfOrigin,
        shipment.factory,
        shipment.containerNumber,
        shipment.linerSealNumber,
        shipment.shippedDate,
        shipment.blNo,
        shipment.vesselName,
        shipment.voyageDetails,
        shipment.scacCode,
        shipment.bookingNumber,
        shipment.estEtaDestination,
        shipment.qtyShippedKgs,
        shipment.updatedIspPortal ? "Yes" : "No"
      ].join(",");
    });
    return [headers.join(","), ...rows].join("\n");
  }, [filteredShipments, contracts, subContracts]);

  const handleGenerated = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    addEmailLog({
      id: `e-${crypto.randomUUID()}`,
      buyer: "Nimbus Beverages",
      fileName: `weekly_shipments_${timestamp}.csv`,
      date: new Date().toLocaleString(),
      status: "Success",
      retryCount: 0
    });
    const reportEntries = Array.from(
      new Set(filteredShipments.map((shipment) => shipment.masterContractId))
    ).map((contractId) => {
      const contract = contracts.find((item) => item.id === contractId);
      return {
        id: `wr-${crypto.randomUUID()}`,
        contractId,
        contractNumber: contract?.contractNumber ?? "",
        fileName: `weekly_shipments_${timestamp}.csv`,
        runDate: new Date().toLocaleString(),
        status: "Success" as const
      };
    });
    addWeeklyReports(reportEntries);
    pushToast({ title: "CSV generated", description: "Email log updated." });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Reports" }, { label: "Weekly Shipments" }]} />
      <div>
        <h2 className="text-2xl font-semibold">Weekly Shipment CSV & Email Log</h2>
        <p className="text-sm text-muted-foreground">Configure weekly file delivery and review email logs.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report configuration</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Schedule day/time</p>
            <Input defaultValue="Friday 09:00" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Timezone</p>
            <Input defaultValue="GMT+5:30" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Buyer recipients</p>
            <Input defaultValue="ops@nimbus.com, logistics@nimbus.com" />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={includeUpdatedOnly} onCheckedChange={setIncludeUpdatedOnly} />
            <div>
              <p className="text-sm font-medium">Include updated shipments only</p>
              <p className="text-xs text-muted-foreground">Filtered by ISP portal updates</p>
            </div>
          </div>
          <div className="md:col-span-2 flex items-end justify-end">
            <CsvDownloadButton csvString={csvString} fileName="weekly_shipments.csv" onGenerated={handleGenerated} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Retry Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emailLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.buyer}</TableCell>
                  <TableCell>{log.fileName}</TableCell>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>
                    <StatusBadge status={log.status} />
                  </TableCell>
                  <TableCell>{log.retryCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
