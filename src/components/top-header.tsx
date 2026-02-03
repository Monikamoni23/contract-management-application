import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TopHeader() {
  return (
    <header className="flex items-center justify-between border-b bg-background px-8 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Good morning, Priya</span>
        <span>·</span>
        <span>Phase-1 Pilot</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="w-64 pl-9" placeholder="Search contracts, shipments" />
        </div>
        <button className="rounded-full border p-2 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
