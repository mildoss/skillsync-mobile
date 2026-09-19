import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MessageSquare, Bot, Briefcase, Sparkles, ArrowRight } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useAuthStore } from "@/store/useAuthStore";
import { hasSeenOnboarding, setOnboardingSeen } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Real-time Messaging",
    description: "Direct real-time chats between candidates and recruiters with instant read receipts.",
  },
  {
    icon: Bot,
    title: "AI-Powered Matching",
    description: "Calculate job fit percentage, generate tailored cover letters and resume highlights.",
  },
  {
    icon: Briefcase,
    title: "Curated Tech Vacancies",
    description: "Explore hundreds of verified IT job openings from startups to leading enterprises.",
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isHydrated, isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSessionAndOnboarding = async () => {
      if (!isHydrated) return;

      if (isAuthenticated) {
        router.replace("/(tabs)/vacancies");
        return;
      }

      const seen = await hasSeenOnboarding();
      if (seen && isMounted) {
        router.replace("/(tabs)/vacancies");
        return;
      }

      if (isMounted) {
        setIsChecking(false);
      }
    };

    void checkSessionAndOnboarding();

    return () => {
      isMounted = false;
    };
  }, [isHydrated, isAuthenticated, router]);

  const handleGetStarted = async () => {
    await setOnboardingSeen();
    router.replace("/(tabs)/vacancies");
  };

  const handleSignIn = async () => {
    await setOnboardingSeen();
    router.push("/(tabs)/profile");
  };

  if (isChecking || !isHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={isDark ? "#818cf8" : "#4f46e5"} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between px-6 py-2">
        <View className="flex-row items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles size={16} color={isDark ? "#818cf8" : "#4f46e5"} />
          </View>
          <Text className="text-sm font-bold tracking-wider uppercase text-primary">
            Next-Gen Job Board
          </Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 items-center text-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-3xl bg-primary shadow-lg shadow-primary/30">
            <Briefcase size={32} color="#ffffff" />
          </View>

          <Text className="mb-2 text-center text-4xl font-black tracking-tight text-foreground">
            SkillSync
          </Text>
          <Text className="text-center text-base font-medium leading-relaxed text-muted-foreground">
            Find your dream IT job and connect with innovative tech teams in real-time.
          </Text>
        </View>

        <View className="gap-3.5">
          {FEATURES.map((item, index) => {
            const Icon = item.icon;
            return (
              <View
                key={index}
                className="flex-row items-start gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
              >
                <View className="mt-0.5 h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon size={20} color={isDark ? "#818cf8" : "#4f46e5"} />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-base font-bold text-foreground">
                    {item.title}
                  </Text>
                  <Text className="text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="border-t border-border/40 bg-card/80 px-6 pt-4 backdrop-blur-md"
      >
        <Button
          size="lg"
          className="w-full shadow-md shadow-primary/20"
          onPress={handleGetStarted}
        >
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-bold text-primary-foreground">
              Get Started
            </Text>
            <ArrowRight size={18} color="#ffffff" />
          </View>
        </Button>

        <Button
          variant="ghost"
          size="lg"
          className="mt-2 w-full"
          onPress={handleSignIn}
        >
          <Text className="text-sm font-semibold text-muted-foreground">
            Already have an account? <Text className="font-bold text-primary">Sign In</Text>
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
