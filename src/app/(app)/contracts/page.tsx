"use client";

import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppData } from "@/context/app-data";
import { MoreHorizontal } from "lucide-react";

export default function ContractsPage() {
  const { contracts } = useAppData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Contracts</h2>
          <p className="text-sm text-muted-foreground">
            Manage master contracts and shipment allocations.
          </p>
        </div>
        <Button asChild>
          <Link href="/contracts/new">Create Master Contract</Link>
        </Button>
      </div>

      <DataTable
        data={contracts}
        searchPlaceholder="Search contracts"
        filters={[
          { key: "year", label: "Year", options: ["2026"] },
          {
            key: "status",
            label: "Status",
            options: ["Open", "Closed", "Draft"],
          },
          {
            key: "gradeName",
            label: "Grade",
            options: [
              "Arabica Grade 1",
              "Arabica Grade 2",
              "Robusta Premium",
              "Robusta Standard",
              "Espresso Blend",
            ],
          },
        ]}
        columns={[
          { key: "contractNumber", header: "Contract No" },
          { key: "rcnContractNumber", header: "RCN Contract No" },
          { key: "gradeName", header: "Grade" },
          { key: "shipmentPeriod", header: "Shipment Period" },
          {
            key: "openQty",
            header: "Open Qty",
            cell: (row) => `${row.openQty.toLocaleString()} KGS`,
          },
          {
            key: "status",
            header: "Status",
            cell: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "actions",
            header: "Actions",
            cell: (row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/contracts/${row.id}`}>View</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit (mock)</DropdownMenuItem>
                  <DropdownMenuItem>Export (mock)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          },
        ]}
      />
    </div>
  );
}
