import { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Message } from "@/types/chat";
import { ApplicationStatus } from "@/types/application";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useChatStore } from "@/store/useChatStore";
import { toast } from "@/store/useToastStore";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatInputBar } from "./ChatInputBar";

interface ChatWindowProps {
  applicationId: string;
  initialMessages: Message[];
  initialStatus: ApplicationStatus;
  currentUser: {
    id: string;
    name: string;
    role?: "APPLICANT" | "EMPLOYER";
    avatarUrl: string | null;
  };
  isDark: boolean;
  onStatusChanged?: (newStatus: ApplicationStatus) => void;
}

export const ChatWindow = ({
  applicationId,
  initialMessages,
  initialStatus,
  currentUser,
  isDark,
  onStatusChanged,
}: ChatWindowProps) => {
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const readMessageIdsRef = useRef<Set<string>>(new Set());
  const { decrementUnreadCount } = useChatStore();

  const { messages, sendMessage, isConnected, markAsRead, chatStatus } = useChatSocket({
    user: currentUser,
    applicationId,
    initialMessages,
    initialStatus,
  });

  useEffect(() => {
    if (onStatusChanged) {
      onStatusChanged(chatStatus);
    }
  }, [chatStatus, onStatusChanged]);

  useEffect(() => {
    if (!currentUser.id || !isConnected) return;

    const unreadIds = messages
      .filter(
        (m) =>
          !m.isRead &&
          m.senderId !== currentUser.id &&
          !m.id.startsWith("temp-") &&
          !readMessageIdsRef.current.has(m.id),
      )
      .map((m) => m.id);

    if (unreadIds.length > 0) {
      unreadIds.forEach((msgId) => readMessageIdsRef.current.add(msgId));
      markAsRead(unreadIds);
      decrementUnreadCount(unreadIds.length);
    }
  }, [messages, currentUser.id, isConnected, markAsRead, decrementUnreadCount]);

  const isApplicant = currentUser.role === "APPLICANT";
  const isPending = chatStatus === "PENDING";
  const isRejected = chatStatus === "REJECTED";
  const isInputBlocked = (isApplicant && isPending) || isRejected;

  const handleSend = () => {
    if (!inputText.trim()) return;
    if (!isConnected) {
      toast.error("Connection Error", "Cannot send message while disconnected");
      return;
    }
    if (isInputBlocked) return;
    try {
      sendMessage(inputText.trim());
      setInputText("");
    } catch {
      toast.error("Error", "Failed to send message");
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <ChatMessageBubble message={item} currentUserId={currentUser.id} isDark={isDark} />
    ),
    [currentUser.id, isDark],
  );

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      {!isConnected && (
        <View className="border-b border-amber-500/20 bg-amber-500/10 py-1.5 text-center">
          <Text className="text-center text-xs font-medium text-amber-600 dark:text-amber-400">
            Connecting to real-time chat...
          </Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingVertical: 12,
          flexGrow: 1,
          justifyContent: messages.length === 0 ? "center" : undefined,
        }}
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }}
        ListEmptyComponent={
          <View className="items-center justify-center px-6 py-12">
            <Text className="text-center text-sm font-medium text-muted-foreground">
              No messages yet. Start the conversation!
            </Text>
          </View>
        }
      />

      <ChatInputBar
        inputText={inputText}
        setInputText={setInputText}
        onSend={handleSend}
        isConnected={isConnected}
        isInputBlocked={isInputBlocked}
        isRejected={isRejected}
        isApplicantPending={isApplicant && isPending}
        isDark={isDark}
      />
    </KeyboardAvoidingView>
  );
};
