import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LogOut } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { getMe, getCategories, getSkills, getLanguages } from "@/lib/api";
import { EmployerProfileForm } from "@/components/profile/EmployerProfileForm";
import { ApplicantProfileForm } from "@/components/profile/ApplicantProfileForm";
import { Dictionaries } from "@/types/dictionaries";

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
  const [categories, setCategories] = useState<Dictionaries[]>([]);
  const [skills, setSkills] = useState<Dictionaries[]>([]);
  const [languages, setLanguages] = useState<Dictionaries[]>([]);
  const [isFetchingDictionaries, setIsFetchingDictionaries] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !user) {
      getMe().then((data) => {
        if (data) setUser(data);
      });
    }
  }, [isAuthenticated, user, setUser]);

  useEffect(() => {
    let isMounted = true;
    if (user?.role === "APPLICANT") {
      Promise.resolve().then(() => {
        if (isMounted) setIsFetchingDictionaries(true);
      });
      Promise.all([getCategories(), getSkills(), getLanguages()])
        .then(([c, s, l]) => {
          if (isMounted) {
            setCategories(c);
            setSkills(s);
            setLanguages(l);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setIsFetchingDictionaries(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [user?.role]);

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
      <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
        <View className="mr-3 flex-1">
          <Text className="text-2xl font-bold tracking-tight text-foreground">My Profile</Text>
          <Text className="text-sm text-muted-foreground">
            {user?.role === "EMPLOYER"
              ? "Update your personal details. Candidates will see this when you interact with them."
              : "Fill out your resume to apply for top jobs and get noticed by recruiters."}
          </Text>
        </View>
        <TouchableOpacity
          onPress={logout}
          className="shrink-0 rounded-xl bg-destructive/10 p-2.5"
          accessibilityLabel="Logout"
        >
          <LogOut className="text-destructive" size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {!user ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" className="text-primary" />
          </View>
        ) : user.role === "EMPLOYER" ? (
          <EmployerProfileForm user={user} />
        ) : user.role === "APPLICANT" ? (
          isFetchingDictionaries ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="large" className="text-primary" />
            </View>
          ) : (
            <ApplicantProfileForm
              user={user}
              categories={categories}
              skills={skills}
              languages={languages}
            />
          )
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
