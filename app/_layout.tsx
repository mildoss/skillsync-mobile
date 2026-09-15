import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect } from "react";
import { View, LogBox, Appearance } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useColorScheme } from "nativewind";
import { getMe } from "@/lib/api";
import { ToastContainer } from "@/components/ui/toast";
import { lightThemeVars, darkThemeVars } from "@/lib/theme";
export { ErrorBoundary } from "expo-router";

LogBox.ignoreLogs([
  "[Reanimated]",
  "Cannot connect to Expo CLI",
]);

const queryClient = new QueryClient();

export default function RootLayout() {
  const { hydrate, isHydrated, setUser, accessToken } = useAuthStore();
  const { hydrateTheme, isHydrated: isThemeHydrated, themeMode, resolvedTheme } = useThemeStore();
  const { setColorScheme, colorScheme } = useColorScheme();

  useEffect(() => {
    hydrate();
    hydrateTheme();
  }, [hydrate, hydrateTheme]);

  useEffect(() => {
    if (isThemeHydrated) {
      setColorScheme(themeMode);
    }
  }, [isThemeHydrated, themeMode, setColorScheme]);

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme: sysScheme }) => {
      if (themeMode === "system") {
        setColorScheme("system");
        useThemeStore.setState({
          resolvedTheme: sysScheme === "dark" ? "dark" : "light",
        });
      }
    });
    return () => listener.remove();
  }, [themeMode, setColorScheme]);

  useEffect(() => {
    if (isHydrated && accessToken) {
      getMe().then((user) => {
        if (user) setUser(user);
      });
    }
  }, [isHydrated, accessToken, setUser]);

  const isDark = colorScheme === "dark" || resolvedTheme === "dark";

  return (
    <QueryClientProvider client={queryClient}>
      <View
        style={[{ flex: 1 }, isDark ? darkThemeVars : lightThemeVars]}
        className={`flex-1 ${isDark ? "dark bg-[#09090b]" : "bg-[#ffffff]"}`}
      >
        <StatusBar style={isDark ? "light" : "dark"} />
        <ToastContainer />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: isDark ? "#09090b" : "#ffffff" },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="vacancies/[id]" options={{ headerShown: false }} />
          <Stack.Screen
            name="vacancies/filters"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen name="companies/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="candidates/[id]" options={{ headerShown: false }} />
          <Stack.Screen
            name="candidates/filters"
            options={{ presentation: "modal", headerShown: false }}
          />
        </Stack>
      </View>
    </QueryClientProvider>
  );
}
