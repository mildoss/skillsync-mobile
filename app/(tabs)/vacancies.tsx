import React from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVacancies } from "@/hooks/useVacancies";
import { VacancyCard } from "@/components/vacancies/VacancyCard";
import { useColorScheme } from "nativewind";

export default function VacanciesScreen() {
  const { vacancies, isLoading, isFetchingNextPage, error, fetchNextPage, refresh } = useVacancies();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  if (isLoading && vacancies.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={isDark ? "#ffffff" : "#4f46e5"} />
      </SafeAreaView>
    );
  }

  if (error && vacancies.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center p-4">
        <Text className="text-destructive text-lg text-center mb-2">Error loading vacancies</Text>
        <Text className="text-muted-foreground text-center">{error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-3xl font-bold tracking-tight text-foreground">
          Search for vacancies
        </Text>
        <Text className="text-muted-foreground my-1">
          Find your dream job among hundreds of offers
        </Text>
      </View>
      
      <FlatList
        data={vacancies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VacancyCard vacancy={item} />}
        contentContainerStyle={{ padding: 16 }}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
            tintColor={isDark ? "#ffffff" : "#4f46e5"}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View className="bg-card rounded-lg border border-border py-12 items-center">
              <Text className="text-lg font-medium text-foreground">No vacancies found</Text>
              <Text className="text-muted-foreground mt-1 text-sm">Try checking your internet connection</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator size="small" color={isDark ? "#ffffff" : "#4f46e5"} />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
