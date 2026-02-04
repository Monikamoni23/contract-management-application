import Link from "next/link";
import {
  ClipboardList,
  FileSpreadsheet,
  LayoutGrid,
  Settings,
  Ship,
  Sliders,
  Tag,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/contracts", label: "Contracts", icon: ClipboardList },
  {
    href: "/reports/weekly-shipments",
    label: "Weekly CSV Log",
    icon: FileSpreadsheet,
  },
  { href: "/reconciliation", label: "Reconciliation", icon: Ship },
  { href: "/settings/master-data", label: "Master Data", icon: Sliders },
  { href: "/settings/pricing", label: "Pricing", icon: Tag },
];

export function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="flex  w-64 flex-col border-r bg-background p-6">
      {/* <div className="mb-8">
        <p className="text-xs text-muted-foreground">Phase-1 Prototype</p>
        <h1 className="text-xl font-semibold">ContractFlow</h1>
      </div> */}

      <div className="flex items-center gap-2 text-lg font-semibold">
        <Warehouse className="h-5 w-5 text-primary" />
        ContractOS
      </div>
      <nav className="space-y-2 mt-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted",
                isActive && "bg-muted text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      {/* <div className="mt-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground">
        Demo ready · UI-only
      </div> */}
    </aside>
  );
}
