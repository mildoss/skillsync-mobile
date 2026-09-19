import { create } from "zustand";
import { getUnreadChatsCount } from "@/lib/api";
import { useAuthStore } from "./useAuthStore";

interface ChatState {
  unreadCount: number;
  isLoading: boolean;
  fetchUnreadCount: () => Promise<void>;
  setUnreadCount: (count: number) => void;
  decrementUnreadCount: (amount?: number) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  unreadCount: 0,
  isLoading: false,

  fetchUnreadCount: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      set({ unreadCount: 0, isLoading: false });
      return;
    }

    try {
      set({ isLoading: true });
      const count = await getUnreadChatsCount();
      set({ unreadCount: count });
    } catch {
      // ignore
    } finally {
      set({ isLoading: false });
    }
  },

  setUnreadCount: (count: number) => {
    set({ unreadCount: Math.max(0, count) });
  },

  decrementUnreadCount: (amount = 1) => {
    set({ unreadCount: Math.max(0, get().unreadCount - amount) });
  },
}));
