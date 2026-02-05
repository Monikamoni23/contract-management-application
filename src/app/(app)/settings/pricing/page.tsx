"use client";

import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import { useAppData } from "@/context/app-data";
import { DrawerForm } from "@/components/drawer-form";
import { FormField } from "@/components/form-field";
import { useToast } from "@/components/toast-provider";
import { grades } from "@/mock/pricing";

export default function PricingMasterPage() {
  const { pricing } = useAppData();
  const { pushToast } = useToast();
  const [open, setOpen] = useState(false);

  const gradeNameById = useMemo(
    () => new Map(grades.map((grade) => [grade.id, grade.name])),
    [],
  );

  const tableData = useMemo(
    () =>
      pricing.map((row) => ({
        ...row,
        gradeName: gradeNameById.get(row.gradeId) ?? row.gradeId,
      })),
    [pricing, gradeNameById],
  );

  const gradeOptions = useMemo(
    () => Array.from(new Set(tableData.map((row) => row.gradeName))),
    [tableData],
  );
  const countryOptions = useMemo(
    () => Array.from(new Set(tableData.map((row) => row.countryId))),
    [tableData],
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Settings" }, { label: "Pricing" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Grade × Country Pricing</h2>
          <p className="text-sm text-muted-foreground">
            Manage pricing master used for auto allocation.
          </p>
        </div>
        <Button variant={"outline"} onClick={() => setOpen(true)}>
          Add Pricing
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Master</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={tableData}
            searchPlaceholder="Search pricing"
            filters={[
              { key: "gradeName", label: "Grade", options: gradeOptions },
              { key: "countryId", label: "Country", options: countryOptions },
            ]}
            columns={[
              { key: "gradeName", header: "Grade" },
              { key: "countryId", header: "Country" },
              {
                key: "contractPriceUsdKgs",
                header: "USD / KGS",
                cell: (row) => `$${row.contractPriceUsdKgs}`,
              },
              {
                key: "effectiveFrom",
                header: "Effective From",
              },
              {
                key: "isActive",
                header: "Status",
                cell: (row) => (row.isActive ? "Active" : "Inactive"),
              },
            ]}
          />
        </CardContent>
      </Card>

      <DrawerForm open={open} title="Add Pricing" onOpenChange={setOpen}>
        <div className="space-y-4">
          <FormField label="Grade">
            <Select defaultValue={grades[0]?.id}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectViewport>
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectViewport>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Country">
            <Select defaultValue={countryOptions[0]}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectViewport>
                  {countryOptions.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectViewport>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Price USD (KGS)">
            <Input type="number" step="0.01" defaultValue="3.75" />
          </FormField>
          <FormField label="Effective From">
            <Input type="date" />
          </FormField>
          <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
            Only one active row per grade + country. Existing active rows will
            be deactivated in Phase-2.
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                pushToast({
                  title: "Pricing saved",
                  description: "Mock pricing row created.",
                });
                setOpen(false);
              }}
            >
              Save Pricing
            </Button>
          </div>
        </div>
      </DrawerForm>
    </div>
  );
}
