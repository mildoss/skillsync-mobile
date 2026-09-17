import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { CompanySkeleton } from "@/components/companies/CompanySkeleton";
import { useColorScheme } from "nativewind";

import { SearchHeader } from "@/components/shared/SearchHeader";

export default function CompaniesScreen() {
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

  const { companies, isLoading, isFetchingNextPage, error, fetchNextPage, refresh, hasNextPage } =
    useCompanies(debouncedQuery ? { search: debouncedQuery } : {});

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

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
        title="Top IT Companies"
        subtitle="Explore leading tech employers"
        placeholder="Search companies by name..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSubmit={handleSubmit}
        onClear={handleClear}
      />

      {isLoading && companies.length === 0 ? (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }} keyboardShouldPersistTaps="handled">
          {Array.from({ length: 5 }).map((_, i) => (
            <CompanySkeleton key={i} />
          ))}
        </ScrollView>
      ) : error ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="mb-2 font-semibold text-destructive">Something went wrong</Text>
          <Text className="text-center text-muted-foreground">{error.message}</Text>
        </View>
      ) : (
        <FlatList
          data={companies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CompanyCard company={item} />}
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
              refreshing={isLoading && companies.length > 0}
              onRefresh={refresh}
              tintColor={isDark ? "#ffffff" : "#4f46e5"}
            />
          }
          ListEmptyComponent={
            !isLoading ? (
              <View className="mt-4 items-center rounded-xl border border-border bg-card py-12">
                <Text className="text-xl font-semibold text-foreground">No companies found</Text>
                <Text className="mt-2 text-muted-foreground">Try adjusting your search query</Text>
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
