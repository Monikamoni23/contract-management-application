"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectViewport } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/form-field";
import { Stepper } from "@/components/stepper";
import { useAppData } from "@/context/app-data";
import { useToast } from "@/components/toast-provider";

const contractSchema = z.object({
  contractNumber: z.string().min(3, "Contract number is required"),
  rcnContractNumber: z.string().min(3, "RCN contract number is required"),
  dateSigningContract: z.string().min(1, "Signing date is required"),
  year: z.string().min(4, "Year is required"),
  grade: z.string().min(1, "Grade is required"),
  shipmentPeriod: z.string().min(1, "Shipment period is required"),
  incoterms: z.string().min(1, "Incoterms are required"),
  totalContractQuantityKgs: z.coerce.number().min(1, "Total quantity is required"),
  contractPriceUsdKgs: z.coerce.number().min(1, "Contract price is required"),
  countryOfOrigin: z.string().min(1, "Country is required"),
  factory: z.string().min(1, "Factory is required"),
  notes: z.string().optional()
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
    setValue
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      year: "2024",
      grade: "Arabica Grade 1",
      incoterms: "FOB",
      countryOfOrigin: "India"
    }
  });

  const onSubmit = (values: ContractFormValues) => {
    const totalValue = values.totalContractQuantityKgs * values.contractPriceUsdKgs;
    const id = `c-${crypto.randomUUID()}`;
    addContract({
      id,
      contractNumber: values.contractNumber,
      rcnContractNumber: values.rcnContractNumber,
      dateSigningContract: values.dateSigningContract,
      year: values.year,
      grade: values.grade,
      status: "Draft",
      shipmentPeriod: values.shipmentPeriod,
      incoterms: values.incoterms,
      contractPriceUsdMt: values.contractPriceUsdKgs * 1000,
      contractPriceUsdLbs: Number((values.contractPriceUsdKgs / 2.205).toFixed(2)),
      contractPriceUsdKgs: values.contractPriceUsdKgs,
      totalContractQuantityKgs: values.totalContractQuantityKgs,
      totalContractValue: totalValue,
      shippedQuantityKgs: 0,
      openQty: values.totalContractQuantityKgs,
      openValue: totalValue,
      openBookQty: values.totalContractQuantityKgs / 2,
      openBookValue: totalValue / 2,
      countryOfOrigin: values.countryOfOrigin,
      factory: values.factory,
      allocationSummary: "Pending allocation"
    });
    pushToast({
      title: "Contract created",
      description: "Master contract added successfully."
    });
    router.push(`/contracts/${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Create Contract</h2>
        <p className="text-sm text-muted-foreground">Capture master contract details for Phase-1.</p>
      </div>
      <Stepper currentStep={0} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Master Contract</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField label="Contract Number" error={errors.contractNumber?.message}>
              <Input {...register("contractNumber")} placeholder="CT-2024-013" />
            </FormField>
            <FormField label="RCN Contract Number" error={errors.rcnContractNumber?.message}>
              <Input {...register("rcnContractNumber")} placeholder="RCN-7793" />
            </FormField>
            <FormField label="Date signing contract" error={errors.dateSigningContract?.message}>
              <Input type="date" {...register("dateSigningContract")} />
            </FormField>
            <FormField label="Year" error={errors.year?.message}>
              <Input {...register("year")} placeholder="2024" />
            </FormField>
            <FormField label="Grade" error={errors.grade?.message}>
              <Select defaultValue="Arabica Grade 1" onValueChange={(value) => setValue("grade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectViewport>
                    {[
                      "Arabica Grade 1",
                      "Arabica Grade 2",
                      "Robusta Premium",
                      "Robusta Standard"
                    ].map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectViewport>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("grade")} />
            </FormField>
            <FormField label="Shipment Period as per Contract" error={errors.shipmentPeriod?.message}>
              <Input {...register("shipmentPeriod")} placeholder="Jul-Sep 2024" />
            </FormField>
            <FormField label="Incoterms" error={errors.incoterms?.message}>
              <Select defaultValue="FOB" onValueChange={(value) => setValue("incoterms", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select incoterms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectViewport>
                    {["FOB", "CIF", "CFR"].map((term) => (
                      <SelectItem key={term} value={term}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectViewport>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("incoterms")} />
            </FormField>
            <FormField label="Contract Price USD (KGS)" error={errors.contractPriceUsdKgs?.message}>
              <Input type="number" step="0.01" {...register("contractPriceUsdKgs")} />
            </FormField>
            <FormField label="Total Contract Quantity (KGS)" error={errors.totalContractQuantityKgs?.message}>
              <Input type="number" {...register("totalContractQuantityKgs")} />
            </FormField>
            <FormField label="Country of Origin" error={errors.countryOfOrigin?.message}>
              <Select defaultValue="India" onValueChange={(value) => setValue("countryOfOrigin", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectViewport>
                    {["India", "Vietnam"].map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectViewport>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("countryOfOrigin")} />
            </FormField>
            <FormField label="Factory" error={errors.factory?.message}>
              <Input {...register("factory")} placeholder="Factory name" />
            </FormField>
            <FormField label="Notes" className="md:col-span-2">
              <Textarea {...register("notes")} placeholder="Optional notes for logistics" />
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
