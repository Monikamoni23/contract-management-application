import type { Metadata } from "next";
import "./globals.css";
import { AppDataProvider } from "@/context/app-data";
import { AppToastProvider } from "@/components/toast-provider";

export const metadata: Metadata = {
  title: "ContractFlow Phase-1",
  description: "Contract management UI prototype"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppToastProvider>
          <AppDataProvider>{children}</AppDataProvider>
        </AppToastProvider>
      </body>
    </html>
  );
}
