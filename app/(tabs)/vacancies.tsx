import { useState, useEffect, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { Filter, Search, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";

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
      {/* Header with Title, Filter Button, and Search Bar */}
      <View className="border-b border-border/40 px-4 pb-3 pt-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold tracking-tight text-foreground">Vacancies</Text>
            <Text className="my-0.5 text-sm text-muted-foreground">Find your dream job</Text>
          </View>
          <Pressable
            onPress={() => router.push({ pathname: "/vacancies/filters", params })}
            className="relative h-11 w-11 items-center justify-center rounded-xl bg-primary/10"
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

        <View className="relative mt-3">
          <View className="absolute left-3 top-3 z-10">
            <Search size={20} color={isDark ? "#a1a1aa" : "#71717a"} />
          </View>
          <Input
            placeholder="Search by title, skills, keyword..."
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

      {isLoading && vacancies.length === 0 ? (
        <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
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
