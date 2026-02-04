import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MasterContract } from "@/types";

const mockActivity = [
  "Master contract created",
  "Sub-contract allocation confirmed",
  "Shipment advice added",
  "Weekly CSV delivered",
  "Reconciliation updated"
];

export function ActivityLog({ contract }: { contract: MasterContract }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {mockActivity.map((activity) => (
          <div key={activity} className="flex items-center justify-between">
            <span>{activity}</span>
            <span className="text-xs text-muted-foreground">{contract.dateSigningContract}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
