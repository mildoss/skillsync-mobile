import { View, Text, ActivityIndicator } from "react-native";
import { CheckCircle2, Clock, XCircle } from "lucide-react-native";
import { formatDate } from "@/lib/utils";
import { Transaction } from "@/types/transactions";

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export const TransactionHistory = ({ transactions, isLoading }: TransactionHistoryProps) => {
  if (isLoading) {
    return (
      <View className="items-center justify-center rounded-2xl border border-border bg-card py-10">
        <ActivityIndicator size="small" color="#3b82f6" />
        <Text className="mt-2 text-xs text-muted-foreground">Loading transaction history...</Text>
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View className="items-center justify-center rounded-2xl border border-border bg-card/60 py-10 text-center">
        <Clock size={32} color="#9ca3af" className="mb-2 opacity-40" />
        <Text className="font-medium text-muted-foreground">No transactions found yet.</Text>
      </View>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 size={14} color="#16a34a" />;
      case "FAILED":
        return <XCircle size={14} color="#ef4444" />;
      default:
        return <Clock size={14} color="#eab308" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "FAILED":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    }
  };

  return (
    <View className="space-y-3">
      {transactions.map((tx) => (
        <View key={tx.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <View className="mb-3 flex-row items-center justify-between gap-2">
            <Text className="text-xs font-medium text-muted-foreground">
              {formatDate(tx.createdAt)}
            </Text>
            <View
              className={`flex-row items-center gap-1.5 rounded-full px-2.5 py-1 ${getStatusColor(
                tx.status,
              )}`}
            >
              {getStatusIcon(tx.status)}
              <Text
                className={`text-[11px] font-bold ${
                  tx.status === "COMPLETED"
                    ? "text-green-600 dark:text-green-400"
                    : tx.status === "FAILED"
                      ? "text-red-600 dark:text-red-400"
                      : "text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {tx.status}
              </Text>
            </View>
          </View>

          <View className="flex-row items-baseline justify-between">
            <View className="flex-row items-baseline gap-1">
              <Text className="text-2xl font-black text-foreground">
                ${(tx.amountTotal / 100).toFixed(2)}
              </Text>
              <Text className="text-xs font-semibold text-muted-foreground">
                {tx.currency.toUpperCase()}
              </Text>
            </View>

            <View className="flex-row items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1">
              <Text className="text-xs font-bold text-primary">+{tx.creditsAdded} Tokens</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};
