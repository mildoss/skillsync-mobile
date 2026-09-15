import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { Appearance } from "react-native";

export type ThemeMode = "system" | "light" | "dark";

interface ThemeState {
  themeMode: ThemeMode;
  resolvedTheme: "light" | "dark";
  isHydrated: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  hydrateTheme: () => Promise<void>;
}

function resolveSystemTheme(): "light" | "dark" {
  return Appearance.getColorScheme() === "dark" ? "dark" : "light";
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeMode: "system",
  resolvedTheme: resolveSystemTheme(),
  isHydrated: false,

  setThemeMode: async (mode: ThemeMode) => {
    await SecureStore.setItemAsync("theme-mode", mode);
    set({
      themeMode: mode,
      resolvedTheme:
        mode === "system" ? resolveSystemTheme() : mode,
    });
  },

  hydrateTheme: async () => {
    try {
      const stored = await SecureStore.getItemAsync("theme-mode");
      if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
        const mode = stored as ThemeMode;
        set({
          themeMode: mode,
          resolvedTheme:
            mode === "system" ? resolveSystemTheme() : mode,
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },
}));
