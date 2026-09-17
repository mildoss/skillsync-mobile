import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Bell, X, CheckCheck, ChevronRight, Inbox } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Notification } from "@/types/notifications";
import { formatDate } from "@/lib/utils";

[Bell, X, CheckCheck, ChevronRight, Inbox].forEach((Icon) => {
  cssInterop(Icon, {
    className: { target: "style", nativeStyleToProp: { color: true } },
  });
});

function formatNotificationTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return formatDate(dateString);
  } catch {
    return formatDate(dateString);
  }
}

export const NotificationModal = () => {
  const router = useRouter();
  const { notifications, unreadCount, isLoading, isOpen, setIsOpen, markAllAsRead } =
    useNotificationStore();

  const handleNotificationPress = (notification: Notification) => {
    setIsOpen(false);

    if (!notification.link) return;

    const link = notification.link.trim();
    if (link.startsWith("/vacancies/")) {
      const id = link.replace("/vacancies/", "");
      if (id) router.push(`/vacancies/${id}`);
    } else if (link.startsWith("/companies/")) {
      const id = link.replace("/companies/", "");
      if (id) router.push(`/companies/${id}`);
    } else if (link === "/applications" || link.includes("application")) {
      router.push("/(tabs)/profile");
    } else if (link === "/profile" || link === "/billing") {
      router.push("/(tabs)/profile");
    } else if (link === "/vacancies") {
      router.push("/(tabs)/vacancies");
    } else if (link === "/companies") {
      router.push("/(tabs)/companies");
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => setIsOpen(false)}
    >
      <View className="flex-1 justify-end bg-black/45">
        <Pressable className="flex-1" onPress={() => setIsOpen(false)} />

        <View className="max-h-[80%] min-h-[45%] rounded-t-3xl border-t border-border bg-card shadow-2xl">
          <View className="my-2.5 h-1.5 w-12 self-center rounded-full bg-muted-foreground/30" />

          <View className="flex-row items-center justify-between border-b border-border px-5 pb-3 pt-1">
            <View className="flex-row items-center gap-2.5">
              <View className="rounded-full bg-primary/10 p-2">
                <Bell className="text-primary" size={18} />
              </View>
              <View>
                <Text className="text-lg font-bold text-foreground">Notifications</Text>
                <Text className="text-xs text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2">
              {unreadCount > 0 && (
                <TouchableOpacity
                  onPress={() => void markAllAsRead()}
                  className="flex-row items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2"
                  activeOpacity={0.7}
                >
                  <CheckCheck className="text-primary" size={15} />
                  <Text className="text-xs font-semibold text-primary">Read all</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                className="rounded-full bg-muted/60 p-2 active:bg-muted"
                accessibilityLabel="Close notifications"
              >
                <X className="text-muted-foreground" size={18} />
              </TouchableOpacity>
            </View>
          </View>

          {isLoading && notifications.length === 0 ? (
            <View className="flex-1 items-center justify-center py-16">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="mt-3 text-xs text-muted-foreground">
                Loading notifications...
              </Text>
            </View>
          ) : notifications.length === 0 ? (
            <View className="flex-1 items-center justify-center px-6 py-16">
              <View className="mb-4 rounded-full bg-muted/60 p-4">
                <Inbox className="text-muted-foreground/50" size={32} />
              </View>
              <Text className="text-base font-bold text-foreground">No notifications yet</Text>
              <Text className="mt-1 max-w-xs text-center text-xs leading-relaxed text-muted-foreground">
                Updates about job applications, candidate statuses, and AI tokens will appear here.
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
            >
              {notifications.map((n) => {
                const hasLink = !!n.link;
                return (
                  <TouchableOpacity
                    key={n.id}
                    onPress={() => handleNotificationPress(n)}
                    activeOpacity={hasLink ? 0.7 : 1}
                    className={`border-b border-border/60 px-5 py-4 ${!n.isRead ? "bg-primary/5" : "bg-card"
                      }`}
                  >
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          {!n.isRead && (
                            <View className="h-2 w-2 rounded-full bg-primary" />
                          )}
                          <Text
                            className={`text-sm ${!n.isRead
                              ? "font-bold text-foreground"
                              : "font-semibold text-foreground/90"
                              }`}
                          >
                            {n.title}
                          </Text>
                        </View>
                        <Text className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {n.message}
                        </Text>
                        {hasLink && (
                          <View className="mt-2 flex-row items-center gap-1">
                            <Text className="text-xs font-semibold text-primary">
                              View details
                            </Text>
                            <ChevronRight className="text-primary" size={13} />
                          </View>
                        )}
                      </View>

                      <Text className="shrink-0 text-[10px] font-medium text-muted-foreground/80">
                        {formatNotificationTime(n.createdAt)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};
