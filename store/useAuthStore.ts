import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { User } from "@/types/users";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  login: (accessToken: string, refreshToken: string, user?: User | null) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  updateTokens: (accessToken: string, refreshToken?: string) => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  isHydrated: false,

  login: async (accessToken, refreshToken, user = null) => {
    await SecureStore.setItemAsync("access-token", accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync("refresh-token", refreshToken);
    }
    set({
      isAuthenticated: true,
      user: user ?? null,
      accessToken,
      refreshToken,
    });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("access-token");
    await SecureStore.deleteItemAsync("refresh-token");
    set({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  },

  updateTokens: async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync("access-token", accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync("refresh-token", refreshToken);
    }
    set((state) => ({
      accessToken,
      refreshToken: refreshToken || state.refreshToken,
    }));
  },

  setUser: (user: User | null) => {
    set({ user });
  },

  hydrate: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access-token");
      const refreshToken = await SecureStore.getItemAsync("refresh-token");

      if (accessToken) {
        set({
          isAuthenticated: true,
          accessToken,
          refreshToken,
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    } catch (e) {
      set({ isHydrated: true });
    }
  },
}));
