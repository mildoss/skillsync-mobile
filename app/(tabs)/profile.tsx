import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LogOut } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { getMe } from "@/lib/api";

cssInterop(LogOut, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
});

export default function ProfileScreen() {
  const { isAuthenticated, user, logout, setUser } = useAuthStore();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    if (isAuthenticated && !user) {
      getMe().then((data) => {
        if (data) setUser(data);
      });
    }
  }, [isAuthenticated, user, setUser]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        {authMode === "login" ? (
          <LoginForm onSwitchToRegister={() => setAuthMode("register")} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setAuthMode("login")} />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between border-b border-border px-4 py-6">
        <Text className="text-2xl font-bold text-foreground">Profile</Text>
        <TouchableOpacity onPress={logout} className="p-2">
          <LogOut className="text-red-500" size={24} />
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <View className="items-center rounded-2xl border border-border bg-card p-6">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary/20">
            <Text className="text-2xl font-bold text-primary">
              {user?.email ? user.email.charAt(0).toUpperCase() : "?"}
            </Text>
          </View>
          <Text className="mb-1 text-xl font-bold text-foreground">
            {user?.name || (user?.email ? user.email.split("@")[0] : "Loading...")}
          </Text>
          <Text className="text-muted-foreground">{user?.email || "Fetching profile..."}</Text>

          {user?.role && (
            <View className="mt-4 rounded-full bg-primary/10 px-3 py-1">
              <Text className="font-medium text-primary">{user.role}</Text>
            </View>
          )}
        </View>

        <View className="mt-8">
          <Text className="mb-4 text-lg font-bold text-foreground">Settings</Text>
          <TouchableOpacity className="flex-row items-center justify-between rounded-xl border border-border bg-card p-4">
            <Text className="font-medium text-foreground">Theme</Text>
            <Text className="text-muted-foreground">System</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
