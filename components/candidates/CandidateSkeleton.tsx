import React from "react";
import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

export const CandidateSkeleton = () => {
  return (
    <View className="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      <View className="mb-4 flex-row items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <View className="flex-1 justify-center py-1">
          <Skeleton className="mb-2 h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </View>
      </View>

      <View className="mb-4 flex-row flex-wrap gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </View>

      <View className="mb-4 flex-row flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </View>

      <View className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </View>
    </View>
  );
};
