import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useVacancies } from "@/hooks/useVacancies";
import { VacancyCard } from "@/components/vacancies/VacancyCard";
import { VacancySkeleton } from "@/components/vacancies/VacancySkeleton";
import { Filter } from "lucide-react-native";
import { useColorScheme } from "nativewind";

export default function VacanciesScreen() {
  const params = useLocalSearchParams();
  const { vacancies, isLoading, isFetchingNextPage, error, fetchNextPage, refresh, hasNextPage } =
    useVacancies(params);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const filterCount = Object.keys(params).length;

  if (isLoading && vacancies.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
        <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
          <View>
            <Text className="text-3xl font-bold tracking-tight text-foreground">Vacancies</Text>
            <Text className="my-1 text-muted-foreground">Find your dream job</Text>
          </View>
          <Pressable
            onPress={() => router.push({ pathname: "/vacancies/filters", params })}
            className="relative h-10 w-10 items-center justify-center rounded-full bg-primary/10"
          >
            <Filter size={20} color={isDark ? "#ffffff" : "#4f46e5"} />
            {filterCount > 0 && (
              <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-destructive">
                <Text className="text-[10px] font-bold text-destructive-foreground">
                  {filterCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <VacancySkeleton key={i} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background p-4">
        <Text className="mb-2 font-semibold text-destructive">Something went wrong</Text>
        <Text className="text-center text-muted-foreground">{error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
        <View>
          <Text className="text-3xl font-bold tracking-tight text-foreground">Vacancies</Text>
          <Text className="my-1 text-muted-foreground">Find your dream job</Text>
        </View>
        <Pressable
          onPress={() => router.push({ pathname: "/vacancies/filters", params })}
          className="relative h-10 w-10 items-center justify-center rounded-full bg-primary/10"
        >
          <Filter size={20} color={isDark ? "#ffffff" : "#4f46e5"} />
          {filterCount > 0 ? (
            <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-destructive">
              <Text className="text-[10px] font-bold text-destructive-foreground">
                {filterCount}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <FlatList
        data={vacancies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VacancyCard vacancy={item} />}
        contentContainerStyle={{ padding: 16 }}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
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
            <View className="items-center rounded-lg border border-border bg-card py-12">
              <Text className="text-lg font-medium text-foreground">No vacancies found</Text>
              <Text className="mt-1 text-sm text-muted-foreground">
                Try checking your internet connection
              </Text>
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
