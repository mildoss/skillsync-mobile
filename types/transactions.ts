export type Transaction = {
  id: string;
  amountTotal: number;
  currency: string;
  creditsAdded: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
}