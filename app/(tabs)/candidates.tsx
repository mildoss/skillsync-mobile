import React from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCandidates } from "@/hooks/useCandidates";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import { CandidateSkeleton } from "@/components/candidates/CandidateSkeleton";
import { Filter } from "lucide-react-native";
import { useColorScheme } from "nativewind";

export default function CandidatesScreen() {
  const params = useLocalSearchParams();
  const { candidates, isLoading, isFetchingNextPage, error, fetchNextPage, refresh, hasNextPage } = useCandidates(params);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  
  const filterCount = Object.keys(params).length;

  if (isLoading && candidates.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
        <View className="px-4 py-4 border-b border-border flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-bold tracking-tight text-foreground">
              Candidates
            </Text>
            <Text className="text-muted-foreground my-1">
              Find the right people
            </Text>
          </View>
          <Pressable 
            onPress={() => router.push({ pathname: "/candidates/filters", params })}
            className="h-10 w-10 bg-primary/10 rounded-full items-center justify-center relative"
          >
            <Filter size={20} color={isDark ? "#ffffff" : "#4f46e5"} />
            {filterCount > 0 ? (
              <View className="absolute -top-1 -right-1 bg-destructive h-5 w-5 rounded-full items-center justify-center border-2 border-background">
                <Text className="text-[10px] font-bold text-destructive-foreground">
                  {filterCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <CandidateSkeleton key={i} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center p-4">
        <Text className="text-destructive font-semibold mb-2">Something went wrong</Text>
        <Text className="text-muted-foreground text-center">{error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <View className="px-4 py-4 border-b border-border flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-bold tracking-tight text-foreground">
            Candidates
          </Text>
          <Text className="text-muted-foreground my-1">
            Find the right people
          </Text>
        </View>
        <Pressable 
          onPress={() => router.push({ pathname: "/candidates/filters", params })}
          className="h-10 w-10 bg-primary/10 rounded-full items-center justify-center relative"
        >
          <Filter size={20} color={isDark ? "#ffffff" : "#4f46e5"} />
          {filterCount > 0 ? (
            <View className="absolute -top-1 -right-1 bg-destructive h-5 w-5 rounded-full items-center justify-center border-2 border-background">
              <Text className="text-[10px] font-bold text-destructive-foreground">
                {filterCount}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>
      
      <FlatList
        data={candidates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CandidateCard candidate={item} />}
        contentContainerStyle={{ padding: 16 }}
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
            <View className="py-12 items-center">
              <Text className="text-lg font-medium text-foreground">No candidates found</Text>
              <Text className="text-muted-foreground mt-1">Try changing filters</Text>
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
