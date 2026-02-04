import { EmailLogEntry } from "@/types";

export const emailLogs: EmailLogEntry[] = [
  {
    id: "email-001",
    buyer: "Nimbus Beverages",
    fileName: "weekly_shipments_2024-07-12.csv",
    date: "2024-07-12 09:05",
    status: "Success",
    retryCount: 0
  },
  {
    id: "email-002",
    buyer: "Harbor Roasters",
    fileName: "weekly_shipments_2024-07-05.csv",
    date: "2024-07-05 09:01",
    status: "Success",
    retryCount: 0
  }
];
