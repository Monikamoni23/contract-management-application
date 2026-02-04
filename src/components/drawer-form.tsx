import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function DrawerForm({
  open,
  title,
  onOpenChange,
  children,
}: {
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="
          w-full max-w-xl
          overflow-hidden
          flex flex-col
        "
      >
        {/* Fixed header */}
        <SheetHeader className="border-b pb-4">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto mt-4 pr-2">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
