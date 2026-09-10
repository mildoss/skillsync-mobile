import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { getMe } from "@/lib/api";
import { ToastContainer } from "@/components/ui/toast";
export { ErrorBoundary } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { hydrate, isHydrated, setUser, accessToken } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isHydrated && accessToken) {
      getMe().then((user) => {
        if (user) setUser(user);
      });
    }
  }, [isHydrated, accessToken, setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <ToastContainer />
      <Stack screenOptions={{ headerShown: false }}>
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
    </QueryClientProvider>
  );
}
