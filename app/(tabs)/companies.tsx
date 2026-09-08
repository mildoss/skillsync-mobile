import { useState, useEffect } from "react";
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
import { useCompanies } from "@/hooks/useCompanies";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { CompanySkeleton } from "@/components/companies/CompanySkeleton";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";

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
      {/* Header with Search - pinned at top to prevent unmounting and losing focus/keyboard */}
      <View className="border-b border-border/40 px-4 pb-3 pt-2">
        <Text className="text-center text-3xl font-bold tracking-tight text-foreground">
          Top IT Companies
        </Text>
        <Text className="my-2 text-center text-sm text-muted-foreground">
          Discover the best places to work and explore their open vacancies.
        </Text>

        <View className="relative mt-2">
          <View className="absolute left-3 top-3 z-10">
            <Search size={20} color={isDark ? "#a1a1aa" : "#71717a"} />
          </View>
          <Input
            placeholder="Search companies by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            className="h-12 border-border bg-card pl-10 pr-10"
            placeholderTextColor={isDark ? "#a1a1aa" : "#71717a"}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={handleClear} className="absolute right-3 top-3.5 z-10" hitSlop={8}>
              <X size={18} color={isDark ? "#a1a1aa" : "#71717a"} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Content Area */}
      {isLoading && companies.length === 0 ? (
        <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
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
          contentContainerStyle={{ padding: 16 }}
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
