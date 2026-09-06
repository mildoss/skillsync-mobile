import React from "react";
import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

export const VacancySkeleton = () => {
  return (
    <View className="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      <View className="mb-4 flex-row justify-between">
        <View className="flex-1 flex-row gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <View className="flex-1 justify-center">
            <Skeleton className="mb-2 h-5 w-3/4" />
            <View className="flex-row items-center">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="ml-2 h-3 w-16" />
            </View>
          </View>
        </View>

        <View className="items-end pl-2">
          <Skeleton className="h-5 w-20" />
        </View>
      </View>

      <View className="mb-4 flex-row flex-wrap gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </View>

      <View className="mb-4 flex-row flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </View>

      <View className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </View>
    </View>
  );
};
