import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contract } from "@/types";

const mockActivity = [
  "Contract created",
  "Allocation updated",
  "Shipment advice added",
  "Weekly CSV sent",
  "Reconciliation updated"
];

export function ActivityLog({ contract }: { contract: Contract }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {mockActivity.map((activity, index) => (
          <div key={activity} className="flex items-center justify-between">
            <span>{activity}</span>
            <span className="text-xs text-muted-foreground">{contract.dateSigningContract}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
