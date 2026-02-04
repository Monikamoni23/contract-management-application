import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const masterData = {
  Buyers: ["Nimbus Beverages", "Harbor Roasters", "Summit Coffee"],
  Factories: ["Blue River Plant", "Saigon Export Hub", "Monsoon Processing"],
  Grades: ["Arabica Grade 1", "Arabica Grade 2", "Robusta Premium", "Robusta Standard"],
  Countries: ["India", "Vietnam"],
  "Email Recipients": ["ops@nimbus.com", "logistics@harbor.com"]
};

export default function MasterDataPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Settings" }, { label: "Master Data" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Master Data</h2>
          <p className="text-sm text-muted-foreground">Seeded metadata for demo flows.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/settings/pricing">Manage Pricing</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(masterData).map(([title, items]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item} className="rounded-md bg-muted px-3 py-2">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
