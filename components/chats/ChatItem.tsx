import { View, Text, TouchableOpacity } from "react-native";
import { ChatRoom } from "@/types/chat";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { ApplicationStatusBadge } from "@/components/applications/ApplicationStatusBadge";
import { formatChatTime } from "@/lib/utils";

interface ChatItemProps {
  chat: ChatRoom;
  currentUserRole?: string;
  onPress: () => void;
}

export const ChatItem = ({ chat, currentUserRole, onPress }: ChatItemProps) => {
  const isApplicant = currentUserRole === "APPLICANT";

  const info = isApplicant
    ? {
        name: chat.vacancy?.company?.name || "Company",
        avatar: chat.vacancy?.company?.logoUrl,
        subtitle: chat.vacancy?.title || "Vacancy",
        status: chat.status,
      }
    : {
        name: `${chat.applicant?.name || "Candidate"} ${chat.applicant?.surname || ""}`.trim(),
        avatar: chat.applicant?.avatarUrl,
        subtitle: chat.vacancy?.title || "Vacancy",
        status: chat.status,
      };

  const lastMessage = chat.messages?.[0];
  const unreadCount = chat._count?.messages || 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-3 border-b border-border/40 bg-card px-4 py-3.5"
    >
      <CustomAvatar imageUrl={info.avatar} fallbackText={info.name} size="md" />

      <View className="flex-1">
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="flex-1 text-base font-bold text-foreground" numberOfLines={1}>
            {info.name}
          </Text>
          {lastMessage?.createdAt && (
            <Text className="ml-2 text-[11px] font-medium text-muted-foreground">
              {formatChatTime(new Date(lastMessage.createdAt))}
            </Text>
          )}
        </View>

        <View className="mb-1 flex-row items-center gap-2">
          <Text className="flex-1 text-xs font-semibold text-primary" numberOfLines={1}>
            {info.subtitle}
          </Text>
          <ApplicationStatusBadge status={info.status} />
        </View>

        <View className="flex-row items-center justify-between gap-2">
          <Text
            className={`flex-1 text-xs ${
              unreadCount > 0 ? "font-bold text-foreground" : "text-muted-foreground"
            }`}
            numberOfLines={1}
          >
            {lastMessage ? lastMessage.text : "No messages yet"}
          </Text>

          {unreadCount > 0 && (
            <View className="h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5">
              <Text className="text-[10px] font-extrabold text-destructive-foreground">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
