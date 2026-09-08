import React from "react";
import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

export const CompanySkeleton = () => {
  return (
    <View className="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      <View className="mb-4 flex-row items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <View className="flex-1">
          <Skeleton className="mb-2 h-6 w-3/4" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </View>
      </View>

      <View className="mb-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </View>

      <View className="flex-row items-center gap-4 border-t border-border pt-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
      </View>
    </View>
  );
};
