import React from "react";
import { View, ScrollView } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeAreaView } from "react-native-safe-area-context";

export const CompanyDetailsSkeleton = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="mb-2 px-4 py-2">
        <Skeleton className="h-10 w-10 rounded-full" />
      </View>

      <ScrollView className="flex-1">
        <View className="items-center border-b border-border px-4 py-6">
          <Skeleton className="mb-4 h-20 w-20 rounded-full" />
          <Skeleton className="mb-2 h-8 w-2/3" />
          <Skeleton className="mb-4 h-6 w-1/3" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </View>

        <View className="px-4 py-6">
          <Skeleton className="mb-4 h-8 w-1/2" />
          <View className="mb-8 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </View>

          <Skeleton className="mb-4 h-8 w-2/3" />
          <View className="space-y-4">
            <View className="rounded-lg border border-border bg-card p-4">
              <Skeleton className="h-16 w-full" />
            </View>
            <View className="rounded-lg border border-border bg-card p-4">
              <Skeleton className="h-16 w-full" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
