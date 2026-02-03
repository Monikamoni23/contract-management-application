import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormField({ label, htmlFor, error, helperText, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      {helperText && !error ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
    </div>
  );
}
