import { useState, useMemo, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { getChatMessages, getMyChats } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/store/useToastStore";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { ApplicationStatusBadge } from "@/components/applications/ApplicationStatusBadge";
import { ApplicationStatus } from "@/types/application";
import { Message, ChatRoom } from "@/types/chat";
import { ChatWindow } from "@/components/chats/ChatWindow";

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const applicationId = id as string;
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user, isAuthenticated } = useAuthStore();

  const [realtimeStatus, setRealtimeStatus] = useState<ApplicationStatus | null>(null);

  const { data: myChats = [], isLoading: isLoadingChats } = useQuery<ChatRoom[]>({
    queryKey: ["my-chats"],
    queryFn: getMyChats,
    enabled: isAuthenticated,
  });

  const chatRoom = useMemo(
    () => myChats.find((c) => c.id === applicationId),
    [myChats, applicationId],
  );

  const {
    data: initialMessages = [],
    isLoading: isLoadingMessages,
    isError: isMessagesError,
    error: messagesError,
  } = useQuery<Message[]>({
    queryKey: ["chat-messages", applicationId],
    queryFn: () => getChatMessages(applicationId),
    enabled: isAuthenticated && !!applicationId,
  });

  useEffect(() => {
    if (isMessagesError && messagesError) {
      toast.error(
        "Failed to load messages",
        (messagesError as Error)?.message || "Please try again later",
      );
    }
  }, [isMessagesError, messagesError]);

  const isLoading = isLoadingMessages || (isLoadingChats && myChats.length === 0);

  const partnerInfo = useMemo(() => {
    const isApplicant = user?.role === "APPLICANT";
    if (!chatRoom) {
      return {
        name: "Conversation",
        avatar: null,
        subtitle: "",
        href: null,
      };
    }

    if (isApplicant) {
      return {
        name: chatRoom.vacancy?.company?.name || "Company",
        avatar: chatRoom.vacancy?.company?.logoUrl || null,
        subtitle: chatRoom.vacancy?.title || "Vacancy",
        href: chatRoom.vacancy?.company?.id ? `/companies/${chatRoom.vacancy.company.id}` : null,
      };
    } else {
      return {
        name: `${chatRoom.applicant?.name || "Candidate"} ${
          chatRoom.applicant?.surname || ""
        }`.trim(),
        avatar: chatRoom.applicant?.avatarUrl || null,
        subtitle: chatRoom.vacancy?.title || "Vacancy",
        href: chatRoom.applicant?.id ? `/candidates/${chatRoom.applicant.id}` : null,
      };
    }
  }, [chatRoom, user?.role]);

  const currentStatus: ApplicationStatus = realtimeStatus || chatRoom?.status || "PENDING";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between border-b border-border/40 bg-card px-4 py-3 shadow-sm">
        <View className="flex-1 flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-xl bg-secondary"
            accessibilityLabel="Go back"
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={isDark ? "#ffffff" : "#09090b"} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (partnerInfo.href) {
                router.push(partnerInfo.href as any);
              }
            }}
            disabled={!partnerInfo.href}
            activeOpacity={partnerInfo.href ? 0.7 : 1}
            className="flex-1 flex-row items-center gap-2.5"
          >
            <CustomAvatar imageUrl={partnerInfo.avatar} fallbackText={partnerInfo.name} size="sm" />
            <View className="flex-1">
              <Text className="text-base font-bold text-foreground" numberOfLines={1}>
                {partnerInfo.name}
              </Text>
              {partnerInfo.subtitle ? (
                <Text className="text-xs font-medium text-muted-foreground" numberOfLines={1}>
                  {partnerInfo.subtitle}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>

        <ApplicationStatusBadge status={currentStatus} />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? "#818cf8" : "#4f46e5"} />
          <Text className="mt-3 text-sm text-muted-foreground">Loading conversation...</Text>
        </View>
      ) : (
        <ChatWindow
          key={applicationId}
          applicationId={applicationId}
          initialMessages={initialMessages}
          initialStatus={currentStatus}
          currentUser={{
            id: user?.id || "",
            name: `${user?.name || ""} ${user?.surname || ""}`.trim() || "User",
            role: user?.role,
            avatarUrl: user?.avatarUrl || null,
          }}
          isDark={isDark}
          onStatusChanged={(newStatus) => setRealtimeStatus(newStatus)}
        />
      )}
    </SafeAreaView>
  );
}
