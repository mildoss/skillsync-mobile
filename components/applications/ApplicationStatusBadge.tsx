import { View, Text } from "react-native";
import { ApplicationStatus } from "@/types/application";
import { Clock, Eye, CheckCircle2, XCircle } from "lucide-react-native";

export const ApplicationStatusBadge = ({ status }: { status: ApplicationStatus }) => {
  switch (status) {
    case "PENDING":
      return (
        <View className="flex-row items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1">
          <Clock size={12} color="#f59e0b" />
          <Text className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            Pending
          </Text>
        </View>
      );
    case "REVIEWING":
      return (
        <View className="flex-row items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1">
          <Eye size={12} color="#3b82f6" />
          <Text className="text-xs font-semibold text-primary">
            Reviewed
          </Text>
        </View>
      );
    case "INVITED":
      return (
        <View className="flex-row items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1">
          <CheckCircle2 size={12} color="#22c55e" />
          <Text className="text-xs font-semibold text-green-600 dark:text-green-400">
            Invited
          </Text>
        </View>
      );
    case "REJECTED":
      return (
        <View className="flex-row items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1">
          <XCircle size={12} color="#ef4444" />
          <Text className="text-xs font-semibold text-destructive">
            Rejected
          </Text>
        </View>
      );
    default:
      return null;
  }
};
