import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useVacancies } from "@/hooks/useVacancies";
import { VacancyCard } from "@/components/vacancies/VacancyCard";
import { VacancySkeleton } from "@/components/vacancies/VacancySkeleton";
import { useColorScheme } from "nativewind";

import { SearchHeader } from "@/components/shared/SearchHeader";

export default function VacanciesScreen() {
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const queryParams = useMemo(() => {
    const q: Record<string, any> = { ...params };
    if (debouncedQuery) {
      q.search = debouncedQuery;
    }
    return q;
  }, [params, debouncedQuery]);

  const { vacancies, isLoading, isFetchingNextPage, error, fetchNextPage, refresh, hasNextPage } =
    useVacancies(queryParams);

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const filterCount = Object.keys(params).filter((k) => k !== "search").length;

  const handleClear = () => {
    setSearchQuery("");
    setDebouncedQuery("");
  };

  const handleSubmit = () => {
    setDebouncedQuery(searchQuery.trim());
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <SearchHeader
        title="Vacancies"
        subtitle="Find your dream job"
        placeholder="Search by title, skills, keyword..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onFilterPress={() => router.push({ pathname: "/vacancies/filters", params })}
        filterCount={filterCount}
      />

      {isLoading && vacancies.length === 0 ? (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }} keyboardShouldPersistTaps="handled">
          {Array.from({ length: 5 }).map((_, i) => (
            <VacancySkeleton key={i} />
          ))}
        </ScrollView>
      ) : error ? (
        <View className="flex-1 items-center justify-center bg-background p-4">
          <Text className="mb-2 font-semibold text-destructive">Something went wrong</Text>
          <Text className="text-center text-muted-foreground">{error.message}</Text>
        </View>
      ) : (
        <FlatList
          data={vacancies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <VacancyCard vacancy={item} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
          keyboardShouldPersistTaps="handled"
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isLoading && vacancies.length > 0}
              onRefresh={refresh}
              tintColor={isDark ? "#ffffff" : "#4f46e5"}
            />
          }
          ListEmptyComponent={
            !isLoading ? (
              <View className="items-center rounded-lg border border-border bg-card py-12">
                <Text className="text-lg font-medium text-foreground">No vacancies found</Text>
                <Text className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search query or filters
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
      )}
    </SafeAreaView>
  );
}
