import { Badge } from "@/components/ui/badge";

type Status =
  | "Open"
  | "Closed"
  | "Matched"
  | "Mismatch"
  | "Resolved"
  | "Draft"
  | "Success"
  | "Failed"
  | "In Progress"
  | "Shipped"
  | "Completed";

const statusMap: Record<Status, { variant: "default" | "success" | "warning" | "destructive"; label: string }> = {
  Open: { variant: "warning", label: "Open" },
  Closed: { variant: "success", label: "Closed" },
  Matched: { variant: "success", label: "Matched" },
  Mismatch: { variant: "destructive", label: "Mismatch" },
  Resolved: { variant: "success", label: "Resolved" },
  Draft: { variant: "default", label: "Draft" },
  Success: { variant: "success", label: "Success" },
  Failed: { variant: "destructive", label: "Failed" },
  "In Progress": { variant: "warning", label: "In Progress" },
  Shipped: { variant: "success", label: "Shipped" },
  Completed: { variant: "success", label: "Completed" }
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusMap[status] ?? statusMap.Open;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
