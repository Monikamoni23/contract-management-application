"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FileUploadMock({ onUpload }: { onUpload: (fileName: string) => void }) {
  const [fileName, setFileName] = useState("");

  return (
    <div className="rounded-lg border border-dashed p-6 text-center">
      <p className="text-sm font-medium">Upload buyer file (mock)</p>
      <p className="text-xs text-muted-foreground">Drag & drop or select a CSV file</p>
      <div className="mt-4 flex flex-col items-center gap-3">
        <input
          type="text"
          className="h-10 w-full max-w-xs rounded-md border px-3 text-sm"
          placeholder="buyer_recon_week12.csv"
          value={fileName}
          onChange={(event) => setFileName(event.target.value)}
        />
        <Button onClick={() => onUpload(fileName || "buyer_recon_week12.csv")}>Mock Upload</Button>
      </div>
    </div>
  );
}
