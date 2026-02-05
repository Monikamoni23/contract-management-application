import { SubContract } from "@/types";
import { masterContracts } from "@/mock/contracts";
import { pricingMaster } from "@/mock/pricing";

const getPrice = (gradeId: string, countryId: "India" | "Vietnam", contractDate: string) => {
  const contractTimestamp = new Date(contractDate).getTime();
  const matches = pricingMaster
    .filter((price) => price.gradeId === gradeId && price.countryId === countryId)
    .filter((price) => new Date(price.effectiveFrom).getTime() <= contractTimestamp)
    .sort((a, b) => new Date(b.effectiveFrom).getTime() - new Date(a.effectiveFrom).getTime());
  return matches[0]?.contractPriceUsdKgs ?? 3.5;
};

export const subContracts: SubContract[] = masterContracts.flatMap((contract) => {
  const indiaQty = 0;
  const vietnamQty = 0;
  const indiaPrice = getPrice(contract.gradeId, "India", contract.dateSigningContract);
  const vietnamPrice = getPrice(contract.gradeId, "Vietnam", contract.dateSigningContract);
  return [
    {
      id: `${contract.id}-ind`,
      masterContractId: contract.id,
      subContractNumber: "N/A",
      gradeId: contract.gradeId,
      gradeName: contract.gradeName,
      countryOfOrigin: "India",
      factory: "N/A",
      allocatedQtyKgs: indiaQty,
      contractPriceUsdKgs: indiaPrice,
      subContractValue: Number((indiaQty * indiaPrice).toFixed(2)),
      status: "Open",
      isAllocationConfirmed: contract.status !== "Draft"
    },
    {
      id: `${contract.id}-vnm`,
      masterContractId: contract.id,
      subContractNumber: "N/A",
      gradeId: contract.gradeId,
      gradeName: contract.gradeName,
      countryOfOrigin: "Vietnam",
      factory: "N/A",
      allocatedQtyKgs: vietnamQty,
      contractPriceUsdKgs: vietnamPrice,
      subContractValue: Number((vietnamQty * vietnamPrice).toFixed(2)),
      status: "Open",
      isAllocationConfirmed: contract.status !== "Draft"
    }
  ];
});
