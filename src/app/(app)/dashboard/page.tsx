"use client";

import Link from "next/link";
import { KpiCard } from "@/components/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/context/app-data";
import { StatusBadge } from "@/components/status-badge";

export default function DashboardPage() {
  const { contracts, shipments, reconciliations } = useAppData();
  const totalContracts = contracts.length;
  const openQty = contracts.reduce((sum, contract) => sum + contract.openQty, 0);
  const openValue = contracts.reduce((sum, contract) => sum + contract.openValue, 0);
  const shipmentsThisWeek = shipments.slice(0, 7).length;
  const variances = reconciliations.filter((record) => record.status === "Mismatch").length;

  const recentActivity = [
    { label: "Master contract created", time: "Today 09:12" },
    { label: "Sub-contract allocation confirmed", time: "Today 09:45" },
    { label: "Shipment marked shipped", time: "Yesterday 16:18" },
    { label: "Weekly CSV delivered", time: "Friday 09:05" }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Phase-1 snapshot of contracts and shipments.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/contracts/new">Create Contract</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/reports/weekly-shipments">Weekly Report Log</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard title="Total Master Contracts" value={String(totalContracts)} subtext="Active in Phase-1" />
        <KpiCard title="Open Qty" value={`${openQty.toLocaleString()} KGS`} subtext="Pending shipments" />
        <KpiCard title="Open Value" value={`$${openValue.toLocaleString()}`} subtext="USD" />
        <KpiCard title="Shipments This Week" value={String(shipmentsThisWeek)} subtext="Across all buyers" />
        <KpiCard title="Open Variances" value={String(variances)} subtext="Need reconciliation" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="secondary" asChild>
              <Link href="/contracts/new">Create Contract</Link>
            </Button>
            <Button className="w-full justify-start" variant="secondary" asChild>
              <Link href="/reports/weekly-shipments">Weekly Shipment CSV</Link>
            </Button>
            <Button className="w-full justify-start" variant="secondary" asChild>
              <Link href="/reconciliation">Contract Reconciliation</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.label} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{activity.label}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <StatusBadge status="In Progress" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent shipments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {shipments.slice(0, 5).map((shipment) => {
            const contract = contracts.find((item) => item.id === shipment.masterContractId);
            return (
              <div key={shipment.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{contract?.contractNumber ?? "-"}</p>
                  <p className="text-xs text-muted-foreground">{shipment.containerNumber}</p>
                </div>
                <span className="text-xs text-muted-foreground">{shipment.qtyShippedKgs} KGS</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
