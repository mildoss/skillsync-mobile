import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export { ErrorBoundary } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
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
