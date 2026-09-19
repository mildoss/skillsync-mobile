import { useState, useEffect, useMemo } from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCandidates } from "@/hooks/useCandidates";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import { CandidateSkeleton } from "@/components/candidates/CandidateSkeleton";
import { useColorScheme } from "nativewind";

import { SearchHeader } from "@/components/shared/SearchHeader";

export default function CandidatesScreen() {
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

  const { candidates, isLoading, isFetchingNextPage, error, fetchNextPage, refresh, hasNextPage } =
    useCandidates(queryParams);

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
        title="Candidates"
        subtitle="Find the right people"
        placeholder="Search candidates by name, position, skill..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onFilterPress={() => router.push({ pathname: "/candidates/filters", params })}
        filterCount={filterCount}
      />

      {isLoading && candidates.length === 0 ? (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
          keyboardShouldPersistTaps="handled"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <CandidateSkeleton key={i} />
          ))}
        </ScrollView>
      ) : error ? (
        <View className="flex-1 items-center justify-center bg-background p-4">
          <Text className="mb-2 font-semibold text-destructive">Something went wrong</Text>
          <Text className="text-center text-muted-foreground">{error.message}</Text>
        </View>
      ) : (
        <FlatList
          data={candidates}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CandidateCard candidate={item} />}
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
              refreshing={isLoading && candidates.length > 0}
              onRefresh={refresh}
              tintColor={isDark ? "#ffffff" : "#4f46e5"}
            />
          }
          ListEmptyComponent={
            !isLoading ? (
              <View className="items-center py-12">
                <Text className="text-lg font-medium text-foreground">No candidates found</Text>
                <Text className="mt-1 text-muted-foreground">
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
