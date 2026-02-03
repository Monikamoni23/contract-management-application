import { Badge } from "@/components/ui/badge";

type Status = "Open" | "Closed" | "Matched" | "Mismatch" | "Resolved" | "Draft" | "In Progress";

const statusMap: Record<Status, { variant: "default" | "success" | "warning" | "destructive"; label: string }> = {
  Open: { variant: "warning", label: "Open" },
  Closed: { variant: "success", label: "Closed" },
  Matched: { variant: "success", label: "Matched" },
  Mismatch: { variant: "destructive", label: "Mismatch" },
  Resolved: { variant: "success", label: "Resolved" },
  Draft: { variant: "default", label: "Draft" },
  "In Progress": { variant: "warning", label: "In Progress" }
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusMap[status] ?? statusMap.Open;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
