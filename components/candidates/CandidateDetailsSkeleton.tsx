import React from "react";
import { View, ScrollView } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeAreaView } from "react-native-safe-area-context";

export const CandidateDetailsSkeleton = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="px-4 py-2 mb-2">
        <Skeleton className="h-10 w-10 rounded-full" />
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="items-center mb-6 border-b border-border pb-6">
          <Skeleton className="h-24 w-24 rounded-full mb-4" />
          <Skeleton className="h-8 w-2/3 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-4" />
          
          <View className="flex-row gap-2 mt-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </View>
        </View>

        <View className="mb-6 bg-card rounded-xl border border-border p-5 shadow-sm">
          <Skeleton className="h-6 w-40 mb-4" />
          <View className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </View>
        </View>

        <View className="mb-6 bg-card rounded-xl border border-border p-5 shadow-sm">
          <Skeleton className="h-6 w-32 mb-4" />
          
          <View className="mb-4">
            <Skeleton className="h-4 w-16 mb-2" />
            <View className="flex-row flex-wrap gap-2">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-32 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </View>
          </View>

          <View>
            <Skeleton className="h-4 w-24 mb-2" />
            <View className="flex-row flex-wrap gap-2">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="p-4 border-t border-border flex-row items-center justify-between">
        <Skeleton className="h-12 w-full rounded-lg" />
      </View>
    </SafeAreaView>
  );
};
