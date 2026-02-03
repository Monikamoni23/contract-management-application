import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const masterData = {
  Buyers: ["Nimbus Beverages", "Harbor Roasters", "Summit Coffee"],
  Factories: ["Blue River Plant", "Saigon Export Hub", "Monsoon Processing"],
  Grades: ["Arabica Grade 1", "Arabica Grade 2", "Robusta Premium"],
  "Email Recipients": ["ops@nimbus.com", "logistics@harbor.com"]
};

export default function MasterDataPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Settings" }, { label: "Master Data" }]} />
      <div>
        <h2 className="text-2xl font-semibold">Master Data</h2>
        <p className="text-sm text-muted-foreground">Seeded metadata for demo flows.</p>
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
