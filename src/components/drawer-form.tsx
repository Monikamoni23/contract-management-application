import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function DrawerForm({
  open,
  title,
  onOpenChange,
  children
}: {
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
