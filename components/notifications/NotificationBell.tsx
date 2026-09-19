import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Bell } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { NotificationModal } from "./NotificationModal";

cssInterop(Bell, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell = ({ className }: NotificationBellProps) => {
  const { isAuthenticated } = useAuthStore();
  const { unreadCount, fetchNotifications, setIsOpen } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    void fetchNotifications();

    const timer = setInterval(() => {
      void fetchNotifications();
    }, 30000);

    return () => clearInterval(timer);
  }, [isAuthenticated, fetchNotifications]);

  if (!isAuthenticated) return null;

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className={`relative h-10 w-10 items-center justify-center rounded-xl bg-secondary ${
          className || ""
        }`}
        accessibilityLabel={`Notifications (${unreadCount} unread)`}
        activeOpacity={0.7}
      >
        <Bell className="text-foreground" size={20} />

        {unreadCount > 0 && (
          <View className="absolute -right-1 -top-1 h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-background bg-destructive px-1">
            <Text className="text-[10px] font-extrabold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <NotificationModal />
    </>
  );
};
