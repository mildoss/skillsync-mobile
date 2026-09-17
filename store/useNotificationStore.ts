import { create } from "zustand";
import { Notification } from "@/types/notifications";
import { getNotifications, markNotificationsAsRead } from "@/lib/api";
import { useAuthStore } from "./useAuthStore";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isOpen: false,

  setIsOpen: (isOpen: boolean) => {
    set({ isOpen });
    if (isOpen && get().unreadCount > 0) {
      void get().markAllAsRead();
    }
  },

  fetchNotifications: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      set({ notifications: [], unreadCount: 0, isLoading: false });
      return;
    }

    try {
      set({ isLoading: true });
      const res = await getNotifications();
      if (res) {
        set({
          notifications: res.data || [],
          unreadCount: res.unreadCount ?? 0,
        });
      }
    } catch {
      // ignore
    } finally {
      set({ isLoading: false });
    }
  },

  markAllAsRead: async () => {
    const { unreadCount, notifications } = get();
    if (unreadCount === 0 && notifications.every((n) => n.isRead)) return;

    set({
      unreadCount: 0,
      notifications: notifications.map((n) => ({ ...n, isRead: true })),
    });

    try {
      await markNotificationsAsRead();
    } catch {
      // rollback if needed
    }
  },
}));
