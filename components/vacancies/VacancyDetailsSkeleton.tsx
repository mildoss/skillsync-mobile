import React from "react";
import { View, ScrollView } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeAreaView } from "react-native-safe-area-context";

export const VacancyDetailsSkeleton = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="mb-2 px-4 py-2">
        <Skeleton className="h-10 w-10 rounded-full" />
      </View>

      <ScrollView className="flex-1">
        <View className="mb-6 border-b border-border px-4 py-4">
          <Skeleton className="mb-4 h-20 w-20 rounded-2xl" />
          <Skeleton className="mb-2 h-8 w-3/4" />
          <Skeleton className="mb-4 h-5 w-1/2" />

          <View className="flex-row gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </View>
        </View>

        <View className="px-4">
          <Skeleton className="mb-4 h-8 w-1/2" />

          <View className="mb-8 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </View>

          <Skeleton className="mb-4 h-8 w-2/3" />
          <View className="mb-4 flex-row gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </View>
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-between border-t border-border p-4">
        <View>
          <Skeleton className="mb-1 h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </View>
        <Skeleton className="h-12 w-32 rounded-lg" />
      </View>
    </SafeAreaView>
  );
};
