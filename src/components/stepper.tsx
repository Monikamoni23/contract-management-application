import { cn } from "@/lib/utils";

const steps = ["Create Contract", "Allocate", "Add Shipments", "Reconcile"];

export function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex flex-wrap gap-4">
      {steps.map((step, index) => {
        const state = index <= currentStep ? "active" : "inactive";
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                state === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            <span className={cn("text-sm", state === "active" ? "text-foreground" : "text-muted-foreground")}>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
