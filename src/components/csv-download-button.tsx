"use client";

import { Button } from "@/components/ui/button";

export function CsvDownloadButton({
  csvString,
  fileName,
  onGenerated,
}: {
  csvString: string;
  fileName: string;
  onGenerated?: () => void;
}) {
  const handleDownload = () => {
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    onGenerated?.();
  };

  return (
    <Button variant={"outline"} onClick={handleDownload}>
      Generate CSV Now
    </Button>
  );
}
