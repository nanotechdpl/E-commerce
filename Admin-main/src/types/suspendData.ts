export interface suspendData {
  sl: number;
  userName: string;
  spamPayments: number;
  suspendedHours: string;
  suspendedDay: string;
  status: "All" | "Active" | "Suspended";
  see?: string;
}
