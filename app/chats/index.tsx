import { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, X, MessageSquare } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { getMyChats } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { toast } from "@/store/useToastStore";
import { ChatRoom } from "@/types/chat";
import { ChatItem } from "@/components/chats/ChatItem";

export default function ChatsScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user, isAuthenticated } = useAuthStore();
  const { fetchUnreadCount } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: chats = [],
    isLoading,
    isRefetching,
    refetch,
    isError,
    error,
  } = useQuery<ChatRoom[]>({
    queryKey: ["my-chats"],
    queryFn: async () => {
      const result = await getMyChats();
      void fetchUnreadCount();
      return result;
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(
        "Failed to load conversations",
        (error as Error)?.message || "Please check your network connection",
      );
    }
  }, [isError, error]);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const query = searchQuery.toLowerCase();
    const isApplicant = user?.role === "APPLICANT";

    return chats.filter((chat) => {
      const name = isApplicant
        ? chat.vacancy?.company?.name || ""
        : `${chat.applicant?.name || ""} ${chat.applicant?.surname || ""}`;
      const subtitle = chat.vacancy?.title || "";

      return (
        name.toLowerCase().includes(query) ||
        subtitle.toLowerCase().includes(query)
      );
    });
  }, [chats, searchQuery, user?.role]);

  const renderChatItem = useCallback(
    ({ item }: { item: ChatRoom }) => (
      <ChatItem
        chat={item}
        currentUserRole={user?.role}
        onPress={() => router.push(`/chats/${item.id}` as any)}
      />
    ),
    [user?.role, router],
  );

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["top", "left", "right"]}
    >
      <View className="border-b border-border/40 px-4 pb-3 pt-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-xl bg-secondary"
              accessibilityLabel="Go back"
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={isDark ? "#ffffff" : "#09090b"} />
            </TouchableOpacity>
            <Text className="text-2xl font-black tracking-tight text-foreground">
              Messages
            </Text>
          </View>
        </View>

        <View className="relative mt-3">
          <View className="absolute left-3 top-3 z-10">
            <Search size={18} color={isDark ? "#a1a1aa" : "#71717a"} />
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search conversations..."
            placeholderTextColor={isDark ? "#a1a1aa" : "#71717a"}
            className="h-11 rounded-xl border border-border bg-card pl-9 pr-9 text-sm text-foreground"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className="absolute right-3 top-3 z-10"
              hitSlop={8}
            >
              <X size={16} color={isDark ? "#a1a1aa" : "#71717a"} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!isAuthenticated ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="mb-4 rounded-full bg-secondary p-5">
            <MessageSquare size={36} color={isDark ? "#818cf8" : "#4f46e5"} />
          </View>
          <Text className="mb-2 text-center text-lg font-bold text-foreground">
            Sign in to view messages
          </Text>
          <Text className="mb-6 text-center text-sm text-muted-foreground">
            Connect with employers and candidates in real-time.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            className="rounded-xl bg-primary px-6 py-3"
            activeOpacity={0.7}
          >
            <Text className="font-semibold text-primary-foreground">
              Go to Profile
            </Text>
          </TouchableOpacity>
        </View>
      ) : isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={isDark ? "#818cf8" : "#4f46e5"}
          />
          <Text className="mt-3 text-sm text-muted-foreground">
            Loading conversations...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={isDark ? "#818cf8" : "#4f46e5"}
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center px-6 py-20">
              <View className="mb-4 rounded-full bg-secondary p-6">
                <MessageSquare
                  size={40}
                  color={isDark ? "#52525b" : "#a1a1aa"}
                />
              </View>
              <Text className="mb-1 text-center text-lg font-bold text-foreground">
                {searchQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </Text>
              <Text className="text-center text-sm text-muted-foreground">
                {searchQuery
                  ? "Try searching with a different keyword."
                  : "When you apply for vacancies or invite candidates, your chats will appear here."}
              </Text>
            </View>
          }
          contentContainerStyle={{
            paddingBottom: 40,
            flexGrow: filteredChats.length === 0 ? 1 : undefined,
          }}
        />
      )}
    </SafeAreaView>
  );
}
