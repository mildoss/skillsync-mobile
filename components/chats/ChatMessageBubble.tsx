import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Check, CheckCheck } from "lucide-react-native";
import { Message } from "@/types/chat";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { formatDate } from "@/lib/utils";

interface ChatMessageBubbleProps {
  message: Message;
  currentUserId?: string;
  isDark: boolean;
}

export const ChatMessageBubble = React.memo(
  ({ message, currentUserId, isDark }: ChatMessageBubbleProps) => {
    if (message.isSystem) {
      return (
        <View className="my-3 items-center">
          <View className="rounded-full bg-secondary px-3.5 py-1.5 shadow-sm">
            <Text className="text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {message.text}
            </Text>
          </View>
        </View>
      );
    }

    const isMe = message.senderId === currentUserId;
    const isOptimistic = message.id.startsWith("temp-");

    return (
      <View
        className={`my-1.5 flex-row items-end gap-2 px-4 ${
          isMe ? "justify-end" : "justify-start"
        } ${isOptimistic ? "opacity-70" : ""}`}
      >
        {!isMe && (
          <CustomAvatar
            imageUrl={message.sender?.avatarUrl}
            fallbackText={message.sender?.name || "Partner"}
            size="sm"
          />
        )}

        <View className={`max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
          <View
            className={`rounded-2xl px-4 py-2.5 ${
              isMe
                ? "rounded-br-none bg-primary"
                : "rounded-bl-none border border-border/40 bg-card"
            }`}
          >
            <Text
              className={`text-sm leading-relaxed ${
                isMe ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              {message.text}
            </Text>
          </View>

          <View className="mt-1 flex-row items-center gap-1 px-1">
            <Text className="text-[10px] text-muted-foreground">
              {formatDate(message.createdAt)}
            </Text>

            {isMe &&
              !isOptimistic &&
              (message.isRead ? (
                <CheckCheck size={12} color="#3b82f6" />
              ) : (
                <Check size={12} color={isDark ? "#71717a" : "#9ca3af"} />
              ))}

            {isMe && isOptimistic && (
              <ActivityIndicator
                size="small"
                color={isDark ? "#818cf8" : "#4f46e5"}
                style={{ transform: [{ scale: 0.6 }] }}
              />
            )}
          </View>
        </View>
      </View>
    );
  },
);

ChatMessageBubble.displayName = "ChatMessageBubble";
