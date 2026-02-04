"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/form-field";
import { Stepper } from "@/components/stepper";
import { useAppData } from "@/context/app-data";
import { useToast } from "@/components/toast-provider";
import { grades } from "@/mock/pricing";

const contractSchema = z.object({
  contractNumber: z.string().min(3, "Contract number is required"),
  rcnContractNumber: z.string().min(3, "RCN contract number is required"),
  dateSigningContract: z.string().min(1, "Signing date is required"),
  year: z.string().min(4, "Year is required"),
  gradeId: z.string().min(1, "Grade is required"),
  shipmentPeriod: z.string().min(1, "Shipment period is required"),
  incoterms: z.string().min(1, "Incoterms are required"),
  totalContractQuantityKgs: z.coerce
    .number()
    .min(1, "Total quantity is required"),
  openBookQty: z.coerce.number().min(0, "OPEN BOOK qty is required"),
  openBookValue: z.coerce.number().min(0, "OPEN BOOK value is required"),
  notes: z.string().optional(),
});

type ContractFormValues = z.infer<typeof contractSchema>;

export default function ContractCreatePage() {
  const router = useRouter();
  const { addContract } = useAppData();
  const { pushToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      year: "2026",
      gradeId: grades[0]?.id,
      incoterms: "FOB",
      openBookQty: 0,
      openBookValue: 0,
    },
  });

  const onSubmit = (values: ContractFormValues) => {
    const grade =
      grades.find((item) => item.id === values.gradeId) ?? grades[0];
    const id = `mc-${crypto.randomUUID()}`;
    addContract({
      id,
      contractNumber: values.contractNumber,
      rcnContractNumber: values.rcnContractNumber,
      dateSigningContract: values.dateSigningContract,
      year: values.year,
      gradeId: values.gradeId,
      gradeName: grade?.name ?? values.gradeId,
      status: "Draft",
      shipmentPeriod: values.shipmentPeriod,
      incoterms: values.incoterms,
      totalContractQuantityKgs: values.totalContractQuantityKgs,
      totalContractValue: 0,
      shippedQuantityKgs: 0,
      openQty: values.totalContractQuantityKgs,
      openValue: 0,
      openBookQty: values.openBookQty,
      openBookValue: values.openBookValue,
      allocationSummary: "India: 0 | Vietnam: 0",
    });
    pushToast({
      title: "Contract created",
      description: "Master contract added successfully.",
    });
    router.push(`/contracts/${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Create Master Contract</h2>
        <p className="text-sm text-muted-foreground">
          Capture master contract details for Phase-1.
        </p>
      </div>
      <Stepper currentStep={0} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Master Contract</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              label="Contract Number"
              error={errors.contractNumber?.message}
            >
              <Input
                {...register("contractNumber")}
                placeholder="MC-2024-013"
              />
            </FormField>
            <FormField
              label="RCN Contract Number"
              error={errors.rcnContractNumber?.message}
            >
              <Input
                {...register("rcnContractNumber")}
                placeholder="RCN-7793"
              />
            </FormField>
            <FormField
              label="Date signing contract"
              error={errors.dateSigningContract?.message}
            >
              <Input type="date" {...register("dateSigningContract")} />
            </FormField>
            <FormField label="Year" error={errors.year?.message}>
              <Input {...register("year")} placeholder="2024" />
            </FormField>
            <FormField label="Grade" error={errors.gradeId?.message}>
              <Select
                defaultValue={grades[0]?.id}
                onValueChange={(value) => setValue("gradeId", value)}
              >
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
              <input type="hidden" {...register("gradeId")} />
            </FormField>
            <FormField
              label="Shipment Period as per Contract"
              error={errors.shipmentPeriod?.message}
            >
              <Input
                {...register("shipmentPeriod")}
                placeholder="Jul-Sep 2024"
              />
            </FormField>
            <FormField label="Incoterms" error={errors.incoterms?.message}>
              <Select
                defaultValue="FOB"
                onValueChange={(value) => setValue("incoterms", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select incoterms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectViewport>
                    {"FOB,CIF,CFR".split(",").map((term) => (
                      <SelectItem key={term} value={term}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectViewport>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("incoterms")} />
            </FormField>
            <FormField
              label="Total Contract Quantity (KGS)"
              error={errors.totalContractQuantityKgs?.message}
            >
              <Input type="number" {...register("totalContractQuantityKgs")} />
            </FormField>
            <FormField
              label="OPEN BOOK Qty"
              error={errors.openBookQty?.message}
            >
              <Input type="number" {...register("openBookQty")} />
            </FormField>
            <FormField
              label="OPEN BOOK Value"
              error={errors.openBookValue?.message}
            >
              <Input type="number" step="0.01" {...register("openBookValue")} />
            </FormField>
            <FormField label="Notes" className="md:col-span-2">
              <Textarea
                {...register("notes")}
                placeholder="Optional notes for logistics"
              />
            </FormField>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit">Create Contract</Button>
        </div>
      </form>
    </div>
  );
}
