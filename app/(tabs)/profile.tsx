import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LogOut } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { EmployerProfileForm } from "@/components/profile/EmployerProfileForm";
import { ApplicantProfileForm } from "@/components/profile/ApplicantProfileForm";
import { getMe, getCategories, getSkills, getLanguages } from "@/lib/api";
import { ProfileTabs, TabKey } from "@/components/profile/ProfileTabs";
import { BillingTab } from "@/components/profile/BillingTab";
import { RequireCompany } from "@/components/companies/RequireCompany";
import { MyCompanyTab } from "@/components/companies/MyCompanyTab";
import { MyVacanciesTab } from "@/components/companies/MyVacanciesTab";
import { MyTeamTab } from "@/components/companies/MyTeamTab";
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
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await getMe();
      if (data) setUser(data);
    } catch {
      // ignore
    }
  }, [isAuthenticated, setUser]);

  // Refresh user whenever screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile])
  );

  // Refresh user when changing tabs (e.g. going to My Company / My Team)
  useEffect(() => {
    fetchUserProfile();
  }, [activeTab, fetchUserProfile]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  }, [fetchUserProfile]);

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

  if (!user || !user.role) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
        <View className="mr-3 flex-1">
          <Text className="text-2xl font-bold tracking-tight text-foreground">My Profile</Text>
        </View>
        <TouchableOpacity
          onPress={logout}
          className="shrink-0 rounded-xl bg-destructive/10 p-2.5"
          accessibilityLabel="Logout"
        >
          <LogOut className="text-destructive" size={22} />
        </TouchableOpacity>
      </View>

      {user && <ProfileTabs user={user} activeTab={activeTab} onChangeTab={setActiveTab} />}

      <ScrollView
        className="flex-1 p-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
        }
      >
        {!user ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" className="text-primary" />
          </View>
        ) : activeTab === "billing" ? (
          <BillingTab user={user} />
        ) : activeTab === "company" || activeTab === "vacancies" || activeTab === "team" ? (
          <RequireCompany user={user}>
            {activeTab === "company" && <MyCompanyTab user={user} />}
            {activeTab === "vacancies" && <MyVacanciesTab user={user} />}
            {activeTab === "team" && <MyTeamTab user={user} />}
          </RequireCompany>
        ) : activeTab === "profile" ? (
          user.role === "EMPLOYER" ? (
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
          ) : null
        ) : (
          <View className="items-center justify-center py-10">
            <Text className="text-muted-foreground">This tab is under construction.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
