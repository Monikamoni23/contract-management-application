import { SubContract } from "@/types";
import { masterContracts } from "@/mock/contracts";
import { pricingMaster } from "@/mock/pricing";

const getPrice = (gradeId: string, countryId: "India" | "Vietnam") =>
  pricingMaster.find((price) => price.gradeId === gradeId && price.countryId === countryId)?.contractPriceUsdKgs ?? 3.5;

export const subContracts: SubContract[] = masterContracts.flatMap((contract) => {
  const indiaQty = Math.round(contract.totalContractQuantityKgs * 0.55);
  const vietnamQty = contract.totalContractQuantityKgs - indiaQty;
  const indiaPrice = getPrice(contract.gradeId, "India");
  const vietnamPrice = getPrice(contract.gradeId, "Vietnam");
  return [
    {
      id: `${contract.id}-ind`,
      masterContractId: contract.id,
      subContractNumber: `${contract.contractNumber}-IND`,
      countryOfOrigin: "India",
      factory: "Blue River Plant",
      allocatedQtyKgs: indiaQty,
      contractPriceUsdKgs: indiaPrice,
      subContractValue: Number((indiaQty * indiaPrice).toFixed(2)),
      status: "Open",
      isAllocationConfirmed: contract.status !== "Draft"
    },
    {
      id: `${contract.id}-vnm`,
      masterContractId: contract.id,
      subContractNumber: `${contract.contractNumber}-VNM`,
      countryOfOrigin: "Vietnam",
      factory: "Saigon Export Hub",
      allocatedQtyKgs: vietnamQty,
      contractPriceUsdKgs: vietnamPrice,
      subContractValue: Number((vietnamQty * vietnamPrice).toFixed(2)),
      status: "Open",
      isAllocationConfirmed: contract.status !== "Draft"
    }
  ];
});
