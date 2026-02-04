import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MasterContract } from "@/types";

export function ContractOverview({ contract }: { contract: MasterContract }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Total Contract Quantity</p>
          <p className="text-lg font-semibold">{contract.totalContractQuantityKgs.toLocaleString()} KGS</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Open Qty</p>
          <p className="text-lg font-semibold">{contract.openQty.toLocaleString()} KGS</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Open Value</p>
          <p className="text-lg font-semibold">${contract.openValue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Incoterms</p>
          <p className="text-sm font-medium">{contract.incoterms}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Shipment Period</p>
          <p className="text-sm font-medium">{contract.shipmentPeriod}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Allocation Summary</p>
          <p className="text-sm font-medium">{contract.allocationSummary}</p>
        </div>
      </CardContent>
    </Card>
  );
}
