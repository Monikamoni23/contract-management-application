"use client";

import { Sidebar } from "@/components/sidebar";
import { TopHeader } from "@/components/top-header";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar currentPath={pathname} />
      <div className="flex flex-1 flex-col">
        <TopHeader />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
