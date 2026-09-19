import { useQuery } from "@tanstack/react-query";
import { getMyTransactions } from "@/lib/api";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getMyTransactions,
  });
}
