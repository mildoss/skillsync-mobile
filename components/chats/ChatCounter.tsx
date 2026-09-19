import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MessageSquare } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { useRouter } from "expo-router";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";

cssInterop(MessageSquare, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

interface ChatCounterProps {
  className?: string;
}

export const ChatCounter = ({ className }: ChatCounterProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { unreadCount, fetchUnreadCount } = useChatStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    void fetchUnreadCount();

    const timer = setInterval(() => {
      void fetchUnreadCount();
    }, 30000);

    return () => clearInterval(timer);
  }, [isAuthenticated, fetchUnreadCount]);

  if (!isAuthenticated) return null;

  return (
    <TouchableOpacity
      onPress={() => router.push("/chats" as any)}
      className={`relative h-10 w-10 items-center justify-center rounded-xl bg-secondary ${
        className || ""
      }`}
      accessibilityLabel={`Messages (${unreadCount} unread)`}
      activeOpacity={0.7}
    >
      <MessageSquare className="text-foreground" size={20} />

      {unreadCount > 0 && (
        <View className="absolute -right-1 -top-1 h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-background bg-destructive px-1">
          <Text className="text-[10px] font-extrabold text-destructive-foreground">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
