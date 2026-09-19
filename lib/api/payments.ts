import { API_URL, fetchJson } from "@/lib/utils";
import { Transaction } from "@/types/transactions";

export const createCheckoutSession = async (packageId: string) =>
  fetchJson<{ checkoutUrl: string }>(`${API_URL}/payments/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packageId }),
  });

export const getMyTransactions = async () =>
  fetchJson<Transaction[]>(`${API_URL}/payments/history`);
